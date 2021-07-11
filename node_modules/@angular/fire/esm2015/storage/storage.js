import { Inject, Injectable, InjectionToken, NgZone, Optional, PLATFORM_ID } from '@angular/core';
import { createStorageRef } from './ref';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS, ɵAngularFireSchedulers, ɵfetchInstance, ɵfirebaseAppFactory, ɵkeepUnstableUntilFirstFactory } from '@angular/fire';
import 'firebase/storage';
import * as i0 from "@angular/core";
import * as i1 from "@angular/fire";
export const BUCKET = new InjectionToken('angularfire2.storageBucket');
export const MAX_UPLOAD_RETRY_TIME = new InjectionToken('angularfire2.storage.maxUploadRetryTime');
export const MAX_OPERATION_RETRY_TIME = new InjectionToken('angularfire2.storage.maxOperationRetryTime');
/**
 * AngularFireStorage Service
 *
 * This service is the main entry point for this feature module. It provides
 * an API for uploading and downloading binary files from Cloud Storage for
 * Firebase.
 */
export class AngularFireStorage {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zdG9yYWdlL3N0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUV6QyxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGdCQUFnQixFQUdoQixzQkFBc0IsRUFDdEIsY0FBYyxFQUNkLG1CQUFtQixFQUNuQiw4QkFBOEIsRUFDL0IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxrQkFBa0IsQ0FBQzs7O0FBRzFCLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBUyw0QkFBNEIsQ0FBQyxDQUFDO0FBQy9FLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUFTLHlDQUF5QyxDQUFDLENBQUM7QUFDM0csTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxjQUFjLENBQVMsNENBQTRDLENBQUMsQ0FBQztBQUVqSDs7Ozs7O0dBTUc7QUFJSCxNQUFNLE9BQU8sa0JBQWtCO0lBTTdCLFlBQzRCLE9BQXdCLEVBQ1gsWUFBMkQsRUFDdEUsYUFBNEI7SUFDeEQscUNBQXFDO0lBQ2hCLFVBQWtCLEVBQ3ZDLElBQVksRUFDK0Isa0JBQWdDLEVBQzdCLHFCQUFtQztRQUVqRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLDhCQUE4QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5RSxNQUFNLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksWUFBWSxhQUFhLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO1lBQ3BHLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RGLElBQUksa0JBQWtCLEVBQUU7Z0JBQ3RCLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QsSUFBSSxxQkFBcUIsRUFBRTtnQkFDekIsT0FBTyxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDLENBQUM7YUFDekQ7WUFDRCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFZO1FBQ2QsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBWTtRQUNyQixPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDdkcsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFZLEVBQUUsSUFBUyxFQUFFLFFBQXlCO1FBQ3ZELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLE1BQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3ZGLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakMsQ0FBQzs7OztZQS9DRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLEtBQUs7YUFDbEI7Ozs7NENBUUksTUFBTSxTQUFDLGdCQUFnQjs0Q0FDdkIsUUFBUSxZQUFJLE1BQU0sU0FBQyxpQkFBaUI7eUNBQ3BDLFFBQVEsWUFBSSxNQUFNLFNBQUMsTUFBTTtZQUVPLE1BQU0sdUJBQXRDLE1BQU0sU0FBQyxXQUFXO1lBMUNzQixNQUFNOzRDQTRDOUMsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7NENBQ3hDLFFBQVEsWUFBSSxNQUFNLFNBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgTmdab25lLCBPcHRpb25hbCwgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNyZWF0ZVN0b3JhZ2VSZWYgfSBmcm9tICcuL3JlZic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBGSVJFQkFTRV9BUFBfTkFNRSxcbiAgRklSRUJBU0VfT1BUSU9OUyxcbiAgRmlyZWJhc2VBcHBDb25maWcsXG4gIEZpcmViYXNlT3B0aW9ucyxcbiAgybVBbmd1bGFyRmlyZVNjaGVkdWxlcnMsXG4gIMm1ZmV0Y2hJbnN0YW5jZSxcbiAgybVmaXJlYmFzZUFwcEZhY3RvcnksXG4gIMm1a2VlcFVuc3RhYmxlVW50aWxGaXJzdEZhY3Rvcnlcbn0gZnJvbSAnQGFuZ3VsYXIvZmlyZSc7XG5pbXBvcnQgeyBVcGxvYWRNZXRhZGF0YSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgJ2ZpcmViYXNlL3N0b3JhZ2UnO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlL2FwcCc7XG5cbmV4cG9ydCBjb25zdCBCVUNLRVQgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignYW5ndWxhcmZpcmUyLnN0b3JhZ2VCdWNrZXQnKTtcbmV4cG9ydCBjb25zdCBNQVhfVVBMT0FEX1JFVFJZX1RJTUUgPSBuZXcgSW5qZWN0aW9uVG9rZW48bnVtYmVyPignYW5ndWxhcmZpcmUyLnN0b3JhZ2UubWF4VXBsb2FkUmV0cnlUaW1lJyk7XG5leHBvcnQgY29uc3QgTUFYX09QRVJBVElPTl9SRVRSWV9USU1FID0gbmV3IEluamVjdGlvblRva2VuPG51bWJlcj4oJ2FuZ3VsYXJmaXJlMi5zdG9yYWdlLm1heE9wZXJhdGlvblJldHJ5VGltZScpO1xuXG4vKipcbiAqIEFuZ3VsYXJGaXJlU3RvcmFnZSBTZXJ2aWNlXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IGZvciB0aGlzIGZlYXR1cmUgbW9kdWxlLiBJdCBwcm92aWRlc1xuICogYW4gQVBJIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGJpbmFyeSBmaWxlcyBmcm9tIENsb3VkIFN0b3JhZ2UgZm9yXG4gKiBGaXJlYmFzZS5cbiAqL1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAnYW55J1xufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlyZVN0b3JhZ2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgc3RvcmFnZTogZmlyZWJhc2Uuc3RvcmFnZS5TdG9yYWdlO1xuXG4gIHB1YmxpYyByZWFkb25seSBrZWVwVW5zdGFibGVVbnRpbEZpcnN0OiA8VD4ob2JzOiBPYnNlcnZhYmxlPFQ+KSA9PiBPYnNlcnZhYmxlPFQ+O1xuICBwdWJsaWMgcmVhZG9ubHkgc2NoZWR1bGVyczogybVBbmd1bGFyRmlyZVNjaGVkdWxlcnM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChGSVJFQkFTRV9PUFRJT05TKSBvcHRpb25zOiBGaXJlYmFzZU9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChGSVJFQkFTRV9BUFBfTkFNRSkgbmFtZU9yQ29uZmlnOiBzdHJpbmcgfCBGaXJlYmFzZUFwcENvbmZpZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChCVUNLRVQpIHN0b3JhZ2VCdWNrZXQ6IHN0cmluZyB8IG51bGwsXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhbi10eXBlc1xuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICB6b25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVhfVVBMT0FEX1JFVFJZX1RJTUUpIG1heFVwbG9hZFJldHJ5VGltZTogbnVtYmVyIHwgYW55LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFYX09QRVJBVElPTl9SRVRSWV9USU1FKSBtYXhPcGVyYXRpb25SZXRyeVRpbWU6IG51bWJlciB8IGFueSxcbiAgKSB7XG4gICAgdGhpcy5zY2hlZHVsZXJzID0gbmV3IMm1QW5ndWxhckZpcmVTY2hlZHVsZXJzKHpvbmUpO1xuICAgIHRoaXMua2VlcFVuc3RhYmxlVW50aWxGaXJzdCA9IMm1a2VlcFVuc3RhYmxlVW50aWxGaXJzdEZhY3RvcnkodGhpcy5zY2hlZHVsZXJzKTtcbiAgICBjb25zdCBhcHAgPSDJtWZpcmViYXNlQXBwRmFjdG9yeShvcHRpb25zLCB6b25lLCBuYW1lT3JDb25maWcpO1xuXG4gICAgdGhpcy5zdG9yYWdlID0gybVmZXRjaEluc3RhbmNlKGAke2FwcC5uYW1lfS5zdG9yYWdlLiR7c3RvcmFnZUJ1Y2tldH1gLCAnQW5ndWxhckZpcmVTdG9yYWdlJywgYXBwLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yYWdlID0gem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiBhcHAuc3RvcmFnZShzdG9yYWdlQnVja2V0IHx8IHVuZGVmaW5lZCkpO1xuICAgICAgaWYgKG1heFVwbG9hZFJldHJ5VGltZSkge1xuICAgICAgICBzdG9yYWdlLnNldE1heFVwbG9hZFJldHJ5VGltZShtYXhVcGxvYWRSZXRyeVRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heE9wZXJhdGlvblJldHJ5VGltZSkge1xuICAgICAgICBzdG9yYWdlLnNldE1heE9wZXJhdGlvblJldHJ5VGltZShtYXhPcGVyYXRpb25SZXRyeVRpbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0b3JhZ2U7XG4gICAgfSwgW21heFVwbG9hZFJldHJ5VGltZSwgbWF4T3BlcmF0aW9uUmV0cnlUaW1lXSk7XG4gIH1cblxuICByZWYocGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVN0b3JhZ2VSZWYodGhpcy5zdG9yYWdlLnJlZihwYXRoKSwgdGhpcy5zY2hlZHVsZXJzLCB0aGlzLmtlZXBVbnN0YWJsZVVudGlsRmlyc3QpO1xuICB9XG5cbiAgcmVmRnJvbVVSTChwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY3JlYXRlU3RvcmFnZVJlZih0aGlzLnN0b3JhZ2UucmVmRnJvbVVSTChwYXRoKSwgdGhpcy5zY2hlZHVsZXJzLCB0aGlzLmtlZXBVbnN0YWJsZVVudGlsRmlyc3QpO1xuICB9XG5cbiAgdXBsb2FkKHBhdGg6IHN0cmluZywgZGF0YTogYW55LCBtZXRhZGF0YT86IFVwbG9hZE1ldGFkYXRhKSB7XG4gICAgY29uc3Qgc3RvcmFnZVJlZiA9IHRoaXMuc3RvcmFnZS5yZWYocGF0aCk7XG4gICAgY29uc3QgcmVmID0gY3JlYXRlU3RvcmFnZVJlZihzdG9yYWdlUmVmLCB0aGlzLnNjaGVkdWxlcnMsIHRoaXMua2VlcFVuc3RhYmxlVW50aWxGaXJzdCk7XG4gICAgcmV0dXJuIHJlZi5wdXQoZGF0YSwgbWV0YWRhdGEpO1xuICB9XG5cbn1cbiJdfQ==