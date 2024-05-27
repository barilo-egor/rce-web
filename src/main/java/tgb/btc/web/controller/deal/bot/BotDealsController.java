package tgb.btc.web.controller.deal.bot;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.api.bot.AdditionalVerificationProcessor;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.repository.bot.DealRepository;
import tgb.btc.library.service.bean.bot.DealService;
import tgb.btc.library.service.process.DealReportService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.mapper.DealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.WebDealService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.DealsSearchForm;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.bean.DealVO;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Controller
@RequestMapping("/deal/bot")
public class BotDealsController extends BaseController {

    private WebDealService webDealService;

    private AdditionalVerificationProcessor additionalVerificationProcessor;

    private DealService dealService;

    private INotifier notifier;

    private DealReportService dealReportService;

    private DealRepository dealRepository;

    @Autowired
    public void setDealRepository(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @Autowired
    public void setDealReportService(DealReportService dealReportService) {
        this.dealReportService = dealReportService;
    }

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

    @Autowired(required = false)
    public void setAdditionalVerificationProcessor(AdditionalVerificationProcessor additionalVerificationProcessor) {
        this.additionalVerificationProcessor = additionalVerificationProcessor;
    }

    @Autowired
    public void setDealService(DealService dealService) {
        this.dealService = dealService;
    }

    @Autowired
    public void setWebDealService(WebDealService webDealService) {
        this.webDealService = webDealService;
    }

    @PostMapping("/findAll")
    @ResponseBody
    public ObjectNode findAll(@RequestBody DealsSearchForm dealsSearchForm) {
        Map<String, Object> parameters = new HashMap<>();
        List<DealVO> dealVOList = webDealService.findAll(dealsSearchForm.getPage(),
                dealsSearchForm.getLimit(),
                null,
                dealsSearchForm.getWhereStr(parameters),
                dealsSearchForm.getSortStr(parameters), parameters);
        return JacksonUtil.pagingData(dealVOList,
                webDealService.count(dealsSearchForm.getWhereStr(parameters), parameters),
                DealMapper.FIND_ALL);
    }

    @PostMapping("/confirm")
    @ResponseBody
    public SuccessResponse<?> confirm(Long pid) {
        dealService.confirm(pid);
        return SuccessResponseUtil.toast("Сделка подтверждена.");
    }

    @PostMapping("/askVerification")
    @ResponseBody
    public SuccessResponse<?> askVerification(Long pid) {
        if (Objects.nonNull(additionalVerificationProcessor))
            additionalVerificationProcessor.ask(pid);
        return SuccessResponseUtil.toast("Верификация по сделке " + pid + " запрошена.");
    }

    @PostMapping("/delete")
    @ResponseBody
    public SuccessResponse<?> delete(Long pid, Boolean isBanUser) {
        notifier.notifyDealDeletedByAdmin(pid);
        dealService.deleteDeal(pid, isBanUser);
        return SuccessResponseUtil.toast("Сделка успешно удалена.");
    }

    @PostMapping("/beforeExport")
    @ResponseBody
    public SuccessResponse<?> beforeExport(HttpServletRequest request, @RequestBody DealsSearchForm form) {
        Map<String, Object> parameters = new HashMap<>();
        List<Long> pids = webDealService.findAllPids(form.getWhereStr(parameters), form.getSortStr(parameters), parameters);
        request.getSession().setAttribute("dealsPids", pids);
        return SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty()
                .put("success", true));
    }

    @GetMapping(value =  "/export", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @ResponseBody
    public byte[] export(HttpServletRequest request) {
        byte[] result = dealReportService.loadReport(dealRepository.getDealsByPids((List<Long>) request.getSession().getAttribute("dealsPids")));
        request.getSession().removeAttribute("dealsPids");
        return result;
    }
}
