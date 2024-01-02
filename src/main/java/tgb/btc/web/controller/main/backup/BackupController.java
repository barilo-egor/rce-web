package tgb.btc.web.controller.main.backup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.library.service.process.BackupService;
import tgb.btc.web.constant.ControllerMapping;
import tgb.btc.web.controller.BaseController;

@Controller
@RequestMapping(ControllerMapping.BACKUP)
public class BackupController extends BaseController {

    private BackupService backupService;

    @Autowired
    public void setBackupService(BackupService backupService) {
        this.backupService = backupService;
    }

    @PostMapping
    public ResponseEntity<?> backUpDB() {
        backupService.backup();
        return ResponseEntity.ok().build();
    }

}
