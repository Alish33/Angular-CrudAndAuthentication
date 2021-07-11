import { Observable, of, from } from 'rxjs';
import { debounceTime, map, observeOn, switchMap } from 'rxjs/operators';
import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, Optional, PLATFORM_ID, NgZone, Pipe, ChangeDetectorRef, NgModule } from '@angular/core';
import * as i1 from '@angular/fire';
import { ɵAngularFireSchedulers, ɵkeepUnstableUntilFirstFactory, ɵfirebaseAppFactory, ɵfetchInstance, FIREBASE_OPTIONS, FIREBASE_APP_NAME } from '@angular/fire';
import 'firebase/storage';
import { AsyncPipe } from '@angular/common';

// Things aren't working great, I'm having to put in a lot of work-arounds for what
// appear to be Firebase JS SDK bugs https://github.com/firebase/firebase-js-sdk/issues/4158
function fromTask(task) {
    return new Observable(subscriber => {
        const progress = (snap) => subscriber.next(snap);
        const error = e => subscriber.error(e);
        const complete = () => subscriber.complete();
        // emit the current snapshot, so they don't have to wait for state_changes
        // to fire next... this is stale if the task is no longer running :(
        progress(task.snapshot);
        const unsub = task.on('state_changed', progress);
        // it turns out that neither task snapshot nor 'state_changed' fire the last
        // snapshot before completion, the one with status 'success" and 100% progress
        // so let's use the promise form of the task for that
        task.then(snapshot => {
            progress(snapshot);
            complete();
        }, e => {
            // TODO investigate, again this is stale, we never fire a canceled or error it seems
            progress(task.snapshot);
            error(e);
        });
        // on's type if Function, rather than () => void, need to wrap
        return function unsubscribe() {
            unsub();
        };
    }).pipe(
    // deal with sync emissions from first emitting `task.snapshot`, this makes sure
    // that if the task is already finished we don't emit the old running state
    debounceTime(0));
}

/**
 * Create an AngularFireUploadTask from a regular UploadTask from the Storage SDK.
 * This method creates an observable of the upload and returns on object that provides
 * multiple methods for controlling and monitoring the file upload.
 */
function createUploadTask(task) {
    const inner$ = fromTask(task);
    return {
        task,
        then: task.then.bind(task),
        catch: task.catch.bind(task),
        pause: task.pause.bind(task),
        cancel: task.cancel.bind(task),
        resume: task.resume.bind(task),
        snapshotChanges: () => inner$,
        percentageChanges: () => inner$.pipe(map(s => s.bytesTransferred / s.totalBytes * 100))
    };
}

/**
 * Create an AngularFire wrapped Storage Reference. This object
 * creates observable methods from promise based methods.
 */
function createStorageRef(ref, schedulers, keepUnstableUntilFirst) {
    return {
        getDownloadURL: () => of(undefined).pipe(observeOn(schedulers.outsideAngular), switchMap(() => ref.getDownloadURL()), keepUnstableUntilFirst),
        getMetadata: () => of(undefined).pipe(observeOn(schedulers.outsideAngular), switchMap(() => ref.getMetadata()), keepUnstableUntilFirst),
        delete: () => from(ref.delete()),
        child: (path) => createStorageRef(ref.child(path), schedulers, keepUnstableUntilFirst),
        updateMetadata: (meta) => from(ref.updateMetadata(meta)),
        put: (data, metadata) => {
            const task = ref.put(data, metadata);
            return createUploadTask(task);
        },
        putString: (data, format, metadata) => {
            const task = ref.putString(data, format, metadata);
            return createUploadTask(task);
        },
        listAll: () => from(ref.listAll())
    };
}

const BUCKET = new InjectionToken('angularfire2.storageBucket');
const MAX_UPLOAD_RETRY_TIME = new InjectionToken('angularfire2.storage.maxUploadRetryTime');
const MAX_OPERATION_RETRY_TIME = new InjectionToken('angularfire2.storage.maxOperationRetryTime');
/**
 * AngularFireStorage Service
 *
 * This service is the main entry point for this feature module. It provides
 * an API for uploading and downloading binary files from Cloud Storage for
 * Firebase.
 */
