package tgb.btc.web.service;

import tgb.btc.api.web.constants.EmitterMessageType;

public interface EmitterService extends Runnable {

    EmitterMessageType getType();
}
