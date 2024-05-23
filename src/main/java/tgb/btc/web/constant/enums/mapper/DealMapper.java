package tgb.btc.web.constant.enums.mapper;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang.StringUtils;
import tgb.btc.library.bean.bot.User;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.util.BigDecimalUtil;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.vo.bean.DealVO;

import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum DealMapper implements ObjectNodeConvertable<DealVO> {
    FIND_ALL(deal -> {
        ObjectNode result = JacksonUtil.getEmpty();
        result.put("pid", deal.getPid());
        ObjectNode status = JacksonUtil.getEmpty()
                .put("name", deal.getDealStatus().name())
                .put("displayName", deal.getDealStatus().getDisplayName())
                .put("color", deal.getDealStatus().getColor());
        result.set("status", status);
        result.put("paymentType", Objects.nonNull(deal.getPaymentType())
                ? deal.getPaymentType().getName()
                : StringUtils.EMPTY);
        ObjectNode dealType = JacksonUtil.getEmpty()
                .put("name", deal.getDealType().name())
                .put("displayName", deal.getDealType().getNominativeFirstLetterToUpper());
        result.set("dealType", dealType);
        result.put("cryptoAmount", BigDecimalUtil.roundToPlainString(deal.getAmountCrypto(), deal.getCryptoCurrency().getScale())
                + " " + deal.getCryptoCurrency().getShortName());
        result.put("amount", BigDecimalUtil.roundToPlainString(deal.getAmountFiat()) + " " + deal.getFiatCurrency().getCode());
        result.put("deliveryType", Objects.nonNull(deal.getDeliveryType())
                ? deal.getDeliveryType().getDisplayName()
                : StringUtils.EMPTY);
        result.put("dateTime", deal.getDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")));
        result.put("requisite", deal.getRequisite());
        result.put("additionalVerificationImageId", deal.getAdditionalVerificationImageId());
        User user = deal.getUser();
        ObjectNode userNode = JacksonUtil.getEmpty()
                .put("chatId", user.getChatId())
                .put("username", user.getUsername())
                .put("banned", user.getBanned())
                .put("fromChatId", user.getFromChatId())
                .put("referralBalance", user.getReferralBalance())
                .put("referralPercent", user.getReferralPercent())
                .put("referralUsersCount", user.getReferralUsers().size())
                .put("active", user.getActive())
                .put("dealsCount", deal.getDealsCount())
                .put("registrationDate", user.getRegistrationDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        result.set("user", userNode);
        ArrayNode paymentReceipts = JacksonUtil.getEmptyArray().addAll(deal.getPaymentReceipts().stream()
                .map(paymentReceipt -> JacksonUtil.getEmpty()
                        .put("format", paymentReceipt.getReceiptFormat().name())
                        .put("fileId", paymentReceipt.getReceipt()))
                .collect(Collectors.toList()));
        result.set("paymentReceipts", paymentReceipts);
        return result;
    }),
    GET(deal -> {
        ObjectNode dealType = JacksonUtil.getEmpty()
                .put("name", deal.getDealType().name())
                .put("genitive", deal.getDealType().getGenitive());
        ObjectNode dealStatus = JacksonUtil.getEmpty()
                .put("name", deal.getDealStatus().name())
                .put("displayName", deal.getDealStatus().getDisplayName());
        ObjectNode deliveryType = JacksonUtil.getEmpty()
                .put("name", Objects.nonNull(deal.getDeliveryType()) ? deal.getDeliveryType().name() : "отсутствует")
                .put("displayName", Objects.nonNull(deal.getDeliveryType()) ? deal.getDeliveryType().getDisplayName() : "отсутствует");
        ArrayNode paymentReceipts = JacksonUtil.getEmptyArray().addAll(deal.getPaymentReceipts().stream()
                .map(paymentReceipt -> JacksonUtil.getEmpty()
                        .put("format", paymentReceipt.getReceiptFormat().name())
                        .put("fileId", paymentReceipt.getReceipt()))
                .collect(Collectors.toList()));
        CryptoCurrency cryptoCurrency = deal.getCryptoCurrency();
        ObjectNode result = JacksonUtil.getEmpty()
                .put("pid", deal.getPid())
                .put("dateTime", deal.getDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:m:ss")))
                .put("paymentType", Objects.nonNull(deal.getPaymentType()) ? deal.getPaymentType().getName() : "Отсутствует")
                .put("requisite", deal.getRequisite())
                .put("username", StringUtils.isEmpty(deal.getUsername()) ? "Отсутствует" : deal.getUsername())
                .put("dealsCount", deal.getDealsCount())
                .put("chatId", deal.getChatId())
                .put("cryptoCurrency", Objects.nonNull(cryptoCurrency) ? cryptoCurrency.getShortName() : "Отсутствует")
                .put("amountCrypto", BigDecimalUtil.roundToPlainString(deal.getAmountCrypto(), deal.getCryptoCurrency().getScale()))
                .put("fiatCurrency", deal.getFiatCurrency().getGenitive())
                .put("amountFiat", BigDecimalUtil.roundToPlainString(deal.getAmountFiat()))
                .put("additionalVerificationImageId", deal.getAdditionalVerificationImageId());
        result.set("dealType", dealType);
        result.set("dealStatus", dealStatus);
        result.set("paymentReceipts", paymentReceipts);
        result.set("deliveryType", deliveryType);
        return result;
    }
    );

    private final Function<DealVO, ObjectNode> mapFunction;

    DealMapper(Function<DealVO, ObjectNode> mapFunction) {
        this.mapFunction = mapFunction;
    }

    @Override
    public Function<DealVO, ObjectNode> mapFunction() {
        return mapFunction;
    }
}
