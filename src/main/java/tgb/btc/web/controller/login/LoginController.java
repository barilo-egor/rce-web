package tgb.btc.web.controller.login;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.util.SystemUtil;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.impl.WebApi;
import tgb.btc.web.util.RequestUtil;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.EmitterVO;
import tgb.btc.web.vo.SuccessResponse;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
@Slf4j
public class LoginController extends BaseController {

    private WebUserRepository webUserRepository;

    private INotifier notifier;

    private WebApi webApi;

    public static Map<Long, EmitterVO> LOGIN_EMITTER_MAP = new HashMap<>();

    @Autowired
    public void setWebApi(WebApi webApi) {
        this.webApi = webApi;
    }

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

    @GetMapping(path = "/registerLogin", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter registerLogin(HttpServletRequest request, String loginField) {
        Long chatId;
        WebUser webUser;
        try {
            chatId = Long.parseLong(loginField);
            webUser = webUserRepository.getByChatId(chatId);
        } catch (NumberFormatException e) {
            webUser = webUserRepository.getByUsername(loginField);
            chatId = webUser.getChatId();
        }
        if (BooleanUtils.isFalse(webUser.getEnabled())) {
            return null;
        }
        SseEmitter emitter = new SseEmitter(60000L);
        Long finalChatId = chatId;
        emitter.onCompletion(() ->
                LOGIN_EMITTER_MAP.remove(finalChatId));
        emitter.onTimeout(() ->
                LOGIN_EMITTER_MAP.remove(finalChatId));
        emitter.onError((e) -> {
            log.error("Ошибка SSE Emitter авторизации.", e);
            LOGIN_EMITTER_MAP.remove(finalChatId);
        });
        LOGIN_EMITTER_MAP.put(chatId, EmitterVO.builder().emitter(emitter).request(request).build());
        notifier.sendLoginRequest(chatId);
        log.debug("Попытка входа по значению={}, chatId={}, IP={}", loginField, chatId, RequestUtil.getIp(request));
        return emitter;
    }

    @PostMapping("/loginInstant")
    @ResponseBody
    public SuccessResponse<?> loginInstant(HttpServletRequest request, String login) {
        if (!SystemUtil.isDev()) return null;
        WebUser webUser = webUserRepository.getByUsername(login);
        webApi.authorize(webUser, request);
        return SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty().put("success", true));
    }
}
