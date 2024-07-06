package tgb.btc.web.vo.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.Builder;
import lombok.Data;
import tgb.btc.library.interfaces.JsonConvertable;
import tgb.btc.library.util.web.JacksonUtil;

import java.math.BigDecimal;

@Data
@Builder
public class TotalSum implements JsonConvertable {

    private String dealType;

    private String fiatCurrency;

    private String cryptoCurrency;

    private BigDecimal totalFiatSum;

    private BigDecimal totalCryptoSum;

    private Integer sumDealsCount;

    @Override
    public ObjectNode map() {
        return JacksonUtil.getEmpty()
                .put("dealType", dealType)
                .put("fiatCurrency", fiatCurrency)
                .put("cryptoCurrency", cryptoCurrency)
                .put("totalFiatSum", totalFiatSum)
                .put("totalCryptoSum", totalCryptoSum)
                .put("sumDealsCount", sumDealsCount)
                .put("iconCls", "none")
                .put("leaf", true);
    }

}
