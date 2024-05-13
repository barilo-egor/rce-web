package tgb.btc.web.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.constant.enums.mapper.WebUserMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.process.WebUserProcessService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.form.WebUserVO;

@Controller
@RequestMapping(ControllerMapping.WEB_USER)
public class WebUserController extends BaseController {

    private WebUserRepository webUserRepository;

    private WebUserProcessService webUserProcessService;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Autowired
    public void setWebUserProcessService(WebUserProcessService webUserProcessService) {
        this.webUserProcessService = webUserProcessService;
    }

    @GetMapping("/findAll")
    @ResponseBody
    public SuccessResponse<?> findAll() {
        return SuccessResponseUtil.data(webUserRepository.findAll(), WebUserMapper.FIND_ALL);
    }

    @PostMapping("/update")
    @ResponseBody
    public SuccessResponse<?> update(@RequestBody WebUserVO webUser) {
        webUserProcessService.update(webUser);
        return SuccessResponseUtil.toast("Пользователь " + webUser.getUsername() + " обновлен.");
    }

    @PostMapping("/remove")
    @ResponseBody
    public SuccessResponse<?> update(@RequestParam Long pid) {
        webUserRepository.deleteById(pid);
        return SuccessResponseUtil.toast("Пользователь удален.");
    }

    @GetMapping("/isExist")
    @ResponseBody
    public SuccessResponse<?> isExist(String loginField) {
        boolean isExist;
        try {
            Long chatId = Long.parseLong(loginField);
            isExist = webUserRepository.existsByChatId(chatId);
        } catch (NumberFormatException e) {
            isExist = webUserRepository.existsByUsername(loginField);
        }
        return SuccessResponseUtil.data(isExist, data -> JacksonUtil.getEmpty().put("isExist", data));
    }
}
