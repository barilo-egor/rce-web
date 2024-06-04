package tgb.btc.web.controller.users.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.repository.web.RoleRepository;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.mapper.WebUserMapper;
import tgb.btc.web.service.users.WebWebUsersService;
import tgb.btc.web.util.RequestUtil;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.Objects;

@Controller
@RequestMapping("/users/web/")
@Slf4j
public class WebUsersController {

    private WebUserRepository webUserRepository;

    private RoleRepository roleRepository;

    private WebWebUsersService webWebUsersService;

    @Autowired
    public void setWebWebUsersService(WebWebUsersService webWebUsersService) {
        this.webWebUsersService = webWebUsersService;
    }

    @Autowired
    public void setRoleRepository(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @RequestMapping("/findAll")
    @ResponseBody
    public SuccessResponse<?> findAll(@RequestParam(required = false) String username,
                                      @RequestParam(required = false) RoleConstants role,
                                      @RequestParam(required = false) Long chatId) {
        return SuccessResponseUtil.data(webWebUsersService.findAll(username, role, chatId), WebUserMapper.FIND_ALL);
    }

    @PostMapping("/update")
    @ResponseBody
    public SuccessResponse<?> update(Principal principal, Long pid, @RequestParam(required = false) String username,
                                     @RequestParam(required = false) RoleConstants role,
                                     @RequestParam(required = false) Boolean isBanned,
                                     @RequestParam(required = false) Long chatId) {
        WebUser webUser = webUserRepository.getById(pid);
        if (Objects.nonNull(username)) {
            webUser.setUsername(username);
        }
        if (Objects.nonNull(role)) {
            webUser.getRoles().clear();
            webUser.getRoles().add(roleRepository.getByName(role.name()).stream()
                    .findFirst()
                    .orElseThrow(() -> new BaseException("Роль " + role.name() + " не найдена.")));
        }
        if (Objects.nonNull(isBanned)) {
            webUser.setEnabled(!isBanned);
        }
        if (Objects.nonNull(chatId)) {
            webUser.setChatId(chatId);
        }
        webUserRepository.save(webUser);
        log.debug("Пользователь {} обновил веб пользователя={}", principal.getName(), webUser);
        return SuccessResponseUtil.toast("Пользователь обновлен");
    }

    @GetMapping("/exist")
    @ResponseBody
    public SuccessResponse<?> isExist(HttpServletRequest request, String loginField) {
        boolean isExist;
        try {
            Long chatId = Long.parseLong(loginField);
            isExist = webUserRepository.existsByChatId(chatId);
        } catch (NumberFormatException e) {
            isExist = webUserRepository.existsByUsername(loginField);
        }

        log.debug("Проверка существования пользователя по значению \"{}\", результат={}. IP={}",
                loginField, isExist, RequestUtil.getIp(request));
        return SuccessResponseUtil.data(isExist, data -> JacksonUtil.getEmpty().put("isExist", data));
    }
}
