package tgb.btc.web.service.map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.interfaces.map.IWebUserMappingService;

@Service
public class WebUserMappingService implements IWebUserMappingService {

    @Override
    public ObjectNode map(WebUser webUser) {
        ObjectNode result = JacksonUtil.getEmpty()
                .put("pid", webUser.getPid())
                .put("username", webUser.getUsername())
                .put("isEnabled", webUser.isEnabled())
                .put("chatId", webUser.getChatId());
        RoleConstants role = RoleConstants.valueOf(webUser.getRoles().stream()
                .findFirst()
                .orElseThrow(() -> new BaseException("Роль пользователя " + webUser.getPid() + " не найдена"))
                .getName());
        result.set("role", role.mapFunction().apply(role));
        return result;
    }
}
