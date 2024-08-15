package tgb.btc.web.interfaces.review;

import tgb.btc.library.bean.bot.Review;
import tgb.btc.web.vo.ExtSort;

import java.util.List;

public interface IWebReviewService {

    List<Review> findAll(Integer limit, Integer page, ExtSort sort);

}
