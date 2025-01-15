package tgb.btc.web.controller.design;

import com.google.common.io.Files;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tgb.btc.library.interfaces.enums.MessageImage;
import tgb.btc.library.interfaces.service.design.IMessageImageService;
import tgb.btc.web.annotations.ExtJSResponse;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;

import java.io.IOException;
import java.util.Optional;

@Controller
@RequestMapping(ControllerMapping.MESSAGES_TEXT)
public class MessagesTextController extends BaseResponseEntityController {

    private final IMessageImageService messageImageService;

    protected MessagesTextController(IObjectNodeService objectNodeService, IMessageImageService messageImageService) {
        super(objectNodeService);
        this.messageImageService = messageImageService;
    }

    @ExtJSResponse
    @GetMapping("/text/{messageImage}")
    public ResponseEntity<String> getText(@PathVariable MessageImage messageImage) {
        return new ResponseEntity<>(messageImageService.getMessage(messageImage), HttpStatus.OK);
    }

    @ExtJSResponse
    @GetMapping("/format/{messageImage}")
    public ResponseEntity<String> getFormat(@PathVariable MessageImage messageImage) {
        return new ResponseEntity<>(messageImageService.getFormatNullable(messageImage), HttpStatus.OK);
    }

    @GetMapping(value = "/image/{messageImage}", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public byte[] getImage(@PathVariable MessageImage messageImage) throws IOException {
        return Files.toByteArray(messageImageService.getFile(messageImage));
    }

    @GetMapping(value = "/animation/{messageImage}", produces = MediaType.IMAGE_GIF_VALUE)
    @ResponseBody
    public byte[] getAnimation(@PathVariable MessageImage messageImage) throws IOException {
        return Files.toByteArray(messageImageService.getFile(messageImage));
    }

    @GetMapping(value = "/graphics/{messageImage}", produces = MediaType.IMAGE_PNG_VALUE)
    @ResponseBody
    public byte[] getGraphics(@PathVariable MessageImage messageImage) throws IOException {
        return Files.toByteArray(messageImageService.getFile(messageImage));
    }

    @GetMapping(value = "/video/{messageImage}", produces = "video/mp4")
    @ResponseBody
    public ResponseEntity<ResourceRegion> getVideo(@RequestHeader HttpHeaders headers,
            @PathVariable MessageImage messageImage) throws IOException {
        FileSystemResource videoResource = new FileSystemResource(messageImageService.getFile(messageImage).toPath());
        if (!videoResource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        long fileSize = videoResource.contentLength();

        Optional<HttpRange> optionalRange = headers.getRange().stream().findFirst();
        ResourceRegion region = getResourceRegion(optionalRange, fileSize, videoResource);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "video/mp4")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"video.mp4\"")
                .body(region);
    }

    private static ResourceRegion getResourceRegion(Optional<HttpRange> optionalRange, long fileSize,
            FileSystemResource videoResource) {
        ResourceRegion region;
        if (optionalRange.isPresent()) {
            HttpRange range = optionalRange.get();
            long start = range.getRangeStart(fileSize);
            long end = range.getRangeEnd(fileSize);
            long rangeLength = Math.min(1024 * 1024, end - start + 1);
            region = new ResourceRegion(videoResource, start, rangeLength);
        } else {
            long rangeLength = Math.min(1024 * 1024, fileSize);
            region = new ResourceRegion(videoResource, 0, rangeLength);
        }
        return region;
    }

    @PatchMapping("/{messageImage}")
    @ExtJSResponse
    public ResponseEntity<?> update(@PathVariable MessageImage messageImage, @RequestParam(required = false) String text) {
        messageImageService.updateText(messageImage, text);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }
}
