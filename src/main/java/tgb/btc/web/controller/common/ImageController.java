package tgb.btc.web.controller.common;

import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import tgb.btc.web.service.impl.process.FileService;

import java.io.IOException;

@Controller
@RequestMapping("/image")
public class ImageController {

    private FileService fileService;

    @Autowired(required = false)
    public void setFileService(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping(value = "/get", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public byte[] get(@RequestParam String imageId) throws IOException {
        return fileService.getTelegramImage(imageId, "images/" + imageId + ".jpg");
    }

    @GetMapping(value = "/getPDF", produces = MediaType.APPLICATION_PDF_VALUE)
    @ResponseBody
    public byte[] getPDF(@RequestParam String fileId) throws IOException {
        return fileService.getTelegramImage(fileId, "images/" + RandomStringUtils.randomAlphanumeric(7) + ".pdf");
    }
}
