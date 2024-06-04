package tgb.btc.web.controller.login;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.bean.web.Role;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.EmitterVO;
import tgb.btc.web.vo.SuccessResponse;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@Controller
@Slf4j
public class LoginController extends BaseController {

    private WebUserRepository webUserRepository;

    private INotifier notifier;

    public static Map<Long, EmitterVO> EMITTER_MAP = new HashMap<>();

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping(path = "/registerLogin", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter registerLogin(HttpServletRequest request, String loginField) {
        Long chatId;
        try {
            chatId = Long.parseLong(loginField);
        } catch (NumberFormatException e) {
            chatId = webUserRepository.getByUsername(loginField).getChatId();
        }
        SseEmitter emitter = new SseEmitter(30000L);
        Long finalChatId = chatId;
        emitter.onCompletion(() ->
                EMITTER_MAP.remove(finalChatId));
        emitter.onTimeout(() ->
                EMITTER_MAP.remove(finalChatId));
        EMITTER_MAP.put(chatId, EmitterVO.builder().emitter(emitter).request(request).build());
        notifier.sendLoginRequest(chatId);
        return emitter;
    }

    @PostMapping("/loginInstant")
    @ResponseBody
    public SuccessResponse<?> loginInstant(HttpServletRequest request) {
        WebUser webUser = webUserRepository.getByUsername("barilo");
        String[] roles = new String[webUser.getRoles().size()];
        int i = 0;
        for (Role role : webUser.getRoles()) {
            roles[i] = role.getName();
        }
        Authentication auth = new UsernamePasswordAuthenticationToken(webUser, null,
                AuthorityUtils.createAuthorityList(roles)
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        SecurityContext sc = SecurityContextHolder.getContext();
        request.getSession().setAttribute(SPRING_SECURITY_CONTEXT_KEY, sc);
        return SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty().put("success", true));
    }
}
