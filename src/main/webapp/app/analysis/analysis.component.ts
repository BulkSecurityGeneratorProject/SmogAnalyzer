import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'jhi-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['analysis.component.css']
})
export class AnalysisComponent implements OnInit {
    message: string;

    constructor() {
        this.message = 'AnalysisComponent message';
    }

    ngOnInit() {}
}
