package tgb.btc.web.controller.properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.constants.enums.properties.PropertiesPath;
import tgb.btc.library.interfaces.service.properties.IPropertiesService;
import tgb.btc.library.vo.properties.PropertiesValue;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseController;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.util.List;

@Controller
@RequestMapping(ControllerMapping.PROPERTIES)
public class PropertiesController extends BaseController {

    private IPropertiesService propertiesService;

    @Autowired
    public void setPropertiesService(IPropertiesService propertiesService) {
        this.propertiesService = propertiesService;
    }

    @PostMapping("/updateProperties")
    @ResponseBody
    public SuccessResponse<?> updateProperties(PropertiesPath propertiesPath, @RequestBody List<PropertiesValue> values) {
        propertiesService.updateProperties(propertiesPath, values);
        return new SuccessResponse<>();
    }

    @GetMapping("/getPropertiesValues")
    @ResponseBody
    public SuccessResponse<?> getPropertiesValues(PropertiesPath propertiesPath, @RequestParam List<String> keys) {
        return SuccessResponseUtil.data(propertiesService.getPropertiesValues(propertiesPath, keys));
    }


}
