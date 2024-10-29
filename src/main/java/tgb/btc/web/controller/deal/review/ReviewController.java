package tgb.btc.web.controller.deal.review;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tgb.btc.api.bot.ReviewAPI;
import tgb.btc.library.bean.bot.Review;
import tgb.btc.library.interfaces.service.bean.bot.IReviewService;
import tgb.btc.web.annotations.ExtJSController;
import tgb.btc.web.constant.enums.NotificationType;
import tgb.btc.web.controller.BaseResponseEntityController;
import tgb.btc.web.interfaces.IObjectNodeService;
import tgb.btc.web.interfaces.review.IWebReviewService;
import tgb.btc.web.service.NotificationsAPI;
import tgb.btc.web.vo.ExtSort;
import tgb.btc.web.vo.PagingResponse;

import java.security.Principal;
import java.util.Objects;

@ExtJSController
@RequestMapping("/deal/review")
@Slf4j
public class ReviewController extends BaseResponseEntityController {

    private final IWebReviewService webReviewService;

    private final IReviewService reviewService;

    private final NotificationsAPI notificationsAPI;

    private  ReviewAPI reviewAPI;

    @Autowired(required = false)
    public void setReviewAPI(ReviewAPI reviewAPI) {
        this.reviewAPI = reviewAPI;
    }

    @Autowired
    public ReviewController(IObjectNodeService objectNodeService, IWebReviewService webReviewService,
            IReviewService reviewService, NotificationsAPI notificationsAPI) {
        super(objectNodeService);
        this.webReviewService = webReviewService;
        this.reviewService = reviewService;
        this.notificationsAPI = notificationsAPI;
    }

    @GetMapping
    public ResponseEntity<PagingResponse<Review>> findAll(Integer limit, Integer page, String sort) throws JsonProcessingException {
        return new ResponseEntity<>(webReviewService.findAll(limit, page,
                sort), HttpStatus.ACCEPTED);
    }

    @PostMapping("/{pid}")
    public ResponseEntity<Boolean> publish(Principal principal, @PathVariable Long pid) {
        if(Objects.nonNull(reviewAPI)) {
            reviewAPI.publishReview(pid);
            log.debug("Пользователь {} опубликовал отзыв {}.", principal.getName(), pid);
        }
        notificationsAPI.send(NotificationType.REVIEW_ACTION);
        return new ResponseEntity<>(true, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{pid}")
    public ResponseEntity<Boolean> delete(Principal principal, @PathVariable Long pid) {
        String text= reviewService.findById(pid).getText();
        reviewService.deleteById(pid);
        log.debug("Пользователь {} удалил отзыв {}.", principal.getName(), text);
        notificationsAPI.send(NotificationType.REVIEW_ACTION);
        return new ResponseEntity<>(true, HttpStatus.ACCEPTED);
    }
}
