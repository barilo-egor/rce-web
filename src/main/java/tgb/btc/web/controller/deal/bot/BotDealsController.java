package tgb.btc.web.controller.deal.bot;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.api.bot.AdditionalVerificationProcessor;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.bot.GroupChatType;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.interfaces.service.bean.bot.IGroupChatService;
import tgb.btc.library.interfaces.service.bean.bot.deal.IReadDealService;
import tgb.btc.library.service.bean.bot.DealService;
import tgb.btc.library.service.process.CalculateService;
import tgb.btc.library.service.process.DealReportService;
import tgb.btc.library.util.BigDecimalUtil;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.library.vo.calculate.DealAmount;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.constant.enums.mapper.DealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.interfaces.IWebGroupChatService;
import tgb.btc.web.service.NotificationsAPI;
import tgb.btc.web.service.deal.WebDealService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.bean.DealVO;
import tgb.btc.web.vo.form.BotDealsSearchForm;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Controller
@RequestMapping("/deal/bot")
@Slf4j
public class BotDealsController extends BaseController {

    private WebDealService webDealService;

    private AdditionalVerificationProcessor additionalVerificationProcessor;

    private DealService dealService;

    private INotifier notifier;

    private NotificationsAPI notificationsAPI;

    private DealReportService dealReportService;

    private IReadDealService readDealService;

    private CalculateService calculateService;

    private IWebGroupChatService webGroupChatService;

    private IGroupChatService groupChatService;

    @Autowired
    public void setGroupChatService(IGroupChatService groupChatService) {
        this.groupChatService = groupChatService;
    }

    @Autowired
    public void setWebGroupChatService(IWebGroupChatService webGroupChatService) {
        this.webGroupChatService = webGroupChatService;
    }

    @Autowired
    public void setNotificationsAPI(NotificationsAPI notificationsAPI) {
        this.notificationsAPI = notificationsAPI;
    }

    @Autowired
    public void setCalculateService(CalculateService calculateService) {
        this.calculateService = calculateService;
    }

    @Autowired
    public void setReadDealService(IReadDealService readDealService) {
        this.readDealService = readDealService;
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
    public ObjectNode findAll(@RequestBody BotDealsSearchForm botDealsSearchForm) {
        Map<String, Object> parameters = new HashMap<>();
        List<DealVO> dealVOList = webDealService.findAll(botDealsSearchForm.getPage(),
                botDealsSearchForm.getLimit(),
                null,
                botDealsSearchForm.getWhereStr(parameters),
                botDealsSearchForm.getSortStr(), parameters);
        return JacksonUtil.pagingData(dealVOList,
                webDealService.count(botDealsSearchForm.getWhereStr(parameters), parameters),
                DealMapper.FIND_ALL);
    }

    @PostMapping("/confirm")
    @ResponseBody
    public SuccessResponse<?> confirm(Principal principal, Long pid, Boolean isNeedRequest) {
        dealService.confirm(pid);
        if (BooleanUtils.isTrue(isNeedRequest)) notifier.sendRequestToWithdraw("веба", principal.getName(), pid);
        notificationsAPI.send(NotificationType.CONFIRM_BOT_DEAL);
        log.debug("Пользователь {} подтвердил сделку из бота {}", principal.getName(), pid);
        return SuccessResponseUtil.toast("Сделка подтверждена.");
    }

    @PostMapping("/askVerification")
    @ResponseBody
    public SuccessResponse<?> askVerification(Principal principal, Long pid) {
        if (Objects.nonNull(additionalVerificationProcessor))
            additionalVerificationProcessor.ask(pid);
        notificationsAPI.send(NotificationType.ADDITIONAL_VERIFICATION_REQUEST);
        log.debug("Пользователь {} запросил верификацию по сделке из бота {}", principal.getName(), pid);
        return SuccessResponseUtil.toast("Верификация по сделке " + pid + " запрошена.");
    }

    @PostMapping("/delete")
    @ResponseBody
    public SuccessResponse<?> delete(Principal principal, Long pid, Boolean isBanUser) {
        if (Objects.nonNull(notifier)) notifier.notifyDealDeletedByAdmin(pid);
        dealService.deleteDeal(pid, isBanUser);
        notificationsAPI.send(NotificationType.DELETE_BOT_DEAL);
        log.debug("Пользователь {} удалил сделку из бота {}", principal.getName(), pid);
        return SuccessResponseUtil.toast("Сделка успешно удалена.");
    }

    @PostMapping("/beforeExport")
    @ResponseBody
    public SuccessResponse<?> beforeExport(HttpServletRequest request, @RequestBody BotDealsSearchForm form) {
        Map<String, Object> parameters = new HashMap<>();
        List<Long> pids = webDealService.findAllPids(form.getWhereStr(parameters), form.getSortStr(), parameters);
        request.getSession().setAttribute("dealsPids", pids);
        return SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty()
                .put("success", true));
    }

