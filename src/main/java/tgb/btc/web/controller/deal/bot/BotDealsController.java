package tgb.btc.web.controller.deal.bot;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.api.bot.AdditionalVerificationProcessor;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.service.bean.bot.DealService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.constant.enums.mapper.DealMapper;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.WebDealService;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.DealsSearchForm;
import tgb.btc.web.vo.SuccessResponse;
import tgb.btc.web.vo.bean.DealVO;

import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping("/deal/bot")
public class BotDealsController extends BaseController {

    private WebDealService webDealService;

    private AdditionalVerificationProcessor additionalVerificationProcessor;

    private DealService dealService;

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
    public void setWebDealService(WebDealService webDealService) {
        this.webDealService = webDealService;
    }

    @PostMapping("/findAll")
    @ResponseBody
    public ObjectNode findAll(@RequestBody DealsSearchForm dealsSearchForm) {
        List<DealVO> dealVOList = webDealService.findAll(dealsSearchForm.getPage(),
                dealsSearchForm.getLimit(),
                null,
                dealsSearchForm.getWhereStr(),
                dealsSearchForm.getSortStr());
        return JacksonUtil.pagingData(dealVOList,
                webDealService.count(dealsSearchForm.getWhereStr()),
                DealMapper.FIND_ALL);
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
        if (Objects.nonNull(additionalVerificationProcessor))
            additionalVerificationProcessor.ask(pid);
        return SuccessResponseUtil.toast("Верификация по сделке " + pid + " запрошена.");
    }

    @PostMapping("/delete")
    @ResponseBody
    public SuccessResponse<?> delete(Long pid, Boolean isBanUser) {
        notifier.notifyDealDeletedByAdmin(pid);
        dealService.deleteDeal(pid, isBanUser);
        return SuccessResponseUtil.toast("Сделка успешно удалена.");
    }

}
