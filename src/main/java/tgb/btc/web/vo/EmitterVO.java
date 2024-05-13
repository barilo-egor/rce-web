package tgb.btc.web.vo;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.http.HttpServletRequest;

@Data
@Builder
public class EmitterVO {
    private SseEmitter emitter;

    private HttpServletRequest request;
}
