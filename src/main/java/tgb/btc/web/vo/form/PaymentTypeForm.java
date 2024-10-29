package tgb.btc.web.vo.form;

import com.sun.istack.NotNull;
import lombok.Builder;
import lombok.Data;
import tgb.btc.library.bean.web.api.ApiPaymentType;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;

import java.math.BigDecimal;

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

    private BigDecimal minSum;

    public ApiPaymentType toApiPaymentType() {
        return ApiPaymentType.builder()
                .id(id)
                .name(name)
                .comment(comment)
                .dealType(dealType)
                .fiatCurrency(fiatCurrency)
                .minSum(minSum)
                .build();
    }
}
