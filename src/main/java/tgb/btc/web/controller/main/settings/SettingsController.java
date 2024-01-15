package tgb.btc.web.controller.main.settings;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.properties.PropertiesPath;
import tgb.btc.library.constants.enums.properties.VariableType;
import tgb.btc.library.service.process.CalculateService;
import tgb.btc.library.service.process.CryptoCurrencyService;
import tgb.btc.library.util.FiatCurrencyUtil;
import tgb.btc.library.util.properties.VariablePropertiesUtil;
import tgb.btc.library.vo.calculate.CalculateDataForm;
import tgb.btc.library.vo.calculate.DealAmount;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.vo.form.CourseVO;

import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping(ControllerMapping.SETTINGS)
public class SettingsController extends BaseController {

    private CalculateService calculateService;

    private CryptoCurrencyService cryptoCurrencyService;

    @Autowired
    public void setCryptoCurrencyService(CryptoCurrencyService cryptoCurrencyService) {
        this.cryptoCurrencyService = cryptoCurrencyService;
    }

    @Autowired
    public void setCalculateService(CalculateService calculateService) {
        this.calculateService = calculateService;
    }

    @GetMapping(value = "/usdCourse")
    public String get() {
        return "settings/usdCourse";
    }

    @GetMapping(value = "/getUsdCourses")
    @ResponseBody
    public ObjectNode getCourses() {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayNode fiatCurrencies = objectMapper.createArrayNode();
        for (FiatCurrency fiatCurrencyEnum : FiatCurrencyUtil.getFiatCurrencies()) {
            ObjectNode fiatCurrency = objectMapper.createObjectNode();
            fiatCurrency.put("displayName", fiatCurrencyEnum.name());
            fiatCurrency.put("name", fiatCurrencyEnum.name());
            ArrayNode dealTypes = objectMapper.createArrayNode();
            for (DealType dealTypeEnum : DealType.values()) {
                ObjectNode dealType = objectMapper.createObjectNode();
                dealType.put("displayName", dealTypeEnum.getNominativeFirstLetterToUpper());
                dealType.put("name", dealTypeEnum.name());
                ArrayNode cryptoCurrencies = objectMapper.createArrayNode();
                for (CryptoCurrency cryptoCurrencyEnum : CryptoCurrency.values()) {
                    ObjectNode cryptoCurrency = objectMapper.createObjectNode();
                    cryptoCurrency.put("defaultCheckValue", cryptoCurrencyEnum.getDefaultCheckValue());
                    cryptoCurrency.put("displayName", cryptoCurrencyEnum.name());
                    cryptoCurrency.put("name", cryptoCurrencyEnum.name());
                    cryptoCurrency.put("value",
                            VariablePropertiesUtil.getBigDecimal(VariableType.USD_COURSE, fiatCurrencyEnum, dealTypeEnum, cryptoCurrencyEnum));
                    cryptoCurrencies.add(cryptoCurrency);
                }
                dealType.set("cryptoCurrencies", cryptoCurrencies);
                dealTypes.add(dealType);
            }
            fiatCurrency.set("dealTypes", dealTypes);
            fiatCurrencies.add(fiatCurrency);
        }
        ObjectNode result = objectMapper.createObjectNode();
        result.put("success", true);
        result.set("data", fiatCurrencies);
        return result;
    }

    @GetMapping(value = "/cryptoCourses")
    @ResponseBody
    public ObjectNode cryptoCourses() {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayNode arrayNode = objectMapper.createArrayNode().addAll(Arrays.stream(CryptoCurrency.values())
                .map(cryptoCurrency -> objectMapper.createObjectNode()
                        .put("name", cryptoCurrency.name())
                        .put("currency", cryptoCurrencyService.getCurrency(cryptoCurrency)))
                .collect(Collectors.toList()));
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("success", true);
        objectNode.put("currencies", arrayNode);
        return objectNode;
    }

    @GetMapping(value = "/calculate")
    @ResponseBody
    public ObjectNode calculate(CalculateDataForm calculateDataForm) {
        DealAmount dealAmount = calculateService.calculate(calculateDataForm);
        ObjectNode objectNode = new ObjectMapper().createObjectNode();
        objectNode.put("success", true);
        objectNode.put("amount", dealAmount.getAmount().setScale(0, RoundingMode.CEILING).toPlainString());
        return objectNode;
    }

    @PostMapping(value = "/saveUsdCourses", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ObjectNode saveUsdCourses(@RequestBody List<CourseVO> courses) {
        for (CourseVO courseVO : courses) {
            PropertiesPath.VARIABLE_PROPERTIES.setProperty(VariableType.USD_COURSE.getKey() + "."
                    + courseVO.getFiatCurrency().getCode() + "."
                    + courseVO.getDealType().getKey() + "."
                    + courseVO.getCryptoCurrency().getShortName(), courseVO.getValue());
        }
        PropertiesPath.VARIABLE_PROPERTIES.reload();
        return null;
    }
}
