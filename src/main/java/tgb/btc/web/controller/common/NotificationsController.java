package tgb.btc.web.controller.common;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequestMapping("notifications")
public class NotificationsController {

    public static final Map<String, SseEmitter> LISTENERS = new ConcurrentHashMap<>();

    @RequestMapping(path = "/listen", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter listen(Principal principal) {
        SseEmitter sseEmitter = new SseEmitter(-1L);
        LISTENERS.put(principal.getName(), sseEmitter);
        return sseEmitter;
    }

}
