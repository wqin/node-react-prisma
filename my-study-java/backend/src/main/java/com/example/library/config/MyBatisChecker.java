package com.example.library.config;

import com.example.library.mapper.BookMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class MyBatisChecker implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(MyBatisChecker.class);
    private final ApplicationContext ctx;

    public MyBatisChecker(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    @Override
    public void run(String... args) throws Exception {
        Map<String, BookMapper> mappers = ctx.getBeansOfType(BookMapper.class);
        if (mappers.isEmpty()) {
            logger.warn("MyBatis mappers not found: BookMapper not registered");
        } else {
            logger.info("MyBatis mappers detected: {}", mappers.keySet());
        }
    }
}
