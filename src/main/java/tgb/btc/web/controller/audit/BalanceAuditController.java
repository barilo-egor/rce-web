package tgb.btc.web.controller.audit;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.web.annotations.ExtJSController;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.interfaces.IWebBalanceAuditService;
import tgb.btc.web.vo.PagingResponse;

@ExtJSController
@RequestMapping(ControllerMapping.BALANCE_AUDIT)
public class BalanceAuditController extends BaseResponseEntityController {

    private final IWebBalanceAuditService webBalanceAuditService;

    protected BalanceAuditController(IObjectNodeService objectNodeService,
            IWebBalanceAuditService webBalanceAuditService) {
        super(objectNodeService);
        this.webBalanceAuditService = webBalanceAuditService;
    }

    @GetMapping
    public ResponseEntity<PagingResponse<ObjectNode>> findAll(Integer limit, Integer page, String sort) {
        return new ResponseEntity<>(webBalanceAuditService.findAll(limit, page, sort), HttpStatus.OK);
    }
}
