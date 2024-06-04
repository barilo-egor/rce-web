package tgb.btc.web.constant.enums.mapper;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.bean.web.api.UsdApiUserCourse;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.util.BigDecimalUtil;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.vo.bean.ApiDealVO;

import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.function.Function;

public enum ApiDealMapper implements ObjectNodeConvertable<ApiDealVO> {
    FIND_ALL(deal -> {
        ObjectNode result = JacksonUtil.getEmpty();
        result.put("pid", deal.getPid());
        ObjectNode status = JacksonUtil.getEmpty()
                .put("name", deal.getDealStatus().name())
                .put("description", deal.getDealStatus().getDescription())
                .put("color", deal.getDealStatus().getColor());
        result.set("apiDealStatus", status);
        ObjectNode dealType = JacksonUtil.getEmpty()
                .put("name", deal.getDealType().name())
                .put("displayName", deal.getDealType().getNominativeFirstLetterToUpper());
        result.set("dealType", dealType);
        result.put("cryptoAmount", BigDecimalUtil.roundToPlainString(deal.getCryptoAmount(),
                deal.getCryptoCurrency().getScale()) + " " + deal.getCryptoCurrency().getShortName());
        result.put("amount", BigDecimalUtil.roundToPlainString(deal.getAmount())
                + " " + (Objects.nonNull(deal.getFiatCurrency()) ? deal.getFiatCurrency().getCode() :
                StringUtils.EMPTY));
        result.put("dateTime", deal.getDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")));
        result.put("requisite", deal.getRequisite());
        ApiUser apiUser = deal.getApiUser();
        if (Objects.nonNull(apiUser)) {
            UsdApiUserCourse bynUsdCourse = apiUser.getCourse(FiatCurrency.BYN);
            UsdApiUserCourse rubUsdCourse = apiUser.getCourse(FiatCurrency.RUB);
            ObjectNode user = JacksonUtil.getEmpty()
                    .put("id", apiUser.getId())
                    .put("dealsCount", deal.getDealsCount())
                    .put("isBanned", BooleanUtils.isTrue(apiUser.getIsBanned()))
                    .put("personalDiscount", BigDecimalUtil.roundToPlainString(apiUser.getPersonalDiscount()))
                    .put("buyRequisite", apiUser.getBuyRequisite())
                    .put("sellRequisite", apiUser.getSellRequisite())
                    .put("bynUsdCourse", Objects.nonNull(bynUsdCourse) ? BigDecimalUtil.roundToPlainString(bynUsdCourse.getCourse()) : StringUtils.EMPTY)
                    .put("rubUsdCourse", Objects.nonNull(rubUsdCourse) ? BigDecimalUtil.roundToPlainString(rubUsdCourse.getCourse()) : StringUtils.EMPTY)
                    .put("registrationDate", apiUser.getRegistrationDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
            result.set("apiUser", user);
            result.put("apiUser.id", apiUser.getId());
        }
        return result;
    });

    private final Function<ApiDealVO, ObjectNode> mapFunction;

    ApiDealMapper(Function<ApiDealVO, ObjectNode> mapFunction) {
        this.mapFunction = mapFunction;
    }

    @Override
    public Function<ApiDealVO, ObjectNode> mapFunction() {
        return mapFunction;
    }
}
