(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('rxjs'), require('rxjs/operators'), require('@angular/fire/auth')) :
    typeof define === 'function' && define.amd ? define('@angular/fire/auth-guard', ['exports', '@angular/core', '@angular/router', 'rxjs', 'rxjs/operators', '@angular/fire/auth'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.angular = global.angular || {}, global.angular.fire = global.angular.fire || {}, global.angular.fire['auth-guard'] = {}), global.ng.core, global.ng.router, global.rxjs, global.rxjs.operators, global.angular.fire.auth));
}(this, (function (exports, i0, i1, rxjs, operators, i2) { 'use strict';

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
    var i2__namespace = /*#__PURE__*/_interopNamespace(i2);

    var ɵ0 = function (user) { return !!user; };
    var loggedIn = operators.map(ɵ0);
    var AngularFireAuthGuard = /** @class */ (function () {
        function AngularFireAuthGuard(router, auth) {
            var _this = this;
            this.router = router;
            this.auth = auth;
            this.canActivate = function (next, state) {
                var authPipeFactory = next.data.authGuardPipe || (function () { return loggedIn; });
                return _this.auth.user.pipe(operators.take(1), authPipeFactory(next, state), operators.map(function (can) {
                    if (typeof can === 'boolean') {
                        return can;
                    }
                    else if (Array.isArray(can)) {
                        return _this.router.createUrlTree(can);
                    }
                    else {
                        // TODO(EdricChan03): Add tests
                        return _this.router.parseUrl(can);
                    }
                }));
            };
        }
        return AngularFireAuthGuard;
    }());
    /** @nocollapse */ AngularFireAuthGuard.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AngularFireAuthGuard_Factory() { return new AngularFireAuthGuard(i0__namespace.ɵɵinject(i1__namespace.Router), i0__namespace.ɵɵinject(i2__namespace.AngularFireAuth)); }, token: AngularFireAuthGuard, providedIn: "any" });
    AngularFireAuthGuard.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'any'
                },] }
    ];
    /** @nocollapse */
    AngularFireAuthGuard.ctorParameters = function () { return [
        { type: i1.Router },
        { type: i2.AngularFireAuth }
    ]; };
    var canActivate = function (pipe) { return ({
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: pipe }
    }); };
    var ɵ1 = function (user) { return !!user && !user.isAnonymous; };
    var isNotAnonymous = operators.map(ɵ1);
    var ɵ2 = function (user) { return user ? user.getIdTokenResult() : rxjs.of(null); };
    var idTokenResult = operators.switchMap(ɵ2);
    var ɵ3 = function (user) { return !!user && user.emailVerified; };
    var emailVerified = operators.map(ɵ3);
    var ɵ4 = function (idTokenResult) { return idTokenResult ? idTokenResult.claims : []; };
    var customClaims = rxjs.pipe(idTokenResult, operators.map(ɵ4));
    var hasCustomClaim = function (claim) { return rxjs.pipe(customClaims, operators.map(function (claims) { return claims.hasOwnProperty(claim); })); };
    var redirectUnauthorizedTo = function (redirect) { return rxjs.pipe(loggedIn, operators.map(function (loggedIn) { return loggedIn || redirect; })); };
    var redirectLoggedInTo = function (redirect) { return rxjs.pipe(loggedIn, operators.map(function (loggedIn) { return loggedIn && redirect || true; })); };

    var AngularFireAuthGuardModule = /** @class */ (function () {
        function AngularFireAuthGuardModule() {
        }
        return AngularFireAuthGuardModule;
    }());
    AngularFireAuthGuardModule.decorators = [
        { type: i0.NgModule, args: [{
                    providers: [AngularFireAuthGuard]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AngularFireAuthGuard = AngularFireAuthGuard;
    exports.AngularFireAuthGuardModule = AngularFireAuthGuardModule;
    exports.canActivate = canActivate;
    exports.customClaims = customClaims;
    exports.emailVerified = emailVerified;
    exports.hasCustomClaim = hasCustomClaim;
    exports.idTokenResult = idTokenResult;
    exports.isNotAnonymous = isNotAnonymous;
    exports.loggedIn = loggedIn;
    exports.redirectLoggedInTo = redirectLoggedInTo;
    exports.redirectUnauthorizedTo = redirectUnauthorizedTo;
    exports.ɵ0 = ɵ0;
    exports.ɵ1 = ɵ1;
    exports.ɵ2 = ɵ2;
    exports.ɵ3 = ɵ3;
    exports.ɵ4 = ɵ4;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-fire-auth-guard.umd.js.map
