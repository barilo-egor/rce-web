package tgb.btc.web.annotations;

import org.springframework.web.bind.annotation.ResponseBody;

import java.lang.annotation.*;

/**
 * Обволакивает мапиинги в ответ для ExtJS, содержащий поля success и data(в это поле помещается ответ, возвращенный в маппинге)
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
@ResponseBody
public @interface ExtJSResponse {

}
