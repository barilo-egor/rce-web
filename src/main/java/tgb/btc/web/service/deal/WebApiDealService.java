package tgb.btc.web.service.deal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.repository.web.ApiDealRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.service.bean.web.ApiDealService;
import tgb.btc.web.vo.bean.ApiDealVO;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WebApiDealService {

    private EntityManager entityManager;

    private ApiDealService apiDealService;

    private ApiUserRepository apiUserRepository;

    private ApiDealRepository apiDealRepository;

    @Autowired
    public void setApiDealRepository(ApiDealRepository apiDealRepository) {
        this.apiDealRepository = apiDealRepository;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Autowired
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Autowired
    public void setApiDealService(ApiDealService apiDealService) {
        this.apiDealService = apiDealService;
    }

    public List<ApiDealVO> findAll(Integer page, Integer limit, String whereStr, String orderStr,
            Map<String, Object> parameters) {
        String hqlQuery = "from ApiDeal where apiDealStatus not like 'CREATED'";
        hqlQuery = hqlQuery.concat(whereStr);
        hqlQuery = hqlQuery.concat(" order by pid desc");
        hqlQuery = hqlQuery.concat(orderStr);
        Query query = entityManager.createQuery(hqlQuery, ApiDeal.class);
        query.setFirstResult((page - 1) * limit);
        query.setMaxResults(limit);
        parameters.forEach(query::setParameter);
        List<ApiDeal> deals = query.getResultList();
        return deals
                .stream()
                .map(this::fromDeal)
                .collect(Collectors.toList());
    }

    private ApiDealVO fromDeal(ApiDeal deal) {
        long dealsCounts = apiDealRepository.countByApiDealStatusAndApiUser_Pid(ApiDealStatus.ACCEPTED, deal.getApiUser().getPid());
        return ApiDealVO.builder()
                .pid(deal.getPid())
                .dealStatus(deal.getApiDealStatus())
                .dealType(deal.getDealType())
                .cryptoCurrency(deal.getCryptoCurrency())
                .cryptoAmount(deal.getCryptoAmount())
                .fiatCurrency(deal.getFiatCurrency())
                .amount(deal.getAmount())
                .dateTime(deal.getDateTime())
                .requisite(deal.getRequisite())
                .apiUser(deal.getApiUser())
                .dealsCount(dealsCounts)
                .build();
    }

    public Long count(String whereStr, Map<String, Object> parameters) {
        String hqlQuery = "select count(pid) from ApiDeal where apiDealStatus not like 'CREATED'";
        hqlQuery = hqlQuery.concat(whereStr);
        Query query = entityManager.createQuery(hqlQuery);
        parameters.forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }
}
