package tgb.btc.web.vo;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.Builder;
import lombok.Data;
import tgb.btc.library.interfaces.JsonConvertable;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.NotificationType;

@Data
@Builder
public class Notification implements JsonConvertable {
    private String message;

    private String type;

    @Override
    public ObjectNode map() {
        return JacksonUtil.getEmpty()
                .put("type", type)
                .put("message", message);
    }
}
