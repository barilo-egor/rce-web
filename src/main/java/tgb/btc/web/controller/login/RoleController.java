package tgb.btc.web.controller.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.security.Principal;

@RestController
@RequestMapping(ControllerMapping.ROLES)
public class RoleController extends BaseController {

    private IWebUserService webUserService;

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @GetMapping("/get")
    private SuccessResponse<?> getRole(Principal principal) {
        return SuccessResponseUtil.data(webUserService.getByUsername(principal.getName()).getRoles());
    }

}
