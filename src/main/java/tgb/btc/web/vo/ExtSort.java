package tgb.btc.web.vo;


/**
 * Java-представление ExtJS сортировки.
 */
public class ExtSort {

    /**
     * Название поля.
     */
    private String property;

    /**
     * ASC/DESC
     */
    private String direction;

    public ExtSort() {
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
