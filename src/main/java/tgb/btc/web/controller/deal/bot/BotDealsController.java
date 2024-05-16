package tgb.btc.web.controller.deal.bot;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.repository.bot.DealRepository;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.mapper.DealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.WebDealService;

@Controller
@RequestMapping("/deal/bot")
public class BotDealsController extends BaseController {

    private WebDealService webDealService;

    private DealRepository dealRepository;

    @Autowired
    public void setDealRepository(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @Autowired
    public void setWebDealService(WebDealService webDealService) {
        this.webDealService = webDealService;
    }

    @GetMapping("/findAll")
    @ResponseBody
    public ObjectNode findAll(Integer page, Integer limit, Integer start) {
        return JacksonUtil.pagingData(webDealService.findAll(page, limit, start), dealRepository.count(), DealMapper.FIND_ALL);
    }
}
