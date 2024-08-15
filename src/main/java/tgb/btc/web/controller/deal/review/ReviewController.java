package tgb.btc.web.controller.deal.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tgb.btc.library.bean.bot.Review;
import tgb.btc.web.annotations.ExtJSController;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.interfaces.review.IWebReviewService;
import tgb.btc.web.vo.ExtSort;

import java.util.List;

@ExtJSController
@RequestMapping("/deal/review")
public class ReviewController extends BaseResponseEntityController {

    private final IWebReviewService webReviewService;

    @Autowired
    public ReviewController(IObjectNodeService objectNodeService, IWebReviewService webReviewService) {
        super(objectNodeService);
        this.webReviewService = webReviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> findAll(Integer limit, Integer page, ExtSort sort) {
        return new ResponseEntity<>(webReviewService.findAll(limit, page, sort), HttpStatus.ACCEPTED);
    }
}
