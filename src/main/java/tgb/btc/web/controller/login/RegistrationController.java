package tgb.btc.web.controller.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.repository.bot.UserRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.repository.web.RoleRepository;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.service.bean.web.RoleService;
import tgb.btc.library.service.bean.web.WebUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.form.RegisterWebUserForm;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.Set;

@Controller
@RequestMapping(ControllerMapping.REGISTRATION)
@Slf4j
public class RegistrationController extends BaseController {

    private WebUserService webUserService;

    private RoleService roleService;

    private RoleRepository roleRepository;

    private ApiUserRepository apiUserRepository;

    private WebUserRepository webUserRepository;

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Autowired
    public void setRoleRepository(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
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
    public void postConstruct(){
        roleService.initRoles();
    }

    @PostMapping("/register")
    @ResponseBody
    public SuccessResponse<?> register(String login, Long chatId, @RequestParam(required = false) String token) {
        WebUser webUser = new WebUser();
        webUser.setChatId(chatId);
        webUser.setUsername(login);
        webUser.setPassword(RandomStringUtils.randomAlphanumeric(10));
        webUser.setEnabled(true);
        RoleConstants roleConstants;
        if (StringUtils.isNotEmpty(token) && apiUserRepository.countByToken(token) == 1) {
            roleConstants = RoleConstants.ROLE_API_CLIENT;
        } else {
            roleConstants = RoleConstants.ROLE_USER;
        }
        webUser.setRoles(roleRepository.getByName(roleConstants.name()));
        webUserService.save(webUser);
        return SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty().put("registered", true));
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
