import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SmogAnalyzerSharedModule } from '../shared';

import { ANALYSIS_ROUTE, AnalysisComponent } from './';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [SmogAnalyzerSharedModule, ReactiveFormsModule, RouterModule.forRoot([ANALYSIS_ROUTE], { useHash: true })],
    declarations: [AnalysisComponent],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmogAnalyzerAppAnalysisModule {}
