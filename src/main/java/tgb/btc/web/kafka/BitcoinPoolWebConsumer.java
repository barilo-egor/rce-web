package tgb.btc.web.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tgb.btc.api.web.INotificationsAPI;

@Service
public class BitcoinPoolWebConsumer {

    private final INotificationsAPI notificationsAPI;

    public BitcoinPoolWebConsumer(INotificationsAPI notificationsAPI) {
        this.notificationsAPI = notificationsAPI;
    }

    @KafkaListener(topics = "pool", groupId = "web-${bot.username}")
    public void listen(ConsumerRecord<String, String> record) {
        String key = record.key();
        if ("message".equals(key)) {
            notificationsAPI.poolChanged(record.value());
        }
    }
}
