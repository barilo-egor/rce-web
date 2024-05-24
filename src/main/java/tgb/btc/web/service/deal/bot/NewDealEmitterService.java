package tgb.btc.web.service.deal.bot;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.api.web.constants.EmitterMessageType;
import tgb.btc.library.util.web.JacksonUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class NewDealEmitterService extends BotDealsStoreEmitterService {

    @Override
    public EmitterMessageType getType() {
        return EmitterMessageType.NEW_BOT_DEAL;
    }

    @Override
    public void run() {
        Map<SseEmitter, Throwable> emittersToRemove = new HashMap<>();
        LISTENERS.forEach(listener -> {
            try {
                listener.send(JacksonUtil.getEmpty()
                        .put("message", "Поступила новая сделка")
                );
            } catch (IOException e) {
                emittersToRemove.put(listener, e);
            }
        });
        emittersToRemove.forEach(ResponseBodyEmitter::completeWithError);
    }

}
