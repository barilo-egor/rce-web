package tgb.btc.web.controller.common;

import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;
import tgb.btc.web.annotations.ExtJSController;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;

import java.util.List;

@ExtJSController
@RequestMapping("/autocomplete")
public class AutocompleteController extends BaseResponseEntityController {

    private final IApiUserService apiUserService;

    @Autowired
    public AutocompleteController(IObjectNodeService objectNodeService, IApiUserService apiUserService) {
        super(objectNodeService);
        this.apiUserService = apiUserService;
    }

    @GetMapping("/client/id")
    public ResponseEntity<ArrayNode> clientIds(String query) {
        return new ResponseEntity<>(objectNodeService.autocomplete(apiUserService.getIdLikeQuery(query)), HttpStatus.ACCEPTED);
    }
}
