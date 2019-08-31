package com.agh.smoganalyzer.repository;

import com.agh.smoganalyzer.domain.AirlyData;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AirlyData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AirlyDataRepository extends JpaRepository<AirlyData, Long> {

}