    @GetMapping(value = "/export", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @ResponseBody
    public byte[] export(HttpServletRequest request, Principal principal) {
        byte[] result = dealReportService.loadReport(readDealService.getDealsByPids((List<Long>) request.getSession().getAttribute("dealsPids")));
        log.debug("Пользователь {} экспортировал сделки из бота.", principal.getName());
        request.getSession().removeAttribute("dealsPids");
        return result;
    }

    @GetMapping(value = "/calculate")
    @ResponseBody
    public SuccessResponse<?> calculate(@RequestParam(required = false) BigDecimal cryptoAmount,
                                        @RequestParam(required = false) BigDecimal amount,
                                        FiatCurrency fiatCurrency, CryptoCurrency cryptoCurrency, DealType dealType,
                                        @RequestParam(required = false) BigDecimal personalDiscount) {
        boolean isEnteredInCrypto = Objects.nonNull(cryptoAmount);
        DealAmount dealAmount = calculateService.calculate(isEnteredInCrypto ? cryptoAmount : amount, cryptoCurrency,
                fiatCurrency, dealType, isEnteredInCrypto, personalDiscount);
        return SuccessResponseUtil.data(isEnteredInCrypto ? dealAmount.getAmount() : dealAmount.getCryptoAmount(),
                data -> JacksonUtil.getEmpty().put("amount",
                        BigDecimalUtil.roundToPlainString(data, isEnteredInCrypto ? 0 : cryptoCurrency.getScale())));
    }

    @PostMapping("/saveDeal")
    @ResponseBody
    public SuccessResponse<?> saveDeal(Principal principal, DealType dealType, CryptoCurrency cryptoCurrency, BigDecimal cryptoAmount,
                                       FiatCurrency fiatCurrency, BigDecimal amount) {
        Deal deal = webDealService.createManual(principal.getName(), cryptoAmount, amount, cryptoCurrency, dealType, fiatCurrency);
        log.debug("Пользователь {} создал ручную сделку={}", principal.getName(), deal.manualToString());
        return SuccessResponseUtil.toast("Сделка №" + deal.getPid() + " создана");
    }

    @GetMapping("/getDealRequestGroup")
    @ResponseBody
    public SuccessResponse<?> getDealRequestGroup() {
        return SuccessResponseUtil.data(webGroupChatService.getDealRequests(),
                data -> JacksonUtil.getEmpty()
                        .put("title", data.getTitle())
                        .put("pid", data.getPid())
        );
    }

    @GetMapping("/getDefaultGroups")
    @ResponseBody
    public SuccessResponse<?> getDefaultGroups() {
        return SuccessResponseUtil.jsonData(webGroupChatService.getDefaultGroups());
    }

    @PostMapping("/updateDealRequestGroup")
    @ResponseBody
    public SuccessResponse<?> updateDealRequestGroup(Long pid) {
        groupChatService.updateTypeByPid(GroupChatType.DEAL_REQUEST, pid);
        if (Objects.nonNull(notifier)) notifier.sendGreetingToNewGroup();
        notificationsAPI.send(NotificationType.CHANGED_DEAL_REQUEST_GROUP, groupChatService.getByType(GroupChatType.DEAL_REQUEST)
                .orElseThrow(() -> new BaseException("Не найдена группа для отправки запросов сразу после обновления.")));
        return new SuccessResponse<>();
    }
}
