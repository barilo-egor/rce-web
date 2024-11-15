package tgb.btc.web.util;


import jakarta.servlet.http.HttpServletRequest;

public final class RequestUtil {

    private RequestUtil() {
    }

    public static String getIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) ipAddress = request.getRemoteAddr();
        return ipAddress;
    }
}
