package tgb.btc.web.service.deal;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.repository.web.ApiDealRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.service.bean.web.ApiDealService;
import tgb.btc.library.util.FiatCurrencyUtil;
import tgb.btc.web.vo.api.TotalSum;
import tgb.btc.web.vo.bean.ApiDealVO;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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


    public List<ApiDealVO> findAll(Long apiUserPid, Integer page, Integer limit, String whereStr, String orderStr,
            Map<String, Object> parameters) {
        String hqlQuery = "from ApiDeal where apiUser.pid=:apiUserPid";
        parameters.put("apiUserPid", apiUserPid);
        hqlQuery = hqlQuery.concat(whereStr);
        if (StringUtils.isBlank(orderStr)) hqlQuery = hqlQuery.concat(" order by pid desc");
        else {
            hqlQuery = hqlQuery.concat(orderStr);
        }
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

    public List<ApiDealVO> findAll(Integer page, Integer limit, String whereStr, String orderStr,
            Map<String, Object> parameters) {
        String hqlQuery = "from ApiDeal where apiDealStatus not like 'CREATED'";
        hqlQuery = hqlQuery.concat(whereStr);
        if (StringUtils.isBlank(orderStr)) hqlQuery = hqlQuery.concat(" order by pid desc");
        else {
            hqlQuery = hqlQuery.concat(orderStr);
        }
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

    public List<Long> findAllPids(String whereStr, String orderStr, Map<String, Object> parameters) {
        String hqlQuery = "select d.pid from ApiDeal d where d.apiDealStatus not like 'CREATED'";
        hqlQuery = hqlQuery.concat(whereStr);
        hqlQuery = hqlQuery.concat(" order by pid desc");
        hqlQuery = hqlQuery.concat(orderStr);
        Query query = entityManager.createQuery(hqlQuery, Long.class);
        parameters.forEach(query::setParameter);
        return query.getResultList();
    }

    public List<Long> findAllPids(Long userPid, String whereStr, String orderStr, Map<String, Object> parameters) {
        String hqlQuery = "select d.pid from ApiDeal d where d.apiUser.pid=:apiUserPid";
        parameters.put("apiUserPid", userPid);
        hqlQuery = hqlQuery.concat(whereStr);
        hqlQuery = hqlQuery.concat(" order by pid desc");
        hqlQuery = hqlQuery.concat(orderStr);
        Query query = entityManager.createQuery(hqlQuery, Long.class);
        parameters.forEach(query::setParameter);
        return query.getResultList();
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

    public Long count(Long apiUserPid, String whereStr, Map<String, Object> parameters) {
        String hqlQuery = "select count(pid) from ApiDeal where apiUser.pid=:apiUserPid";
        parameters.put("apiUserPid", apiUserPid);
        hqlQuery = hqlQuery.concat(whereStr);
        Query query = entityManager.createQuery(hqlQuery);
        parameters.forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }

    public Long count(String whereStr, Map<String, Object> parameters) {
        String hqlQuery = "select count(pid) from ApiDeal where apiDealStatus not like 'CREATED'";
        hqlQuery = hqlQuery.concat(whereStr);
        Query query = entityManager.createQuery(hqlQuery);
        parameters.forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }

    public List<TotalSum> getCalculating(Long currentDealPid, Long userPid) {
        Long lastPaidDealPid = apiUserRepository.getLastPaidDealPidByUserPid(userPid);
        if (Objects.isNull(lastPaidDealPid)) {
            lastPaidDealPid = apiDealRepository.getFirstDealPid(userPid);
        }
        LocalDateTime dateTimeLastPaidDeal = apiDealRepository.getDateTimeByPid(lastPaidDealPid);
        LocalDateTime dateTimeCurrentPaidDeal = apiDealRepository.getDateTimeByPid(currentDealPid);
        List<ApiDeal> apiDeals = apiDealRepository.getByDateBetweenExcludeStart(dateTimeLastPaidDeal, dateTimeCurrentPaidDeal, ApiDealStatus.ACCEPTED);
        return getTotalSums(apiDeals);
    }

    public List<TotalSum> getTotalSums(List<ApiDeal> apiDeals) {
        if (CollectionUtils.isEmpty(apiDeals)) return new ArrayList<>();
        List<TotalSum> totalSums = new ArrayList<>();
        for (DealType dealType: DealType.values()) {
            for (FiatCurrency fiatCurrency : FiatCurrencyUtil.getFiatCurrencies()) {
                for (CryptoCurrency cryptoCurrency : CryptoCurrency.values()) {
                    List<ApiDeal> matchDeals = apiDeals.stream()
                            .filter(deal -> deal.getDealType().equals(dealType)
                                    && (Objects.nonNull(deal.getFiatCurrency()) ? deal.getFiatCurrency()
                                    : deal.getApiUser().getFiatCurrency()).equals(fiatCurrency)
                                    && deal.getCryptoCurrency().equals(cryptoCurrency))
                            .collect(Collectors.toList());
                    if (matchDeals.size() > 0) {
                        totalSums.add(TotalSum.builder()
                                .dealType(dealType.getNominativeFirstLetterToUpper())
                                .fiatCurrency(fiatCurrency.getCode())
                                .cryptoCurrency(cryptoCurrency.getShortName())
                                .totalCryptoSum(matchDeals.stream()
                                        .map(ApiDeal::getCryptoAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add))
                                .totalFiatSum(matchDeals.stream()
                                        .map(ApiDeal::getAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add))
                                .build());
                    }
                }
            }
        }
        return totalSums;
    }
}
