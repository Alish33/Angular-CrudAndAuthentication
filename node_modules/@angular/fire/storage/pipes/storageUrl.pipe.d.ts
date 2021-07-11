import { ChangeDetectorRef, OnDestroy, PipeTransform } from '@angular/core';
import { AngularFireStorage } from '../storage';
/** to be used with in combination with | async */
export declare class GetDownloadURLPipe implements PipeTransform, OnDestroy {
    private storage;
    private asyncPipe;
    private path;
    private downloadUrl$;
    constructor(storage: AngularFireStorage, cdr: ChangeDetectorRef);
    transform(path: string): any;
    ngOnDestroy(): void;
}
export declare class GetDownloadURLPipeModule {
}
