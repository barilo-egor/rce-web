package tgb.btc.web.interfaces.deal;

import org.springframework.transaction.annotation.Transactional;
import tgb.btc.library.bean.bot.Deal;
import tgb.btc.library.constants.enums.bot.CryptoCurrency;
import tgb.btc.library.constants.enums.bot.DealType;
import tgb.btc.library.constants.enums.bot.FiatCurrency;
import tgb.btc.web.vo.bean.DealVO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface IWebDealService {

    @Transactional
    List<DealVO> findAll(Integer page, Integer limit, Integer start);

    @Transactional
    List<DealVO> findAll(Integer page, Integer limit, Integer start, String whereStr, String orderStr,
            Map<String, Object> parameters);

    @Transactional
    List<Long> findAllPids(String whereStr, String orderStr, Map<String, Object> parameters);

    @Transactional
    Long count(String whereStr, Map<String, Object> parameters);

    DealVO get(Long pid);

    Deal createManual(String username, BigDecimal cryptoAmount, BigDecimal amount, CryptoCurrency cryptoCurrency,
            DealType dealType, FiatCurrency fiatCurrency);

}
