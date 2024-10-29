package tgb.btc.web.interfaces.payment.types;

import tgb.btc.library.bean.web.api.ApiRequisite;

import java.util.List;

public interface IWebApiRequisitesService {

    List<ApiRequisite> findAll(Long paymentTypePid);

}
