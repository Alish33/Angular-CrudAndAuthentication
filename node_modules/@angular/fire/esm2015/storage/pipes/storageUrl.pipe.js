import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, NgModule, Pipe } from '@angular/core';
import { AngularFireStorage } from '../storage';
/** to be used with in combination with | async */
export class GetDownloadURLPipe {
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
export class GetDownloadURLPipeModule {
}
GetDownloadURLPipeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [GetDownloadURLPipe],
                exports: [GetDownloadURLPipe],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZVVybC5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3N0b3JhZ2UvcGlwZXMvc3RvcmFnZVVybC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFhLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFNUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRWhELGtEQUFrRDtBQUtsRCxNQUFNLE9BQU8sa0JBQWtCO0lBTTdCLFlBQW9CLE9BQTJCLEVBQUUsR0FBc0I7UUFBbkQsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7UUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsU0FBUyxDQUFDLElBQVk7UUFDcEIsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzdEO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQy9CLENBQUM7OztZQXhCRixJQUFJLFNBQUM7Z0JBQ0osSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsSUFBSSxFQUFFLEtBQUs7YUFDWjs7OztZQU5RLGtCQUFrQjtZQUZsQixpQkFBaUI7O0FBcUMxQixNQUFNLE9BQU8sd0JBQXdCOzs7WUFKcEMsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFFLGtCQUFrQixDQUFFO2dCQUNwQyxPQUFPLEVBQUUsQ0FBRSxrQkFBa0IsQ0FBRTthQUNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzeW5jUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgTmdNb2R1bGUsIE9uRGVzdHJveSwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQW5ndWxhckZpcmVTdG9yYWdlIH0gZnJvbSAnLi4vc3RvcmFnZSc7XG5cbi8qKiB0byBiZSB1c2VkIHdpdGggaW4gY29tYmluYXRpb24gd2l0aCB8IGFzeW5jICovXG5AUGlwZSh7XG4gIG5hbWU6ICdnZXREb3dubG9hZFVSTCcsXG4gIHB1cmU6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBHZXREb3dubG9hZFVSTFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtLCBPbkRlc3Ryb3kge1xuXG4gIHByaXZhdGUgYXN5bmNQaXBlOiBBc3luY1BpcGU7XG4gIHByaXZhdGUgcGF0aDogc3RyaW5nO1xuICBwcml2YXRlIGRvd25sb2FkVXJsJDogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RvcmFnZTogQW5ndWxhckZpcmVTdG9yYWdlLCBjZHI6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgdGhpcy5hc3luY1BpcGUgPSBuZXcgQXN5bmNQaXBlKGNkcik7XG4gIH1cblxuICB0cmFuc2Zvcm0ocGF0aDogc3RyaW5nKSB7XG4gICAgaWYgKHBhdGggIT09IHRoaXMucGF0aCkge1xuICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgIHRoaXMuZG93bmxvYWRVcmwkID0gdGhpcy5zdG9yYWdlLnJlZihwYXRoKS5nZXREb3dubG9hZFVSTCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hc3luY1BpcGUudHJhbnNmb3JtKHRoaXMuZG93bmxvYWRVcmwkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuYXN5bmNQaXBlLm5nT25EZXN0cm95KCk7XG4gIH1cblxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFsgR2V0RG93bmxvYWRVUkxQaXBlIF0sXG4gIGV4cG9ydHM6IFsgR2V0RG93bmxvYWRVUkxQaXBlIF0sXG59KVxuZXhwb3J0IGNsYXNzIEdldERvd25sb2FkVVJMUGlwZU1vZHVsZSB7fVxuIl19