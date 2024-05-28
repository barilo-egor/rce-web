package tgb.btc.web.controller.main.operator;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tgb.btc.api.bot.AdditionalVerificationProcessor;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.repository.bot.DealRepository;
import tgb.btc.library.service.bean.bot.DealService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.constant.enums.mapper.DealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.deal.WebDealService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.security.Principal;
import java.util.Objects;

@RestController
@RequestMapping(ControllerMapping.BOT_DEAL)
@Slf4j
public class BotDealController extends BaseController {

    private WebDealService webDealService;

    private DealRepository dealRepository;

    private DealService dealService;

    private AdditionalVerificationProcessor additionalVerificationProcessor;

    private INotifier notifier;

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

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
    public ObjectNode findAll(Integer page, Integer limit, Integer start) {
        return JacksonUtil.pagingData(webDealService.findAll(page, limit, start), dealRepository.count(), DealMapper.FIND_ALL);
    }

    @GetMapping("/get")
    public SuccessResponse<?> get(Long pid) {
        return SuccessResponseUtil.data(webDealService.get(pid), DealMapper.GET);
    }

    @PostMapping("/delete")
    public SuccessResponse<?> delete(Principal principal, Long pid, Boolean isBanUser) {
        dealService.deleteDeal(pid, isBanUser);
        log.info("Сделка " + pid + " удалена из веба юзером " + principal.getName());
        return SuccessResponseUtil.toast("Сделка успешно удалена.");
    }

    @PostMapping("/confirm")
    public SuccessResponse<?> confirm(Long pid) {
        dealService.confirm(pid);
        return SuccessResponseUtil.toast("Сделка подтверждена.");
    }

    @PostMapping("/askVerification")
    public SuccessResponse<?> askVerification(Long dealPid) {
        if (Objects.nonNull(additionalVerificationProcessor)) additionalVerificationProcessor.ask(dealPid);
        return SuccessResponseUtil.toast("Верификация по сделке " + dealPid + " запрошена.");
    }

    @PostMapping("/sendMessage")
    public SuccessResponse<?> sendMessage(@RequestParam Long chatId, @RequestParam String message) {
        if (Objects.nonNull(notifier)) notifier.sendNotify(chatId, message);
        return SuccessResponseUtil.toast("Сообщение отправлено.");
    }
}
