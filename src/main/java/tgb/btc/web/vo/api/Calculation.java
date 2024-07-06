package tgb.btc.web.vo.api;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tgb.btc.library.interfaces.JsonConvertable;
import tgb.btc.library.util.web.JacksonUtil;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Calculation implements JsonConvertable {
    private LocalDateTime dateTime;

    private Integer dealsCount;

    private List<TotalSum> children;

    @Override
    public ObjectNode map() {
        ObjectNode result = JacksonUtil.getEmpty();
        result.put("dateTime", getDateTime()
                .format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")));
        result.put("dealsCount", dealsCount);
        result.set("children", JacksonUtil.getEmptyArray()
                .addAll(getChildren().stream()
                        .map(TotalSum::map)
                        .collect(Collectors.toList())));
        result.put("leaf", false);
        result.put("expanded", true);
        result.put("iconCls", "none");
        return result;
    }

}
