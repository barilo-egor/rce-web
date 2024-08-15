package tgb.btc.web.service.map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.bean.web.api.UsdApiUserCourse;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.interfaces.service.bean.web.IApiDealService;
import tgb.btc.library.interfaces.util.IBigDecimalService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.interfaces.map.IApiDealMappingService;

import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Service
public class ApiDealMappingService implements IApiDealMappingService {

    private IApiDealService apiDealService;

    private IBigDecimalService bigDecimalService;

    @Autowired
    public void setBigDecimalService(IBigDecimalService bigDecimalService) {
        this.bigDecimalService = bigDecimalService;
    }

    @Autowired
    public void setApiDealService(IApiDealService apiDealService) {
        this.apiDealService = apiDealService;
    }

    @Override
    public ObjectNode mapFindAll(ApiDeal deal) {
        ObjectNode result = JacksonUtil.getEmpty();
        result.put("pid", deal.getPid());
        ObjectNode status = JacksonUtil.getEmpty()
                .put("name", deal.getApiDealStatus().name())
                .put("description", deal.getApiDealStatus().getDescription())
                .put("color", deal.getApiDealStatus().getColor());
        result.set("apiDealStatus", status);
        ObjectNode dealType = JacksonUtil.getEmpty()
                .put("name", deal.getDealType().name())
                .put("displayName", deal.getDealType().getNominativeFirstLetterToUpper());
        result.set("dealType", dealType);
        result.put("cryptoAmount", bigDecimalService.roundToPlainString(deal.getCryptoAmount(),
                deal.getCryptoCurrency().getScale()) + " " + deal.getCryptoCurrency().getShortName());
        result.put("amount", bigDecimalService.roundToPlainString(deal.getAmount())
                + " " + (Objects.nonNull(deal.getFiatCurrency()) ? deal.getFiatCurrency().getCode() :
                StringUtils.EMPTY));
        result.put("dateTime", deal.getDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")));
        result.put("requisite", deal.getRequisite());
        result.put("apiPaymentType", Objects.isNull(deal.getApiPaymentType()) ? "" : deal.getApiPaymentType().getName());
        result.put("apiRequisite", Objects.isNull(deal.getApiRequisite()) ? "" : deal.getApiRequisite().getRequisite());
        result.put("apiDealType", deal.getApiDealType().name());
        result.put("checkImageId", deal.getCheckImageId());
        result.put("receiptFormat", Objects.nonNull(deal.getReceiptFormat()) ? deal.getReceiptFormat().name() : null);
        ApiUser apiUser = deal.getApiUser();
        if (Objects.nonNull(apiUser)) {
            if (Objects.nonNull(apiUser.getGroupChat())) {
                result.put("groupChatPid", apiUser.getGroupChat().getPid());
            }
            UsdApiUserCourse bynUsdCourse = apiUser.getCourse(FiatCurrency.BYN);
            UsdApiUserCourse rubUsdCourse = apiUser.getCourse(FiatCurrency.RUB);
            ObjectNode user = JacksonUtil.getEmpty()
                    .put("id", apiUser.getId())
                    .put("dealsCount", apiDealService.countByApiDealStatusAndApiUser_Pid(
                            ApiDealStatus.ACCEPTED, deal.getApiUser().getPid()))
                    .put("isBanned", BooleanUtils.isTrue(apiUser.getIsBanned()))
                    .put("personalDiscount", bigDecimalService.roundToPlainString(apiUser.getPersonalDiscount()))
                    .put("bynUsdCourse", Objects.nonNull(bynUsdCourse) ? bigDecimalService.roundToPlainString(bynUsdCourse.getCourse()) : StringUtils.EMPTY)
                    .put("rubUsdCourse", Objects.nonNull(rubUsdCourse) ? bigDecimalService.roundToPlainString(rubUsdCourse.getCourse()) : StringUtils.EMPTY)
                    .put("registrationDate", apiUser.getRegistrationDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
            result.set("apiUser", user);
            result.put("apiUser.id", apiUser.getId());
        }
        return result;
    }
}
