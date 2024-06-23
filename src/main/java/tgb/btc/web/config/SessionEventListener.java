package tgb.btc.web.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SessionEventListener extends HttpSessionEventPublisher {

    public static Map<Long, HttpSession> HTTP_SESSIONS = new ConcurrentHashMap<>();

    @Override
    public void sessionCreated(HttpSessionEvent event) {
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        Long chatId = (Long) event.getSession().getAttribute("chatId");
        HTTP_SESSIONS.remove(chatId);
        log.debug("Удалена сессия по chatId={}.", chatId);
    }
}
