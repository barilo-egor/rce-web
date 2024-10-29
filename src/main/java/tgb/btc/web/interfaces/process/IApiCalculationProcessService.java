package tgb.btc.web.interfaces.process;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.transaction.annotation.Transactional;
import tgb.btc.web.vo.api.Calculation;

import java.util.List;

public interface IApiCalculationProcessService {

    @Transactional
    void saveCalculation(Long userPid, Long newLastPaidDeal);

    ObjectNode mapToTree(List<Calculation> calculations);

}
