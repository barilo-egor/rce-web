package tgb.btc.web.vo.api;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class TotalSum {

    private String dealType;

    private String fiatCurrency;

    private String cryptoCurrency;

    private BigDecimal totalFiatSum;

    private BigDecimal totalCryptoSum;
}
