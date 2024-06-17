package tgb.btc.web.vo.api;

import lombok.Data;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.web.vo.DateRange;
import tgb.btc.web.vo.Pageable;

import java.util.Map;
import java.util.Objects;

@Data
public class ApiUserDealSearchForm extends Pageable {
    private Long pid;

    private DateRange date;

    private FiatCurrency fiatCurrency;

    private CryptoCurrency cryptoCurrency;

    private DealType dealType;

    private ApiDealStatus apiDealStatus;

    public String getWhereStr(Map<String, Object> parameters) {
        StringBuilder result = new StringBuilder();
        if (Objects.nonNull(pid)) {
            result.append(" and pid=:pid");
            parameters.put("pid", pid);
        }
        if (Objects.nonNull(date)) {
            String hqlCondition = date.getHqlCondition(parameters);
            if (Objects.nonNull(hqlCondition)) result.append(" and ").append(hqlCondition);
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
        if (Objects.nonNull(apiDealStatus)) {
            result.append(" and apiDealStatus=:apiDealStatus");
        }
        return result.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ApiUserDealSearchForm that = (ApiUserDealSearchForm) o;
        return Objects.equals(pid, that.pid) && Objects.equals(date, that.date)
                && fiatCurrency == that.fiatCurrency && cryptoCurrency == that.cryptoCurrency
                && dealType == that.dealType
                && apiDealStatus == that.apiDealStatus;
    }

    @Override
    public int hashCode() {
        return Objects.hash(pid, date, fiatCurrency, cryptoCurrency, dealType, apiDealStatus);
    }

}
