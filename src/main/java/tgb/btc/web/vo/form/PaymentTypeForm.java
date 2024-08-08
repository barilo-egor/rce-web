package tgb.btc.web.vo.form;

import com.sun.istack.NotNull;
import lombok.Builder;
import lombok.Data;
import tgb.btc.library.bean.web.api.ApiPaymentType;

@Data
@Builder
public class PaymentTypeForm {

    private Long pid;

    @NotNull
    private String id;

    @NotNull
    private String name;

    public ApiPaymentType toApiPaymentType() {
        return ApiPaymentType.builder().id(id).name(name).build();
    }
}
