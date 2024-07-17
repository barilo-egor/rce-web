package tgb.btc.web.interfaces.process;

import java.io.IOException;

public interface IFileService {

    byte[] getTelegramImage(String fileId, String pathString) throws IOException;

}
