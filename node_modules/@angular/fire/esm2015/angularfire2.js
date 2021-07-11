import { asyncScheduler, queueScheduler } from 'rxjs';
import { observeOn, subscribeOn, tap } from 'rxjs/operators';
function noop() {
}
/**
 * Schedules tasks so that they are invoked inside the Zone that is passed in the constructor.
 */
// tslint:disable-next-line:class-name
export class ɵZoneScheduler {
    constructor(zone, delegate = queueScheduler) {
        this.zone = zone;
        this.delegate = delegate;
    }
    now() {
        return this.delegate.now();
    }
    schedule(work, delay, state) {
        const targetZone = this.zone;
        // Wrap the specified work function to make sure that if nested scheduling takes place the
        // work is executed in the correct zone
        const workInZone = function (state) {
            targetZone.runGuarded(() => {
                work.apply(this, [state]);
            });
        };
        // Scheduling itself needs to be run in zone to ensure setInterval calls for async scheduling are done
        // inside the correct zone. This scheduler needs to schedule asynchronously always to ensure that
        // firebase emissions are never synchronous. Specifying a delay causes issues with the queueScheduler delegate.
        return this.delegate.schedule(workInZone, delay, state);
    }
}
// tslint:disable-next-line:class-name
export class ɵBlockUntilFirstOperator {
    constructor(zone) {
        this.zone = zone;
        this.task = null;
    }
    call(subscriber, source) {
        const unscheduleTask = this.unscheduleTask.bind(this);
        this.task = this.zone.run(() => Zone.current.scheduleMacroTask('firebaseZoneBlock', noop, {}, noop, noop));
        return source.pipe(tap({ next: unscheduleTask, complete: unscheduleTask, error: unscheduleTask })).subscribe(subscriber).add(unscheduleTask);
    }
    unscheduleTask() {
        // maybe this is a race condition, invoke in a timeout
        // hold for 10ms while I try to figure out what is going on
        setTimeout(() => {
            if (this.task != null && this.task.state === 'scheduled') {
                this.task.invoke();
                this.task = null;
            }
        }, 10);
    }
}
// tslint:disable-next-line:class-name
export class ɵAngularFireSchedulers {
    constructor(ngZone) {
        this.ngZone = ngZone;
        this.outsideAngular = ngZone.runOutsideAngular(() => new ɵZoneScheduler(Zone.current));
        this.insideAngular = ngZone.run(() => new ɵZoneScheduler(Zone.current, asyncScheduler));
    }
}
/**
 * Operator to block the zone until the first value has been emitted or the observable
 * has completed/errored. This is used to make sure that universal waits until the first
 * value from firebase but doesn't block the zone forever since the firebase subscription
 * is still alive.
 */
