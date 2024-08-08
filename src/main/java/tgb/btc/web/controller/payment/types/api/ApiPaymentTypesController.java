package tgb.btc.web.controller.payment.types.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.web.api.ApiPaymentType;
import tgb.btc.library.interfaces.service.bean.web.IApiPaymentTypeService;
import tgb.btc.web.annotations.ExtJSResponse;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.vo.form.PaymentTypeForm;

import java.util.List;

@RestController
@RequestMapping(ControllerMapping.API_PAYMENT_TYPES)
public class ApiPaymentTypesController extends BaseResponseEntityController {

    private final IApiPaymentTypeService apiPaymentTypeService;

    @Autowired
    public ApiPaymentTypesController(IObjectNodeService objectNodeService,
            IApiPaymentTypeService apiPaymentTypeService) {
        super(objectNodeService);
        this.apiPaymentTypeService = apiPaymentTypeService;
    }

    @PostMapping
    @ExtJSResponse
    public ResponseEntity<ObjectNode> create(@RequestBody PaymentTypeForm paymentTypeForm) {
        ApiPaymentType apiPaymentType = apiPaymentTypeService.save(paymentTypeForm.toApiPaymentType());
        return new ResponseEntity<>(apiPaymentType.map(), HttpStatus.CREATED);
    }

    @GetMapping
    @ExtJSResponse
    public ResponseEntity<List<ApiPaymentType>> findAll() {
        return new ResponseEntity<>(apiPaymentTypeService.findAll(), HttpStatus.ACCEPTED);
    }
}
