package tgb.btc.web.service.deal;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealStatus;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.interfaces.service.bean.bot.deal.IModifyDealService;
import tgb.btc.library.interfaces.service.bean.bot.deal.IReadDealService;
import tgb.btc.library.interfaces.service.process.IDealPoolService;
import tgb.btc.library.interfaces.web.ICryptoWithdrawalService;
import tgb.btc.library.service.AutoWithdrawalService;
import tgb.btc.library.service.bean.web.WebUserService;
import tgb.btc.web.interfaces.deal.IDealProcessService;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DealProcessService implements IDealProcessService {

    private final IDealPoolService dealPoolService;

    private final AutoWithdrawalService autoWithdrawalService;

    private final IModifyDealService modifyDealService;

    private final WebUserService webUserService;

    private final ICryptoWithdrawalService cryptoWithdrawalService;

    private final IReadDealService readDealService;

    @Autowired
    public DealProcessService(IDealPoolService dealPoolService, AutoWithdrawalService autoWithdrawalService,
            IModifyDealService modifyDealService, WebUserService webUserService,
            ICryptoWithdrawalService cryptoWithdrawalService, IReadDealService readDealService) {
        this.dealPoolService = dealPoolService;
        this.autoWithdrawalService = autoWithdrawalService;
        this.modifyDealService = modifyDealService;
        this.webUserService = webUserService;
        this.cryptoWithdrawalService = cryptoWithdrawalService;
        this.readDealService = readDealService;
    }

    @Override
    public void completePool(Principal principal, CryptoCurrency cryptoCurrency) {
        log.debug("Пользователь {} запросил вывод сделок {} из пула.", principal.getName(), cryptoCurrency.name());
        try {
            synchronized (dealPoolService) {
                List<Deal> deals = dealPoolService.getAllByDealStatusAndCryptoCurrency(CryptoCurrency.BITCOIN);
                BigDecimal totalAmount = deals.stream()
                        .map(Deal::getCryptoAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                BigDecimal balance = cryptoWithdrawalService.getBalance(CryptoCurrency.BITCOIN);
                if (BooleanUtils.isNotTrue(autoWithdrawalService.getMinAmount()) && balance.compareTo(totalAmount) < 0) {
                    throw new BaseException("Недостаточно средств на балансе.");
                }
                autoWithdrawalService.withdrawal(deals.stream().map(Deal::getPid).collect(Collectors.toList()));
                deals.forEach(deal -> modifyDealService.confirm(deal.getPid()));
                dealPoolService.completePool(CryptoCurrency.BITCOIN, webUserService.getChatIdByUsername(principal.getName()));
            }
        } catch (Exception e) {
            throw new BaseException("Ошибка при попытке вывода пула: " + e.getMessage(), e);
        }
    }

    @Override
    public void withdrawal(Principal principal, Long dealPid) {
        log.debug("Запрос на авто вывод сделки {} пользователем {}.", dealPid, principal.getName());
        Deal deal = readDealService.findById(dealPid);
        if (DealStatus.CONFIRMED.equals(deal.getDealStatus())) {
            throw new BaseException("Сделка уже находится в статусе \"Подтверждена\"");
        }
        String hash = cryptoWithdrawalService.withdrawal(deal.getCryptoCurrency(), deal.getCryptoAmount(), deal.getWallet());
        modifyDealService.confirm(dealPid);
        log.debug("Пользователь {} подтвердил сделку из бота {} с автовыводом. Хеш транзакции {}", principal.getName(), dealPid, hash);
    }
}
