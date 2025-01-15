package tgb.btc.web.constant;

public interface ControllerMapping {

    String WEB = "/web";

    String REGISTRATION = "/registration";

    String ROLES = WEB + "/role";

    String PROPERTIES = "/properties";

    /**
     * NEW
     */

    String API = "/api";

    String API10 = API + "/10";

    String PAYMENT_TYPES = "/paymentTypes";

    String API_PAYMENT_TYPES = PAYMENT_TYPES + API;

    String MESSAGES_TEXT = "/messages_text";
}
