import { NgZone, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseOptions, FirebaseAppConfig, ɵPromiseProxy } from '@angular/fire';
import firebase from 'firebase/app';
import * as ɵngcc0 from '@angular/core';
export interface AngularFireAuth extends ɵPromiseProxy<firebase.auth.Auth> {
}
declare type UseEmulatorArguments = [string, number];
export declare const USE_EMULATOR: InjectionToken<UseEmulatorArguments>;
export declare const SETTINGS: InjectionToken<firebase.auth.AuthSettings>;
export declare const TENANT_ID: InjectionToken<string>;
export declare const LANGUAGE_CODE: InjectionToken<string>;
export declare const USE_DEVICE_LANGUAGE: InjectionToken<boolean>;
export declare const PERSISTENCE: InjectionToken<string>;
export declare class AngularFireAuth {
    /**
     * Observable of authentication state; as of Firebase 4.0 this is only triggered via sign-in/out
     */
    readonly authState: Observable<firebase.User | null>;
    /**
     * Observable of the currently signed-in user's JWT token used to identify the user to a Firebase service (or null).
     */
    readonly idToken: Observable<string | null>;
    /**
     * Observable of the currently signed-in user (or null).
     */
    readonly user: Observable<firebase.User | null>;
    /**
     * Observable of the currently signed-in user's IdTokenResult object which contains the ID token JWT string and other
     * helper properties for getting different data associated with the token as well as all the decoded payload claims
     * (or null).
     */
    readonly idTokenResult: Observable<firebase.auth.IdTokenResult | null>;
    /**
     * Observable of the currently signed-in user's credential, or null
     */
    readonly credential: Observable<Required<firebase.auth.UserCredential> | null>;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | null | undefined, platformId: Object, zone: NgZone, _useEmulator: any, // can't use the tuple here
    _settings: any, // can't use firebase.auth.AuthSettings here
    tenantId: string | null, languageCode: string | null, useDeviceLanguage: boolean | null, persistence: string | null);
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<AngularFireAuth, [null, { optional: true; }, null, null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
}
export {};

//# sourceMappingURL=auth.d.ts.map