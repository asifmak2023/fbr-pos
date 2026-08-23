import { Bt as computed, Do as ɵɵgetInheritedFactory, Ec as Injector, El as ɵɵdefineInjector, En as ElementRef, Fn as Injectable, Hc as RuntimeError, In as Input, Jo as ɵɵlistener, O as booleanAttribute, Pc as NgZone, Rl as Subject, T as afterRenderEffect, Tc as InjectionToken, Tl as ɵɵdefineInjectable, Ui as setClassMetadata, Wt as linkedSignal, X as input, ba as ɵɵclassProp, bl as signal, ca as ɵɵNgOnChangesFeature, dc as CSP_NONCE, dr as Service, el as effect, ia as ɵɵControlFeature, io as ɵɵdefineService, ir as Renderer2, la as ɵɵProvidersFeature, ll as isSignal, mc as DestroyRef, nl as forwardRef, no as ɵɵdefineNgModule, ol as inject, pc as DOCUMENT, po as ɵɵdomProperty, qn as NgModule, qt as untracked, tl as formatRuntimeError, to as ɵɵdefineDirective, va as ɵɵattribute, wn as Directive } from "./core-Cj36f57E.js";
import { i as Platform } from "./_element-chunk-DcYdKqvP.js";
import "./_animation-chunk-CbfcHZtY.js";
import { t as BidiModule } from "./bidi-o5kaxX9M.js";
import { AutofillMonitor, TextFieldModule } from "./@angular_cdk_text-field.js";
import { FormGroupDirective, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, NgForm, Validators, ɵFORM_CONTROL_INTEGRATION, ɵelementAcceptsMinMax as elementAcceptsMinMax, ɵisNativeFormElement as isNativeFormElement, ɵisTextualFormElement as isTextualFormElement, ɵselectValueAccessor as selectValueAccessor, ɵsetNativeDomProperty as setNativeDomProperty } from "./@angular_forms.js";
import { t as _IdGenerator } from "./_id-generator-chunk-CkVHDR5M.js";
import { t as getSupportedInputTypes } from "./platform-CCKEo4ei.js";
import { _ as coerceBooleanProperty, c as MatFormField, d as MatLabel, f as MatPrefix, l as MatFormFieldControl, p as MatSuffix, r as MAT_FORM_FIELD, s as MatError, t as MatFormFieldModule, u as MatHint } from "./form-field-n-8BV3gZ.js";
//#region node_modules/@angular/forms/fesm2022/_validation_errors-chunk.mjs
/**
* @license Angular v22.1.2
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
function isArray(value) {
	return Array.isArray(value);
}
var MetadataReducer = {
	list() {
		return {
			reduce: (acc, item) => item === void 0 ? acc : [...acc, item],
			getInitial: () => []
		};
	},
	min() {
		return {
			reduce: (acc, item) => {
				if (acc === void 0 || item === void 0) return acc ?? item;
				return item < acc ? item : acc;
			},
			getInitial: () => void 0
		};
	},
	max() {
		return {
			reduce: (acc, item) => {
				if (acc === void 0 || item === void 0) return acc ?? item;
				return item > acc ? item : acc;
			},
			getInitial: () => void 0
		};
	},
	or() {
		return {
			reduce: (prev, next) => prev || next,
			getInitial: () => false
		};
	},
	and() {
		return {
			reduce: (prev, next) => prev && next,
			getInitial: () => true
		};
	},
	override
};
function override(getInitial) {
	return {
		reduce: (_, item) => item,
		getInitial: () => getInitial?.()
	};
}
var IS_ASYNC_VALIDATION_RESOURCE = Symbol("IS_ASYNC_VALIDATION_RESOURCE");
var MetadataKey = class {
	reducer;
	create;
	brand;
	[IS_ASYNC_VALIDATION_RESOURCE];
	constructor(reducer, create) {
		this.reducer = reducer;
		this.create = create;
	}
};
function createMetadataKey(reducer) {
	return new MetadataKey(reducer ?? MetadataReducer.override());
}
function createLimitSelectionKey() {
	return createMetadataKey();
}
createMetadataKey(MetadataReducer.or());
createLimitSelectionKey();
createMetadataKey(MetadataReducer.max());
createMetadataKey(MetadataReducer.max());
createLimitSelectionKey();
createMetadataKey(MetadataReducer.min());
createMetadataKey(MetadataReducer.min());
createMetadataKey(MetadataReducer.max());
createMetadataKey(MetadataReducer.min());
createMetadataKey(MetadataReducer.list());
function shallowArrayEquals(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
	return true;
}
function addDefaultField(errors, fieldTree) {
	if (isArray(errors)) for (const error of errors) error.fieldTree ??= fieldTree;
	else if (errors) errors.fieldTree ??= fieldTree;
	return errors;
}
createMetadataKey();
computed(() => false, ...ngDevMode ? [{ debugName: "FALSE_SIGNAL" }] : []);
computed(() => [], ...ngDevMode ? [{ debugName: "ROOT_PATH_KEYS" }] : []);
computed(() => {
	throw new RuntimeError(1905, ngDevMode && "The top-level field in the form has no parent.");
}, ...ngDevMode ? [{ debugName: "ROOT_KEY_IN_PARENT" }] : []);
computed(() => [], ...ngDevMode ? [{ debugName: "EMPTY" }] : []);
computed(() => false, ...ngDevMode ? [{ debugName: "FALSE" }] : []);
new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "REGISTER_WEBMCP_FORM" : "");
async function submit(form, options) {
	const node = untracked(form);
	if (untracked(node.submitState.submitting)) return false;
	const field = options === void 0 ? node.structure.root.fieldProxy : form;
	const detail = {
		root: node.structure.root.fieldProxy,
		submitted: form
	};
	options = typeof options === "function" ? { action: options } : options ?? node.structure.fieldManager.submitOptions;
	const action = options?.action;
	if (!action) throw new RuntimeError(1915, (typeof ngDevMode === "undefined" || ngDevMode) && "Cannot submit form with no submit action. Specify the action when creating the form, or as an additional argument to `submit()`.");
	node.markAsTouched();
	const onInvalid = options?.onInvalid;
	const shouldRun = shouldRunAction(node, options?.ignoreValidators);
	try {
		if (shouldRun) {
			node.submitState.selfSubmitting.set(true);
			const errors = await untracked(() => action?.(field, detail));
			errors && setSubmissionErrors(node, errors);
			return !errors || isArray(errors) && errors.length === 0;
		} else untracked(() => onInvalid?.(field, detail));
		return false;
	} finally {
		node.submitState.selfSubmitting.set(false);
	}
}
function shouldRunAction(node, ignoreValidators) {
	switch (ignoreValidators) {
		case "all": return true;
		case "none": return untracked(node.valid);
		default: return !untracked(node.invalid);
	}
}
function setSubmissionErrors(submittedField, errors) {
	if (!isArray(errors)) errors = [errors];
	const errorsByField = /* @__PURE__ */ new Map();
	for (const error of errors) {
		const errorWithField = addDefaultField(error, submittedField.fieldTree);
		const field = errorWithField.fieldTree();
		let fieldErrors = errorsByField.get(field);
		if (!fieldErrors) {
			fieldErrors = [];
			errorsByField.set(field, fieldErrors);
		}
		fieldErrors.push(errorWithField);
	}
	for (const [field, fieldErrors] of errorsByField) field.submitState.submissionErrors.set(fieldErrors);
}
var CompatValidationError = class {
	kind = "compat";
	control;
	fieldTree;
	context;
	message;
	constructor({ context, kind, control }) {
		this.context = context;
		this.kind = kind;
		this.control = control;
	}
};
function signalErrorsToValidationErrors(errors) {
	if (errors.length === 0) return null;
	const errObj = {};
	for (const error of errors) errObj[error.kind] = error instanceof CompatValidationError ? error.context : error;
	return errObj;
}
function reactiveErrorsToSignalErrors(errors, control) {
	if (errors === null) return [];
	return Object.entries(errors).map(([kind, context]) => {
		return new CompatValidationError({
			context,
			kind,
			control
		});
	});
}
//#endregion
//#region node_modules/@angular/forms/fesm2022/signals.mjs
/**
* @license Angular v22.1.2
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var SIGNAL_FORMS_CONFIG = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "SIGNAL_FORMS_CONFIG" : "");
function normalizeErrors(error) {
	if (error === void 0) return [];
	if (Array.isArray(error)) return error;
	return [error];
}
var BaseNgValidationError = class {
	__brand = void 0;
	kind = "";
	fieldTree;
	message;
	constructor(options) {
		if (options) Object.assign(this, options);
	}
};
var NativeInputParseError = class extends BaseNgValidationError {
	kind = "parse";
};
function createParser(getValue, setValue, parse) {
	const errors = linkedSignal({
		...ngDevMode ? { debugName: "errors" } : {},
		source: getValue,
		computation: () => [],
		equal: shallowArrayEquals
	});
	const setRawValue = (rawValue) => {
		const result = parse(rawValue);
		errors.set(normalizeErrors(result.error));
		if (result.value !== void 0) setValue(result.value);
		errors.set(normalizeErrors(result.error));
	};
	const reset = () => {
		errors.set([]);
	};
	return {
		errors: errors.asReadonly(),
		setRawValue,
		reset
	};
}
var InteropNgControl = class {
	field;
	constructor(field) {
		this.field = field;
	}
	control = this;
	get value() {
		return this.field().controlValue();
	}
	get valid() {
		return this.field().valid();
	}
	get invalid() {
		return this.field().invalid();
	}
	get pending() {
		return this.field().pending();
	}
	get disabled() {
		return this.field().disabled();
	}
	get enabled() {
		return !this.field().disabled();
	}
	get errors() {
		return signalErrorsToValidationErrors(this.field().errors());
	}
	get pristine() {
		return !this.field().dirty();
	}
	get dirty() {
		return this.field().dirty();
	}
	get touched() {
		return this.field().touched();
	}
	get untouched() {
		return !this.field().touched();
	}
	get status() {
		if (this.field().disabled()) return "DISABLED";
		if (this.field().valid()) return "VALID";
		if (this.field().invalid()) return "INVALID";
		if (this.field().pending()) return "PENDING";
		throw new RuntimeError(1910, ngDevMode && "Unknown form control status");
	}
	valueAccessor = null;
	hasValidator(validator) {
		if (validator === Validators.required) return this.field().required();
		return false;
	}
	updateValueAndValidity() {}
};
var FIELD_STATE_KEY_TO_CONTROL_BINDING = {
	disabled: "disabled",
	disabledReasons: "disabledReasons",
	dirty: "dirty",
	errors: "errors",
	hidden: "hidden",
	invalid: "invalid",
	max: "max",
	maxLength: "maxLength",
	min: "min",
	minLength: "minLength",
	name: "name",
	pattern: "pattern",
	pending: "pending",
	readonly: "readonly",
	required: "required",
	touched: "touched"
};
var CONTROL_BINDING_TO_FIELD_STATE_KEY = /* @__PURE__ */ (() => {
	const map = {};
	for (const key of Object.keys(FIELD_STATE_KEY_TO_CONTROL_BINDING)) map[FIELD_STATE_KEY_TO_CONTROL_BINDING[key]] = key;
	return map;
})();
function readFieldStateBindingValue(fieldState, key) {
	return fieldState[CONTROL_BINDING_TO_FIELD_STATE_KEY[key]]?.();
}
var CONTROL_BINDING_NAMES = /* @__PURE__ */ (() => Object.values(FIELD_STATE_KEY_TO_CONTROL_BINDING))();
function createBindings() {
	return {};
}
function bindingUpdated(bindings, key, value) {
	if (bindings[key] !== value) {
		bindings[key] = value;
		return true;
	}
	return false;
}
function getNativeControlValue(element, currentValue, validityMonitor) {
	let modelValue;
	if (isInput(element) && validityMonitor.isBadInput(element)) return { error: new NativeInputParseError() };
	switch (element.type) {
		case "checkbox": return { value: element.checked };
		case "number":
		case "range":
		case "datetime-local":
			modelValue = untracked(currentValue);
			if (typeof modelValue === "number" || modelValue === null) return { value: element.value === "" ? null : element.valueAsNumber };
			break;
		case "date":
		case "month":
		case "time":
		case "week":
			modelValue = untracked(currentValue);
			if (modelValue === null || modelValue instanceof Date) return { value: element.valueAsDate };
			else if (typeof modelValue === "number") return { value: element.valueAsNumber };
			break;
	}
	if (element.tagName === "INPUT" && element.type === "text") {
		modelValue ??= untracked(currentValue);
		if (typeof modelValue === "number" || modelValue === null) {
			if (element.value === "") return { value: null };
			const parsed = Number(element.value);
			if (Number.isNaN(parsed)) return { error: new NativeInputParseError() };
			return { value: parsed };
		}
	}
	return { value: element.value };
}
function setNativeControlValue(element, value) {
	switch (element.type) {
		case "checkbox":
			element.checked = value;
			return;
		case "radio":
			element.checked = value === element.value;
			return;
		case "number":
		case "range":
		case "datetime-local":
			if (typeof value === "number") {
				setNativeNumberControlValue(element, value);
				return;
			} else if (value === null) {
				element.value = "";
				return;
			}
			break;
		case "date":
		case "month":
		case "time":
		case "week": if (value === null || value instanceof Date) {
			element.valueAsDate = value;
			return;
		} else if (typeof value === "number") {
			setNativeNumberControlValue(element, value);
			return;
		}
	}
	if (element.tagName === "INPUT" && element.type === "text") {
		if (typeof value === "number") {
			element.value = isNaN(value) ? "" : String(value);
			return;
		}
		if (value === null) {
			if (typeof ngDevMode !== "undefined" && ngDevMode) console.warn(formatRuntimeError(1921, `The text input ${element.name} received a null value. Text inputs should use empty strings to represent null values.  The input's value will be set to an empty string instead.`));
			element.value = "";
			return;
		}
	}
	element.value = value;
}
function setNativeNumberControlValue(element, value) {
	if (isNaN(value)) element.value = "";
	else element.valueAsNumber = value;
}
function isInput(element) {
	return element.tagName === "INPUT";
}
function inputRequiresValidityTracking(input) {
	return input.type === "date" || input.type === "datetime-local" || input.type === "month" || input.type === "time" || input.type === "week";
}
function formatDateForInput(date, type) {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	if (type === "month") return `${year}-${month}`;
	return `${year}-${month}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
function formatDateForMinMax(name, value, type) {
	if (value instanceof Date && (name === "min" || name === "max") && (type === "date" || type === "month")) return formatDateForInput(value, type);
	return value;
}
function customControlCreate(host, parent) {
	host.listenToCustomControlModel((value) => parent.state().controlValue.set(value));
	host.listenToCustomControlOutput("touch", () => parent.state().markAsTouched());
	parent.registerAsBinding(host.customControl);
	const bindings = createBindings();
	return () => {
		const state = parent.state();
		const controlValue = state.controlValue();
		if (bindingUpdated(bindings, "controlValue", controlValue)) host.setCustomControlModelInput(controlValue);
		for (const name of CONTROL_BINDING_NAMES) {
			let value;
			if (name === "errors") value = parent.errors();
			else value = readFieldStateBindingValue(state, name);
			if (bindingUpdated(bindings, name, value)) {
				host.setInputOnDirectives(name, value);
				if (parent.elementAcceptsNativeProperty(name) && !host.customControlHasInput(name)) {
					const domValue = formatDateForMinMax(name, value, parent.nativeFormElement.type);
					setNativeDomProperty(parent.renderer, parent.nativeFormElement, name, domValue);
				}
			}
		}
	};
}
function isValidatorObject(v) {
	return typeof v === "object" && v !== null;
}
function cvaControlCreate(host, parent) {
	const bindings = createBindings();
	parent.controlValueAccessor.registerOnChange((value) => {
		bindings["controlValue"] = value;
		parent.state().controlValue.set(value);
	});
	parent.controlValueAccessor.registerOnTouched(() => parent.state().markAsTouched());
	const legacyValidators = parent.injector.get(NG_VALIDATORS, null, {
		optional: true,
		self: true
	});
	if (legacyValidators) {
		let version;
		for (const v of legacyValidators) if (isValidatorObject(v) && v.registerOnValidatorChange) {
			version ??= signal(0);
			v.registerOnValidatorChange(() => {
				version.update((n) => n + 1);
			});
		}
		const validatorFns = legacyValidators.map((v) => typeof v === "function" ? v : v.validate.bind(v));
		const mergedValidator = Validators.compose(validatorFns);
		const parseErrors = computed(() => {
			version?.();
			return reactiveErrorsToSignalErrors(mergedValidator ? mergedValidator(parent.interopNgControl.control) : null, parent.interopNgControl.control);
		}, ...ngDevMode ? [{ debugName: "parseErrors" }] : []);
		parent.parseErrorsSource.set(parseErrors);
	}
	parent.registerAsBinding({ reset: () => {
		const value = parent.state().value();
		bindings["controlValue"] = value;
		untracked(() => parent.controlValueAccessor.writeValue(value));
	} });
	return () => {
		const fieldState = parent.state();
		const controlValue = fieldState.controlValue();
		if (bindingUpdated(bindings, "controlValue", controlValue)) untracked(() => parent.controlValueAccessor.writeValue(controlValue));
		for (const name of CONTROL_BINDING_NAMES) {
			const value = readFieldStateBindingValue(fieldState, name);
			if (bindingUpdated(bindings, name, value)) {
				const propertyWasSet = host.setInputOnDirectives(name, value);
				if (name === "disabled" && parent.controlValueAccessor.setDisabledState) untracked(() => parent.controlValueAccessor.setDisabledState(value));
				else if (!propertyWasSet && parent.elementAcceptsNativeProperty(name)) setNativeDomProperty(parent.renderer, parent.nativeFormElement, name, value);
			}
		}
	};
}
function observeSelectMutations(select, onMutation, destroyRef) {
	if (typeof MutationObserver !== "function") return;
	const observer = new MutationObserver((mutations) => {
		if (mutations.some((m) => isRelevantSelectMutation(m))) onMutation();
	});
	observer.observe(select, {
		attributes: true,
		attributeFilter: ["value"],
		characterData: true,
		childList: true,
		subtree: true
	});
	destroyRef.onDestroy(() => observer.disconnect());
}
function isRelevantSelectMutation(mutation) {
	if (mutation.type === "childList" || mutation.type === "characterData") {
		if (mutation.target instanceof Comment) return false;
		for (const node of mutation.addedNodes) if (!(node instanceof Comment)) return true;
		for (const node of mutation.removedNodes) if (!(node instanceof Comment)) return true;
		return false;
	}
	if (mutation.type === "attributes" && mutation.target instanceof HTMLOptionElement) return true;
	return false;
}
function nativeControlCreate(host, parent, parseErrorsSource, validityMonitor) {
	let updateMode = false;
	const input = parent.nativeFormElement;
	const parser = createParser(() => parent.state().value(), (rawValue) => parent.state().controlValue.set(rawValue), (_rawValue) => getNativeControlValue(input, parent.state().value, validityMonitor));
	parseErrorsSource.set(parser.errors);
	parent.onReset = () => {
		parser.reset();
		const value = parent.state().value();
		bindings["controlValue"] = value;
		setNativeControlValue(input, value);
	};
	host.listenToDom("input", () => parser.setRawValue(void 0));
	host.listenToDom("blur", () => parent.state().markAsTouched());
	if (isInput(input) && inputRequiresValidityTracking(input)) validityMonitor.watchValidity(parent.destroyRef, input, () => parser.setRawValue(void 0));
	parent.registerAsBinding();
	if (input.tagName === "SELECT") observeSelectMutations(input, () => {
		if (!updateMode) return;
		input.value = parent.state().controlValue();
	}, parent.destroyRef);
	const bindings = createBindings();
	return () => {
		const state = parent.state();
		for (const name of CONTROL_BINDING_NAMES) {
			const value = readFieldStateBindingValue(state, name);
			if (bindingUpdated(bindings, name, value)) {
				host.setInputOnDirectives(name, value);
				if (parent.elementAcceptsNativeProperty(name)) {
					const domValue = formatDateForMinMax(name, value, input.type);
					setNativeDomProperty(parent.renderer, input, name, domValue);
				}
			}
		}
		const controlValue = state.controlValue();
		const controlValueChanged = bindingUpdated(bindings, "controlValue", controlValue);
		const radioValueChanged = input.type === "radio" && bindingUpdated(bindings, "radioValue", input.value);
		if (controlValueChanged || radioValueChanged) setNativeControlValue(input, controlValue);
		updateMode = true;
	};
}
var InputValidityMonitor = class InputValidityMonitor {
	static ɵfac = function InputValidityMonitor_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || InputValidityMonitor)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
		token: InputValidityMonitor,
		factory: (__ngFactoryType__) => AnimationInputValidityMonitor.ɵfac(__ngFactoryType__),
		providedIn: "root"
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputValidityMonitor, [{
		type: Injectable,
		args: [{
			providedIn: "root",
			useClass: forwardRef(() => AnimationInputValidityMonitor)
		}]
	}], null, null);
})();
var AnimationInputValidityMonitor = class AnimationInputValidityMonitor extends InputValidityMonitor {
	document = inject(DOCUMENT);
	cspNonce = inject(CSP_NONCE, { optional: true });
	injectedStyles = /* @__PURE__ */ new WeakMap();
	watchValidity(destroyRef, element, callback) {
		const rootNode = element.getRootNode();
		if (!this.injectedStyles.has(rootNode)) this.injectedStyles.set(rootNode, this.createTransitionStyle(rootNode));
		const onAnimationStart = (event) => {
			const animationEvent = event;
			if (animationEvent.animationName === "ng-valid" || animationEvent.animationName === "ng-invalid") callback();
		};
		element.addEventListener("animationstart", onAnimationStart);
		destroyRef.onDestroy(() => {
			element.removeEventListener("animationstart", onAnimationStart);
		});
	}
	isBadInput(element) {
		return element.validity?.badInput ?? false;
	}
	createTransitionStyle(rootNode) {
		const element = this.document.createElement("style");
		if (this.cspNonce) element.nonce = this.cspNonce;
		element.textContent = `
      @keyframes ng-valid {}
      @keyframes ng-invalid {}
      input:valid, textarea:valid {
        animation: ng-valid 0.001s;
      }
      input:invalid, textarea:invalid {
        animation: ng-invalid 0.001s;
      }
    `;
		if (rootNode.nodeType === 9) rootNode.head?.appendChild(element);
		else rootNode.appendChild(element);
		return element;
	}
	ngOnDestroy() {
		this.injectedStyles.get(this.document)?.remove();
	}
	static ɵfac = /* @__PURE__ */ (() => {
		let ɵAnimationInputValidityMonitor_BaseFactory;
		return function AnimationInputValidityMonitor_Factory(__ngFactoryType__) {
			return (ɵAnimationInputValidityMonitor_BaseFactory || (ɵAnimationInputValidityMonitor_BaseFactory = ɵɵgetInheritedFactory(AnimationInputValidityMonitor)))(__ngFactoryType__ || AnimationInputValidityMonitor);
		};
	})();
	static ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
		token: AnimationInputValidityMonitor,
		factory: AnimationInputValidityMonitor.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationInputValidityMonitor, [{ type: Injectable }], null, null);
})();
var ɵNgFieldDirective = Symbol();
var FORM_FIELD = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "FORM_FIELD" : "");
var FormField = class FormField {
	field = input.required({
		...ngDevMode ? { debugName: "field" } : {},
		alias: "formField"
	});
	state = computed(() => this.field()(), ...ngDevMode ? [{ debugName: "state" }] : []);
	renderer = inject(Renderer2);
	destroyRef = inject(DestroyRef);
	injector = inject(Injector);
	element = inject(ElementRef).nativeElement;
	elementIsNativeFormElement = isNativeFormElement(this.element);
	elementAcceptsTextualValues = isTextualFormElement(this.element);
	_elementAcceptsMinMax;
	nativeFormElement = this.elementIsNativeFormElement ? this.element : void 0;
	focuser = (options) => this.element.focus(options);
	controlValueAccessors = inject(NG_VALUE_ACCESSOR, {
		optional: true,
		self: true
	});
	config = inject(SIGNAL_FORMS_CONFIG, { optional: true });
	validityMonitor = inject(InputValidityMonitor);
	parseErrorsSource = signal(void 0, ...ngDevMode ? [{ debugName: "parseErrorsSource" }] : []);
	_interopNgControl;
	get interopNgControl() {
		return this._interopNgControl ??= new InteropNgControl(this.state);
	}
	parseErrors = computed(() => this.parseErrorsSource()?.().map((err) => ({
		...err,
		fieldTree: untracked(this.state).fieldTree,
		formField: this
	})) ?? [], {
		...ngDevMode ? { debugName: "parseErrors" } : {},
		equal: shallowArrayEquals
	});
	errors = computed(() => this.state().errors().filter((err) => !err.formField || err.formField === this), {
		...ngDevMode ? { debugName: "errors" } : {},
		equal: shallowArrayEquals
	});
	isFieldBinding = false;
	resetter = () => {};
	parseErrorsResetCallback;
	setParseErrors(source) {
		this.parseErrorsSource.set(source);
	}
	set onReset(callback) {
		this.parseErrorsResetCallback = callback;
	}
	get onReset() {
		return this.parseErrorsResetCallback;
	}
	get controlValueAccessor() {
		if (!this.controlValueAccessors || this.controlValueAccessors.length === 0) return this.interopNgControl?.valueAccessor ?? void 0;
		return selectValueAccessor(this.interopNgControl, this.controlValueAccessors) ?? void 0;
	}
	installClassBindingEffect() {
		const classes = Object.entries(this.config?.classes ?? {}).map(([className, computation]) => [className, computed(() => computation(this))]);
		if (classes.length === 0) return;
		const bindings = createBindings();
		afterRenderEffect({ write: () => {
			for (const [className, computation] of classes) {
				const active = computation();
				if (bindingUpdated(bindings, className, active)) if (active) this.renderer.addClass(this.element, className);
				else this.renderer.removeClass(this.element, className);
			}
		} }, { injector: this.injector });
	}
	focus(options) {
		this.focuser(options);
	}
	reset() {
		this.resetter();
		this.parseErrorsResetCallback?.(this.state().value());
	}
	registerAsBinding(bindingOptions) {
		if (this.isFieldBinding) throw new RuntimeError(1913, typeof ngDevMode !== "undefined" && ngDevMode && "FormField already registered as a binding");
		this.isFieldBinding = true;
		this.installClassBindingEffect();
		if (bindingOptions?.focus) this.focuser = (focusOptions) => bindingOptions.focus(focusOptions);
		if (bindingOptions?.reset) this.resetter = () => bindingOptions.reset();
		effect((onCleanup) => {
			const fieldNode = this.state();
			fieldNode.nodeState.formFieldBindings.update((controls) => [...controls, this]);
			onCleanup(() => {
				fieldNode.nodeState.formFieldBindings.update((controls) => controls.filter((c) => c !== this));
			});
		}, { injector: this.injector });
		if (typeof ngDevMode !== "undefined" && ngDevMode) effect(() => {
			const fieldNode = this.state();
			if (fieldNode.hidden()) {
				const path = fieldNode.structure.pathKeys().join(".") || "<root>";
				console.warn(formatRuntimeError(1916, `Field '${path}' is hidden but is being rendered. Hidden fields should be removed from the DOM using @if.`));
			}
		}, { injector: this.injector });
	}
	[ɵNgFieldDirective];
	ɵngControlCreate(host) {
		if (host.hasPassThrough) return;
		if (this.controlValueAccessor) this.ɵngControlUpdate = cvaControlCreate(host, this);
		else if (host.customControl) this.ɵngControlUpdate = customControlCreate(host, this);
		else if (this.elementIsNativeFormElement) this.ɵngControlUpdate = nativeControlCreate(host, this, this.parseErrorsSource, this.validityMonitor);
		else throw new RuntimeError(1914, typeof ngDevMode !== "undefined" && ngDevMode && `${host.descriptor} is an invalid [formField] directive host. The host must be a native form control (such as <input>', '<select>', or '<textarea>') or a custom form control with a 'value' or 'checked' model.`);
	}
	ɵngControlUpdate;
	elementAcceptsNativeProperty(key) {
		if (!this.elementIsNativeFormElement) return false;
		switch (key) {
			case "min":
			case "max": return this._elementAcceptsMinMax ??= elementAcceptsMinMax(this.element);
			case "minLength":
			case "maxLength": return this.elementAcceptsTextualValues;
			case "disabled":
			case "required":
			case "readonly":
			case "name": return true;
			default: return false;
		}
	}
	static ɵfac = function FormField_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || FormField)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: FormField,
		selectors: [[
			"",
			"formField",
			""
		]],
		inputs: { field: [
			1,
			"formField",
			"field"
		] },
		exportAs: ["formField"],
		features: [ɵɵProvidersFeature([
			{
				provide: FORM_FIELD,
				useExisting: FormField
			},
			{
				provide: NgControl,
				useFactory: () => inject(FormField).interopNgControl
			},
			{
				provide: ɵFORM_CONTROL_INTEGRATION,
				useFactory: () => inject(FORM_FIELD, { self: true })
			}
		]), ɵɵControlFeature("formField")]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormField, [{
		type: Directive,
		args: [{
			selector: "[formField]",
			exportAs: "formField",
			providers: [
				{
					provide: FORM_FIELD,
					useExisting: FormField
				},
				{
					provide: NgControl,
					useFactory: () => inject(FormField).interopNgControl
				},
				{
					provide: ɵFORM_CONTROL_INTEGRATION,
					useFactory: () => inject(FORM_FIELD, { self: true })
				}
			]
		}]
	}], null, { field: [{
		type: Input,
		args: [{
			isSignal: true,
			alias: "formField",
			required: true
		}]
	}] });
})();
var FormRoot = class FormRoot {
	fieldTree = input.required({
		...ngDevMode ? { debugName: "fieldTree" } : {},
		alias: "formRoot"
	});
	onSubmit(event) {
		event.preventDefault();
		untracked(() => {
			const fieldTree = this.fieldTree();
			if (fieldTree().structure.fieldManager.submitOptions) submit(fieldTree);
		});
	}
	static ɵfac = function FormRoot_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || FormRoot)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: FormRoot,
		selectors: [[
			"form",
			"formRoot",
			""
		]],
		hostAttrs: ["novalidate", ""],
		hostBindings: function FormRoot_HostBindings(rf, ctx) {
			if (rf & 1) ɵɵlistener("submit", function FormRoot_submit_HostBindingHandler($event) {
				return ctx.onSubmit($event);
			});
		},
		inputs: { fieldTree: [
			1,
			"formRoot",
			"fieldTree"
		] }
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormRoot, [{
		type: Directive,
		args: [{
			selector: "form[formRoot]",
			host: {
				"novalidate": "",
				"(submit)": "onSubmit($event)"
			}
		}]
	}], null, { fieldTree: [{
		type: Input,
		args: [{
			isSignal: true,
			alias: "formRoot",
			required: true
		}]
	}] });
})();
//#endregion
//#region node_modules/@angular/material/fesm2022/_input-value-accessor-chunk.mjs
var MAT_INPUT_VALUE_ACCESSOR = new InjectionToken("MAT_INPUT_VALUE_ACCESSOR");
//#endregion
//#region node_modules/@angular/material/fesm2022/_error-options-chunk.mjs
var ShowOnDirtyErrorStateMatcher = class ShowOnDirtyErrorStateMatcher {
	isErrorState(control, form) {
		return !!(control && control.invalid && (control.dirty || form && form.submitted));
	}
	isSignalErrorState(field) {
		if (!field) return false;
		const invalid = field().invalid();
		const dirty = field().dirty();
		return invalid && dirty;
	}
	static ɵfac = function ShowOnDirtyErrorStateMatcher_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ShowOnDirtyErrorStateMatcher)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: ShowOnDirtyErrorStateMatcher,
		factory: ShowOnDirtyErrorStateMatcher.ɵfac,
		autoProvided: false
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShowOnDirtyErrorStateMatcher, [{
		type: Service,
		args: [{ autoProvided: false }]
	}], null, null);
})();
var ErrorStateMatcher = class ErrorStateMatcher {
	isErrorState(control, form) {
		return !!(control && control.invalid && (control.touched || form && form.submitted));
	}
	isSignalErrorState(field) {
		if (!field) return false;
		const invalid = field().invalid();
		const touched = field().touched();
		return invalid && touched;
	}
	static ɵfac = function ErrorStateMatcher_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ErrorStateMatcher)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: ErrorStateMatcher,
		factory: ErrorStateMatcher.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorStateMatcher, [{ type: Service }], null, null);
})();
//#endregion
//#region node_modules/@angular/material/fesm2022/_error-state-chunk.mjs
var _ErrorStateTracker = class {
	_defaultMatcher;
	_parentFormGroup;
	_parentForm;
	_stateChanges;
	errorState = false;
	matcher;
	ngControl;
	formField;
	constructor(_defaultMatcher, directive, _parentFormGroup, _parentForm, _stateChanges) {
		this._defaultMatcher = _defaultMatcher;
		this._parentFormGroup = _parentFormGroup;
		this._parentForm = _parentForm;
		this._stateChanges = _stateChanges;
		if (!directive) this.ngControl = this.formField = null;
		else if (isSignal(directive.field) && !directive.updateValueAndValidity) {
			this.formField = directive;
			this.ngControl = null;
		} else {
			this.formField = null;
			this.ngControl = directive;
		}
	}
	updateErrorState() {
		const oldState = this.errorState;
		const newState = this._getCurrentErrorState(this.matcher || this._defaultMatcher);
		if (newState !== oldState) {
			this.errorState = newState;
			this._stateChanges.next();
		}
	}
	_getCurrentErrorState(matcher) {
		if (this.formField && matcher?.isSignalErrorState) return matcher.isSignalErrorState(this.formField.field()) ?? false;
		const parent = this._parentFormGroup || this._parentForm;
		const control = this.ngControl ? this.ngControl.control : null;
		return matcher?.isErrorState(control, parent) ?? false;
	}
};
//#endregion
//#region node_modules/@angular/material/fesm2022/input.mjs
function getMatInputUnsupportedTypeError(type) {
	return Error(`Input type "${type}" isn't supported by matInput.`);
}
var MAT_INPUT_INVALID_TYPES = [
	"button",
	"checkbox",
	"file",
	"hidden",
	"image",
	"radio",
	"range",
	"reset",
	"submit"
];
var MAT_INPUT_CONFIG = new InjectionToken("MAT_INPUT_CONFIG");
var MatInput = class MatInput {
	_elementRef = inject(ElementRef);
	_platform = inject(Platform);
	ngControl = inject(NgControl, {
		optional: true,
		self: true
	});
	_autofillMonitor = inject(AutofillMonitor);
	_ngZone = inject(NgZone);
	_formField = inject(MAT_FORM_FIELD, { optional: true });
	_renderer = inject(Renderer2);
	_uid = inject(_IdGenerator).getId("mat-input-");
	_previousNativeValue;
	_inputValueAccessor;
	_signalBasedValueAccessor;
	_previousPlaceholder = null;
	_errorStateTracker;
	_config = inject(MAT_INPUT_CONFIG, { optional: true });
	_cleanupIosKeyup;
	_cleanupWebkitWheel;
	_isServer = false;
	_isNativeSelect = false;
	_isTextarea = false;
	_isInFormField = false;
	focused = false;
	stateChanges = new Subject();
	controlType = "mat-input";
	autofilled = false;
	get disabled() {
		return this._disabled;
	}
	set disabled(value) {
		this._disabled = coerceBooleanProperty(value);
		if (this.focused) {
			this.focused = false;
			this.stateChanges.next();
		}
	}
	_disabled = false;
	get id() {
		return this._id;
	}
	set id(value) {
		this._id = value || this._uid;
	}
	_id;
	placeholder;
	name;
	get required() {
		return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
	}
	set required(value) {
		this._required = coerceBooleanProperty(value);
	}
	_required;
	get type() {
		return this._type;
	}
	set type(value) {
		this._type = value || "text";
		this._validateType();
		if (!this._isTextarea && getSupportedInputTypes().has(this._type)) this._elementRef.nativeElement.type = this._type;
	}
	_type = "text";
	get errorStateMatcher() {
		return this._errorStateTracker.matcher;
	}
	set errorStateMatcher(value) {
		this._errorStateTracker.matcher = value;
	}
	userAriaDescribedBy;
	get value() {
		return this._signalBasedValueAccessor ? this._signalBasedValueAccessor.value() : this._inputValueAccessor.value;
	}
	set value(value) {
		if (value !== this.value) {
			if (this._signalBasedValueAccessor) this._signalBasedValueAccessor.value.set(value);
			else this._inputValueAccessor.value = value;
			this.stateChanges.next();
		}
	}
	get readonly() {
		return this._readonly;
	}
	set readonly(value) {
		this._readonly = coerceBooleanProperty(value);
	}
	_readonly = false;
	disabledInteractive;
	get errorState() {
		return this._errorStateTracker.errorState;
	}
	set errorState(value) {
		this._errorStateTracker.errorState = value;
	}
	_neverEmptyInputTypes = [
		"date",
		"datetime",
		"datetime-local",
		"month",
		"time",
		"week"
	].filter((t) => getSupportedInputTypes().has(t));
	constructor() {
		const parentForm = inject(NgForm, { optional: true });
		const parentFormGroup = inject(FormGroupDirective, { optional: true });
		const defaultErrorStateMatcher = inject(ErrorStateMatcher);
		const accessor = inject(MAT_INPUT_VALUE_ACCESSOR, {
			optional: true,
			self: true
		});
		const formField = inject(FORM_FIELD, {
			optional: true,
			self: true
		});
		const element = this._elementRef.nativeElement;
		const nodeName = element.nodeName.toLowerCase();
		if (accessor) if (isSignal(accessor.value)) this._signalBasedValueAccessor = accessor;
		else this._inputValueAccessor = accessor;
		else this._inputValueAccessor = element;
		this._previousNativeValue = this.value;
		this.id = this.id;
		if (this._platform.IOS) this._ngZone.runOutsideAngular(() => {
			this._cleanupIosKeyup = this._renderer.listen(element, "keyup", this._iOSKeyupListener);
		});
		this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, formField || this.ngControl, parentFormGroup, parentForm, this.stateChanges);
		this._isServer = !this._platform.isBrowser;
		this._isNativeSelect = nodeName === "select";
		this._isTextarea = nodeName === "textarea";
		this._isInFormField = !!this._formField;
		this.disabledInteractive = this._config?.disabledInteractive || false;
		if (this._isNativeSelect) this.controlType = element.multiple ? "mat-native-select-multiple" : "mat-native-select";
		if (this._signalBasedValueAccessor) effect(() => {
			this._signalBasedValueAccessor.value();
			this.stateChanges.next();
		});
	}
	ngAfterViewInit() {
		if (this._platform.isBrowser) this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe((event) => {
			this.autofilled = event.isAutofilled;
			this.stateChanges.next();
		});
	}
	ngOnChanges() {
		this.stateChanges.next();
	}
	ngOnDestroy() {
		this.stateChanges.complete();
		if (this._platform.isBrowser) this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
		this._cleanupIosKeyup?.();
		this._cleanupWebkitWheel?.();
	}
	ngDoCheck() {
		if (this.ngControl) {
			this.updateErrorState();
			if (this.ngControl.disabled !== null && this.ngControl.disabled !== this.disabled) {
				this.disabled = this.ngControl.disabled;
				this.stateChanges.next();
			}
		}
		this._dirtyCheckNativeValue();
		this._dirtyCheckPlaceholder();
	}
	focus(options) {
		this._elementRef.nativeElement.focus(options);
	}
	updateErrorState() {
		this._errorStateTracker.updateErrorState();
	}
	_focusChanged(isFocused) {
		if (isFocused === this.focused) return;
		if (!this._isNativeSelect && isFocused && this.disabled && this.disabledInteractive) {
			const element = this._elementRef.nativeElement;
			if (element.type === "number") {
				element.type = "text";
				element.setSelectionRange(0, 0);
				element.type = "number";
			} else element.setSelectionRange(0, 0);
		}
		this.focused = isFocused;
		this.stateChanges.next();
	}
	_onInput() {}
	_dirtyCheckNativeValue() {
		const newValue = this._elementRef.nativeElement.value;
		if (this._previousNativeValue !== newValue) {
			this._previousNativeValue = newValue;
			this.stateChanges.next();
		}
	}
	_dirtyCheckPlaceholder() {
		const placeholder = this._getPlaceholder();
		if (placeholder !== this._previousPlaceholder) {
			const element = this._elementRef.nativeElement;
			this._previousPlaceholder = placeholder;
			placeholder ? element.setAttribute("placeholder", placeholder) : element.removeAttribute("placeholder");
		}
	}
	_getPlaceholder() {
		return this.placeholder || null;
	}
	_validateType() {
		if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1 && (typeof ngDevMode === "undefined" || ngDevMode)) throw getMatInputUnsupportedTypeError(this._type);
	}
	_isNeverEmpty() {
		return this._neverEmptyInputTypes.indexOf(this._type) > -1;
	}
	_isBadInput() {
		let validity = this._elementRef.nativeElement.validity;
		return validity && validity.badInput;
	}
	get empty() {
		return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() && !this.autofilled;
	}
	get shouldLabelFloat() {
		if (this._isNativeSelect) {
			const selectElement = this._elementRef.nativeElement;
			const firstOption = selectElement.options[0];
			return this.focused || selectElement.multiple || !this.empty || !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label);
		} else return this.focused && !this.disabled || !this.empty;
	}
	get describedByIds() {
		return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ") || [];
	}
	setDescribedByIds(ids) {
		const element = this._elementRef.nativeElement;
		if (ids.length) element.setAttribute("aria-describedby", ids.join(" "));
		else element.removeAttribute("aria-describedby");
	}
	onContainerClick() {
		if (!this.focused) this.focus();
	}
	_isInlineSelect() {
		const element = this._elementRef.nativeElement;
		return this._isNativeSelect && (element.multiple || element.size > 1);
	}
	_iOSKeyupListener = (event) => {
		const el = event.target;
		if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
			el.setSelectionRange(1, 1);
			el.setSelectionRange(0, 0);
		}
	};
	_getReadonlyAttribute() {
		if (this._isNativeSelect) return null;
		if (this.readonly || this.disabled && this.disabledInteractive) return "true";
		return null;
	}
	static ɵfac = function MatInput_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatInput)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: MatInput,
		selectors: [
			[
				"input",
				"matInput",
				""
			],
			[
				"textarea",
				"matInput",
				""
			],
			[
				"select",
				"matNativeControl",
				""
			],
			[
				"input",
				"matNativeControl",
				""
			],
			[
				"textarea",
				"matNativeControl",
				""
			]
		],
		hostAttrs: [1, "mat-mdc-input-element"],
		hostVars: 21,
		hostBindings: function MatInput_HostBindings(rf, ctx) {
			if (rf & 1) ɵɵlistener("focus", function MatInput_focus_HostBindingHandler() {
				return ctx._focusChanged(true);
			})("blur", function MatInput_blur_HostBindingHandler() {
				return ctx._focusChanged(false);
			})("input", function MatInput_input_HostBindingHandler() {
				return ctx._onInput();
			});
			if (rf & 2) {
				ɵɵdomProperty("id", ctx.id)("disabled", ctx.disabled && !ctx.disabledInteractive)("required", ctx.required);
				ɵɵattribute("name", ctx.name || null)("readonly", ctx._getReadonlyAttribute())("aria-disabled", ctx.disabled && ctx.disabledInteractive ? "true" : null)("aria-invalid", ctx.empty && ctx.required ? null : ctx.errorState)("aria-required", ctx.required)("id", ctx.id);
				ɵɵclassProp("mat-input-server", ctx._isServer)("mat-mdc-form-field-textarea-control", ctx._isInFormField && ctx._isTextarea)("mat-mdc-form-field-input-control", ctx._isInFormField)("mat-mdc-input-disabled-interactive", ctx.disabledInteractive)("mdc-text-field__input", ctx._isInFormField)("mat-mdc-native-select-inline", ctx._isInlineSelect());
			}
		},
		inputs: {
			disabled: "disabled",
			id: "id",
			placeholder: "placeholder",
			name: "name",
			required: "required",
			type: "type",
			errorStateMatcher: "errorStateMatcher",
			userAriaDescribedBy: [
				0,
				"aria-describedby",
				"userAriaDescribedBy"
			],
			value: "value",
			readonly: "readonly",
			disabledInteractive: [
				2,
				"disabledInteractive",
				"disabledInteractive",
				booleanAttribute
			]
		},
		exportAs: ["matInput"],
		features: [ɵɵProvidersFeature([{
			provide: MatFormFieldControl,
			useExisting: MatInput
		}]), ɵɵNgOnChangesFeature]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatInput, [{
		type: Directive,
		args: [{
			selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
			exportAs: "matInput",
			host: {
				"class": "mat-mdc-input-element",
				"[class.mat-input-server]": "_isServer",
				"[class.mat-mdc-form-field-textarea-control]": "_isInFormField && _isTextarea",
				"[class.mat-mdc-form-field-input-control]": "_isInFormField",
				"[class.mat-mdc-input-disabled-interactive]": "disabledInteractive",
				"[class.mdc-text-field__input]": "_isInFormField",
				"[class.mat-mdc-native-select-inline]": "_isInlineSelect()",
				"[id]": "id",
				"[disabled]": "disabled && !disabledInteractive",
				"[required]": "required",
				"[attr.name]": "name || null",
				"[attr.readonly]": "_getReadonlyAttribute()",
				"[attr.aria-disabled]": "disabled && disabledInteractive ? \"true\" : null",
				"[attr.aria-invalid]": "(empty && required) ? null : errorState",
				"[attr.aria-required]": "required",
				"[attr.id]": "id",
				"(focus)": "_focusChanged(true)",
				"(blur)": "_focusChanged(false)",
				"(input)": "_onInput()"
			},
			providers: [{
				provide: MatFormFieldControl,
				useExisting: MatInput
			}]
		}]
	}], () => [], {
		disabled: [{ type: Input }],
		id: [{ type: Input }],
		placeholder: [{ type: Input }],
		name: [{ type: Input }],
		required: [{ type: Input }],
		type: [{ type: Input }],
		errorStateMatcher: [{ type: Input }],
		userAriaDescribedBy: [{
			type: Input,
			args: ["aria-describedby"]
		}],
		value: [{ type: Input }],
		readonly: [{ type: Input }],
		disabledInteractive: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}]
	});
})();
var MatInputModule = class MatInputModule {
	static ɵfac = function MatInputModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatInputModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: MatInputModule,
		imports: [MatFormFieldModule, MatInput],
		exports: [
			MatInput,
			MatFormFieldModule,
			TextFieldModule,
			BidiModule
		]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({ imports: [
		MatFormFieldModule,
		MatFormFieldModule,
		TextFieldModule,
		BidiModule
	] });
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatInputModule, [{
		type: NgModule,
		args: [{
			imports: [MatFormFieldModule, MatInput],
			exports: [
				MatInput,
				MatFormFieldModule,
				TextFieldModule,
				BidiModule
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_INPUT_CONFIG, MAT_INPUT_VALUE_ACCESSOR, MatError, MatFormField, MatHint, MatInput, MatInputModule, MatLabel, MatPrefix, MatSuffix, getMatInputUnsupportedTypeError };
