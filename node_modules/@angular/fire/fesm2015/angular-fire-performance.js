import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, NgZone, PLATFORM_ID, ApplicationRef, NgModule } from '@angular/core';
import { of, EMPTY, Observable } from 'rxjs';
import { switchMap, map, shareReplay, tap, first } from 'rxjs/operators';
import * as i1 from '@angular/fire';
import { ɵfetchInstance, ɵlazySDKProxy, FirebaseApp, ɵapplyMixins } from '@angular/fire';
import { isPlatformBrowser } from '@angular/common';

const proxyPolyfillCompat = {
    trace: null,
    instrumentationEnabled: null,
    dataCollectionEnabled: null,
};

// SEMVER @ v6, drop and move core ng metrics to a service
const AUTOMATICALLY_TRACE_CORE_NG_METRICS = new InjectionToken('angularfire2.performance.auto_trace');
const INSTRUMENTATION_ENABLED = new InjectionToken('angularfire2.performance.instrumentationEnabled');
const DATA_COLLECTION_ENABLED = new InjectionToken('angularfire2.performance.dataCollectionEnabled');
class AngularFirePerformance {
    constructor(app, instrumentationEnabled, dataCollectionEnabled, zone, 
    // tslint:disable-next-line:ban-types
    platformId) {
        this.zone = zone;
        this.performance = of(undefined).pipe(switchMap(() => isPlatformBrowser(platformId) ? zone.runOutsideAngular(() => import('firebase/performance')) : EMPTY), map(() => ɵfetchInstance(`performance`, 'AngularFirePerformance', app, () => {
            const performance = zone.runOutsideAngular(() => app.performance());
            if (instrumentationEnabled === false) {
                performance.instrumentationEnabled = false;
            }
            if (dataCollectionEnabled === false) {
                performance.dataCollectionEnabled = false;
            }
            return performance;
        }, [instrumentationEnabled, dataCollectionEnabled])), shareReplay({ bufferSize: 1, refCount: false }));
        return ɵlazySDKProxy(this, this.performance, zone);
    }
}
/** @nocollapse */ AngularFirePerformance.ɵprov = i0.ɵɵdefineInjectable({ factory: function AngularFirePerformance_Factory() { return new AngularFirePerformance(i0.ɵɵinject(i1.FirebaseApp), i0.ɵɵinject(INSTRUMENTATION_ENABLED, 8), i0.ɵɵinject(DATA_COLLECTION_ENABLED, 8), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(i0.PLATFORM_ID)); }, token: AngularFirePerformance, providedIn: "any" });
AngularFirePerformance.decorators = [
    { type: Injectable, args: [{
                providedIn: 'any'
            },] }
];
/** @nocollapse */
AngularFirePerformance.ctorParameters = () => [
    { type: FirebaseApp },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [INSTRUMENTATION_ENABLED,] }] },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [DATA_COLLECTION_ENABLED,] }] },
    { type: NgZone },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
const trace$ = (traceId) => {
    if (typeof window !== 'undefined' && window.performance) {
        const entries = window.performance.getEntriesByName(traceId, 'measure') || [];
        const startMarkName = `_${traceId}Start[${entries.length}]`;
        const endMarkName = `_${traceId}End[${entries.length}]`;
        return new Observable(emitter => {
            window.performance.mark(startMarkName);
            emitter.next();
            return {
                unsubscribe: () => {
                    window.performance.mark(endMarkName);
                    window.performance.measure(traceId, startMarkName, endMarkName);
                }
            };
        });
    }
    else {
        return EMPTY;
    }
};
const ɵ0 = trace$;
const traceUntil = (name, test, options) => (source$) => new Observable(subscriber => {
    const traceSubscription = trace$(name).subscribe();
    return source$.pipe(tap(a => test(a) && traceSubscription.unsubscribe(), () => {
    }, () => options && options.orComplete && traceSubscription.unsubscribe())).subscribe(subscriber);
});
const traceWhile = (name, test, options) => (source$) => new Observable(subscriber => {
    let traceSubscription;
    return source$.pipe(tap(a => {
        if (test(a)) {
            traceSubscription = traceSubscription || trace$(name).subscribe();
        }
        else {
            if (traceSubscription) {
                traceSubscription.unsubscribe();
            }
            traceSubscription = undefined;
        }
    }, () => {
    }, () => options && options.orComplete && traceSubscription && traceSubscription.unsubscribe())).subscribe(subscriber);
});
const traceUntilComplete = (name) => (source$) => new Observable(subscriber => {
    const traceSubscription = trace$(name).subscribe();
    return source$.pipe(tap(() => {
    }, () => {
    }, () => traceSubscription.unsubscribe())).subscribe(subscriber);
});
const traceUntilFirst = (name) => (source$) => new Observable(subscriber => {
    const traceSubscription = trace$(name).subscribe();
    return source$.pipe(tap(() => traceSubscription.unsubscribe(), () => {
    }, () => {
    })).subscribe(subscriber);
});
const trace = (name) => (source$) => new Observable(subscriber => {
    const traceSubscription = trace$(name).subscribe();
    return source$.pipe(tap(() => traceSubscription.unsubscribe(), () => {
    }, () => traceSubscription.unsubscribe())).subscribe(subscriber);
});
ɵapplyMixins(AngularFirePerformance, [proxyPolyfillCompat]);

const IS_STABLE_START_MARK = '_isStableStart';
const IS_STABLE_END_MARK = '_isStableEnd';
function markStarts() {
    if (typeof (window) !== 'undefined' && window.performance) {
        window.performance.mark(IS_STABLE_START_MARK);
        return true;
    }
    else {
        return false;
    }
}
const started = markStarts();
class PerformanceMonitoringService {
    constructor(appRef) {
        if (started) {
            this.disposable = appRef.isStable.pipe(first(it => it), tap(() => {
                window.performance.mark(IS_STABLE_END_MARK);
                window.performance.measure('isStable', IS_STABLE_START_MARK, IS_STABLE_END_MARK);
            })).subscribe();
        }
    }
    ngOnDestroy() {
        if (this.disposable) {
            this.disposable.unsubscribe();
        }
    }
}
PerformanceMonitoringService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PerformanceMonitoringService.ctorParameters = () => [
    { type: ApplicationRef }
];

class AngularFirePerformanceModule {
    constructor(perf, _) {
        // call anything here to get perf loading
        // tslint:disable-next-line:no-unused-expression
        perf.dataCollectionEnabled.then(() => { });
    }
}
AngularFirePerformanceModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFirePerformance]
            },] }
];
/** @nocollapse */
AngularFirePerformanceModule.ctorParameters = () => [
    { type: AngularFirePerformance },
    { type: PerformanceMonitoringService, decorators: [{ type: Optional }] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AUTOMATICALLY_TRACE_CORE_NG_METRICS, AngularFirePerformance, AngularFirePerformanceModule, DATA_COLLECTION_ENABLED, INSTRUMENTATION_ENABLED, PerformanceMonitoringService, trace, traceUntil, traceUntilComplete, traceUntilFirst, traceWhile, ɵ0 };
//# sourceMappingURL=angular-fire-performance.js.map
