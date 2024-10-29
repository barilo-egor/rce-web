package tgb.btc.web.annotations.handler;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class ExtJSControllerAspect {

    private final ExtJSResponseHandler extJSResponseHandler;

    @Autowired
    public ExtJSControllerAspect(ExtJSResponseHandler extJSResponseHandler) {
        this.extJSResponseHandler = extJSResponseHandler;
    }

    @Around("@within(tgb.btc.web.annotations.ExtJSController) && execution(* *(..))")
    public Object handleApiResponse(ProceedingJoinPoint joinPoint) throws Throwable {
        return extJSResponseHandler.handle(joinPoint);
    }
}
