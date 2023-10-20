package tgb.btc.web.constant.enums.mapper;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang.StringUtils;
import tgb.btc.library.interfaces.ObjectNodeConvertable;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.vo.bean.DealVO;

import java.util.Objects;
import java.util.function.Function;

public enum DealMapper implements ObjectNodeConvertable<DealVO> {
    FIND_ALL(deal -> JacksonUtil.getEmpty()
            .put("pid", deal.getPid())
            .put("dealStatus", Objects.nonNull(deal.getDealStatus())
                    ? deal.getDealStatus().getDisplayName()
                    : StringUtils.EMPTY)
            .put("chatId", deal.getChatId()));

    private final Function<DealVO, ObjectNode> mapFunction;

    DealMapper(Function<DealVO, ObjectNode> mapFunction) {
        this.mapFunction = mapFunction;
    }

    @Override
    public Function<DealVO, ObjectNode> mapFunction() {
        return mapFunction;
    }
}
