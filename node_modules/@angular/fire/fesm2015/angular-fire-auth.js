
import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, Optional, PLATFORM_ID, NgZone, NgModule } from '@angular/core';
import { Subject, of, Observable, from, merge } from 'rxjs';
import { observeOn, switchMap, map, shareReplay, first, switchMapTo, subscribeOn, filter } from 'rxjs/operators';
import * as i1 from '@angular/fire';
import { ɵAngularFireSchedulers, ɵkeepUnstableUntilFirstFactory, ɵfirebaseAppFactory, ɵfetchInstance, ɵlazySDKProxy, FIREBASE_OPTIONS, FIREBASE_APP_NAME, ɵapplyMixins } from '@angular/fire';
import { isPlatformServer } from '@angular/common';

const proxyPolyfillCompat = {
    app: null,
    applyActionCode: null,
    checkActionCode: null,
    confirmPasswordReset: null,
    createUserWithEmailAndPassword: null,
    currentUser: null,
    fetchSignInMethodsForEmail: null,
    isSignInWithEmailLink: null,
    getRedirectResult: null,
    languageCode: null,
    settings: null,
    onAuthStateChanged: null,
    onIdTokenChanged: null,
    sendSignInLinkToEmail: null,
    sendPasswordResetEmail: null,
    setPersistence: null,
    signInAndRetrieveDataWithCredential: null,
    signInAnonymously: null,
    signInWithCredential: null,
    signInWithCustomToken: null,
    signInWithEmailAndPassword: null,
    signInWithPhoneNumber: null,
    signInWithEmailLink: null,
    signInWithPopup: null,
    signInWithRedirect: null,
    signOut: null,
    tenantId: null,
    updateCurrentUser: null,
    useDeviceLanguage: null,
    useEmulator: null,
    verifyPasswordResetCode: null,
};

