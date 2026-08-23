import { Hl as Observable, Vl as operate, zl as createOperatorSubscriber } from "./core-Cj36f57E.js";
import { a as async, o as asyncScheduler } from "./_element-chunk-DcYdKqvP.js";
import { d as isScheduler, t as innerFrom } from "./innerFrom-CK5iyTdt.js";
//#region node_modules/rxjs/dist/esm5/internal/util/isDate.js
function isValidDate(value) {
	return value instanceof Date && !isNaN(value);
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/timer.js
function timer(dueTime, intervalOrScheduler, scheduler) {
	if (dueTime === void 0) dueTime = 0;
	if (scheduler === void 0) scheduler = async;
	var intervalDuration = -1;
	if (intervalOrScheduler != null) if (isScheduler(intervalOrScheduler)) scheduler = intervalOrScheduler;
	else intervalDuration = intervalOrScheduler;
	return new Observable(function(subscriber) {
		var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
		if (due < 0) due = 0;
		var n = 0;
		return scheduler.schedule(function() {
			if (!subscriber.closed) {
				subscriber.next(n++);
				if (0 <= intervalDuration) this.schedule(void 0, intervalDuration);
				else subscriber.complete();
			}
		}, due);
	});
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/operators/audit.js
function audit(durationSelector) {
	return operate(function(source, subscriber) {
		var hasValue = false;
		var lastValue = null;
		var durationSubscriber = null;
		var isComplete = false;
		var endDuration = function() {
			durationSubscriber === null || durationSubscriber === void 0 || durationSubscriber.unsubscribe();
			durationSubscriber = null;
			if (hasValue) {
				hasValue = false;
				var value = lastValue;
				lastValue = null;
				subscriber.next(value);
			}
			isComplete && subscriber.complete();
		};
		var cleanupDuration = function() {
			durationSubscriber = null;
			isComplete && subscriber.complete();
		};
		source.subscribe(createOperatorSubscriber(subscriber, function(value) {
			hasValue = true;
			lastValue = value;
			if (!durationSubscriber) innerFrom(durationSelector(value)).subscribe(durationSubscriber = createOperatorSubscriber(subscriber, endDuration, cleanupDuration));
		}, function() {
			isComplete = true;
			(!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
		}));
	});
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/operators/auditTime.js
function auditTime(duration, scheduler) {
	if (scheduler === void 0) scheduler = asyncScheduler;
	return audit(function() {
		return timer(duration, scheduler);
	});
}
//#endregion
export { auditTime as t };
