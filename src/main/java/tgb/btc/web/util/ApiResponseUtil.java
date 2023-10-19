package tgb.btc.web.util;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.ApiStatusCode;
import tgb.btc.web.vo.api.ApiResponse;

public final class ApiResponseUtil {

    private ApiResponseUtil() {
    }

    public static ObjectNode build(ApiStatusCode statusCode) {
        return build(statusCode, null);
    }

    public static ObjectNode build(ApiStatusCode statusCode, ObjectNode data) {
        return JacksonUtil.toObjectNode(new ApiResponse(statusCode, data));
    }
}
