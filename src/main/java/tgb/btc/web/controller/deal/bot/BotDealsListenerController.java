package tgb.btc.web.controller.deal.bot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/deal/bot/listener")
@Slf4j
public class BotDealsListenerController extends BaseController {
    private final List<SseEmitter> listeners = new ArrayList<>();



    public void reloadStore() {
        listeners.forEach(sseEmitter -> {
            try {
                sseEmitter.send(SuccessResponseUtil.data(true, data -> JacksonUtil.getEmpty().put("reloadStore", true)));
            } catch (IOException e) {
                sseEmitter.completeWithError(e);
                throw new RuntimeException(e);
            }
        });
    }

}
