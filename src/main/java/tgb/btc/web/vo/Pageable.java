package tgb.btc.web.vo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;

/**
 * Класс для java-представлений фронтовых ExtJS форм, которые содержат пагинацию.
 */
public class Pageable {

    protected static final Logger log = LoggerFactory.getLogger(Pageable.class);

    private Integer start;

    private Integer page;

    private Integer limit;

    private List<ExtSort> sort;
    public Pageable() {
    }

    public Pageable(Integer start, Integer page, Integer limit, List<ExtSort> sort) {
        this.start = start;
        this.page = page;
        this.limit = limit;
        this.sort = sort;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public List<ExtSort> getExtSort() {
        return sort;
    }

    public void setExtSort(List<ExtSort> extSort) {
        this.sort = extSort;
    }

    public String getSortStr(Map<String, Object> parameters) {
        if (CollectionUtils.isEmpty(getExtSort())) return "";
        StringBuilder result = new StringBuilder(" order by");
        int i = 0;
        for (ExtSort extSort: getExtSort()) {
            result.append(" :sortProperty").append(i).append(" :direction").append(i);
            parameters.put("sortProperty" + i, extSort.getProperty());
            parameters.put("direction" + i, extSort.getDirection());
        }
        return result.toString();
    }
}
