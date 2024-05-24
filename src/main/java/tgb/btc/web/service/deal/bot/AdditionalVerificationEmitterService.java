package tgb.btc.web.service.deal.bot;

import org.springframework.stereotype.Service;
import tgb.btc.api.web.constants.EmitterMessageType;

@Service
public class AdditionalVerificationEmitterService extends BotDealsStoreEmitterService {

    @Override
    public EmitterMessageType getType() {
        return EmitterMessageType.NEW_ADDITIONAL_VERIFICATION;
    }

    @Override
    public void run() {
        sendMessage("Поступила верификация");
    }

}
