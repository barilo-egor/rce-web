package tgb.btc.web.controller.deal.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.mapper.ApiDealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.deal.WebApiDealService;
import tgb.btc.web.vo.bean.ApiDealVO;
import tgb.btc.web.vo.form.ApiDealsSearchForm;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/deal/api")
public class ApiDealsController extends BaseController {

    private WebApiDealService webApiDealService;

    @Autowired
    public void setWebApiDealService(WebApiDealService webApiDealService) {
        this.webApiDealService = webApiDealService;
    }

    @PostMapping("/findAll")
    @ResponseBody
    public ObjectNode findAll(@RequestBody ApiDealsSearchForm apiDealsSearchForm) {
        Map<String, Object> parameters = new HashMap<>();
        List<ApiDealVO> dealVOList = webApiDealService.findAll(apiDealsSearchForm.getPage(),
                apiDealsSearchForm.getLimit(),
                apiDealsSearchForm.getWhereStr(parameters),
                apiDealsSearchForm.getSortStr(parameters), parameters);
        return JacksonUtil.pagingData(dealVOList,
                webApiDealService.count(apiDealsSearchForm.getWhereStr(parameters), parameters),
                ApiDealMapper.FIND_ALL);
    }
}
