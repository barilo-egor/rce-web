package tgb.btc.web.controller.dashboard.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.mapper.ApiDealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.deal.WebApiDealService;
import tgb.btc.web.vo.api.ApiUserDealSearchForm;
import tgb.btc.web.vo.bean.ApiDealVO;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/dashboard/api/deal")
public class ApiUserDealsController extends BaseController {

    private WebApiDealService webApiDealService;

    private ApiUserRepository apiUserRepository;

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Autowired
    public void setWebApiDealService(WebApiDealService webApiDealService) {
        this.webApiDealService = webApiDealService;
    }

    @PostMapping("/findAll")
    @ResponseBody
    public ObjectNode findAll(Principal principal, @RequestBody ApiUserDealSearchForm searchForm) {
        Long userPid = apiUserRepository.getPidByUsername(principal.getName());
        Map<String, Object> parameters = new HashMap<>();
        List<ApiDealVO> dealVOList = webApiDealService.findAll(userPid, searchForm.getPage(),
                searchForm.getLimit(),
                searchForm.getWhereStr(parameters),
                searchForm.getSortStr(), parameters);
        return JacksonUtil.pagingData(dealVOList,
                webApiDealService.count(userPid, searchForm.getWhereStr(parameters), parameters),
                ApiDealMapper.FIND_ALL);
    }

}
