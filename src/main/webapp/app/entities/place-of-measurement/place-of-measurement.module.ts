import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { SmogAnalyzerSharedModule } from 'app/shared';
import {
    PlaceOfMeasurementComponent,
    PlaceOfMeasurementDetailComponent,
    PlaceOfMeasurementUpdateComponent,
    PlaceOfMeasurementDeletePopupComponent,
    PlaceOfMeasurementDeleteDialogComponent,
    placeOfMeasurementRoute,
    placeOfMeasurementPopupRoute
} from './';

const ENTITY_STATES = [...placeOfMeasurementRoute, ...placeOfMeasurementPopupRoute];

@NgModule({
    imports: [SmogAnalyzerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PlaceOfMeasurementComponent,
        PlaceOfMeasurementDetailComponent,
        PlaceOfMeasurementUpdateComponent,
        PlaceOfMeasurementDeleteDialogComponent,
        PlaceOfMeasurementDeletePopupComponent
    ],
    entryComponents: [
        PlaceOfMeasurementComponent,
        PlaceOfMeasurementUpdateComponent,
        PlaceOfMeasurementDeleteDialogComponent,
        PlaceOfMeasurementDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerPlaceOfMeasurementModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
