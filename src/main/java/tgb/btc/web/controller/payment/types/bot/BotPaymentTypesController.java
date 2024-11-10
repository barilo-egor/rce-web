package tgb.btc.web.controller.payment.types.bot;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.bot.PaymentType;
import tgb.btc.library.bean.bot.SecurePaymentDetails;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.interfaces.service.bean.bot.IPaymentTypeService;
import tgb.btc.library.interfaces.service.bean.bot.ISecurePaymentDetailsService;
import tgb.btc.library.util.web.JacksonUtil;
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
    public ResponseEntity<ObjectNode> getSecurePaymentDetailsMinDealCount() {
        ObjectNode objectNode = JacksonUtil.getEmpty();
        for (FiatCurrency fiatCurrency : FiatCurrency.values()) {
            objectNode.put(fiatCurrency.getName(), securePaymentDetailsService.count(fiatCurrency));
        }
        return new ResponseEntity<>(objectNode, HttpStatus.OK);
    }

    @PostMapping("/securePaymentDetails")
    public ResponseEntity<Boolean> createSecurePaymentDetails(@RequestBody SecurePaymentDetails securePaymentDetails) {
        securePaymentDetailsService.save(securePaymentDetails);
        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }

    @PutMapping("/securePaymentDetails/{pid}")
    public ResponseEntity<Boolean> updateSecurePaymentDetails(@PathVariable Long pid,
                                                              @RequestParam(required = false) String details,
                                                              @RequestParam FiatCurrency fiatCurrency) {
        securePaymentDetailsService.update(pid, details, fiatCurrency);
        return new ResponseEntity<>(true, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/securePaymentDetails/{pid}")
    public ResponseEntity<Boolean> deleteSecurePaymentDetails(@PathVariable Long pid) {
        securePaymentDetailsService.deleteById(pid);
        return new ResponseEntity<>(true, HttpStatus.ACCEPTED);
    }

}
