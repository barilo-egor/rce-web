package tgb.btc.web.service.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.Review;
import tgb.btc.library.interfaces.service.bean.bot.IReviewService;
import tgb.btc.web.interfaces.review.IWebReviewService;
import tgb.btc.web.vo.ExtSort;

import java.util.List;
import java.util.Objects;

@Service
public class WebReviewService implements IWebReviewService {

    private final IReviewService reviewService;

    @Autowired
    public WebReviewService(IReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @Override
    public List<Review> findAll(Integer limit, Integer page, ExtSort sort) {
        if (Objects.nonNull(sort) && Objects.nonNull(sort.getDirection()) && Objects.nonNull(sort.getProperty())) {
            return reviewService.findAllByIsPublished(false, page, limit, Sort.by(sort.getDirection().equalsIgnoreCase("asc")
                    ? Sort.Order.asc(sort.getProperty())
                    : Sort.Order.desc(sort.getProperty())));
        }
        return reviewService.findAllByIsPublished(false, page, limit);
    }
}
