import { __awaiter } from 'tslib';
import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, PLATFORM_ID, NgZone, ComponentFactoryResolver, NgModule } from '@angular/core';
import { of, EMPTY } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { observeOn, switchMap, map, shareReplay, filter, groupBy, mergeMap, distinctUntilChanged, startWith, pairwise } from 'rxjs/operators';
import * as i1 from '@angular/fire';
import { ɵAngularFireSchedulers, ɵfetchInstance, ɵlazySDKProxy, FirebaseApp, ɵapplyMixins } from '@angular/fire';
import { ActivationEnd, ɵEmptyOutletComponent, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/auth';

const proxyPolyfillCompat = {
    app: null,
    logEvent: null,
    setCurrentScreen: null,
    setUserId: null,
    setUserProperties: null,
    setAnalyticsCollectionEnabled: null,
};

const COLLECTION_ENABLED = new InjectionToken('angularfire2.analytics.analyticsCollectionEnabled');
const APP_VERSION = new InjectionToken('angularfire2.analytics.appVersion');
const APP_NAME = new InjectionToken('angularfire2.analytics.appName');
const DEBUG_MODE = new InjectionToken('angularfire2.analytics.debugMode');
const CONFIG = new InjectionToken('angularfire2.analytics.config');
const APP_NAME_KEY = 'app_name';
const APP_VERSION_KEY = 'app_version';
const DEBUG_MODE_KEY = 'debug_mode';
const GTAG_CONFIG_COMMAND = 'config';
const GTAG_FUNCTION_NAME = 'gtag'; // TODO rename these
const DATA_LAYER_NAME = 'dataLayer';
const SEND_TO_KEY = 'send_to';
class AngularFireAnalytics {
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

class UserTrackingService {
    // TODO a user properties injector
    constructor(analytics, 
    // tslint:disable-next-line:ban-types
    platformId, auth, zone) {
        this.disposables = [];
        if (!isPlatformServer(platformId)) {
            let resolveInitialized;
            this.initialized = zone.runOutsideAngular(() => new Promise(resolve => resolveInitialized = resolve));
            this.disposables = [
                auth.authState.subscribe(user => {
                    analytics.setUserId(user === null || user === void 0 ? void 0 : user.uid);
                    resolveInitialized();
                }),
                auth.credential.subscribe(credential => {
                    if (credential) {
                        const method = credential.user.isAnonymous ? 'anonymous' : credential.additionalUserInfo.providerId;
                        if (credential.additionalUserInfo.isNewUser) {
                            analytics.logEvent('sign_up', { method });
                        }
                        analytics.logEvent('login', { method });
                    }
                })
            ];
        }
        else {
            this.initialized = Promise.resolve();
        }
    }
    ngOnDestroy() {
        this.disposables.forEach(it => it.unsubscribe());
    }
}
UserTrackingService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
UserTrackingService.ctorParameters = () => [
    { type: AngularFireAnalytics },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: AngularFireAuth },
    { type: NgZone }
];

const FIREBASE_EVENT_ORIGIN_KEY = 'firebase_event_origin';
const FIREBASE_PREVIOUS_SCREEN_CLASS_KEY = 'firebase_previous_class';
const FIREBASE_PREVIOUS_SCREEN_INSTANCE_ID_KEY = 'firebase_previous_id';
const FIREBASE_PREVIOUS_SCREEN_NAME_KEY = 'firebase_previous_screen';
const FIREBASE_SCREEN_CLASS_KEY = 'firebase_screen_class';
const FIREBASE_SCREEN_INSTANCE_ID_KEY = 'firebase_screen_id';
const FIREBASE_SCREEN_NAME_KEY = 'firebase_screen';
const OUTLET_KEY = 'outlet';
const PAGE_PATH_KEY = 'page_path';
const PAGE_TITLE_KEY = 'page_title';
const SCREEN_CLASS_KEY = 'screen_class';
const SCREEN_NAME_KEY = 'screen_name';
const SCREEN_VIEW_EVENT = 'screen_view';
const EVENT_ORIGIN_AUTO = 'auto';
const SCREEN_INSTANCE_DELIMITER = '#';
// this is an INT64 in iOS/Android but use INT32 cause javascript
let nextScreenInstanceID = Math.floor(Math.random() * (Math.pow(2, 32) - 1)) - Math.pow(2, 31);
const knownScreenInstanceIDs = {};
const getScreenInstanceID = (params) => {
    // unique the screen class against the outlet name
    const screenInstanceKey = [
        params[SCREEN_CLASS_KEY],
        params[OUTLET_KEY]
    ].join(SCREEN_INSTANCE_DELIMITER);
    if (knownScreenInstanceIDs.hasOwnProperty(screenInstanceKey)) {
        return knownScreenInstanceIDs[screenInstanceKey];
    }
    else {
        const ret = nextScreenInstanceID++;
        knownScreenInstanceIDs[screenInstanceKey] = ret;
        return ret;
    }
};
const ɵ0 = getScreenInstanceID;
class ScreenTrackingService {
    constructor(analytics, router, title, componentFactoryResolver, 
    // tslint:disable-next-line:ban-types
    platformId, zone, userTrackingService) {
        if (!router || !isPlatformBrowser(platformId)) {
            return this;
        }
        zone.runOutsideAngular(() => {
            const activationEndEvents = router.events.pipe(filter(e => e instanceof ActivationEnd));
            this.disposable = activationEndEvents.pipe(switchMap(activationEnd => {
                var _a;
                // router parseUrl is having trouble with outlets when they're empty
                // e.g, /asdf/1(bob://sally:asdf), so put another slash in when empty
                const urlTree = router.parseUrl(router.url.replace(/(?:\().+(?:\))/g, a => a.replace('://', ':///')));
                const pagePath = ((_a = urlTree.root.children[activationEnd.snapshot.outlet]) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                const actualSnapshot = router.routerState.root.children.map(it => it).find(it => it.outlet === activationEnd.snapshot.outlet);
                if (!actualSnapshot) {
                    return of(null);
                }
                let actualDeep = actualSnapshot;
                while (actualDeep.firstChild) {
                    actualDeep = actualDeep.firstChild;
                }
                const screenName = actualDeep.pathFromRoot.map(s => { var _a; return (_a = s.routeConfig) === null || _a === void 0 ? void 0 : _a.path; }).filter(it => it).join('/') || '/';
                const params = {
                    [SCREEN_NAME_KEY]: screenName,
                    [PAGE_PATH_KEY]: `/${pagePath}`,
                    [FIREBASE_EVENT_ORIGIN_KEY]: EVENT_ORIGIN_AUTO,
                    [FIREBASE_SCREEN_NAME_KEY]: screenName,
                    [OUTLET_KEY]: activationEnd.snapshot.outlet
                };
                if (title) {
                    params[PAGE_TITLE_KEY] = title.getTitle();
                }
                let component = actualSnapshot.component;
                if (component) {
                    if (component === ɵEmptyOutletComponent) {
                        let deepSnapshot = activationEnd.snapshot;
                        // TODO when might there be mutple children, different outlets? explore
                        while (deepSnapshot.firstChild) {
                            deepSnapshot = deepSnapshot.firstChild;
                        }
                        component = deepSnapshot.component;
                    }
                }
                else {
                    component = activationEnd.snapshot.component;
                }
                if (typeof component === 'string') {
                    return of(Object.assign(Object.assign({}, params), { [SCREEN_CLASS_KEY]: component }));
                }
                else if (component) {
                    const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
                    return of(Object.assign(Object.assign({}, params), { [SCREEN_CLASS_KEY]: componentFactory.selector }));
                }
                else {
                    // lazy loads cause extra activations, ignore
                    return of(null);
                }
            }), filter(it => it), map(params => (Object.assign({ [FIREBASE_SCREEN_CLASS_KEY]: params[SCREEN_CLASS_KEY], [FIREBASE_SCREEN_INSTANCE_ID_KEY]: getScreenInstanceID(params) }, params))), groupBy(it => it[OUTLET_KEY]), mergeMap(it => it.pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)), startWith(undefined), pairwise(), map(([prior, current]) => prior ? Object.assign({ [FIREBASE_PREVIOUS_SCREEN_CLASS_KEY]: prior[SCREEN_CLASS_KEY], [FIREBASE_PREVIOUS_SCREEN_NAME_KEY]: prior[SCREEN_NAME_KEY], [FIREBASE_PREVIOUS_SCREEN_INSTANCE_ID_KEY]: prior[FIREBASE_SCREEN_INSTANCE_ID_KEY] }, current) : current), switchMap((params) => __awaiter(this, void 0, void 0, function* () {
                if (userTrackingService) {
                    yield userTrackingService.initialized;
                }
                return yield analytics.logEvent(SCREEN_VIEW_EVENT, params);
            }))))).subscribe();
        });
    }
    ngOnDestroy() {
        if (this.disposable) {
            this.disposable.unsubscribe();
        }
    }
}
ScreenTrackingService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ScreenTrackingService.ctorParameters = () => [
    { type: AngularFireAnalytics },
    { type: Router, decorators: [{ type: Optional }] },
    { type: Title, decorators: [{ type: Optional }] },
    { type: ComponentFactoryResolver },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: UserTrackingService, decorators: [{ type: Optional }] }
];

class AngularFireAnalyticsModule {
    constructor(analytics, screenTracking, userTracking) {
        // calling anything on analytics will eagerly load the SDK
        // tslint:disable-next-line:no-unused-expression
        analytics.app.then(() => { });
    }
}
AngularFireAnalyticsModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireAnalytics]
            },] }
];
/** @nocollapse */
AngularFireAnalyticsModule.ctorParameters = () => [
    { type: AngularFireAnalytics },
    { type: ScreenTrackingService, decorators: [{ type: Optional }] },
    { type: UserTrackingService, decorators: [{ type: Optional }] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { APP_NAME, APP_VERSION, AngularFireAnalytics, AngularFireAnalyticsModule, COLLECTION_ENABLED, CONFIG, DEBUG_MODE, ScreenTrackingService, UserTrackingService, ɵ0 };
//# sourceMappingURL=angular-fire-analytics.js.map
