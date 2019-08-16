package com.agh.smoganalyzer.repository;

import com.agh.smoganalyzer.domain.WeatherData;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WeatherData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {

}
