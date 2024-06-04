package tgb.btc.web.controller.deal.bot;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.api.bot.AdditionalVerificationProcessor;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.constants.enums.CreateType;
import tgb.btc.library.constants.enums.bot.*;
import tgb.btc.library.repository.bot.DealRepository;
import tgb.btc.library.repository.bot.UserRepository;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.service.bean.bot.DealService;
import tgb.btc.library.service.process.CalculateService;
import tgb.btc.library.service.process.DealReportService;
import tgb.btc.library.util.BigDecimalUtil;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.library.vo.calculate.DealAmount;
import tgb.btc.web.constant.enums.mapper.DealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.deal.WebDealService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.bean.DealVO;
import tgb.btc.web.vo.form.BotDealsSearchForm;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    private CalculateService calculateService;

    private WebUserRepository webUserRepository;

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Autowired
    public void setCalculateService(CalculateService calculateService) {
        this.calculateService = calculateService;
    }

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
        if (Objects.nonNull(notifier)) notifier.notifyDealDeletedByAdmin(pid);
        dealService.deleteDeal(pid, isBanUser);
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
    public byte[] export(HttpServletRequest request) {
        byte[] result = dealReportService.loadReport(dealRepository.getDealsByPids((List<Long>) request.getSession().getAttribute("dealsPids")));
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
        Deal deal = dealService.save(Deal.builder()
                .user(userRepository.getByChatId(webUserRepository.getByUsername(principal.getName()).getChatId()))
                .dateTime(LocalDateTime.now())
                .date(LocalDate.now())
                .cryptoAmount(cryptoAmount)
                .amount(amount)
                .wallet("operator_deal")
                .cryptoCurrency(cryptoCurrency)
                .dealType(dealType)
                .fiatCurrency(fiatCurrency)
                .dealStatus(DealStatus.CONFIRMED)
                .deliveryType(DeliveryType.STANDARD)
                .createType(CreateType.MANUAL)
                .build());
        return SuccessResponseUtil.toast("Сделка №" + deal.getPid() + " создана");
    }
}
