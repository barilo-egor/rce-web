package tgb.btc.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.constants.enums.bot.*;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.util.FiatCurrencyUtil;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/enum/")
public class EnumValuesController extends BaseController {

    @GetMapping("/fiatCurrencies")
    @ResponseBody
    public SuccessResponse<?> fiatCurrencies() {
        return SuccessResponseUtil.data(FiatCurrencyUtil.getFiatCurrencies());
    }

    @GetMapping("/roles")
    @ResponseBody
    public SuccessResponse<?> roles() {
        return SuccessResponseUtil.data(List.of(RoleConstants.values()));
    }

    @GetMapping("/dealTypes")
    @ResponseBody
    public SuccessResponse<?> dealTypes() {
        return SuccessResponseUtil.data(Arrays.asList(DealType.values()));
    }

    @GetMapping("/cryptoCurrencies")
    @ResponseBody
    public SuccessResponse<?> cryptoCurrencies() {
        return SuccessResponseUtil.data(Arrays.asList(CryptoCurrency.values()));
    }

    @GetMapping("/dealStatuses")
    @ResponseBody
    public SuccessResponse<?> dealStatuses() {
        return SuccessResponseUtil.data(Arrays.asList(DealStatus.values()));
    }

    @GetMapping("/deliveryTypes")
    @ResponseBody
    public SuccessResponse<?> deliveryTypes() {
        return SuccessResponseUtil.data(Arrays.asList(DeliveryType.values()));
    }

    @GetMapping("/apiDealStatuses")
    @ResponseBody
    public SuccessResponse<?> apiDealStatuses() {
        return SuccessResponseUtil.data(Arrays.asList(ApiDealStatus.values()));
    }
}
