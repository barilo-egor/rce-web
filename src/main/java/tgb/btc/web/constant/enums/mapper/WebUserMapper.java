package tgb.btc.web.constant.enums.mapper;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.bean.web.Role;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.util.web.JacksonUtil;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum WebUserMapper implements ObjectNodeConvertable<WebUser> {
    FIND_ALL(webUser -> {
        ObjectNode result = JacksonUtil.getEmpty()
                .put("username", webUser.getUsername())
                .put("isEnabled", webUser.isEnabled())
                .put("chatId", webUser.getChatId());
        List<String> roles = webUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        RoleConstants role;
        if (roles.contains(RoleConstants.ROLE_ADMIN.name())) role = RoleConstants.ROLE_ADMIN;
        else if (roles.contains(RoleConstants.ROLE_OPERATOR.name())) role = RoleConstants.ROLE_OPERATOR;
        else role = RoleConstants.ROLE_USER;
        result.put("role", role.getDisplayName());
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
