import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { AngularFireAnalytics } from './analytics';
import { AngularFireAuth } from '@angular/fire/auth';
export class UserTrackingService {
    // TODO a user properties injector
    constructor(analytics, 
    // tslint:disable-next-line:ban-types
    platformId, auth, zone) {
        this.disposables = [];
        if (!isPlatformServer(platformId)) {
            let resolveInitialized;
            this.initialized = zone.runOutsideAngular(() => new Promise(resolve => resolveInitialized = resolve));
            this.disposables = [
                auth.authState.subscribe(user => {
                    analytics.setUserId(user === null || user === void 0 ? void 0 : user.uid);
                    resolveInitialized();
                }),
                auth.credential.subscribe(credential => {
                    if (credential) {
                        const method = credential.user.isAnonymous ? 'anonymous' : credential.additionalUserInfo.providerId;
                        if (credential.additionalUserInfo.isNewUser) {
                            analytics.logEvent('sign_up', { method });
                        }
                        analytics.logEvent('login', { method });
                    }
                })
            ];
        }
        else {
            this.initialized = Promise.resolve();
        }
    }
    ngOnDestroy() {
        this.disposables.forEach(it => it.unsubscribe());
    }
}
UserTrackingService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
UserTrackingService.ctorParameters = () => [
    { type: AngularFireAnalytics },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: AngularFireAuth },
    { type: NgZone }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci10cmFja2luZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FuYWx5dGljcy91c2VyLXRyYWNraW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFhLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBSXJELE1BQU0sT0FBTyxtQkFBbUI7SUFLOUIsa0NBQWtDO0lBQ2xDLFlBQ0UsU0FBK0I7SUFDL0IscUNBQXFDO0lBQ2hCLFVBQWtCLEVBQ3ZDLElBQXFCLEVBQ3JCLElBQVk7UUFSTixnQkFBVyxHQUF3QixFQUFFLENBQUM7UUFXNUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2pDLElBQUksa0JBQWtCLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RHLElBQUksQ0FBQyxXQUFXLEdBQUc7Z0JBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzlCLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMvQixrQkFBa0IsRUFBRSxDQUFDO2dCQUN2QixDQUFDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ3JDLElBQUksVUFBVSxFQUFFO3dCQUNkLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7d0JBQ3BHLElBQUksVUFBVSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRTs0QkFDM0MsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO3lCQUMzQzt3QkFDRCxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7cUJBQ3pDO2dCQUNILENBQUMsQ0FBQzthQUNMLENBQUM7U0FDSDthQUFNO1lBQ0wsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDdEM7SUFFSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQzs7O1lBekNGLFVBQVU7Ozs7WUFKRixvQkFBb0I7WUFjUSxNQUFNLHVCQUF0QyxNQUFNLFNBQUMsV0FBVztZQWJkLGVBQWU7WUFGSyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE5nWm9uZSwgT25EZXN0cm95LCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5ndWxhckZpcmVBbmFseXRpY3MgfSBmcm9tICcuL2FuYWx5dGljcyc7XG5pbXBvcnQgeyBBbmd1bGFyRmlyZUF1dGggfSBmcm9tICdAYW5ndWxhci9maXJlL2F1dGgnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBVc2VyVHJhY2tpbmdTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcblxuICBpbml0aWFsaXplZDogUHJvbWlzZTx2b2lkPjtcbiAgcHJpdmF0ZSBkaXNwb3NhYmxlczogQXJyYXk8U3Vic2NyaXB0aW9uPiA9IFtdO1xuXG4gIC8vIFRPRE8gYSB1c2VyIHByb3BlcnRpZXMgaW5qZWN0b3JcbiAgY29uc3RydWN0b3IoXG4gICAgYW5hbHl0aWNzOiBBbmd1bGFyRmlyZUFuYWx5dGljcyxcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6YmFuLXR5cGVzXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgIGF1dGg6IEFuZ3VsYXJGaXJlQXV0aCxcbiAgICB6b25lOiBOZ1pvbmUsXG4gICkge1xuXG4gICAgaWYgKCFpc1BsYXRmb3JtU2VydmVyKHBsYXRmb3JtSWQpKSB7XG4gICAgICBsZXQgcmVzb2x2ZUluaXRpYWxpemVkO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlSW5pdGlhbGl6ZWQgPSByZXNvbHZlKSk7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzID0gW1xuICAgICAgICAgIGF1dGguYXV0aFN0YXRlLnN1YnNjcmliZSh1c2VyID0+IHtcbiAgICAgICAgICAgIGFuYWx5dGljcy5zZXRVc2VySWQodXNlcj8udWlkKTtcbiAgICAgICAgICAgIHJlc29sdmVJbml0aWFsaXplZCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGF1dGguY3JlZGVudGlhbC5zdWJzY3JpYmUoY3JlZGVudGlhbCA9PiB7XG4gICAgICAgICAgICBpZiAoY3JlZGVudGlhbCkge1xuICAgICAgICAgICAgICBjb25zdCBtZXRob2QgPSBjcmVkZW50aWFsLnVzZXIuaXNBbm9ueW1vdXMgPyAnYW5vbnltb3VzJyA6IGNyZWRlbnRpYWwuYWRkaXRpb25hbFVzZXJJbmZvLnByb3ZpZGVySWQ7XG4gICAgICAgICAgICAgIGlmIChjcmVkZW50aWFsLmFkZGl0aW9uYWxVc2VySW5mby5pc05ld1VzZXIpIHtcbiAgICAgICAgICAgICAgICBhbmFseXRpY3MubG9nRXZlbnQoJ3NpZ25fdXAnLCB7IG1ldGhvZCB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhbmFseXRpY3MubG9nRXZlbnQoJ2xvZ2luJywgeyBtZXRob2QgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZm9yRWFjaChpdCA9PiBpdC51bnN1YnNjcmliZSgpKTtcbiAgfVxufVxuIl19