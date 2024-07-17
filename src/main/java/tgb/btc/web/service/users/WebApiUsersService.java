package tgb.btc.web.service.users;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.web.interfaces.users.IWebApiUsersService;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class WebApiUsersService implements IWebApiUsersService {

    public static final String FIND_ALL_QUERY = "select u from ApiUser u";

    private EntityManager entityManager;

    @Autowired
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<ApiUser> findAll(String id, FiatCurrency fiatCurrency, String token, String buyRequisite, String sellRequisite) {
        Map<String, Object> params = new HashMap<>();
        StringBuilder hqlQuery = new StringBuilder(FIND_ALL_QUERY);
        if (StringUtils.isNotBlank(id)) {
            appendCriterion(hqlQuery);
            hqlQuery.append(" id=:id");
            params.put("id", id);
        }
        if (Objects.nonNull(fiatCurrency)) {
            appendCriterion(hqlQuery);
            hqlQuery.append(" fiatCurrency=:fiatCurrency");
            params.put("fiatCurrency", fiatCurrency);
        }
        if (StringUtils.isNotBlank(token)) {
            appendCriterion(hqlQuery);
            hqlQuery.append(" token=:token");
            params.put("token", token);
        }
        if (StringUtils.isNotBlank(buyRequisite)) {
            appendCriterion(hqlQuery);
            hqlQuery.append(" buyRequisite=:buyRequisite");
            params.put("buyRequisite", buyRequisite);
        }
        if (StringUtils.isNotBlank(sellRequisite)) {
            appendCriterion(hqlQuery);
            hqlQuery.append(" sellRequisite=:sellRequisite");
            params.put("sellRequisite", sellRequisite);
        }
        Query query = entityManager.createQuery(hqlQuery.toString(), ApiUser.class);
        params.forEach(query::setParameter);
        return query.getResultList();
    }

    private void appendCriterion(StringBuilder hql) {
        if (hql.length() == FIND_ALL_QUERY.length()) hql.append(" where");
        else hql.append(" and");
    }
}
