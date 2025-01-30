package tgb.btc.web.interfaces;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.web.vo.PagingResponse;

public interface IWebBalanceAuditService {

    PagingResponse<ObjectNode> findAll(Long targetChatId, Long initiatorChatId, Integer limit, Integer page, String sortStr);

}
