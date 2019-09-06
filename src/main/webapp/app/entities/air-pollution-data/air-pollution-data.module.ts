import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { SmogAnalyzerSharedModule } from 'app/shared';
import {
    AirPollutionDataComponent,
    AirPollutionDataDetailComponent,
    AirPollutionDataUpdateComponent,
    AirPollutionDataDeletePopupComponent,
    AirPollutionDataDeleteDialogComponent,
    airPollutionDataRoute,
    airPollutionDataPopupRoute
} from './';
import { MapPopupComponent } from './map-popup/map-popup.component';

const ENTITY_STATES = [...airPollutionDataRoute, ...airPollutionDataPopupRoute];

@NgModule({
    imports: [SmogAnalyzerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AirPollutionDataComponent,
        AirPollutionDataDetailComponent,
        AirPollutionDataUpdateComponent,
        AirPollutionDataDeleteDialogComponent,
        AirPollutionDataDeletePopupComponent,
        MapPopupComponent
    ],
    entryComponents: [
        AirPollutionDataComponent,
        AirPollutionDataUpdateComponent,
        AirPollutionDataDeleteDialogComponent,
        AirPollutionDataDeletePopupComponent,
        MapPopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerAirPollutionDataModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
