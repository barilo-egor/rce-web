package tgb.btc.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.api.web.IEmitterAPI;
import tgb.btc.api.web.constants.EmitterMessageType;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmitterAPI implements IEmitterAPI {

    private List<EmitterService> emitterServices;

    private final Map<EmitterMessageType, EmitterService> emitterServiceMap = new HashMap<>();

    @Autowired
    public void setEmitterServices(List<EmitterService> emitterServices) {
        this.emitterServices = emitterServices;
    }

    @PostConstruct
    private void initEmitterServices() {
        emitterServices.forEach(emitterService -> emitterServiceMap.put(emitterService.getType(), emitterService));
    }

    @Override
    public void message(EmitterMessageType emitterMessageType) {
        emitterServiceMap.get(emitterMessageType).run();
    }

}
