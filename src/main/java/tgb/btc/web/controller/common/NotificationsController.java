package tgb.btc.web.controller.common;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("notifications")
public class NotificationsController {

    public static final List<SseEmitter> LISTENERS = new ArrayList<>();

    @RequestMapping(path = "/listen", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter listen() {
        SseEmitter sseEmitter = new SseEmitter(-1L);
        synchronized (LISTENERS) {
            LISTENERS.add(sseEmitter);
        }
        return sseEmitter;
    }

}
