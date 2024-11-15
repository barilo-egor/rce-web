package tgb.btc.web.service.process;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.interfaces.service.bean.web.IRoleService;
import tgb.btc.library.interfaces.service.bean.web.IWebUserService;
import tgb.btc.web.interfaces.process.IWebUserProcessService;
import tgb.btc.web.vo.form.WebUserVO;

@Service
public class WebUserProcessService implements IWebUserProcessService {

    private IWebUserService webUserService;
    private IRoleService roleService;

    @Autowired
    public void setWebUserService(IWebUserService webUserService) {
        this.webUserService = webUserService;
    }

    @Autowired
    public void setRoleService(IRoleService roleService) {
        this.roleService = roleService;
    }

    @Override
    public void update(WebUserVO webUserVO) {
        WebUser webUser = webUserService.findById(webUserVO.getPid());
        webUser.setUsername(webUserVO.getUsername());
        webUser.setEnabled(BooleanUtils.isTrue(webUserVO.getIsEnabled()));
        webUser.setChatId(webUserVO.getChatId());
        webUser.setRoles(roleService.getByName(webUserVO.getRole().name()));
        webUserService.save(webUser);
    }

}
