package tgb.btc.web.interfaces.process;

import tgb.btc.library.bean.bot.PaymentType;
import tgb.btc.web.vo.form.PaymentTypeVO;

public interface IPaymentTypeProcessService {

    PaymentType save(PaymentTypeVO paymentTypeVO);

}
