package tgb.btc.web.annotations.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.vo.PagingResponse;

@Service
@Slf4j
public class ExtJSResponseHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final IObjectNodeService objectNodeService;

    @Autowired
    public ExtJSResponseHandler(IObjectNodeService objectNodeService) {
        this.objectNodeService = objectNodeService;
    }

    public Object handle(ProceedingJoinPoint joinPoint) throws Throwable {
        Object result = joinPoint.proceed();
        if (result instanceof ResponseEntity) {
            try {
                ResponseEntity<?> responseEntity = (ResponseEntity<?>) result;
                ObjectNode responseNode = objectMapper.createObjectNode();
                responseNode.put("success", responseEntity.getStatusCode().is2xxSuccessful());
                if (responseEntity.getBody() instanceof PagingResponse) {
                    PagingResponse<?> pagingResponse = (PagingResponse<?>) responseEntity.getBody();
                    responseNode.put("total", pagingResponse.getTotalCount());
                    responseNode.put("data", objectMapper.valueToTree(pagingResponse.getList()));
                } else {
                    responseNode.set("data", objectMapper.valueToTree(responseEntity.getBody()));
                }
                return ResponseEntity.status(responseEntity.getStatusCode()).body(responseNode);
            } catch (Exception e) {
                log.error("Ошибка при обертке ответа для ExtJS.", e);
                ObjectNode responseNode = objectMapper.createObjectNode();
                responseNode.put("success", false);
                responseNode.set("data", objectNodeService.message(e.getMessage()));
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseNode);
            }
        }
        return result;
    }
}
