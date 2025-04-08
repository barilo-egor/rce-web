package tgb.btc.web.controller.merchant;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import tgb.btc.library.service.web.merchant.alfateam.AlfaTeamMerchantService;
import tgb.btc.library.service.web.merchant.payfinity.PayFinityMerchantService;
import tgb.btc.library.vo.web.merchant.alfateam.InvoiceNotification;

import java.util.Objects;

@Controller
@RequestMapping("/merchant")
@Slf4j
public class MerchantReceiver {

    private final String alfaTeamNotificationToken;

    private final AlfaTeamMerchantService alfaTeamMerchantService;

    private final PayFinityMerchantService payFinityMerchantService;

    public MerchantReceiver(@Value("${alfateam.api.notification.token}") String alfaTeamNotificationToken,
                            AlfaTeamMerchantService alfaTeamMerchantService, PayFinityMerchantService payFinityMerchantService) {
        this.alfaTeamNotificationToken = alfaTeamNotificationToken;
        this.alfaTeamMerchantService = alfaTeamMerchantService;
        this.payFinityMerchantService = payFinityMerchantService;
    }

    @PostMapping("/alfateam")
    public ResponseEntity<Object> alfaTeam(HttpServletRequest request, @RequestBody InvoiceNotification invoiceNotification) {
        log.debug("Received request to post alfateam invoice notification: {}", invoiceNotification.toString());
        String notificationToken = request.getHeader("X-Notification-Token");
        if (Objects.nonNull(alfaTeamNotificationToken) && alfaTeamNotificationToken.equals(notificationToken)) {
            alfaTeamMerchantService.updateStatus(invoiceNotification);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/payfinity")
    @ResponseStatus(HttpStatus.OK)
    public void payFinity(@RequestBody PayFinityRequest payFinityRequest) {
        payFinityMerchantService.updateStatus(payFinityRequest.getTrackerID());
    }

    @Data
    public static class PayFinityRequest {

        private String trackerID;
    }
}
