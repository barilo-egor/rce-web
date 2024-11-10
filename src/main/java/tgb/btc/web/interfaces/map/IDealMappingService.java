package tgb.btc.web.interfaces.map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.vo.web.PoolDeal;

import java.util.List;

public interface IDealMappingService {

    ObjectNode mapFindAll(Deal deal);

    List<ObjectNode> mapPool(List<PoolDeal> deals);

}
