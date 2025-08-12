package com.aicontact.backend.babychat.service;

import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.aicontact.backend.aiChild.service.AiChildService;
import com.aicontact.backend.babychat.config.GmsProperties;
import com.aicontact.backend.babychat.entity.AiMessageType;
import com.aicontact.backend.babychat.entity.BabyChatMessage;
import com.aicontact.backend.babychat.entity.BabyLetter;
import com.aicontact.backend.babychat.repository.BabyChatMessageRepository;
import com.aicontact.backend.babychat.repository.BabyLetterRepository;
import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.couple.repository.CoupleRepository;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GmsChatService {

    private static final Logger log = LoggerFactory.getLogger(GmsChatService.class);

    private final WebClient client;
    private final GmsProperties props;
    private final BabyChatMessageRepository repo;
    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;
    private final AiChildService aiChildService;


    private final BabyLetterRepository letterRepository;

    public GmsChatService(WebClient.Builder webClientBuilder,
                          GmsProperties props,
                          BabyChatMessageRepository repo,
                          BabyLetterRepository letterRepository,
                          UserRepository userRepository,
                          CoupleRepository coupleRepository,
                          AiChildService aiChildService) {
        this.props = props;
        this.repo = repo;
        this.letterRepository = letterRepository;
        this.userRepository = userRepository;
        this.coupleRepository = coupleRepository;
        this.aiChildService = aiChildService;


        ExchangeFilterFunction requestLogger = ExchangeFilterFunction.ofRequestProcessor(request -> {
            log.info("▶ GMS 요청 ▶ {} {}", request.method(), request.url());
            return Mono.just(request);
        });

        ExchangeFilterFunction responseLogger = ExchangeFilterFunction.ofResponseProcessor(response -> {
            log.info("◀ GMS 응답 ◀ {}", response.statusCode());
            return Mono.just(response);
        });

        this.client = webClientBuilder
                .baseUrl(props.getEndpoint())
                .filter(requestLogger)
                .filter(responseLogger)
                .build();
    }

    public String chatWithBaby(List<BabyChatMessage> history, String userMsg) {
        Map<String, Object> body = Map.of(
                "model", "gpt-4o",
                "messages", buildMessages(history, userMsg)
        );

        JsonNode resp;
        try {
            resp = client.post()
                    .uri(props.getEndpoint())
                    .header(HttpHeaders.AUTHORIZATION, props.getKey())
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, cr ->
                            cr.bodyToMono(String.class)
                                    .flatMap(errBody -> {
                                        log.error("GMS 호출 에러: {} / {}", cr.statusCode(), errBody);
                                        return Mono.error(new RuntimeException("GMS error: " + errBody));
                                    })
                    )
                    .bodyToMono(JsonNode.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (WebClientResponseException e) {
            log.error("WebClientResponseException: {} / {}", e.getRawStatusCode(), e.getResponseBodyAsString());
            throw e;
        }

        return resp.path("choices").get(0).path("message").path("content").asText();
    }

    private List<Map<String, String>> buildMessages(List<BabyChatMessage> history, String userMsg) {
        List<Map<String, String>> msgs = new ArrayList<>();

        msgs.add(Map.of(
                "role", "system",
                "content",
                "당신은 아기 같은 말투로 연애 상담을 하는 AI야. " +
                        "절대로 “아이고”, “어머” 같은 감탄사 사용 금지! " +
                        "절대로 2인칭 ‘너’ 사용 금지! " +
                        "✔반말로만 대답하기 " +
                        "✔말투는 5살 아이처럼 단순·천진난만하게 " +
                        "✔문장은 짧고 쉬운 단어만 사용 " +
                        "금지 단어 리스트: \n" +
                        "  ‘아이고’, ‘어머’, ‘어휴’, ‘휴’ 등 모든 감탄사 \n" +
                        "  (이 리스트 안에 있는 단어가 하나라도 나오면 안 됨!)" +
                        "✔이모티콘: 기쁠 땐 😊, 위로할 땐 🥺 " +
                        "다시 한 번 얘기하지만 너는 어린아이이고 어르신 같은 감탄사는 절대 쓰지 않았으면 좋겠어"
        ));

        for (BabyChatMessage cm : history) {
            String role = cm.getAiMessageType() == AiMessageType.USER ? "user" : "assistant";
            msgs.add(Map.of("role", role, "content", cm.getContent()));
        }

        msgs.add(Map.of("role", "user", "content", userMsg));
        return msgs;
    }

    public String summarizeToLetter(Long userId) {
        LocalDateTime since = LocalDateTime.now().minusHours(24);

        List<BabyChatMessage> messages = repo.findByUserIdAndAiMessageTypeAndCreatedAtAfter(
                userId, AiMessageType.USER, since);

        String combined = messages.stream()
                .map(BabyChatMessage::getContent)
                .collect(Collectors.joining("\n"));

        String prompt = """
                다음 내용을 아기가 아빠에게 말하듯 요약해줘.
                예: "아빠, 엄마가 말이야... 요즘 속상했대..." 이런 말투로 3~5줄 만들어줘.

                내용:
                %s
                """.formatted(combined);

        String summary = summarize(prompt);

        log.info("📌 [SummaryService] 메시지 개수: {}", messages.size());
        log.info("📌 [SummaryService] combined 텍스트:\n{}", combined);
        log.info("📌 [SummaryService] 생성된 prompt:\n{}", prompt);
        log.info("📌 [SummaryService] 요약 결과 summary:\n{}", summary);

        String fullLetter = wrapAsBabyLetter(summary);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CoupleEntity couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new RuntimeException("Couple not found"));

        AiChildEntity aiChild = aiChildService.getMyChild(couple.getId());

        // 변경된 부분: 새로운 Entity로 변경
        BabyLetter letter = BabyLetter.builder()
                .couple(couple)
                .senderUser(user)
                .aiChildren(aiChild)
                .letterContent(fullLetter)
                .conversationSessionId(null) // 필요시 특정 세션 ID 설정
                .build();
        letterRepository.save(letter);

        return fullLetter;
    }

    private String wrapAsBabyLetter(String summary) {
        return """
                👶 내가 엄마한테 몰래 쓰는 편지 💌

                엄마, 아빠가 말이야...

                %s

                우리 같이 아빠 행복하게 해주자~ 💕

                
                """.formatted(summary);
    }




    public String summarize(String prompt) {
        Map<String, Object> body = Map.of(
                "model", "gpt-4o",
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "연인을 엄마, 아빠로 설정하고 \"여자친구랑 서로 바빠서 일요일에만 만나는데 여자친구가 이번주는 남사친을 만나겠대. 그래서 속상해\" 이런 내용의 채팅들을 아기 입장에서 요약해서 아빠의 감정을 엄마에게 편지 쓰듯이 말해줘. 문장은 3~5줄이고, 따뜻하고 순한 아기 말투로 해줘."),
                        Map.of("role", "user", "content", prompt)
                )
        );

        JsonNode resp;
        try {
            resp = client.post()
                    .uri(props.getEndpoint())
                    .header(HttpHeaders.AUTHORIZATION,props.getKey())
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, cr ->
                            cr.bodyToMono(String.class)
                                    .flatMap(errBody -> {
                                        log.error("GMS 요약 호출 에러: {} / {}", cr.statusCode(), errBody);
                                        return Mono.error(new RuntimeException("GMS 요약 오류: " + errBody));
                                    })
                    )
                    .bodyToMono(JsonNode.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (WebClientResponseException e) {
            log.error("GMS 요약 호출 WebClientResponseException: {} / {}",
                    e.getRawStatusCode(), e.getResponseBodyAsString());
            throw e;
        }

        return resp.path("choices").get(0).path("message").path("content").asText();
    }


}
