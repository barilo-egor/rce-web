package tgb.btc.web.interfaces.payment.types;

import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;

public interface IWebApiRequisitesService {

    List<ObjectNode> findAll(Long paymentTypePid);

}
