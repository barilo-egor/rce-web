package tgb.btc.web.service.users;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.interfaces.process.IApiUserProcessService;
import tgb.btc.web.interfaces.users.IWebApiUsersService;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Slf4j
public class WebApiUsersService implements IWebApiUsersService {

    public static final String FIND_ALL_QUERY = "select u from ApiUser u";

    private final EntityManager entityManager;

    private final IApiUserProcessService apiUserProcessService;

    private final IObjectNodeService objectNodeService;

    private final IApiUserService apiUserService;

    @Autowired
    public WebApiUsersService(EntityManager entityManager, IApiUserProcessService apiUserProcessService,
            IObjectNodeService objectNodeService, IApiUserService apiUserService) {
        this.entityManager = entityManager;
        this.apiUserProcessService = apiUserProcessService;
        this.objectNodeService = objectNodeService;
        this.apiUserService = apiUserService;
    }

    @Override
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

    @Override
    public List<ObjectNode> getIdByPaymentTypePid(Boolean isAdding, Long paymentTypePid) {
        return objectNodeService.toObjects("id", apiUserProcessService.getIdByPaymentTypePid(isAdding, paymentTypePid));
    }

    @Override
    public ResponseEntity<ObjectNode> addPaymentType(Long paymentTypePid, String apiUserId) {
        try {
            apiUserService.addPaymentType(apiUserId, paymentTypePid);
        } catch (BaseException e) {
            log.error("Ошибка при добавлении апи типа оплаты пользователю. paymentTypePid={}, apiUserId={}",
                    paymentTypePid, apiUserId);
            log.error("", e);
            return new ResponseEntity<>(objectNodeService.message(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<ObjectNode> deletePaymentType(Long paymentTypePid, String apiUserId) {
        try {
            apiUserService.deletePaymentType(apiUserId, paymentTypePid);
        } catch (BaseException e) {
            log.error("Ошибка при удалении апи типа оплаты пользователю. paymentTypePid={}, apiUserId={}",
                    paymentTypePid, apiUserId);
            log.error("", e);
            return new ResponseEntity<>(objectNodeService.message(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
