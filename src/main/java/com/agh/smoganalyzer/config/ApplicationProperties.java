package com.agh.smoganalyzer.config;

import org.modelmapper.ModelMapper;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * Properties specific to Smog Analyzer.
 * <p>
 * Properties are configured in the application.yml file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
    @Bean
    ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
