import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AirlyData } from 'app/shared/model/airly-data.model';
import { AirlyDataService } from './airly-data.service';
import { AirlyDataComponent } from './airly-data.component';
import { AirlyDataDetailComponent } from './airly-data-detail.component';
import { AirlyDataUpdateComponent } from './airly-data-update.component';
import { AirlyDataDeletePopupComponent } from './airly-data-delete-dialog.component';
import { IAirlyData } from 'app/shared/model/airly-data.model';

@Injectable({ providedIn: 'root' })
export class AirlyDataResolve implements Resolve<IAirlyData> {
    constructor(private service: AirlyDataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAirlyData> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<AirlyData>) => response.ok),
                map((airlyData: HttpResponse<AirlyData>) => airlyData.body)
            );
        }
        return of(new AirlyData());
    }
}

export const airlyDataRoute: Routes = [
    {
        path: '',
        component: AirlyDataComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'smogAnalyzerApp.airlyData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: AirlyDataDetailComponent,
        resolve: {
            airlyData: AirlyDataResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.airlyData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: AirlyDataUpdateComponent,
        resolve: {
            airlyData: AirlyDataResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.airlyData.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: AirlyDataUpdateComponent,
        resolve: {
            airlyData: AirlyDataResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.airlyData.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const airlyDataPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: AirlyDataDeletePopupComponent,
        resolve: {
            airlyData: AirlyDataResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.airlyData.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
