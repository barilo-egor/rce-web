package tgb.btc.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.web.vo.FailureResponse;

@Controller
@Slf4j
public class BaseController {
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public FailureResponse exception(Exception e) {
        long currentTimeInMillis = System.currentTimeMillis();
        log.error(currentTimeInMillis + " Ошибка на контроллере.", e);
        return new FailureResponse(currentTimeInMillis + " " + e.getMessage(), e);
    }

}
