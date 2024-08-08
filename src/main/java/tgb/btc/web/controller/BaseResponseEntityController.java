package tgb.btc.web.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import tgb.btc.web.annotations.ExtJSResponse;
import tgb.btc.web.interfaces.IObjectNodeService;

@Slf4j
public abstract class BaseResponseEntityController {

    protected final IObjectNodeService objectNodeService;

    protected BaseResponseEntityController(IObjectNodeService objectNodeService) {
        this.objectNodeService = objectNodeService;
    }

    @ExceptionHandler(Exception.class)
    @ExtJSResponse
    public ResponseEntity<ObjectNode> handleException(Exception e) {
        log.error("Ошибка на контроллере.", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(objectNodeService.message(e.getMessage()));
    }
}
