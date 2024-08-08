package tgb.btc.web.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;
import tgb.btc.web.interfaces.IObjectNodeService;

@Service
public class ObjectNodeService implements IObjectNodeService {

    private final ObjectMapper defaultMapper = new ObjectMapper();

    @Override
    public ObjectNode message(String message) {
        return defaultMapper
                .createObjectNode()
                .put("message", message);
    }
}
