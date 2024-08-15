package tgb.btc.web.interfaces.review;

import tgb.btc.library.bean.bot.Review;
import tgb.btc.web.vo.ExtSort;
import tgb.btc.web.vo.PagingResponse;

public interface IWebReviewService {

    PagingResponse<Review> findAll(Integer limit, Integer page, ExtSort sort);

}
