package tgb.btc.web.interfaces.map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.bean.bot.Deal;

public interface IDealMappingService {

    ObjectNode mapFindAll(Deal deal);

}
