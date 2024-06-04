package tgb.btc.web.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tgb.btc.api.bot.WebAPI;
import tgb.btc.library.bean.web.Role;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.config.SessionEventListener;
import tgb.btc.web.controller.login.LoginController;
import tgb.btc.web.vo.EmitterVO;

import javax.servlet.http.HttpSession;
import java.io.IOException;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@Service
@Slf4j
public class WebApi implements WebAPI {

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Override
    public void submitLogin(Long chatId) {
        EmitterVO emitter = LoginController.EMITTER_MAP.get(chatId);
        WebUser webUser = webUserRepository.getByChatId(chatId);
        String[] roles = new String[webUser.getRoles().size()];
        int i = 0;
        for (Role role : webUser.getRoles()) {
            roles[i] = role.getName();
        }
        Authentication auth = new UsernamePasswordAuthenticationToken(webUser, null,
                AuthorityUtils.createAuthorityList(roles)
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        HttpSession session = emitter.getRequest().getSession(true);
        SessionEventListener.HTTP_SESSIONS.put(chatId, session);
        session.setAttribute("chatId", chatId);
        SecurityContext sc = SecurityContextHolder.getContext();
        session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, sc);
        log.debug("Авторизация пользователя chatId={}, username={}.", chatId, webUser.getUsername());
        try {
            emitter.getEmitter().send(JacksonUtil.getEmpty().put("success", true));
            emitter.getEmitter().complete();
        } catch (IOException e) {
            log.error("Ошибка отправки через SSE успешной авторизации " + chatId + ":", e);
            emitter.getEmitter().completeWithError(e);
            LoginController.EMITTER_MAP.remove(chatId);
            log.error("SSE соединение для пользователя {} завершено с ошибкой и удалено.", webUser.getUsername());
        }
    }

    @Override
    public void logout(Long chatId) {
        log.debug("Пользователь с chatId={} запросил закрытие сессии.", chatId);
        SessionEventListener.HTTP_SESSIONS.get(chatId).invalidate();
        log.debug("Сессия пользователя с chatId={} закрыта.", chatId);
    }
}
