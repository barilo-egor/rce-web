package tgb.btc.web.interfaces.map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.bean.web.WebUser;

public interface IWebUserMappingService {

    ObjectNode map(WebUser webUser);

}
