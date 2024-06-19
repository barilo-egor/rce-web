package tgb.btc.web.service.process;

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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class ApiCalculationProcessService {

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
    public void saveCalculation(Long userPid, Long newLastPaidDeal) {
        Long lastPaidDealPid = apiUserRepository.getLastPaidDealPidByUserPid(userPid);
        if (Objects.isNull(lastPaidDealPid)) {
            lastPaidDealPid = apiDealRepository.getFirstDealPid(userPid);
        }
        LocalDateTime dateTimeLastPaidDeal = apiDealRepository.getDateTimeByPid(lastPaidDealPid);
        LocalDateTime dateTimeCurrentPaidDeal = apiDealRepository.getDateTimeByPid(newLastPaidDeal);
        List<ApiDeal> apiDeals = apiDealRepository.getByDateBetweenExcludeEnd(dateTimeLastPaidDeal, dateTimeCurrentPaidDeal, ApiDealStatus.ACCEPTED);
        apiCalculationRepository.save(ApiCalculation.builder()
                .apiUser(apiUserRepository.findById(userPid)
                        .orElseThrow(() -> new BaseException("Пользователь с pid=" + userPid + " не найден.")))
                .deals(apiDeals)
                .build());
        apiUserRepository.updateLastPidDeal(userPid, apiDealRepository.getByPid(newLastPaidDeal));

    }
}
