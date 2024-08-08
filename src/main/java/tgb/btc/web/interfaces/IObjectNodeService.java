package tgb.btc.web.interfaces;

import com.fasterxml.jackson.databind.node.ObjectNode;

public interface IObjectNodeService {

    ObjectNode message(String message);

}
