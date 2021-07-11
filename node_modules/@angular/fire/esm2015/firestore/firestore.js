import { Inject, Injectable, InjectionToken, NgZone, Optional, PLATFORM_ID } from '@angular/core';
import { from, of } from 'rxjs';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
import { AngularFirestoreCollectionGroup } from './collection-group/collection-group';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS, ɵAngularFireSchedulers, ɵfirebaseAppFactory, ɵkeepUnstableUntilFirstFactory } from '@angular/fire';
import { isPlatformServer } from '@angular/common';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { ɵfetchInstance, ɵlogAuthEmulatorError } from '@angular/fire';
import * as i0 from "@angular/core";
import * as i1 from "@angular/fire";
import * as i2 from "@angular/fire/auth";
/**
 * The value of this token determines whether or not the firestore will have persistance enabled
 */
export const ENABLE_PERSISTENCE = new InjectionToken('angularfire2.enableFirestorePersistence');
export const PERSISTENCE_SETTINGS = new InjectionToken('angularfire2.firestore.persistenceSettings');
export const SETTINGS = new InjectionToken('angularfire2.firestore.settings');
export const USE_EMULATOR = new InjectionToken('angularfire2.firestore.use-emulator');
/**
 * A utility methods for associating a collection reference with
 * a query.
 *
 * @param collectionRef - A collection reference to query
 * @param queryFn - The callback to create a query
 *
 * Example:
 * const { query, ref } = associateQuery(docRef.collection('items'), ref => {
 *  return ref.where('age', '<', 200);
 * });
 */
export function associateQuery(collectionRef, queryFn = ref => ref) {
    const query = queryFn(collectionRef);
    const ref = collectionRef;
    return { query, ref };
}
/**
 * AngularFirestore Service
 *
 * This service is the main entry point for this feature module. It provides
 * an API for creating Collection and Reference services. These services can
 * then be used to do data updates and observable streams of the data.
 *
 * Example:
 *
 * import { Component } from '@angular/core';
 * import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
 * import { Observable } from 'rxjs/Observable';
 * import { from } from 'rxjs/observable';
 *
 * @Component({
 *   selector: 'app-my-component',
 *   template: `
 *    <h2>Items for {{ (profile | async)?.name }}
 *    <ul>
 *       <li *ngFor="let item of items | async">{{ item.name }}</li>
 *    </ul>
 *    <div class="control-input">
 *       <input type="text" #itemname />
 *       <button (click)="addItem(itemname.value)">Add Item</button>
 *    </div>
 *   `
 * })
 * export class MyComponent implements OnInit {
 *
 *   // services for data operations and data streaming
 *   private readonly itemsRef: AngularFirestoreCollection<Item>;
 *   private readonly profileRef: AngularFirestoreDocument<Profile>;
 *
 *   // observables for template
 *   items: Observable<Item[]>;
 *   profile: Observable<Profile>;
 *
 *   // inject main service
 *   constructor(private readonly afs: AngularFirestore) {}
 *
 *   ngOnInit() {
 *     this.itemsRef = afs.collection('items', ref => ref.where('user', '==', 'davideast').limit(10));
 *     this.items = this.itemsRef.valueChanges().map(snap => snap.docs.map(data => doc.data()));
 *     // this.items = from(this.itemsRef); // you can also do this with no mapping
 *
 *     this.profileRef = afs.doc('users/davideast');
 *     this.profile = this.profileRef.valueChanges();
 *   }
 *
 *   addItem(name: string) {
 *     const user = 'davideast';
 *     this.itemsRef.add({ name, user });
 *   }
 * }
 */
