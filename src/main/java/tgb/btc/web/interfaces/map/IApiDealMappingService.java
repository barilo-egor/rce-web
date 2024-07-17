package tgb.btc.web.interfaces.map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.bean.web.api.ApiDeal;

public interface IApiDealMappingService {

    ObjectNode mapFindAll(ApiDeal deal);

}
