package tgb.btc.web.controller.users.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.interfaces.service.bean.web.IApiCalculationService;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.interfaces.IWebGroupChatService;
import tgb.btc.web.interfaces.deal.IWebApiDealService;
import tgb.btc.web.interfaces.process.IApiCalculationProcessService;
import tgb.btc.web.interfaces.process.IApiUserProcessService;
import tgb.btc.web.interfaces.users.IWebApiUsersService;
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

    private IWebApiUsersService webApiUsersService;

    private IApiUserProcessService apiUserProcessService;

    private IApiUserService apiUserService;

    private IWebApiDealService webApiDealService;

    private IApiCalculationProcessService apiCalculationProcessService;

    private IApiCalculationService apiCalculationService;

    private IWebUserService webUserService;

    private IWebGroupChatService webGroupChatService;

    @Autowired
    public void setWebGroupChatService(IWebGroupChatService webGroupChatService) {
        this.webGroupChatService = webGroupChatService;
    }

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @Autowired
    public void setApiCalculationService(
            IApiCalculationService apiCalculationService) {
        this.apiCalculationService = apiCalculationService;
    }

    @Autowired
    public void setApiCalculationProcessService(
            IApiCalculationProcessService apiCalculationProcessService) {
        this.apiCalculationProcessService = apiCalculationProcessService;
    }

    @Autowired
    public void setWebApiDealService(IWebApiDealService webApiDealService) {
        this.webApiDealService = webApiDealService;
    }

    @Autowired
    public void setApiUserService(IApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @Autowired
    public void setApiUserProcessService(IApiUserProcessService apiUserProcessService) {
        this.apiUserProcessService = apiUserProcessService;
    }

    @Autowired
    public void setWebApiUsersService(IWebApiUsersService webApiUsersService) {
        this.webApiUsersService = webApiUsersService;
    }

    @GetMapping("/findAll")
    @ResponseBody
    public SuccessResponse<?> findAll(@RequestParam(required = false) String id,
            @RequestParam(required = false) FiatCurrency fiatCurrency,
            @RequestParam(required = false) String token) {
        return SuccessResponseUtil.jsonData(
                webApiUsersService.findAll(id, fiatCurrency, token));
    }

    @GetMapping("/generateToken")
    @ResponseBody
    public SuccessResponse<?> generateToken() {
        String token = RandomStringUtils.randomAlphanumeric(42);
        while (apiUserService.countByToken(token) > 0) {
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
        return SuccessResponseUtil.data(apiUserService.countById(id) > 0,
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

    @GetMapping("/hasCalculations")
    @ResponseBody
    public SuccessResponse<?> hasCalculations(Long apiUserPid) {
        return SuccessResponseUtil.jsonData(() -> JacksonUtil.getEmpty().put("hasCalculations",
                apiCalculationService.countAllByApiUser(apiUserService.findById(apiUserPid)) > 0));
    }

    @GetMapping("/getCalculations")
    @ResponseBody
    public ObjectNode getCalculations(Long apiUserPid) {
        if (Objects.isNull(apiUserPid)) return JacksonUtil.getEmpty();
        ApiUser apiUser = apiUserService.findById(apiUserPid);
        List<Calculation> calculations = apiUserProcessService.getCalculations(apiUser);
        ObjectNode result = apiCalculationProcessService.mapToTree(calculations);
        JacksonUtil.pagingData(result, apiCalculationService.countAllByApiUser(apiUser));
        return result;
    }

    @PostMapping("/addWebUser")
    @ResponseBody
    public SuccessResponse<?> addWebUser(String username, Long apiUserPid) {
        webUserService.addWebUser(username, apiUserPid);
        return SuccessResponseUtil.toast("WEB пользователь привязан.");
    }

    @PostMapping("/removeWebUser")
    @ResponseBody
    public SuccessResponse<?> removeWebUser(String username, Long apiUserPid) {
        webUserService.removeWebUser(username, apiUserPid);
        return SuccessResponseUtil.toast("WEB пользователь отвязан.");
    }

    @GetMapping("/getApiDealRequestGroup")
    @ResponseBody
    public SuccessResponse<?> getApiDealRequestGroup(Long apiUserPid) {
        return SuccessResponseUtil.data(webGroupChatService.getApiDealRequests(apiUserPid),
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
}
