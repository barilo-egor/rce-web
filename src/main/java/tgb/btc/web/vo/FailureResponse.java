package tgb.btc.web.vo;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FailureResponse extends WebResponse {

    /**
     * User-friendly описание ответа
     */
    private final String description;

    /**
     * Класс ошибки (в случае отсутствия в ответе не будет)
     */
    private final Class<?> exceptionClass;


    /**
     * Конструктор
     *
     * @param description - User-friendly описание ответа
     * @param e           - Класс ошибки (в случае отсутствия в ответе не будет)
     */
    public FailureResponse(String description, Exception e) {
        super(false);
        this.description = description;
        this.exceptionClass = Objects.isNull(e)
                ? null
                : e.getClass();
    }

    /**
     * Конструктор
     *
     * @param description - User-friendly описание ответа
     */
    public FailureResponse(String description) {
        this(description, new Exception());
    }

    /**
     * Конструктор
     *
     * @param e - Класс ошибки (в случае отсутствия в ответе не будет)
     */
    public FailureResponse(Exception e) {
        this(e.getMessage(), e);
    }

    /**
     * @return User-friendly описание ответа
     */
    public String getDescription() {
        return description;
    }

    /**
     * @return - имя класс ошибки
     */
    public String getClassName() {
        return Objects.isNull(exceptionClass)
                ? null
                : exceptionClass.getSimpleName();
    }

}