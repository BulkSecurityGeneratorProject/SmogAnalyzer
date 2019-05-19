import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SmogAnalyzerSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { WeatherComponent } from './weather/weather.component';

@NgModule({
    imports: [SmogAnalyzerSharedModule, RouterModule.forChild([HOME_ROUTE])],
    declarations: [HomeComponent, WeatherComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerHomeModule {}
