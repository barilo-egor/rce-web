package tgb.btc.web.controller.payment.types.bot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.bot.PaymentType;
import tgb.btc.library.bean.bot.SecurePaymentDetails;
import tgb.btc.library.interfaces.service.bean.bot.IPaymentTypeService;
import tgb.btc.library.interfaces.service.bean.bot.ISecurePaymentDetailsService;
import tgb.btc.web.annotations.ExtJSController;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;

import java.util.List;

@ExtJSController
@RequestMapping("/paymentTypes/bot")
public class BotPaymentTypesController extends BaseResponseEntityController {

    private final ISecurePaymentDetailsService securePaymentDetailsService;

    private final IPaymentTypeService paymentTypeService;

    @Autowired
    protected BotPaymentTypesController(IObjectNodeService objectNodeService,
                                        ISecurePaymentDetailsService securePaymentDetailsService,
                                        IPaymentTypeService paymentTypeService) {
        super(objectNodeService);
        this.securePaymentDetailsService = securePaymentDetailsService;
        this.paymentTypeService = paymentTypeService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentType>> getPaymentTypes() {
        return new ResponseEntity<>(paymentTypeService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/securePaymentDetails")
    public ResponseEntity<List<SecurePaymentDetails>> getSecurePaymentDetails() {
        return new ResponseEntity<>(securePaymentDetailsService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/securePaymentDetails/minDealCount")
    public ResponseEntity<Long> getSecurePaymentDetailsMinDealCount() {
        return new ResponseEntity<>(securePaymentDetailsService.count(), HttpStatus.OK);
    }

    @PostMapping("/securePaymentDetails")
    public ResponseEntity<Boolean> createSecurePaymentDetails(@RequestBody SecurePaymentDetails securePaymentDetails) {
        securePaymentDetailsService.save(securePaymentDetails);
        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }

    @PutMapping("/securePaymentDetails/{pid}")
    public ResponseEntity<Boolean> updateSecurePaymentDetails(@PathVariable Long pid,
                                                              @RequestParam(required = false) String details) {
        securePaymentDetailsService.update(pid, details);
        return new ResponseEntity<>(true, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/securePaymentDetails/{pid}")
    public ResponseEntity<Boolean> deleteSecurePaymentDetails(@PathVariable Long pid) {
        securePaymentDetailsService.deleteById(pid);
        return new ResponseEntity<>(true, HttpStatus.ACCEPTED);
    }

}
