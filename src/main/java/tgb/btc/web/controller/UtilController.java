package tgb.btc.web.controller;

import com.fasterxml.jackson.databind.node.ArrayNode;
import org.apache.commons.lang.BooleanUtils;
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
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.library.util.SystemUtil;
import tgb.btc.library.util.web.JacksonUtil;
import tgb.btc.web.util.SuccessResponseUtil;
import tgb.btc.web.vo.SuccessResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/util")
public class UtilController extends BaseController {

    private WebUserRepository webUserRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
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
        return SuccessResponseUtil.data(BooleanUtils.isNotFalse(webUserRepository.getSoundEnabledByUsername(principal.getName())),
                data -> JacksonUtil.getEmpty().put("soundEnabled", data));
    }

    @GetMapping("/getUsernames")
    @ResponseBody
    public ArrayNode getUsernames() {
        return JacksonUtil.getEmptyArray().addAll(
                webUserRepository.getUsernames().stream()
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
        return SuccessResponseUtil.data(SystemUtil.isDev(), data -> JacksonUtil.getEmpty().put("isDev", data));
    }
}
