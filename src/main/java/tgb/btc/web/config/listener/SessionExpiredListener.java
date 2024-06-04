package tgb.btc.web.config.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.stereotype.Component;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.web.controller.common.NotificationsController;

@Component
@Slf4j
public class SessionExpiredListener implements ApplicationListener<SessionDestroyedEvent> {

    @Override
    public void onApplicationEvent(SessionDestroyedEvent event) {
        for (SecurityContext securityContext : event.getSecurityContexts()) {
            Authentication authentication = securityContext.getAuthentication();
            WebUser user = (WebUser) authentication.getPrincipal();
            NotificationsController.LISTENERS.get(user.getUsername()).complete();
            NotificationsController.LISTENERS.remove(user.getUsername());
            log.debug("Удален SSEEmitter пользователя={} после уничтожения сессии.", user.getUsername());
        }
    }

}
