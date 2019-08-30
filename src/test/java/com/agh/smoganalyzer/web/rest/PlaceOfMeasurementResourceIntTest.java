package com.agh.smoganalyzer.web.rest;

import com.agh.smoganalyzer.SmogAnalyzerApp;

import com.agh.smoganalyzer.domain.PlaceOfMeasurement;
import com.agh.smoganalyzer.repository.PlaceOfMeasurementRepository;
import com.agh.smoganalyzer.service.PlaceOfMeasurementService;
import com.agh.smoganalyzer.service.dto.PlaceOfMeasurementDTO;
import com.agh.smoganalyzer.service.mapper.PlaceOfMeasurementMapper;
import com.agh.smoganalyzer.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static com.agh.smoganalyzer.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PlaceOfMeasurementResource REST controller.
 *
 * @see PlaceOfMeasurementResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SmogAnalyzerApp.class)
public class PlaceOfMeasurementResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private PlaceOfMeasurementRepository placeOfMeasurementRepository;

    @Autowired
    private PlaceOfMeasurementMapper placeOfMeasurementMapper;

    @Autowired
    private PlaceOfMeasurementService placeOfMeasurementService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restPlaceOfMeasurementMockMvc;

    private PlaceOfMeasurement placeOfMeasurement;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PlaceOfMeasurementResource placeOfMeasurementResource = new PlaceOfMeasurementResource(placeOfMeasurementService);
        this.restPlaceOfMeasurementMockMvc = MockMvcBuilders.standaloneSetup(placeOfMeasurementResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlaceOfMeasurement createEntity(EntityManager em) {
        PlaceOfMeasurement placeOfMeasurement = new PlaceOfMeasurement()
            .name(DEFAULT_NAME);
        return placeOfMeasurement;
    }

    @Before
    public void initTest() {
        placeOfMeasurement = createEntity(em);
    }

    @Test
    @Transactional
    public void createPlaceOfMeasurement() throws Exception {
        int databaseSizeBeforeCreate = placeOfMeasurementRepository.findAll().size();

        // Create the PlaceOfMeasurement
        PlaceOfMeasurementDTO placeOfMeasurementDTO = placeOfMeasurementMapper.toDto(placeOfMeasurement);
        restPlaceOfMeasurementMockMvc.perform(post("/api/place-of-measurements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(placeOfMeasurementDTO)))
            .andExpect(status().isCreated());

        // Validate the PlaceOfMeasurement in the database
        List<PlaceOfMeasurement> placeOfMeasurementList = placeOfMeasurementRepository.findAll();
        assertThat(placeOfMeasurementList).hasSize(databaseSizeBeforeCreate + 1);
        PlaceOfMeasurement testPlaceOfMeasurement = placeOfMeasurementList.get(placeOfMeasurementList.size() - 1);
        assertThat(testPlaceOfMeasurement.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createPlaceOfMeasurementWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = placeOfMeasurementRepository.findAll().size();

        // Create the PlaceOfMeasurement with an existing ID
        placeOfMeasurement.setId(1L);
        PlaceOfMeasurementDTO placeOfMeasurementDTO = placeOfMeasurementMapper.toDto(placeOfMeasurement);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlaceOfMeasurementMockMvc.perform(post("/api/place-of-measurements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(placeOfMeasurementDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PlaceOfMeasurement in the database
        List<PlaceOfMeasurement> placeOfMeasurementList = placeOfMeasurementRepository.findAll();
        assertThat(placeOfMeasurementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = placeOfMeasurementRepository.findAll().size();
        // set the field null
        placeOfMeasurement.setName(null);

        // Create the PlaceOfMeasurement, which fails.
        PlaceOfMeasurementDTO placeOfMeasurementDTO = placeOfMeasurementMapper.toDto(placeOfMeasurement);

        restPlaceOfMeasurementMockMvc.perform(post("/api/place-of-measurements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(placeOfMeasurementDTO)))
            .andExpect(status().isBadRequest());

        List<PlaceOfMeasurement> placeOfMeasurementList = placeOfMeasurementRepository.findAll();
        assertThat(placeOfMeasurementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPlaceOfMeasurements() throws Exception {
        // Initialize the database
        placeOfMeasurementRepository.saveAndFlush(placeOfMeasurement);

        // Get all the placeOfMeasurementList
        restPlaceOfMeasurementMockMvc.perform(get("/api/place-of-measurements?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(placeOfMeasurement.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getPlaceOfMeasurement() throws Exception {
        // Initialize the database
        placeOfMeasurementRepository.saveAndFlush(placeOfMeasurement);

        // Get the placeOfMeasurement
        restPlaceOfMeasurementMockMvc.perform(get("/api/place-of-measurements/{id}", placeOfMeasurement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(placeOfMeasurement.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPlaceOfMeasurement() throws Exception {
        // Get the placeOfMeasurement
        restPlaceOfMeasurementMockMvc.perform(get("/api/place-of-measurements/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePlaceOfMeasurement() throws Exception {
        // Initialize the database
        placeOfMeasurementRepository.saveAndFlush(placeOfMeasurement);

        int databaseSizeBeforeUpdate = placeOfMeasurementRepository.findAll().size();

        // Update the placeOfMeasurement
        PlaceOfMeasurement updatedPlaceOfMeasurement = placeOfMeasurementRepository.findById(placeOfMeasurement.getId()).get();
        // Disconnect from session so that the updates on updatedPlaceOfMeasurement are not directly saved in db
        em.detach(updatedPlaceOfMeasurement);
        updatedPlaceOfMeasurement
            .name(UPDATED_NAME);
        PlaceOfMeasurementDTO placeOfMeasurementDTO = placeOfMeasurementMapper.toDto(updatedPlaceOfMeasurement);

        restPlaceOfMeasurementMockMvc.perform(put("/api/place-of-measurements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(placeOfMeasurementDTO)))
            .andExpect(status().isOk());

        // Validate the PlaceOfMeasurement in the database
        List<PlaceOfMeasurement> placeOfMeasurementList = placeOfMeasurementRepository.findAll();
        assertThat(placeOfMeasurementList).hasSize(databaseSizeBeforeUpdate);
        PlaceOfMeasurement testPlaceOfMeasurement = placeOfMeasurementList.get(placeOfMeasurementList.size() - 1);
        assertThat(testPlaceOfMeasurement.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingPlaceOfMeasurement() throws Exception {
        int databaseSizeBeforeUpdate = placeOfMeasurementRepository.findAll().size();

        // Create the PlaceOfMeasurement
        PlaceOfMeasurementDTO placeOfMeasurementDTO = placeOfMeasurementMapper.toDto(placeOfMeasurement);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaceOfMeasurementMockMvc.perform(put("/api/place-of-measurements")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(placeOfMeasurementDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PlaceOfMeasurement in the database
        List<PlaceOfMeasurement> placeOfMeasurementList = placeOfMeasurementRepository.findAll();
        assertThat(placeOfMeasurementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePlaceOfMeasurement() throws Exception {
        // Initialize the database
        placeOfMeasurementRepository.saveAndFlush(placeOfMeasurement);

        int databaseSizeBeforeDelete = placeOfMeasurementRepository.findAll().size();

        // Delete the placeOfMeasurement
        restPlaceOfMeasurementMockMvc.perform(delete("/api/place-of-measurements/{id}", placeOfMeasurement.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<PlaceOfMeasurement> placeOfMeasurementList = placeOfMeasurementRepository.findAll();
        assertThat(placeOfMeasurementList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlaceOfMeasurement.class);
        PlaceOfMeasurement placeOfMeasurement1 = new PlaceOfMeasurement();
        placeOfMeasurement1.setId(1L);
        PlaceOfMeasurement placeOfMeasurement2 = new PlaceOfMeasurement();
        placeOfMeasurement2.setId(placeOfMeasurement1.getId());
        assertThat(placeOfMeasurement1).isEqualTo(placeOfMeasurement2);
        placeOfMeasurement2.setId(2L);
        assertThat(placeOfMeasurement1).isNotEqualTo(placeOfMeasurement2);
        placeOfMeasurement1.setId(null);
        assertThat(placeOfMeasurement1).isNotEqualTo(placeOfMeasurement2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlaceOfMeasurementDTO.class);
        PlaceOfMeasurementDTO placeOfMeasurementDTO1 = new PlaceOfMeasurementDTO();
        placeOfMeasurementDTO1.setId(1L);
        PlaceOfMeasurementDTO placeOfMeasurementDTO2 = new PlaceOfMeasurementDTO();
        assertThat(placeOfMeasurementDTO1).isNotEqualTo(placeOfMeasurementDTO2);
        placeOfMeasurementDTO2.setId(placeOfMeasurementDTO1.getId());
        assertThat(placeOfMeasurementDTO1).isEqualTo(placeOfMeasurementDTO2);
        placeOfMeasurementDTO2.setId(2L);
        assertThat(placeOfMeasurementDTO1).isNotEqualTo(placeOfMeasurementDTO2);
        placeOfMeasurementDTO1.setId(null);
        assertThat(placeOfMeasurementDTO1).isNotEqualTo(placeOfMeasurementDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(placeOfMeasurementMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(placeOfMeasurementMapper.fromId(null)).isNull();
    }
}
