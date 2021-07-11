import * as i0 from '@angular/core';
import { Injectable, NgModule } from '@angular/core';
import * as i1 from '@angular/router';
import { Router } from '@angular/router';
import { of, pipe } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import * as i2 from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';

const ɵ0 = user => !!user;
const loggedIn = map(ɵ0);
class AngularFireAuthGuard {
    constructor(router, auth) {
        this.router = router;
        this.auth = auth;
        this.canActivate = (next, state) => {
            const authPipeFactory = next.data.authGuardPipe || (() => loggedIn);
            return this.auth.user.pipe(take(1), authPipeFactory(next, state), map(can => {
                if (typeof can === 'boolean') {
                    return can;
                }
                else if (Array.isArray(can)) {
                    return this.router.createUrlTree(can);
                }
                else {
                    // TODO(EdricChan03): Add tests
                    return this.router.parseUrl(can);
                }
            }));
        };
    }
}
/** @nocollapse */ AngularFireAuthGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function AngularFireAuthGuard_Factory() { return new AngularFireAuthGuard(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i2.AngularFireAuth)); }, token: AngularFireAuthGuard, providedIn: "any" });
AngularFireAuthGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'any'
            },] }
];
/** @nocollapse */
AngularFireAuthGuard.ctorParameters = () => [
    { type: Router },
    { type: AngularFireAuth }
];
const canActivate = (pipe) => ({
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: pipe }
});
const ɵ1 = user => !!user && !user.isAnonymous;
const isNotAnonymous = map(ɵ1);
const ɵ2 = (user) => user ? user.getIdTokenResult() : of(null);
const idTokenResult = switchMap(ɵ2);
const ɵ3 = user => !!user && user.emailVerified;
const emailVerified = map(ɵ3);
const ɵ4 = idTokenResult => idTokenResult ? idTokenResult.claims : [];
const customClaims = pipe(idTokenResult, map(ɵ4));
const hasCustomClaim = (claim) => pipe(customClaims, map(claims => claims.hasOwnProperty(claim)));
const redirectUnauthorizedTo = (redirect) => pipe(loggedIn, map(loggedIn => loggedIn || redirect));
const redirectLoggedInTo = (redirect) => pipe(loggedIn, map(loggedIn => loggedIn && redirect || true));

class AngularFireAuthGuardModule {
}
AngularFireAuthGuardModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireAuthGuard]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AngularFireAuthGuard, AngularFireAuthGuardModule, canActivate, customClaims, emailVerified, hasCustomClaim, idTokenResult, isNotAnonymous, loggedIn, redirectLoggedInTo, redirectUnauthorizedTo, ɵ0, ɵ1, ɵ2, ɵ3, ɵ4 };
//# sourceMappingURL=angular-fire-auth-guard.js.map
