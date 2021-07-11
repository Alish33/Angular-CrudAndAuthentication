import { InjectionToken, ModuleWithProviders, NgZone, Version } from '@angular/core';
import firebase from 'firebase/app';
import * as ɵngcc0 from '@angular/core';
export interface FirebaseOptions {
    [key: string]: any;
}
export interface FirebaseAppConfig {
    [key: string]: any;
}
export declare const FIREBASE_OPTIONS: InjectionToken<FirebaseOptions>;
export declare const FIREBASE_APP_NAME: InjectionToken<string | FirebaseAppConfig>;
export declare class FirebaseApp implements Partial<firebase.app.App> {
    name: string;
    options: {};
    analytics: () => firebase.analytics.Analytics;
    auth: () => firebase.auth.Auth;
    database: (databaseURL?: string) => firebase.database.Database;
    messaging: () => firebase.messaging.Messaging;
    performance: () => firebase.performance.Performance;
    storage: (storageBucket?: string) => firebase.storage.Storage;
    delete: () => Promise<void>;
    firestore: () => firebase.firestore.Firestore;
    functions: (region?: string) => firebase.functions.Functions;
    remoteConfig: () => firebase.remoteConfig.RemoteConfig;
}
export declare const VERSION: Version;
export declare function ɵfirebaseAppFactory(options: FirebaseOptions, zone: NgZone, nameOrConfig?: string | FirebaseAppConfig | null): FirebaseApp;
export declare const ɵlogAuthEmulatorError: () => void;
export declare function ɵfetchInstance<T>(cacheKey: any, moduleName: string, app: FirebaseApp, fn: () => T, args: any[]): T;
export declare class AngularFireModule {
    static initializeApp(options: FirebaseOptions, nameOrConfig?: string | FirebaseAppConfig): ModuleWithProviders<AngularFireModule>;
    constructor(platformId: Object);
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<AngularFireModule, never>;
    static ɵmod: ɵngcc0.ɵɵNgModuleDeclaration<AngularFireModule, never, never, never>;
    static ɵinj: ɵngcc0.ɵɵInjectorDeclaration<AngularFireModule>;
}

//# sourceMappingURL=firebase.app.module.d.ts.map