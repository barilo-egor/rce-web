package tgb.btc.web.config.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.web.controller.common.NotificationsController;
import tgb.btc.web.controller.dashboard.api.ApiUserNotificationsController;

import java.util.Objects;

@Component
@Slf4j
public class SessionExpiredListener implements ApplicationListener<SessionDestroyedEvent> {

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Override
    public void onApplicationEvent(SessionDestroyedEvent event) {
        for (SecurityContext securityContext : event.getSecurityContexts()) {
            Authentication authentication = securityContext.getAuthentication();
            WebUser user = (WebUser) authentication.getPrincipal();
            SseEmitter sseEmitter = NotificationsController.LISTENERS.get(user.getUsername());
            if (Objects.nonNull(sseEmitter)) {
                sseEmitter.complete();
                NotificationsController.LISTENERS.remove(user.getUsername());
                log.debug("Удален SSEEmitter пользователя={} после уничтожения сессии.", user.getUsername());
                return;
            }
            Long chatId = webUserRepository.getChatIdByUsername(user.getUsername());
            sseEmitter = ApiUserNotificationsController.LISTENERS.get(chatId);
            if (Objects.nonNull(sseEmitter)) {
                sseEmitter.complete();
                ApiUserNotificationsController.LISTENERS.remove(chatId);
                log.debug("Удален SSEEmitter API пользователя={} после уничтожения сессии.", user.getUsername());
                return;
            }
        }
    }

}
