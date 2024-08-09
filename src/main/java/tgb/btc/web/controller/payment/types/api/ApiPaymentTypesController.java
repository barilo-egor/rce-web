package tgb.btc.web.controller.payment.types.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.web.api.ApiPaymentType;
import tgb.btc.library.interfaces.service.bean.web.IApiPaymentTypeService;
import tgb.btc.web.annotations.ExtJSController;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.interfaces.payment.types.IWebApiRequisitesService;
import tgb.btc.web.interfaces.users.IWebApiUsersService;
import tgb.btc.web.vo.form.PaymentTypeForm;

import java.util.List;

@ExtJSController
@RequestMapping(ControllerMapping.API_PAYMENT_TYPES)
public class ApiPaymentTypesController extends BaseResponseEntityController {

    private final IApiPaymentTypeService apiPaymentTypeService;

    private final IWebApiUsersService webApiUsersService;

    private final IWebApiRequisitesService webApiRequisitesService;

    @Autowired
    public ApiPaymentTypesController(IObjectNodeService objectNodeService, IApiPaymentTypeService apiPaymentTypeService,
            IWebApiUsersService webApiUsersService, IWebApiRequisitesService webApiRequisitesService) {
        super(objectNodeService);
        this.apiPaymentTypeService = apiPaymentTypeService;
        this.webApiUsersService = webApiUsersService;
        this.webApiRequisitesService = webApiRequisitesService;
    }

    @PostMapping
    public ResponseEntity<ObjectNode> create(@RequestBody PaymentTypeForm paymentTypeForm) {
        ApiPaymentType apiPaymentType = apiPaymentTypeService.save(paymentTypeForm.toApiPaymentType());
        return new ResponseEntity<>(apiPaymentType.map(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ApiPaymentType>> get() {
        return new ResponseEntity<>(apiPaymentTypeService.findAll(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/client")
    public ResponseEntity<List<ObjectNode>> getClient(@RequestParam Long paymentTypePid,
            @RequestParam(required = false) Boolean isAdding) {
        return new ResponseEntity<>(
                webApiUsersService.getIdByPaymentTypePid(isAdding, paymentTypePid),
                HttpStatus.ACCEPTED
        );
    }

    @PutMapping("/{paymentTypePid}/client/{apiUserId}")
    public ResponseEntity<ObjectNode> addPaymentType(@PathVariable Long paymentTypePid,
            @PathVariable String apiUserId) {
        return webApiUsersService.addPaymentType(paymentTypePid, apiUserId);
    }

    @DeleteMapping("/{paymentTypePid}/client/{apiUserId}")
    public ResponseEntity<ObjectNode> deletePaymentType(@PathVariable Long paymentTypePid,
            @PathVariable String apiUserId) {
        return webApiUsersService.deletePaymentType(paymentTypePid, apiUserId);
    }

    @GetMapping("/{paymentTypePid}/requisite")
    public ResponseEntity<List<ObjectNode>> getRequisite(@PathVariable Long paymentTypePid) {
        return new ResponseEntity<>(
                webApiRequisitesService.findAll(paymentTypePid),
                HttpStatus.ACCEPTED
        );
    }
}
