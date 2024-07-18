package tgb.btc.web.service.deal;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.interfaces.service.bean.web.IApiDealService;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;
import tgb.btc.library.interfaces.util.IFiatCurrencyService;
import tgb.btc.web.interfaces.deal.IWebApiDealService;
import tgb.btc.web.vo.api.TotalSum;

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
public class WebApiDealService implements IWebApiDealService {

    private EntityManager entityManager;

    private IApiUserService apiUserService;

    private IApiDealService apiDealService;

    private IFiatCurrencyService fiatCurrencyService;

    @Autowired
    public void setFiatCurrencyService(IFiatCurrencyService fiatCurrencyService) {
        this.fiatCurrencyService = fiatCurrencyService;
    }

    @Autowired
    public void setApiUserService(IApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @Autowired
    public void setApiDealService(IApiDealService apiDealService) {
        this.apiDealService = apiDealService;
    }

    @Autowired
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional
    @Override
    public List<ApiDeal> findAll(Long apiUserPid, Integer page, Integer limit, String whereStr, String orderStr,
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
        return deals;
    }

    @Transactional
    @Override
    public List<ApiDeal> findAll(Integer page, Integer limit, String whereStr, String orderStr,
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
        return deals;
    }

    @Transactional
    @Override
    public List<Long> findAllPids(String whereStr, String orderStr, Map<String, Object> parameters) {
        String hqlQuery = "select d.pid from ApiDeal d where d.apiDealStatus not like 'CREATED'";
        hqlQuery = hqlQuery.concat(whereStr);
        hqlQuery = hqlQuery.concat(" order by pid desc");
        hqlQuery = hqlQuery.concat(orderStr);
        Query query = entityManager.createQuery(hqlQuery, Long.class);
        parameters.forEach(query::setParameter);
        return query.getResultList();
    }

    @Transactional
    @Override
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

    @Transactional
    @Override
    public Long count(Long apiUserPid, String whereStr, Map<String, Object> parameters) {
        String hqlQuery = "select count(pid) from ApiDeal where apiUser.pid=:apiUserPid";
        parameters.put("apiUserPid", apiUserPid);
        hqlQuery = hqlQuery.concat(whereStr);
        Query query = entityManager.createQuery(hqlQuery);
        parameters.forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }

    @Transactional
    @Override
    public Long count(String whereStr, Map<String, Object> parameters) {
        String hqlQuery = "select count(pid) from ApiDeal where apiDealStatus not like 'CREATED'";
        hqlQuery = hqlQuery.concat(whereStr);
        Query query = entityManager.createQuery(hqlQuery);
        parameters.forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }

    @Override
    public List<TotalSum> getCalculating(Long currentDealPid, Long userPid) {
        Long lastPaidDealPid = apiUserService.getLastPaidDealPidByUserPid(userPid);
        if (Objects.isNull(lastPaidDealPid)) {
            lastPaidDealPid = apiDealService.getFirstDealPid(userPid);
        }
        LocalDateTime dateTimeLastPaidDeal = apiDealService.getDateTimeByPid(lastPaidDealPid);
        LocalDateTime dateTimeCurrentPaidDeal = apiDealService.getDateTimeByPid(currentDealPid);
        List<ApiDeal> apiDeals = apiDealService.getByDateBetweenExcludeStart(dateTimeLastPaidDeal, dateTimeCurrentPaidDeal, ApiDealStatus.ACCEPTED);
        return getTotalSums(apiDeals);
    }

    @Override
    public List<TotalSum> getTotalSums(List<ApiDeal> apiDeals) {
        if (CollectionUtils.isEmpty(apiDeals)) return new ArrayList<>();
        List<TotalSum> totalSums = new ArrayList<>();
        for (DealType dealType: DealType.values()) {
            for (FiatCurrency fiatCurrency : fiatCurrencyService.getFiatCurrencies()) {
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
                                        .sumDealsCount(matchDeals.size())
                                .build());
                    }
                }
            }
        }
        return totalSums;
    }
}
