package tgb.btc.web.service.map;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.bean.bot.User;
import tgb.btc.library.bean.bot.UserDiscount;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.interfaces.enums.IDeliveryTypeService;
import tgb.btc.library.interfaces.service.bean.bot.IUserDiscountService;
import tgb.btc.library.interfaces.service.bean.bot.deal.read.IDealCountService;
import tgb.btc.library.interfaces.service.bean.bot.deal.read.IReportDealService;
import tgb.btc.library.interfaces.util.IBigDecimalService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.library.vo.web.PoolDeal;
import tgb.btc.web.interfaces.map.IDealMappingService;
import tgb.btc.web.service.ObjectNodeService;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class DealMappingService implements IDealMappingService {

    private IReportDealService reportDealService;

    private IUserDiscountService userDiscountService;

    private IDeliveryTypeService deliveryTypeService;

    private IBigDecimalService bigDecimalService;

    private IDealCountService dealCountService;

    private ObjectNodeService objectNodeService;

    @Autowired
    public void setDealCountService(IDealCountService dealCountService) {
        this.dealCountService = dealCountService;
    }

    @Autowired
    public void setBigDecimalService(IBigDecimalService bigDecimalService) {
        this.bigDecimalService = bigDecimalService;
    }

    @Autowired
    public void setDeliveryTypeService(IDeliveryTypeService deliveryTypeService) {
        this.deliveryTypeService = deliveryTypeService;
    }

    @Autowired
    public void setReportDealService(IReportDealService reportDealService) {
        this.reportDealService = reportDealService;
    }

    @Autowired
    public void setUserDiscountService(IUserDiscountService userDiscountService) {
        this.userDiscountService = userDiscountService;
    }

    @Override
    public ObjectNode mapFindAll(Deal deal) {
        ObjectNode result = JacksonUtil.getEmpty();
        result.put("pid", deal.getPid());
        ObjectNode status = JacksonUtil.getEmpty()
                .put("name", deal.getDealStatus().name())
                .put("displayName", deal.getDealStatus().getDisplayName())
                .put("color", deal.getDealStatus().getColor());
        result.set("dealStatus", status);
        result.put("paymentType.name", Objects.nonNull(deal.getPaymentType())
                ? deal.getPaymentType().getName()
                : StringUtils.EMPTY);
        ObjectNode dealType = JacksonUtil.getEmpty()
                .put("name", deal.getDealType().name())
                .put("displayName", deal.getDealType().getNominativeFirstLetterToUpper());
        result.set("dealType", dealType);
        result.put("cryptoAmount", bigDecimalService.roundToPlainString(deal.getCryptoAmount(), deal.getCryptoCurrency().getScale())
                + " " + deal.getCryptoCurrency().getShortName());
        result.put("cryptoAmountNumber", bigDecimalService.roundToPlainString(deal.getCryptoAmount()));
        result.put("cryptoCurrency", deal.getCryptoCurrency().name());
        result.put("amount", bigDecimalService.roundToPlainString(deal.getAmount()) + " " + deal.getFiatCurrency().getCode());
        result.put("deliveryType", Objects.nonNull(deal.getDeliveryType())
                ? deliveryTypeService.getDisplayName(deal.getDeliveryType())
                : StringUtils.EMPTY);
        result.put("dateTime", deal.getDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")));
        result.put("wallet", deal.getWallet());
        result.put("additionalVerificationImageId", deal.getAdditionalVerificationImageId());
        result.put("course", Objects.nonNull(deal.getCourse())
                ? bigDecimalService.roundToPlainString(deal.getCourse(), 0)
                : StringUtils.EMPTY);
        result.set("createType", deal.getCreateType().mapFunction().apply(deal.getCreateType()));
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
                .put("dealsCount", dealCountService.getCountConfirmedByUserChatId(user.getChatId()))
                .put("registrationDate", user.getRegistrationDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        UserDiscount userDiscount = userDiscountService.getByUserChatId(user.getChatId());
        if (Objects.nonNull(userDiscount)) {
            userNode.put("rankDiscountOn", BooleanUtils.isNotFalse(userDiscount.getRankDiscountOn()))
                    .put("personalBuy", userDiscount.getPersonalBuy())
                    .put("personalSell", userDiscount.getPersonalSell());
        }
        result.set("user", userNode);
        ArrayNode paymentReceipts = JacksonUtil.getEmptyArray().addAll(deal.getPaymentReceipts().stream()
                .map(paymentReceipt -> JacksonUtil.getEmpty()
                        .put("format", paymentReceipt.getReceiptFormat().name())
                        .put("fileId", paymentReceipt.getReceipt()))
                .collect(Collectors.toList()));
        result.set("paymentReceipts", paymentReceipts);
        return result;
    }

    @Override
    public List<ObjectNode> mapPool(List<PoolDeal> deals) {
        return objectNodeService.map(deals, deal -> objectNodeService.getDefaultMapper().createObjectNode()
                .put("id", deal.getId())
                .put("bot", deal.getBot())
                .put("pid", deal.getPid())
                .put("cryptoAmount", bigDecimalService.roundToPlainString(new BigDecimal(deal.getAmount()), CryptoCurrency.BITCOIN.getScale()))
                .put("wallet", deal.getAddress()));
    }

    @Autowired
    public void setObjectNodeService(ObjectNodeService objectNodeService) {
        this.objectNodeService = objectNodeService;
    }

}
