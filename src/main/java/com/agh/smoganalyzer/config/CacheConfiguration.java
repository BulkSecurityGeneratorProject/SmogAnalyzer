package com.agh.smoganalyzer.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(com.agh.smoganalyzer.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.domain.WeatherApiKey.class.getName(), jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.domain.AirPollutionData.class.getName(), jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.domain.WeatherData.class.getName(), jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.domain.PlaceOfMeasurement.class.getName(), jcacheConfiguration);
            cm.createCache(com.agh.smoganalyzer.domain.AirlyData.class.getName(), jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
