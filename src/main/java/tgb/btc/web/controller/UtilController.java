package tgb.btc.web.controller;

import com.fasterxml.jackson.databind.node.ArrayNode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.library.service.properties.ConfigPropertiesReader;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import java.security.Principal;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/util")
public class UtilController extends BaseController {

    private IWebUserService webUserService;

    private ConfigPropertiesReader configPropertiesReader;

    @Autowired
    public void setConfigPropertiesReader(ConfigPropertiesReader configPropertiesReader) {
        this.configPropertiesReader = configPropertiesReader;
    }

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @GetMapping("/getUsername")
    @ResponseBody
    public SuccessResponse<?> getUsername(Principal principal) {
        return SuccessResponseUtil.data(principal.getName(),
                data -> JacksonUtil.getEmpty().put("username", data));
    }

    @GetMapping("/getSoundEnabled")
    @ResponseBody
    public SuccessResponse<?> getSoundEnabled(Principal principal) {
        return SuccessResponseUtil.data(BooleanUtils.isNotFalse(webUserService.getSoundEnabledByUsername(principal.getName())),
                data -> JacksonUtil.getEmpty().put("soundEnabled", data));
    }

    @GetMapping("/getUsernames")
    @ResponseBody
    public ArrayNode getUsernames() {
        return JacksonUtil.getEmptyArray().addAll(
                webUserService.getNotTiedToApiWebUsernames().stream()
                        .map(username -> JacksonUtil.getEmpty().put("username", username))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/getApiWebUsernames")
    @ResponseBody
    public ArrayNode getApiWebUsernames(Long apiUserPid) {
        return JacksonUtil.getEmptyArray().addAll(
                webUserService.getWebUsernamesByApiUserPid(apiUserPid).stream()
                        .map(username -> JacksonUtil.getEmpty().put("username", username))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping(value = "/getNotificationSound")
    @ResponseBody
    public ResponseEntity<Resource> getNotificationSound(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Resource resource = new ClassPathResource("static/sound/notification.mp3");
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=notification.mp3")
                .body(resource);
    }

    @GetMapping(value = "/isDev")
    @ResponseBody
    public SuccessResponse<?> isDev() {
        return SuccessResponseUtil.data(configPropertiesReader.isDev(), data -> JacksonUtil.getEmpty().put("isDev", data));
    }
}
