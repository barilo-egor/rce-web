package tgb.btc.web.vo;

import org.hibernate.criterion.Order;

import java.util.List;
import java.util.Map;

/**
 * Класс для передачи информации пагинации в DAO.
 */
public class PagingSettings {

    /**
     * Максимальное количество результатов(соответствует размеру страницы)
     */
    private Integer maxResults;

    /**
     * Номер для начала выборки(нумерация с 0)
     */
    private Integer firstResult;

    /**
     * Список сортировок для критерии.
     */
    private List<Order> orders;

    private Map<String, String> aliases;

    public PagingSettings() {
    }

    public Integer getMaxResults() {
        return maxResults;
    }

    public void setMaxResults(Integer maxResults) {
        this.maxResults = maxResults;
    }

    public Integer getFirstResult() {
        return firstResult;
    }

    public void setFirstResult(Integer firstResult) {
        this.firstResult = firstResult;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public Map<String, String> getAliases() {
        return aliases;
    }

    public void setAliases(Map<String, String> aliases) {
        this.aliases = aliases;
    }

}
