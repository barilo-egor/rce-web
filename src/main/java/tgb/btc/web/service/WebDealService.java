package tgb.btc.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.constants.enums.bot.DealStatus;
import tgb.btc.library.repository.bot.DealRepository;
import tgb.btc.library.repository.bot.paging.PagingDealRepository;
import tgb.btc.web.vo.bean.DealVO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WebDealService {

    private DealRepository dealRepository;

    private PagingDealRepository pagingDealRepository;

    @Autowired
    public void setDealRepository(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @Autowired
    public void setPagingDealRepository(PagingDealRepository pagingDealRepository) {
        this.pagingDealRepository = pagingDealRepository;
    }

    public List<DealVO> findAll() {
        return dealRepository.findAll().stream()
                .map(deal -> DealVO.builder()
                        .pid(deal.getPid())
                        .dealStatus(deal.getDealStatus())
                        .chatId(dealRepository.getUserChatIdByDealPid(deal.getPid()))
                        .build())
                .collect(Collectors.toList());
    }

    public List<DealVO> findAll(Integer page, Integer limit, Integer start) {
        return pagingDealRepository.findAllByDealStatusNot(DealStatus.NEW, PageRequest.of(page - 1, limit, Sort.by(Sort.Order.desc("pid")))).stream()
                .map(deal -> DealVO.builder()
                        .pid(deal.getPid())
                        .dealStatus(deal.getDealStatus())
                        .chatId(dealRepository.getUserChatIdByDealPid(deal.getPid()))
                        .build())
                .collect(Collectors.toList());
    }

    public DealVO get(Long pid) {
        Deal deal = dealRepository.getById(pid);
        Long userChatId = dealRepository.getUserChatIdByDealPid(deal.getPid());
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
                .build();
    }
}
