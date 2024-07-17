package tgb.btc.web.interfaces.users;

import tgb.btc.library.bean.web.api.ApiUser;
import tgb.btc.library.constants.enums.bot.FiatCurrency;

import java.util.List;

public interface IWebApiUsersService {

    List<ApiUser> findAll(String id, FiatCurrency fiatCurrency, String token, String buyRequisite,
            String sellRequisite);

}
