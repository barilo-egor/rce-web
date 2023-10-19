package tgb.btc.web.vo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import tgb.btc.web.constant.enums.ApiStatusCode;

@Data
public class ErrorResponse {

    @Getter
    @Setter
    private int statusCode;

    @Getter
    @Setter
    private String description;

    public ErrorResponse(ApiStatusCode apiStatusCode) {
        this.statusCode = apiStatusCode.getCode();
        this.description = apiStatusCode.getDescription();
    }
}
