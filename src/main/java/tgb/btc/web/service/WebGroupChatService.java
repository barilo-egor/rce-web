package tgb.btc.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.GroupChat;
import tgb.btc.library.constants.enums.bot.GroupChatType;
import tgb.btc.library.interfaces.service.bean.bot.IGroupChatService;
import tgb.btc.web.interfaces.IWebGroupChatService;

import java.util.List;

@Service
public class WebGroupChatService implements IWebGroupChatService {

    private IGroupChatService groupChatService;

    @Autowired
    public void setGroupChatService(IGroupChatService groupChatService) {
        this.groupChatService = groupChatService;
    }

    @Override
    public GroupChat getApiDealRequests() {
        return groupChatService.getByType(GroupChatType.API_DEAL_REQUEST)
                .orElse(GroupChat.empty());
    }

    @Override
    public GroupChat getDealRequests() {
        return groupChatService.getByType(GroupChatType.DEAL_REQUEST)
                .orElse(GroupChat.empty());
    }

    @Override
    public List<GroupChat> getDefaultGroups() {
        return groupChatService.getAllByType(GroupChatType.DEFAULT);
    }

}
