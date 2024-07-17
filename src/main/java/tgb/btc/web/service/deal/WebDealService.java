package tgb.btc.web.service.deal;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.bean.bot.PaymentReceipt;
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
import tgb.btc.library.service.bean.bot.paging.PagingDealService;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.interfaces.deal.IWebDealService;
import tgb.btc.web.service.NotificationsAPI;
import tgb.btc.web.vo.bean.DealVO;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    private PagingDealService pagingDealService;

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
    public void setPagingDealService(PagingDealService pagingDealService) {
        this.pagingDealService = pagingDealService;
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
    public List<DealVO> findAll(Integer page, Integer limit, Integer start) {
        return pagingDealService.findAllByDealStatusNot(DealStatus.NEW,
                        PageRequest.of(page - 1, limit, Sort.by(Sort.Order.desc("pid")))).stream()
                .map(deal -> {
                    Long userChatId = dealUserService.getUserChatIdByDealPid(deal.getPid());
                    return DealVO.builder()
                            .pid(deal.getPid())
                            .dateTime(deal.getDateTime())
                            .paymentType(deal.getPaymentType())
                            .requisite(deal.getWallet())
                            .dealStatus(deal.getDealStatus())
                            .dealsCount(reportDealService.getCountByChatIdAndStatus(userChatId, DealStatus.CONFIRMED))
                            .dealStatus(deal.getDealStatus())
                            .fiatCurrency(deal.getFiatCurrency())
                            .cryptoCurrency(deal.getCryptoCurrency())
                            .amountCrypto(deal.getCryptoAmount())
                            .amountFiat(deal.getAmount())
                            .dealType(deal.getDealType())
                            .additionalVerificationImageId(deal.getAdditionalVerificationImageId())
                            .paymentReceipts(readDealService.getPaymentReceipts(deal.getPid()))
                            .deliveryType(deal.getDeliveryType())
                            .user(readUserService.findByChatId(userChatId))
                            .userDiscount(userDiscountService.getByUserChatId(userChatId))
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public List<DealVO> findAll(Integer page, Integer limit, Integer start, String whereStr, String orderStr,
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
        return deals
                .stream()
                .map(this::fromDeal)
                .collect(Collectors.toList());
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

    private DealVO fromDeal(Deal deal) {
        Long userChatId = dealUserService.getUserChatIdByDealPid(deal.getPid());
        return DealVO.builder()
                .pid(deal.getPid())
                .dateTime(deal.getDateTime())
                .paymentType(deal.getPaymentType())
                .requisite(deal.getWallet())
                .dealStatus(deal.getDealStatus())
                .dealsCount(reportDealService.getCountByChatIdAndStatus(userChatId, DealStatus.CONFIRMED))
                .dealStatus(deal.getDealStatus())
                .fiatCurrency(deal.getFiatCurrency())
                .cryptoCurrency(deal.getCryptoCurrency())
                .amountCrypto(deal.getCryptoAmount())
                .amountFiat(deal.getAmount())
                .dealType(deal.getDealType())
                .additionalVerificationImageId(deal.getAdditionalVerificationImageId())
                .paymentReceipts(readDealService.getPaymentReceipts(deal.getPid()))
                .deliveryType(deal.getDeliveryType())
                .user(readUserService.findByChatId(userChatId))
                .userDiscount(userDiscountService.getByUserChatId(userChatId))
                .createType(deal.getCreateType())
                .build();
    }

    @Override
    public DealVO get(Long pid) {
        Deal deal = readDealService.findByPid(pid);
        Long userChatId = dealUserService.getUserChatIdByDealPid(deal.getPid());
        List<PaymentReceipt> paymentReceipts = readDealService.getPaymentReceipts(deal.getPid());
        return DealVO.builder()
                .pid(deal.getPid())
                .dateTime(deal.getDateTime())
                .paymentType(deal.getPaymentType())
                .requisite(deal.getWallet())
                .username(dealUserService.getUserUsernameByDealPid(deal.getPid()))
                .dealsCount(dealCountService.getCountPassedByUserChatId(userChatId))
                .dealStatus(deal.getDealStatus())
                .chatId(userChatId)
                .cryptoCurrency(deal.getCryptoCurrency())
                .amountCrypto(deal.getCryptoAmount())
                .fiatCurrency(deal.getFiatCurrency())
                .amountFiat(deal.getAmount())
                .dealType(deal.getDealType())
                .additionalVerificationImageId(deal.getAdditionalVerificationImageId())
                .paymentReceipts(paymentReceipts)
                .build();
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
