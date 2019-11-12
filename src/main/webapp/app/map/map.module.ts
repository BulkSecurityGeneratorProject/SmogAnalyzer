import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SmogAnalyzerSharedModule } from '../shared';

import { MAP_ROUTE, MapComponent } from './';
import { SmogAnalyzerAirPollutionDataModule } from 'app/entities/air-pollution-data/air-pollution-data.module';

@NgModule({
    imports: [SmogAnalyzerSharedModule, SmogAnalyzerAirPollutionDataModule, RouterModule.forRoot([MAP_ROUTE], { useHash: true })],
    declarations: [MapComponent],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerAppMapModule {}
