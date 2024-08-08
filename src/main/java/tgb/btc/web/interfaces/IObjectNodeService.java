package tgb.btc.web.interfaces;

import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;

public interface IObjectNodeService {

    ObjectNode message(String message);

    List<ObjectNode> toObjects(String propertyName, List<String> values);
}
