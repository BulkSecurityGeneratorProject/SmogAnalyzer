package com.agh.smoganalyzer.repository;

import com.agh.smoganalyzer.domain.AirPollutionData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the AirPollutionData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AirPollutionDataRepository extends JpaRepository<AirPollutionData, Long> {

    @Query("select air_pollution_data from AirPollutionData air_pollution_data where air_pollution_data.owner.login = ?#{principal.username}")
    Page<AirPollutionData> findByOwnerIsCurrentUser(Pageable pageable);

}
