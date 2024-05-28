package tgb.btc.web.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.api.web.INotificationsAPI;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.vo.Notification;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static tgb.btc.web.controller.common.NotificationsController.LISTENERS;

@Service
public class NotificationsAPI implements INotificationsAPI {

    private void send(NotificationType notificationType, String message) {
        Map<SseEmitter, Throwable> emittersToRemove = new HashMap<>();
        synchronized (LISTENERS) {
            LISTENERS.forEach(listener -> {
                try {
                    listener.send(
                            Notification.builder()
                                    .type(notificationType)
                                    .message(message)
                                    .build()
                                    .map()
                    );
                } catch (IOException | IllegalArgumentException e) {
                    emittersToRemove.put(listener, e);
                }
            });
            emittersToRemove.forEach(ResponseBodyEmitter::completeWithError);
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
