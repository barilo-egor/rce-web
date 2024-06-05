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
import tgb.btc.library.repository.bot.UserRepository;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.service.bean.web.RoleService;
import tgb.btc.library.service.bean.web.WebUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.EmitterVO;
import tgb.btc.web.vo.SuccessResponse;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(ControllerMapping.REGISTRATION)
@Slf4j
public class RegistrationController extends BaseController {

    public static Map<Long, EmitterVO> REGISTER_EMITTER_MAP = new HashMap<>();

    private WebUserService webUserService;

    private RoleService roleService;

    private WebUserRepository webUserRepository;

    private UserRepository userRepository;

    private INotifier notifier;

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Autowired
    public void setRoleService(RoleService roleService) {
        this.roleService = roleService;
    }

    @Autowired
    public void setWebUserService(WebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @PostConstruct
    public void postConstruct() {
        roleService.initRoles();
    }

    @GetMapping(path = "/register", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @ResponseBody
    public SseEmitter register(HttpServletRequest request, String login, Long chatId,
            @RequestParam(required = false) String token) {
        SseEmitter emitter = new SseEmitter(30000L);
        emitter.onCompletion(() ->
                REGISTER_EMITTER_MAP.remove(chatId));
        emitter.onTimeout(() ->
                REGISTER_EMITTER_MAP.remove(chatId));
        emitter.onError((e) -> {
            log.error("Ошибка SSE Emitter подтверждения chatId для регистрации.", e);
            REGISTER_EMITTER_MAP.remove(chatId);
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
        return SuccessResponseUtil.data(webUserRepository.countByUsername(username) == 0,
                data -> JacksonUtil.getEmpty().put("isFree", data));
    }

    @GetMapping("/isChatIdValid")
    @ResponseBody
    public SuccessResponse<?> isChatIdValid(Long chatId) {
        boolean isValid = userRepository.existsByChatId(chatId) && !webUserRepository.existsByChatId(chatId);
        return SuccessResponseUtil.data(isValid,
                data -> JacksonUtil.getEmpty().put("isValid", data));
    }

}
