package tgb.btc.web.interfaces.users;

import org.springframework.transaction.annotation.Transactional;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.constants.enums.web.RoleConstants;

import java.util.List;

public interface IWebWebUsersService {

    List<WebUser> findAll(String username, RoleConstants role, Long chatId);

    boolean hasAccess(RoleConstants roleConstants, String username);

    @Transactional
    WebUser update(Long pid, String username, RoleConstants role, Boolean isBanned, Long chatId);

}
