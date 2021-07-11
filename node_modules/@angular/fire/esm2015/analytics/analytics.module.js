import { NgModule, Optional } from '@angular/core';
import { ScreenTrackingService } from './screen-tracking.service';
import { AngularFireAnalytics } from './analytics';
import { UserTrackingService } from './user-tracking.service';
export class AngularFireAnalyticsModule {
    constructor(analytics, screenTracking, userTracking) {
        // calling anything on analytics will eagerly load the SDK
        // tslint:disable-next-line:no-unused-expression
        analytics.app.then(() => { });
    }
}
AngularFireAnalyticsModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireAnalytics]
            },] }
];
/** @nocollapse */
AngularFireAnalyticsModule.ctorParameters = () => [
    { type: AngularFireAnalytics },
    { type: ScreenTrackingService, decorators: [{ type: Optional }] },
    { type: UserTrackingService, decorators: [{ type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl0aWNzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hbmFseXRpY3MvYW5hbHl0aWNzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbkQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFLOUQsTUFBTSxPQUFPLDBCQUEwQjtJQUNyQyxZQUNFLFNBQStCLEVBQ25CLGNBQXFDLEVBQ3JDLFlBQWlDO1FBRTdDLDBEQUEwRDtRQUMxRCxnREFBZ0Q7UUFDaEQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7O1lBWkYsUUFBUSxTQUFDO2dCQUNSLFNBQVMsRUFBRSxDQUFFLG9CQUFvQixDQUFFO2FBQ3BDOzs7O1lBTFEsb0JBQW9CO1lBRHBCLHFCQUFxQix1QkFVekIsUUFBUTtZQVJKLG1CQUFtQix1QkFTdkIsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2NyZWVuVHJhY2tpbmdTZXJ2aWNlIH0gZnJvbSAnLi9zY3JlZW4tdHJhY2tpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBBbmd1bGFyRmlyZUFuYWx5dGljcyB9IGZyb20gJy4vYW5hbHl0aWNzJztcbmltcG9ydCB7IFVzZXJUcmFja2luZ1NlcnZpY2UgfSBmcm9tICcuL3VzZXItdHJhY2tpbmcuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogWyBBbmd1bGFyRmlyZUFuYWx5dGljcyBdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJGaXJlQW5hbHl0aWNzTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgYW5hbHl0aWNzOiBBbmd1bGFyRmlyZUFuYWx5dGljcyxcbiAgICBAT3B0aW9uYWwoKSBzY3JlZW5UcmFja2luZzogU2NyZWVuVHJhY2tpbmdTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHVzZXJUcmFja2luZzogVXNlclRyYWNraW5nU2VydmljZVxuICApIHtcbiAgICAvLyBjYWxsaW5nIGFueXRoaW5nIG9uIGFuYWx5dGljcyB3aWxsIGVhZ2VybHkgbG9hZCB0aGUgU0RLXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgYW5hbHl0aWNzLmFwcC50aGVuKCgpID0+IHt9KTtcbiAgfVxufVxuIl19