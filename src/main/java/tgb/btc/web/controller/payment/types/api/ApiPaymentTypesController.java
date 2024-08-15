package tgb.btc.web.controller.payment.types.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.web.api.ApiRequisite;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.interfaces.service.bean.web.IApiPaymentTypeService;
import tgb.btc.library.service.bean.web.ApiRequisiteService;
import tgb.btc.web.annotations.ExtJSController;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.interfaces.payment.types.IWebApiRequisitesService;
import tgb.btc.web.interfaces.users.IWebApiUsersService;
import tgb.btc.web.vo.form.ApiRequisiteForm;
import tgb.btc.web.vo.form.PaymentTypeForm;

import java.math.BigDecimal;
import java.util.List;

@ExtJSController
@RequestMapping(ControllerMapping.API_PAYMENT_TYPES)
public class ApiPaymentTypesController extends BaseResponseEntityController {

    private final IApiPaymentTypeService apiPaymentTypeService;

    private final IWebApiUsersService webApiUsersService;

    private final IWebApiRequisitesService webApiRequisitesService;

    private final ApiRequisiteService apiRequisiteService;

    @Autowired
    public ApiPaymentTypesController(IObjectNodeService objectNodeService, IApiPaymentTypeService apiPaymentTypeService,
                                     IWebApiUsersService webApiUsersService, IWebApiRequisitesService webApiRequisitesService,
            ApiRequisiteService apiRequisiteService) {
        super(objectNodeService);
        this.apiPaymentTypeService = apiPaymentTypeService;
        this.webApiUsersService = webApiUsersService;
        this.webApiRequisitesService = webApiRequisitesService;
        this.apiRequisiteService = apiRequisiteService;
    }

    @GetMapping
    public ResponseEntity<List<ObjectNode>> get(@RequestParam DealType dealType,
            @RequestParam(required = false) String apiUserId) {
        return new ResponseEntity<>(
                objectNodeService.map(apiPaymentTypeService.findAll(dealType, apiUserId)), HttpStatus.ACCEPTED
        );
    }

    @PostMapping
    public ResponseEntity<ObjectNode> create(@RequestBody PaymentTypeForm paymentTypeForm) {
        apiPaymentTypeService.save(paymentTypeForm.toApiPaymentType());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PatchMapping("/{pid}")
    public ResponseEntity<ObjectNode> update(@PathVariable Long pid, @RequestParam String id, @RequestParam String name,
            @RequestParam String comment, @RequestParam BigDecimal minSum) {
        apiPaymentTypeService.update(pid, name, id, comment, minSum);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{pid}")
    public ResponseEntity<ObjectNode> delete(@PathVariable Long pid) {
        apiPaymentTypeService.delete(pid);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable String id) {
        return new ResponseEntity<>(apiPaymentTypeService.exists(id), HttpStatus.ACCEPTED);
    }


    @GetMapping("/client")
    public ResponseEntity<List<ObjectNode>> getClient(@RequestParam Long paymentTypePid,
                                                      @RequestParam(required = false) Boolean isAdding) {
        return new ResponseEntity<>(
                webApiUsersService.getIdByPaymentTypePid(isAdding, paymentTypePid), HttpStatus.ACCEPTED
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

    @GetMapping("/requisite")
    public ResponseEntity<List<ApiRequisite>> getRequisite(@RequestParam Long paymentTypePid) {
        return new ResponseEntity<>(
                webApiRequisitesService.findAll(paymentTypePid), HttpStatus.ACCEPTED
        );
    }

    @PostMapping("/requisite")
    public ResponseEntity<List<ApiRequisite>> createRequisite(@RequestBody ApiRequisiteForm apiRequisiteForm) {
        apiRequisiteService.save(apiRequisiteForm.getPaymentTypePid(), apiRequisiteForm.getRequisite());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PatchMapping("/requisite/{requisitePid}")
    public ResponseEntity<Object> updateRequisite(@PathVariable Long requisitePid,
                                                  @RequestParam(required = false) Boolean isOn,
                                                  @RequestParam(required = false) String requisite) {
        apiRequisiteService.update(requisitePid, requisite, isOn);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/requisite/{requisitePid}")
    public ResponseEntity<Object> deleteRequisite(@PathVariable Long requisitePid) {
        apiRequisiteService.delete(requisitePid);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
