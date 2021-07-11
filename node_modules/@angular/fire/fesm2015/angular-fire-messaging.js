import { __awaiter } from 'tslib';
import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, Optional, PLATFORM_ID, NgZone, NgModule } from '@angular/core';
import firebase from 'firebase/app';
import { of, EMPTY, throwError, Observable, concat } from 'rxjs';
import { subscribeOn, observeOn, switchMap, map, shareReplay, switchMapTo, catchError, mergeMap, defaultIfEmpty } from 'rxjs/operators';
import * as i1 from '@angular/fire';
import { ɵAngularFireSchedulers, ɵfirebaseAppFactory, ɵfetchInstance, ɵlazySDKProxy, FIREBASE_OPTIONS, FIREBASE_APP_NAME, ɵapplyMixins } from '@angular/fire';
import { isPlatformServer } from '@angular/common';

const proxyPolyfillCompat = {
    deleteToken: null,
    getToken: null,
    onMessage: null,
    onBackgroundMessage: null,
    onTokenRefresh: null,
    requestPermission: null,
    setBackgroundMessageHandler: null,
    useServiceWorker: null,
    usePublicVapidKey: null,
};

const VAPID_KEY = new InjectionToken('angularfire2.messaging.vapid-key');
const SERVICE_WORKER = new InjectionToken('angularfire2.messaging.service-worker-registeration');
// SEMVER(7): drop
const firebaseLTv8 = parseInt(firebase.SDK_VERSION, 10) < 8;
class AngularFireMessaging {
    constructor(options, nameOrConfig, 
    // tslint:disable-next-line:ban-types
    platformId, zone, vapidKey, _serviceWorker) {
        const schedulers = new ɵAngularFireSchedulers(zone);
        const serviceWorker = _serviceWorker;
        const messaging = of(undefined).pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(() => isPlatformServer(platformId) ? EMPTY : import('firebase/messaging')), map(() => ɵfirebaseAppFactory(options, zone, nameOrConfig)), switchMap(app => ɵfetchInstance(`${app.name}.messaging`, 'AngularFireMessaging', app, () => __awaiter(this, void 0, void 0, function* () {
            const messaging = app.messaging();
            if (firebaseLTv8) {
                if (vapidKey) {
                    messaging.usePublicVapidKey(vapidKey);
                }
                if (serviceWorker) {
                    messaging.useServiceWorker(yield serviceWorker);
                }
            }
            return messaging;
        }), [vapidKey, serviceWorker])), shareReplay({ bufferSize: 1, refCount: false }));
        this.requestPermission = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), 
        // tslint:disable-next-line
        switchMap(messaging => firebase.messaging.isSupported() ? messaging.requestPermission() : throwError('Not supported.')));
        this.getToken = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap((messaging) => __awaiter(this, void 0, void 0, function* () {
            if (firebase.messaging.isSupported() && Notification.permission === 'granted') {
                if (firebaseLTv8) {
                    return yield messaging.getToken();
                }
                else {
                    const serviceWorkerRegistration = serviceWorker ? yield serviceWorker : null;
                    return yield messaging.getToken({ vapidKey, serviceWorkerRegistration });
                }
            }
            else {
                return null;
            }
        })));
        const notificationPermission$ = new Observable(emitter => {
            navigator.permissions.query({ name: 'notifications' }).then(notificationPerm => {
                notificationPerm.onchange = () => emitter.next();
            });
        });
        const tokenChange$ = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMapTo(notificationPermission$), switchMapTo(this.getToken));
        this.tokenChanges = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(() => firebase.messaging.isSupported() ? concat(this.getToken, tokenChange$) : EMPTY));
        this.messages = messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(messaging => firebase.messaging.isSupported() ? new Observable(emitter => messaging.onMessage(next => emitter.next(next), err => emitter.error(err), () => emitter.complete())) : EMPTY));
        this.requestToken = of(undefined).pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(() => this.requestPermission), catchError(() => of(null)), mergeMap(() => this.tokenChanges));
        // SEMVER(7): drop token
        this.deleteToken = (token) => messaging.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), switchMap(messaging => messaging.deleteToken(token || undefined)), defaultIfEmpty(false));
        return ɵlazySDKProxy(this, messaging, zone);
    }
}
/** @nocollapse */ AngularFireMessaging.ɵprov = i0.ɵɵdefineInjectable({ factory: function AngularFireMessaging_Factory() { return new AngularFireMessaging(i0.ɵɵinject(i1.FIREBASE_OPTIONS), i0.ɵɵinject(i1.FIREBASE_APP_NAME, 8), i0.ɵɵinject(i0.PLATFORM_ID), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(VAPID_KEY, 8), i0.ɵɵinject(SERVICE_WORKER, 8)); }, token: AngularFireMessaging, providedIn: "any" });
AngularFireMessaging.decorators = [
    { type: Injectable, args: [{
                providedIn: 'any'
            },] }
];
/** @nocollapse */
AngularFireMessaging.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [FIREBASE_OPTIONS,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FIREBASE_APP_NAME,] }] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [VAPID_KEY,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [SERVICE_WORKER,] }] }
];
ɵapplyMixins(AngularFireMessaging, [proxyPolyfillCompat]);

class AngularFireMessagingModule {
}
AngularFireMessagingModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireMessaging]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AngularFireMessaging, AngularFireMessagingModule, SERVICE_WORKER, VAPID_KEY };
//# sourceMappingURL=angular-fire-messaging.js.map
