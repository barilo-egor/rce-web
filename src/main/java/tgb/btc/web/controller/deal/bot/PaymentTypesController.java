package tgb.btc.web.controller.deal.bot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.bean.bot.PaymentType;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.interfaces.service.bean.bot.IPaymentTypeService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

@Controller
@RequestMapping("/deal/bot/paymentTypes")
public class PaymentTypesController {

    private IPaymentTypeService paymentTypeService;

    @Autowired
    public void setPaymentTypeService(IPaymentTypeService paymentTypeService) {
        this.paymentTypeService = paymentTypeService;
    }

    @GetMapping("/combo")
    @ResponseBody
    public SuccessResponse<?> combo() {
        return SuccessResponseUtil.data(paymentTypeService.findAll(),
                (ObjectNodeConvertable<PaymentType>) () -> paymentType -> JacksonUtil.getEmpty()
                        .put("name", paymentType.getName())
                        .put("dealType", paymentType.getDealType().name())
                        .put("pid", paymentType.getPid())
        );
    }
}
