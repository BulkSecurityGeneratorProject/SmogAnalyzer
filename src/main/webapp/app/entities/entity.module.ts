import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'weather-api-key',
                loadChildren: './weather-api-key/weather-api-key.module#SmogAnalyzerWeatherApiKeyModule'
            },
            {
                path: 'air-pollution-data',
                loadChildren: './air-pollution-data/air-pollution-data.module#SmogAnalyzerAirPollutionDataModule'
            },
            {
                path: 'weather-data',
                loadChildren: './weather-data/weather-data.module#SmogAnalyzerWeatherDataModule'
            },
            {
                path: 'air-pollution-data',
                loadChildren: './air-pollution-data/air-pollution-data.module#SmogAnalyzerAirPollutionDataModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerEntityModule {}
