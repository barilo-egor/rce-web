package tgb.btc.web.controller.dashboard.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.library.repository.web.ApiUserRepository;

import java.security.Principal;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequestMapping("/dashboard/api/notifications")
@Slf4j
public class ApiUserNotificationsController {

    public static final Map<Long, SseEmitter> LISTENERS = new ConcurrentHashMap<>();

    private ApiUserRepository apiUserRepository;

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @RequestMapping(path = "/listen", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter listen(Principal principal) {
        SseEmitter sseEmitter = new SseEmitter(-1L);
        Long pid = apiUserRepository.getPidByUsername(principal.getName());
        if (Objects.isNull(pid)) return null;
        LISTENERS.put(pid, sseEmitter);
        log.debug("API пользователь {} стал SSE слушателем.", principal.getName());
        return sseEmitter;
    }
}
