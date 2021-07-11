(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/fire'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@angular/fire/performance', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/fire', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.angular = global.angular || {}, global.angular.fire = global.angular.fire || {}, global.angular.fire.performance = {}), global.ng.core, global.rxjs, global.rxjs.operators, global.angular.fire, global.ng.common));
}(this, (function (exports, i0, rxjs, operators, i1, common) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var i1__namespace = /*#__PURE__*/_interopNamespace(i1);

    var proxyPolyfillCompat = {
        trace: null,
        instrumentationEnabled: null,
        dataCollectionEnabled: null,
    };

    // SEMVER @ v6, drop and move core ng metrics to a service
    var AUTOMATICALLY_TRACE_CORE_NG_METRICS = new i0.InjectionToken('angularfire2.performance.auto_trace');
    var INSTRUMENTATION_ENABLED = new i0.InjectionToken('angularfire2.performance.instrumentationEnabled');
    var DATA_COLLECTION_ENABLED = new i0.InjectionToken('angularfire2.performance.dataCollectionEnabled');
    var AngularFirePerformance = /** @class */ (function () {
        function AngularFirePerformance(app, instrumentationEnabled, dataCollectionEnabled, zone, 
        // tslint:disable-next-line:ban-types
        platformId) {
            this.zone = zone;
            this.performance = rxjs.of(undefined).pipe(operators.switchMap(function () { return common.isPlatformBrowser(platformId) ? zone.runOutsideAngular(function () { return import('firebase/performance'); }) : rxjs.EMPTY; }), operators.map(function () { return i1.ɵfetchInstance("performance", 'AngularFirePerformance', app, function () {
                var performance = zone.runOutsideAngular(function () { return app.performance(); });
                if (instrumentationEnabled === false) {
                    performance.instrumentationEnabled = false;
                }
                if (dataCollectionEnabled === false) {
                    performance.dataCollectionEnabled = false;
                }
                return performance;
            }, [instrumentationEnabled, dataCollectionEnabled]); }), operators.shareReplay({ bufferSize: 1, refCount: false }));
            return i1.ɵlazySDKProxy(this, this.performance, zone);
        }
        return AngularFirePerformance;
    }());
    /** @nocollapse */ AngularFirePerformance.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AngularFirePerformance_Factory() { return new AngularFirePerformance(i0__namespace.ɵɵinject(i1__namespace.FirebaseApp), i0__namespace.ɵɵinject(INSTRUMENTATION_ENABLED, 8), i0__namespace.ɵɵinject(DATA_COLLECTION_ENABLED, 8), i0__namespace.ɵɵinject(i0__namespace.NgZone), i0__namespace.ɵɵinject(i0__namespace.PLATFORM_ID)); }, token: AngularFirePerformance, providedIn: "any" });
    AngularFirePerformance.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'any'
                },] }
    ];
    /** @nocollapse */
    AngularFirePerformance.ctorParameters = function () { return [
        { type: i1.FirebaseApp },
        { type: Boolean, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [INSTRUMENTATION_ENABLED,] }] },
        { type: Boolean, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [DATA_COLLECTION_ENABLED,] }] },
        { type: i0.NgZone },
        { type: Object, decorators: [{ type: i0.Inject, args: [i0.PLATFORM_ID,] }] }
    ]; };
    var trace$ = function (traceId) {
        if (typeof window !== 'undefined' && window.performance) {
            var entries = window.performance.getEntriesByName(traceId, 'measure') || [];
            var startMarkName_1 = "_" + traceId + "Start[" + entries.length + "]";
            var endMarkName_1 = "_" + traceId + "End[" + entries.length + "]";
            return new rxjs.Observable(function (emitter) {
                window.performance.mark(startMarkName_1);
                emitter.next();
                return {
                    unsubscribe: function () {
                        window.performance.mark(endMarkName_1);
                        window.performance.measure(traceId, startMarkName_1, endMarkName_1);
                    }
                };
            });
        }
        else {
            return rxjs.EMPTY;
        }
    };
    var ɵ0 = trace$;
    var traceUntil = function (name, test, options) { return function (source$) { return new rxjs.Observable(function (subscriber) {
        var traceSubscription = trace$(name).subscribe();
        return source$.pipe(operators.tap(function (a) { return test(a) && traceSubscription.unsubscribe(); }, function () {
        }, function () { return options && options.orComplete && traceSubscription.unsubscribe(); })).subscribe(subscriber);
    }); }; };
    var traceWhile = function (name, test, options) { return function (source$) { return new rxjs.Observable(function (subscriber) {
        var traceSubscription;
        return source$.pipe(operators.tap(function (a) {
            if (test(a)) {
                traceSubscription = traceSubscription || trace$(name).subscribe();
            }
            else {
                if (traceSubscription) {
                    traceSubscription.unsubscribe();
                }
                traceSubscription = undefined;
            }
        }, function () {
        }, function () { return options && options.orComplete && traceSubscription && traceSubscription.unsubscribe(); })).subscribe(subscriber);
    }); }; };
    var traceUntilComplete = function (name) { return function (source$) { return new rxjs.Observable(function (subscriber) {
        var traceSubscription = trace$(name).subscribe();
        return source$.pipe(operators.tap(function () {
        }, function () {
        }, function () { return traceSubscription.unsubscribe(); })).subscribe(subscriber);
    }); }; };
    var traceUntilFirst = function (name) { return function (source$) { return new rxjs.Observable(function (subscriber) {
        var traceSubscription = trace$(name).subscribe();
        return source$.pipe(operators.tap(function () { return traceSubscription.unsubscribe(); }, function () {
        }, function () {
        })).subscribe(subscriber);
    }); }; };
    var trace = function (name) { return function (source$) { return new rxjs.Observable(function (subscriber) {
        var traceSubscription = trace$(name).subscribe();
        return source$.pipe(operators.tap(function () { return traceSubscription.unsubscribe(); }, function () {
        }, function () { return traceSubscription.unsubscribe(); })).subscribe(subscriber);
    }); }; };
    i1.ɵapplyMixins(AngularFirePerformance, [proxyPolyfillCompat]);

    var IS_STABLE_START_MARK = '_isStableStart';
    var IS_STABLE_END_MARK = '_isStableEnd';
    function markStarts() {
        if (typeof (window) !== 'undefined' && window.performance) {
            window.performance.mark(IS_STABLE_START_MARK);
            return true;
        }
        else {
            return false;
        }
    }
    var started = markStarts();
    var PerformanceMonitoringService = /** @class */ (function () {
        function PerformanceMonitoringService(appRef) {
            if (started) {
                this.disposable = appRef.isStable.pipe(operators.first(function (it) { return it; }), operators.tap(function () {
                    window.performance.mark(IS_STABLE_END_MARK);
                    window.performance.measure('isStable', IS_STABLE_START_MARK, IS_STABLE_END_MARK);
                })).subscribe();
            }
        }
        PerformanceMonitoringService.prototype.ngOnDestroy = function () {
            if (this.disposable) {
                this.disposable.unsubscribe();
            }
        };
        return PerformanceMonitoringService;
    }());
    PerformanceMonitoringService.decorators = [
        { type: i0.Injectable }
    ];
    /** @nocollapse */
    PerformanceMonitoringService.ctorParameters = function () { return [
        { type: i0.ApplicationRef }
    ]; };

    var AngularFirePerformanceModule = /** @class */ (function () {
        function AngularFirePerformanceModule(perf, _) {
            // call anything here to get perf loading
            // tslint:disable-next-line:no-unused-expression
            perf.dataCollectionEnabled.then(function () { });
        }
        return AngularFirePerformanceModule;
    }());
    AngularFirePerformanceModule.decorators = [
        { type: i0.NgModule, args: [{
                    providers: [AngularFirePerformance]
                },] }
    ];
    /** @nocollapse */
    AngularFirePerformanceModule.ctorParameters = function () { return [
        { type: AngularFirePerformance },
        { type: PerformanceMonitoringService, decorators: [{ type: i0.Optional }] }
    ]; };

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AUTOMATICALLY_TRACE_CORE_NG_METRICS = AUTOMATICALLY_TRACE_CORE_NG_METRICS;
    exports.AngularFirePerformance = AngularFirePerformance;
    exports.AngularFirePerformanceModule = AngularFirePerformanceModule;
    exports.DATA_COLLECTION_ENABLED = DATA_COLLECTION_ENABLED;
    exports.INSTRUMENTATION_ENABLED = INSTRUMENTATION_ENABLED;
    exports.PerformanceMonitoringService = PerformanceMonitoringService;
    exports.trace = trace;
    exports.traceUntil = traceUntil;
    exports.traceUntilComplete = traceUntilComplete;
    exports.traceUntilFirst = traceUntilFirst;
    exports.traceWhile = traceWhile;
    exports.ɵ0 = ɵ0;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-fire-performance.umd.js.map
