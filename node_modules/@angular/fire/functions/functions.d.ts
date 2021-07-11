import { InjectionToken, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseAppConfig, FirebaseOptions, ɵPromiseProxy } from '@angular/fire';
import firebase from 'firebase/app';
import { HttpsCallableOptions } from '@firebase/functions-types';
export declare const ORIGIN: InjectionToken<string>;
export declare const REGION: InjectionToken<string>;
export declare const NEW_ORIGIN_BEHAVIOR: InjectionToken<boolean>;
declare type UseEmulatorArguments = [string, number];
export declare const USE_EMULATOR: InjectionToken<UseEmulatorArguments>;
export interface AngularFireFunctions extends Omit<ɵPromiseProxy<firebase.functions.Functions>, 'httpsCallable'> {
}
export declare class AngularFireFunctions {
    readonly httpsCallable: <T = any, R = any>(name: string, options?: HttpsCallableOptions) => (data: T) => Observable<R>;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | null | undefined, zone: NgZone, region: string | null, origin: string | null, newOriginBehavior: boolean | null, _useEmulator: any);
}
export {};
