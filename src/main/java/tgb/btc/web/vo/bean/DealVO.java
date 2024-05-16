package tgb.btc.web.vo.bean;

import lombok.*;
import tgb.btc.library.bean.bot.PaymentReceipt;
import tgb.btc.library.bean.bot.PaymentType;
import tgb.btc.library.bean.bot.User;
import tgb.btc.library.constants.enums.bot.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

    private String additionalVerificationImageId;

    private List<PaymentReceipt> paymentReceipts;

    private DeliveryType deliveryType;

    private User user;
}
