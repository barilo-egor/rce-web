package tgb.btc.web.controller.deal;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.bean.bot.DealPayment;
import tgb.btc.library.constants.enums.properties.PropertiesPath;
import tgb.btc.library.repository.web.DealPaymentRepository;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.service.NotificationsAPI;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import javax.annotation.PostConstruct;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Objects;

@Controller
@RequestMapping("/deal/payment")
public class DealPaymentController extends BaseController {

    private static String TOKEN = null;

    @PostConstruct
    public void setToken() {
        TOKEN = PropertiesPath.CONFIG_PROPERTIES.getString("payment.type.token");
    }

    private DealPaymentRepository dealPaymentRepository;

    private NotificationsAPI notificationsAPI;

    @Autowired
    public void setNotificationsAPI(NotificationsAPI notificationsAPI) {
        this.notificationsAPI = notificationsAPI;
    }

    @Autowired
    public void setDealPaymentRepository(DealPaymentRepository dealPaymentRepository) {
        this.dealPaymentRepository = dealPaymentRepository;
    }

    @PostMapping("/new")
    @ResponseBody
    public ResponseEntity<?> newPayment(String token, String title, String message, String app, String phone, String time) {
        if (Objects.isNull(TOKEN)) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        if (StringUtils.isEmpty(token) || !token.equals(TOKEN)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Instant instant = Instant.ofEpochMilli(Long.parseLong(time));
        LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        notificationsAPI.send(NotificationType.NEW_PAYMENT, "Поступила новая оплата: " + app + ", " + phone + ".");
        dealPaymentRepository.save(DealPayment.builder()
                .title(title)
                .message(message)
                .app(app)
                .phone(phone)
                .dateTime(dateTime)
                .build());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/findAll")
    @ResponseBody
    public SuccessResponse<?> findAll() {
        return SuccessResponseUtil.jsonData(dealPaymentRepository.findAll());
    }
}
