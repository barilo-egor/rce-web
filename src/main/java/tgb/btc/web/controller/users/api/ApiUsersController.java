package tgb.btc.web.controller.users.api;

import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.constants.enums.web.RoleConstants;
import tgb.btc.library.repository.web.ApiUserRepository;
import tgb.btc.library.service.bean.web.ApiUserService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.process.ApiUserProcessService;
import tgb.btc.web.service.users.WebApiUsersService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.form.ApiUserVO;

@Controller
@RequestMapping("/users/api")
public class ApiUsersController extends BaseController {

    private WebApiUsersService webApiUsersService;

    private ApiUserRepository apiUserRepository;

    private ApiUserProcessService apiUserProcessService;

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
    public SuccessResponse<?> findAll(@RequestParam(required = false) String username,
                                      @RequestParam(required = false) RoleConstants role,
                                      @RequestParam(required = false) Long chatId) {
        return SuccessResponseUtil.data(webApiUsersService.findAll(username, role, chatId));
    }

    @GetMapping("/generateToken")
    @ResponseBody
    public SuccessResponse<?> generateToken() {
        String token = RandomStringUtils.randomAlphanumeric(40);
        while (apiUserRepository.countByToken(token) > 0) {
            token = RandomStringUtils.randomAlphanumeric(40);
        }
        return SuccessResponseUtil.data(token, data -> JacksonUtil.getEmpty().put("token", data));
    }

    @PostMapping("/save")
    @ResponseBody
    public SuccessResponse<?> update(@RequestBody ApiUserVO apiUser) {
        apiUserProcessService.save(apiUser);
        return SuccessResponseUtil.toast("Клиент сохранен.");
    }
}
