package tgb.btc.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.web.constant.ControllerMapping;

@Controller
@RequestMapping(ControllerMapping.TICKET)
public class TicketController {

    @GetMapping("init")
    public String init() {
        return "user/form/TicketForm";
    }
}
