package tgb.btc.web.vo;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.Objects;

@Data
@Builder
public class DateRange {
    private Date startDate;

    private Date endDate;

    private Boolean isRange;

    public String getHqlCondition() {
        if (Objects.isNull(startDate) && Objects.isNull(endDate)) return null;
        if (isRange) {
            return "date(date_time) between " + startDate + " and " + endDate;
        } else return "date(date_time) like " + startDate;
    }
}
