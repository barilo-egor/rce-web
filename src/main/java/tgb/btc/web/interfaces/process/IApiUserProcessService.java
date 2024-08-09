package tgb.btc.web.interfaces.process;

import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.web.vo.api.Calculation;
import tgb.btc.web.vo.form.ApiUserVO;

import java.util.List;

public interface IApiUserProcessService {

    ApiUser save(ApiUserVO apiUserVO);

    List<Calculation> getCalculations(ApiUser apiUser);

    List<String> getIdByPaymentTypePid(Boolean isAdding, Long paymentTypePid);

}
