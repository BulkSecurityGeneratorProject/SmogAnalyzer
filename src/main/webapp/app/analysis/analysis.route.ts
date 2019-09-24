import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { AnalysisComponent } from './analysis.component';

export const ANALYSIS_ROUTE: Route = {
    path: 'analysis',
    component: AnalysisComponent,
    data: {
        authorities: ['ROLE_USER', 'ROLE_ADMIN'],
        pageTitle: 'analysis.title'
    },
    canActivate: [UserRouteAccessService],
    children: []
};
