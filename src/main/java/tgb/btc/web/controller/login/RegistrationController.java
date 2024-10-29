package tgb.btc.web.controller.login;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.interfaces.service.bean.bot.user.IReadUserService;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.EmitterVO;
import tgb.btc.web.vo.SuccessResponse;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(ControllerMapping.REGISTRATION)
@Slf4j
public class RegistrationController extends BaseController {

    public static Map<Long, EmitterVO> REGISTER_EMITTER_MAP = new HashMap<>();

    private IWebUserService webUserService;

    private IReadUserService readUserService;

    private INotifier notifier;

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @Autowired
    public void setReadUserService(IReadUserService readUserService) {
        this.readUserService = readUserService;
    }

    @GetMapping(path = "/register", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @ResponseBody
    public SseEmitter register(HttpServletRequest request, String login, Long chatId,
            @RequestParam(required = false) String token) {
        SseEmitter emitter = new SseEmitter(30000L);
        emitter.onCompletion(() ->
                REGISTER_EMITTER_MAP.remove(chatId));
        emitter.onTimeout(() -> {
            REGISTER_EMITTER_MAP.remove(chatId);
            emitter.complete();
        });
        emitter.onError(e -> {
            log.error("Ошибка SSE Emitter подтверждения chatId для регистрации.", e);
            REGISTER_EMITTER_MAP.remove(chatId);
            emitter.completeWithError(e);
        });
        REGISTER_EMITTER_MAP.put(chatId, EmitterVO.builder()
                .emitter(emitter)
                .request(request)
                .registrationData(EmitterVO.RegistrationData.builder()
                        .username(login)
                        .chatId(chatId)
                        .token(token)
                        .build())
                .build());
        notifier.sendChatIdConfirmRequest(chatId);
        return emitter;
    }

    @GetMapping("/isUsernameFree")
    @ResponseBody
    public SuccessResponse<?> isUsernameFree(String username) {
        return SuccessResponseUtil.data(webUserService.countByUsername(username) == 0,
                data -> JacksonUtil.getEmpty().put("isFree", data));
    }

    @GetMapping("/isChatIdValid")
    @ResponseBody
    public SuccessResponse<?> isChatIdValid(Long chatId) {
        boolean isValid = readUserService.existsByChatId(chatId) && !webUserService.existsByChatId(chatId);
        return SuccessResponseUtil.data(isValid,
                data -> JacksonUtil.getEmpty().put("isValid", data));
    }

}
