package tgb.btc.web.controller.dashboard.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.constants.enums.properties.PropertiesPath;
import tgb.btc.library.interfaces.JsonConvertable;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.security.Principal;

@Controller
@RequestMapping("/dashboard/api/util")
public class ApiDashboardUtilController extends BaseController {

    @GetMapping("/getBotName")
    @ResponseBody
    public SuccessResponse<?> getBotName() {
        return SuccessResponseUtil.data((JsonConvertable) () ->
                JacksonUtil.getEmpty()
                        .put("value", PropertiesPath.BOT_PROPERTIES.getString("bot.name"))
        );
    }

    @GetMapping("/getUsername")
    @ResponseBody
    public SuccessResponse<?> getUsername(Principal principal) {
        return SuccessResponseUtil.data(principal.getName(),
                data -> JacksonUtil.getEmpty().put("username", data));
    }
}