const USE_EMULATOR = new InjectionToken('angularfire2.auth.use-emulator');
const SETTINGS = new InjectionToken('angularfire2.auth.settings');
const TENANT_ID = new InjectionToken('angularfire2.auth.tenant-id');
const LANGUAGE_CODE = new InjectionToken('angularfire2.auth.langugage-code');
const USE_DEVICE_LANGUAGE = new InjectionToken('angularfire2.auth.use-device-language');
const PERSISTENCE = new InjectionToken('angularfire.auth.persistence');
class AngularFireAuth {
    constructor(options, nameOrConfig, 
    // tslint:disable-next-line:ban-types
    platformId, zone, _useEmulator, // can't use the tuple here
    _settings, // can't use firebase.auth.AuthSettings here
    tenantId, languageCode, useDeviceLanguage, persistence) {
        const schedulers = new ɵAngularFireSchedulers(zone);
        const keepUnstableUntilFirst = ɵkeepUnstableUntilFirstFactory(schedulers);
        const logins = new Subject();
        const auth = of(undefined).pipe(observeOn(schedulers.outsideAngular), switchMap(() => zone.runOutsideAngular(() => import('firebase/auth'))), map(() => ɵfirebaseAppFactory(options, zone, nameOrConfig)), map(app => zone.runOutsideAngular(() => {
            const useEmulator = _useEmulator;
            const settings = _settings;
            return ɵfetchInstance(`${app.name}.auth`, 'AngularFireAuth', app, () => {
                const auth = zone.runOutsideAngular(() => app.auth());
                if (useEmulator) {
                    // Firebase Auth doesn't conform to the useEmulator convention, let's smooth that over
                    auth.useEmulator(`http://${useEmulator.join(':')}`);
                }
                if (tenantId) {
                    auth.tenantId = tenantId;
                }
                auth.languageCode = languageCode;
                if (useDeviceLanguage) {
                    auth.useDeviceLanguage();
                }
                if (settings) {
                    for (const [k, v] of Object.entries(settings)) {
                        auth.settings[k] = v;
                    }
                }
                if (persistence) {
                    auth.setPersistence(persistence);
                }
                return auth;
            }, [useEmulator, tenantId, languageCode, useDeviceLanguage, settings, persistence]);
        })), shareReplay({ bufferSize: 1, refCount: false }));
        if (isPlatformServer(platformId)) {
            this.authState = this.user = this.idToken = this.idTokenResult = this.credential = of(null);
        }
        else {
            // HACK, as we're exporting auth.Auth, rather than auth, developers importing firebase.auth
            //       (e.g, `import { auth } from 'firebase/app'`) are getting an undefined auth object unexpectedly
            //       as we're completely lazy. Let's eagerly load the Auth SDK here.
            //       There could potentially be race conditions still... but this greatly decreases the odds while
            //       we reevaluate the API.
            const _ = auth.pipe(first()).subscribe();
            const redirectResult = auth.pipe(switchMap(auth => auth.getRedirectResult().then(it => it, () => null)), keepUnstableUntilFirst, shareReplay({ bufferSize: 1, refCount: false }));
            const fromCallback = (cb) => new Observable(subscriber => ({ unsubscribe: zone.runOutsideAngular(() => cb(subscriber)) }));
            const authStateChanged = auth.pipe(switchMap(auth => fromCallback(auth.onAuthStateChanged.bind(auth))));
            const idTokenChanged = auth.pipe(switchMap(auth => fromCallback(auth.onIdTokenChanged.bind(auth))));
            this.authState = redirectResult.pipe(switchMapTo(authStateChanged), subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular));
            this.user = redirectResult.pipe(switchMapTo(idTokenChanged), subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular));
            this.idToken = this.user.pipe(switchMap(user => user ? from(user.getIdToken()) : of(null)));
            this.idTokenResult = this.user.pipe(switchMap(user => user ? from(user.getIdTokenResult()) : of(null)));
            this.credential = merge(redirectResult, logins, 
            // pipe in null authState to make credential zipable, just a weird devexp if
            // authState and user go null to still have a credential
            this.authState.pipe(filter(it => !it))).pipe(
            // handle the { user: { } } when a user is already logged in, rather have null
            // TODO handle the type corcersion better
            map(credential => (credential === null || credential === void 0 ? void 0 : credential.user) ? credential : null), subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular));
        }
        return ɵlazySDKProxy(this, auth, zone, { spy: {
                apply: (name, _, val) => {
                    // If they call a signIn or createUser function listen into the promise
                    // this will give us the user credential, push onto the logins Subject
                    // to be consumed in .credential
                    if (name.startsWith('signIn') || name.startsWith('createUser')) {
                        // TODO fix the types, the trouble is UserCredential has everything optional
                        val.then((user) => logins.next(user));
                    }
                }
            } });
    }
}
/** @nocollapse */ AngularFireAuth.ɵprov = i0.ɵɵdefineInjectable({ factory: function AngularFireAuth_Factory() { return new AngularFireAuth(i0.ɵɵinject(i1.FIREBASE_OPTIONS), i0.ɵɵinject(i1.FIREBASE_APP_NAME, 8), i0.ɵɵinject(i0.PLATFORM_ID), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(USE_EMULATOR, 8), i0.ɵɵinject(SETTINGS, 8), i0.ɵɵinject(TENANT_ID, 8), i0.ɵɵinject(LANGUAGE_CODE, 8), i0.ɵɵinject(USE_DEVICE_LANGUAGE, 8), i0.ɵɵinject(PERSISTENCE, 8)); }, token: AngularFireAuth, providedIn: "any" });
AngularFireAuth.decorators = [
    { type: Injectable, args: [{
                providedIn: 'any'
            },] }
];
/** @nocollapse */
AngularFireAuth.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [FIREBASE_OPTIONS,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FIREBASE_APP_NAME,] }] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [USE_EMULATOR,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [SETTINGS,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [TENANT_ID,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [LANGUAGE_CODE,] }] },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [USE_DEVICE_LANGUAGE,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [PERSISTENCE,] }] }
];
ɵapplyMixins(AngularFireAuth, [proxyPolyfillCompat]);

class AngularFireAuthModule {
}
AngularFireAuthModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireAuth]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AngularFireAuth, AngularFireAuthModule, LANGUAGE_CODE, PERSISTENCE, SETTINGS, TENANT_ID, USE_DEVICE_LANGUAGE, USE_EMULATOR };
//# sourceMappingURL=angular-fire-auth.js.map
