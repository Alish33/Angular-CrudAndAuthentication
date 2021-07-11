(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('@angular/fire'), require('firebase/storage'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@angular/fire/storage', ['exports', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/fire', 'firebase/storage', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.angular = global.angular || {}, global.angular.fire = global.angular.fire || {}, global.angular.fire.storage = {}), global.rxjs, global.rxjs.operators, global.ng.core, global.angular.fire, null, global.ng.common));
}(this, (function (exports, rxjs, operators, i0, i1, storage, common) { 'use strict';

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

    // Things aren't working great, I'm having to put in a lot of work-arounds for what
    // appear to be Firebase JS SDK bugs https://github.com/firebase/firebase-js-sdk/issues/4158
    function fromTask(task) {
        return new rxjs.Observable(function (subscriber) {
            var progress = function (snap) { return subscriber.next(snap); };
            var error = function (e) { return subscriber.error(e); };
            var complete = function () { return subscriber.complete(); };
            // emit the current snapshot, so they don't have to wait for state_changes
            // to fire next... this is stale if the task is no longer running :(
            progress(task.snapshot);
            var unsub = task.on('state_changed', progress);
            // it turns out that neither task snapshot nor 'state_changed' fire the last
            // snapshot before completion, the one with status 'success" and 100% progress
            // so let's use the promise form of the task for that
            task.then(function (snapshot) {
                progress(snapshot);
                complete();
            }, function (e) {
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
        operators.debounceTime(0));
    }

    /**
     * Create an AngularFireUploadTask from a regular UploadTask from the Storage SDK.
     * This method creates an observable of the upload and returns on object that provides
     * multiple methods for controlling and monitoring the file upload.
     */
    function createUploadTask(task) {
        var inner$ = fromTask(task);
        return {
            task: task,
            then: task.then.bind(task),
            catch: task.catch.bind(task),
            pause: task.pause.bind(task),
            cancel: task.cancel.bind(task),
            resume: task.resume.bind(task),
            snapshotChanges: function () { return inner$; },
            percentageChanges: function () { return inner$.pipe(operators.map(function (s) { return s.bytesTransferred / s.totalBytes * 100; })); }
        };
    }

    /**
     * Create an AngularFire wrapped Storage Reference. This object
     * creates observable methods from promise based methods.
     */
    function createStorageRef(ref, schedulers, keepUnstableUntilFirst) {
        return {
            getDownloadURL: function () { return rxjs.of(undefined).pipe(operators.observeOn(schedulers.outsideAngular), operators.switchMap(function () { return ref.getDownloadURL(); }), keepUnstableUntilFirst); },
            getMetadata: function () { return rxjs.of(undefined).pipe(operators.observeOn(schedulers.outsideAngular), operators.switchMap(function () { return ref.getMetadata(); }), keepUnstableUntilFirst); },
            delete: function () { return rxjs.from(ref.delete()); },
            child: function (path) { return createStorageRef(ref.child(path), schedulers, keepUnstableUntilFirst); },
            updateMetadata: function (meta) { return rxjs.from(ref.updateMetadata(meta)); },
            put: function (data, metadata) {
                var task = ref.put(data, metadata);
                return createUploadTask(task);
            },
            putString: function (data, format, metadata) {
                var task = ref.putString(data, format, metadata);
                return createUploadTask(task);
            },
            listAll: function () { return rxjs.from(ref.listAll()); }
        };
    }

    var BUCKET = new i0.InjectionToken('angularfire2.storageBucket');
    var MAX_UPLOAD_RETRY_TIME = new i0.InjectionToken('angularfire2.storage.maxUploadRetryTime');
    var MAX_OPERATION_RETRY_TIME = new i0.InjectionToken('angularfire2.storage.maxOperationRetryTime');
    /**
     * AngularFireStorage Service
     *
     * This service is the main entry point for this feature module. It provides
     * an API for uploading and downloading binary files from Cloud Storage for
     * Firebase.
     */
    var AngularFireStorage = /** @class */ (function () {
        function AngularFireStorage(options, nameOrConfig, storageBucket, 
        // tslint:disable-next-line:ban-types
        platformId, zone, maxUploadRetryTime, maxOperationRetryTime) {
            this.schedulers = new i1.ɵAngularFireSchedulers(zone);
            this.keepUnstableUntilFirst = i1.ɵkeepUnstableUntilFirstFactory(this.schedulers);
            var app = i1.ɵfirebaseAppFactory(options, zone, nameOrConfig);
            this.storage = i1.ɵfetchInstance(app.name + ".storage." + storageBucket, 'AngularFireStorage', app, function () {
                var storage = zone.runOutsideAngular(function () { return app.storage(storageBucket || undefined); });
                if (maxUploadRetryTime) {
                    storage.setMaxUploadRetryTime(maxUploadRetryTime);
                }
                if (maxOperationRetryTime) {
                    storage.setMaxOperationRetryTime(maxOperationRetryTime);
                }
                return storage;
            }, [maxUploadRetryTime, maxOperationRetryTime]);
        }
        AngularFireStorage.prototype.ref = function (path) {
            return createStorageRef(this.storage.ref(path), this.schedulers, this.keepUnstableUntilFirst);
        };
        AngularFireStorage.prototype.refFromURL = function (path) {
            return createStorageRef(this.storage.refFromURL(path), this.schedulers, this.keepUnstableUntilFirst);
        };
        AngularFireStorage.prototype.upload = function (path, data, metadata) {
            var storageRef = this.storage.ref(path);
            var ref = createStorageRef(storageRef, this.schedulers, this.keepUnstableUntilFirst);
            return ref.put(data, metadata);
        };
        return AngularFireStorage;
    }());
    /** @nocollapse */ AngularFireStorage.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function AngularFireStorage_Factory() { return new AngularFireStorage(i0__namespace.ɵɵinject(i1__namespace.FIREBASE_OPTIONS), i0__namespace.ɵɵinject(i1__namespace.FIREBASE_APP_NAME, 8), i0__namespace.ɵɵinject(BUCKET, 8), i0__namespace.ɵɵinject(i0__namespace.PLATFORM_ID), i0__namespace.ɵɵinject(i0__namespace.NgZone), i0__namespace.ɵɵinject(MAX_UPLOAD_RETRY_TIME, 8), i0__namespace.ɵɵinject(MAX_OPERATION_RETRY_TIME, 8)); }, token: AngularFireStorage, providedIn: "any" });
    AngularFireStorage.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'any'
                },] }
    ];
    /** @nocollapse */
    AngularFireStorage.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: i0.Inject, args: [i1.FIREBASE_OPTIONS,] }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [i1.FIREBASE_APP_NAME,] }] },
        { type: String, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [BUCKET,] }] },
        { type: Object, decorators: [{ type: i0.Inject, args: [i0.PLATFORM_ID,] }] },
        { type: i0.NgZone },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAX_UPLOAD_RETRY_TIME,] }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAX_OPERATION_RETRY_TIME,] }] }
    ]; };

    /** to be used with in combination with | async */
    var GetDownloadURLPipe = /** @class */ (function () {
        function GetDownloadURLPipe(storage, cdr) {
            this.storage = storage;
            this.asyncPipe = new common.AsyncPipe(cdr);
        }
        GetDownloadURLPipe.prototype.transform = function (path) {
            if (path !== this.path) {
                this.path = path;
                this.downloadUrl$ = this.storage.ref(path).getDownloadURL();
            }
            return this.asyncPipe.transform(this.downloadUrl$);
        };
        GetDownloadURLPipe.prototype.ngOnDestroy = function () {
            this.asyncPipe.ngOnDestroy();
        };
        return GetDownloadURLPipe;
    }());
    GetDownloadURLPipe.decorators = [
        { type: i0.Pipe, args: [{
                    name: 'getDownloadURL',
                    pure: false,
                },] }
    ];
    /** @nocollapse */
    GetDownloadURLPipe.ctorParameters = function () { return [
        { type: AngularFireStorage },
        { type: i0.ChangeDetectorRef }
    ]; };
    var GetDownloadURLPipeModule = /** @class */ (function () {
        function GetDownloadURLPipeModule() {
        }
        return GetDownloadURLPipeModule;
    }());
    GetDownloadURLPipeModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [GetDownloadURLPipe],
                    exports: [GetDownloadURLPipe],
                },] }
    ];

    var AngularFireStorageModule = /** @class */ (function () {
        function AngularFireStorageModule() {
        }
        return AngularFireStorageModule;
    }());
    AngularFireStorageModule.decorators = [
        { type: i0.NgModule, args: [{
                    exports: [GetDownloadURLPipeModule],
                    providers: [AngularFireStorage]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AngularFireStorage = AngularFireStorage;
    exports.AngularFireStorageModule = AngularFireStorageModule;
    exports.BUCKET = BUCKET;
    exports.GetDownloadURLPipe = GetDownloadURLPipe;
    exports.GetDownloadURLPipeModule = GetDownloadURLPipeModule;
    exports.MAX_OPERATION_RETRY_TIME = MAX_OPERATION_RETRY_TIME;
    exports.MAX_UPLOAD_RETRY_TIME = MAX_UPLOAD_RETRY_TIME;
    exports.createStorageRef = createStorageRef;
    exports.createUploadTask = createUploadTask;
    exports.fromTask = fromTask;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-fire-storage.umd.js.map
