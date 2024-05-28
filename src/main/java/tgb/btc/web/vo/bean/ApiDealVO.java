package tgb.btc.web.vo.bean;

import lombok.Builder;
import lombok.Data;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.web.ApiDealStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ApiDealVO {
    private Long pid;

    private ApiDealStatus dealStatus;

    private DealType dealType;

    private CryptoCurrency cryptoCurrency;

    private BigDecimal cryptoAmount;

    private FiatCurrency fiatCurrency;

    private BigDecimal amount;

    private LocalDateTime dateTime;

    private String requisite;

    private ApiUser apiUser;
}
