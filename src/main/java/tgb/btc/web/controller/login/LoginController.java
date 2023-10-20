package tgb.btc.web.controller.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.repository.web.WebUserRepository;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class LoginController {

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/loginError")
    @ResponseBody
    public ObjectNode loginError() {
        ObjectNode objectNode = new ObjectMapper().createObjectNode();
        objectNode.put("error", true);
        return objectNode;
    }

    @GetMapping("/loginSuccess")
    @ResponseBody
    public ObjectNode loginSuccess(Principal principal) {
        ObjectNode objectNode = new ObjectMapper().createObjectNode();
        objectNode.put("loginSuccess", true);
        List<RoleConstants> roles = webUserRepository.getRolesByUsername(principal.getName()).stream()
                .map(role -> RoleConstants.valueOf(role.getName()))
                .collect(Collectors.toList());
        if (roles.stream().anyMatch(role -> RoleConstants.ROLE_ADMIN.equals(role) || RoleConstants.ROLE_OPERATOR.equals(role))) {
            objectNode.put("loginUrl", "/web/main");
        } else {
            objectNode.put("loginUrl", "/");
        }
        return objectNode;
    }
}
