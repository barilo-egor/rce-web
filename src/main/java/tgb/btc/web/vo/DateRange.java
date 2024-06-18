package tgb.btc.web.vo;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.Map;
import java.util.Objects;

@Data
@Builder
public class DateRange {
    private Date startDate;

    private Date endDate;

    private Boolean isRange;

    public String getHqlCondition(Map<String, Object> parameters) {
        if (Objects.isNull(startDate) && Objects.isNull(endDate)) return null;
        parameters.put("startDate", startDate);
        if (isRange) {
            if (Objects.nonNull(startDate) && Objects.isNull(endDate)) {
                parameters.put("startDate", startDate);
                return "date(date_time) >= date(:startDate)";
            } else if (Objects.isNull(startDate) && Objects.nonNull(endDate)) {
                parameters.put("endDate", endDate);
                return "date(date_time) <= date(:endDate)";
            }
            parameters.put("endDate", endDate);
            return "date(date_time) between date(:startDate) and date(:endDate)";
        } else return "date(date_time)=:startDate";
    }
}
