package tgb.btc.web.controller.users.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.web.constant.enums.mapper.WebUserMapper;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

@Controller
@RequestMapping("/users/web/")
public class WebUsersController {

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @RequestMapping("/findAll")
    @ResponseBody
    public SuccessResponse<?> findAll() {
        return SuccessResponseUtil.data(webUserRepository.findAll(), WebUserMapper.FIND_ALL);
    }

    @PostMapping("/updateUsername")
    @ResponseBody
    public SuccessResponse<?> updateLogin(Long pid, String username) {
        webUserRepository.updateUsernameByPid(pid, username);
        return SuccessResponseUtil.toast("Логин обновлен.");
    }
}
