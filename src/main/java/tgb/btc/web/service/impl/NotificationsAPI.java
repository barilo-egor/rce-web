package tgb.btc.web.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.api.web.INotificationsAPI;
import tgb.btc.library.bean.bot.GroupChat;
import tgb.btc.library.interfaces.JsonConvertable;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.vo.Notification;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static tgb.btc.web.controller.common.NotificationsController.LISTENERS;

@Service
@Slf4j
public class NotificationsAPI implements INotificationsAPI {

    public void send(NotificationType notificationType) {
        send(notificationType, null, null, null);
    }

    public void send(NotificationType notificationType, String message) {
        send(notificationType, message, null, null);
    }

    public void send(NotificationType notificationType, JsonConvertable jsonConvertable) {
        send(notificationType, null, jsonConvertable, null);
    }

    public void send(NotificationType notificationType, String message, Principal ignorePrincipal) {
        send(notificationType, message, null, ignorePrincipal);
    }

    public void send(NotificationType notificationType, String message, JsonConvertable jsonConvertable, Principal ignorePrincipal) {
        log.debug("Отправка SSE уведомления {}.", notificationType.name());
        Map<String, Throwable> emittersToRemove = new HashMap<>();
        LISTENERS.forEach((key, value) -> {
            try {
                value.send(
                        Notification.builder()
                                .type(notificationType.name())
                                .message(message)
                                .data(Objects.nonNull(jsonConvertable) ? jsonConvertable.map() : null)
                                .build()
                                .map()
                );
            } catch (IOException | IllegalArgumentException e) {
                emittersToRemove.put(key, e);
            }
        });
        emittersToRemove.forEach((key, value) -> {
            log.debug("Удаление и завершение с ошибкой SSE уведомлений пользователя {}.", key);
            SseEmitter sseEmitter = LISTENERS.get(key);
            if (Objects.nonNull(sseEmitter)) sseEmitter.completeWithError(value);
        });
        emittersToRemove.keySet().forEach(LISTENERS::remove);
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
        send(NotificationType.ADDITIONAL_VERIFICATION_RECEIVE,
                "Поступил отказ верификации по заявке в боте №" + dealPid);
    }

    @Override
    public void sendNotify(String s) {
        send(NotificationType.COURSE_GET_FAILED, s);
    }

    @Override
    public void notifyDeletedDealRequestGroup() {
        send(NotificationType.CHANGED_DEAL_REQUEST_GROUP, "Бот был удален из группы, в которую отправлял запросы на вывод.",
                GroupChat.empty(), null);
    }

}
