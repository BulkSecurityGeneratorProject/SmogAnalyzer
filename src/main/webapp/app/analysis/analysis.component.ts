import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    selector: 'jhi-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['analysis.component.css']
})
export class AnalysisComponent implements OnInit {
    typesOfAnalysisForm: FormGroup;
    typesOfAnalysis = [];

    static getTypesOfAnalysis() {
        return [{ id: '0', name: 'Monthly' }, { id: '1', name: 'Daily' }];
    }

    constructor(private formBuilder: FormBuilder) {
        this.typesOfAnalysisForm = this.formBuilder.group({
            typesOfAnalysis: ['']
        });

        this.typesOfAnalysis = AnalysisComponent.getTypesOfAnalysis();

        of(AnalysisComponent.getTypesOfAnalysis()).subscribe(types => {
            this.typesOfAnalysis = types;
            this.typesOfAnalysisForm.controls.types.patchValue(this.typesOfAnalysis[0].id);
        });
    }

    ngOnInit() {}
}
