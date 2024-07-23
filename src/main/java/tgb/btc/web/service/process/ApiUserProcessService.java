package tgb.btc.web.service.process;

import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.api.web.INotifier;
import tgb.btc.library.bean.bot.GroupChat;
import tgb.btc.library.bean.web.api.ApiCalculation;
import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.bean.web.api.UsdApiUserCourse;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.library.constants.enums.bot.GroupChatType;
import tgb.btc.library.interfaces.service.bean.bot.IGroupChatService;
import tgb.btc.library.interfaces.service.bean.web.IApiCalculationService;
import tgb.btc.library.interfaces.service.bean.web.IApiUserService;
import tgb.btc.library.interfaces.service.bean.web.IUsdApiUserCourseService;
import tgb.btc.web.interfaces.deal.IWebApiDealService;
import tgb.btc.web.interfaces.process.IApiUserProcessService;
import tgb.btc.web.vo.api.Calculation;
import tgb.btc.web.vo.form.ApiUserVO;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ApiUserProcessService implements IApiUserProcessService {

    private IApiUserService apiUserService;

    private IUsdApiUserCourseService usdApiUserCourseService;

    private IApiCalculationService apiCalculationService;

    private IWebApiDealService webApiDealService;

    private IGroupChatService groupChatService;

    private INotifier notifier;

    @Autowired(required = false)
    public void setNotifier(INotifier notifier) {
        this.notifier = notifier;
    }

    @Autowired
    public void setGroupChatService(IGroupChatService groupChatService) {
        this.groupChatService = groupChatService;
    }

    @Autowired
    public void setApiUserService(IApiUserService apiUserService) {
        this.apiUserService = apiUserService;
    }

    @Autowired
    public void setUsdApiUserCourseService(
            IUsdApiUserCourseService usdApiUserCourseService) {
        this.usdApiUserCourseService = usdApiUserCourseService;
    }

    @Autowired
    public void setApiCalculationService(
            IApiCalculationService apiCalculationService) {
        this.apiCalculationService = apiCalculationService;
    }

    @Autowired
    public void setWebApiDealService(IWebApiDealService webApiDealService) {
        this.webApiDealService = webApiDealService;
    }

    @Override
    public ApiUser save(ApiUserVO apiUserVO) {
        ApiUser apiUser;
        if (Objects.nonNull(apiUserVO.getPid())) {
            apiUser = apiUserService.findById(apiUserVO.getPid());
            apiUser.setIsBanned(apiUserVO.getIsBanned());
            apiUser.setToken(apiUserVO.getToken());
        } else {
            apiUser = new ApiUser();
            apiUser.setRegistrationDate(LocalDate.now());
            apiUser.setIsBanned(false);
            String token = RandomStringUtils.randomAlphanumeric(42);
            while (apiUserService.countByToken(token) > 0) {
                token = RandomStringUtils.randomAlphanumeric(42);
            }
            apiUser.setToken(token);
            List<UsdApiUserCourse> usdApiUserCourseList = new ArrayList<>();
            if (Objects.nonNull(apiUserVO.getUsdCourseBYN())) {
                usdApiUserCourseList.add(usdApiUserCourseService.save(UsdApiUserCourse.builder()
                        .fiatCurrency(FiatCurrency.BYN)
                        .course(apiUserVO.getUsdCourseBYN())
                        .build()));
            }
            if (Objects.nonNull(apiUserVO.getUsdCourseRUB())) {
                usdApiUserCourseList.add(usdApiUserCourseService.save(UsdApiUserCourse.builder()
                        .fiatCurrency(FiatCurrency.BYN)
                        .course(apiUserVO.getUsdCourseRUB())
                        .build()));
            }
            apiUser.setUsdApiUserCourseList(usdApiUserCourseList);
        }
        if (Objects.nonNull(apiUserVO.getUsdCourseBYN())) {
            UsdApiUserCourse byn = apiUser.getCourse(FiatCurrency.BYN);
            if (Objects.isNull(byn)) {
                UsdApiUserCourse usdApiUserCourse = usdApiUserCourseService.save(UsdApiUserCourse.builder()
                        .fiatCurrency(FiatCurrency.BYN)
                        .course(apiUserVO.getUsdCourseBYN())
                        .build());
                apiUser.getUsdApiUserCourseList().add(usdApiUserCourse);
            } else {
                byn.setCourse(apiUserVO.getUsdCourseBYN());
                usdApiUserCourseService.save(byn);
            }
        }
        if (Objects.nonNull(apiUserVO.getUsdCourseRUB())) {
            UsdApiUserCourse rub = apiUser.getCourse(FiatCurrency.RUB);
            if (Objects.isNull(rub)) {
                UsdApiUserCourse usdApiUserCourse = usdApiUserCourseService.save(UsdApiUserCourse.builder()
                        .fiatCurrency(FiatCurrency.RUB)
                        .course(apiUserVO.getUsdCourseRUB())
                        .build());
                apiUser.getUsdApiUserCourseList().add(usdApiUserCourse);
            } else {
                rub.setCourse(apiUserVO.getUsdCourseRUB());
                usdApiUserCourseService.save(rub);
            }
        }
        GroupChat previousChat = apiUser.getGroupChat();
        boolean isChatUpdated = false;
        if (Objects.nonNull(apiUserVO.getGroupChatPid())) {
            if (Objects.isNull(previousChat) || !previousChat.getPid().equals(apiUserVO.getGroupChatPid())) {
                GroupChat groupChat = groupChatService.findById(apiUserVO.getGroupChatPid());
                apiUser.setGroupChat(groupChat);
                isChatUpdated = true;
            }
        } else if (Objects.nonNull(previousChat)) {
            apiUser.setGroupChat(null);
            isChatUpdated = true;
        }
        apiUser.setId(apiUserVO.getId());
        apiUser.setPersonalDiscount(apiUserVO.getPersonalDiscount());
        apiUser.setBuyRequisite(apiUserVO.getBuyRequisite());
        apiUser.setSellRequisite(apiUserVO.getSellRequisite());
        apiUser.setFiatCurrency(apiUserVO.getFiatCurrency());
        apiUser = apiUserService.save(apiUser);
        if (isChatUpdated) {
            if (Objects.nonNull(apiUser.getGroupChat())) {
                notifier.sendGreetingToNewApiDealRequestGroup(apiUserVO.getPid());
                groupChatService.updateTypeByPid(GroupChatType.API_DEAL_REQUEST, apiUserVO.getGroupChatPid());
            }
            if (Objects.nonNull(previousChat)) {
                groupChatService.updateTypeByPid(GroupChatType.DEFAULT, previousChat.getPid());
                notifier.sendGoodbyeToNewApiDealRequestGroup(previousChat.getChatId(), apiUser.getId());
            }
        }
        return apiUser;
    }

    @Override
    public List<Calculation> getCalculations(ApiUser apiUser) {
        List<ApiCalculation> apiCalculations = apiCalculationService.findAllByApiUser(apiUser);
        List<Calculation> calculations = new ArrayList<>();
        for (ApiCalculation apiCalculation : apiCalculations) {
            calculations.add(Calculation.builder()
                    .dateTime(apiCalculation.getDateTime())
                    .dealsCount(apiCalculation.getDeals().size())
                    .children(webApiDealService.getTotalSums(apiCalculation.getDeals()))
                    .build());
        }
        return calculations;
    }

}
