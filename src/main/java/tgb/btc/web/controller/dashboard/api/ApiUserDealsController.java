package tgb.btc.web.controller.dashboard.api;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.interfaces.service.bean.web.IApiDealService;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;
import tgb.btc.library.service.bean.web.ApiDealService;
import tgb.btc.library.service.process.ApiDealReportService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.interfaces.api.service.IApiDealProcessService;
import tgb.btc.web.interfaces.deal.IWebApiDealService;
import tgb.btc.web.interfaces.map.IApiDealMappingService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.DateRange;
import tgb.btc.web.vo.FailureResponse;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.WebResponse;
import tgb.btc.web.vo.api.ApiUserDealSearchForm;
import tgb.btc.web.vo.api.TotalSum;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/dashboard/api/deal")
@Slf4j
public class ApiUserDealsController extends BaseController {

    private IWebApiDealService webApiDealService;

    private IApiUserService apiUserService;

    private ApiDealReportService apiDealReportService;

    private IApiDealService apiDealService;

    private IApiDealMappingService apiDealMappingService;

    private IApiDealProcessService apiDealProcessService;

    @Autowired
    public void setApiDealProcessService(IApiDealProcessService apiDealProcessService) {
        this.apiDealProcessService = apiDealProcessService;
    }

    @Autowired
    public void setApiDealMappingService(IApiDealMappingService apiDealMappingService) {
        this.apiDealMappingService = apiDealMappingService;
    }

    @Autowired
    public void setApiDealService(ApiDealService apiDealService) {
        this.apiDealService = apiDealService;
    }

    @Autowired
    public void setApiDealReportService(ApiDealReportService apiDealReportService) {
        this.apiDealReportService = apiDealReportService;
    }

    @Autowired
    public void setApiUserService(IApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @Autowired
    public void setApiDealService(IApiDealService apiDealService) {
        this.apiDealService = apiDealService;
    }

    @Autowired
    public void setWebApiDealService(IWebApiDealService webApiDealService) {
        this.webApiDealService = webApiDealService;
    }

    @GetMapping("/checkTie")
    @ResponseBody
    public SuccessResponse<?> checkTie(Principal principal) {
        Long pid = apiUserService.getPidByUsername(principal.getName());
        if (Objects.isNull(pid)) {
            return SuccessResponseUtil.blockString("Вы пока что не были привязаны ни к одному API клиенту. Обратитесь к оператору.");
        } else return new SuccessResponse<>();
    }

    @PostMapping("/findAll")
    @ResponseBody
    public ObjectNode findAll(Principal principal, @RequestBody ApiUserDealSearchForm searchForm) {
        Long userPid = apiUserService.getPidByUsername(principal.getName());
        Map<String, Object> parameters = new HashMap<>();
        List<ApiDeal> deals = webApiDealService.findAll(userPid, searchForm.getPage(),
                searchForm.getLimit(),
                searchForm.getWhereStr(parameters),
                searchForm.getSortStr(), parameters);
        return JacksonUtil.pagingData(deals,
                webApiDealService.count(userPid, searchForm.getWhereStr(parameters), parameters),
                deal -> apiDealMappingService.mapFindAll(deal));
    }

    @PostMapping("/beforeExport")
    @ResponseBody
    public WebResponse beforeExport(Principal principal, HttpServletRequest request, @RequestBody ApiUserDealSearchForm form) {
        Map<String, Object> parameters = new HashMap<>();
        List<Long> pids = webApiDealService.findAllPids(apiUserService.getPidByUsername(principal.getName()),
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
        byte[] result = apiDealReportService.loadReport(apiDealService.getDealsByPids(dealsPids));
        log.debug("API пользователь {} выгрузил отчет по API сделкам. Количество сделок {}.", principal.getName(), dealsPids.size());
        request.getSession().removeAttribute("dealsPids");
        return result;
    }

    @PostMapping("/cancel")
    @ResponseBody
    public SuccessResponse<?> cancel(Principal principal, Long dealPid) {
        apiDealService.updateApiDealStatusByPid(ApiDealStatus.CANCELED, dealPid);
        log.debug("API пользователь {} отменил сделку {}.", principal.getName(), dealPid);
        return SuccessResponseUtil.toast("Сделка была отменена.");
    }

    @PostMapping("/delete")
    @ResponseBody
    public SuccessResponse<?> delete(Principal principal, Long dealPid) {
        apiDealService.deleteById(dealPid);
        log.debug("API пользователь {} удалил сделку {}.", principal.getName(), dealPid);
        return SuccessResponseUtil.toast("Сделка была удалена.");
    }

    @GetMapping("/getIds")
    @ResponseBody
    public ArrayNode getIds(String query) {
        return JacksonUtil.getEmptyArray().addAll(apiDealService.getPidsByQuery(query).stream()
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
                        apiUserService.getPidByUsername(principal.getName()), startDate, endDate, isRange
                )
        );
        if (CollectionUtils.isEmpty(totalSums)) return SuccessResponseUtil.toast("Сделок не найдено.");
        return new SuccessResponse<>(totalSums);
    }

    @PostMapping("/dispute")
    @ResponseBody
    public SuccessResponse<?> dispute(Principal principal, @RequestParam MultipartFile file,
                                      @RequestParam BigDecimal fiatSum, @RequestParam FiatCurrency fiatCurrency,
                                      @RequestParam DealType dealType, @RequestParam CryptoCurrency cryptoCurrency,
                                      @RequestParam(required = false) String requisite) {

        apiDealProcessService.newDispute(principal, file, fiatSum, fiatCurrency, dealType, cryptoCurrency, requisite);
        return SuccessResponseUtil.toast("Диспут создан.");
    }
}
