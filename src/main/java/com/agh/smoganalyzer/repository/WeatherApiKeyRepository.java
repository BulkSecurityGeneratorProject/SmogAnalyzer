package com.agh.smoganalyzer.repository;

import com.agh.smoganalyzer.domain.WeatherApiKey;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WeatherApiKey entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeatherApiKeyRepository extends JpaRepository<WeatherApiKey, Long> {

}
