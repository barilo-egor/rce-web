package tgb.btc.web.service.deal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.bean.bot.PaymentReceipt;
import tgb.btc.library.constants.enums.bot.DealStatus;
import tgb.btc.library.repository.bot.DealRepository;
import tgb.btc.library.repository.bot.UserDiscountRepository;
import tgb.btc.library.repository.bot.UserRepository;
import tgb.btc.library.repository.bot.paging.PagingDealRepository;
import tgb.btc.library.service.bean.bot.DealService;
import tgb.btc.web.vo.bean.DealVO;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WebDealService {

    private DealRepository dealRepository;

    private PagingDealRepository pagingDealRepository;

    private DealService dealService;

    private UserRepository userRepository;

    private UserDiscountRepository userDiscountRepository;

    private EntityManager entityManager;

    @Autowired
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Autowired
    public void setUserDiscountRepository(UserDiscountRepository userDiscountRepository) {
        this.userDiscountRepository = userDiscountRepository;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setDealService(DealService dealService) {
        this.dealService = dealService;
    }

    @Autowired
    public void setDealRepository(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @Autowired
    public void setPagingDealRepository(PagingDealRepository pagingDealRepository) {
        this.pagingDealRepository = pagingDealRepository;
    }

    public List<DealVO> findAll(Integer page, Integer limit, Integer start) {
        return pagingDealRepository.findAllByDealStatusNot(DealStatus.NEW,
                        PageRequest.of(page - 1, limit, Sort.by(Sort.Order.desc("pid")))).stream()
                .map(deal -> {
                    Long userChatId = dealRepository.getUserChatIdByDealPid(deal.getPid());
                    return DealVO.builder()
                            .pid(deal.getPid())
                            .dateTime(deal.getDateTime())
                            .paymentType(deal.getPaymentType())
                            .requisite(deal.getWallet())
                            .dealStatus(deal.getDealStatus())
                            .dealsCount(dealRepository.getCountByChatIdAndStatus(userChatId, DealStatus.CONFIRMED))
                            .dealStatus(deal.getDealStatus())
                            .fiatCurrency(deal.getFiatCurrency())
                            .cryptoCurrency(deal.getCryptoCurrency())
                            .amountCrypto(deal.getCryptoAmount())
                            .amountFiat(deal.getAmount())
                            .dealType(deal.getDealType())
                            .additionalVerificationImageId(deal.getAdditionalVerificationImageId())
                            .paymentReceipts(dealService.getPaymentReceipts(deal.getPid()))
                            .deliveryType(deal.getDeliveryType())
                            .user(userRepository.findByChatId(userChatId))
                            .userDiscount(userDiscountRepository.getByUserChatId(userChatId))
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<DealVO> findAll(Integer page, Integer limit, Integer start, String whereStr, String orderStr,
                                Map<String, Object> parameters) {
        String hqlQuery = "from Deal d where dealStatus not like 'NEW'";
        hqlQuery = hqlQuery.concat(whereStr);
        hqlQuery = hqlQuery.concat(" order by pid desc");
        hqlQuery = hqlQuery.concat(orderStr);
        Query query = entityManager.createQuery(hqlQuery, Deal.class);
        query.setFirstResult((page - 1) * limit);
        query.setMaxResults(limit);
        parameters.forEach(query::setParameter);
        List<Deal> deals = query.getResultList();
        return deals
                .stream()
                .map(this::fromDeal)
                .collect(Collectors.toList());
    }

    public List<Long> findAllPids(String whereStr, String orderStr, Map<String, Object> parameters) {
        String hqlQuery = "select pid from Deal d where dealStatus not like 'NEW'";
        hqlQuery = hqlQuery.concat(whereStr);
        hqlQuery = hqlQuery.concat(" order by pid desc");
        hqlQuery = hqlQuery.concat(orderStr);
        Query query = entityManager.createQuery(hqlQuery, Long.class);
        parameters.forEach(query::setParameter);
        return query.getResultList();
    }

    public Long count(String whereStr, Map<String, Object> parameters) {
        String hqlQuery = "select count(pid) from Deal d where dealStatus not like 'NEW'";
        hqlQuery = hqlQuery.concat(whereStr);
        Query query = entityManager.createQuery(hqlQuery);
        parameters.forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }

    private DealVO fromDeal(Deal deal) {
        Long userChatId = dealRepository.getUserChatIdByDealPid(deal.getPid());
        return DealVO.builder()
                .pid(deal.getPid())
                .dateTime(deal.getDateTime())
                .paymentType(deal.getPaymentType())
                .requisite(deal.getWallet())
                .dealStatus(deal.getDealStatus())
                .dealsCount(dealRepository.getCountByChatIdAndStatus(userChatId, DealStatus.CONFIRMED))
                .dealStatus(deal.getDealStatus())
                .fiatCurrency(deal.getFiatCurrency())
                .cryptoCurrency(deal.getCryptoCurrency())
                .amountCrypto(deal.getCryptoAmount())
                .amountFiat(deal.getAmount())
                .dealType(deal.getDealType())
                .additionalVerificationImageId(deal.getAdditionalVerificationImageId())
                .paymentReceipts(dealService.getPaymentReceipts(deal.getPid()))
                .deliveryType(deal.getDeliveryType())
                .user(userRepository.findByChatId(userChatId))
                .userDiscount(userDiscountRepository.getByUserChatId(userChatId))
                .createType(deal.getCreateType())
                .build();
    }

    public DealVO get(Long pid) {
        Deal deal = dealRepository.getById(pid);
        Long userChatId = dealRepository.getUserChatIdByDealPid(deal.getPid());
        List<PaymentReceipt> paymentReceipts = dealService.getPaymentReceipts(deal.getPid());
        return DealVO.builder()
                .pid(deal.getPid())
                .dateTime(deal.getDateTime())
                .paymentType(deal.getPaymentType())
                .requisite(deal.getWallet())
                .username(dealRepository.getUserUsernameByDealPid(deal.getPid()))
                .dealsCount(dealRepository.getCountPassedByUserChatId(userChatId))
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
}
