package tgb.btc.web.service.review;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tgb.btc.library.bean.bot.Review;
import tgb.btc.library.interfaces.service.bean.bot.IReviewService;
import tgb.btc.web.interfaces.review.IWebReviewService;
import tgb.btc.web.service.ObjectNodeService;
import tgb.btc.web.vo.ExtSort;
import tgb.btc.web.vo.PagingResponse;

import java.util.List;
import java.util.Objects;

@Service
public class WebReviewService implements IWebReviewService {

    private final IReviewService reviewService;
    private final ObjectNodeService objectNodeService;

    @Autowired
    public WebReviewService(IReviewService reviewService, ObjectNodeService objectNodeService) {
        this.reviewService = reviewService;
        this.objectNodeService = objectNodeService;
    }

    @Override
    public PagingResponse<Review> findAll(Integer limit, Integer page, String sortStr) {
        ExtSort sort = null;
        if (StringUtils.isNotEmpty(sortStr)) {
            try {
                sort = objectNodeService.readValue(sortStr, ExtSort[].class)[0];
            } catch (Exception e) {
                sort = null;
            }
        }
        List<Review> reviews;
        if (Objects.nonNull(sort) && Objects.nonNull(sort.getDirection()) && Objects.nonNull(sort.getProperty())) {
            reviews = reviewService.findAllByIsAccepted(false, page - 1, limit,
                    Sort.by(sort.getDirection().equalsIgnoreCase("asc")
                            ? Sort.Order.asc(sort.getProperty())
                            : Sort.Order.desc(sort.getProperty())));
        } else {
            reviews = reviewService.findAllByIsAccepted(false, page - 1, limit, Sort.by(Sort.Order.desc("pid")));
        }
        PagingResponse<Review> response = new PagingResponse<>();
        response.setList(reviews);
        response.setTotalCount(reviewService.count(Example.of(Review.builder().isAccepted(false).build())));
        return response;
    }

}
