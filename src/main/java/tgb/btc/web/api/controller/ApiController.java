package tgb.btc.web.api.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.properties.PropertiesPath;
import tgb.btc.library.constants.enums.properties.VariableType;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.repository.web.ApiDealRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.api.service.ApiDealProcessService;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.constant.enums.ApiStatusCode;
import tgb.btc.web.constant.enums.ApiUserNotificationType;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.ApiUserNotificationsAPI;
import tgb.btc.web.service.NotificationsAPI;
import tgb.btc.web.util.RequestUtil;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Slf4j
@Controller
@RequestMapping(ControllerMapping.API10)
public class ApiController extends BaseController {

    private ApiDealRepository apiDealRepository;

    private ApiUserRepository apiUserRepository;

    private ApiDealProcessService apiDealProcessService;

    private INotifier notifier;

    private NotificationsAPI notificationsAPI;

    private ApiUserNotificationsAPI apiUserNotificationsAPI;

    @Autowired
    public void setApiUserNotificationsAPI(ApiUserNotificationsAPI apiUserNotificationsAPI) {
        this.apiUserNotificationsAPI = apiUserNotificationsAPI;
    }

    @Autowired
    public void setNotificationsAPI(NotificationsAPI notificationsAPI) {
        this.notificationsAPI = notificationsAPI;
    }

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

