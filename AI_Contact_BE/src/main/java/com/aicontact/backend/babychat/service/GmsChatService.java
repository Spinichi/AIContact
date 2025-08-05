package com.aicontact.backend.babychat.service;

import com.aicontact.backend.babychat.config.GmsProperties;
import com.aicontact.backend.babychat.entity.AiMessageType;
import com.aicontact.backend.babychat.entity.BabyChatMessage;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GmsChatService {

    private static final Logger log = LoggerFactory.getLogger(GmsChatService.class);

    private final WebClient client;
    private final GmsProperties props;

    public GmsChatService(WebClient.Builder webClientBuilder,
                          GmsProperties props) {
        this.props = props;


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


    public String chatWithBaby(List<BabyChatMessage> history,
                               String userMsg) {
        Map<String,Object> body = Map.of(
                "model",    "gpt-4o",
                "messages", buildMessages(history, userMsg)
        );

        JsonNode resp;
        try {
            resp = client.post()
                    .uri("/v1/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + props.getKey())
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
            log.error("WebClientResponseException: {} / {}",
                    e.getRawStatusCode(), e.getResponseBodyAsString());
            throw e;
        }

        return resp.path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText();
    }

   
    private List<Map<String,String>> buildMessages(List<BabyChatMessage> history,
                                                   String userMsg) {
        List<Map<String,String>> msgs = new ArrayList<>();

        msgs.add(Map.of(
                "role",    "system",
                "content",
                "당신은 아기 같은 말투로 연애 상담을 하는 AI야.  " +
                        "절대로 “아이고”, “어머” 같은 감탄사 사용 금지!  " +
                        "절대로 2인칭 ‘너’ 사용 금지!  " +
                        "✔반말로만 대답하기  " +
                        "✔말투는 5살 아이처럼 단순·천진난만하게  " +
                        "✔문장은 짧고 쉬운 단어만 사용  " +
                        "금지 단어 리스트:  \n" +
                        "  ‘아이고’, ‘어머’, ‘어휴’, ‘휴’ 등 모든 감탄사  \n" +
                        "  (이 리스트 안에 있는 단어가 하나라도 나오면 안 됨!)"+
                        "✔이모티콘: 기쁠 땐 \uD83D\uDE0A, 위로할 땐 \uD83E\uDD7A  "+
                        "다시 한 번 얘기하지만 너는 어린아이이고 어르신 같은 감탄사는 절대 쓰지 않았으면 좋겠어"

        ));

        for (BabyChatMessage cm : history) {
            String role = cm.getAiMessageType() == AiMessageType.USER ? "user" : "assistant";
            msgs.add(Map.of(
                    "role", role,
                    "content", cm.getContent()
            ));
        }

        msgs.add(Map.of("role","user","content",userMsg));
        return msgs;
    }
}
