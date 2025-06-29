package com.javaweb.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic emailTopic() {
        return new NewTopic("email", 3, (short) 1);
    }

    @Bean
    public NewTopic emailDLT() {
        return new NewTopic("email.DLT", 1, (short) 1);
    }

    @Bean
    public NewTopic uploadFileTopic() {
        return new NewTopic("file", 3, (short) 1);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory(
            ConsumerFactory<String, String> consumerFactory) {

        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setCommonErrorHandler(errorHandler());

        return factory;
    }

    @Bean
    public DefaultErrorHandler errorHandler() {
        return new DefaultErrorHandler(
                (ConsumerRecord<?, ?> record, Exception exception) -> {
                    System.err.println("Kafka error in message: " + record.value());
                    exception.printStackTrace();
                },
                new FixedBackOff(2000L, 3)
        );
    }
}
