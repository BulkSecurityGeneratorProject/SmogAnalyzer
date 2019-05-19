package com.agh.smoganalyzer.web.rest;
import com.agh.smoganalyzer.service.WeatherApiKeyService;
import com.agh.smoganalyzer.web.rest.errors.BadRequestAlertException;
import com.agh.smoganalyzer.web.rest.util.HeaderUtil;
import com.agh.smoganalyzer.service.dto.WeatherApiKeyDTO;
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
 * REST controller for managing WeatherApiKey.
 */
@RestController
@RequestMapping("/api")
public class WeatherApiKeyResource {

    private final Logger log = LoggerFactory.getLogger(WeatherApiKeyResource.class);

    private static final String ENTITY_NAME = "weatherApiKey";

    private final WeatherApiKeyService weatherApiKeyService;

    public WeatherApiKeyResource(WeatherApiKeyService weatherApiKeyService) {
        this.weatherApiKeyService = weatherApiKeyService;
    }

    /**
     * POST  /weather-api-keys : Create a new weatherApiKey.
     *
     * @param weatherApiKeyDTO the weatherApiKeyDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new weatherApiKeyDTO, or with status 400 (Bad Request) if the weatherApiKey has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/weather-api-keys")
    public ResponseEntity<WeatherApiKeyDTO> createWeatherApiKey(@Valid @RequestBody WeatherApiKeyDTO weatherApiKeyDTO) throws URISyntaxException {
        log.debug("REST request to save WeatherApiKey : {}", weatherApiKeyDTO);
        if (weatherApiKeyDTO.getId() != null) {
            throw new BadRequestAlertException("A new weatherApiKey cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WeatherApiKeyDTO result = weatherApiKeyService.save(weatherApiKeyDTO);
        return ResponseEntity.created(new URI("/api/weather-api-keys/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /weather-api-keys : Updates an existing weatherApiKey.
     *
     * @param weatherApiKeyDTO the weatherApiKeyDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated weatherApiKeyDTO,
     * or with status 400 (Bad Request) if the weatherApiKeyDTO is not valid,
     * or with status 500 (Internal Server Error) if the weatherApiKeyDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/weather-api-keys")
    public ResponseEntity<WeatherApiKeyDTO> updateWeatherApiKey(@Valid @RequestBody WeatherApiKeyDTO weatherApiKeyDTO) throws URISyntaxException {
        log.debug("REST request to update WeatherApiKey : {}", weatherApiKeyDTO);
        if (weatherApiKeyDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WeatherApiKeyDTO result = weatherApiKeyService.save(weatherApiKeyDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, weatherApiKeyDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /weather-api-keys : get all the weatherApiKeys.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of weatherApiKeys in body
     */
    @GetMapping("/weather-api-keys")
    public List<WeatherApiKeyDTO> getAllWeatherApiKeys() {
        log.debug("REST request to get all WeatherApiKeys");
        return weatherApiKeyService.findAll();
    }

    /**
     * GET  /weather-api-keys/:id : get the "id" weatherApiKey.
     *
     * @param id the id of the weatherApiKeyDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the weatherApiKeyDTO, or with status 404 (Not Found)
     */
    @GetMapping("/weather-api-keys/{id}")
    public ResponseEntity<WeatherApiKeyDTO> getWeatherApiKey(@PathVariable Long id) {
        log.debug("REST request to get WeatherApiKey : {}", id);
        Optional<WeatherApiKeyDTO> weatherApiKeyDTO = weatherApiKeyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(weatherApiKeyDTO);
    }

    /**
     * DELETE  /weather-api-keys/:id : delete the "id" weatherApiKey.
     *
     * @param id the id of the weatherApiKeyDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/weather-api-keys/{id}")
    public ResponseEntity<Void> deleteWeatherApiKey(@PathVariable Long id) {
        log.debug("REST request to delete WeatherApiKey : {}", id);
        weatherApiKeyService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