export class AngularFirestore {
    /**
     * Each Feature of AngularFire has a FirebaseApp injected. This way we
     * don't rely on the main Firebase App instance and we can create named
     * apps and use multiple apps.
     */
    constructor(options, nameOrConfig, shouldEnablePersistence, settings, 
    // tslint:disable-next-line:ban-types
    platformId, zone, persistenceSettings, _useEmulator, useAuthEmulator) {
        this.schedulers = new ɵAngularFireSchedulers(zone);
        this.keepUnstableUntilFirst = ɵkeepUnstableUntilFirstFactory(this.schedulers);
        const app = ɵfirebaseAppFactory(options, zone, nameOrConfig);
        if (!firebase.auth && useAuthEmulator) {
            ɵlogAuthEmulatorError();
        }
        const useEmulator = _useEmulator;
        [this.firestore, this.persistenceEnabled$] = ɵfetchInstance(`${app.name}.firestore`, 'AngularFirestore', app, () => {
            const firestore = zone.runOutsideAngular(() => app.firestore());
            if (settings) {
                firestore.settings(settings);
            }
            if (useEmulator) {
                firestore.useEmulator(...useEmulator);
            }
            if (shouldEnablePersistence && !isPlatformServer(platformId)) {
                // We need to try/catch here because not all enablePersistence() failures are caught
                // https://github.com/firebase/firebase-js-sdk/issues/608
                const enablePersistence = () => {
                    try {
                        return from(firestore.enablePersistence(persistenceSettings || undefined).then(() => true, () => false));
                    }
                    catch (e) {
                        if (typeof console !== 'undefined') {
                            console.warn(e);
                        }
                        return of(false);
                    }
                };
                return [firestore, zone.runOutsideAngular(enablePersistence)];
            }
            else {
                return [firestore, of(false)];
            }
        }, [settings, useEmulator, shouldEnablePersistence]);
    }
    collection(pathOrRef, queryFn) {
        let collectionRef;
        if (typeof pathOrRef === 'string') {
            collectionRef = this.firestore.collection(pathOrRef);
        }
        else {
            collectionRef = pathOrRef;
        }
        const { ref, query } = associateQuery(collectionRef, queryFn);
        const refInZone = this.schedulers.ngZone.run(() => ref);
        return new AngularFirestoreCollection(refInZone, query, this);
    }
    /**
     * Create a reference to a Firestore Collection Group based on a collectionId
     * and an optional query function to narrow the result
     * set.
     */
    collectionGroup(collectionId, queryGroupFn) {
        const queryFn = queryGroupFn || (ref => ref);
        const collectionGroup = this.firestore.collectionGroup(collectionId);
        return new AngularFirestoreCollectionGroup(queryFn(collectionGroup), this);
    }
    doc(pathOrRef) {
        let ref;
        if (typeof pathOrRef === 'string') {
            ref = this.firestore.doc(pathOrRef);
        }
        else {
            ref = pathOrRef;
        }
        const refInZone = this.schedulers.ngZone.run(() => ref);
        return new AngularFirestoreDocument(refInZone, this);
    }
    /**
     * Returns a generated Firestore Document Id.
     */
    createId() {
        return this.firestore.collection('_').doc().id;
    }
}
/** @nocollapse */ AngularFirestore.ɵprov = i0.ɵɵdefineInjectable({ factory: function AngularFirestore_Factory() { return new AngularFirestore(i0.ɵɵinject(i1.FIREBASE_OPTIONS), i0.ɵɵinject(i1.FIREBASE_APP_NAME, 8), i0.ɵɵinject(ENABLE_PERSISTENCE, 8), i0.ɵɵinject(SETTINGS, 8), i0.ɵɵinject(i0.PLATFORM_ID), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(PERSISTENCE_SETTINGS, 8), i0.ɵɵinject(USE_EMULATOR, 8), i0.ɵɵinject(i2.USE_EMULATOR, 8)); }, token: AngularFirestore, providedIn: "any" });
AngularFirestore.decorators = [
    { type: Injectable, args: [{
                providedIn: 'any'
            },] }
];
/** @nocollapse */
AngularFirestore.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [FIREBASE_OPTIONS,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FIREBASE_APP_NAME,] }] },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [ENABLE_PERSISTENCE,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [SETTINGS,] }] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [PERSISTENCE_SETTINGS,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [USE_EMULATOR,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [USE_AUTH_EMULATOR,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZXN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ZpcmVzdG9yZS9maXJlc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxJQUFJLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBVzVDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9ELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3RGLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsZ0JBQWdCLEVBR2hCLHNCQUFzQixFQUN0QixtQkFBbUIsRUFDbkIsOEJBQThCLEVBRS9CLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sUUFBUSxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBRSxZQUFZLElBQUksaUJBQWlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN2RSxPQUFPLEVBQUUsY0FBYyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBRXRFOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxjQUFjLENBQVUseUNBQXlDLENBQUMsQ0FBQztBQUN6RyxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLGNBQWMsQ0FBa0MsNENBQTRDLENBQUMsQ0FBQztBQUN0SSxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFjLENBQVcsaUNB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QVMsQ0FBQztTQUNqQjtRQUNELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksd0JBQXdCLENBQUksU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNqRCxDQUFDOzs7O1lBdkhGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsS0FBSzthQUNsQjs7Ozs0Q0FhSSxNQUFNLFNBQUMsZ0JBQWdCOzRDQUN2QixRQUFRLFlBQUksTUFBTSxTQUFDLGlCQUFpQjswQ0FDcEMsUUFBUSxZQUFJLE1BQU0sU0FBQyxrQkFBa0I7NENBQ3JDLFFBQVEsWUFBSSxNQUFNLFNBQUMsUUFBUTtZQUVLLE1BQU0sdUJBQXRDLE1BQU0sU0FBQyxXQUFXO1lBL0lzQixNQUFNOzRDQWlKOUMsUUFBUSxZQUFJLE1BQU0sU0FBQyxvQkFBb0I7NENBQ3ZDLFFBQVEsWUFBSSxNQUFNLFNBQUMsWUFBWTs0Q0FDL0IsUUFBUSxZQUFJLE1BQU0sU0FBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBOZ1pvbmUsIE9wdGlvbmFsLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbSwgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIEFzc29jaWF0ZWRSZWZlcmVuY2UsXG4gIENvbGxlY3Rpb25SZWZlcmVuY2UsXG4gIERvY3VtZW50UmVmZXJlbmNlLFxuICBQZXJzaXN0ZW5jZVNldHRpbmdzLFxuICBRdWVyeSxcbiAgUXVlcnlGbixcbiAgUXVlcnlHcm91cEZuLFxuICBTZXR0aW5nc1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgQW5ndWxhckZpcmVzdG9yZURvY3VtZW50IH0gZnJvbSAnLi9kb2N1bWVudC9kb2N1bWVudCc7XG5pbXBvcnQgeyBBbmd1bGFyRmlyZXN0b3JlQ29sbGVjdGlvbiB9IGZyb20gJy4vY29sbGVjdGlvbi9jb2xsZWN0aW9uJztcbmltcG9ydCB7IEFuZ3VsYXJGaXJlc3RvcmVDb2xsZWN0aW9uR3JvdXAgfSBmcm9tICcuL2NvbGxlY3Rpb24tZ3JvdXAvY29sbGVjdGlvbi1ncm91cCc7XG5pbXBvcnQge1xuICBGSVJFQkFTRV9BUFBfTkFNRSxcbiAgRklSRUJBU0VfT1BUSU9OUyxcbiAgRmlyZWJhc2VBcHBDb25maWcsXG4gIEZpcmViYXNlT3B0aW9ucyxcbiAgybVBbmd1bGFyRmlyZVNjaGVkdWxlcnMsXG4gIMm1ZmlyZWJhc2VBcHBGYWN0b3J5LFxuICDJtWtlZXBVbnN0YWJsZVVudGlsRmlyc3RGYWN0b3J5LFxuICBGaXJlYmFzZUFwcFxufSBmcm9tICdAYW5ndWxhci9maXJlJztcbmltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlL2FwcCc7XG5pbXBvcnQgJ2ZpcmViYXNlL2ZpcmVzdG9yZSc7XG5pbXBvcnQgeyBVU0VfRU1VTEFUT1IgYXMgVVNFX0FVVEhfRU1VTEFUT1IgfSBmcm9tICdAYW5ndWxhci9maXJlL2F1dGgnO1xuaW1wb3J0IHsgybVmZXRjaEluc3RhbmNlLCDJtWxvZ0F1dGhFbXVsYXRvckVycm9yIH0gZnJvbSAnQGFuZ3VsYXIvZmlyZSc7XG5cbi8qKlxuICogVGhlIHZhbHVlIG9mIHRoaXMgdG9rZW4gZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgZmlyZXN0b3JlIHdpbGwgaGF2ZSBwZXJzaXN0YW5jZSBlbmFibGVkXG4gKi9cbmV4cG9ydCBjb25zdCBFTkFCTEVfUEVSU0lTVEVOQ0UgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ2FuZ3VsYXJmaXJlMi5lbmFibGVGaXJlc3RvcmVQZXJzaXN0ZW5jZScpO1xuZXhwb3J0IGNvbnN0IFBFUlNJU1RFTkNFX1NFVFRJTkdTID0gbmV3IEluamVjdGlvblRva2VuPFBlcnNpc3RlbmNlU2V0dGluZ3MgfCB1bmRlZmluZWQ+KCdhbmd1bGFyZmlyZTIuZmlyZXN0b3JlLnBlcnNpc3RlbmNlU2V0dGluZ3MnKTtcbmV4cG9ydCBjb25zdCBTRVRUSU5HUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTZXR0aW5ncz4oJ2FuZ3VsYXJmaXJlMi5maXJlc3RvcmUuc2V0dGluZ3MnKTtcblxuLy8gU0VNVkVSKDcpOiB1c2UgUGFyYW1ldGVycyB0byBkZXRpcm1pbmUgdGhlIHVzZUVtdWxhdG9yIGFyZ3VtZW50c1xuLy8gdHlwZSBVc2VFbXVsYXRvckFyZ3VtZW50cyA9IFBhcmFtZXRlcnM8dHlwZW9mIGZpcmViYXNlLmZpcmVzdG9yZS5GaXJlc3RvcmUucHJvdG90eXBlLnVzZUVtdWxhdG9yPjtcbnR5cGUgVXNlRW11bGF0b3JBcmd1bWVudHMgPSBbc3RyaW5nLCBudW1iZXJdO1xuZXhwb3J0IGNvbnN0IFVTRV9FTVVMQVRPUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxVc2VFbXVsYXRvckFyZ3VtZW50cz4oJ2FuZ3VsYXJmaXJlMi5maXJlc3RvcmUudXNlLWVtdWxhdG9yJyk7XG5cbi8qKlxuICogQSB1dGlsaXR5IG1ldGhvZHMgZm9yIGFzc29jaWF0aW5nIGEgY29sbGVjdGlvbiByZWZlcmVuY2Ugd2l0aFxuICogYSBxdWVyeS5cbiAqXG4gKiBAcGFyYW0gY29sbGVjdGlvblJlZiAtIEEgY29sbGVjdGlvbiByZWZlcmVuY2UgdG8gcXVlcnlcbiAqIEBwYXJhbSBxdWVyeUZuIC0gVGhlIGNhbGxiYWNrIHRvIGNyZWF0ZSBhIHF1ZXJ5XG4gKlxuICogRXhhbXBsZTpcbiAqIGNvbnN0IHsgcXVlcnksIHJlZiB9ID0gYXNzb2NpYXRlUXVlcnkoZG9jUmVmLmNvbGxlY3Rpb24oJ2l0ZW1zJyksIHJlZiA9PiB7XG4gKiAgcmV0dXJuIHJlZi53aGVyZSgnYWdlJywgJzwnLCAyMDApO1xuICogfSk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NvY2lhdGVRdWVyeTxUPihjb2xsZWN0aW9uUmVmOiBDb2xsZWN0aW9uUmVmZXJlbmNlPFQ+LCBxdWVyeUZuID0gcmVmID0+IHJlZik6IEFzc29jaWF0ZWRSZWZlcmVuY2U8VD4ge1xuICBjb25zdCBxdWVyeSA9IHF1ZXJ5Rm4oY29sbGVjdGlvblJlZik7XG4gIGNvbnN0IHJlZiA9IGNvbGxlY3Rpb25SZWY7XG4gIHJldHVybiB7IHF1ZXJ5LCByZWYgfTtcbn1cblxudHlwZSBJbnN0YW5jZUNhY2hlID0gTWFwPEZpcmViYXNlQXBwLCBbXG4gIGZpcmViYXNlLmZpcmVzdG9yZS5GaXJlc3RvcmUsXG4gIGZpcmViYXNlLmZpcmVzdG9yZS5TZXR0aW5ncyB8IG51bGwsXG4gIFVzZUVtdWxhdG9yQXJndW1lbnRzIHwgbnVsbCxcbiAgYm9vbGVhbiB8IG51bGxdXG4+O1xuXG4vKipcbiAqIEFuZ3VsYXJGaXJlc3RvcmUgU2VydmljZVxuICpcbiAqIFRoaXMgc2VydmljZSBpcyB0aGUgbWFpbiBlbnRyeSBwb2ludCBmb3IgdGhpcyBmZWF0dXJlIG1vZHVsZS4gSXQgcHJvdmlkZXNcbiAqIGFuIEFQSSBmb3IgY3JlYXRpbmcgQ29sbGVjdGlvbiBhbmQgUmVmZXJlbmNlIHNlcnZpY2VzLiBUaGVzZSBzZXJ2aWNlcyBjYW5cbiAqIHRoZW4gYmUgdXNlZCB0byBkbyBkYXRhIHVwZGF0ZXMgYW5kIG9ic2VydmFibGUgc3RyZWFtcyBvZiB0aGUgZGF0YS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICogaW1wb3J0IHsgQW5ndWxhckZpcmVzdG9yZSwgQW5ndWxhckZpcmVzdG9yZUNvbGxlY3Rpb24sIEFuZ3VsYXJGaXJlc3RvcmVEb2N1bWVudCB9IGZyb20gJ0Bhbmd1bGFyL2ZpcmUvZmlyZXN0b3JlJztcbiAqIGltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuICogaW1wb3J0IHsgZnJvbSB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZSc7XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnYXBwLW15LWNvbXBvbmVudCcsXG4gKiAgIHRlbXBsYXRlOiBgXG4gKiAgICA8aDI+SXRlbXMgZm9yIHt7IChwcm9maWxlIHwgYXN5bmMpPy5uYW1lIH19XG4gKiAgICA8dWw+XG4gKiAgICAgICA8bGkgKm5nRm9yPVwibGV0IGl0ZW0gb2YgaXRlbXMgfCBhc3luY1wiPnt7IGl0ZW0ubmFtZSB9fTwvbGk+XG4gKiAgICA8L3VsPlxuICogICAgPGRpdiBjbGFzcz1cImNvbnRyb2wtaW5wdXRcIj5cbiAqICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiICNpdGVtbmFtZSAvPlxuICogICAgICAgPGJ1dHRvbiAoY2xpY2spPVwiYWRkSXRlbShpdGVtbmFtZS52YWx1ZSlcIj5BZGQgSXRlbTwvYnV0dG9uPlxuICogICAgPC9kaXY+XG4gKiAgIGBcbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICpcbiAqICAgLy8gc2VydmljZXMgZm9yIGRhdGEgb3BlcmF0aW9ucyBhbmQgZGF0YSBzdHJlYW1pbmdcbiAqICAgcHJpdmF0ZSByZWFkb25seSBpdGVtc1JlZjogQW5ndWxhckZpcmVzdG9yZUNvbGxlY3Rpb248SXRlbT47XG4gKiAgIHByaXZhdGUgcmVhZG9ubHkgcHJvZmlsZVJlZjogQW5ndWxhckZpcmVzdG9yZURvY3VtZW50PFByb2ZpbGU+O1xuICpcbiAqICAgLy8gb2JzZXJ2YWJsZXMgZm9yIHRlbXBsYXRlXG4gKiAgIGl0ZW1zOiBPYnNlcnZhYmxlPEl0ZW1bXT47XG4gKiAgIHByb2ZpbGU6IE9ic2VydmFibGU8UHJvZmlsZT47XG4gKlxuICogICAvLyBpbmplY3QgbWFpbiBzZXJ2aWNlXG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYWZzOiBBbmd1bGFyRmlyZXN0b3JlKSB7fVxuICpcbiAqICAgbmdPbkluaXQoKSB7XG4gKiAgICAgdGhpcy5pdGVtc1JlZiA9IGFmcy5jb2xsZWN0aW9uKCdpdGVtcycsIHJlZiA9PiByZWYud2hlcmUoJ3VzZXInLCAnPT0nLCAnZGF2aWRlYXN0JykubGltaXQoMTApKTtcbiAqICAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtc1JlZi52YWx1ZUNoYW5nZXMoKS5tYXAoc25hcCA9PiBzbmFwLmRvY3MubWFwKGRhdGEgPT4gZG9jLmRhdGEoKSkpO1xuICogICAgIC8vIHRoaXMuaXRlbXMgPSBmcm9tKHRoaXMuaXRlbXNSZWYpOyAvLyB5b3UgY2FuIGFsc28gZG8gdGhpcyB3aXRoIG5vIG1hcHBpbmdcbiAqXG4gKiAgICAgdGhpcy5wcm9maWxlUmVmID0gYWZzLmRvYygndXNlcnMvZGF2aWRlYXN0Jyk7XG4gKiAgICAgdGhpcy5wcm9maWxlID0gdGhpcy5wcm9maWxlUmVmLnZhbHVlQ2hhbmdlcygpO1xuICogICB9XG4gKlxuICogICBhZGRJdGVtKG5hbWU6IHN0cmluZykge1xuICogICAgIGNvbnN0IHVzZXIgPSAnZGF2aWRlYXN0JztcbiAqICAgICB0aGlzLml0ZW1zUmVmLmFkZCh7IG5hbWUsIHVzZXIgfSk7XG4gKiAgIH1cbiAqIH1cbiAqL1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAnYW55J1xufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlyZXN0b3JlIHtcbiAgcHVibGljIHJlYWRvbmx5IGZpcmVzdG9yZTogZmlyZWJhc2UuZmlyZXN0b3JlLkZpcmVzdG9yZTtcbiAgcHVibGljIHJlYWRvbmx5IHBlcnNpc3RlbmNlRW5hYmxlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gIHB1YmxpYyByZWFkb25seSBzY2hlZHVsZXJzOiDJtUFuZ3VsYXJGaXJlU2NoZWR1bGVycztcbiAgcHVibGljIHJlYWRvbmx5IGtlZXBVbnN0YWJsZVVudGlsRmlyc3Q6IDxUPihvYnM6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8VD47XG5cbiAgLyoqXG4gICAqIEVhY2ggRmVhdHVyZSBvZiBBbmd1bGFyRmlyZSBoYXMgYSBGaXJlYmFzZUFwcCBpbmplY3RlZC4gVGhpcyB3YXkgd2VcbiAgICogZG9uJ3QgcmVseSBvbiB0aGUgbWFpbiBGaXJlYmFzZSBBcHAgaW5zdGFuY2UgYW5kIHdlIGNhbiBjcmVhdGUgbmFtZWRcbiAgICogYXBwcyBhbmQgdXNlIG11bHRpcGxlIGFwcHMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KEZJUkVCQVNFX09QVElPTlMpIG9wdGlvbnM6IEZpcmViYXNlT3B0aW9ucyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEZJUkVCQVNFX0FQUF9OQU1FKSBuYW1lT3JDb25maWc6IHN0cmluZyB8IEZpcmViYXNlQXBwQ29uZmlnIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEVOQUJMRV9QRVJTSVNURU5DRSkgc2hvdWxkRW5hYmxlUGVyc2lzdGVuY2U6IGJvb2xlYW4gfCBudWxsLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoU0VUVElOR1MpIHNldHRpbmdzOiBTZXR0aW5ncyB8IG51bGwsXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhbi10eXBlc1xuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICB6b25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChQRVJTSVNURU5DRV9TRVRUSU5HUykgcGVyc2lzdGVuY2VTZXR0aW5nczogUGVyc2lzdGVuY2VTZXR0aW5ncyB8IG51bGwsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChVU0VfRU1VTEFUT1IpIF91c2VFbXVsYXRvcjogYW55LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoVVNFX0FVVEhfRU1VTEFUT1IpIHVzZUF1dGhFbXVsYXRvcjogYW55LFxuICApIHtcbiAgICB0aGlzLnNjaGVkdWxlcnMgPSBuZXcgybVBbmd1bGFyRmlyZVNjaGVkdWxlcnMoem9uZSk7XG4gICAgdGhpcy5rZWVwVW5zdGFibGVVbnRpbEZpcnN0ID0gybVrZWVwVW5zdGFibGVVbnRpbEZpcnN0RmFjdG9yeSh0aGlzLnNjaGVkdWxlcnMpO1xuXG4gICAgY29uc3QgYXBwID0gybVmaXJlYmFzZUFwcEZhY3Rvcnkob3B0aW9ucywgem9uZSwgbmFtZU9yQ29uZmlnKTtcbiAgICBpZiAoIWZpcmViYXNlLmF1dGggJiYgdXNlQXV0aEVtdWxhdG9yKSB7XG4gICAgICDJtWxvZ0F1dGhFbXVsYXRvckVycm9yKCk7XG4gICAgfVxuICAgIGNvbnN0IHVzZUVtdWxhdG9yOiBVc2VFbXVsYXRvckFyZ3VtZW50cyB8IG51bGwgPSBfdXNlRW11bGF0b3I7XG5cbiAgICBbdGhpcy5maXJlc3RvcmUsIHRoaXMucGVyc2lzdGVuY2VFbmFibGVkJF0gPSDJtWZldGNoSW5zdGFuY2UoYCR7YXBwLm5hbWV9LmZpcmVzdG9yZWAsICdBbmd1bGFyRmlyZXN0b3JlJywgYXBwLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaXJlc3RvcmUgPSB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IGFwcC5maXJlc3RvcmUoKSk7XG4gICAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgZmlyZXN0b3JlLnNldHRpbmdzKHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VFbXVsYXRvcikge1xuICAgICAgICBmaXJlc3RvcmUudXNlRW11bGF0b3IoLi4udXNlRW11bGF0b3IpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2hvdWxkRW5hYmxlUGVyc2lzdGVuY2UgJiYgIWlzUGxhdGZvcm1TZXJ2ZXIocGxhdGZvcm1JZCkpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byB0cnkvY2F0Y2ggaGVyZSBiZWNhdXNlIG5vdCBhbGwgZW5hYmxlUGVyc2lzdGVuY2UoKSBmYWlsdXJlcyBhcmUgY2F1Z2h0XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9maXJlYmFzZS9maXJlYmFzZS1qcy1zZGsvaXNzdWVzLzYwOFxuICAgICAgICBjb25zdCBlbmFibGVQZXJzaXN0ZW5jZSA9ICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb20oZmlyZXN0b3JlLmVuYWJsZVBlcnNpc3RlbmNlKHBlcnNpc3RlbmNlU2V0dGluZ3MgfHwgdW5kZWZpbmVkKS50aGVuKCgpID0+IHRydWUsICgpID0+IGZhbHNlKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykgeyBjb25zb2xlLndhcm4oZSk7IH1cbiAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gW2ZpcmVzdG9yZSwgem9uZS5ydW5PdXRzaWRlQW5ndWxhcihlbmFibGVQZXJzaXN0ZW5jZSldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtmaXJlc3RvcmUsIG9mKGZhbHNlKV07XG4gICAgICB9XG5cbiAgICB9LCBbc2V0dGluZ3MsIHVzZUVtdWxhdG9yLCBzaG91bGRFbmFibGVQZXJzaXN0ZW5jZV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHJlZmVyZW5jZSB0byBhIEZpcmVzdG9yZSBDb2xsZWN0aW9uIGJhc2VkIG9uIGEgcGF0aCBvclxuICAgKiBDb2xsZWN0aW9uUmVmZXJlbmNlIGFuZCBhbiBvcHRpb25hbCBxdWVyeSBmdW5jdGlvbiB0byBuYXJyb3cgdGhlIHJlc3VsdFxuICAgKiBzZXQuXG4gICAqL1xuICBjb2xsZWN0aW9uPFQ+KHBhdGg6IHN0cmluZywgcXVlcnlGbj86IFF1ZXJ5Rm4pOiBBbmd1bGFyRmlyZXN0b3JlQ29sbGVjdGlvbjxUPjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnVuaWZpZWQtc2lnbmF0dXJlc1xuICBjb2xsZWN0aW9uPFQ+KHJlZjogQ29sbGVjdGlvblJlZmVyZW5jZSwgcXVlcnlGbj86IFF1ZXJ5Rm4pOiBBbmd1bGFyRmlyZXN0b3JlQ29sbGVjdGlvbjxUPjtcbiAgY29sbGVjdGlvbjxUPihwYXRoT3JSZWY6IHN0cmluZyB8IENvbGxlY3Rpb25SZWZlcmVuY2U8VD4sIHF1ZXJ5Rm4/OiBRdWVyeUZuKTogQW5ndWxhckZpcmVzdG9yZUNvbGxlY3Rpb248VD4ge1xuICAgIGxldCBjb2xsZWN0aW9uUmVmOiBDb2xsZWN0aW9uUmVmZXJlbmNlPFQ+O1xuICAgIGlmICh0eXBlb2YgcGF0aE9yUmVmID09PSAnc3RyaW5nJykge1xuICAgICAgY29sbGVjdGlvblJlZiA9IHRoaXMuZmlyZXN0b3JlLmNvbGxlY3Rpb24ocGF0aE9yUmVmKSBhcyBmaXJlYmFzZS5maXJlc3RvcmUuQ29sbGVjdGlvblJlZmVyZW5jZTxUPjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvblJlZiA9IHBhdGhPclJlZjtcbiAgICB9XG4gICAgY29uc3QgeyByZWYsIHF1ZXJ5IH0gPSBhc3NvY2lhdGVRdWVyeTxUPihjb2xsZWN0aW9uUmVmLCBxdWVyeUZuKTtcbiAgICBjb25zdCByZWZJblpvbmUgPSB0aGlzLnNjaGVkdWxlcnMubmdab25lLnJ1bigoKSA9PiByZWYpO1xuICAgIHJldHVybiBuZXcgQW5ndWxhckZpcmVzdG9yZUNvbGxlY3Rpb248VD4ocmVmSW5ab25lLCBxdWVyeSwgdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgcmVmZXJlbmNlIHRvIGEgRmlyZXN0b3JlIENvbGxlY3Rpb24gR3JvdXAgYmFzZWQgb24gYSBjb2xsZWN0aW9uSWRcbiAgICogYW5kIGFuIG9wdGlvbmFsIHF1ZXJ5IGZ1bmN0aW9uIHRvIG5hcnJvdyB0aGUgcmVzdWx0XG4gICAqIHNldC5cbiAgICovXG4gIGNvbGxlY3Rpb25Hcm91cDxUPihjb2xsZWN0aW9uSWQ6IHN0cmluZywgcXVlcnlHcm91cEZuPzogUXVlcnlHcm91cEZuPFQ+KTogQW5ndWxhckZpcmVzdG9yZUNvbGxlY3Rpb25Hcm91cDxUPiB7XG4gICAgY29uc3QgcXVlcnlGbiA9IHF1ZXJ5R3JvdXBGbiB8fCAocmVmID0+IHJlZik7XG4gICAgY29uc3QgY29sbGVjdGlvbkdyb3VwOiBRdWVyeTxUPiA9IHRoaXMuZmlyZXN0b3JlLmNvbGxlY3Rpb25Hcm91cChjb2xsZWN0aW9uSWQpIGFzIGZpcmViYXNlLmZpcmVzdG9yZS5RdWVyeTxUPjtcbiAgICByZXR1cm4gbmV3IEFuZ3VsYXJGaXJlc3RvcmVDb2xsZWN0aW9uR3JvdXA8VD4ocXVlcnlGbihjb2xsZWN0aW9uR3JvdXApLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSByZWZlcmVuY2UgdG8gYSBGaXJlc3RvcmUgRG9jdW1lbnQgYmFzZWQgb24gYSBwYXRoIG9yXG4gICAqIERvY3VtZW50UmVmZXJlbmNlLiBOb3RlIHRoYXQgZG9jdW1lbnRzIGFyZSBub3QgcXVlcnlhYmxlIGJlY2F1c2UgdGhleSBhcmVcbiAgICogc2ltcGx5IG9iamVjdHMuIEhvd2V2ZXIsIGRvY3VtZW50cyBoYXZlIHN1Yi1jb2xsZWN0aW9ucyB0aGF0IHJldHVybiBhXG4gICAqIENvbGxlY3Rpb24gcmVmZXJlbmNlIGFuZCBjYW4gYmUgcXVlcmllZC5cbiAgICovXG4gIGRvYzxUPihwYXRoOiBzdHJpbmcpOiBBbmd1bGFyRmlyZXN0b3JlRG9jdW1lbnQ8VD47XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp1bmlmaWVkLXNpZ25hdHVyZXNcbiAgZG9jPFQ+KHJlZjogRG9jdW1lbnRSZWZlcmVuY2UpOiBBbmd1bGFyRmlyZXN0b3JlRG9jdW1lbnQ8VD47XG4gIGRvYzxUPihwYXRoT3JSZWY6IHN0cmluZyB8IERvY3VtZW50UmVmZXJlbmNlPFQ+KTogQW5ndWxhckZpcmVzdG9yZURvY3VtZW50PFQ+IHtcbiAgICBsZXQgcmVmOiBEb2N1bWVudFJlZmVyZW5jZTxUPjtcbiAgICBpZiAodHlwZW9mIHBhdGhPclJlZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlZiA9IHRoaXMuZmlyZXN0b3JlLmRvYyhwYXRoT3JSZWYpIGFzIGZpcmViYXNlLmZpcmVzdG9yZS5Eb2N1bWVudFJlZmVyZW5jZTxUPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVmID0gcGF0aE9yUmVmO1xuICAgIH1cbiAgICBjb25zdCByZWZJblpvbmUgPSB0aGlzLnNjaGVkdWxlcnMubmdab25lLnJ1bigoKSA9PiByZWYpO1xuICAgIHJldHVybiBuZXcgQW5ndWxhckZpcmVzdG9yZURvY3VtZW50PFQ+KHJlZkluWm9uZSwgdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGdlbmVyYXRlZCBGaXJlc3RvcmUgRG9jdW1lbnQgSWQuXG4gICAqL1xuICBjcmVhdGVJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5maXJlc3RvcmUuY29sbGVjdGlvbignXycpLmRvYygpLmlkO1xuICB9XG59XG4iXX0=