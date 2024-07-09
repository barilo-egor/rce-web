package tgb.btc.web.api.service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.properties.VariableType;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.interfaces.scheduler.ICurrencyGetter;
import tgb.btc.library.repository.web.ApiDealRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.service.process.CalculateService;
import tgb.btc.library.util.BigDecimalUtil;
import tgb.btc.library.util.properties.VariablePropertiesUtil;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.library.vo.calculate.CalculateDataForm;
import tgb.btc.library.vo.calculate.DealAmount;
import tgb.btc.web.constant.enums.ApiStatusCode;
import tgb.btc.web.constant.enums.ApiUserNotificationType;
import tgb.btc.web.service.impl.ApiUserNotificationsAPI;
import tgb.btc.web.util.ApiResponseUtil;
import tgb.btc.web.vo.form.ApiDealVO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
@Slf4j
public class ApiDealProcessService {

    private ApiUserRepository apiUserRepository;

    private ApiDealRepository apiDealRepository;

    private ICurrencyGetter currencyGetter;

    private CalculateService calculateService;

    private ApiUserNotificationsAPI apiUserNotificationsAPI;

    @Autowired
    public void setApiUserNotificationsAPI(ApiUserNotificationsAPI apiUserNotificationsAPI) {
        this.apiUserNotificationsAPI = apiUserNotificationsAPI;
    }

    @Autowired
    public void setCurrencyGetter(ICurrencyGetter currencyGetter) {
        this.currencyGetter = currencyGetter;
    }

    @Autowired
    public void setCalculateService(CalculateService calculateService) {
        this.calculateService = calculateService;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Autowired
    public void setApiDealRepository(ApiDealRepository apiDealRepository) {
        this.apiDealRepository = apiDealRepository;
    }

    public ObjectNode newDeal(String token, DealType dealType, BigDecimal amount, BigDecimal cryptoAmount,
                              CryptoCurrency cryptoCurrency, String requisite, FiatCurrency fiatCurrency) {
        ApiDealVO apiDealVO = new ApiDealVO(token, dealType, amount, cryptoAmount, cryptoCurrency, requisite, fiatCurrency);
        ApiStatusCode code = apiDealVO.verify();
        if (Objects.nonNull(code)) {
            log.debug("Отказ по валидности={} в создании АПИ сделки={}", code.name(), apiDealVO);
            return ApiResponseUtil.build(code);
        }

        ApiUser apiUser = apiUserRepository.getByToken(token);
        CalculateDataForm.CalculateDataFormBuilder builder = CalculateDataForm.builder();
        fiatCurrency = Objects.nonNull(apiDealVO.getFiatCurrency())
                ? apiDealVO.getFiatCurrency()
                : apiUser.getFiatCurrency();
        builder.dealType(apiDealVO.getDealType())
                .fiatCurrency(fiatCurrency)
                .usdCourse(apiUser.getCourse(apiUser.getFiatCurrency()).getCourse())
                .cryptoCourse(currencyGetter.getCourseCurrency(apiDealVO.getCryptoCurrency()))
                .personalDiscount(apiUser.getPersonalDiscount())
                .cryptoCurrency(apiDealVO.getCryptoCurrency());
        if (Objects.nonNull(apiDealVO.getAmount())) builder.amount(apiDealVO.getAmount());
        else builder.cryptoAmount(apiDealVO.getCryptoAmount());
        ApiDeal apiDeal = create(apiDealVO, apiUser, calculateService.calculate(builder.build()));
        BigDecimal minSum = VariablePropertiesUtil.getBigDecimal(VariableType.MIN_SUM, dealType, cryptoCurrency);
        if (apiDeal.getCryptoAmount().compareTo(minSum) < 0) {
            log.debug("Отказ в создании АПИ сделки с суммой меньше минимальной клиенту {}", apiUser.getId());
            return ApiResponseUtil.build(ApiStatusCode.MIN_SUM,
                    JacksonUtil.getEmpty().put("minSum", BigDecimalUtil.roundToPlainString(minSum, 8)));
        }
        log.debug("АПИ клиент {} создал новую АПИ сделку {}.", apiUser.getId(), apiDeal.getPid());
        apiUserNotificationsAPI.send(apiUser.getPid(), ApiUserNotificationType.CREATED_DEAL, "Создана новая сделка №" + apiDeal.getPid());
        return ApiResponseUtil.build(ApiStatusCode.CREATED_DEAL,
                dealData(apiDeal, apiUser.getRequisite(apiDeal.getDealType())));
    }

    public ApiDeal create(ApiDealVO apiDealVO, ApiUser apiUser, DealAmount dealAmount) {
        ApiDeal apiDeal = new ApiDeal();
        apiDeal.setApiUser(apiUser);
        apiDeal.setDateTime(LocalDateTime.now());
        apiDeal.setDealType(apiDealVO.getDealType());
        apiDeal.setAmount(dealAmount.getAmount());
        apiDeal.setCryptoAmount(dealAmount.getCryptoAmount());
        apiDeal.setApiDealStatus(ApiDealStatus.CREATED);
        apiDeal.setCryptoCurrency(apiDealVO.getCryptoCurrency());
        apiDeal.setRequisite(apiDealVO.getRequisite());
        apiDeal.setFiatCurrency(apiDealVO.getFiatCurrency());
        return apiDealRepository.save(apiDeal);
    }

    public ObjectNode dealData(ApiDeal apiDeal, String requisite) {
        ObjectNode data = JacksonUtil.toObjectNode(apiDeal, deal -> JacksonUtil.getEmpty()
                .put("id", deal.getPid())
                .put("amountToPay", BigDecimalUtil.roundToPlainString(deal.getAmountToPay(), 8))
                .put("requisite", requisite));
        if (DealType.isBuy(apiDeal.getDealType())) data.put("cryptoAmount", BigDecimalUtil.roundToPlainString(apiDeal.getCryptoAmount(), 8));
        else data.put("amount", apiDeal.getAmount());
        return data;
    }
}
