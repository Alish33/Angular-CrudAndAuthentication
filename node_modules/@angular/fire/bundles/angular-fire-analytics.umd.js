(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common'), require('rxjs/operators'), require('@angular/fire'), require('@angular/router'), require('@angular/platform-browser'), require('@angular/fire/auth')) :
    typeof define === 'function' && define.amd ? define('@angular/fire/analytics', ['exports', '@angular/core', 'rxjs', '@angular/common', 'rxjs/operators', '@angular/fire', '@angular/router', '@angular/platform-browser', '@angular/fire/auth'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.angular = global.angular || {}, global.angular.fire = global.angular.fire || {}, global.angular.fire.analytics = {}), global.ng.core, global.rxjs, global.ng.common, global.rxjs.operators, global.angular.fire, global.ng.router, global.ng.platformBrowser, global.angular.fire.auth));
}(this, (function (exports, i0, rxjs, common, operators, i1, router, platformBrowser, auth) { 'use strict';

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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var proxyPolyfillCompat = {
        app: null,
        logEvent: null,
        setCurrentScreen: null,
        setUserId: null,
        setUserProperties: null,
        setAnalyticsCollectionEnabled: null,
    };

    var COLLECTION_ENABLED = new i0.InjectionToken('angularfire2.analytics.analyticsCollectionEnabled');
    var APP_VERSION = new i0.InjectionToken('angularfire2.analytics.appVersion');
    var APP_NAME = new i0.InjectionToken('angularfire2.analytics.appName');
    var DEBUG_MODE = new i0.InjectionToken('angularfire2.analytics.debugMode');
    var CONFIG = new i0.InjectionToken('angularfire2.analytics.config');
    var APP_NAME_KEY = 'app_name';
    var APP_VERSION_KEY = 'app_version';
    var DEBUG_MODE_KEY = 'debug_mode';
    var GTAG_CONFIG_COMMAND = 'config';
    var GTAG_FUNCTION_NAME = 'gtag'; // TODO rename these
    var DATA_LAYER_NAME = 'dataLayer';
    var SEND_TO_KEY = 'send_to';
    var AngularFireAnalytics = /** @class */ (function () {
        function AngularFireAnalytics(app, analyticsCollectionEnabled, providedAppVersion, providedAppName, debugModeEnabled, providedConfig, 
        // tslint:disable-next-line:ban-types
        platformId, zone) {
            var _a;
            var _this = this;
            this.analyticsInitialized = new Promise(function () { });
            if (common.isPlatformBrowser(platformId)) {
                window[DATA_LAYER_NAME] = window[DATA_LAYER_NAME] || [];
                // It turns out we can't rely on the measurementId in the Firebase config JSON
                // this identifier is not stable. firebase/analytics does a call to get a fresh value
                // falling back on the one in the config. Rather than do that ourselves we should listen
                // on our gtag function for a analytics config command
                // e.g, ['config', measurementId, { origin: 'firebase', firebase_id }]
                var parseMeasurementId_1 = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (args[0] === 'config' && args[2].origin === 'firebase') {
                        _this.measurementId = args[1];
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                var patchGtag_1 = function (fn) {
                    window[GTAG_FUNCTION_NAME] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        if (fn) {
                            fn.apply(void 0, __spreadArray([], __read(args)));
                        }
                        // Inject app_name and app_version into events
                        // TODO(jamesdaniels): I'm doing this as documented but it's still not
                        //   showing up in the console. Investigate. Guessing it's just part of the
                        //   whole GA4 transition mess.
                        if (args[0] === 'event' && args[2][SEND_TO_KEY] === _this.measurementId) {
                            if (providedAppName) {
                                args[2][APP_NAME_KEY] = providedAppName;
                            }
                            if (providedAppVersion) {
                                args[2][APP_VERSION_KEY] = providedAppVersion;
                            }
                        }
                        if (debugModeEnabled && typeof console !== 'undefined') {
                            // tslint:disable-next-line:no-console
                            console.info.apply(console, __spreadArray([], __read(args)));
                        }
                        /**
                         * According to the gtag documentation, this function that defines a custom data layer cannot be
                         * an arrow function because 'arguments' is not an array. It is actually an object that behaves
                         * like an array and contains more information then just indexes. Transforming this into arrow function
                         * caused issue #2505 where analytics no longer sent any data.
                         */
                        // tslint:disable-next-line: only-arrow-functions
                        (function () {
                            var _args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _args[_i] = arguments[_i];
                            }
                            window[DATA_LAYER_NAME].push(arguments);
                        }).apply(void 0, __spreadArray([], __read(args)));
                    };
                };
                // Unclear if we still need to but I was running into config/events I passed
                // to gtag before ['js' timestamp] weren't getting parsed, so let's make a promise
                // that resolves when firebase/analytics has configured gtag.js that we wait on
                // before sending anything
                var firebaseAnalyticsAlreadyInitialized = window[DATA_LAYER_NAME].some(parseMeasurementId_1);
                if (firebaseAnalyticsAlreadyInitialized) {
                    this.analyticsInitialized = Promise.resolve();
                    patchGtag_1();
                }
                else {
                    this.analyticsInitialized = new Promise(function (resolve) {
                        patchGtag_1(function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            if (parseMeasurementId_1.apply(void 0, __spreadArray([], __read(args)))) {
                                resolve();
                            }
                        });
                    });
                }
                if (providedConfig) {
                    this.updateConfig(providedConfig);
                }
                if (debugModeEnabled) {
                    this.updateConfig((_a = {}, _a[DEBUG_MODE_KEY] = 1, _a));
                }
            }
            else {
                this.analyticsInitialized = Promise.resolve();
            }
            var analytics = rxjs.of(undefined).pipe(operators.observeOn(new i1.ɵAngularFireSchedulers(zone).outsideAngular), operators.switchMap(function () { return common.isPlatformBrowser(platformId) ? zone.runOutsideAngular(function () { return rxjs.of(undefined); }) : rxjs.EMPTY; }), 
            // SEMVER can switch to isSupported() when we only target v8
            // switchMap(() => firebase.analytics.isSupported().then(it => it, () => false)),
            // TODO server-side investigate use of the Universal Analytics API
            // switchMap(supported => supported ? of(undefined) : EMPTY),
            operators.map(function () {
                return i1.ɵfetchInstance("analytics", 'AngularFireAnalytics', app, function () {
                    var analytics = app.analytics();
                    if (analyticsCollectionEnabled === false) {
                        analytics.setAnalyticsCollectionEnabled(false);
                    }
                    return analytics;
                }, [app, analyticsCollectionEnabled, providedConfig, debugModeEnabled]);
            }), operators.shareReplay({ bufferSize: 1, refCount: false }));
            return i1.ɵlazySDKProxy(this, analytics, zone);
        }
        AngularFireAnalytics.prototype.updateConfig = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.analyticsInitialized];
                        case 1:
                            _a.sent();
                            window[GTAG_FUNCTION_NAME](GTAG_CONFIG_COMMAND, this.measurementId, Object.assign(Object.assign({}, config), { update: true }));
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AngularFireAnalytics;
    }());
    /** @nocollapse */ AngularFireAnalytics.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AngularFireAnalytics_Factory() { return new AngularFireAnalytics(i0__namespace.ɵɵinject(i1__namespace.FirebaseApp), i0__namespace.ɵɵinject(COLLECTION_ENABLED, 8), i0__namespace.ɵɵinject(APP_VERSION, 8), i0__namespace.ɵɵinject(APP_NAME, 8), i0__namespace.ɵɵinject(DEBUG_MODE, 8), i0__namespace.ɵɵinject(CONFIG, 8), i0__namespace.ɵɵinject(i0__namespace.PLATFORM_ID), i0__namespace.ɵɵinject(i0__namespace.NgZone)); }, token: AngularFireAnalytics, providedIn: "any" });
    AngularFireAnalytics.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'any'
                },] }
    ];
    /** @nocollapse */
    AngularFireAnalytics.ctorParameters = function () { return [
        { type: i1.FirebaseApp },
        { type: Boolean, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [COLLECTION_ENABLED,] }] },
        { type: String, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [APP_VERSION,] }] },
        { type: String, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [APP_NAME,] }] },
        { type: Boolean, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [DEBUG_MODE,] }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [CONFIG,] }] },
        { type: Object, decorators: [{ type: i0.Inject, args: [i0.PLATFORM_ID,] }] },
        { type: i0.NgZone }
    ]; };
    i1.ɵapplyMixins(AngularFireAnalytics, [proxyPolyfillCompat]);

    var UserTrackingService = /** @class */ (function () {
        // TODO a user properties injector
        function UserTrackingService(analytics, 
        // tslint:disable-next-line:ban-types
        platformId, auth, zone) {
            this.disposables = [];
            if (!common.isPlatformServer(platformId)) {
                var resolveInitialized_1;
                this.initialized = zone.runOutsideAngular(function () { return new Promise(function (resolve) { return resolveInitialized_1 = resolve; }); });
                this.disposables = [
                    auth.authState.subscribe(function (user) {
                        analytics.setUserId(user === null || user === void 0 ? void 0 : user.uid);
                        resolveInitialized_1();
                    }),
                    auth.credential.subscribe(function (credential) {
                        if (credential) {
                            var method = credential.user.isAnonymous ? 'anonymous' : credential.additionalUserInfo.providerId;
                            if (credential.additionalUserInfo.isNewUser) {
                                analytics.logEvent('sign_up', { method: method });
                            }
                            analytics.logEvent('login', { method: method });
                        }
                    })
                ];
            }
            else {
                this.initialized = Promise.resolve();
            }
        }
        UserTrackingService.prototype.ngOnDestroy = function () {
            this.disposables.forEach(function (it) { return it.unsubscribe(); });
        };
        return UserTrackingService;
    }());
    UserTrackingService.decorators = [
        { type: i0.Injectable }
    ];
    /** @nocollapse */
    UserTrackingService.ctorParameters = function () { return [
        { type: AngularFireAnalytics },
        { type: Object, decorators: [{ type: i0.Inject, args: [i0.PLATFORM_ID,] }] },
        { type: auth.AngularFireAuth },
        { type: i0.NgZone }
    ]; };

    var FIREBASE_EVENT_ORIGIN_KEY = 'firebase_event_origin';
    var FIREBASE_PREVIOUS_SCREEN_CLASS_KEY = 'firebase_previous_class';
    var FIREBASE_PREVIOUS_SCREEN_INSTANCE_ID_KEY = 'firebase_previous_id';
    var FIREBASE_PREVIOUS_SCREEN_NAME_KEY = 'firebase_previous_screen';
    var FIREBASE_SCREEN_CLASS_KEY = 'firebase_screen_class';
    var FIREBASE_SCREEN_INSTANCE_ID_KEY = 'firebase_screen_id';
    var FIREBASE_SCREEN_NAME_KEY = 'firebase_screen';
    var OUTLET_KEY = 'outlet';
    var PAGE_PATH_KEY = 'page_path';
    var PAGE_TITLE_KEY = 'page_title';
    var SCREEN_CLASS_KEY = 'screen_class';
    var SCREEN_NAME_KEY = 'screen_name';
    var SCREEN_VIEW_EVENT = 'screen_view';
    var EVENT_ORIGIN_AUTO = 'auto';
    var SCREEN_INSTANCE_DELIMITER = '#';
    // this is an INT64 in iOS/Android but use INT32 cause javascript
    var nextScreenInstanceID = Math.floor(Math.random() * (Math.pow(2, 32) - 1)) - Math.pow(2, 31);
    var knownScreenInstanceIDs = {};
    var getScreenInstanceID = function (params) {
        // unique the screen class against the outlet name
        var screenInstanceKey = [
            params[SCREEN_CLASS_KEY],
            params[OUTLET_KEY]
        ].join(SCREEN_INSTANCE_DELIMITER);
        if (knownScreenInstanceIDs.hasOwnProperty(screenInstanceKey)) {
            return knownScreenInstanceIDs[screenInstanceKey];
        }
        else {
            var ret = nextScreenInstanceID++;
            knownScreenInstanceIDs[screenInstanceKey] = ret;
            return ret;
        }
    };
    var ɵ0 = getScreenInstanceID;
    var ScreenTrackingService = /** @class */ (function () {
        function ScreenTrackingService(analytics, router$1, title, componentFactoryResolver, 
        // tslint:disable-next-line:ban-types
        platformId, zone, userTrackingService) {
            var _this = this;
            if (!router$1 || !common.isPlatformBrowser(platformId)) {
                return this;
            }
            zone.runOutsideAngular(function () {
                var activationEndEvents = router$1.events.pipe(operators.filter(function (e) { return e instanceof router.ActivationEnd; }));
                _this.disposable = activationEndEvents.pipe(operators.switchMap(function (activationEnd) {
                    var _b, _c, _d;
                    var _a;
                    // router parseUrl is having trouble with outlets when they're empty
                    // e.g, /asdf/1(bob://sally:asdf), so put another slash in when empty
                    var urlTree = router$1.parseUrl(router$1.url.replace(/(?:\().+(?:\))/g, function (a) { return a.replace('://', ':///'); }));
                    var pagePath = ((_a = urlTree.root.children[activationEnd.snapshot.outlet]) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                    var actualSnapshot = router$1.routerState.root.children.map(function (it) { return it; }).find(function (it) { return it.outlet === activationEnd.snapshot.outlet; });
                    if (!actualSnapshot) {
                        return rxjs.of(null);
                    }
                    var actualDeep = actualSnapshot;
                    while (actualDeep.firstChild) {
                        actualDeep = actualDeep.firstChild;
                    }
                    var screenName = actualDeep.pathFromRoot.map(function (s) { var _a; return (_a = s.routeConfig) === null || _a === void 0 ? void 0 : _a.path; }).filter(function (it) { return it; }).join('/') || '/';
                    var params = (_b = {},
                        _b[SCREEN_NAME_KEY] = screenName,
                        _b[PAGE_PATH_KEY] = "/" + pagePath,
                        _b[FIREBASE_EVENT_ORIGIN_KEY] = EVENT_ORIGIN_AUTO,
                        _b[FIREBASE_SCREEN_NAME_KEY] = screenName,
                        _b[OUTLET_KEY] = activationEnd.snapshot.outlet,
                        _b);
                    if (title) {
                        params[PAGE_TITLE_KEY] = title.getTitle();
                    }
                    var component = actualSnapshot.component;
                    if (component) {
                        if (component === router.ɵEmptyOutletComponent) {
                            var deepSnapshot = activationEnd.snapshot;
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
                        return rxjs.of(Object.assign(Object.assign({}, params), (_c = {}, _c[SCREEN_CLASS_KEY] = component, _c)));
                    }
                    else if (component) {
                        var componentFactory = componentFactoryResolver.resolveComponentFactory(component);
                        return rxjs.of(Object.assign(Object.assign({}, params), (_d = {}, _d[SCREEN_CLASS_KEY] = componentFactory.selector, _d)));
                    }
                    else {
                        // lazy loads cause extra activations, ignore
                        return rxjs.of(null);
                    }
                }), operators.filter(function (it) { return it; }), operators.map(function (params) {
                    var _b;
                    return (Object.assign((_b = {}, _b[FIREBASE_SCREEN_CLASS_KEY] = params[SCREEN_CLASS_KEY], _b[FIREBASE_SCREEN_INSTANCE_ID_KEY] = getScreenInstanceID(params), _b), params));
                }), operators.groupBy(function (it) { return it[OUTLET_KEY]; }), operators.mergeMap(function (it) { return it.pipe(operators.distinctUntilChanged(function (a, b) { return JSON.stringify(a) === JSON.stringify(b); }), operators.startWith(undefined), operators.pairwise(), operators.map(function (_b) {
                    var _c;
                    var _d = __read(_b, 2), prior = _d[0], current = _d[1];
                    return prior ? Object.assign((_c = {}, _c[FIREBASE_PREVIOUS_SCREEN_CLASS_KEY] = prior[SCREEN_CLASS_KEY], _c[FIREBASE_PREVIOUS_SCREEN_NAME_KEY] = prior[SCREEN_NAME_KEY], _c[FIREBASE_PREVIOUS_SCREEN_INSTANCE_ID_KEY] = prior[FIREBASE_SCREEN_INSTANCE_ID_KEY], _c), current) : current;
                }), operators.switchMap(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!userTrackingService) return [3 /*break*/, 2];
                                return [4 /*yield*/, userTrackingService.initialized];
                            case 1:
                                _b.sent();
                                _b.label = 2;
                            case 2: return [4 /*yield*/, analytics.logEvent(SCREEN_VIEW_EVENT, params)];
                            case 3: return [2 /*return*/, _b.sent()];
                        }
                    });
                }); })); })).subscribe();
            });
        }
        ScreenTrackingService.prototype.ngOnDestroy = function () {
            if (this.disposable) {
                this.disposable.unsubscribe();
            }
        };
        return ScreenTrackingService;
    }());
    ScreenTrackingService.decorators = [
        { type: i0.Injectable }
    ];
    /** @nocollapse */
    ScreenTrackingService.ctorParameters = function () { return [
        { type: AngularFireAnalytics },
        { type: router.Router, decorators: [{ type: i0.Optional }] },
        { type: platformBrowser.Title, decorators: [{ type: i0.Optional }] },
        { type: i0.ComponentFactoryResolver },
        { type: Object, decorators: [{ type: i0.Inject, args: [i0.PLATFORM_ID,] }] },
        { type: i0.NgZone },
        { type: UserTrackingService, decorators: [{ type: i0.Optional }] }
    ]; };

    var AngularFireAnalyticsModule = /** @class */ (function () {
        function AngularFireAnalyticsModule(analytics, screenTracking, userTracking) {
            // calling anything on analytics will eagerly load the SDK
            // tslint:disable-next-line:no-unused-expression
            analytics.app.then(function () { });
        }
        return AngularFireAnalyticsModule;
    }());
    AngularFireAnalyticsModule.decorators = [
        { type: i0.NgModule, args: [{
                    providers: [AngularFireAnalytics]
                },] }
    ];
    /** @nocollapse */
    AngularFireAnalyticsModule.ctorParameters = function () { return [
        { type: AngularFireAnalytics },
        { type: ScreenTrackingService, decorators: [{ type: i0.Optional }] },
        { type: UserTrackingService, decorators: [{ type: i0.Optional }] }
    ]; };

    /**
     * Generated bundle index. Do not edit.
     */

    exports.APP_NAME = APP_NAME;
    exports.APP_VERSION = APP_VERSION;
    exports.AngularFireAnalytics = AngularFireAnalytics;
    exports.AngularFireAnalyticsModule = AngularFireAnalyticsModule;
    exports.COLLECTION_ENABLED = COLLECTION_ENABLED;
    exports.CONFIG = CONFIG;
    exports.DEBUG_MODE = DEBUG_MODE;
    exports.ScreenTrackingService = ScreenTrackingService;
    exports.UserTrackingService = UserTrackingService;
    exports.ɵ0 = ɵ0;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-fire-analytics.umd.js.map
