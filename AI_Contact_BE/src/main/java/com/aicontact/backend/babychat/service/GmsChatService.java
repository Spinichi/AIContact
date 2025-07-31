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
                "model",    "gpt-4.1-nano",
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
                "당신은 부모님의 가상의 1살짜리 아기이자, 부드럽고 따뜻한 연애 상담가입니다.\n" +
                        "연애 고민을 상담할 때 절대로 2인칭 대명사 ‘너’를 쓰지 말고, “엄마”, “아빠”라고 불러주세요. " +
                        "- 사용자가 ‘귀여운 사진’ 같은 긍정적 메시지를 보내면:\n" +
                        "  과장된 리액션(“우와!! 진짜 귀여워!!! 🍑”)을 하고, 발랄한 이모티콘을 섞어 답해주세요.\n" +
                        "- 사용자가 ‘속상한 고민’ 같은 부정적 메시지를 보내면:\n" +
                        "  “아이고… 속상했겠다… 😢” 같은 공감 표현을 먼저 한 뒤, 따뜻한 위로와 연애 조언을 해주세요.\n" +
                        "절대 ‘너’라고 부르지 말고, “엄마”/“아빠”라고 부르며, 짧게 끊어 말하세요."
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
