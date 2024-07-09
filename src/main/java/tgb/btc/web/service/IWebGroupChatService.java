package tgb.btc.web.service;

import tgb.btc.library.bean.bot.GroupChat;

import java.util.List;

public interface IWebGroupChatService {

    GroupChat getDealRequests();

    List<GroupChat> getDefaultGroups();
}
