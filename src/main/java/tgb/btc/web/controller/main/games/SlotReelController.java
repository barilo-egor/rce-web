package tgb.btc.web.controller.main.games;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.util.Collections;

@Controller
@RequestMapping(ControllerMapping.SLOT_REEL)
public class SlotReelController extends BaseController {

    /**
     * {
     *     body: {
     *         data: {
     *             isOn: true,
     *             trySum: 1,
     *             prisesSums: {
     *                 triple: {
     *                     seven: 1,
     *                     lemon: 1,
     *                     cherry: 1
     *                 },
     *                 double: {
     *                     seven: 1,
     *                     lemon: 1,
     *                     cherry: 1
     *                 }
     *             },
     *             messages: {
     *                 scroll: qwe,
     *                 win: qwe,
     *                 lose: qwe,
     *                 start: qwe,
     *                 balanceEmpty: qwe,
     *                 tryCost: qwe
     *             },
     *             tryButtonText: qwe
     *         }
     *     }
     *
     * }
     * @return
     */
    @GetMapping("/getValues")
    public SuccessResponse<?> getValues() {
        return SuccessResponseUtil.data(Collections.emptyList(), s -> null);
    }
}
