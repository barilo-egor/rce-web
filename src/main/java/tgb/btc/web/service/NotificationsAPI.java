package tgb.btc.web.service;

import org.springframework.stereotype.Service;
import tgb.btc.api.web.INotificationsAPI;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.vo.Notification;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import static tgb.btc.web.controller.common.NotificationsController.LISTENERS;

@Service
public class NotificationsAPI implements INotificationsAPI {

    public void send(NotificationType notificationType) {
        send(notificationType, null);
    }

    public void send(NotificationType notificationType, String message) {
        send(notificationType, message, null);
    }

    public void send(NotificationType notificationType, String message, Principal ignorePrincipal) {
        Map<String, Throwable> emittersToRemove = new HashMap<>();
        synchronized (LISTENERS) {
            LISTENERS.forEach((key, value) -> {
                try {
                    value.send(
                            Notification.builder()
                                    .type(notificationType)
                                    .message(message)
                                    .build()
                                    .map()
                    );
                } catch (IOException | IllegalArgumentException e) {
                    emittersToRemove.put(key, e);
                }
            });
            emittersToRemove.forEach((key, value) -> LISTENERS.get(key).completeWithError(value));
            emittersToRemove.keySet().forEach(LISTENERS::remove);
        }
    }

    @Override
    public void newBotDeal(Long dealPid) {
        send(NotificationType.NEW_BOT_DEAL, "Поступила новая заявка из бота №" + dealPid);
    }

    @Override
    public void additionalVerificationReceived(Long dealPid) {
        send(NotificationType.ADDITIONAL_VERIFICATION_RECEIVE, "Поступила верификация по заявке в боте №" + dealPid);
    }

    @Override
    public void declinedVerificationReceived(Long dealPid) {
        send(NotificationType.ADDITIONAL_VERIFICATION_RECEIVE, "Поступил отказ верификации по заявке в боте №" + dealPid);
    }
}
