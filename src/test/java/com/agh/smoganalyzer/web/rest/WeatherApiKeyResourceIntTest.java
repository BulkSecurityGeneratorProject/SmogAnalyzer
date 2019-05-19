package com.agh.smoganalyzer.web.rest;

import com.agh.smoganalyzer.SmogAnalyzerApp;

import com.agh.smoganalyzer.domain.WeatherApiKey;
import com.agh.smoganalyzer.repository.WeatherApiKeyRepository;
import com.agh.smoganalyzer.service.WeatherApiKeyService;
import com.agh.smoganalyzer.service.dto.WeatherApiKeyDTO;
import com.agh.smoganalyzer.service.mapper.WeatherApiKeyMapper;
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
 * Test class for the WeatherApiKeyResource REST controller.
 *
 * @see WeatherApiKeyResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SmogAnalyzerApp.class)
public class WeatherApiKeyResourceIntTest {

    private static final String DEFAULT_API_KEY = "AAAAAAAAAA";
    private static final String UPDATED_API_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_BASE_URL = "AAAAAAAAAA";
    private static final String UPDATED_BASE_URL = "BBBBBBBBBB";

    @Autowired
    private WeatherApiKeyRepository weatherApiKeyRepository;

    @Autowired
    private WeatherApiKeyMapper weatherApiKeyMapper;

    @Autowired
    private WeatherApiKeyService weatherApiKeyService;

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

    private MockMvc restWeatherApiKeyMockMvc;

    private WeatherApiKey weatherApiKey;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WeatherApiKeyResource weatherApiKeyResource = new WeatherApiKeyResource(weatherApiKeyService);
        this.restWeatherApiKeyMockMvc = MockMvcBuilders.standaloneSetup(weatherApiKeyResource)
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
    public static WeatherApiKey createEntity(EntityManager em) {
        WeatherApiKey weatherApiKey = new WeatherApiKey()
            .apiKey(DEFAULT_API_KEY)
            .baseUrl(DEFAULT_BASE_URL);
        return weatherApiKey;
    }

    @Before
    public void initTest() {
        weatherApiKey = createEntity(em);
    }

