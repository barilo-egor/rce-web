package tgb.btc.web.controller.deal.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.repository.web.ApiDealRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.service.process.ApiDealReportService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.ApiUserNotificationType;
import tgb.btc.web.constant.enums.mapper.ApiDealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.impl.ApiUserNotificationsAPI;
import tgb.btc.web.service.impl.deal.WebApiDealService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.bean.ApiDealVO;
import tgb.btc.web.vo.form.ApiDealsSearchForm;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Controller
@RequestMapping("/deal/api")
@Slf4j
public class ApiDealsController extends BaseController {

    private WebApiDealService webApiDealService;

    private ApiDealRepository apiDealRepository;

    private ApiDealReportService apiDealReportService;

    private ApiUserRepository apiUserRepository;

    private ApiUserNotificationsAPI apiUserNotificationsAPI;

    @Autowired
    public void setApiUserNotificationsAPI(ApiUserNotificationsAPI apiUserNotificationsAPI) {
        this.apiUserNotificationsAPI = apiUserNotificationsAPI;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
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
                apiDealsSearchForm.getSortStr(), parameters);
        return JacksonUtil.pagingData(dealVOList,
                webApiDealService.count(apiDealsSearchForm.getWhereStr(parameters), parameters),
                ApiDealMapper.FIND_ALL);
    }

    @PostMapping("/accept")
    @ResponseBody
    public SuccessResponse<?> accept(Principal principal, Long pid) {
        apiDealRepository.updateApiDealStatusByPid(ApiDealStatus.ACCEPTED, pid);
        log.debug("Пользователь {} подтвердил АПИ сделку {}", principal.getName(), pid);
        apiUserNotificationsAPI.send(apiDealRepository.getApiUserPidByDealPid(pid), ApiUserNotificationType.ACCEPTED_DEAL, "Сделка №" + pid + " подтверждена.");
        return SuccessResponseUtil.toast("Сделка подтверждена.");
    }

    @PostMapping("/decline")
    @ResponseBody
    public SuccessResponse<?> decline(Principal principal, Long pid) {
        apiDealRepository.updateApiDealStatusByPid(ApiDealStatus.DECLINED, pid);
        log.debug("Пользователь {} отклонил АПИ сделку {}", principal.getName(), pid);
        apiUserNotificationsAPI.send(apiDealRepository.getApiUserPidByDealPid(pid), ApiUserNotificationType.DECLINED_DEAL, "Сделка №" + pid + " отклонена.");
        return SuccessResponseUtil.toast("Сделка отклонена.");
    }

    @PostMapping("/beforeExport")
    @ResponseBody
    public SuccessResponse<?> beforeExport(HttpServletRequest request, @RequestBody ApiDealsSearchForm form) {
        Map<String, Object> parameters = new HashMap<>();
        List<Long> pids = webApiDealService.findAllPids(form.getWhereStr(parameters), form.getSortStr(), parameters);
        request.getSession().setAttribute("dealsPids", pids);
        return SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty()
                .put("success", true));
    }

    @GetMapping(value = "/export", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @ResponseBody
    public byte[] export(HttpServletRequest request, Principal principal) {
        List<Long> dealsPids = (List<Long>) request.getSession().getAttribute("dealsPids");
        byte[] result = apiDealReportService.loadReport(apiDealRepository.getDealsByPids(dealsPids));
        log.debug("Пользователь {} выгрузил отчет по API сделкам. Количество {}.", principal.getName(), dealsPids.size());
        request.getSession().removeAttribute("dealsPids");
        return result;
    }

    @GetMapping(value = "/getCalculationDeals")
    @ResponseBody
    public SuccessResponse<?> getCalculationDeals(Long userPid) {
        ApiDeal lastPaidDeal = apiUserRepository.getLastPaidDeal(userPid);
        if (Objects.isNull(lastPaidDeal)) {
            lastPaidDeal = apiDealRepository.getFirstDeal(userPid);
        }
        ApiDeal lastDeal = apiDealRepository.getLastDeal(userPid);
        if (Objects.isNull(lastPaidDeal) || lastPaidDeal.getPid().equals(lastDeal.getPid())) {
            return SuccessResponseUtil.getDataObjectNode(JacksonUtil.getEmpty()
                    .put("isEmpty", true)
            );
        }
        ObjectNode lastPaidDealNode = JacksonUtil.getEmpty()
                .put("pid", lastPaidDeal.getPid())
                .put("dateTime", lastPaidDeal.getDateTime()
                        .format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")));

        ObjectNode lastDealNode = JacksonUtil.getEmpty()
                .put("pid", lastDeal.getPid())
                .put("dateTime", lastDeal.getDateTime()
                        .format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")));
        ObjectNode result = JacksonUtil.getEmpty();
        result.set("lastPaidDeal", lastPaidDealNode);
        result.set("lastDeal", lastDealNode);
        return SuccessResponseUtil.getDataObjectNode(result);
    }
}
