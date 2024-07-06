package tgb.btc.web.vo;

import lombok.Data;

import java.util.Map;
import java.util.Objects;

@Data
public class NumberRange {

    private Long numberFrom;

    private Long numberTo;

    public String getHqlCondition(Map<String, Object> parameters, String field) {
        if (Objects.isNull(numberFrom) && Objects.isNull(numberTo)) return null;
        if (Objects.nonNull(numberFrom) && Objects.nonNull(numberTo)) {
            parameters.put("numberFrom", numberFrom);
            parameters.put("numberTo", numberTo);
            return field + " between :numberFrom and :numberTo";
        } else if (Objects.nonNull(numberFrom)) {
            parameters.put("numberFrom", numberFrom);
            return field + ">=:numberFrom";
        } else {
            parameters.put("numberTo", numberTo);
            return field + "<=:numberTo";
        }
    }
}
