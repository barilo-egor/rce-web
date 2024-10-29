package tgb.btc.web.interfaces.deal;

import org.springframework.transaction.annotation.Transactional;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.web.vo.api.TotalSum;

import java.util.List;
import java.util.Map;

public interface IWebApiDealService {

    @Transactional
    List<ApiDeal> findAll(Long apiUserPid, Integer page, Integer limit, String whereStr, String orderStr,
            Map<String, Object> parameters);

    @Transactional
    List<ApiDeal> findAll(Integer page, Integer limit, String whereStr, String orderStr,
            Map<String, Object> parameters);

    @Transactional
    List<Long> findAllPids(String whereStr, String orderStr, Map<String, Object> parameters);

    @Transactional
    List<Long> findAllPids(Long userPid, String whereStr, String orderStr, Map<String, Object> parameters);

    @Transactional
    Long count(Long apiUserPid, String whereStr, Map<String, Object> parameters);

    @Transactional
    Long count(String whereStr, Map<String, Object> parameters);

    List<TotalSum> getCalculating(Long currentDealPid, Long userPid);

    List<TotalSum> getTotalSums(List<ApiDeal> apiDeals);

}
