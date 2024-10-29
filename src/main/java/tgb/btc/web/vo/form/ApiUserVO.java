package tgb.btc.web.vo.form;

import lombok.*;
import tgb.btc.library.constants.enums.bot.FiatCurrency;

import java.math.BigDecimal;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ApiUserVO {

    @Getter
    @Setter
    private Long pid;

    @Getter
    @Setter
    private String id;

    @Getter
    @Setter
    private BigDecimal personalDiscount;

    @Getter
    @Setter
    private BigDecimal usdCourseBYN;

    @Getter
    @Setter
    private BigDecimal usdCourseRUB;

    @Getter
    @Setter
    private FiatCurrency fiatCurrency;

    @Getter
    @Setter
    private Boolean isBanned;

    @Getter
    @Setter
    private String token;

    @Getter
    @Setter
    private Long groupChatPid;
}
