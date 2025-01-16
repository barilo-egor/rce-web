package tgb.btc.web.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import tgb.btc.library.interfaces.enums.MessageImage;

@Data
@Builder
@AllArgsConstructor
public class MessageImageVO {

    private String name;

    private String description;

    public static MessageImageVO from(MessageImage message) {
        return MessageImageVO.builder()
                .name(message.name())
                .description(message.getDescription())
                .build();
    }
}
