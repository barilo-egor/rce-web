package tgb.btc.web.controller;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealStatus;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.DeliveryType;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.interfaces.enums.IDeliveryTypeService;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.library.interfaces.util.IFiatCurrencyService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/enum/")
public class EnumValuesController extends BaseController {

    private IWebUserService webUserService;

    private IDeliveryTypeService deliveryTypeService;

    private IFiatCurrencyService fiatCurrencyService;

    @Autowired
    public void setFiatCurrencyService(IFiatCurrencyService fiatCurrencyService) {
        this.fiatCurrencyService = fiatCurrencyService;
    }

    @Autowired
    public void setDeliveryTypeService(IDeliveryTypeService deliveryTypeService) {
        this.deliveryTypeService = deliveryTypeService;
    }

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @GetMapping("/fiatCurrencies")
    @ResponseBody
    public SuccessResponse<?> fiatCurrencies() {
        return SuccessResponseUtil.data(fiatCurrencyService.getFiatCurrencies());
    }

    @GetMapping("/roles")
    @ResponseBody
    public SuccessResponse<?> roles(Principal principal, @RequestParam(required = false) Boolean byAccess) {
        List<RoleConstants> roleConstants;
        if (BooleanUtils.isTrue(byAccess)) roleConstants = RoleConstants.getAvailable(RoleConstants.valueOf(
                    webUserService.getRolesByUsername(principal.getName()).get(0).getName()));
        else roleConstants = List.of(RoleConstants.values());
        return SuccessResponseUtil.data(roleConstants);
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
        return SuccessResponseUtil.jsonData(Arrays.stream(DeliveryType.values())
                .map(deliveryType -> deliveryTypeService.getVO(deliveryType))
                .collect(Collectors.toList()));
    }

    @GetMapping("/apiDealStatuses")
    @ResponseBody
    public SuccessResponse<?> apiDealStatuses() {
        return SuccessResponseUtil.data(Arrays.asList(ApiDealStatus.values()));
    }
}
