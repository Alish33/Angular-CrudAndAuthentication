import { fromCollectionRef } from '../observable/fromRef';
import { distinctUntilChanged, map, pairwise, scan, startWith } from 'rxjs/operators';
/**
 * Return a stream of document changes on a query. These results are not in sort order but in
 * order of occurence.
 */
export function docChanges(query, scheduler) {
    return fromCollectionRef(query, scheduler)
        .pipe(startWith(undefined), pairwise(), map(([priorAction, action]) => {
        const docChanges = action.payload.docChanges();
        const actions = docChanges.map(change => ({ type: change.type, payload: change }));
        // the metadata has changed from the prior emission
        if (priorAction && JSON.stringify(priorAction.payload.metadata) !== JSON.stringify(action.payload.metadata)) {
            // go through all the docs in payload and figure out which ones changed
            action.payload.docs.forEach((currentDoc, currentIndex) => {
                const docChange = docChanges.find(d => d.doc.ref.isEqual(currentDoc.ref));
                const priorDoc = priorAction === null || priorAction === void 0 ? void 0 : priorAction.payload.docs.find(d => d.ref.isEqual(currentDoc.ref));
                if (docChange && JSON.stringify(docChange.doc.metadata) === JSON.stringify(currentDoc.metadata) ||
                    !docChange && priorDoc && JSON.stringify(priorDoc.metadata) === JSON.stringify(currentDoc.metadata)) {
                    // document doesn't appear to have changed, don't log another action
                }
                else {
                    // since the actions are processed in order just push onto the array
                    actions.push({
                        type: 'modified',
                        payload: {
                            oldIndex: currentIndex,
                            newIndex: currentIndex,
                            type: 'modified',
                            doc: currentDoc
                        }
                    });
                }
            });
        }
        return actions;
    }));
}
/**
 * Return a stream of document changes on a query. These results are in sort order.
 */
export function sortedChanges(query, events, scheduler) {
    return docChanges(query, scheduler)
        .pipe(scan((current, changes) => combineChanges(current, changes.map(it => it.payload), events), []), distinctUntilChanged(), // cut down on unneed change cycles
    map(changes => changes.map(c => ({ type: c.type, payload: c }))));
}
/**
 * Combines the total result set from the current set of changes from an incoming set
 * of changes.
 */
export function combineChanges(current, changes, events) {
    changes.forEach(change => {
        // skip unwanted change types
        if (events.indexOf(change.type) > -1) {
            current = combineChange(current, change);
        }
    });
    return current;
}
/**
 * Splice arguments on top of a sliced array, to break top-level ===
 * this is useful for change-detection
 */
function sliceAndSplice(original, start, deleteCount, ...args) {
    const returnArray = original.slice();
    returnArray.splice(start, deleteCount, ...args);
    return returnArray;
}
/**
 * Creates a new sorted array from a new change.
 * Build our own because we allow filtering of action types ('added', 'removed', 'modified') before scanning
 * and so we have greater control over change detection (by breaking ===)
 */
