import { NgModule, Optional } from '@angular/core';
import { AngularFirePerformance } from './performance';
import { PerformanceMonitoringService } from './performance.service';
export class AngularFirePerformanceModule {
    constructor(perf, _) {
        // call anything here to get perf loading
        // tslint:disable-next-line:no-unused-expression
        perf.dataCollectionEnabled.then(() => { });
    }
}
AngularFirePerformanceModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFirePerformance]
            },] }
];
/** @nocollapse */
AngularFirePerformanceModule.ctorParameters = () => [
    { type: AngularFirePerformance },
    { type: PerformanceMonitoringService, decorators: [{ type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybWFuY2UubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3BlcmZvcm1hbmNlL3BlcmZvcm1hbmNlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFLckUsTUFBTSxPQUFPLDRCQUE0QjtJQUN2QyxZQUNFLElBQTRCLEVBQ2hCLENBQStCO1FBRTNDLHlDQUF5QztRQUN6QyxnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7WUFYRixRQUFRLFNBQUM7Z0JBQ1IsU0FBUyxFQUFFLENBQUUsc0JBQXNCLENBQUU7YUFDdEM7Ozs7WUFMUSxzQkFBc0I7WUFDdEIsNEJBQTRCLHVCQVFoQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbmd1bGFyRmlyZVBlcmZvcm1hbmNlIH0gZnJvbSAnLi9wZXJmb3JtYW5jZSc7XG5pbXBvcnQgeyBQZXJmb3JtYW5jZU1vbml0b3JpbmdTZXJ2aWNlIH0gZnJvbSAnLi9wZXJmb3JtYW5jZS5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbIEFuZ3VsYXJGaXJlUGVyZm9ybWFuY2UgXVxufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRmlyZVBlcmZvcm1hbmNlTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcGVyZjogQW5ndWxhckZpcmVQZXJmb3JtYW5jZSxcbiAgICBAT3B0aW9uYWwoKSBfOiBQZXJmb3JtYW5jZU1vbml0b3JpbmdTZXJ2aWNlXG4gICkge1xuICAgIC8vIGNhbGwgYW55dGhpbmcgaGVyZSB0byBnZXQgcGVyZiBsb2FkaW5nXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgcGVyZi5kYXRhQ29sbGVjdGlvbkVuYWJsZWQudGhlbigoKSA9PiB7fSk7XG4gIH1cbn1cbiJdfQ==