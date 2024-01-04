package tgb.btc.web.vo.form;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tgb.btc.library.constants.enums.web.RoleConstants;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class WebUserVO {

    private Long pid;

    private String username;

    private RoleConstants role;

    private Boolean isEnabled;

    private Long chatId;
}
