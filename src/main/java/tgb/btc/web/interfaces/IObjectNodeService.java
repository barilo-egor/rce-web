package tgb.btc.web.interfaces;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.interfaces.JsonConvertable;

import java.util.List;
import java.util.function.Function;

public interface IObjectNodeService {

    ObjectNode message(String message);

    List<ObjectNode> toObjects(String propertyName, List<String> values);

    <T extends JsonConvertable> List<ObjectNode> map(List<T> objects);

    <T> List<ObjectNode> map(List<T> objects, Function<T, ObjectNode> mapFunction);

    ArrayNode autocomplete(List<String> values);

    <T> T readValue(String str, Class<T> clazz) throws JsonProcessingException;

    ObjectMapper getDefaultMapper();

}