export function combineChange(combined, change) {
    switch (change.type) {
        case 'added':
            if (combined[change.newIndex] && combined[change.newIndex].doc.ref.isEqual(change.doc.ref)) {
                // Not sure why the duplicates are getting fired
            }
            else {
                return sliceAndSplice(combined, change.newIndex, 0, change);
            }
            break;
        case 'modified':
            if (combined[change.oldIndex] == null || combined[change.oldIndex].doc.ref.isEqual(change.doc.ref)) {
                // When an item changes position we first remove it
                // and then add it's new position
                if (change.oldIndex !== change.newIndex) {
                    const copiedArray = combined.slice();
                    copiedArray.splice(change.oldIndex, 1);
                    copiedArray.splice(change.newIndex, 0, change);
                    return copiedArray;
                }
                else {
                    return sliceAndSplice(combined, change.newIndex, 1, change);
                }
            }
            break;
        case 'removed':
            if (combined[change.oldIndex] && combined[change.oldIndex].doc.ref.isEqual(change.doc.ref)) {
                return sliceAndSplice(combined, change.oldIndex, 1);
            }
            break;
    }
    return combined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9maXJlc3RvcmUvY29sbGVjdGlvbi9jaGFuZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUd0Rjs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUFJLEtBQVksRUFBRSxTQUF5QjtJQUNuRSxPQUFPLGlCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7U0FDdkMsSUFBSSxDQUNILFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFDcEIsUUFBUSxFQUFFLEVBQ1YsR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRTtRQUM1QixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQy9DLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRixtREFBbUQ7UUFDbkQsSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzRyx1RUFBdUU7WUFDdkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxFQUFFO2dCQUN2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UUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDN0Q7YUFDRjtZQUNELE1BQU07UUFDUixLQUFLLFNBQVM7WUFDWixJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUMxRixPQUFPLGNBQWMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNyRDtZQUNELE1BQU07S0FDVDtJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmcm9tQ29sbGVjdGlvblJlZiB9IGZyb20gJy4uL29ic2VydmFibGUvZnJvbVJlZic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwLCBwYWlyd2lzZSwgc2Nhbiwgc3RhcnRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRG9jdW1lbnRDaGFuZ2UsIERvY3VtZW50Q2hhbmdlQWN0aW9uLCBEb2N1bWVudENoYW5nZVR5cGUsIFF1ZXJ5IH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogUmV0dXJuIGEgc3RyZWFtIG9mIGRvY3VtZW50IGNoYW5nZXMgb24gYSBxdWVyeS4gVGhlc2UgcmVzdWx0cyBhcmUgbm90IGluIHNvcnQgb3JkZXIgYnV0IGluXG4gKiBvcmRlciBvZiBvY2N1cmVuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkb2NDaGFuZ2VzPFQ+KHF1ZXJ5OiBRdWVyeSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8RG9jdW1lbnRDaGFuZ2VBY3Rpb248VD5bXT4ge1xuICByZXR1cm4gZnJvbUNvbGxlY3Rpb25SZWYocXVlcnksIHNjaGVkdWxlcilcbiAgICAucGlwZShcbiAgICAgIHN0YXJ0V2l0aCh1bmRlZmluZWQpLFxuICAgICAgcGFpcndpc2UoKSxcbiAgICAgIG1hcCgoW3ByaW9yQWN0aW9uLCBhY3Rpb25dKSA9PiB7XG4gICAgICAgIGNvbnN0IGRvY0NoYW5nZXMgPSBhY3Rpb24ucGF5bG9hZC5kb2NDaGFuZ2VzKCk7XG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBkb2NDaGFuZ2VzLm1hcChjaGFuZ2UgPT4gKHsgdHlwZTogY2hhbmdlLnR5cGUsIHBheWxvYWQ6IGNoYW5nZSB9KSk7XG4gICAgICAgIC8vIHRoZSBtZXRhZGF0YSBoYXMgY2hhbmdlZCBmcm9tIHRoZSBwcmlvciBlbWlzc2lvblxuICAgICAgICBpZiAocHJpb3JBY3Rpb24gJiYgSlNPTi5zdHJpbmdpZnkocHJpb3JBY3Rpb24ucGF5bG9hZC5tZXRhZGF0YSkgIT09IEpTT04uc3RyaW5naWZ5KGFjdGlvbi5wYXlsb2FkLm1ldGFkYXRhKSkge1xuICAgICAgICAgIC8vIGdvIHRocm91Z2ggYWxsIHRoZSBkb2NzIGluIHBheWxvYWQgYW5kIGZpZ3VyZSBvdXQgd2hpY2ggb25lcyBjaGFuZ2VkXG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQuZG9jcy5mb3JFYWNoKChjdXJyZW50RG9jLCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRvY0NoYW5nZSA9IGRvY0NoYW5nZXMuZmluZChkID0+IGQuZG9jLnJlZi5pc0VxdWFsKGN1cnJlbnREb2MucmVmKSk7XG4gICAgICAgICAgICBjb25zdCBwcmlvckRvYyA9IHByaW9yQWN0aW9uPy5wYXlsb2FkLmRvY3MuZmluZChkID0+IGQucmVmLmlzRXF1YWwoY3VycmVudERvYy5yZWYpKTtcbiAgICAgICAgICAgIGlmIChkb2NDaGFuZ2UgJiYgSlNPTi5zdHJpbmdpZnkoZG9jQ2hhbmdlLmRvYy5tZXRhZGF0YSkgPT09IEpTT04uc3RyaW5naWZ5KGN1cnJlbnREb2MubWV0YWRhdGEpIHx8XG4gICAgICAgICAgICAgICFkb2NDaGFuZ2UgJiYgcHJpb3JEb2MgJiYgSlNPTi5zdHJpbmdpZnkocHJpb3JEb2MubWV0YWRhdGEpID09PSBKU09OLnN0cmluZ2lmeShjdXJyZW50RG9jLm1ldGFkYXRhKSkge1xuICAgICAgICAgICAgICAvLyBkb2N1bWVudCBkb2Vzbid0IGFwcGVhciB0byBoYXZlIGNoYW5nZWQsIGRvbid0IGxvZyBhbm90aGVyIGFjdGlvblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gc2luY2UgdGhlIGFjdGlvbnMgYXJlIHByb2Nlc3NlZCBpbiBvcmRlciBqdXN0IHB1c2ggb250byB0aGUgYXJyYXlcbiAgICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbW9kaWZpZWQnLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgIG9sZEluZGV4OiBjdXJyZW50SW5kZXgsXG4gICAgICAgICAgICAgICAgICBuZXdJbmRleDogY3VycmVudEluZGV4LFxuICAgICAgICAgICAgICAgICAgdHlwZTogJ21vZGlmaWVkJyxcbiAgICAgICAgICAgICAgICAgIGRvYzogY3VycmVudERvY1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvbnMgYXMgRG9jdW1lbnRDaGFuZ2VBY3Rpb248VD5bXTtcbiAgICAgIH0pLFxuICApO1xufVxuXG4vKipcbiAqIFJldHVybiBhIHN0cmVhbSBvZiBkb2N1bWVudCBjaGFuZ2VzIG9uIGEgcXVlcnkuIFRoZXNlIHJlc3VsdHMgYXJlIGluIHNvcnQgb3JkZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0ZWRDaGFuZ2VzPFQ+KFxuICBxdWVyeTogUXVlcnksXG4gIGV2ZW50czogRG9jdW1lbnRDaGFuZ2VUeXBlW10sXG4gIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPERvY3VtZW50Q2hhbmdlQWN0aW9uPFQ+W10+IHtcbiAgcmV0dXJuIGRvY0NoYW5nZXM8VD4ocXVlcnksIHNjaGVkdWxlcilcbiAgICAucGlwZShcbiAgICAgIHNjYW4oKGN1cnJlbnQsIGNoYW5nZXMpID0+IGNvbWJpbmVDaGFuZ2VzPFQ+KGN1cnJlbnQsIGNoYW5nZXMubWFwKGl0ID0+IGl0LnBheWxvYWQpLCBldmVudHMpLCBbXSksXG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLCAvLyBjdXQgZG93biBvbiB1bm5lZWQgY2hhbmdlIGN5Y2xlc1xuICAgICAgbWFwKGNoYW5nZXMgPT4gY2hhbmdlcy5tYXAoYyA9PiAoeyB0eXBlOiBjLnR5cGUsIHBheWxvYWQ6IGMgfSBhcyBEb2N1bWVudENoYW5nZUFjdGlvbjxUPikpKSk7XG59XG5cbi8qKlxuICogQ29tYmluZXMgdGhlIHRvdGFsIHJlc3VsdCBzZXQgZnJvbSB0aGUgY3VycmVudCBzZXQgb2YgY2hhbmdlcyBmcm9tIGFuIGluY29taW5nIHNldFxuICogb2YgY2hhbmdlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVDaGFuZ2VzPFQ+KGN1cnJlbnQ6IERvY3VtZW50Q2hhbmdlPFQ+W10sIGNoYW5nZXM6IERvY3VtZW50Q2hhbmdlPFQ+W10sIGV2ZW50czogRG9jdW1lbnRDaGFuZ2VUeXBlW10pIHtcbiAgY2hhbmdlcy5mb3JFYWNoKGNoYW5nZSA9PiB7XG4gICAgLy8gc2tpcCB1bndhbnRlZCBjaGFuZ2UgdHlwZXNcbiAgICBpZiAoZXZlbnRzLmluZGV4T2YoY2hhbmdlLnR5cGUpID4gLTEpIHtcbiAgICAgIGN1cnJlbnQgPSBjb21iaW5lQ2hhbmdlKGN1cnJlbnQsIGNoYW5nZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbi8qKlxuICogU3BsaWNlIGFyZ3VtZW50cyBvbiB0b3Agb2YgYSBzbGljZWQgYXJyYXksIHRvIGJyZWFrIHRvcC1sZXZlbCA9PT1cbiAqIHRoaXMgaXMgdXNlZnVsIGZvciBjaGFuZ2UtZGV0ZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIHNsaWNlQW5kU3BsaWNlPFQ+KFxuICBvcmlnaW5hbDogVFtdLFxuICBzdGFydDogbnVtYmVyLFxuICBkZWxldGVDb3VudDogbnVtYmVyLFxuICAuLi5hcmdzOiBUW11cbik6IFRbXSB7XG4gIGNvbnN0IHJldHVybkFycmF5ID0gb3JpZ2luYWwuc2xpY2UoKTtcbiAgcmV0dXJuQXJyYXkuc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uYXJncyk7XG4gIHJldHVybiByZXR1cm5BcnJheTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHNvcnRlZCBhcnJheSBmcm9tIGEgbmV3IGNoYW5nZS5cbiAqIEJ1aWxkIG91ciBvd24gYmVjYXVzZSB3ZSBhbGxvdyBmaWx0ZXJpbmcgb2YgYWN0aW9uIHR5cGVzICgnYWRkZWQnLCAncmVtb3ZlZCcsICdtb2RpZmllZCcpIGJlZm9yZSBzY2FubmluZ1xuICogYW5kIHNvIHdlIGhhdmUgZ3JlYXRlciBjb250cm9sIG92ZXIgY2hhbmdlIGRldGVjdGlvbiAoYnkgYnJlYWtpbmcgPT09KVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUNoYW5nZTxUPihjb21iaW5lZDogRG9jdW1lbnRDaGFuZ2U8VD5bXSwgY2hhbmdlOiBEb2N1bWVudENoYW5nZTxUPik6IERvY3VtZW50Q2hhbmdlPFQ+W10ge1xuICBzd2l0Y2ggKGNoYW5nZS50eXBlKSB7XG4gICAgY2FzZSAnYWRkZWQnOlxuICAgICAgaWYgKGNvbWJpbmVkW2NoYW5nZS5uZXdJbmRleF0gJiYgY29tYmluZWRbY2hhbmdlLm5ld0luZGV4XS5kb2MucmVmLmlzRXF1YWwoY2hhbmdlLmRvYy5yZWYpKSB7XG4gICAgICAgIC8vIE5vdCBzdXJlIHdoeSB0aGUgZHVwbGljYXRlcyBhcmUgZ2V0dGluZyBmaXJlZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNsaWNlQW5kU3BsaWNlKGNvbWJpbmVkLCBjaGFuZ2UubmV3SW5kZXgsIDAsIGNoYW5nZSk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdtb2RpZmllZCc6XG4gICAgICBpZiAoY29tYmluZWRbY2hhbmdlLm9sZEluZGV4XSA9PSBudWxsIHx8IGNvbWJpbmVkW2NoYW5nZS5vbGRJbmRleF0uZG9jLnJlZi5pc0VxdWFsKGNoYW5nZS5kb2MucmVmKSkge1xuICAgICAgICAvLyBXaGVuIGFuIGl0ZW0gY2hhbmdlcyBwb3NpdGlvbiB3ZSBmaXJzdCByZW1vdmUgaXRcbiAgICAgICAgLy8gYW5kIHRoZW4gYWRkIGl0J3MgbmV3IHBvc2l0aW9uXG4gICAgICAgIGlmIChjaGFuZ2Uub2xkSW5kZXggIT09IGNoYW5nZS5uZXdJbmRleCkge1xuICAgICAgICAgIGNvbnN0IGNvcGllZEFycmF5ID0gY29tYmluZWQuc2xpY2UoKTtcbiAgICAgICAgICBjb3BpZWRBcnJheS5zcGxpY2UoY2hhbmdlLm9sZEluZGV4LCAxKTtcbiAgICAgICAgICBjb3BpZWRBcnJheS5zcGxpY2UoY2hhbmdlLm5ld0luZGV4LCAwLCBjaGFuZ2UpO1xuICAgICAgICAgIHJldHVybiBjb3BpZWRBcnJheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc2xpY2VBbmRTcGxpY2UoY29tYmluZWQsIGNoYW5nZS5uZXdJbmRleCwgMSwgY2hhbmdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmVtb3ZlZCc6XG4gICAgICBpZiAoY29tYmluZWRbY2hhbmdlLm9sZEluZGV4XSAmJiBjb21iaW5lZFtjaGFuZ2Uub2xkSW5kZXhdLmRvYy5yZWYuaXNFcXVhbChjaGFuZ2UuZG9jLnJlZikpIHtcbiAgICAgICAgcmV0dXJuIHNsaWNlQW5kU3BsaWNlKGNvbWJpbmVkLCBjaGFuZ2Uub2xkSW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGNvbWJpbmVkO1xufVxuIl19