package tgb.btc.web.constant.enums;

import com.fasterxml.jackson.databind.node.ObjectNode;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.util.web.JacksonUtil;

import java.util.List;
import java.util.function.Function;

public enum ApiStatusCode implements ObjectNodeConvertable<ApiStatusCode> {
    CREATED_DEAL(0, "Сделка создана."),
    EMPTY_TOKEN(1, "Отсутствует токен."),
    EMPTY_DEAL_TYPE(2, "Отсутствует тип сделки."),
    EMPTY_AMOUNTS(3, "Не передана ни одна сумма (amount и cryptoAmount)."),
    ONLY_ONE_AMOUNT_NEEDED(4, "Должна быть заполнена только одна сумма (amount или cryptoAmount)."),
    EMPTY_CRYPTO_CURRENCY(5, "Отсутствует криптовалюта."),
    EMPTY_REQUISITE(6, "Отсутствует реквизит."),
    USER_NOT_FOUND(7, "Пользователь не найден."),

    DEAL_EXISTS(8, "Сделка найдена."),
    STATUS_PAID_UPDATED(9, "Сделка переведена в статус \"Оплачено\"."),
    DEAL_DELETED(10, "Сделка отменена."),
    DEAL_NOT_EXISTS(11, "Сделка не найдена."),
    DEAL_CONFIRMED(12, "Сделка уже обработана."),
    DEAL_ALREADY_PAID(13, "Сделка уже в статусе \"Оплачено\"."),
    MIN_SUM(14, "Получившаяся сумма меньше минимально требуемой."),
    PAYMENT_TIME_IS_UP(15, "Время оплаты вышло."),

    DEAL_ID_EXPECTED(16, "Отсутствует идентификатор сделки."),
    USER_BANNED(17, "Доступ запрещен."),
    DEAL_CANCELED(18, "Сделка отменена клиентом.");

    public static final List<ApiStatusCode> NEW_DEAL_STATUSES = List.of(CREATED_DEAL, EMPTY_TOKEN, EMPTY_DEAL_TYPE, EMPTY_AMOUNTS,
            ONLY_ONE_AMOUNT_NEEDED, EMPTY_CRYPTO_CURRENCY, EMPTY_REQUISITE, USER_NOT_FOUND, MIN_SUM, USER_BANNED);
    public static final List<ApiStatusCode> PAID_STATUSES = List.of(STATUS_PAID_UPDATED, EMPTY_TOKEN, DEAL_NOT_EXISTS, DEAL_ALREADY_PAID,
            PAYMENT_TIME_IS_UP, DEAL_ID_EXPECTED, USER_BANNED, DEAL_CONFIRMED);
    public static final List<ApiStatusCode> CANCEL_STATUSES = List.of(DEAL_DELETED, EMPTY_TOKEN, DEAL_NOT_EXISTS, DEAL_CONFIRMED, DEAL_ID_EXPECTED, USER_BANNED);
    public static final List<ApiStatusCode> GET_STATUS_STATUSES = List.of(DEAL_EXISTS, EMPTY_TOKEN, DEAL_NOT_EXISTS, DEAL_ID_EXPECTED, USER_BANNED);

    final int code;

    final String description;

    ApiStatusCode(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public Function<ApiStatusCode, ObjectNode> mapFunction() {
        return apiStatusCode -> JacksonUtil.getEmpty()
                .put("code", apiStatusCode.code)
                .put("description", apiStatusCode.description);
    }

    public ObjectNode toJson() {
        return JacksonUtil.getEmpty()
                .put("code", this.code)
                .put("description", this.description);
    }
}
