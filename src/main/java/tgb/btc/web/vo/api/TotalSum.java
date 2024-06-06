package tgb.btc.web.vo.api;

import lombok.Builder;
import lombok.Data;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;

import java.math.BigDecimal;

@Data
@Builder
public class TotalSum {

    private DealType dealType;

    private FiatCurrency fiatCurrency;

    private CryptoCurrency cryptoCurrency;

    private BigDecimal totalFiatSum;

    private BigDecimal totalCryptoSum;
}
