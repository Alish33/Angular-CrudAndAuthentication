import { ScreenTrackingService } from './screen-tracking.service';
import { AngularFireAnalytics } from './analytics';
import { UserTrackingService } from './user-tracking.service';
export declare class AngularFireAnalyticsModule {
    constructor(analytics: AngularFireAnalytics, screenTracking: ScreenTrackingService, userTracking: UserTrackingService);
}
