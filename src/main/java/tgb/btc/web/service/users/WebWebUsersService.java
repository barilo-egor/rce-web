package tgb.btc.web.service.users;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tgb.btc.library.bean.web.Role;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.interfaces.service.bean.web.IRoleService;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.web.interfaces.users.IWebWebUsersService;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.*;

@Service
@Slf4j
public class WebWebUsersService implements IWebWebUsersService {

    public static final String FIND_ALL_QUERY = "select u from WebUser u";

    private EntityManager entityManager;

    private IWebUserService webUserService;

    private IRoleService roleService;

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @Autowired
    public void setRoleService(IRoleService roleService) {
        this.roleService = roleService;
    }

    @Autowired
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<WebUser> findAll(String username, RoleConstants role, Long chatId) {
        Map<String, Object> params = new HashMap<>();
        StringBuilder hqlQuery = new StringBuilder(FIND_ALL_QUERY);
        if (Objects.nonNull(role)) {
            hqlQuery.append(" left join u.roles r");
        }
        long length = hqlQuery.length();
        if (StringUtils.isNotEmpty(username)) {
            hqlQuery.append(" where u.username=:username");
            params.put("username", username);
        }
        if (Objects.nonNull(chatId)) {
            if (length == hqlQuery.length()) hqlQuery.append(" where");
            else hqlQuery.append(" and");
            hqlQuery.append(" u.chatId = :chatId");
            params.put("chatId", chatId);
        }
        if (Objects.nonNull(role)) {
            if (length == hqlQuery.length()) hqlQuery.append(" where");
            else hqlQuery.append(" and");
            hqlQuery.append(" r.name = :role");
            params.put("role", role.name());
        }
        Query query = entityManager.createQuery(hqlQuery.toString(), WebUser.class);
        params.forEach(query::setParameter);
        return query.getResultList();
    }

    @Override
    public boolean hasAccess(RoleConstants roleConstants, String username) {
        List<Role> roles = webUserService.getRolesByUsername(username);
        return RoleConstants.getAvailable(RoleConstants.valueOf(roles.get(0).getName())).contains(roleConstants);
    }

    @Transactional
    @Override
    public WebUser update(Long pid, String username, RoleConstants role, Boolean isBanned, Long chatId) {
        WebUser webUser = webUserService.findById(pid);
        String webUserBeforeUpdate = webUser.toString();
        if (Objects.nonNull(username)) {
            webUser.setUsername(username);
        }
        if (Objects.nonNull(role)) {
            Set<Role> roles = new HashSet<>();
            roles.add(roleService.getByName(role.name()).stream()
                    .findFirst()
                    .orElseThrow(() -> new BaseException("Роль " + role.name() + " не найдена.")));
            webUser.setRoles(roles);
        }
        if (Objects.nonNull(isBanned)) {
            webUser.setEnabled(!isBanned);
        }
        if (Objects.nonNull(chatId)) {
            webUser.setChatId(chatId);
        }
        webUser = webUserService.save(webUser);
        log.debug("Пользователь {} обновлен в {}", webUserBeforeUpdate, webUser);
        return webUser;
    }
}
