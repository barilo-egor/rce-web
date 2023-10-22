package tgb.btc.web.constant.enums.mapper;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang.StringUtils;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.util.BigDecimalUtil;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.vo.bean.DealVO;

import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.function.Function;

public enum DealMapper implements ObjectNodeConvertable<DealVO> {
    FIND_ALL(deal -> JacksonUtil.getEmpty()
            .put("pid", deal.getPid())
            .put("dealStatus", Objects.nonNull(deal.getDealStatus())
                    ? deal.getDealStatus().getDisplayName()
                    : StringUtils.EMPTY)
            .put("chatId", deal.getChatId())),
    GET(deal -> {
        ObjectNode dealType = JacksonUtil.getEmpty()
                .put("name", deal.getDealType().name())
                .put("genitive", deal.getDealType().getGenitive());
        ObjectNode result = JacksonUtil.getEmpty()
                .put("pid", deal.getPid())
                .put("dateTime", deal.getDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")))
                .put("paymentType", Objects.nonNull(deal.getPaymentType()) ? deal.getPaymentType().getName() : "Отсутствует")
                .put("requisite", deal.getRequisite())
                .put("username", StringUtils.isEmpty(deal.getUsername()) ? "Отсутствует" : deal.getUsername())
                .put("dealsCount", deal.getDealsCount())
                .put("dealStatus", deal.getDealStatus().getDisplayName())
                .put("chatId", deal.getChatId())
                .put("cryptoCurrency", deal.getCryptoCurrency().getShortName())
                .put("amountCrypto", BigDecimalUtil.roundToPlainString(deal.getAmountCrypto(), deal.getCryptoCurrency().getScale()))
                .put("fiatCurrency", deal.getFiatCurrency().getGenitive())
                .put("amountFiat", BigDecimalUtil.roundToPlainString(deal.getAmountFiat()));
        result.set("dealType", dealType);
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
