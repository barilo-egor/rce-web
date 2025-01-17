package tgb.btc.web.controller.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.web.annotations.ExtJSController;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;

@ExtJSController
@RequestMapping("/access")
public class AccessController extends BaseResponseEntityController {

    protected AccessController(IObjectNodeService objectNodeService) {
        super(objectNodeService);
    }

    @GetMapping("/balance")
    public ResponseEntity<Boolean> balance() {
        return null;
    }
}
