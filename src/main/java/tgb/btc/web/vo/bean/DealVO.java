package tgb.btc.web.vo.bean;

import lombok.*;
import tgb.btc.library.bean.bot.PaymentType;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealStatus;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DealVO {
    private Long pid;

    private LocalDateTime dateTime;

    private PaymentType paymentType;

    private String requisite;

    private String username;

    private Long dealsCount;

    private DealStatus dealStatus;

    private Long chatId;

    private CryptoCurrency cryptoCurrency;

    private BigDecimal amountCrypto;

    private FiatCurrency fiatCurrency;

    private BigDecimal amountFiat;

    private DealType dealType;
}
