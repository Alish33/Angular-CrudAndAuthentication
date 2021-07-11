import { InjectionToken, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseAppConfig, FirebaseOptions, ɵAngularFireSchedulers } from '@angular/fire';
import { UploadMetadata } from './interfaces';
import 'firebase/storage';
import firebase from 'firebase/app';
export declare const BUCKET: InjectionToken<string>;
export declare const MAX_UPLOAD_RETRY_TIME: InjectionToken<number>;
export declare const MAX_OPERATION_RETRY_TIME: InjectionToken<number>;
/**
 * AngularFireStorage Service
 *
 * This service is the main entry point for this feature module. It provides
 * an API for uploading and downloading binary files from Cloud Storage for
 * Firebase.
 */
export declare class AngularFireStorage {
    readonly storage: firebase.storage.Storage;
    readonly keepUnstableUntilFirst: <T>(obs: Observable<T>) => Observable<T>;
    readonly schedulers: ɵAngularFireSchedulers;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | null | undefined, storageBucket: string | null, platformId: Object, zone: NgZone, maxUploadRetryTime: number | any, maxOperationRetryTime: number | any);
    ref(path: string): import("./ref").AngularFireStorageReference;
    refFromURL(path: string): import("./ref").AngularFireStorageReference;
    upload(path: string, data: any, metadata?: UploadMetadata): import("./task").AngularFireUploadTask;
}
