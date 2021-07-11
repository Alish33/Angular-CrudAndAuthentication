import { NgModule } from '@angular/core';
import { GetDownloadURLPipeModule } from './pipes/storageUrl.pipe';
import { AngularFireStorage } from './storage';
export class AngularFireStorageModule {
}
AngularFireStorageModule.decorators = [
    { type: NgModule, args: [{
                exports: [GetDownloadURLPipeModule],
                providers: [AngularFireStorage]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc3RvcmFnZS9zdG9yYWdlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQU0vQyxNQUFNLE9BQU8sd0JBQXdCOzs7WUFKcEMsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFFLHdCQUF3QixDQUFFO2dCQUNyQyxTQUFTLEVBQUUsQ0FBRSxrQkFBa0IsQ0FBRTthQUNsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHZXREb3dubG9hZFVSTFBpcGVNb2R1bGUgfSBmcm9tICcuL3BpcGVzL3N0b3JhZ2VVcmwucGlwZSc7XG5pbXBvcnQgeyBBbmd1bGFyRmlyZVN0b3JhZ2UgfSBmcm9tICcuL3N0b3JhZ2UnO1xuXG5ATmdNb2R1bGUoe1xuICBleHBvcnRzOiBbIEdldERvd25sb2FkVVJMUGlwZU1vZHVsZSBdLFxuICBwcm92aWRlcnM6IFsgQW5ndWxhckZpcmVTdG9yYWdlIF1cbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckZpcmVTdG9yYWdlTW9kdWxlIHsgfVxuIl19