export function ɵkeepUnstableUntilFirstFactory(schedulers) {
    return function keepUnstableUntilFirst(obs$) {
        obs$ = obs$.lift(new ɵBlockUntilFirstOperator(schedulers.ngZone));
        return obs$.pipe(
        // Run the subscribe body outside of Angular (e.g. calling Firebase SDK to add a listener to a change event)
        subscribeOn(schedulers.outsideAngular), 
        // Run operators inside the angular zone (e.g. side effects via tap())
        observeOn(schedulers.insideAngular)
        // INVESTIGATE https://github.com/angular/angularfire/pull/2315
        // share()
        );
    };
}
// DEBUG quick debugger function for inline logging that typescript doesn't complain about
//       wrote it for debugging the ɵlazySDKProxy, commenting out for now; should consider exposing a
//       verbose mode for AngularFire in a future release that uses something like this in multiple places
//       usage: () => log('something') || returnValue
// const log = (...args: any[]): false => { console.log(...args); return false }
// The problem here are things like ngOnDestroy are missing, then triggering the service
// rather than dig too far; I'm capturing these as I go.
const noopFunctions = ['ngOnDestroy'];
// INVESTIGATE should we make the Proxy revokable and do some cleanup?
//             right now it's fairly simple but I'm sure this will grow in complexity
export const ɵlazySDKProxy = (klass, observable, zone, options = {}) => {
    return new Proxy(klass, {
        get: (_, name) => zone.runOutsideAngular(() => {
            var _a;
            if (klass[name]) {
                if ((_a = options === null || options === void 0 ? void 0 : options.spy) === null || _a === void 0 ? void 0 : _a.get) {
                    options.spy.get(name, klass[name]);
                }
                return klass[name];
            }
            if (noopFunctions.indexOf(name) > -1) {
                return () => {
                };
            }
            const promise = observable.toPromise().then(mod => {
                const ret = mod && mod[name];
                // TODO move to proper type guards
                if (typeof ret === 'function') {
                    return ret.bind(mod);
                }
                else if (ret && ret.then) {
                    return ret.then((res) => zone.run(() => res));
                }
                else {
                    return zone.run(() => ret);
                }
            });
            // recurse the proxy
            return new Proxy(() => { }, {
                get: (_, name) => promise[name],
                // TODO handle callbacks as transparently as I can
                apply: (self, _, args) => promise.then(it => {
                    var _a;
                    const res = it && it(...args);
                    if ((_a = options === null || options === void 0 ? void 0 : options.spy) === null || _a === void 0 ? void 0 : _a.apply) {
                        options.spy.apply(name, args, res);
                    }
                    return res;
                })
            });
        })
    });
};
export const ɵapplyMixins = (derivedCtor, constructors) => {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype || baseCtor).forEach((name) => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype || baseCtor, name));
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcmZpcmUyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvcmUvYW5ndWxhcmZpcmUyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFDTCxjQUFjLEVBR2QsY0FBYyxFQU1mLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0QsU0FBUyxJQUFJO0FBQ2IsQ0FBQztBQUVEOztHQUVHO0FBQ0gsc0NBQXNDO0FBQ3RDLE1BQU0sT0FBTyxjQUFjO0lBQ3pCLFlBQW9CLElBQVMsRUFBVSxXQUFnQixjQUFjO1FBQWpELFNBQUksR0FBSixJQUFJLENBQUs7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFzQjtJQUNyRSxDQUFDO0lBRUQsR0FBRztRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQXVELEVBQUUsS0FBYyxFQUFFLEtBQVc7UUFDM0YsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM3QiwwRkFBMEY7UUFDMUYsdUNBQXVDO1FBQ3ZDLE1BQU0sVUFBVSxHQUFHLFVBQXFDLEtBQVU7WUFDaEUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLHNHQUFzRztRQUN0RyxpR0FBaUc7UUFDakcsK0dBQStHO1FBQy9HLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0NBQ0Y7QUFFRCxzQ0FBc0M7QUFDdEMsTUFBTSxPQUFPLHdCQUF3QjtJQUduQyxZQUFvQixJQUFTO1FBQVQsU0FBSSxHQUFKLElBQUksQ0FBSztRQUZyQixTQUFJLEdBQXFCLElBQUksQ0FBQztJQUd0QyxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBcUI7UUFDbkQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFM0csT0FBTyxNQUFNLENBQUMsSUFBSSxDQUNoQixHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQy9FLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRU8sY0FBYztRQUNwQixzREFBc0Q7UUFDdEQsMkRBQTJEO1FBQzNELFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDbEI7UUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDVCxDQUFDO0NBQ0Y7QUFFRCxzQ0FBc0M7QUFDdEMsTUFBTSxPQUFPLHNCQUFzQjtJQUlqQyxZQUFtQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN2RixJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7Q0FDRjtBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLDhCQUE4QixDQUFDLFVBQWtDO0lBQy9FLE9BQU8sU0FBUyxzQkFBc0IsQ0FBSSxJQUFtQjtRQUMzRCxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FDZCxJQUFJLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FDaEQsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLElBQUk7UUFDZCw0R0FBNEc7UUFDNUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFDdEMsc0VBQXNFO1FBQ3RFLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQ25DLCtEQUErRDtRQUMvRCxVQUFVO1NBQ1gsQ0FBQztJQUNKLENBQUMsQ0FBQztBQUNKLENBQUM7QUFrQkQsMEZBQTBGO0FBQzFGLHFHQUFxRztBQUNyRywwR0FBMEc7QUFDMUcscURBQXFEO0FBQ3JELGdGQUFnRjtBQUVoRix3RkFBd0Y7QUFDeEYsd0RBQXdEO0FBQ3hELE1BQU0sYUFBYSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFdEMsc0VBQXNFO0FBQ3RFLHFGQUFxRjtBQUNyRixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFVLEVBQUUsVUFBMkIsRUFBRSxJQUFZLEVBQUUsVUFLakYsRUFBRSxFQUFFLEVBQUU7SUFDUixPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtRQUN0QixHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFOztZQUNwRCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDZixJQUFJLE1BQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEdBQUcsMENBQUUsR0FBRyxFQUFFO29CQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQ3BDO2dCQUNELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BCO1lBQ0QsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNwQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixDQUFDLENBQUM7YUFDSDtZQUNELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2hELE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzdCLGtDQUFrQztnQkFDbEMsSUFBSSxPQUFPLEdBQUcsS0FBSyxVQUFVLEVBQUU7b0JBQzdCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEI7cUJBQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtvQkFDMUIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3BEO3FCQUFNO29CQUNMLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDNUI7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILG9CQUFvQjtZQUNwQixPQUFPLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBRTtnQkFDdkIsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDL0Isa0RBQWtEO2dCQUNsRCxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTs7b0JBQzFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDOUIsSUFBSSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxHQUFHLDBDQUFFLEtBQUssRUFBRTt3QkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDcEM7b0JBQ0QsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDO2FBQ0gsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDO0tBQ0gsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQUMsV0FBZ0IsRUFBRSxZQUFtQixFQUFFLEVBQUU7SUFDcEUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzFFLE1BQU0sQ0FBQyxjQUFjLENBQ25CLFdBQVcsQ0FBQyxTQUFTLEVBQ3JCLElBQUksRUFDSixNQUFNLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLFNBQVMsSUFBSSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQ3RFLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBhc3luY1NjaGVkdWxlcixcbiAgT2JzZXJ2YWJsZSxcbiAgT3BlcmF0b3IsXG4gIHF1ZXVlU2NoZWR1bGVyLFxuICBTY2hlZHVsZXJBY3Rpb24sXG4gIFNjaGVkdWxlckxpa2UsXG4gIFN1YnNjcmliZXIsXG4gIFN1YnNjcmlwdGlvbixcbiAgVGVhcmRvd25Mb2dpY1xufSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG9ic2VydmVPbiwgc3Vic2NyaWJlT24sIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZnVuY3Rpb24gbm9vcCgpIHtcbn1cblxuLyoqXG4gKiBTY2hlZHVsZXMgdGFza3Mgc28gdGhhdCB0aGV5IGFyZSBpbnZva2VkIGluc2lkZSB0aGUgWm9uZSB0aGF0IGlzIHBhc3NlZCBpbiB0aGUgY29uc3RydWN0b3IuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgybVab25lU2NoZWR1bGVyIGltcGxlbWVudHMgU2NoZWR1bGVyTGlrZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgem9uZTogYW55LCBwcml2YXRlIGRlbGVnYXRlOiBhbnkgPSBxdWV1ZVNjaGVkdWxlcikge1xuICB9XG5cbiAgbm93KCkge1xuICAgIHJldHVybiB0aGlzLmRlbGVnYXRlLm5vdygpO1xuICB9XG5cbiAgc2NoZWR1bGUod29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LCBzdGF0ZT86IGFueSkgPT4gdm9pZCwgZGVsYXk/OiBudW1iZXIsIHN0YXRlPzogYW55KTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCB0YXJnZXRab25lID0gdGhpcy56b25lO1xuICAgIC8vIFdyYXAgdGhlIHNwZWNpZmllZCB3b3JrIGZ1bmN0aW9uIHRvIG1ha2Ugc3VyZSB0aGF0IGlmIG5lc3RlZCBzY2hlZHVsaW5nIHRha2VzIHBsYWNlIHRoZVxuICAgIC8vIHdvcmsgaXMgZXhlY3V0ZWQgaW4gdGhlIGNvcnJlY3Qgem9uZVxuICAgIGNvbnN0IHdvcmtJblpvbmUgPSBmdW5jdGlvbih0aGlzOiBTY2hlZHVsZXJBY3Rpb248YW55Piwgc3RhdGU6IGFueSkge1xuICAgICAgdGFyZ2V0Wm9uZS5ydW5HdWFyZGVkKCgpID0+IHtcbiAgICAgICAgd29yay5hcHBseSh0aGlzLCBbc3RhdGVdKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBTY2hlZHVsaW5nIGl0c2VsZiBuZWVkcyB0byBiZSBydW4gaW4gem9uZSB0byBlbnN1cmUgc2V0SW50ZXJ2YWwgY2FsbHMgZm9yIGFzeW5jIHNjaGVkdWxpbmcgYXJlIGRvbmVcbiAgICAvLyBpbnNpZGUgdGhlIGNvcnJlY3Qgem9uZS4gVGhpcyBzY2hlZHVsZXIgbmVlZHMgdG8gc2NoZWR1bGUgYXN5bmNocm9ub3VzbHkgYWx3YXlzIHRvIGVuc3VyZSB0aGF0XG4gICAgLy8gZmlyZWJhc2UgZW1pc3Npb25zIGFyZSBuZXZlciBzeW5jaHJvbm91cy4gU3BlY2lmeWluZyBhIGRlbGF5IGNhdXNlcyBpc3N1ZXMgd2l0aCB0aGUgcXVldWVTY2hlZHVsZXIgZGVsZWdhdGUuXG4gICAgcmV0dXJuIHRoaXMuZGVsZWdhdGUuc2NoZWR1bGUod29ya0luWm9uZSwgZGVsYXksIHN0YXRlKTtcbiAgfVxufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGNsYXNzIMm1QmxvY2tVbnRpbEZpcnN0T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIHByaXZhdGUgdGFzazogTWFjcm9UYXNrIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB6b25lOiBhbnkpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgY29uc3QgdW5zY2hlZHVsZVRhc2sgPSB0aGlzLnVuc2NoZWR1bGVUYXNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy50YXNrID0gdGhpcy56b25lLnJ1bigoKSA9PiBab25lLmN1cnJlbnQuc2NoZWR1bGVNYWNyb1Rhc2soJ2ZpcmViYXNlWm9uZUJsb2NrJywgbm9vcCwge30sIG5vb3AsIG5vb3ApKTtcblxuICAgIHJldHVybiBzb3VyY2UucGlwZShcbiAgICAgIHRhcCh7IG5leHQ6IHVuc2NoZWR1bGVUYXNrLCBjb21wbGV0ZTogdW5zY2hlZHVsZVRhc2ssIGVycm9yOiB1bnNjaGVkdWxlVGFzayB9KVxuICAgICkuc3Vic2NyaWJlKHN1YnNjcmliZXIpLmFkZCh1bnNjaGVkdWxlVGFzayk7XG4gIH1cblxuICBwcml2YXRlIHVuc2NoZWR1bGVUYXNrKCkge1xuICAgIC8vIG1heWJlIHRoaXMgaXMgYSByYWNlIGNvbmRpdGlvbiwgaW52b2tlIGluIGEgdGltZW91dFxuICAgIC8vIGhvbGQgZm9yIDEwbXMgd2hpbGUgSSB0cnkgdG8gZmlndXJlIG91dCB3aGF0IGlzIGdvaW5nIG9uXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy50YXNrICE9IG51bGwgJiYgdGhpcy50YXNrLnN0YXRlID09PSAnc2NoZWR1bGVkJykge1xuICAgICAgICB0aGlzLnRhc2suaW52b2tlKCk7XG4gICAgICAgIHRoaXMudGFzayA9IG51bGw7XG4gICAgICB9XG4gICAgfSwgMTApO1xuICB9XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgybVBbmd1bGFyRmlyZVNjaGVkdWxlcnMge1xuICBwdWJsaWMgcmVhZG9ubHkgb3V0c2lkZUFuZ3VsYXI6IMm1Wm9uZVNjaGVkdWxlcjtcbiAgcHVibGljIHJlYWRvbmx5IGluc2lkZUFuZ3VsYXI6IMm1Wm9uZVNjaGVkdWxlcjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmdab25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLm91dHNpZGVBbmd1bGFyID0gbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IG5ldyDJtVpvbmVTY2hlZHVsZXIoWm9uZS5jdXJyZW50KSk7XG4gICAgdGhpcy5pbnNpZGVBbmd1bGFyID0gbmdab25lLnJ1bigoKSA9PiBuZXcgybVab25lU2NoZWR1bGVyKFpvbmUuY3VycmVudCwgYXN5bmNTY2hlZHVsZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wZXJhdG9yIHRvIGJsb2NrIHRoZSB6b25lIHVudGlsIHRoZSBmaXJzdCB2YWx1ZSBoYXMgYmVlbiBlbWl0dGVkIG9yIHRoZSBvYnNlcnZhYmxlXG4gKiBoYXMgY29tcGxldGVkL2Vycm9yZWQuIFRoaXMgaXMgdXNlZCB0byBtYWtlIHN1cmUgdGhhdCB1bml2ZXJzYWwgd2FpdHMgdW50aWwgdGhlIGZpcnN0XG4gKiB2YWx1ZSBmcm9tIGZpcmViYXNlIGJ1dCBkb2Vzbid0IGJsb2NrIHRoZSB6b25lIGZvcmV2ZXIgc2luY2UgdGhlIGZpcmViYXNlIHN1YnNjcmlwdGlvblxuICogaXMgc3RpbGwgYWxpdmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtWtlZXBVbnN0YWJsZVVudGlsRmlyc3RGYWN0b3J5KHNjaGVkdWxlcnM6IMm1QW5ndWxhckZpcmVTY2hlZHVsZXJzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBrZWVwVW5zdGFibGVVbnRpbEZpcnN0PFQ+KG9icyQ6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBvYnMkID0gb2JzJC5saWZ0KFxuICAgICAgbmV3IMm1QmxvY2tVbnRpbEZpcnN0T3BlcmF0b3Ioc2NoZWR1bGVycy5uZ1pvbmUpXG4gICAgKTtcblxuICAgIHJldHVybiBvYnMkLnBpcGUoXG4gICAgICAvLyBSdW4gdGhlIHN1YnNjcmliZSBib2R5IG91dHNpZGUgb2YgQW5ndWxhciAoZS5nLiBjYWxsaW5nIEZpcmViYXNlIFNESyB0byBhZGQgYSBsaXN0ZW5lciB0byBhIGNoYW5nZSBldmVudClcbiAgICAgIHN1YnNjcmliZU9uKHNjaGVkdWxlcnMub3V0c2lkZUFuZ3VsYXIpLFxuICAgICAgLy8gUnVuIG9wZXJhdG9ycyBpbnNpZGUgdGhlIGFuZ3VsYXIgem9uZSAoZS5nLiBzaWRlIGVmZmVjdHMgdmlhIHRhcCgpKVxuICAgICAgb2JzZXJ2ZU9uKHNjaGVkdWxlcnMuaW5zaWRlQW5ndWxhcilcbiAgICAgIC8vIElOVkVTVElHQVRFIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXJmaXJlL3B1bGwvMjMxNVxuICAgICAgLy8gc2hhcmUoKVxuICAgICk7XG4gIH07XG59XG5cbi8vIHRzbGludDpkaXNhYmxlOmJhbi10eXBlc1xudHlwZSBGdW5jdGlvblByb3BlcnR5TmFtZXM8VD4gPSB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgRnVuY3Rpb24gPyBLIDogbmV2ZXIgfVtrZXlvZiBUXTtcbnR5cGUgUHJvbWlzZVJldHVybmluZ0Z1bmN0aW9uUHJvcGVydHlOYW1lczxUPiA9IHtcbiAgW0sgaW4gRnVuY3Rpb25Qcm9wZXJ0eU5hbWVzPFQ+XTogUmV0dXJuVHlwZTxUW0tdPiBleHRlbmRzIFByb21pc2U8YW55PiA/IEsgOiBuZXZlclxufVtGdW5jdGlvblByb3BlcnR5TmFtZXM8VD5dO1xudHlwZSBOb25Qcm9taXNlUmV0dXJuaW5nRnVuY3Rpb25Qcm9wZXJ0eU5hbWVzPFQ+ID0ge1xuICBbSyBpbiBGdW5jdGlvblByb3BlcnR5TmFtZXM8VD5dOiBSZXR1cm5UeXBlPFRbS10+IGV4dGVuZHMgUHJvbWlzZTxhbnk+ID8gbmV2ZXIgOiBLXG59W0Z1bmN0aW9uUHJvcGVydHlOYW1lczxUPl07XG50eXBlIE5vbkZ1bmN0aW9uUHJvcGVydHlOYW1lczxUPiA9IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBGdW5jdGlvbiA/IG5ldmVyIDogSyB9W2tleW9mIFRdO1xuLy8gdHNsaW50OmVuYWJsZTpiYW4tdHlwZXNcblxuZXhwb3J0IHR5cGUgybVQcm9taXNlUHJveHk8VD4gPSB7IFtLIGluIE5vbkZ1bmN0aW9uUHJvcGVydHlOYW1lczxUPl06IFByb21pc2U8VFtLXT4gfSAmXG4gIHsgW0sgaW4gTm9uUHJvbWlzZVJldHVybmluZ0Z1bmN0aW9uUHJvcGVydHlOYW1lczxUPl06ICguLi5hcmdzOiBQYXJhbWV0ZXJzPFRbS10+KSA9PiBQcm9taXNlPFJldHVyblR5cGU8VFtLXT4+IH0gJlxuICB7IFtLIGluIFByb21pc2VSZXR1cm5pbmdGdW5jdGlvblByb3BlcnR5TmFtZXM8VD5dOiAoLi4uYXJnczogUGFyYW1ldGVyczxUW0tdPikgPT4gUmV0dXJuVHlwZTxUW0tdPiB9O1xuXG5cbi8vIERFQlVHIHF1aWNrIGRlYnVnZ2VyIGZ1bmN0aW9uIGZvciBpbmxpbmUgbG9nZ2luZyB0aGF0IHR5cGVzY3JpcHQgZG9lc24ndCBjb21wbGFpbiBhYm91dFxuLy8gICAgICAgd3JvdGUgaXQgZm9yIGRlYnVnZ2luZyB0aGUgybVsYXp5U0RLUHJveHksIGNvbW1lbnRpbmcgb3V0IGZvciBub3c7IHNob3VsZCBjb25zaWRlciBleHBvc2luZyBhXG4vLyAgICAgICB2ZXJib3NlIG1vZGUgZm9yIEFuZ3VsYXJGaXJlIGluIGEgZnV0dXJlIHJlbGVhc2UgdGhhdCB1c2VzIHNvbWV0aGluZyBsaWtlIHRoaXMgaW4gbXVsdGlwbGUgcGxhY2VzXG4vLyAgICAgICB1c2FnZTogKCkgPT4gbG9nKCdzb21ldGhpbmcnKSB8fCByZXR1cm5WYWx1ZVxuLy8gY29uc3QgbG9nID0gKC4uLmFyZ3M6IGFueVtdKTogZmFsc2UgPT4geyBjb25zb2xlLmxvZyguLi5hcmdzKTsgcmV0dXJuIGZhbHNlIH1cblxuLy8gVGhlIHByb2JsZW0gaGVyZSBhcmUgdGhpbmdzIGxpa2UgbmdPbkRlc3Ryb3kgYXJlIG1pc3NpbmcsIHRoZW4gdHJpZ2dlcmluZyB0aGUgc2VydmljZVxuLy8gcmF0aGVyIHRoYW4gZGlnIHRvbyBmYXI7IEknbSBjYXB0dXJpbmcgdGhlc2UgYXMgSSBnby5cbmNvbnN0IG5vb3BGdW5jdGlvbnMgPSBbJ25nT25EZXN0cm95J107XG5cbi8vIElOVkVTVElHQVRFIHNob3VsZCB3ZSBtYWtlIHRoZSBQcm94eSByZXZva2FibGUgYW5kIGRvIHNvbWUgY2xlYW51cD9cbi8vICAgICAgICAgICAgIHJpZ2h0IG5vdyBpdCdzIGZhaXJseSBzaW1wbGUgYnV0IEknbSBzdXJlIHRoaXMgd2lsbCBncm93IGluIGNvbXBsZXhpdHlcbmV4cG9ydCBjb25zdCDJtWxhenlTREtQcm94eSA9IChrbGFzczogYW55LCBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPGFueT4sIHpvbmU6IE5nWm9uZSwgb3B0aW9uczoge1xuICBzcHk/OiB7XG4gICAgZ2V0PzogKChuYW1lOiBzdHJpbmcsIGl0OiBhbnkpID0+IHZvaWQpLFxuICAgIGFwcGx5PzogKChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdLCBpdDogYW55KSA9PiB2b2lkKVxuICB9XG59ID0ge30pID0+IHtcbiAgcmV0dXJuIG5ldyBQcm94eShrbGFzcywge1xuICAgIGdldDogKF8sIG5hbWU6IHN0cmluZykgPT4gem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBpZiAoa2xhc3NbbmFtZV0pIHtcbiAgICAgICAgaWYgKG9wdGlvbnM/LnNweT8uZ2V0KSB7XG4gICAgICAgICAgb3B0aW9ucy5zcHkuZ2V0KG5hbWUsIGtsYXNzW25hbWVdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2xhc3NbbmFtZV07XG4gICAgICB9XG4gICAgICBpZiAobm9vcEZ1bmN0aW9ucy5pbmRleE9mKG5hbWUpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb21pc2UgPSBvYnNlcnZhYmxlLnRvUHJvbWlzZSgpLnRoZW4obW9kID0+IHtcbiAgICAgICAgY29uc3QgcmV0ID0gbW9kICYmIG1vZFtuYW1lXTtcbiAgICAgICAgLy8gVE9ETyBtb3ZlIHRvIHByb3BlciB0eXBlIGd1YXJkc1xuICAgICAgICBpZiAodHlwZW9mIHJldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiByZXQuYmluZChtb2QpO1xuICAgICAgICB9IGVsc2UgaWYgKHJldCAmJiByZXQudGhlbikge1xuICAgICAgICAgIHJldHVybiByZXQudGhlbigocmVzOiBhbnkpID0+IHpvbmUucnVuKCgpID0+IHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB6b25lLnJ1bigoKSA9PiByZXQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIHJlY3Vyc2UgdGhlIHByb3h5XG4gICAgICByZXR1cm4gbmV3IFByb3h5KCgpID0+IHt9LCB7XG4gICAgICAgICAgZ2V0OiAoXywgbmFtZSkgPT4gcHJvbWlzZVtuYW1lXSxcbiAgICAgICAgICAvLyBUT0RPIGhhbmRsZSBjYWxsYmFja3MgYXMgdHJhbnNwYXJlbnRseSBhcyBJIGNhblxuICAgICAgICAgIGFwcGx5OiAoc2VsZiwgXywgYXJncykgPT4gcHJvbWlzZS50aGVuKGl0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGl0ICYmIGl0KC4uLmFyZ3MpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnM/LnNweT8uYXBwbHkpIHtcbiAgICAgICAgICAgICAgb3B0aW9ucy5zcHkuYXBwbHkobmFtZSwgYXJncywgcmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KVxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCDJtWFwcGx5TWl4aW5zID0gKGRlcml2ZWRDdG9yOiBhbnksIGNvbnN0cnVjdG9yczogYW55W10pID0+IHtcbiAgY29uc3RydWN0b3JzLmZvckVhY2goKGJhc2VDdG9yKSA9PiB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlIHx8IGJhc2VDdG9yKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgIGRlcml2ZWRDdG9yLnByb3RvdHlwZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUgfHwgYmFzZUN0b3IsIG5hbWUpXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcbn07XG4iXX0=