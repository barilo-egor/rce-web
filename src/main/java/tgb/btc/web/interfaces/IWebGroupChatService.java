package tgb.btc.web.interfaces;

import tgb.btc.library.bean.bot.GroupChat;

import java.util.List;

public interface IWebGroupChatService {

    GroupChat getDealRequests();

    GroupChat getAutoWithdrawal();

    List<GroupChat> getDefaultGroups();

    GroupChat getApiDealRequests(Long apiUserPid);
}
