package com.agh.smoganalyzer.repository;

import com.agh.smoganalyzer.domain.PlaceOfMeasurement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PlaceOfMeasurement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlaceOfMeasurementRepository extends JpaRepository<PlaceOfMeasurement, Long> {

}
