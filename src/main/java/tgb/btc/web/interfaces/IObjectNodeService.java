package tgb.btc.web.interfaces;

import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.function.Function;

public interface IObjectNodeService {

    ObjectNode message(String message);

    List<ObjectNode> toObjects(String propertyName, List<String> values);

    <T> List<ObjectNode> map(List<T> objects, Function<T, ObjectNode> mapFunction);

}
