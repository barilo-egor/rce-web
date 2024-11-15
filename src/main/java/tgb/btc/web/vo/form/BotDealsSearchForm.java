package tgb.btc.web.vo.form;

import lombok.Builder;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import tgb.btc.library.constants.enums.bot.*;
import tgb.btc.web.vo.DateRange;
import tgb.btc.web.vo.Pageable;

import java.util.Map;
import java.util.Objects;

@Data
@Builder
public class BotDealsSearchForm extends Pageable {
    private static final String WHERE_CLAUSE = " where";

    private Long chatId;

    private String username;

    private DateRange date;

    private String requisite;

    private FiatCurrency fiatCurrency;

    private CryptoCurrency cryptoCurrency;

    private DealType dealType;

    private DealStatus dealStatus;

    private DeliveryType deliveryType;

    private Long paymentType;

    public String getWhereStr(Map<String, Object> parameters) {
        StringBuilder result = new StringBuilder();
        if (Objects.nonNull(chatId)) {
            result.append(" and user.chatId=:chatId");
            parameters.put("chatId", chatId);
        }
        if (Objects.nonNull(username)) {
            result.append(" and user.username like :username");
            parameters.put("username", username);
        }
        if (Objects.nonNull(date)) {
            String hqlCondition = date.getHqlCondition(parameters);
            if (Objects.nonNull(hqlCondition)) result.append(" and ").append(hqlCondition);
        }
        if (StringUtils.isNotBlank(requisite)) {
            result.append(" and wallet like :requisite");
            parameters.put("requisite", requisite);
        }
        if (Objects.nonNull(fiatCurrency)) {
            result.append(" and fiatCurrency like :fiatCurrency");
            parameters.put("fiatCurrency", fiatCurrency);
        }
        if (Objects.nonNull(cryptoCurrency)) {
            result.append(" and cryptoCurrency like :cryptoCurrency");
            parameters.put("cryptoCurrency", cryptoCurrency);
        }
        if (Objects.nonNull(dealType)) {
            result.append(" and dealType like :dealType");
            parameters.put("dealType", dealType);
        }
        if (Objects.nonNull(dealStatus)) {
            result.append(" and dealStatus like :dealStatus");
            parameters.put("dealStatus", dealStatus);
        }
        if (Objects.nonNull(deliveryType)) {
            result.append(" and deliveryType like :deliveryType");
            parameters.put("deliveryType", deliveryType);
        }
        if (Objects.nonNull(paymentType)) {
            result.append(" and paymentType.pid=:paymentType");
            parameters.put("paymentType", paymentType);
        }
        return result.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        BotDealsSearchForm that = (BotDealsSearchForm) o;
        return Objects.equals(chatId, that.chatId) && Objects.equals(username, that.username)
                && Objects.equals(date, that.date) && Objects.equals(requisite, that.requisite)
                && fiatCurrency == that.fiatCurrency && cryptoCurrency == that.cryptoCurrency
                && dealType == that.dealType
                && dealStatus == that.dealStatus && deliveryType == that.deliveryType && Objects.equals(
                paymentType, that.paymentType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatId, username, date, requisite, fiatCurrency, cryptoCurrency, dealType, dealStatus,
                deliveryType, paymentType);
    }

}
