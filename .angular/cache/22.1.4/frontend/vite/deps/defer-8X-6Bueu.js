import { Hl as Observable } from "./core-Cj36f57E.js";
import { t as innerFrom } from "./innerFrom-CK5iyTdt.js";
//#region node_modules/rxjs/dist/esm5/internal/observable/defer.js
function defer(observableFactory) {
	return new Observable(function(subscriber) {
		innerFrom(observableFactory()).subscribe(subscriber);
	});
}
//#endregion
export { defer as t };
