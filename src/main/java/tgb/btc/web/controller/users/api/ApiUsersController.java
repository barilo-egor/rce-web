package tgb.btc.web.controller.users.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.repository.web.ApiCalculationRepository;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.service.bean.web.ApiUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.deal.WebApiDealService;
import tgb.btc.web.service.process.ApiCalculationProcessService;
import tgb.btc.web.service.process.ApiUserProcessService;
import tgb.btc.web.service.users.WebApiUsersService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.api.Calculation;
import tgb.btc.web.vo.form.ApiUserVO;

import java.security.Principal;
import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping("/users/api")
@Slf4j
public class ApiUsersController extends BaseController {

    private WebApiUsersService webApiUsersService;

    private ApiUserRepository apiUserRepository;

    private ApiUserProcessService apiUserProcessService;

    private ApiUserService apiUserService;

    private WebApiDealService webApiDealService;

    private ApiCalculationProcessService apiCalculationProcessService;

    private ApiCalculationRepository apiCalculationRepository;

    @Autowired
    public void setApiCalculationRepository(ApiCalculationRepository apiCalculationRepository) {
        this.apiCalculationRepository = apiCalculationRepository;
    }

    @Autowired
    public void setApiCalculationProcessService(
            ApiCalculationProcessService apiCalculationProcessService) {
        this.apiCalculationProcessService = apiCalculationProcessService;
    }

    @Autowired
    public void setWebApiDealService(WebApiDealService webApiDealService) {
        this.webApiDealService = webApiDealService;
    }

    @Autowired
    public void setApiUserService(ApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @Autowired
    public void setApiUserProcessService(ApiUserProcessService apiUserProcessService) {
        this.apiUserProcessService = apiUserProcessService;
    }

    @Autowired
    public void setApiUserRepository(ApiUserRepository apiUserRepository) {
        this.apiUserRepository = apiUserRepository;
    }

    @Autowired
    public void setWebApiUsersService(WebApiUsersService webApiUsersService) {
        this.webApiUsersService = webApiUsersService;
    }

    @GetMapping("/findAll")
    @ResponseBody
    public SuccessResponse<?> findAll(@RequestParam(required = false) String id,
            @RequestParam(required = false) FiatCurrency fiatCurrency,
            @RequestParam(required = false) String token,
            @RequestParam(required = false) String buyRequisite,
            @RequestParam(required = false) String sellRequisite) {
        return SuccessResponseUtil.jsonData(
                webApiUsersService.findAll(id, fiatCurrency, token, buyRequisite, sellRequisite));
    }

    @GetMapping("/generateToken")
    @ResponseBody
    public SuccessResponse<?> generateToken() {
        String token = RandomStringUtils.randomAlphanumeric(42);
        while (apiUserRepository.countByToken(token) > 0) {
            token = RandomStringUtils.randomAlphanumeric(42);
        }
        return SuccessResponseUtil.data(token, data -> JacksonUtil.getEmpty().put("token", data));
    }

    @PostMapping("/save")
    @ResponseBody
    public SuccessResponse<?> update(Principal principal, @RequestBody ApiUserVO apiUser) {
        boolean isUpdate = Objects.nonNull(apiUser.getPid());
        apiUserProcessService.save(apiUser);
        log.debug("Пользователь {} {} API клиента={}", principal.getName(), isUpdate ? "обновил" : "создал", apiUser);
        return SuccessResponseUtil.toast("Клиент сохранен.");
    }

    @GetMapping("/isExistById")
    @ResponseBody
    public SuccessResponse<?> isExistById(String id) {
        return SuccessResponseUtil.data(apiUserRepository.countById(id) > 0,
                data -> JacksonUtil.getEmpty().put("exist", data));
    }

    @PostMapping("/delete")
    @ResponseBody
    public SuccessResponse<?> delete(Principal principal, String deleteUserId,
            @RequestParam(required = false) String newUserId) {
        apiUserService.delete(deleteUserId, newUserId);
        log.debug("Пользователь {} удалил АПИ клиента с id={}", principal.getName(), deleteUserId);
        return SuccessResponseUtil.toast("Клиент удален.");
    }

    @GetMapping("/calculation")
    @ResponseBody
    public SuccessResponse<?> calculation(Long currentDealPid, Long userPid) {
        return new SuccessResponse<>(webApiDealService.getCalculating(currentDealPid, userPid));
    }

    @PostMapping("/saveCalculation")
    @ResponseBody
    public SuccessResponse<?> saveCalculation(Long userPid, Long lastPaidDealPid) {
        apiCalculationProcessService.saveCalculation(userPid, lastPaidDealPid);
        return SuccessResponseUtil.toast("Расчёт произведен.");
    }

    @PostMapping("/tie")
    @ResponseBody
    public SuccessResponse<?> tie(Long apiUserPid, String username) {
        if (StringUtils.isBlank(username)) {
            apiUserProcessService.updateWebUser(apiUserPid, username);
            return SuccessResponseUtil.toast("Пользователь успешно отвязан.");
        }
        apiUserProcessService.updateWebUser(apiUserPid, username);
        return SuccessResponseUtil.toast("Пользователь успешно привязан.");
    }

    @GetMapping("/hasCalculations")
    @ResponseBody
    public SuccessResponse<?> hasCalculations(Long apiUserPid) {
        return SuccessResponseUtil.jsonData(() -> JacksonUtil.getEmpty().put("hasCalculations",
                apiCalculationRepository.countAllByApiUser(apiUserRepository.getById(apiUserPid)) > 0));
    }

    @GetMapping("/getCalculations")
    @ResponseBody
    public ObjectNode getCalculations(Long apiUserPid, Integer page, Integer limit) {
        if (Objects.isNull(apiUserPid)) return JacksonUtil.getEmpty();
        ApiUser apiUser = apiUserRepository.getById(apiUserPid);
        List<Calculation> calculations = apiUserProcessService.getCalculations(apiUser, page - 1, limit);
        ObjectNode result = apiCalculationProcessService.mapToTree(calculations);
        JacksonUtil.pagingData(result, apiCalculationRepository.countAllByApiUser(apiUser));
        return result;
    }

}
