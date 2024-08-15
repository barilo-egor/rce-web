package tgb.btc.web.api.service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.RandomUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.bean.web.api.ApiDeal;
import tgb.btc.library.bean.web.api.ApiPaymentType;
import tgb.btc.library.bean.web.api.ApiRequisite;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.ApiDealType;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.bot.ReceiptFormat;
import tgb.btc.library.constants.enums.properties.VariableType;
import tgb.btc.library.constants.enums.web.ApiDealStatus;
import tgb.btc.library.exception.BaseException;
import tgb.btc.library.interfaces.scheduler.ICurrencyGetter;
import tgb.btc.library.interfaces.service.bean.web.IApiDealService;
import tgb.btc.library.interfaces.service.bean.web.IApiPaymentTypeService;
import tgb.btc.library.interfaces.service.bean.web.IApiRequisiteService;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;
import tgb.btc.library.interfaces.util.IBigDecimalService;
import tgb.btc.library.service.process.CalculateService;
import tgb.btc.library.service.properties.VariablePropertiesReader;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.library.vo.calculate.CalculateDataForm;
import tgb.btc.library.vo.calculate.DealAmount;
import tgb.btc.web.constant.enums.ApiStatusCode;
import tgb.btc.web.constant.enums.ApiUserNotificationType;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.interfaces.api.service.IApiDealProcessService;
import tgb.btc.web.interfaces.process.IFileService;
import tgb.btc.web.service.ApiUserNotificationsAPI;
import tgb.btc.web.service.NotificationsAPI;
import tgb.btc.web.util.ApiResponseUtil;
import tgb.btc.web.vo.form.ApiDealVO;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ApiDealProcessService implements IApiDealProcessService {

    private IApiUserService apiUserService;

    private IApiDealService apiDealService;

    private ICurrencyGetter currencyGetter;

    private CalculateService calculateService;

    private ApiUserNotificationsAPI apiUserNotificationsAPI;

    private VariablePropertiesReader variablePropertiesReader;

    private IBigDecimalService bigDecimalService;

    private INotifier notifier;

    private NotificationsAPI notificationsAPI;

    private IFileService fileService;

    private IApiPaymentTypeService apiPaymentTypeService;

    private IApiRequisiteService apiRequisiteService;

    @Autowired
    public void setApiRequisiteService(IApiRequisiteService apiRequisiteService) {
        this.apiRequisiteService = apiRequisiteService;
    }

    @Autowired
    public void setApiPaymentTypeService(IApiPaymentTypeService apiPaymentTypeService) {
        this.apiPaymentTypeService = apiPaymentTypeService;
    }

    @Autowired
    public void setApiUserService(IApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @Autowired
    public void setFileService(IFileService fileService) {
        this.fileService = fileService;
    }

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

    @Autowired
    public void setNotificationsAPI(NotificationsAPI notificationsAPI) {
        this.notificationsAPI = notificationsAPI;
    }

    @Autowired
    public void setApiDealService(IApiDealService apiDealService) {
        this.apiDealService = apiDealService;
    }

    @Autowired
    public void setBigDecimalService(IBigDecimalService bigDecimalService) {
        this.bigDecimalService = bigDecimalService;
    }

    @Autowired
    public void setVariablePropertiesReader(VariablePropertiesReader variablePropertiesReader) {
        this.variablePropertiesReader = variablePropertiesReader;
    }

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

    public ObjectNode newDeal(String token, DealType dealType, BigDecimal amount, BigDecimal cryptoAmount,
            CryptoCurrency cryptoCurrency, String requisite, FiatCurrency fiatCurrency,
            String apiPaymentTypeId) {
        ApiDealVO apiDealVO = new ApiDealVO(token, dealType, amount, cryptoAmount, cryptoCurrency, requisite,
                fiatCurrency);
        ApiStatusCode code = apiDealVO.verify(true);
        if (Objects.nonNull(code)) {
            log.debug("Отказ по валидности={} в создании АПИ сделки={}", code.name(), apiDealVO);
            return ApiResponseUtil.build(code);
        }
        ApiUser apiUser = apiUserService.getByToken(token);
        ApiPaymentType apiPaymentType = getApiPaymentType(apiPaymentTypeId, apiUser, dealType);
        ApiRequisite apiRequisite = getApiRequisite(apiPaymentType);
        String responseRequisite = Objects.nonNull(apiRequisite)
                ? apiRequisite.getRequisite()
                : null;
        if (StringUtils.isEmpty(responseRequisite) && !DealType.isBuy(dealType)) {
            responseRequisite = variablePropertiesReader.getWallet(cryptoCurrency);
        }
        if (StringUtils.isEmpty(responseRequisite)) {
            if (Objects.isNull(apiPaymentType)) {
                return ApiStatusCode.PAYMENT_TYPE_NOT_FOUND.toJson();
            }
            return ApiStatusCode.REQUISITE_NOT_FOUND.toJson();
        }

        CalculateDataForm.CalculateDataFormBuilder builder = CalculateDataForm.builder();
        if (Objects.isNull(apiDealVO.getFiatCurrency())) {
            apiDealVO.setFiatCurrency(apiUser.getFiatCurrency());
        }
        fiatCurrency = apiDealVO.getFiatCurrency();

        builder.dealType(apiDealVO.getDealType())
                .fiatCurrency(fiatCurrency)
                .usdCourse(apiUser.getCourse(fiatCurrency).getCourse())
                .cryptoCourse(currencyGetter.getCourseCurrency(apiDealVO.getCryptoCurrency()))
                .personalDiscount(apiUser.getPersonalDiscount())
                .cryptoCurrency(apiDealVO.getCryptoCurrency());
        if (Objects.nonNull(apiDealVO.getAmount())) {
            builder.amount(apiDealVO.getAmount());
        } else {
            builder.cryptoAmount(apiDealVO.getCryptoAmount());
        }
        ApiDeal apiDeal = create(apiDealVO, apiUser, calculateService.calculate(builder.build()), apiPaymentType, apiRequisite);
        BigDecimal minSum = variablePropertiesReader.getBigDecimal(VariableType.MIN_SUM, dealType, cryptoCurrency);
        BigDecimal paymentTypeMinSum = Objects.nonNull(apiPaymentType)
                ? apiPaymentType.getMinSum()
                : null;
        if (apiDeal.getCryptoAmount().compareTo(minSum) < 0
                || (Objects.nonNull(paymentTypeMinSum) && apiDeal.getAmount().compareTo(minSum) < 0)) {
            log.debug("Отказ в создании АПИ сделки с суммой меньше минимальной клиенту {}", apiUser.getId());
            return ApiResponseUtil.build(ApiStatusCode.MIN_SUM,
                    JacksonUtil.getEmpty().put("minSum", bigDecimalService.roundToPlainString(minSum, 8)));
        }
        log.debug("АПИ клиент {} создал новую АПИ сделку {}.", apiUser.getId(), apiDeal.getPid());
        apiUserNotificationsAPI.send(apiUser.getPid(), ApiUserNotificationType.CREATED_DEAL,
                "Создана новая сделка №" + apiDeal.getPid());
        return ApiResponseUtil.build(ApiStatusCode.CREATED_DEAL,
                dealData(apiDeal, responseRequisite));
    }

    private ApiPaymentType getApiPaymentType(String apiPaymentTypeId, ApiUser apiUser, DealType dealType) {
        if (StringUtils.isNotEmpty(apiPaymentTypeId)) {
            List<ApiPaymentType> apiPaymentTypes = apiPaymentTypeService.getAvailable(apiUser, dealType);
            Optional<ApiPaymentType> optionalApiPaymentType = apiPaymentTypes.stream()
                    .filter(pt -> pt.getId().equals(apiPaymentTypeId))
                    .findFirst();
            return optionalApiPaymentType.orElse(null);
        } else if (!CollectionUtils.isEmpty(apiUser.getPaymentTypes())) {
            if (CollectionUtils.isEmpty(apiUser.getPaymentTypes()) || apiUser.getPaymentTypes().size() != 1) {
                return null;
            }
            return apiUser.getPaymentTypes().get(0);
        }
        return null;
    }

    private ApiRequisite getApiRequisite(ApiPaymentType apiPaymentType) {
        if (Objects.isNull(apiPaymentType)) {
            return null;
        }
        List<ApiRequisite> apiRequisites = apiRequisiteService.findAll(Example.of(
                        ApiRequisite.builder().apiPaymentType(apiPaymentType).build())).stream()
                .filter(req -> BooleanUtils.isTrue(req.getIsOn()))
                .collect(Collectors.toList());
        if (CollectionUtils.isEmpty(apiRequisites)) {
            return null;
        } else if (apiRequisites.size() == 1) {
            return apiRequisites.get(0);
        } else {
            return apiRequisites.get(RandomUtils.nextInt(apiRequisites.size()));
        }
    }

    public ObjectNode calculate(String token, DealType dealType, BigDecimal amount, BigDecimal cryptoAmount,
            CryptoCurrency cryptoCurrency, FiatCurrency fiatCurrency) {
        ApiDealVO apiDealVO = new ApiDealVO(token, dealType, amount, cryptoAmount, cryptoCurrency, null, fiatCurrency);
        ApiStatusCode code = apiDealVO.verify(false);
        if (Objects.nonNull(code)) {
            log.debug("Отказ по валидности={} в подсчете, token={}", code.name(), token);
            return ApiResponseUtil.build(code);
        }
        ApiUser apiUser = apiUserService.getByToken(token);
        CalculateDataForm.CalculateDataFormBuilder builder = CalculateDataForm.builder();
        fiatCurrency = Objects.nonNull(apiDealVO.getFiatCurrency())
                ? apiDealVO.getFiatCurrency()
                : apiUser.getFiatCurrency();
        builder.dealType(apiDealVO.getDealType())
                .fiatCurrency(fiatCurrency)
                .usdCourse(apiUser.getCourse(fiatCurrency).getCourse())
                .cryptoCourse(currencyGetter.getCourseCurrency(apiDealVO.getCryptoCurrency()))
                .personalDiscount(apiUser.getPersonalDiscount())
                .cryptoCurrency(apiDealVO.getCryptoCurrency());
        if (Objects.nonNull(apiDealVO.getAmount()))
            builder.amount(apiDealVO.getAmount());
        else
            builder.cryptoAmount(apiDealVO.getCryptoAmount());
        DealAmount dealAmount = calculateService.calculate(builder.build());
        BigDecimal minSum = variablePropertiesReader.getBigDecimal(VariableType.MIN_SUM, dealType, cryptoCurrency);
        if (dealAmount.getCryptoAmount().compareTo(minSum) < 0) {
            log.debug("Сумма для подсчета оказалась меньше минимальной: amount={}, cryptoAmount={}, {}",
                    Objects.nonNull(amount) ? amount.toPlainString() : "",
                    Objects.nonNull(cryptoAmount) ? cryptoAmount.toPlainString() : "", apiUser.getId());
            return ApiResponseUtil.build(ApiStatusCode.MIN_SUM,
                    JacksonUtil.getEmpty().put("minSum", bigDecimalService.roundToPlainString(minSum, 8)));
        }
        return ApiResponseUtil.build(ApiStatusCode.AMOUNT_CALCULATED,
                calculateData(dealAmount));
    }

    public ApiDeal create(ApiDealVO apiDealVO, ApiUser apiUser, DealAmount dealAmount, ApiPaymentType apiPaymentType,
            ApiRequisite apiRequisite) {
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
        apiDeal.setApiPaymentType(apiPaymentType);
        apiDeal.setApiRequisite(apiRequisite);
        return apiDealService.save(apiDeal);
    }

    @Override
    public ApiDeal newDispute(Principal principal, MultipartFile file,
            BigDecimal fiatSum, FiatCurrency fiatCurrency,
            DealType dealType, CryptoCurrency cryptoCurrency,
            String requisite) {
        String checkImageId;
        try {
            checkImageId = fileService.saveToTelegram(file);
        } catch (Exception e) {
            log.debug("Ошибка при попытке сохранения чека диспута.", e);
            throw new BaseException("Ошибка при сохранении чека диспута.", e);
        }
        log.debug("Создание диспута пользователем {}. fiatSum={}, fiatCurrency={}, dealType={},"
                        + "cryptoCurrency={}, requisite={}", principal.getName(), fiatSum.toPlainString(), fiatCurrency.name(),
                dealType.name(), cryptoCurrency.name(), requisite);
        ApiUser apiUser = apiUserService.getByUsername(principal.getName());
        CalculateDataForm.CalculateDataFormBuilder builder = CalculateDataForm.builder();
        builder.dealType(dealType)
                .fiatCurrency(fiatCurrency)
                .usdCourse(apiUser.getCourse(fiatCurrency).getCourse())
                .cryptoCourse(currencyGetter.getCourseCurrency(cryptoCurrency))
                .personalDiscount(apiUser.getPersonalDiscount())
                .cryptoCurrency(cryptoCurrency)
                .amount(fiatSum);
        DealAmount dealAmount = calculateService.calculate(builder.build());
        ApiDeal apiDeal = new ApiDeal();
        apiDeal.setApiUser(apiUser);
        apiDeal.setDateTime(LocalDateTime.now());
        apiDeal.setDealType(dealType);
        apiDeal.setAmount(dealAmount.getAmount());
        apiDeal.setCryptoAmount(dealAmount.getCryptoAmount());
        apiDeal.setApiDealStatus(ApiDealStatus.PAID);
        apiDeal.setCryptoCurrency(cryptoCurrency);
        apiDeal.setRequisite(requisite);
        apiDeal.setFiatCurrency(fiatCurrency);
        apiDeal.setApiDealType(ApiDealType.DISPUTE);
        apiDeal.setCheckImageId(checkImageId);
        String originalFileName = file.getOriginalFilename();
        if (StringUtils.isEmpty(originalFileName)) {
            throw new BaseException("Отсутствует originalFileName у файла. Невозможно определить формат.");
        }
        apiDeal.setReceiptFormat(originalFileName.endsWith(".pdf") ? ReceiptFormat.PDF : ReceiptFormat.PICTURE);
        apiDealService.save(apiDeal);
        log.debug("Диспут сохранен под pid={}.", apiDeal.getPid());
        if (Objects.nonNull(notifier))
            notifier.notifyNewApiDeal(apiDeal.getPid());
        notificationsAPI.send(NotificationType.NEW_API_DEAL, "Поступил новый диспут №" + apiDeal.getPid());
        return apiDeal;
    }

    public ObjectNode calculateData(DealAmount dealAmount) {
        ObjectNode data = JacksonUtil.toObjectNode(dealAmount, dAmount -> JacksonUtil.getEmpty()
                .put("amountToPay",
                        DealType.isBuy(dAmount.getDealType())
                                ? bigDecimalService.roundToPlainString(dAmount.getAmount(), 0)
                                : bigDecimalService.roundToPlainString(dAmount.getCryptoAmount(), 8)));
        if (DealType.isBuy(dealAmount.getDealType())) {
            data.put("cryptoAmount", bigDecimalService.roundToPlainString(dealAmount.getCryptoAmount(), 8));
        } else {
            data.put("amount", bigDecimalService.roundToPlainString(dealAmount.getAmount(), 0));
        }
        return data;
    }

    public ObjectNode dealData(ApiDeal apiDeal, String requisite) {
        ObjectNode data = JacksonUtil.toObjectNode(apiDeal, deal -> JacksonUtil.getEmpty()
                .put("id", deal.getPid())
                .put("amountToPay", bigDecimalService.roundToPlainString(deal.getAmountToPay(),
                        DealType.isBuy(deal.getDealType()) ? 0 : 8))
                .put("requisite", requisite));
        if (DealType.isBuy(apiDeal.getDealType())) {
            data.put("cryptoAmount", bigDecimalService.roundToPlainString(apiDeal.getCryptoAmount(), 8));
        } else {
            data.put("amount", bigDecimalService.roundToPlainString(apiDeal.getAmount(), 0));
        }
        return data;
    }

}
