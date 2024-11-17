package tgb.btc.web.vo.form;

import lombok.Builder;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.web.vo.DateRange;
import tgb.btc.web.vo.Pageable;

import java.util.Map;
import java.util.Objects;

@Data
@Builder
public class ApiDealsSearchForm extends Pageable {
    private Long pid;

    private String apiUserId;

    private DateRange date;

    private FiatCurrency fiatCurrency;

    private CryptoCurrency cryptoCurrency;

    private DealType dealType;

    private ApiDealStatus dealStatus;

    private String requisite;

    public String getWhereStr(Map<String, Object> parameters) {
        StringBuilder result = new StringBuilder();
        if (Objects.nonNull(pid)) {
            result.append(" and pid=:pid");
            parameters.put("pid", pid);
        }
        if (Objects.nonNull(apiUserId)) {
            result.append(" and apiUser.id like :apiUserId");
            parameters.put("apiUserId", apiUserId);
        }
        if (Objects.nonNull(date)) {
            String hqlCondition = date.getHqlCondition(parameters);
            if (Objects.nonNull(hqlCondition)) result.append(" and ").append(hqlCondition);
        }
        if (StringUtils.isNotBlank(requisite)) {
            result.append(" and requisite like :requisite");
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
            result.append(" and apiDealStatus like :apiDealStatus");
            parameters.put("apiDealStatus", dealStatus);
        }
        return result.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ApiDealsSearchForm that = (ApiDealsSearchForm) o;
        return Objects.equals(pid, that.pid) && Objects.equals(apiUserId, that.apiUserId)
                && Objects.equals(date, that.date) && fiatCurrency == that.fiatCurrency
                && cryptoCurrency == that.cryptoCurrency && dealType == that.dealType && dealStatus == that.dealStatus
                && Objects.equals(requisite, that.requisite);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pid, apiUserId, date, fiatCurrency, cryptoCurrency, dealType, dealStatus, requisite);
    }

}
