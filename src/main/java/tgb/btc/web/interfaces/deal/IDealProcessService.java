package tgb.btc.web.interfaces.deal;

import tgb.btc.library.constants.enums.bot.CryptoCurrency;

import java.security.Principal;

public interface IDealProcessService {

    void completePool(Principal principal, CryptoCurrency cryptoCurrency);

    void withdrawal(Principal principal, Long dealPid);

}
