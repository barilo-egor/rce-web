package tgb.btc.web.vo;

import lombok.Builder;
import lombok.Data;
import org.apache.commons.lang.StringUtils;
import tgb.btc.library.constants.enums.bot.*;

import java.util.Objects;

@Data
@Builder
public class DealsSearchForm extends Pageable {
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

    private Long paymentTypePid;

    public String getWhereStr() {
        StringBuilder result = new StringBuilder();
        if (Objects.nonNull(chatId)) result.append(" and user.chatId=").append(chatId);
        if (Objects.nonNull(username)) result.append(" and user.username like '").append(username).append("'");
        if (Objects.nonNull(date)) {
            String hqlCondition = date.getHqlCondition();
            if (Objects.nonNull(hqlCondition)) result.append(" and ").append(hqlCondition);
        }
        if (StringUtils.isNotBlank(requisite)) result.append(" and wallet like '").append(requisite).append("'");
        if (Objects.nonNull(fiatCurrency)) result.append(" and fiatCurrency like '").append(fiatCurrency.name()).append("'");
        if (Objects.nonNull(cryptoCurrency)) result.append(" and cryptoCurrency like '").append(cryptoCurrency.name()).append("'");
        if (Objects.nonNull(dealType)) result.append(" and dealType like '").append(dealType.name()).append("'");
        if (Objects.nonNull(dealStatus)) result.append(" and dealStatus like '").append(dealStatus.name()).append("'");
        if (Objects.nonNull(deliveryType)) result.append(" and deliveryType like '").append(deliveryType.name()).append("'");
        if (Objects.nonNull(paymentTypePid)) result.append(" and paymentType.pid=").append(paymentTypePid);
        return result.toString();
    }
}
