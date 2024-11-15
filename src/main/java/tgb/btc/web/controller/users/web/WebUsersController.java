package tgb.btc.web.controller.users.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.interfaces.map.IWebUserMappingService;
import tgb.btc.web.interfaces.users.IWebWebUsersService;
import tgb.btc.web.util.RequestUtil;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import jakarta.servlet.http.HttpServletRequest;
import java.security.Principal;

@Controller
@RequestMapping("/users/web/")
@Slf4j
public class WebUsersController {

    private IWebUserService webUserService;

    private IWebWebUsersService webWebUsersService;

    private IWebUserMappingService webUserMappingService;

    @Autowired
    public void setWebUserMappingService(IWebUserMappingService webUserMappingService) {
        this.webUserMappingService = webUserMappingService;
    }

    @Autowired
    public void setWebWebUsersService(IWebWebUsersService webWebUsersService) {
        this.webWebUsersService = webWebUsersService;
    }

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @RequestMapping("/findAll")
    @ResponseBody
    public SuccessResponse<?> findAll(@RequestParam(required = false) String username,
                                      @RequestParam(required = false) RoleConstants role,
                                      @RequestParam(required = false) Long chatId) {
        return SuccessResponseUtil.arrayData(webWebUsersService.findAll(username, role, chatId), webUser -> webUserMappingService.map(webUser));
    }

    @PostMapping("/update")
    @ResponseBody
    public SuccessResponse<?> update(Principal principal, Long pid, @RequestParam(required = false) String username,
                                     @RequestParam(required = false) RoleConstants role,
                                     @RequestParam(required = false) Boolean isBanned,
                                     @RequestParam(required = false) Long chatId) {
        log.debug("Пользователь {} обновляет пользователя pid={}", principal.getName(), pid);
        webWebUsersService.update(pid, username, role, isBanned, chatId);
        return SuccessResponseUtil.toast("Пользователь обновлен");
    }

    @GetMapping("/exist")
    @ResponseBody
    public SuccessResponse<?> isExist(HttpServletRequest request, String loginField) {
        boolean isExist;
        try {
            Long chatId = Long.parseLong(loginField);
            isExist = webUserService.existsByChatId(chatId);
        } catch (NumberFormatException e) {
            isExist = webUserService.existsByUsername(loginField);
        }

        log.debug("Проверка существования пользователя по значению \"{}\", результат={}. IP={}",
                loginField, isExist, RequestUtil.getIp(request));
        return SuccessResponseUtil.data(isExist, data -> JacksonUtil.getEmpty().put("isExist", data));
    }

    @GetMapping("/hasAccess")
    @ResponseBody
    public SuccessResponse<?> hasAccess(RoleConstants role, Principal principal) {
        return SuccessResponseUtil.data(webWebUsersService.hasAccess(role, principal.getName()),
                data -> JacksonUtil.getEmpty().put("hasAccess", data));
    }
}
