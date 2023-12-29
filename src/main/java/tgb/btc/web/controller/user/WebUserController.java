package tgb.btc.web.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.constant.enums.mapper.WebUserMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

@Controller
@RequestMapping(ControllerMapping.WEB_USER)
public class WebUserController extends BaseController {

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @GetMapping("/findAll")
    @ResponseBody
    public SuccessResponse<?> findAll() {
        return SuccessResponseUtil.data(webUserRepository.findAll(), WebUserMapper.FIND_ALL);
    }
}
