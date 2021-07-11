import { NgZone, OnDestroy } from '@angular/core';
import { AngularFireAnalytics } from './analytics';
import { AngularFireAuth } from '@angular/fire/auth';
export declare class UserTrackingService implements OnDestroy {
    initialized: Promise<void>;
    private disposables;
    constructor(analytics: AngularFireAnalytics, platformId: Object, auth: AngularFireAuth, zone: NgZone);
    ngOnDestroy(): void;
}
