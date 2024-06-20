package tgb.btc.web.controller.dashboard.api;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.repository.web.ApiDealRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.service.bean.web.ApiDealService;
import tgb.btc.library.service.process.ApiDealReportService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.mapper.ApiDealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.deal.WebApiDealService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.DateRange;
import tgb.btc.web.vo.FailureResponse;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.WebResponse;
import tgb.btc.web.vo.api.ApiUserDealSearchForm;
import tgb.btc.web.vo.api.TotalSum;
import tgb.btc.web.vo.bean.ApiDealVO;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/dashboard/api/deal")
@Slf4j
public class ApiUserDealsController extends BaseController {

    private WebApiDealService webApiDealService;

    private ApiUserRepository apiUserRepository;

    private ApiDealReportService apiDealReportService;

    private ApiDealRepository apiDealRepository;

    private ApiDealService apiDealService;

    @Autowired
    public void setApiDealService(ApiDealService apiDealService) {
        this.apiDealService = apiDealService;
    }

    @Autowired
    public void setApiDealReportService(ApiDealReportService apiDealReportService) {
        this.apiDealReportService = apiDealReportService;
    }

    @Autowired
    public void setApiDealRepository(ApiDealRepository apiDealRepository) {
        this.apiDealRepository = apiDealRepository;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Autowired
    public void setWebApiDealService(WebApiDealService webApiDealService) {
        this.webApiDealService = webApiDealService;
    }

    @GetMapping("/check")
    @ResponseBody
    public SuccessResponse<?> check(Principal principal) {
        Long pid = apiUserRepository.getPidByUsername(principal.getName());
        if (Objects.isNull(pid)) {
            return SuccessResponseUtil.blockString("Вы пока что не были привязаны ни к одному API клиенту. Обратитесь к оператору.");
        } else return new SuccessResponse<>();
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

    @PostMapping("/beforeExport")
    @ResponseBody
    public WebResponse beforeExport(Principal principal, HttpServletRequest request, @RequestBody ApiUserDealSearchForm form) {
        Map<String, Object> parameters = new HashMap<>();
        List<Long> pids = webApiDealService.findAllPids(apiUserRepository.getPidByUsername(principal.getName()),
                form.getWhereStr(parameters), form.getSortStr(), parameters);
        if (CollectionUtils.isEmpty(pids)) {
            return new FailureResponse("Не найдено ни одной сделки.");
        }
        request.getSession().setAttribute("dealsPids", pids);
        return SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty()
                .put("success", true));
    }

    @GetMapping(value = "/export", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @ResponseBody
    public byte[] export(HttpServletRequest request, Principal principal) {
        List<Long> dealsPids = (List<Long>) request.getSession().getAttribute("dealsPids");
        byte[] result = apiDealReportService.loadReport(apiDealRepository.getDealsByPids(dealsPids));
        log.debug("API пользователь {} выгрузил отчет по API сделкам. Количество сделок {}.", principal.getName(), dealsPids.size());
        request.getSession().removeAttribute("dealsPids");
        return result;
    }

    @PostMapping("/cancel")
    @ResponseBody
    public SuccessResponse<?> cancel(Principal principal, Long dealPid) {
        apiDealRepository.updateApiDealStatusByPid(ApiDealStatus.CANCELED, dealPid);
        log.debug("API пользователь {} отменил сделку {}.", principal.getName(), dealPid);
        return SuccessResponseUtil.toast("Сделка была отменена.");
    }

    @PostMapping("/delete")
    @ResponseBody
    public SuccessResponse<?> delete(Principal principal, Long dealPid) {
        apiDealRepository.deleteById(dealPid);
        log.debug("API пользователь {} удалил сделку {}.", principal.getName(), dealPid);
        return SuccessResponseUtil.toast("Сделка была удалена.");
    }

    @GetMapping("/getIds")
    @ResponseBody
    public ArrayNode getIds(String query) {
        return JacksonUtil.getEmptyArray().addAll(apiDealRepository.getPidsByQuery(query).stream()
                .map(pid -> JacksonUtil.getEmpty()
                        .put("value", pid))
                .collect(Collectors.toList()));
    }

    @PostMapping("/statistic")
    @ResponseBody
    public SuccessResponse<?> statistic(Principal principal, @RequestBody DateRange dateRange) {
        Date startDate = Objects.isNull(dateRange) ? null : dateRange.getStartDate();
        Date endDate = Objects.isNull(dateRange) ? null : dateRange.getEndDate();
        Boolean isRange = Objects.isNull(dateRange) ? null : dateRange.getIsRange();
        List<TotalSum> totalSums = webApiDealService.getTotalSums(
                apiDealService.getAcceptedByDateBetween(
                        apiUserRepository.getPidByUsername(principal.getName()), startDate, endDate, isRange
                )
        );
        if (CollectionUtils.isEmpty(totalSums)) return SuccessResponseUtil.toast("Сделок не найдено.");
        return new SuccessResponse<>(totalSums);
    }
}
