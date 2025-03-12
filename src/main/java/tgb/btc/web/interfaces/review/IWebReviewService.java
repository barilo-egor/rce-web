package tgb.btc.web.interfaces.review;

import tgb.btc.library.bean.bot.Review;
import tgb.btc.web.vo.PagingResponse;

import java.security.Principal;
import java.util.List;

public interface IWebReviewService {

    PagingResponse<Review> findAll(Integer limit, Integer page, String sort);

    void updateToAccepted(Principal principal, List<Long> pids);

}
