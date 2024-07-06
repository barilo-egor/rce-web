package tgb.btc.web.controller.dashboard.api;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.constants.enums.properties.PropertiesPath;
import tgb.btc.library.interfaces.JsonConvertable;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.service.bean.web.ApiUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.config.SessionEventListener;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.security.Principal;

@Controller
@RequestMapping("/dashboard/api/util")
@Slf4j
public class ApiDashboardUtilController extends BaseController {

    private ApiUserService apiUserService;

    private ApiUserRepository apiUserRepository;

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Autowired
    public void setApiUserService(ApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @GetMapping("/getBotName")
    @ResponseBody
    public SuccessResponse<?> getBotName() {
        return SuccessResponseUtil.data((JsonConvertable) () ->
                JacksonUtil.getEmpty()
                        .put("value", PropertiesPath.BOT_PROPERTIES.getString("bot.name"))
        );
    }

    @GetMapping("/getBotLink")
    @ResponseBody
    public SuccessResponse<?> getBotLink() {
        return SuccessResponseUtil.data((JsonConvertable) () ->
                JacksonUtil.getEmpty()
                        .put("value", PropertiesPath.BOT_PROPERTIES.getString("bot.link"))
        );
    }

    @GetMapping("/getUsername")
    @ResponseBody
    public SuccessResponse<?> getUsername(Principal principal) {
        return SuccessResponseUtil.data(principal.getName(),
                data -> JacksonUtil.getEmpty().put("username", data));
    }

    @GetMapping("/getToken")
    @ResponseBody
    public SuccessResponse<?> getToken(Principal principal) {
        return SuccessResponseUtil.data(apiUserRepository.getByUsername(principal.getName()).getToken(),
                data -> JacksonUtil.getEmpty().put("token", data));
    }

    @GetMapping("/getSoundEnabled")
    @ResponseBody
    public SuccessResponse<?> getSoundEnabled(Principal principal) {
        return SuccessResponseUtil.data(BooleanUtils.isNotFalse(webUserRepository.getSoundEnabledByUsername(principal.getName())),
                data -> JacksonUtil.getEmpty().put("soundEnabled", data));
    }

    @PostMapping("/tokenGenerate")
    @ResponseBody
    public SuccessResponse<?> tokenGenerate(Principal principal) {
        String newToken = apiUserService.generateToken(principal.getName());
        log.debug("API пользователь {} сгенерировал новый токен.", principal.getName());
        return SuccessResponseUtil.data(newToken,
                data -> JacksonUtil.getEmpty().put("token", data));
    }

    @PostMapping("/updateLogin")
    @ResponseBody
    public SuccessResponse<?> updateLogin(Principal principal, String login) {
        String oldUsername = principal.getName();
        webUserRepository.updateUsername(login, oldUsername);
        log.debug("Пользователь {} сменил username на {}", oldUsername, login);
        Long chatId = webUserRepository.getChatIdByUsername(login);
        SessionEventListener.HTTP_SESSIONS.get(chatId).invalidate();
        SessionEventListener.HTTP_SESSIONS.remove(chatId);
        return new SuccessResponse<>();
    }

    @PostMapping("/updateSoundEnabled")
    @ResponseBody
    public SuccessResponse<?> updateSoundEnabled(Principal principal, Boolean soundEnabled) {
        webUserRepository.updateSoundEnabled(principal.getName(), soundEnabled);
        return SuccessResponseUtil.toast(soundEnabled ? "Звуковые оповещения включены." : "Звуковые оповещения отключены.");
    }
}
