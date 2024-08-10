package tgb.btc.web.service.payment.types;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.api.ApiPaymentType;
import tgb.btc.library.bean.web.api.ApiRequisite;
import tgb.btc.library.interfaces.service.bean.web.IApiPaymentTypeService;
import tgb.btc.library.interfaces.service.bean.web.IApiRequisiteService;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.interfaces.payment.types.IWebApiRequisitesService;

import java.util.List;

@Service
public class WebApiRequisitesService implements IWebApiRequisitesService {

    private final IObjectNodeService objectNodeService;

    private final IApiRequisiteService apiRequisiteService;

    private final IApiPaymentTypeService apiPaymentTypeService;

    @Autowired
    public WebApiRequisitesService(IApiRequisiteService apiRequisiteService, IObjectNodeService objectNodeService,
            IApiPaymentTypeService apiPaymentTypeService) {
        this.apiRequisiteService = apiRequisiteService;
        this.objectNodeService = objectNodeService;
        this.apiPaymentTypeService = apiPaymentTypeService;
    }

    @Override
    public List<ApiRequisite> findAll(Long paymentTypePid) {
        ApiPaymentType apiPaymentType = apiPaymentTypeService.findById(paymentTypePid);
        return apiRequisiteService.findAll(Example.of(ApiRequisite.builder().apiPaymentType(apiPaymentType).build()));
    }
}
