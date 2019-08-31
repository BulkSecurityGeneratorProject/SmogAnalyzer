package com.agh.smoganalyzer.web.rest;
import com.agh.smoganalyzer.service.AirlyDataService;
import com.agh.smoganalyzer.web.rest.errors.BadRequestAlertException;
import com.agh.smoganalyzer.web.rest.util.HeaderUtil;
import com.agh.smoganalyzer.web.rest.util.PaginationUtil;
import com.agh.smoganalyzer.service.dto.AirlyDataDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing AirlyData.
 */
@RestController
@RequestMapping("/api")
public class AirlyDataResource {

    private final Logger log = LoggerFactory.getLogger(AirlyDataResource.class);

    private static final String ENTITY_NAME = "airlyData";

    private final AirlyDataService airlyDataService;

    public AirlyDataResource(AirlyDataService airlyDataService) {
        this.airlyDataService = airlyDataService;
    }

    /**
     * POST  /airly-data : Create a new airlyData.
     *
     * @param airlyDataDTO the airlyDataDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new airlyDataDTO, or with status 400 (Bad Request) if the airlyData has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/airly-data")
    public ResponseEntity<AirlyDataDTO> createAirlyData(@Valid @RequestBody AirlyDataDTO airlyDataDTO) throws URISyntaxException {
        log.debug("REST request to save AirlyData : {}", airlyDataDTO);
        if (airlyDataDTO.getId() != null) {
            throw new BadRequestAlertException("A new airlyData cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AirlyDataDTO result = airlyDataService.save(airlyDataDTO);
        return ResponseEntity.created(new URI("/api/airly-data/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /airly-data : Updates an existing airlyData.
     *
     * @param airlyDataDTO the airlyDataDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated airlyDataDTO,
     * or with status 400 (Bad Request) if the airlyDataDTO is not valid,
     * or with status 500 (Internal Server Error) if the airlyDataDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/airly-data")
    public ResponseEntity<AirlyDataDTO> updateAirlyData(@Valid @RequestBody AirlyDataDTO airlyDataDTO) throws URISyntaxException {
        log.debug("REST request to update AirlyData : {}", airlyDataDTO);
        if (airlyDataDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        AirlyDataDTO result = airlyDataService.save(airlyDataDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, airlyDataDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /airly-data : get all the airlyData.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of airlyData in body
     */
    @GetMapping("/airly-data")
    public ResponseEntity<List<AirlyDataDTO>> getAllAirlyData(Pageable pageable) {
        log.debug("REST request to get a page of AirlyData");
        Page<AirlyDataDTO> page = airlyDataService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/airly-data");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /airly-data/:id : get the "id" airlyData.
     *
     * @param id the id of the airlyDataDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the airlyDataDTO, or with status 404 (Not Found)
     */
    @GetMapping("/airly-data/{id}")
    public ResponseEntity<AirlyDataDTO> getAirlyData(@PathVariable Long id) {
        log.debug("REST request to get AirlyData : {}", id);
        Optional<AirlyDataDTO> airlyDataDTO = airlyDataService.findOne(id);
        return ResponseUtil.wrapOrNotFound(airlyDataDTO);
    }

    /**
     * DELETE  /airly-data/:id : delete the "id" airlyData.
     *
     * @param id the id of the airlyDataDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/airly-data/{id}")
    public ResponseEntity<Void> deleteAirlyData(@PathVariable Long id) {
        log.debug("REST request to delete AirlyData : {}", id);
        airlyDataService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
