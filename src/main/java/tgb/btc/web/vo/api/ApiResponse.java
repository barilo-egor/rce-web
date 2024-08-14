package tgb.btc.web.vo.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.ApiStatusCode;

import java.util.Objects;
import java.util.function.Function;

public class ApiResponse implements ObjectNodeConvertable<ApiResponse> {

    private final ApiStatusCode statusCode;

    private JsonNode data;

    public ApiResponse(ApiStatusCode statusCode, JsonNode data) {
        this.statusCode = statusCode;
        this.data = data;
    }

    public ApiResponse(ApiStatusCode statusCode) {
        this.statusCode = statusCode;
    }

    @Override
    public Function<ApiResponse, ObjectNode> mapFunction() {
        return apiResponse -> {
            ObjectNode result = JacksonUtil.getEmpty()
                    .put("code", statusCode.getCode())
                    .put("description", statusCode.getDescription());
            if (Objects.nonNull(data)) result.set("data", data);
            return result;
        };
    }
}
