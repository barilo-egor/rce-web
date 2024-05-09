package tgb.btc.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;
import java.util.Objects;

@Controller
public class MainController extends BaseController {

    @RequestMapping("/")
    public String home(Principal principal) {
        if (Objects.isNull(principal)) {
            return "login";
        }
        return "main";
    }
}
