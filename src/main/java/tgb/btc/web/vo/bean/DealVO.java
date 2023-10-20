package tgb.btc.web.vo.bean;

import lombok.*;
import tgb.btc.library.constants.enums.bot.DealStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DealVO {
    private Long pid;

    private DealStatus dealStatus;

    private Long chatId;
}
