package tgb.btc.web.service.process;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tgb.btc.library.bean.web.api.ApiCalculation;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.repository.web.ApiCalculationRepository;
import tgb.btc.library.repository.web.ApiDealRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.interfaces.process.IApiCalculationProcessService;
import tgb.btc.web.vo.api.Calculation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ApiCalculationProcessService implements IApiCalculationProcessService {

    private ApiUserRepository apiUserRepository;

    private ApiDealRepository apiDealRepository;

    private ApiCalculationRepository apiCalculationRepository;

    @Autowired
    public void setApiCalculationRepository(ApiCalculationRepository apiCalculationRepository) {
        this.apiCalculationRepository = apiCalculationRepository;
    }

    @Autowired
    public void setApiDealRepository(ApiDealRepository apiDealRepository) {
        this.apiDealRepository = apiDealRepository;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Transactional
    @Override
    public void saveCalculation(Long userPid, Long newLastPaidDeal) {
        Long lastPaidDealPid = apiUserRepository.getLastPaidDealPidByUserPid(userPid);
        if (Objects.isNull(lastPaidDealPid)) {
            lastPaidDealPid = apiDealRepository.getFirstDealPid(userPid);
        }
        LocalDateTime dateTimeLastPaidDeal = apiDealRepository.getDateTimeByPid(lastPaidDealPid);
        LocalDateTime dateTimeCurrentPaidDeal = apiDealRepository.getDateTimeByPid(newLastPaidDeal);
        List<ApiDeal> apiDeals = apiDealRepository.getByDateBetweenExcludeStart(dateTimeLastPaidDeal,
                dateTimeCurrentPaidDeal, ApiDealStatus.ACCEPTED);
        apiCalculationRepository.save(ApiCalculation.builder()
                .apiUser(apiUserRepository.findById(userPid)
                        .orElseThrow(() -> new BaseException("Пользователь с pid=" + userPid + " не найден.")))
                .deals(apiDeals)
                .dateTime(LocalDateTime.now())
                .build());
        apiUserRepository.updateLastPidDeal(userPid, apiDealRepository.getByPid(newLastPaidDeal));
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
