package tgb.btc.web.vo;

public class WebResponse {
    private final boolean isSuccess;
//test
    public WebResponse(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    public boolean isSuccess() {
        return this.isSuccess;
    }
}
