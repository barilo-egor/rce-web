package tgb.btc.web.interfaces.users;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.ResponseEntity;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.bot.FiatCurrency;

import java.util.List;

public interface IWebApiUsersService {

    List<ApiUser> findAll(String id, FiatCurrency fiatCurrency, String token, String buyRequisite,
            String sellRequisite);

    List<ObjectNode> getIdByPaymentTypePid(Boolean isAdding, Long paymentTypePid);

    ResponseEntity<ObjectNode> addPaymentType(Long paymentTypePid, String apiUserPid);

    ResponseEntity<ObjectNode> deletePaymentType(Long paymentTypePid, String apiUserId);

}
