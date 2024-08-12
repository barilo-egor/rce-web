package tgb.btc.web.vo.form;

import com.sun.istack.NotNull;
import lombok.Builder;
import lombok.Data;
import tgb.btc.library.bean.web.api.ApiPaymentType;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;

import java.util.Objects;

@Data
@Builder
public class PaymentTypeForm {

    private Long pid;

    @NotNull
    private String id;

    @NotNull
    private String name;

    private String comment;

    private DealType dealType;

    private FiatCurrency fiatCurrency;

    private CryptoCurrency cryptoCurrency;

    public ApiPaymentType toApiPaymentType() {
        return ApiPaymentType.builder()
                .id(id)
                .name(name)
                .comment(comment)
                .dealType(dealType)
                .fiatCurrency(DealType.BUY.equals(dealType) ? fiatCurrency : null)
                .cryptoCurrency(DealType.SELL.equals(dealType) ? cryptoCurrency : null)
                .build();
    }
}
