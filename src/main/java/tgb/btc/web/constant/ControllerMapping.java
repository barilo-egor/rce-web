package tgb.btc.web.constant;

public interface ControllerMapping {

    String WEB = "/web";

    String API = "/api";
    String API10 = API + "/10";
    String API_USER = WEB + API + "/user";

    String REGISTRATION = "/registration";

    String BACKUP = WEB + "/backUpDB";

    String DEAL = WEB + "/deal";
    String BOT_DEAL = DEAL + "/bot";

    String PAYMENT_TYPES = WEB + "/paymentTypes";

    String SETTINGS = WEB + "/settings";

    String BULK_DISCOUNTS = WEB + "/bulkDiscount";

    String ENUM = WEB + "/enum";

    String ROLES = WEB + "/role";

    String WEB_USER = WEB + "/user";

    String PROPERTIES = WEB + "/properties";

    String GAMES = WEB + "/games";

    String SLOT_REEL = GAMES + "/slotReel";
}
