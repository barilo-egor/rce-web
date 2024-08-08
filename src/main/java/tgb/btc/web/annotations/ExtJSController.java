package tgb.btc.web.annotations;

import org.springframework.stereotype.Controller;

import java.lang.annotation.*;

/**
 * Все методы класса обрабатываются как @ExtJSResponse
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
public @interface ExtJSController {
}
