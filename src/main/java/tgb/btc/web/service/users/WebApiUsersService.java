package tgb.btc.web.service.users;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.web.RoleConstants;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class WebApiUsersService {

    public static final String FIND_ALL_QUERY = "select u from ApiUser u";

    private EntityManager entityManager;

    @Autowired
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<ApiUser> findAll(String username, RoleConstants role, Long chatId) {
        Map<String, Object> params = new HashMap<>();
        StringBuilder hqlQuery = new StringBuilder(FIND_ALL_QUERY);
//        if (Objects.nonNull(role)) {
//            hqlQuery.append(" left join u.roles r");
//        }
//        long length = hqlQuery.length();
//        if (StringUtils.isNotEmpty(username)) {
//            hqlQuery.append(" where u.username=:username");
//            params.put("username", username);
//        }
//        if (Objects.nonNull(chatId)) {
//            if (length == hqlQuery.length()) hqlQuery.append(" where");
//            else hqlQuery.append(" and");
//            hqlQuery.append(" u.chatId = :chatId");
//            params.put("chatId", chatId);
//        }
//        if (Objects.nonNull(role)) {
//            if (length == hqlQuery.length()) hqlQuery.append(" where");
//            else hqlQuery.append(" and");
//            hqlQuery.append(" r.name = :role");
//            params.put("role", role.name());
//        }
        Query query = entityManager.createQuery(hqlQuery.toString(), ApiUser.class);
        params.forEach(query::setParameter);
        return query.getResultList();
    }
}
