package tgb.btc.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController extends BaseController {

    @RequestMapping("/")
    public String home() {
        return "userMain";
    }
}
