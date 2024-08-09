package tgb.btc.web.annotations.handler;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ExtJSResponseAspect {

    private final ExtJSResponseHandler extJSResponseHandler;

    @Autowired
    public ExtJSResponseAspect(ExtJSResponseHandler extJSResponseHandler) {
        this.extJSResponseHandler = extJSResponseHandler;
    }

    @Around("@annotation(tgb.btc.web.annotations.ExtJSResponse)")
    public Object handleApiResponse(ProceedingJoinPoint joinPoint) throws Throwable {
        return extJSResponseHandler.handle(joinPoint);
    }
}
