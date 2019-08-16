package com.agh.smoganalyzer.repository;

import com.agh.smoganalyzer.domain.AirPollutionData;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AirPollutionData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AirPollutionDataRepository extends JpaRepository<AirPollutionData, Long> {

}
