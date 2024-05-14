package tgb.btc.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.repository.web.WebUserRepository;

import java.security.Principal;
import java.util.Objects;
import java.util.function.Function;

@Controller
public class MainController extends BaseController {

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @RequestMapping("/")
    public String home(Principal principal) {
        Function<RoleConstants, Boolean> hasAccess = roleConstants -> webUserRepository.getByUsername(
                principal.getName()).getRoles().stream()
                .anyMatch(role -> role.getName().equals(roleConstants.name()));
        if (Objects.isNull(principal)) return "login";
        else if (hasAccess.apply(RoleConstants.ROLE_ADMIN)) return "dashboard";
        else if (hasAccess.apply(RoleConstants.ROLE_API_CLIENT)) return "apiDashboard";
        else return "empty";
    }
}
