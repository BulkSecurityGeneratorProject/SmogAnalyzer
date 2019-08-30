import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';
import { PlaceOfMeasurementService } from './place-of-measurement.service';
import { PlaceOfMeasurementComponent } from './place-of-measurement.component';
import { PlaceOfMeasurementDetailComponent } from './place-of-measurement-detail.component';
import { PlaceOfMeasurementUpdateComponent } from './place-of-measurement-update.component';
import { PlaceOfMeasurementDeletePopupComponent } from './place-of-measurement-delete-dialog.component';
import { IPlaceOfMeasurement } from 'app/shared/model/place-of-measurement.model';

@Injectable({ providedIn: 'root' })
export class PlaceOfMeasurementResolve implements Resolve<IPlaceOfMeasurement> {
    constructor(private service: PlaceOfMeasurementService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPlaceOfMeasurement> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PlaceOfMeasurement>) => response.ok),
                map((placeOfMeasurement: HttpResponse<PlaceOfMeasurement>) => placeOfMeasurement.body)
            );
        }
        return of(new PlaceOfMeasurement());
    }
}

export const placeOfMeasurementRoute: Routes = [
    {
        path: '',
        component: PlaceOfMeasurementComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.placeOfMeasurement.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PlaceOfMeasurementDetailComponent,
        resolve: {
            placeOfMeasurement: PlaceOfMeasurementResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.placeOfMeasurement.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PlaceOfMeasurementUpdateComponent,
        resolve: {
            placeOfMeasurement: PlaceOfMeasurementResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.placeOfMeasurement.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PlaceOfMeasurementUpdateComponent,
        resolve: {
            placeOfMeasurement: PlaceOfMeasurementResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.placeOfMeasurement.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const placeOfMeasurementPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PlaceOfMeasurementDeletePopupComponent,
        resolve: {
            placeOfMeasurement: PlaceOfMeasurementResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'smogAnalyzerApp.placeOfMeasurement.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
