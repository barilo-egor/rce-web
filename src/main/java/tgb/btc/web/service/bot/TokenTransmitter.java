package tgb.btc.web.service.bot;

import org.springframework.stereotype.Service;
import tgb.btc.api.bot.ITokenTransmitter;

@Service
public class TokenTransmitter implements ITokenTransmitter {

    @Override
    public void putWebLoginToken(Long chatId, String token) {

    }

    @Override
    public void remove(Long aLong) {

    }
}