class AngularFireStorage {
    constructor(options, nameOrConfig, storageBucket, 
    // tslint:disable-next-line:ban-types
    platformId, zone, maxUploadRetryTime, maxOperationRetryTime) {
        this.schedulers = new ɵAngularFireSchedulers(zone);
        this.keepUnstableUntilFirst = ɵkeepUnstableUntilFirstFactory(this.schedulers);
        const app = ɵfirebaseAppFactory(options, zone, nameOrConfig);
        this.storage = ɵfetchInstance(`${app.name}.storage.${storageBucket}`, 'AngularFireStorage', app, () => {
            const storage = zone.runOutsideAngular(() => app.storage(storageBucket || undefined));
            if (maxUploadRetryTime) {
                storage.setMaxUploadRetryTime(maxUploadRetryTime);
            }
            if (maxOperationRetryTime) {
                storage.setMaxOperationRetryTime(maxOperationRetryTime);
            }
            return storage;
        }, [maxUploadRetryTime, maxOperationRetryTime]);
    }
    ref(path) {
        return createStorageRef(this.storage.ref(path), this.schedulers, this.keepUnstableUntilFirst);
    }
    refFromURL(path) {
        return createStorageRef(this.storage.refFromURL(path), this.schedulers, this.keepUnstableUntilFirst);
    }
    upload(path, data, metadata) {
        const storageRef = this.storage.ref(path);
        const ref = createStorageRef(storageRef, this.schedulers, this.keepUnstableUntilFirst);
        return ref.put(data, metadata);
    }
}
/** @nocollapse */ AngularFireStorage.ɵprov = i0.ɵɵdefineInjectable({ factory: function AngularFireStorage_Factory() { return new AngularFireStorage(i0.ɵɵinject(i1.FIREBASE_OPTIONS), i0.ɵɵinject(i1.FIREBASE_APP_NAME, 8), i0.ɵɵinject(BUCKET, 8), i0.ɵɵinject(i0.PLATFORM_ID), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(MAX_UPLOAD_RETRY_TIME, 8), i0.ɵɵinject(MAX_OPERATION_RETRY_TIME, 8)); }, token: AngularFireStorage, providedIn: "any" });
AngularFireStorage.decorators = [
    { type: Injectable, args: [{
                providedIn: 'any'
            },] }
];
/** @nocollapse */
AngularFireStorage.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [FIREBASE_OPTIONS,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FIREBASE_APP_NAME,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [BUCKET,] }] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAX_UPLOAD_RETRY_TIME,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAX_OPERATION_RETRY_TIME,] }] }
];

/** to be used with in combination with | async */
class GetDownloadURLPipe {
    constructor(storage, cdr) {
        this.storage = storage;
        this.asyncPipe = new AsyncPipe(cdr);
    }
    transform(path) {
        if (path !== this.path) {
            this.path = path;
            this.downloadUrl$ = this.storage.ref(path).getDownloadURL();
        }
        return this.asyncPipe.transform(this.downloadUrl$);
    }
    ngOnDestroy() {
        this.asyncPipe.ngOnDestroy();
    }
}
GetDownloadURLPipe.decorators = [
    { type: Pipe, args: [{
                name: 'getDownloadURL',
                pure: false,
            },] }
];
/** @nocollapse */
GetDownloadURLPipe.ctorParameters = () => [
    { type: AngularFireStorage },
    { type: ChangeDetectorRef }
];
class GetDownloadURLPipeModule {
}
GetDownloadURLPipeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [GetDownloadURLPipe],
                exports: [GetDownloadURLPipe],
            },] }
];

class AngularFireStorageModule {
}
AngularFireStorageModule.decorators = [
    { type: NgModule, args: [{
                exports: [GetDownloadURLPipeModule],
                providers: [AngularFireStorage]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AngularFireStorage, AngularFireStorageModule, BUCKET, GetDownloadURLPipe, GetDownloadURLPipeModule, MAX_OPERATION_RETRY_TIME, MAX_UPLOAD_RETRY_TIME, createStorageRef, createUploadTask, fromTask };
//# sourceMappingURL=angular-fire-storage.js.map
