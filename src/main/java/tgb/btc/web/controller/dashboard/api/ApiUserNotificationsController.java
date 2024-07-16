package tgb.btc.web.controller.dashboard.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;

import java.security.Principal;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequestMapping("/dashboard/api/notifications")
@Slf4j
public class ApiUserNotificationsController {

    public static final Map<Long, SseEmitter> LISTENERS = new ConcurrentHashMap<>();

    private IApiUserService apiUserService;

    @Autowired
    public void setApiUserService(IApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @RequestMapping(path = "/listen", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter listen(Principal principal) {
        SseEmitter sseEmitter = new SseEmitter(-1L);
        Long pid = apiUserService.getPidByUsername(principal.getName());
        sseEmitter.onError(throwable -> LISTENERS.remove(pid));
        sseEmitter.onTimeout(() -> LISTENERS.remove(pid));
        if (Objects.isNull(pid)) return null;
        LISTENERS.put(pid, sseEmitter);
        log.debug("API пользователь {} стал SSE слушателем.", principal.getName());
        return sseEmitter;
    }
}
