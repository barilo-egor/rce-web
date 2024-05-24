package tgb.btc.web.service.deal.bot;

import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.service.EmitterService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class BotDealsStoreEmitterService implements EmitterService {

    protected static final List<SseEmitter> LISTENERS = new ArrayList<>();

    public static void addListener(SseEmitter sseEmitter) {
        synchronized (LISTENERS) {
            LISTENERS.add(sseEmitter);
        }
    }

    protected void sendMessage(String message) {
        Map<SseEmitter, Throwable> emittersToRemove = new HashMap<>();
        synchronized (LISTENERS) {
            LISTENERS.forEach(listener -> {
                try {
                    listener.send(JacksonUtil.getEmpty()
                            .put("message", message)
                    );
                } catch (IOException e) {
                    emittersToRemove.put(listener, e);
                }
            });
            emittersToRemove.forEach(ResponseBodyEmitter::completeWithError);
        }
    }
}
