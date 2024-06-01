package tgb.btc.web.controller.users.web;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.repository.web.RoleRepository;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.web.constant.enums.mapper.WebUserMapper;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.util.Objects;

@Controller
@RequestMapping("/users/web/")
public class WebUsersController {

    private WebUserRepository webUserRepository;

    private RoleRepository roleRepository;

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
    public SuccessResponse<?> findAll() {
        return SuccessResponseUtil.data(webUserRepository.findAll(), WebUserMapper.FIND_ALL);
    }

    @PostMapping("/update")
    @ResponseBody
    public SuccessResponse<?> update(Long pid, @RequestParam(required = false) String username,
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
        return SuccessResponseUtil.toast("Пользователь обновлен");
    }
}