    @Autowired
    public void setApiDealProcessService(ApiDealProcessService apiDealProcessService) {
        this.apiDealProcessService = apiDealProcessService;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Autowired
    public void setApiDealRepository(ApiDealRepository apiDealRepository) {
        this.apiDealRepository = apiDealRepository;
    }

    @GetMapping("/documentation")
    public String documentation() {
        return "apiDocumentation";
    }

    @PostMapping("/new")
    @ResponseBody
    public ObjectNode newDeal(HttpServletRequest request, @RequestParam(required = false) String token,
                              @RequestParam(required = false) String dealType,
                              @RequestParam(required = false) BigDecimal amount,
                              @RequestParam(required = false) BigDecimal cryptoAmount,
                              @RequestParam(required = false) String cryptoCurrency,
                              @RequestParam(required = false) String requisite,
                              @RequestParam(required = false) String fiatCurrency) {
        log.debug("Запрос на создание АПИ сделки IP={}", RequestUtil.getIp(request));
        ApiStatusCode apiStatusCode = hasAccess(token);
        if (Objects.nonNull(apiStatusCode)) {
            return apiStatusCode.toJson();
        }
        return apiDealProcessService.newDeal(token, DealType.valueOfNullable(dealType), amount, cryptoAmount,
                CryptoCurrency.valueOfNullable(cryptoCurrency), requisite, FiatCurrency.valueOfNullable(fiatCurrency));
    }

    @PostMapping("/paid")
    @ResponseBody
    public ObjectNode paid(HttpServletRequest request, @RequestParam(required = false) String token, @RequestParam(required = false) Long id) {
        log.debug("Запрос на оплату АПИ сделки IP={}", RequestUtil.getIp(request));
        ApiStatusCode apiStatusCode = hasAccess(token);
        if (Objects.nonNull(apiStatusCode)) return apiStatusCode.toJson();
        if (Objects.isNull(id)) return ApiStatusCode.DEAL_ID_EXPECTED.toJson();
        if (apiDealRepository.countByPid(id) == 0) {
            log.debug("Запрос на перевод несуществующей сделки {} в статус {}.", id, ApiDealStatus.PAID.name());
            return ApiStatusCode.DEAL_NOT_EXISTS.toJson();
        } else if (ApiDealStatus.PAID.equals(apiDealRepository.getApiDealStatusByPid(id))) {
            log.debug("Повторная попытка перевести сделку {} в статус {}.", id, ApiDealStatus.PAID.name());
            return ApiStatusCode.DEAL_ALREADY_PAID.toJson();
        } else {
            ApiDeal apiDeal = apiDealRepository.getByPid(id);
            if (ApiDealStatus.CANCELED.equals(apiDeal.getApiDealStatus())) return ApiStatusCode.DEAL_CANCELED.toJson();
            LocalDateTime now = LocalDateTime.now();
            if (now.minusMinutes(PropertiesPath.VARIABLE_PROPERTIES.getLong(VariableType.DEAL_ACTIVE_TIME.getKey(), 15L)).isAfter(apiDeal.getDateTime())) {
                log.debug("Время для оплаты по сделке {} вышло.", apiDeal.getPid());
                return ApiStatusCode.PAYMENT_TIME_IS_UP.toJson();
            }
            apiDealRepository.updateApiDealStatusByPid(ApiDealStatus.PAID, id);
            if (Objects.nonNull(notifier)) notifier.notifyNewApiDeal(id);
            notificationsAPI.send(NotificationType.NEW_API_DEAL, "Поступила новая API сделка №" + id);
            apiUserNotificationsAPI.send(apiDeal.getApiUser().getPid(), ApiUserNotificationType.PAID_DEAL, "Оплачена сделка №" + apiDeal.getPid());
            log.debug("АПИ сделка {} переведена в статус {}.", apiDeal.getPid(), apiDeal.getApiDealStatus().name());
            return ApiStatusCode.STATUS_PAID_UPDATED.toJson();
        }
    }

    @PostMapping("/cancel")
    @ResponseBody
    public ObjectNode cancel(HttpServletRequest request, @RequestParam(required = false) String token, @RequestParam(required = false) Long id) {
        log.debug("Запрос на отмену АПИ сделки IP={}", RequestUtil.getIp(request));
        ApiStatusCode apiStatusCode = hasAccess(token);
        if (Objects.nonNull(apiStatusCode)) return apiStatusCode.toJson();
        if (Objects.isNull(id)) return ApiStatusCode.DEAL_ID_EXPECTED.toJson();
        if (apiDealRepository.countByPid(id) == 0) {
            return ApiStatusCode.DEAL_NOT_EXISTS.toJson();
        } else {
            ApiDealStatus status = apiDealRepository.getApiDealStatusByPid(id);
            if (ApiDealStatus.CREATED.equals(status) || ApiDealStatus.PAID.equals(status)) {
                apiDealRepository.updateApiDealStatusByPid(ApiDealStatus.CANCELED, id);
                if (ApiDealStatus.PAID.equals(status)) {
                    notificationsAPI.send(NotificationType.API_DEAL_CANCELED, "API сделка №" + id + " была отменена клиентом");
                }
                log.debug("АПИ сделка {} переведена в статус {}.", id, ApiDealStatus.CANCELED.name());
                apiUserNotificationsAPI.send(apiDealRepository.getApiUserPidByDealPid(id), ApiUserNotificationType.CANCELED_DEAL, "Отмена сделки №" + id);
                return ApiStatusCode.DEAL_DELETED.toJson();
            } else return ApiStatusCode.DEAL_CONFIRMED.toJson();
        }
    }

    @GetMapping("/getStatus")
    @ResponseBody
    public ObjectNode getStatus(HttpServletRequest request, @RequestParam(required = false) String token, @RequestParam(required = false) Long id) {
        log.debug("Запрос на получение статуса АПИ сделки IP={}", RequestUtil.getIp(request));
        ApiStatusCode apiStatusCode = hasAccess(token);
        if (Objects.nonNull(apiStatusCode)) return apiStatusCode.toJson();
        if (Objects.isNull(id)) return ApiStatusCode.DEAL_ID_EXPECTED.toJson();
        log.debug("Запрос статуса АПИ сделки {}.", id);
        if (apiDealRepository.countByPid(id) == 0) {
            return ApiStatusCode.DEAL_NOT_EXISTS.toJson();
        } else {
            return ApiStatusCode.DEAL_EXISTS.toJson()
                    .set("data", JacksonUtil.getEmpty()
                            .put("status", apiDealRepository.getApiDealStatusByPid(id).name()));
        }
    }

    @GetMapping("/getUrl")
    @ResponseBody
    public ObjectNode getUrl() {
        return JacksonUtil.getEmpty()
                .put("success", true)
                .put("data", PropertiesPath.SERVER_PROPERTIES.getString("main.url"));
    }

    @GetMapping("/getFiat")
    @ResponseBody
    public String getFiat() {
        return PropertiesPath.CONFIG_PROPERTIES.getString("bot.fiat.currencies");
    }

    @GetMapping("/statusCodes/new")
    @ResponseBody
    public SuccessResponse<?> statusCodesNew() {
        return SuccessResponseUtil.data(ApiStatusCode.NEW_DEAL_STATUSES);
    }

    @GetMapping("/statusCodes/paid")
    @ResponseBody
    public SuccessResponse<?> statusCodesPaid() {
        return SuccessResponseUtil.data(ApiStatusCode.PAID_STATUSES);
    }

    @GetMapping("/statusCodes/cancel")
    @ResponseBody
    public SuccessResponse<?> statusCodesCancel() {
        return SuccessResponseUtil.data(ApiStatusCode.CANCEL_STATUSES);
    }

    @GetMapping("/statusCodes/getStatuses")
    @ResponseBody
    public SuccessResponse<?> statusCodesGetStatuses() {
        return SuccessResponseUtil.data(ApiStatusCode.GET_STATUS_STATUSES);
    }

    @GetMapping("/getDealStatuses")
    @ResponseBody
    public SuccessResponse<?> getDealStatuses() {
        return SuccessResponseUtil.data(List.of(ApiDealStatus.values()));
    }

    private ApiStatusCode hasAccess(String token) {
        if (StringUtils.isEmpty(token) || apiUserRepository.countByToken(token) == 0) {
            log.debug("Отказ в доступе по токену {}.", token);
            return ApiStatusCode.EMPTY_TOKEN;
        }
        if (BooleanUtils.isTrue(apiUserRepository.isBanned(apiUserRepository.getPidByToken(token)))) {
            log.debug("Отказ в доступе АПИ клиенту в бане с токеном {}.", token);
            return ApiStatusCode.USER_BANNED;
        }
        return null;
    }
}
