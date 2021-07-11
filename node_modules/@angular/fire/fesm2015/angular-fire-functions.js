
import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, Optional, NgZone, NgModule } from '@angular/core';
import { of, from } from 'rxjs';
import { observeOn, switchMap, map, shareReplay } from 'rxjs/operators';
import * as i1 from '@angular/fire';
import { ɵAngularFireSchedulers, ɵfirebaseAppFactory, ɵfetchInstance, ɵlazySDKProxy, FIREBASE_OPTIONS, FIREBASE_APP_NAME, ɵapplyMixins } from '@angular/fire';

const proxyPolyfillCompat = {
    useEmulator: null,
    useFunctionsEmulator: null,
    httpsCallable: null,
};

const ORIGIN = new InjectionToken('angularfire2.functions.origin');
const REGION = new InjectionToken('angularfire2.functions.region');
const NEW_ORIGIN_BEHAVIOR = new InjectionToken('angularfire2.functions.new-origin-behavior');
const USE_EMULATOR = new InjectionToken('angularfire2.functions.use-emulator');
class AngularFireFunctions {
    constructor(options, nameOrConfig, zone, region, origin, newOriginBehavior, _useEmulator) {
        const schedulers = new ɵAngularFireSchedulers(zone);
        const useEmulator = _useEmulator;
        const functions = of(undefined).pipe(observeOn(schedulers.outsideAngular), switchMap(() => import('firebase/functions')), map(() => ɵfirebaseAppFactory(options, zone, nameOrConfig)), map(app => ɵfetchInstance(`${app.name}.functions.${region || origin}`, 'AngularFireFunctions', app, () => {
            let functions;
            if (newOriginBehavior) {
                if (region && origin) {
                    throw new Error('REGION and ORIGIN can\'t be used at the same time.');
                }
                functions = app.functions(region || origin || undefined);
            }
            else {
                functions = app.functions(region || undefined);
            }
            if (!newOriginBehavior && !useEmulator && origin) {
                functions.useFunctionsEmulator(origin);
            }
            if (useEmulator) {
                functions.useEmulator(...useEmulator);
            }
            return functions;
        }, [region, origin, useEmulator])), shareReplay({ bufferSize: 1, refCount: false }));
        this.httpsCallable = (name, options) => (data) => from(functions).pipe(observeOn(schedulers.insideAngular), switchMap(functions => functions.httpsCallable(name, options)(data)), map(r => r.data));
        return ɵlazySDKProxy(this, functions, zone);
    }
}
/** @nocollapse */ AngularFireFunctions.ɵprov = i0.ɵɵdefineInjectable({ factory: function AngularFireFunctions_Factory() { return new AngularFireFunctions(i0.ɵɵinject(i1.FIREBASE_OPTIONS), i0.ɵɵinject(i1.FIREBASE_APP_NAME, 8), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(REGION, 8), i0.ɵɵinject(ORIGIN, 8), i0.ɵɵinject(NEW_ORIGIN_BEHAVIOR, 8), i0.ɵɵinject(USE_EMULATOR, 8)); }, token: AngularFireFunctions, providedIn: "any" });
AngularFireFunctions.decorators = [
    { type: Injectable, args: [{
                providedIn: 'any'
            },] }
];
/** @nocollapse */
AngularFireFunctions.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [FIREBASE_OPTIONS,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FIREBASE_APP_NAME,] }] },
    { type: NgZone },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [REGION,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ORIGIN,] }] },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [NEW_ORIGIN_BEHAVIOR,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [USE_EMULATOR,] }] }
];
ɵapplyMixins(AngularFireFunctions, [proxyPolyfillCompat]);

class AngularFireFunctionsModule {
}
AngularFireFunctionsModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireFunctions]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AngularFireFunctions, AngularFireFunctionsModule, NEW_ORIGIN_BEHAVIOR, ORIGIN, REGION, USE_EMULATOR };
//# sourceMappingURL=angular-fire-functions.js.map
