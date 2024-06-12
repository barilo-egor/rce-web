package tgb.btc.web.controller.deal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.library.bean.bot.DealPayment;
import tgb.btc.library.repository.web.DealPaymentRepository;
import tgb.btc.web.controller.BaseController;

@Controller
@RequestMapping("/deal/payment")
public class DealPaymentController extends BaseController {

    private DealPaymentRepository dealPaymentRepository;

    @Autowired
    public void setDealPaymentRepository(DealPaymentRepository dealPaymentRepository) {
        this.dealPaymentRepository = dealPaymentRepository;
    }

    @PostMapping("/new")
    public void newPayment(String title, String message, String app) {
        dealPaymentRepository.save(DealPayment.builder()
                .title(title)
                .message(message)
                .app(app)
                .build());
    }
}
