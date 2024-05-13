package tgb.btc.web.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class SessionEventListener extends HttpSessionEventPublisher {

    public static Map<Long, HttpSession> HTTP_SESSIONS = new HashMap<>();

    @Override
    public void sessionCreated(HttpSessionEvent event) {
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        HTTP_SESSIONS.remove((Long) event.getSession().getAttribute("chatId"));
    }
}
