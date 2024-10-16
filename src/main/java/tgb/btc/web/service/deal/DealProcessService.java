package tgb.btc.web.service.deal;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.interfaces.service.bean.bot.deal.IModifyDealService;
import tgb.btc.library.interfaces.service.process.IDealPoolService;
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

    @Autowired
    public DealProcessService(IDealPoolService dealPoolService, AutoWithdrawalService autoWithdrawalService,
            IModifyDealService modifyDealService, WebUserService webUserService) {
        this.dealPoolService = dealPoolService;
        this.autoWithdrawalService = autoWithdrawalService;
        this.modifyDealService = modifyDealService;
        this.webUserService = webUserService;
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
                BigDecimal balance = autoWithdrawalService.getBalance(CryptoCurrency.BITCOIN);
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
}
