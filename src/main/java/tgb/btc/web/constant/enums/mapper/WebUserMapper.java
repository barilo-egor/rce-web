package tgb.btc.web.constant.enums.mapper;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.bean.web.Role;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.util.web.JacksonUtil;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum WebUserMapper implements ObjectNodeConvertable<WebUser> {
    FIND_ALL(webUser -> {
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
    });

    final Function<WebUser, ObjectNode> mapFunction;

    WebUserMapper(Function<WebUser, ObjectNode> mapFunction) {
        this.mapFunction = mapFunction;
    }

    @Override
    public Function<WebUser, ObjectNode> mapFunction() {
        return mapFunction;
    }
}
