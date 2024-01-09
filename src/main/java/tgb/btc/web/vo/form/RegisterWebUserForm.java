package tgb.btc.web.vo.form;

import lombok.Data;
import tgb.btc.library.constants.enums.web.RoleConstants;

@Data
public class RegisterWebUserForm {
    private String username;

    private String password;

    private RoleConstants role;

    private Long chatId;
}
