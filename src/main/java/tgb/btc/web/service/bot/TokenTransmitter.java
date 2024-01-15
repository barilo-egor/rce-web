package tgb.btc.web.service.bot;

import org.springframework.stereotype.Service;
import tgb.btc.api.bot.ITokenTransmitter;
import tgb.btc.library.constants.enums.properties.PropertiesPath;
import tgb.btc.library.exception.BaseException;
import tgb.btc.web.controller.MainWebController;

@Service
public class TokenTransmitter implements ITokenTransmitter {
    private static final Long AUTH_TIME = PropertiesPath.LOGIN_PROPERTIES.getLong("auth.time", 10L);

    @Override
    public void putWebLoginToken(Long chatId, String token) {
        MainWebController.AVAILABLE_TOKENS.put(chatId, token);
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(AUTH_TIME * 1000);
            } catch (InterruptedException e) {
                throw new BaseException();
            }
            MainWebController.AVAILABLE_TOKENS.remove(chatId);
        });
        thread.start();
    }
}
