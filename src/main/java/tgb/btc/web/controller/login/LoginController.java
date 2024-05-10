package tgb.btc.web.controller.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.web.controller.BaseController;

@Controller
public class LoginController extends BaseController {

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
