package tgb.btc.web.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.web.constant.enums.ApiUserNotificationType;
import tgb.btc.web.vo.Notification;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static tgb.btc.web.controller.dashboard.api.ApiUserNotificationsController.LISTENERS;


@Service
@Slf4j
public class ApiUserNotificationsAPI {

    public void send(Long userPid, ApiUserNotificationType notificationType, String message) {
        log.debug("Отправка SSE уведомления API пользователю {}.", notificationType.name());
        Map<Long, Throwable> emittersToRemove = new HashMap<>();
        try {
            SseEmitter sseEmitter = LISTENERS.get(userPid);
            if (Objects.isNull(sseEmitter)) return;
            sseEmitter.send(Notification.builder()
                    .type(notificationType.name())
                    .message(message)
                    .build()
                    .map());
        } catch (IOException | IllegalArgumentException e) {
            emittersToRemove.put(userPid, e);
        }
        emittersToRemove.forEach((key, value) -> {
            log.debug("Удаление и завершение с ошибкой SSE уведомлений пользователя {}.", key);
            SseEmitter sseEmitter = LISTENERS.get(key);
            if (Objects.nonNull(sseEmitter)) {
                sseEmitter.completeWithError(value);
            }
        });
        emittersToRemove.keySet().forEach(LISTENERS::remove);
    }
}
