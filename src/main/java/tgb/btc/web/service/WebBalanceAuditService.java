package tgb.btc.web.service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.BalanceAudit;
import tgb.btc.library.interfaces.service.bean.bot.IBalanceAuditService;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.interfaces.IWebBalanceAuditService;
import tgb.btc.web.vo.ExtSort;
import tgb.btc.web.vo.PagingResponse;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Service
public class WebBalanceAuditService implements IWebBalanceAuditService {

    private final IBalanceAuditService balanceAuditService;

    private final ObjectNodeService objectNodeService;

    public WebBalanceAuditService(IBalanceAuditService balanceAuditService, ObjectNodeService objectNodeService) {
        this.balanceAuditService = balanceAuditService;
        this.objectNodeService = objectNodeService;
    }

    @Override
    public PagingResponse<ObjectNode> findAll(Integer limit, Integer page, String sortStr) {
        ExtSort sort = null;
        if (StringUtils.isNotEmpty(sortStr)) {
            try {
                sort = objectNodeService.readValue(sortStr, ExtSort[].class)[0];
            } catch (Exception e) {
                sort = null;
            }
        }
        List<BalanceAudit> audits;
        if (Objects.nonNull(sort) && Objects.nonNull(sort.getDirection()) && Objects.nonNull(sort.getProperty())) {
            audits = balanceAuditService.findAll(page - 1, limit,
                    Sort.by(sort.getDirection().equalsIgnoreCase("asc")
                            ? Sort.Order.asc(sort.getProperty())
                            : Sort.Order.desc(sort.getProperty())));
        } else {
            audits = balanceAuditService.findAll(page - 1, limit, Sort.by(Sort.Order.desc("dateTime")));
        }
        PagingResponse<ObjectNode> response = new PagingResponse<>();
        response.setList(audits.stream().map(audit -> JacksonUtil.getEmpty()
                .put("targetChatId", audit.getTarget().getChatId())
                .put("amount", audit.getAmount())
                .put("newBalance", audit.getNewBalance())
                .put("type", audit.getType().getDescription())
                .put("initiatorChatId", Objects.nonNull(audit.getInitiator())
                        ? audit.getInitiator().getChatId().toString()
                        : "Система")
                .put("initiatorRole", Objects.nonNull(audit.getInitiator())
                        ? audit.getInitiator().getUserRole().getDisplayName()
                        : "-")
                .put("dateTime", audit.getDateTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")))
        ).toList());
        response.setTotalCount(balanceAuditService.count());
        return response;
    }
}
