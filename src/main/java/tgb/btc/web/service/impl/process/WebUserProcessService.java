package tgb.btc.web.service.impl.process;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.web.WebUser;
import tgb.btc.library.repository.web.RoleRepository;
import tgb.btc.library.repository.web.WebUserRepository;
import tgb.btc.web.vo.form.WebUserVO;

@Service
public class WebUserProcessService {

    private WebUserRepository webUserRepository;

    private RoleRepository roleRepository;

    @Autowired
    public void setWebUserRepository(WebUserRepository webUserRepository) {
        this.webUserRepository = webUserRepository;
    }

    @Autowired
    public void setRoleRepository(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public void update(WebUserVO webUserVO) {
        WebUser webUser = webUserRepository.getById(webUserVO.getPid());
        webUser.setUsername(webUserVO.getUsername());
        webUser.setEnabled(BooleanUtils.isTrue(webUserVO.getIsEnabled()));
        webUser.setChatId(webUserVO.getChatId());
        webUser.setRoles(roleRepository.getByName(webUserVO.getRole().name()));
        webUserRepository.save(webUser);
    }

}
