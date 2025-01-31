package tgb.btc.web.controller.deal.bot;

import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.api.bot.AdditionalVerificationProcessor;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.constants.enums.bot.*;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.interfaces.service.bean.bot.IGroupChatService;
import tgb.btc.library.interfaces.service.bean.bot.deal.IModifyDealService;
import tgb.btc.library.interfaces.service.bean.bot.deal.IReadDealService;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.library.interfaces.util.IBigDecimalService;
import tgb.btc.library.interfaces.web.ICryptoWithdrawalService;
import tgb.btc.library.service.process.CalculateService;
import tgb.btc.library.service.process.DealReportService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.library.vo.calculate.DealAmount;
import tgb.btc.library.vo.web.PoolDeal;
import tgb.btc.web.annotations.ExtJSResponse;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.interfaces.IWebGroupChatService;
import tgb.btc.web.interfaces.deal.IWebDealService;
import tgb.btc.web.interfaces.map.IDealMappingService;
import tgb.btc.web.interfaces.users.IWebWebUsersService;
import tgb.btc.web.service.NotificationsAPI;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.form.BotDealsSearchForm;

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

    @Value("${bot.username}")
    private String botUsername;

    private IWebDealService webDealService;

    private AdditionalVerificationProcessor additionalVerificationProcessor;

    private IModifyDealService modifyDealService;

    private INotifier notifier;

    private NotificationsAPI notificationsAPI;

    private DealReportService dealReportService;

    private IReadDealService readDealService;

    private CalculateService calculateService;

    private IWebGroupChatService webGroupChatService;

    private IGroupChatService groupChatService;

    private IDealMappingService dealMappingService;

    private IBigDecimalService bigDecimalService;

    private ICryptoWithdrawalService cryptoWithdrawalService;

    private IWebWebUsersService webWebUsersService;

    @Autowired
    public void setWebWebUsersService(IWebWebUsersService webWebUsersService) {
        this.webWebUsersService = webWebUsersService;
    }

    @Autowired
    public void setCryptoWithdrawalService(ICryptoWithdrawalService cryptoWithdrawalService) {
        this.cryptoWithdrawalService = cryptoWithdrawalService;
    }

    @Autowired
    public void setModifyDealService(IModifyDealService modifyDealService) {
        this.modifyDealService = modifyDealService;
    }

    @Autowired
    public void setBigDecimalService(IBigDecimalService bigDecimalService) {
        this.bigDecimalService = bigDecimalService;
    }

    @Autowired
    public void setDealMappingService(IDealMappingService dealMappingService) {
        this.dealMappingService = dealMappingService;
    }

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
    public void setWebDealService(IWebDealService webDealService) {
        this.webDealService = webDealService;
    }

    @PostMapping("/findAll")
    @ResponseBody
    public ObjectNode findAll(@RequestBody BotDealsSearchForm botDealsSearchForm) {
        Map<String, Object> parameters = new HashMap<>();
        List<Deal> deals = webDealService.findAll(botDealsSearchForm.getPage(),
                botDealsSearchForm.getLimit(),
                null,
                botDealsSearchForm.getWhereStr(parameters),
                botDealsSearchForm.getSortStr(), parameters);
        return JacksonUtil.pagingData(deals,
                webDealService.count(botDealsSearchForm.getWhereStr(parameters), parameters),
                deal -> dealMappingService.mapFindAll(deal));
    }

    @PostMapping("/confirm")
    @ResponseBody
    public SuccessResponse<?> confirm(Principal principal, Long pid, Boolean isNeedRequest) {
        modifyDealService.confirm(pid);
        new Thread(() -> cryptoWithdrawalService.deleteFromPool(botUsername, pid)).start();
        if (BooleanUtils.isTrue(isNeedRequest)) notifier.sendRequestToWithdrawDeal("веба", principal.getName(), pid);
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
        modifyDealService.deleteDeal(pid, isBanUser);
        new Thread(() -> cryptoWithdrawalService.deleteFromPool(botUsername, pid)).start();
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
                        bigDecimalService.roundToPlainString(data, isEnteredInCrypto ? 0 : cryptoCurrency.getScale())));
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

    @GetMapping("/getAutoWithdrawalGroup")
    @ResponseBody
    public SuccessResponse<?> getAutoWithdrawalGroup() {
        return SuccessResponseUtil.data(webGroupChatService.getAutoWithdrawal(),
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
        if (Objects.nonNull(notifier)) notifier.sendGreetingToNewDealRequestGroup();
        notificationsAPI.send(NotificationType.CHANGED_DEAL_REQUEST_GROUP, groupChatService.getAllByType(GroupChatType.DEAL_REQUEST).stream().findFirst()
                .orElseThrow(() -> new BaseException("Не найдена группа для отправки запросов сразу после обновления.")));
        return new SuccessResponse<>();
    }

    @PostMapping("/updateAutoWithdrawalGroup")
    @ResponseBody
    public SuccessResponse<?> updateAutoWithdrawalGroup(Long pid) {
        groupChatService.updateTypeByPid(GroupChatType.AUTO_WITHDRAWAL, pid);
        if (Objects.nonNull(notifier)) notifier.sendGreetingToNewAutoWithdrawalGroup();
        notificationsAPI.send(NotificationType.CHANGED_AUTO_WITHDRAWAL_GROUP, groupChatService.getAllByType(GroupChatType.AUTO_WITHDRAWAL).stream().findFirst()
                .orElseThrow(() -> new BaseException("Не найдена группа для отправки автовыводов сразу после обновления.")));
        return new SuccessResponse<>();
    }

    @GetMapping("/getBalance/{currency}")
    @ResponseBody
    public SuccessResponse<?> getBalance(Principal principal, @PathVariable CryptoCurrency currency) {
        if (!webWebUsersService.hasAccess(RoleConstants.ROLE_ADMIN, principal.getName())) {
            return SuccessResponseUtil.data(false, data -> JacksonUtil.getEmpty().put("value", data));
        }
        return SuccessResponseUtil.data(cryptoWithdrawalService.getBalance(currency),
                data -> JacksonUtil.getEmpty().put("value", data.toPlainString()));
    }

    @PostMapping("/autoWithdrawal/{dealPid}")
    @ResponseBody
    public SuccessResponse<?> autoWithdrawal(Principal principal, @PathVariable Long dealPid) {
        log.debug("Запрос на вывод сделки {} пользователем {}.", dealPid, principal.getName());
        if (!groupChatService.hasAutoWithdrawal())
            throw new BaseException("Не найдена установленная группа для автовывода сделок. " +
                    "Добавьте бота в группу, выдайте разрешения на отправку сообщений и выберите группу на сайте в " +
                    "разделе \"Сделки из бота\".\n");
        Deal deal = readDealService.findByPid(dealPid);
        cryptoWithdrawalService.withdrawal(deal.getCryptoCurrency(), deal.getCryptoAmount(), deal.getWallet());
        new Thread(() -> cryptoWithdrawalService.deleteFromPool(botUsername, dealPid)).start();
        notificationsAPI.send(NotificationType.CONFIRM_BOT_DEAL);
        notifier.sendAutoWithdrawDeal("веба", principal.getName(), dealPid);
        return SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty().put("value", data));
    }

    @GetMapping("/poolDeals")
    @ExtJSResponse
    public ResponseEntity<List<ObjectNode>> poolDeals(@RequestParam CryptoCurrency cryptoCurrency) {
        return new ResponseEntity<>(dealMappingService.mapPool(cryptoWithdrawalService.getAllPoolDeals()), HttpStatus.OK);
    }

    @PostMapping("/clearPool")
    @ExtJSResponse
    public ResponseEntity<Boolean> clearPool(Principal principal, @RequestParam CryptoCurrency cryptoCurrency) {
        log.debug("Запрос на очищение пула пользователем {}.", principal.getName());
        cryptoWithdrawalService.clearPool();
        log.debug("Пул очищен.");
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    private IWebUserService webUserService;

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @PostMapping("/addToPool")
    @ExtJSResponse
    public ResponseEntity<Boolean> addToPool(Principal principal, @RequestParam Long pid) {
        log.debug("Запрос на добавление сделки {} в пул пользователем {}.", pid, principal.getName());
        Deal deal = readDealService.findByPid(pid);
        cryptoWithdrawalService.addPoolDeal(PoolDeal.builder()
                .pid(pid)
                .bot(botUsername)
                .amount(deal.getCryptoAmount().toPlainString())
                .address(deal.getWallet())
                .build());
        modifyDealService.updateDealStatusByPid(DealStatus.AWAITING_WITHDRAWAL, pid);
        log.debug("Сделка {} добавлена в пул.", pid);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @DeleteMapping("/removeFromPool")
    @ExtJSResponse
    public ResponseEntity<Boolean> removeFromPool(Principal principal, @RequestParam Long id) {
        log.debug("Запрос на удаление сделки id={} из пула пользователем {}.", id, principal.getName());
        cryptoWithdrawalService.deleteFromPool(PoolDeal.builder().id(id).build());
        log.debug("Сделка id={} удалена из пула", id);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @PostMapping("/completePool")
    @ExtJSResponse
    public ResponseEntity<Boolean> completePool(Principal principal, @RequestParam CryptoCurrency cryptoCurrency) {
        log.debug("Запрос на завершение пула пользователем {}.", principal.getName());
        cryptoWithdrawalService.complete();
        log.debug("Пул завершен.");
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @PostMapping("/changeWallet")
    @ExtJSResponse
    public ResponseEntity<Boolean> changeWallet(Principal principal, CryptoCurrency cryptoCurrency, String seedPhrase) {
        log.debug("Запрос на замену кошелька пользователем {}.", principal.getName());
        cryptoWithdrawalService.changeWallet(cryptoCurrency, seedPhrase);
        log.debug("Кошелек заменен.");
        return new ResponseEntity<>(true, HttpStatus.OK);
    }
}
