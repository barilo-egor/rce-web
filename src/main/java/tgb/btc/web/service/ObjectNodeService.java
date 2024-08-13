package tgb.btc.web.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;
import tgb.btc.web.interfaces.IObjectNodeService;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ObjectNodeService implements IObjectNodeService {

    private final ObjectMapper defaultMapper = new ObjectMapper();

    @Override
    public ObjectNode message(String message) {
        return defaultMapper
                .createObjectNode()
                .put("message", message);
    }

    @Override
    public List<ObjectNode> toObjects(String propertyName, List<String> values) {
        return values.stream()
                .map(value -> defaultMapper.createObjectNode().put(propertyName, value))
                .collect(Collectors.toList());
    }

    @Override
    public <T> List<ObjectNode> map(List<T> objects, Function<T, ObjectNode> mapFunction) {
        return objects.stream()
                .map(mapFunction)
                .collect(Collectors.toList());
    }

    @Override
    public ArrayNode autocomplete(List<String> values) {
        return defaultMapper.createArrayNode().addAll(values.stream()
                .map(value -> defaultMapper.createObjectNode()
                        .put("value", value))
                .collect(Collectors.toList()));
    }
}
