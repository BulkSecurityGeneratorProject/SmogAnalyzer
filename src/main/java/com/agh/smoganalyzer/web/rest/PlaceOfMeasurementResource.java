package com.agh.smoganalyzer.web.rest;
import com.agh.smoganalyzer.service.PlaceOfMeasurementService;
import com.agh.smoganalyzer.web.rest.errors.BadRequestAlertException;
import com.agh.smoganalyzer.web.rest.util.HeaderUtil;
import com.agh.smoganalyzer.service.dto.PlaceOfMeasurementDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing PlaceOfMeasurement.
 */
@RestController
@RequestMapping("/api")
public class PlaceOfMeasurementResource {

    private final Logger log = LoggerFactory.getLogger(PlaceOfMeasurementResource.class);

    private static final String ENTITY_NAME = "placeOfMeasurement";

    private final PlaceOfMeasurementService placeOfMeasurementService;

    public PlaceOfMeasurementResource(PlaceOfMeasurementService placeOfMeasurementService) {
        this.placeOfMeasurementService = placeOfMeasurementService;
    }

    /**
     * POST  /place-of-measurements : Create a new placeOfMeasurement.
     *
     * @param placeOfMeasurementDTO the placeOfMeasurementDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new placeOfMeasurementDTO, or with status 400 (Bad Request) if the placeOfMeasurement has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/place-of-measurements")
    public ResponseEntity<PlaceOfMeasurementDTO> createPlaceOfMeasurement(@Valid @RequestBody PlaceOfMeasurementDTO placeOfMeasurementDTO) throws URISyntaxException {
        log.debug("REST request to save PlaceOfMeasurement : {}", placeOfMeasurementDTO);
        if (placeOfMeasurementDTO.getId() != null) {
            throw new BadRequestAlertException("A new placeOfMeasurement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PlaceOfMeasurementDTO result = placeOfMeasurementService.save(placeOfMeasurementDTO);
        return ResponseEntity.created(new URI("/api/place-of-measurements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /place-of-measurements : Updates an existing placeOfMeasurement.
     *
     * @param placeOfMeasurementDTO the placeOfMeasurementDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated placeOfMeasurementDTO,
     * or with status 400 (Bad Request) if the placeOfMeasurementDTO is not valid,
     * or with status 500 (Internal Server Error) if the placeOfMeasurementDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/place-of-measurements")
    public ResponseEntity<PlaceOfMeasurementDTO> updatePlaceOfMeasurement(@Valid @RequestBody PlaceOfMeasurementDTO placeOfMeasurementDTO) throws URISyntaxException {
        log.debug("REST request to update PlaceOfMeasurement : {}", placeOfMeasurementDTO);
        if (placeOfMeasurementDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PlaceOfMeasurementDTO result = placeOfMeasurementService.save(placeOfMeasurementDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, placeOfMeasurementDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /place-of-measurements : get all the placeOfMeasurements.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of placeOfMeasurements in body
     */
    @GetMapping("/place-of-measurements")
    public List<PlaceOfMeasurementDTO> getAllPlaceOfMeasurements() {
        log.debug("REST request to get all PlaceOfMeasurements");
        return placeOfMeasurementService.findAll();
    }

    /**
     * GET  /place-of-measurements/:id : get the "id" placeOfMeasurement.
     *
     * @param id the id of the placeOfMeasurementDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the placeOfMeasurementDTO, or with status 404 (Not Found)
     */
    @GetMapping("/place-of-measurements/{id}")
    public ResponseEntity<PlaceOfMeasurementDTO> getPlaceOfMeasurement(@PathVariable Long id) {
        log.debug("REST request to get PlaceOfMeasurement : {}", id);
        Optional<PlaceOfMeasurementDTO> placeOfMeasurementDTO = placeOfMeasurementService.findOne(id);
        return ResponseUtil.wrapOrNotFound(placeOfMeasurementDTO);
    }

    /**
     * DELETE  /place-of-measurements/:id : delete the "id" placeOfMeasurement.
     *
     * @param id the id of the placeOfMeasurementDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/place-of-measurements/{id}")
    public ResponseEntity<Void> deletePlaceOfMeasurement(@PathVariable Long id) {
        log.debug("REST request to delete PlaceOfMeasurement : {}", id);
        placeOfMeasurementService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
