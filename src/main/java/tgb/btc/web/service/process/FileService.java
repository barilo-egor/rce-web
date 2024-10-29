package tgb.btc.web.service.process;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tgb.btc.api.bot.IFileDownloader;
import tgb.btc.library.exception.BaseException;
import tgb.btc.web.interfaces.process.IFileService;

import java.io.File;
import java.io.FileOutputStream;
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

    @Override
    public byte[] getTelegramImage(String fileId, String pathString) throws IOException {
        fileDownloader.downloadFile(fileId, pathString);
        Path path = Paths.get(pathString);
        byte[] result = Files.readAllBytes(path);
        Files.delete(path);
        return result;
    }

    @Override
    public String saveToTelegram(MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        if (StringUtils.isEmpty(originalFileName)) {
            throw new BaseException("У файла отсутствует originalFilename.");
        }
        File convFile = new File("images/" + System.currentTimeMillis()
                + originalFileName.substring(originalFileName.indexOf(".")));
        if (!convFile.createNewFile()) {
            throw new BaseException("Ошибка при создании файла для чека.");
        }
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return fileDownloader.saveFile(convFile);
    }
}
