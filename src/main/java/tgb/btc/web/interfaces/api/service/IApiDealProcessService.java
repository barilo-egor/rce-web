package tgb.btc.web.interfaces.api.service;

import org.springframework.web.multipart.MultipartFile;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;

import java.math.BigDecimal;
import java.security.Principal;

public interface IApiDealProcessService {
    ApiDeal newDispute(Principal principal, MultipartFile file,
                       BigDecimal fiatSum, FiatCurrency fiatCurrency,
                       DealType dealType, CryptoCurrency cryptoCurrency,
                       String requisite);
}
