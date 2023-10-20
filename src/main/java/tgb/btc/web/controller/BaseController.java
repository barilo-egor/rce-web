package tgb.btc.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

@Controller
@Slf4j
public class BaseController {
    @ExceptionHandler(Exception.class)
    public SuccessResponse<?> exception(Exception e) {
        log.error("Ошибка на контроллере.", e);
        return SuccessResponseUtil.exceptionString(e);
    }

}
