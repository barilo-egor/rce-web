package tgb.btc.web.service.deal;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.constants.enums.CreateType;
import tgb.btc.library.constants.enums.bot.*;
import tgb.btc.library.interfaces.service.bean.bot.IUserDiscountService;
import tgb.btc.library.interfaces.service.bean.bot.deal.IModifyDealService;
import tgb.btc.library.interfaces.service.bean.bot.deal.IReadDealService;
import tgb.btc.library.interfaces.service.bean.bot.deal.read.IDealCountService;
import tgb.btc.library.interfaces.service.bean.bot.deal.read.IDealUserService;
import tgb.btc.library.interfaces.service.bean.bot.deal.read.IReportDealService;
import tgb.btc.library.interfaces.service.bean.bot.user.IReadUserService;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.interfaces.deal.IWebDealService;
import tgb.btc.web.service.NotificationsAPI;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class WebDealService implements IWebDealService {

    private IReadDealService readDealService;

    private IDealCountService dealCountService;

    private IDealUserService dealUserService;

    private IModifyDealService modifyDealService;

    private IReadUserService readUserService;

    private IUserDiscountService userDiscountService;

    private IWebUserService webUserService;

    private IReportDealService reportDealService;

    private EntityManager entityManager;

    private NotificationsAPI notificationsAPI;

    @Autowired
    public void setReportDealService(IReportDealService reportDealService) {
        this.reportDealService = reportDealService;
    }

    @Autowired
    public void setReadDealService(IReadDealService readDealService) {
        this.readDealService = readDealService;
    }

    @Autowired
    public void setDealCountService(IDealCountService dealCountService) {
        this.dealCountService = dealCountService;
    }

    @Autowired
    public void setDealUserService(IDealUserService dealUserService) {
        this.dealUserService = dealUserService;
    }

    @Autowired
    public void setModifyDealService(IModifyDealService modifyDealService) {
        this.modifyDealService = modifyDealService;
    }

    @Autowired
    public void setReadUserService(IReadUserService readUserService) {
        this.readUserService = readUserService;
    }

    @Autowired
    public void setUserDiscountService(IUserDiscountService userDiscountService) {
        this.userDiscountService = userDiscountService;
    }

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @Autowired
    public void setNotificationsAPI(NotificationsAPI notificationsAPI) {
        this.notificationsAPI = notificationsAPI;
    }

    @Autowired
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional
    @Override
    public List<Deal> findAll(Integer page, Integer limit, Integer start, String whereStr, String orderStr,
            Map<String, Object> parameters) {
        String hqlQuery = "from Deal d where d.dealStatus not like 'NEW'";
        hqlQuery = hqlQuery.concat(whereStr);
        if (StringUtils.isBlank(orderStr)) hqlQuery = hqlQuery.concat(" order by pid desc");
        else {
            hqlQuery = hqlQuery.concat(orderStr);
        }
        Query query = entityManager.createQuery(hqlQuery, Deal.class);
        query.setFirstResult((page - 1) * limit);
        query.setMaxResults(limit);
        parameters.forEach(query::setParameter);
        List<Deal> deals = query.getResultList();
        // entityManager.createQuery("from Deal d where d.dealStatus not like 'NEW' order by d.dateTime DESC", Deal.class).setMaxResults(20).setFirstResult(0).getResultList()
        return deals;
    }

    @Transactional
    @Override
    public List<Long> findAllPids(String whereStr, String orderStr, Map<String, Object> parameters) {
        String hqlQuery = "select pid from Deal d where dealStatus not like 'NEW'";
        hqlQuery = hqlQuery.concat(whereStr);
        hqlQuery = hqlQuery.concat(" order by pid desc");
        hqlQuery = hqlQuery.concat(orderStr);
        Query query = entityManager.createQuery(hqlQuery, Long.class);
        parameters.forEach(query::setParameter);
        return query.getResultList();
    }

    @Transactional
    @Override
    public Long count(String whereStr, Map<String, Object> parameters) {
        String hqlQuery = "select count(pid) from Deal d where dealStatus not like 'NEW'";
        hqlQuery = hqlQuery.concat(whereStr);
        Query query = entityManager.createQuery(hqlQuery);
        parameters.forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }

    @Override
    public Deal createManual(String username, BigDecimal cryptoAmount, BigDecimal amount, CryptoCurrency cryptoCurrency,
            DealType dealType, FiatCurrency fiatCurrency) {
        Deal deal = modifyDealService.save(Deal.builder()
                .user(readUserService.getByChatId(webUserService.getByUsername(username).getChatId()))
                .dateTime(LocalDateTime.now())
                .cryptoAmount(cryptoAmount)
                .amount(amount)
                .wallet("operator_deal")
                .cryptoCurrency(cryptoCurrency)
                .dealType(dealType)
                .fiatCurrency(fiatCurrency)
                .dealStatus(DealStatus.CONFIRMED)
                .deliveryType(DeliveryType.STANDARD)
                .createType(CreateType.MANUAL)
                .build());
        notificationsAPI.send(NotificationType.ADD_MANUAL_DEAL);
        return deal;
    }
}
