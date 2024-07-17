package tgb.btc.web.service.process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.api.bot.IFileDownloader;
import tgb.btc.web.interfaces.process.IFileService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileService implements IFileService {

    private IFileDownloader fileDownloader;

    @Autowired(required = false)
    public void setFileDownloader(IFileDownloader fileDownloader) {
        this.fileDownloader = fileDownloader;
    }

    public byte[] getTelegramImage(String fileId, String pathString) throws IOException {
        fileDownloader.downloadFile(fileId, pathString);
        Path path = Paths.get(pathString);
        byte[] result = Files.readAllBytes(path);
        Files.delete(path);
        return result;
    }
}
