package tgb.btc.web.controller.deal.bot;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.api.bot.AdditionalVerificationProcessor;
import tgb.btc.library.repository.bot.DealRepository;
import tgb.btc.library.service.bean.bot.DealService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.mapper.DealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.WebDealService;
import tgb.btc.web.service.deal.bot.BotDealsStoreEmitterService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.util.Objects;

@Controller
@RequestMapping("/deal/bot")
public class BotDealsController extends BaseController {

    private WebDealService webDealService;

    private DealRepository dealRepository;

    private AdditionalVerificationProcessor additionalVerificationProcessor;

    private DealService dealService;

    @Autowired(required = false)
    public void setAdditionalVerificationProcessor(AdditionalVerificationProcessor additionalVerificationProcessor) {
        this.additionalVerificationProcessor = additionalVerificationProcessor;
    }

    @Autowired
    public void setDealService(DealService dealService) {
        this.dealService = dealService;
    }

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

    @PostMapping("/confirm")
    @ResponseBody
    public SuccessResponse<?> confirm(Long pid) {
        dealService.confirm(pid);
        return SuccessResponseUtil.toast("Сделка подтверждена.");
    }

    @PostMapping("/askVerification")
    @ResponseBody
    public SuccessResponse<?> askVerification(Long pid) {
        if (Objects.nonNull(additionalVerificationProcessor)) additionalVerificationProcessor.ask(pid);
        return SuccessResponseUtil.toast("Верификация по сделке " + pid + " запрошена.");
    }

    @RequestMapping(path = "/registerToListener", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter register() {
        SseEmitter sseEmitter = new SseEmitter(-1L);
        BotDealsStoreEmitterService.addListener(sseEmitter);
        return sseEmitter;
    }
}
