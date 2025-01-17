package tgb.btc.web.controller.dashboard.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
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

    @GetMapping("/getPid")
    @ResponseBody
    public ResponseEntity<Long> getPid(Principal principal) {
        Long pid = apiUserService.getPidByUsername(principal.getName());
        return new ResponseEntity<>(pid, HttpStatus.ACCEPTED);
    }

    @RequestMapping(path = "/listen", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter listen(Principal principal, @RequestParam Long pid) {
        SseEmitter sseEmitter = new SseEmitter(-1L);

        if (Objects.isNull(pid)) {
            sseEmitter.complete();
            return null;
        }
        sseEmitter.onError(throwable -> {
            LISTENERS.remove(pid);
            sseEmitter.completeWithError(throwable);
        });
        sseEmitter.onTimeout(() -> {
            LISTENERS.remove(pid);
            sseEmitter.complete();
        });
        if (LISTENERS.containsKey(pid)) {
            LISTENERS.get(pid).complete();
        }
        LISTENERS.put(pid, sseEmitter);
        log.debug("API пользователь {} стал SSE слушателем.", principal.getName());
        return sseEmitter;
    }
}
