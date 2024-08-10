package tgb.btc.web.vo.form;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiRequisiteForm {

    private Long paymentTypePid;

    private String requisite;
}