    @Test
    @Transactional
    public void createWeatherApiKey() throws Exception {
        int databaseSizeBeforeCreate = weatherApiKeyRepository.findAll().size();

        // Create the WeatherApiKey
        WeatherApiKeyDTO weatherApiKeyDTO = weatherApiKeyMapper.toDto(weatherApiKey);
        restWeatherApiKeyMockMvc.perform(post("/api/weather-api-keys")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherApiKeyDTO)))
            .andExpect(status().isCreated());

        // Validate the WeatherApiKey in the database
        List<WeatherApiKey> weatherApiKeyList = weatherApiKeyRepository.findAll();
        assertThat(weatherApiKeyList).hasSize(databaseSizeBeforeCreate + 1);
        WeatherApiKey testWeatherApiKey = weatherApiKeyList.get(weatherApiKeyList.size() - 1);
        assertThat(testWeatherApiKey.getApiKey()).isEqualTo(DEFAULT_API_KEY);
        assertThat(testWeatherApiKey.getBaseUrl()).isEqualTo(DEFAULT_BASE_URL);
    }

    @Test
    @Transactional
    public void createWeatherApiKeyWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = weatherApiKeyRepository.findAll().size();

        // Create the WeatherApiKey with an existing ID
        weatherApiKey.setId(1L);
        WeatherApiKeyDTO weatherApiKeyDTO = weatherApiKeyMapper.toDto(weatherApiKey);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeatherApiKeyMockMvc.perform(post("/api/weather-api-keys")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherApiKeyDTO)))
            .andExpect(status().isBadRequest());

        // Validate the WeatherApiKey in the database
        List<WeatherApiKey> weatherApiKeyList = weatherApiKeyRepository.findAll();
        assertThat(weatherApiKeyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkApiKeyIsRequired() throws Exception {
        int databaseSizeBeforeTest = weatherApiKeyRepository.findAll().size();
        // set the field null
        weatherApiKey.setApiKey(null);

        // Create the WeatherApiKey, which fails.
        WeatherApiKeyDTO weatherApiKeyDTO = weatherApiKeyMapper.toDto(weatherApiKey);

        restWeatherApiKeyMockMvc.perform(post("/api/weather-api-keys")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherApiKeyDTO)))
            .andExpect(status().isBadRequest());

        List<WeatherApiKey> weatherApiKeyList = weatherApiKeyRepository.findAll();
        assertThat(weatherApiKeyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkBaseUrlIsRequired() throws Exception {
        int databaseSizeBeforeTest = weatherApiKeyRepository.findAll().size();
        // set the field null
        weatherApiKey.setBaseUrl(null);

        // Create the WeatherApiKey, which fails.
        WeatherApiKeyDTO weatherApiKeyDTO = weatherApiKeyMapper.toDto(weatherApiKey);

        restWeatherApiKeyMockMvc.perform(post("/api/weather-api-keys")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherApiKeyDTO)))
            .andExpect(status().isBadRequest());

        List<WeatherApiKey> weatherApiKeyList = weatherApiKeyRepository.findAll();
        assertThat(weatherApiKeyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllWeatherApiKeys() throws Exception {
        // Initialize the database
        weatherApiKeyRepository.saveAndFlush(weatherApiKey);

        // Get all the weatherApiKeyList
        restWeatherApiKeyMockMvc.perform(get("/api/weather-api-keys?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weatherApiKey.getId().intValue())))
            .andExpect(jsonPath("$.[*].apiKey").value(hasItem(DEFAULT_API_KEY.toString())))
            .andExpect(jsonPath("$.[*].baseUrl").value(hasItem(DEFAULT_BASE_URL.toString())));
    }
    
    @Test
    @Transactional
    public void getWeatherApiKey() throws Exception {
        // Initialize the database
        weatherApiKeyRepository.saveAndFlush(weatherApiKey);

        // Get the weatherApiKey
        restWeatherApiKeyMockMvc.perform(get("/api/weather-api-keys/{id}", weatherApiKey.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(weatherApiKey.getId().intValue()))
            .andExpect(jsonPath("$.apiKey").value(DEFAULT_API_KEY.toString()))
            .andExpect(jsonPath("$.baseUrl").value(DEFAULT_BASE_URL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingWeatherApiKey() throws Exception {
        // Get the weatherApiKey
        restWeatherApiKeyMockMvc.perform(get("/api/weather-api-keys/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWeatherApiKey() throws Exception {
        // Initialize the database
        weatherApiKeyRepository.saveAndFlush(weatherApiKey);

        int databaseSizeBeforeUpdate = weatherApiKeyRepository.findAll().size();

        // Update the weatherApiKey
        WeatherApiKey updatedWeatherApiKey = weatherApiKeyRepository.findById(weatherApiKey.getId()).get();
        // Disconnect from session so that the updates on updatedWeatherApiKey are not directly saved in db
        em.detach(updatedWeatherApiKey);
        updatedWeatherApiKey
            .apiKey(UPDATED_API_KEY)
            .baseUrl(UPDATED_BASE_URL);
        WeatherApiKeyDTO weatherApiKeyDTO = weatherApiKeyMapper.toDto(updatedWeatherApiKey);

        restWeatherApiKeyMockMvc.perform(put("/api/weather-api-keys")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherApiKeyDTO)))
            .andExpect(status().isOk());

        // Validate the WeatherApiKey in the database
        List<WeatherApiKey> weatherApiKeyList = weatherApiKeyRepository.findAll();
        assertThat(weatherApiKeyList).hasSize(databaseSizeBeforeUpdate);
        WeatherApiKey testWeatherApiKey = weatherApiKeyList.get(weatherApiKeyList.size() - 1);
        assertThat(testWeatherApiKey.getApiKey()).isEqualTo(UPDATED_API_KEY);
        assertThat(testWeatherApiKey.getBaseUrl()).isEqualTo(UPDATED_BASE_URL);
    }

    @Test
    @Transactional
    public void updateNonExistingWeatherApiKey() throws Exception {
        int databaseSizeBeforeUpdate = weatherApiKeyRepository.findAll().size();

        // Create the WeatherApiKey
        WeatherApiKeyDTO weatherApiKeyDTO = weatherApiKeyMapper.toDto(weatherApiKey);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeatherApiKeyMockMvc.perform(put("/api/weather-api-keys")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weatherApiKeyDTO)))
            .andExpect(status().isBadRequest());

        // Validate the WeatherApiKey in the database
        List<WeatherApiKey> weatherApiKeyList = weatherApiKeyRepository.findAll();
        assertThat(weatherApiKeyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWeatherApiKey() throws Exception {
        // Initialize the database
        weatherApiKeyRepository.saveAndFlush(weatherApiKey);

        int databaseSizeBeforeDelete = weatherApiKeyRepository.findAll().size();

        // Delete the weatherApiKey
        restWeatherApiKeyMockMvc.perform(delete("/api/weather-api-keys/{id}", weatherApiKey.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<WeatherApiKey> weatherApiKeyList = weatherApiKeyRepository.findAll();
        assertThat(weatherApiKeyList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WeatherApiKey.class);
        WeatherApiKey weatherApiKey1 = new WeatherApiKey();
        weatherApiKey1.setId(1L);
        WeatherApiKey weatherApiKey2 = new WeatherApiKey();
        weatherApiKey2.setId(weatherApiKey1.getId());
        assertThat(weatherApiKey1).isEqualTo(weatherApiKey2);
        weatherApiKey2.setId(2L);
        assertThat(weatherApiKey1).isNotEqualTo(weatherApiKey2);
        weatherApiKey1.setId(null);
        assertThat(weatherApiKey1).isNotEqualTo(weatherApiKey2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(WeatherApiKeyDTO.class);
        WeatherApiKeyDTO weatherApiKeyDTO1 = new WeatherApiKeyDTO();
        weatherApiKeyDTO1.setId(1L);
        WeatherApiKeyDTO weatherApiKeyDTO2 = new WeatherApiKeyDTO();
        assertThat(weatherApiKeyDTO1).isNotEqualTo(weatherApiKeyDTO2);
        weatherApiKeyDTO2.setId(weatherApiKeyDTO1.getId());
        assertThat(weatherApiKeyDTO1).isEqualTo(weatherApiKeyDTO2);
        weatherApiKeyDTO2.setId(2L);
        assertThat(weatherApiKeyDTO1).isNotEqualTo(weatherApiKeyDTO2);
        weatherApiKeyDTO1.setId(null);
        assertThat(weatherApiKeyDTO1).isNotEqualTo(weatherApiKeyDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(weatherApiKeyMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(weatherApiKeyMapper.fromId(null)).isNull();
    }
}
