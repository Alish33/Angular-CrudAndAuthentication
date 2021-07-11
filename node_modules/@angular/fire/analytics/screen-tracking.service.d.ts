import { ComponentFactoryResolver, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAnalytics } from './analytics';
import { Title } from '@angular/platform-browser';
import { UserTrackingService } from './user-tracking.service';
export declare class ScreenTrackingService implements OnDestroy {
    private disposable;
    constructor(analytics: AngularFireAnalytics, router: Router, title: Title, componentFactoryResolver: ComponentFactoryResolver, platformId: Object, zone: NgZone, userTrackingService: UserTrackingService);
    ngOnDestroy(): void;
}
