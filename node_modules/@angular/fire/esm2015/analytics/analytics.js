import { __awaiter } from "tslib";
import { Inject, Injectable, InjectionToken, NgZone, Optional, PLATFORM_ID } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map, shareReplay, switchMap, observeOn } from 'rxjs/operators';
import { ɵAngularFireSchedulers, ɵlazySDKProxy, ɵapplyMixins, FirebaseApp } from '@angular/fire';
import { proxyPolyfillCompat } from './base';
import { ɵfetchInstance } from '@angular/fire';
import * as i0 from "@angular/core";
import * as i1 from "@angular/fire";
export const COLLECTION_ENABLED = new InjectionToken('angularfire2.analytics.analyticsCollectionEnabled');
export const APP_VERSION = new InjectionToken('angularfire2.analytics.appVersion');
export const APP_NAME = new InjectionToken('angularfire2.analytics.appName');
export const DEBUG_MODE = new InjectionToken('angularfire2.analytics.debugMode');
export const CONFIG = new InjectionToken('angularfire2.analytics.config');
const APP_NAME_KEY = 'app_name';
const APP_VERSION_KEY = 'app_version';
const DEBUG_MODE_KEY = 'debug_mode';
const GTAG_CONFIG_COMMAND = 'config';
const GTAG_FUNCTION_NAME = 'gtag'; // TODO rename these
const DATA_LAYER_NAME = 'dataLayer';
const SEND_TO_KEY = 'send_to';
export class AngularFireAnalytics {
    constructor(app, analyticsCollectionEnabled, providedAppVersion, providedAppName, debugModeEnabled, providedConfig, 
    // tslint:disable-next-line:ban-types
    platformId, zone) {
        this.analyticsInitialized = new Promise(() => { });
        if (isPlatformBrowser(platformId)) {
            window[DATA_LAYER_NAME] = window[DATA_LAYER_NAME] || [];
            // It turns out we can't rely on the measurementId in the Firebase config JSON
            // this identifier is not stable. firebase/analytics does a call to get a fresh value
            // falling back on the one in the config. Rather than do that ourselves we should listen
            // on our gtag function for a analytics config command
            // e.g, ['config', measurementId, { origin: 'firebase', firebase_id }]
            const parseMeasurementId = (...args) => {
                if (args[0] === 'config' && args[2].origin === 'firebase') {
                    this.measurementId = args[1];
                    return true;
                }
                else {
                    return false;
                }
            };
            const patchGtag = (fn) => {
                window[GTAG_FUNCTION_NAME] = (...args) => {
                    if (fn) {
                        fn(...args);
                    }
                    // Inject app_name and app_version into events
                    // TODO(jamesdaniels): I'm doing this as documented but it's still not
                    //   showing up in the console. Investigate. Guessing it's just part of the
                    //   whole GA4 transition mess.
                    if (args[0] === 'event' && args[2][SEND_TO_KEY] === this.measurementId) {
                        if (providedAppName) {
                            args[2][APP_NAME_KEY] = providedAppName;
                        }
                        if (providedAppVersion) {
                            args[2][APP_VERSION_KEY] = providedAppVersion;
                        }
                    }
                    if (debugModeEnabled && typeof console !== 'undefined') {
                        // tslint:disable-next-line:no-console
                        console.info(...args);
                    }
                    /**
                     * According to the gtag documentation, this function that defines a custom data layer cannot be
                     * an arrow function because 'arguments' is not an array. It is actually an object that behaves
                     * like an array and contains more information then just indexes. Transforming this into arrow function
                     * caused issue #2505 where analytics no longer sent any data.
                     */
                    // tslint:disable-next-line: only-arrow-functions
                    (function (..._args) {
                        window[DATA_LAYER_NAME].push(arguments);
                    })(...args);
                };
            };
            // Unclear if we still need to but I was running into config/events I passed
            // to gtag before ['js' timestamp] weren't getting parsed, so let's make a promise
            // that resolves when firebase/analytics has configured gtag.js that we wait on
            // before sending anything
            const firebaseAnalyticsAlreadyInitialized = window[DATA_LAYER_NAME].some(parseMeasurementId);
            if (firebaseAnalyticsAlreadyInitialized) {
                this.analyticsInitialized = Promise.resolve();
                patchGtag();
            }
            else {
                this.analyticsInitialized = new Promise(resolve => {
                    patchGtag((...args) => {
                        if (parseMeasurementId(...args)) {
                            resolve();
                        }
                    });
                });
            }
            if (providedConfig) {
                this.updateConfig(providedConfig);
            }
            if (debugModeEnabled) {
                this.updateConfig({ [DEBUG_MODE_KEY]: 1 });
            }
        }
        else {
            this.analyticsInitialized = Promise.resolve();
        }
        const analytics = of(undefined).pipe(observeOn(new ɵAngularFireSchedulers(zone).outsideAngular), switchMap(() => isPlatformBrowser(platformId) ? zone.runOutsideAngular(() => import('firebase/analytics')) : EMPTY), 
        // SEMVER can switch to isSupported() when we only target v8
        // switchMap(() => firebase.analytics.isSupported().then(it => it, () => false)),
        // TODO server-side investigate use of the Universal Analytics API
        // switchMap(supported => supported ? of(undefined) : EMPTY),
        map(() => {
            return ɵfetchInstance(`analytics`, 'AngularFireAnalytics', app, () => {
                const analytics = app.analytics();
                if (analyticsCollectionEnabled === false) {
                    analytics.setAnalyticsCollectionEnabled(false);
                }
                return analytics;
            }, [app, analyticsCollectionEnabled, providedConfig, debugModeEnabled]);
        }), shareReplay({ bufferSize: 1, refCount: false }));
        return ɵlazySDKProxy(this, analytics, zone);
    }
    updateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.analyticsInitialized;
            window[GTAG_FUNCTION_NAME](GTAG_CONFIG_COMMAND, this.measurementId, Object.assign(Object.assign({}, config), { update: true }));
        });
    }
}
/** @nocollapse */ AngularFireAnalytics.ɵprov = i0.ɵɵdefineInjectable({ factory: function AngularFireAnalytics_Factory() { return new AngularFireAnalytics(i0.ɵɵinject(i1.FirebaseApp), i0.ɵɵinject(COLLECTION_ENABLED, 8), i0.ɵɵinject(APP_VERSION, 8), i0.ɵɵinject(APP_NAME, 8), i0.ɵɵinject(DEBUG_MODE, 8), i0.ɵɵinject(CONFIG, 8), i0.ɵɵinject(i0.PLATFORM_ID), i0.ɵɵinject(i0.NgZone)); }, token: AngularFireAnalytics, providedIn: "any" });
AngularFireAnalytics.decorators = [
    { type: Injectable, args: [{
                providedIn: 'any'
            },] }
];
/** @nocollapse */
AngularFireAnalytics.ctorParameters = () => [
    { type: FirebaseApp },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [COLLECTION_ENABLED,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [APP_VERSION,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [APP_NAME,] }] },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [DEBUG_MODE,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONFIG,] }] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone }
];
ɵapplyMixins(AngularFireAnalytics, [proxyPolyfillCompat]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl0aWNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FuYWx5dGljcy9hbmFseXRpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNqQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEUsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixhQUFhLEVBRWIsWUFBWSxFQUNaLFdBQVcsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDN0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBTS9DLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLElBQUksY0FBYyxDQUFVLG1EQUFtRCxDQUFDLENBQUM7QUFDbkgsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLElBQUksY0FBYyxDQUFTLG1DQUFtQyxDQUFDLENBQUM7QUFDM0YsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBYyxDQUFTLGdDQUFnQyxDQUFDLENBQUM7QUFDckYsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLElBQUksY0FBYyxDQUFVLGtDQUFrQyxDQUFDLENBQUM7QUFDMUYsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFTLCtCQUErQixDQUFDLENBQUM7QUFFbEYsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDO0FBQ2hD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LG1CQUFtQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIE5nWm9uZSwgT3B0aW9uYWwsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFTVBUWSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IG1hcCwgc2hhcmVSZXBsYXksIHN3aXRjaE1hcCwgb2JzZXJ2ZU9uIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgybVBbmd1bGFyRmlyZVNjaGVkdWxlcnMsXG4gIMm1bGF6eVNES1Byb3h5LFxuICDJtVByb21pc2VQcm94eSxcbiAgybVhcHBseU1peGlucyxcbiAgRmlyZWJhc2VBcHBcbn0gZnJvbSAnQGFuZ3VsYXIvZmlyZSc7XG5pbXBvcnQgZmlyZWJhc2UgZnJvbSAnZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IHByb3h5UG9seWZpbGxDb21wYXQgfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgybVmZXRjaEluc3RhbmNlIH0gZnJvbSAnQGFuZ3VsYXIvZmlyZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5leHBvcnQgY29uc3QgQ09MTEVDVElPTl9FTkFCTEVEID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KCdhbmd1bGFyZmlyZTIuYW5hbHl0aWNzLmFuYWx5dGljc0NvbGxlY3Rpb25FbmFibGVkJyk7XG5leHBvcnQgY29uc3QgQVBQX1ZFUlNJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignYW5ndWxhcmZpcmUyLmFuYWx5dGljcy5hcHBWZXJzaW9uJyk7XG5leHBvcnQgY29uc3QgQVBQX05BTUUgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignYW5ndWxhcmZpcmUyLmFuYWx5dGljcy5hcHBOYW1lJyk7XG5leHBvcnQgY29uc3QgREVCVUdfTU9ERSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignYW5ndWxhcmZpcmUyLmFuYWx5dGljcy5kZWJ1Z01vZGUnKTtcbmV4cG9ydCBjb25zdCBDT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW48Q29uZmlnPignYW5ndWxhcmZpcmUyLmFuYWx5dGljcy5jb25maWcnKTtcblxuY29uc3QgQVBQX05BTUVfS0VZID0gJ2FwcF9uYW1lJztcbmNvbnN0IEFQUF9WRVJTSU9OX0tFWSA9ICdhcHBfdmVyc2lvbic7XG5jb25zdCBERUJVR19NT0RFX0tFWSA9ICdkZWJ1Z19tb2RlJztcbmNvbnN0IEdUQUdfQ09ORklHX0NPTU1BTkQgPSAnY29uZmlnJztcbmNvbnN0IEdUQUdfRlVOQ1RJT05fTkFNRSA9ICdndGFnJzsgLy8gVE9ETyByZW5hbWUgdGhlc2VcbmNvbnN0IERBVEFfTEFZRVJfTkFNRSA9ICdkYXRhTGF5ZXInO1xuY29uc3QgU0VORF9UT19LRVkgPSAnc2VuZF90byc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5ndWxhckZpcmVBbmFseXRpY3MgZXh0ZW5kcyDJtVByb21pc2VQcm94eTxmaXJlYmFzZS5hbmFseXRpY3MuQW5hbHl0aWNzPiB7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ2FueSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckZpcmVBbmFseXRpY3Mge1xuXG4gIHByaXZhdGUgbWVhc3VyZW1lbnRJZDogc3RyaW5nO1xuICBwcml2YXRlIGFuYWx5dGljc0luaXRpYWxpemVkOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuXG4gIGFzeW5jIHVwZGF0ZUNvbmZpZyhjb25maWc6IENvbmZpZykge1xuICAgIGF3YWl0IHRoaXMuYW5hbHl0aWNzSW5pdGlhbGl6ZWQ7XG4gICAgd2luZG93W0dUQUdfRlVOQ1RJT05fTkFNRV0oR1RBR19DT05GSUdfQ09NTUFORCwgdGhpcy5tZWFzdXJlbWVudElkLCB7IC4uLmNvbmZpZywgdXBkYXRlOiB0cnVlIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgYXBwOiBGaXJlYmFzZUFwcCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KENPTExFQ1RJT05fRU5BQkxFRCkgYW5hbHl0aWNzQ29sbGVjdGlvbkVuYWJsZWQ6IGJvb2xlYW4gfCBudWxsLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQVBQX1ZFUlNJT04pIHByb3ZpZGVkQXBwVmVyc2lvbjogc3RyaW5nIHwgbnVsbCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFQUF9OQU1FKSBwcm92aWRlZEFwcE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChERUJVR19NT0RFKSBkZWJ1Z01vZGVFbmFibGVkOiBib29sZWFuIHwgbnVsbCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KENPTkZJRykgcHJvdmlkZWRDb25maWc6IENvbmZpZyB8IG51bGwsXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhbi10eXBlc1xuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICB6b25lOiBOZ1pvbmVcbiAgKSB7XG5cbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkpIHtcblxuICAgICAgd2luZG93W0RBVEFfTEFZRVJfTkFNRV0gPSB3aW5kb3dbREFUQV9MQVlFUl9OQU1FXSB8fCBbXTtcblxuICAgICAgLy8gSXQgdHVybnMgb3V0IHdlIGNhbid0IHJlbHkgb24gdGhlIG1lYXN1cmVtZW50SWQgaW4gdGhlIEZpcmViYXNlIGNvbmZpZyBKU09OXG4gICAgICAvLyB0aGlzIGlkZW50aWZpZXIgaXMgbm90IHN0YWJsZS4gZmlyZWJhc2UvYW5hbHl0aWNzIGRvZXMgYSBjYWxsIHRvIGdldCBhIGZyZXNoIHZhbHVlXG4gICAgICAvLyBmYWxsaW5nIGJhY2sgb24gdGhlIG9uZSBpbiB0aGUgY29uZmlnLiBSYXRoZXIgdGhhbiBkbyB0aGF0IG91cnNlbHZlcyB3ZSBzaG91bGQgbGlzdGVuXG4gICAgICAvLyBvbiBvdXIgZ3RhZyBmdW5jdGlvbiBmb3IgYSBhbmFseXRpY3MgY29uZmlnIGNvbW1hbmRcbiAgICAgIC8vIGUuZywgWydjb25maWcnLCBtZWFzdXJlbWVudElkLCB7IG9yaWdpbjogJ2ZpcmViYXNlJywgZmlyZWJhc2VfaWQgfV1cbiAgICAgIGNvbnN0IHBhcnNlTWVhc3VyZW1lbnRJZCA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICBpZiAoYXJnc1swXSA9PT0gJ2NvbmZpZycgJiYgYXJnc1syXS5vcmlnaW4gPT09ICdmaXJlYmFzZScpIHtcbiAgICAgICAgICB0aGlzLm1lYXN1cmVtZW50SWQgPSBhcmdzWzFdO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgcGF0Y2hHdGFnID0gKGZuPzogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgIHdpbmRvd1tHVEFHX0ZVTkNUSU9OX05BTUVdID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICBmbiguLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSW5qZWN0IGFwcF9uYW1lIGFuZCBhcHBfdmVyc2lvbiBpbnRvIGV2ZW50c1xuICAgICAgICAgIC8vIFRPRE8oamFtZXNkYW5pZWxzKTogSSdtIGRvaW5nIHRoaXMgYXMgZG9jdW1lbnRlZCBidXQgaXQncyBzdGlsbCBub3RcbiAgICAgICAgICAvLyAgIHNob3dpbmcgdXAgaW4gdGhlIGNvbnNvbGUuIEludmVzdGlnYXRlLiBHdWVzc2luZyBpdCdzIGp1c3QgcGFydCBvZiB0aGVcbiAgICAgICAgICAvLyAgIHdob2xlIEdBNCB0cmFuc2l0aW9uIG1lc3MuXG4gICAgICAgICAgaWYgKGFyZ3NbMF0gPT09ICdldmVudCcgJiYgYXJnc1syXVtTRU5EX1RPX0tFWV0gPT09IHRoaXMubWVhc3VyZW1lbnRJZCkge1xuICAgICAgICAgICAgaWYgKHByb3ZpZGVkQXBwTmFtZSkge1xuICAgICAgICAgICAgICBhcmdzWzJdW0FQUF9OQU1FX0tFWV0gPSBwcm92aWRlZEFwcE5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvdmlkZWRBcHBWZXJzaW9uKSB7XG4gICAgICAgICAgICAgIGFyZ3NbMl1bQVBQX1ZFUlNJT05fS0VZXSA9IHByb3ZpZGVkQXBwVmVyc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRlYnVnTW9kZUVuYWJsZWQgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5pbmZvKC4uLmFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBBY2NvcmRpbmcgdG8gdGhlIGd0YWcgZG9jdW1lbnRhdGlvbiwgdGhpcyBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBjdXN0b20gZGF0YSBsYXllciBjYW5ub3QgYmVcbiAgICAgICAgICAgKiBhbiBhcnJvdyBmdW5jdGlvbiBiZWNhdXNlICdhcmd1bWVudHMnIGlzIG5vdCBhbiBhcnJheS4gSXQgaXMgYWN0dWFsbHkgYW4gb2JqZWN0IHRoYXQgYmVoYXZlc1xuICAgICAgICAgICAqIGxpa2UgYW4gYXJyYXkgYW5kIGNvbnRhaW5zIG1vcmUgaW5mb3JtYXRpb24gdGhlbiBqdXN0IGluZGV4ZXMuIFRyYW5zZm9ybWluZyB0aGlzIGludG8gYXJyb3cgZnVuY3Rpb25cbiAgICAgICAgICAgKiBjYXVzZWQgaXNzdWUgIzI1MDUgd2hlcmUgYW5hbHl0aWNzIG5vIGxvbmdlciBzZW50IGFueSBkYXRhLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb25seS1hcnJvdy1mdW5jdGlvbnNcbiAgICAgICAgICAoZnVuY3Rpb24oLi4uX2FyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICB3aW5kb3dbREFUQV9MQVlFUl9OQU1FXS5wdXNoKGFyZ3VtZW50cyk7XG4gICAgICAgICAgfSkoLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICAvLyBVbmNsZWFyIGlmIHdlIHN0aWxsIG5lZWQgdG8gYnV0IEkgd2FzIHJ1bm5pbmcgaW50byBjb25maWcvZXZlbnRzIEkgcGFzc2VkXG4gICAgICAvLyB0byBndGFnIGJlZm9yZSBbJ2pzJyB0aW1lc3RhbXBdIHdlcmVuJ3QgZ2V0dGluZyBwYXJzZWQsIHNvIGxldCdzIG1ha2UgYSBwcm9taXNlXG4gICAgICAvLyB0aGF0IHJlc29sdmVzIHdoZW4gZmlyZWJhc2UvYW5hbHl0aWNzIGhhcyBjb25maWd1cmVkIGd0YWcuanMgdGhhdCB3ZSB3YWl0IG9uXG4gICAgICAvLyBiZWZvcmUgc2VuZGluZyBhbnl0aGluZ1xuICAgICAgY29uc3QgZmlyZWJhc2VBbmFseXRpY3NBbHJlYWR5SW5pdGlhbGl6ZWQgPSB3aW5kb3dbREFUQV9MQVlFUl9OQU1FXS5zb21lKHBhcnNlTWVhc3VyZW1lbnRJZCk7XG4gICAgICBpZiAoZmlyZWJhc2VBbmFseXRpY3NBbHJlYWR5SW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgdGhpcy5hbmFseXRpY3NJbml0aWFsaXplZCA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwYXRjaEd0YWcoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYW5hbHl0aWNzSW5pdGlhbGl6ZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICBwYXRjaEd0YWcoKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJzZU1lYXN1cmVtZW50SWQoLi4uYXJncykpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3ZpZGVkQ29uZmlnKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ29uZmlnKHByb3ZpZGVkQ29uZmlnKTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWJ1Z01vZGVFbmFibGVkKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ29uZmlnKHsgW0RFQlVHX01PREVfS0VZXTogMSB9KTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMuYW5hbHl0aWNzSW5pdGlhbGl6ZWQgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIH1cblxuICAgIGNvbnN0IGFuYWx5dGljcyA9IG9mKHVuZGVmaW5lZCkucGlwZShcbiAgICAgIG9ic2VydmVPbihuZXcgybVBbmd1bGFyRmlyZVNjaGVkdWxlcnMoem9uZSkub3V0c2lkZUFuZ3VsYXIpLFxuICAgICAgc3dpdGNoTWFwKCgpID0+IGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpID8gem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiBpbXBvcnQoJ2ZpcmViYXNlL2FuYWx5dGljcycpKSA6IEVNUFRZKSxcbiAgICAgIC8vIFNFTVZFUiBjYW4gc3dpdGNoIHRvIGlzU3VwcG9ydGVkKCkgd2hlbiB3ZSBvbmx5IHRhcmdldCB2OFxuICAgICAgLy8gc3dpdGNoTWFwKCgpID0+IGZpcmViYXNlLmFuYWx5dGljcy5pc1N1cHBvcnRlZCgpLnRoZW4oaXQgPT4gaXQsICgpID0+IGZhbHNlKSksXG4gICAgICAvLyBUT0RPIHNlcnZlci1zaWRlIGludmVzdGlnYXRlIHVzZSBvZiB0aGUgVW5pdmVyc2FsIEFuYWx5dGljcyBBUElcbiAgICAgIC8vIHN3aXRjaE1hcChzdXBwb3J0ZWQgPT4gc3VwcG9ydGVkID8gb2YodW5kZWZpbmVkKSA6IEVNUFRZKSxcbiAgICAgIG1hcCgoKSA9PiB7XG4gICAgICAgIHJldHVybiDJtWZldGNoSW5zdGFuY2UoYGFuYWx5dGljc2AsICdBbmd1bGFyRmlyZUFuYWx5dGljcycsIGFwcCwgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFuYWx5dGljcyA9IGFwcC5hbmFseXRpY3MoKTtcbiAgICAgICAgICBpZiAoYW5hbHl0aWNzQ29sbGVjdGlvbkVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBhbmFseXRpY3Muc2V0QW5hbHl0aWNzQ29sbGVjdGlvbkVuYWJsZWQoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYW5hbHl0aWNzO1xuICAgICAgICB9LCBbYXBwLCBhbmFseXRpY3NDb2xsZWN0aW9uRW5hYmxlZCwgcHJvdmlkZWRDb25maWcsIGRlYnVnTW9kZUVuYWJsZWRdKTtcbiAgICAgIH0pLFxuICAgICAgc2hhcmVSZXBsYXkoeyBidWZmZXJTaXplOiAxLCByZWZDb3VudDogZmFsc2UgfSlcbiAgICApO1xuXG4gICAgcmV0dXJuIMm1bGF6eVNES1Byb3h5KHRoaXMsIGFuYWx5dGljcywgem9uZSk7XG5cbiAgfVxuXG59XG5cbsm1YXBwbHlNaXhpbnMoQW5ndWxhckZpcmVBbmFseXRpY3MsIFtwcm94eVBvbHlmaWxsQ29tcGF0XSk7XG4iXX0=