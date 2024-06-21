package tgb.btc.web.controller.dashboard.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.repository.web.ApiCalculationRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.process.ApiCalculationProcessService;
import tgb.btc.web.service.process.ApiUserProcessService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.api.Calculation;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/dashboard/api/calculation")
public class ApiCalculationsController extends BaseController {

    private ApiUserRepository apiUserRepository;

    private ApiUserProcessService apiUserProcessService;

    private ApiCalculationRepository apiCalculationRepository;

    private ApiCalculationProcessService apiCalculationProcessService;

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Autowired
    public void setApiUserProcessService(ApiUserProcessService apiUserProcessService) {
        this.apiUserProcessService = apiUserProcessService;
    }

    @Autowired
    public void setApiCalculationRepository(ApiCalculationRepository apiCalculationRepository) {
        this.apiCalculationRepository = apiCalculationRepository;
    }

    @Autowired
    public void setApiCalculationProcessService(
            ApiCalculationProcessService apiCalculationProcessService) {
        this.apiCalculationProcessService = apiCalculationProcessService;
    }

    @GetMapping("/hasCalculations")
    @ResponseBody
    public SuccessResponse<?> hasCalculations(Principal principal) {
        return SuccessResponseUtil.jsonData(() -> JacksonUtil.getEmpty().put("hasCalculations",
                apiCalculationRepository.countAllByApiUser(apiUserRepository.getByUsername(principal.getName())) > 0));
    }

    @GetMapping("/getCalculations")
    @ResponseBody
    public ObjectNode getCalculations(Principal principal, Integer page, Integer limit) {
        ApiUser apiUser = apiUserRepository.getById(apiUserRepository.getPidByUsername(principal.getName()));
        List<Calculation> calculations = apiUserProcessService.getCalculations(apiUser, page - 1, limit);
        ObjectNode result = apiCalculationProcessService.mapToTree(calculations);
        JacksonUtil.pagingData(result, apiCalculationRepository.countAllByApiUser(apiUser));
        return result;
    }
}
