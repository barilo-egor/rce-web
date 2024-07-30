package tgb.btc.web.interfaces.process;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IFileService {

    byte[] getTelegramImage(String fileId, String pathString) throws IOException;

    String saveToTelegram(MultipartFile file) throws IOException;

}
