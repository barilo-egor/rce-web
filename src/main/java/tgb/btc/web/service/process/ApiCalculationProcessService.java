package tgb.btc.web.service.process;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tgb.btc.library.bean.web.api.ApiCalculation;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.interfaces.service.bean.web.IApiCalculationService;
import tgb.btc.library.interfaces.service.bean.web.IApiDealService;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.interfaces.process.IApiCalculationProcessService;
import tgb.btc.web.vo.api.Calculation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ApiCalculationProcessService implements IApiCalculationProcessService {

    private IApiUserService apiUserService;

    private IApiDealService apiDealService;

    private IApiCalculationService apiCalculationService;

    @Autowired
    public void setApiUserService(IApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @Autowired
    public void setApiDealService(IApiDealService apiDealService) {
        this.apiDealService = apiDealService;
    }

    @Autowired
    public void setApiCalculationService(
            IApiCalculationService apiCalculationService) {
        this.apiCalculationService = apiCalculationService;
    }

    @Transactional
    @Override
    public void saveCalculation(Long userPid, Long newLastPaidDeal) {
        Long lastPaidDealPid = apiUserService.getLastPaidDealPidByUserPid(userPid);
        if (Objects.isNull(lastPaidDealPid)) {
            lastPaidDealPid = apiDealService.getFirstDealPid(userPid);
        }
        LocalDateTime dateTimeLastPaidDeal = apiDealService.getDateTimeByPid(lastPaidDealPid);
        LocalDateTime dateTimeCurrentPaidDeal = apiDealService.getDateTimeByPid(newLastPaidDeal);
        List<ApiDeal> apiDeals = apiDealService.getByDateBetweenExcludeStart(dateTimeLastPaidDeal,
                dateTimeCurrentPaidDeal, ApiDealStatus.ACCEPTED);
        apiCalculationService.save(ApiCalculation.builder()
                .apiUser(apiUserService.findById(userPid))
                .deals(apiDeals)
                .dateTime(LocalDateTime.now())
                .build());
        apiUserService.updateLastPidDeal(userPid, apiDealService.getByPid(newLastPaidDeal));
    }

    @Override
    public ObjectNode mapToTree(List<Calculation> calculations) {
        ObjectNode root = JacksonUtil.getEmpty();
        root.put("expanded", true);
        root.set("children", JacksonUtil.getEmptyArray().addAll(
                calculations.stream()
                        .map(Calculation::map)
                        .collect(Collectors.toList()))
        );
        return root;
    }

}
