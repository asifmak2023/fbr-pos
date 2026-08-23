import { $n as Output, Do as ɵɵgetInheritedFactory, Dr as ViewEncapsulation, Ec as Injector, El as ɵɵdefineInjector, En as ElementRef, Er as ViewContainerRef, In as Input, Jo as ɵɵlistener, M as createComponent, Mr as afterNextRender, O as booleanAttribute, Pc as NgZone, Rl as Subject, S as ViewChild, Tc as InjectionToken, Ui as setClassMetadata, Vl as operate, Vs as ɵɵtemplate, Yl as Subscription, Yo as ɵɵloadQuery, Zn as NgModuleRef$1, _c as EnvironmentInjector, _s as ɵɵqueryRefresh, an as ChangeDetectionStrategy, ar as RendererFactory2, ba as ɵɵclassProp, bl as signal, bo as ɵɵelementStart, ca as ɵɵNgOnChangesFeature, cc as ANIMATION_MODULE_TYPE, cn as Component, dr as Service, eo as ɵɵdefineComponent, io as ɵɵdefineService, ir as Renderer2, no as ɵɵdefineNgModule, oa as ɵɵHostDirectivesFeature, oc as ɵɵviewQuery, ol as inject, pc as DOCUMENT, po as ɵɵdomProperty, qn as NgModule, r as ChangeDetectorRef, sa as ɵɵInheritDefinitionFeature, tn as ApplicationRef, to as ɵɵdefineDirective, va as ɵɵattribute, vr as TemplateRef, wn as Directive, yc as EventEmitter, yo as ɵɵelementEnd, zl as createOperatorSubscriber } from "./core-Cj36f57E.js";
import { a as ViewportRuler, i as ScrollingModule, n as CdkScrollable, r as ScrollDispatcher, u as supportsScrollBehavior } from "./scrolling-dPeORYh_.js";
import { i as Platform, r as coerceNumberProperty } from "./_element-chunk-DcYdKqvP.js";
import { i as ReplaySubject, r as merge } from "./shareReplay-HA9fjL2G.js";
import { n as filter } from "./switchMap-CiPnbaeJ.js";
import { n as startWith } from "./takeUntil-BUWJqkiC.js";
import { t as defer } from "./defer-8X-6Bueu.js";
import { i as InteractivityChecker, l as _getEventTarget, n as A11yModule, o as coerceArray, r as FocusTrapFactory, s as FocusMonitor, t as _animationsDisabled, u as _getFocusedElementPierceShadowDom } from "./_animation-chunk-CbfcHZtY.js";
import { t as take } from "./take-5I7nTeqq.js";
import { i as Directionality, t as BidiModule } from "./bidi-o5kaxX9M.js";
import { jt as Location } from "./common-DQ8YN2ls.js";
import { t as _CdkPrivateStyleLoader } from "./_style-loader-chunk-CjWrr17m.js";
import "./private-BGX-_Ziw.js";
import { t as _IdGenerator } from "./_id-generator-chunk-CkVHDR5M.js";
//#region node_modules/rxjs/dist/esm5/internal/operators/takeWhile.js
function takeWhile(predicate, inclusive) {
	if (inclusive === void 0) inclusive = false;
	return operate(function(source, subscriber) {
		var index = 0;
		source.subscribe(createOperatorSubscriber(subscriber, function(value) {
			var result = predicate(value, index++);
			(result || inclusive) && subscriber.next(value);
			!result && subscriber.complete();
		}));
	});
}
//#endregion
//#region node_modules/@angular/cdk/fesm2022/keycodes.mjs
function hasModifierKey(event, ...modifiers) {
	if (modifiers.length) return modifiers.some((modifier) => event[modifier]);
	return event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
}
//#endregion
//#region node_modules/@angular/cdk/fesm2022/_test-environment-chunk.mjs
function _isTestEnvironment() {
	return typeof __karma__ !== "undefined" && !!__karma__ || typeof jasmine !== "undefined" && !!jasmine || typeof jest !== "undefined" && !!jest || typeof Mocha !== "undefined" && !!Mocha;
}
//#endregion
//#region node_modules/@angular/cdk/fesm2022/_css-pixel-value-chunk.mjs
function coerceCssPixelValue(value) {
	if (value == null) return "";
	return typeof value === "string" ? value : `${value}px`;
}
//#endregion
//#region node_modules/@angular/cdk/fesm2022/portal.mjs
function throwNullPortalError() {
	throw Error("Must provide a portal to attach");
}
function throwPortalAlreadyAttachedError() {
	throw Error("Host already has a portal attached");
}
function throwPortalOutletAlreadyDisposedError() {
	throw Error("This PortalOutlet has already been disposed");
}
function throwUnknownPortalTypeError() {
	throw Error("Attempting to attach an unknown Portal type. BasePortalOutlet accepts either a ComponentPortal or a TemplatePortal.");
}
function throwNullPortalOutletError() {
	throw Error("Attempting to attach a portal to a null PortalOutlet");
}
function throwNoPortalAttachedError() {
	throw Error("Attempting to detach a portal that is not attached to a host");
}
var Portal = class {
	_attachedHost = null;
	attach(host) {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (host == null) throwNullPortalOutletError();
			if (host.hasAttached()) throwPortalAlreadyAttachedError();
		}
		this._attachedHost = host;
		return host.attach(this);
	}
	detach() {
		let host = this._attachedHost;
		if (host != null) {
			this._attachedHost = null;
			host.detach();
		} else if (typeof ngDevMode === "undefined" || ngDevMode) throwNoPortalAttachedError();
	}
	get isAttached() {
		return this._attachedHost != null;
	}
	setAttachedHost(host) {
		this._attachedHost = host;
	}
};
var ComponentPortal = class extends Portal {
	component;
	viewContainerRef;
	injector;
	projectableNodes;
	bindings;
	directives;
	constructor(component, viewContainerRef, injector, projectableNodes, bindings, directives) {
		super();
		this.component = component;
		this.viewContainerRef = viewContainerRef;
		this.injector = injector;
		this.projectableNodes = projectableNodes;
		this.bindings = bindings || null;
		this.directives = directives || null;
	}
};
var TemplatePortal = class extends Portal {
	templateRef;
	viewContainerRef;
	context;
	injector;
	constructor(templateRef, viewContainerRef, context, injector) {
		super();
		this.templateRef = templateRef;
		this.viewContainerRef = viewContainerRef;
		this.context = context;
		this.injector = injector;
	}
	get origin() {
		return this.templateRef.elementRef;
	}
	attach(host, context = this.context) {
		this.context = context;
		return super.attach(host);
	}
	detach() {
		this.context = void 0;
		return super.detach();
	}
};
var DomPortal = class extends Portal {
	element;
	constructor(element) {
		super();
		this.element = element instanceof ElementRef ? element.nativeElement : element;
	}
};
var BasePortalOutlet = class {
	_attachedPortal = null;
	_disposeFn = null;
	_isDisposed = false;
	hasAttached() {
		return !!this._attachedPortal;
	}
	attach(portal) {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (!portal) throwNullPortalError();
			if (this.hasAttached()) throwPortalAlreadyAttachedError();
			if (this._isDisposed) throwPortalOutletAlreadyDisposedError();
		}
		if (portal instanceof ComponentPortal) {
			this._attachedPortal = portal;
			return this.attachComponentPortal(portal);
		} else if (portal instanceof TemplatePortal) {
			this._attachedPortal = portal;
			return this.attachTemplatePortal(portal);
		} else if (this.attachDomPortal && portal instanceof DomPortal) {
			this._attachedPortal = portal;
			return this.attachDomPortal(portal);
		}
		if (typeof ngDevMode === "undefined" || ngDevMode) throwUnknownPortalTypeError();
	}
	attachDomPortal = null;
	detach() {
		if (this._attachedPortal) {
			this._attachedPortal.setAttachedHost(null);
			this._attachedPortal = null;
		}
		this._invokeDisposeFn();
	}
	dispose() {
		if (this.hasAttached()) this.detach();
		this._invokeDisposeFn();
		this._isDisposed = true;
	}
	setDisposeFn(fn) {
		this._disposeFn = fn;
	}
	_invokeDisposeFn() {
		if (this._disposeFn) {
			this._disposeFn();
			this._disposeFn = null;
		}
	}
};
var DomPortalOutlet = class extends BasePortalOutlet {
	outletElement;
	_appRef;
	_defaultInjector;
	constructor(outletElement, _appRef, _defaultInjector) {
		super();
		this.outletElement = outletElement;
		this._appRef = _appRef;
		this._defaultInjector = _defaultInjector;
	}
	attachComponentPortal(portal) {
		let componentRef;
		if (portal.viewContainerRef) {
			const injector = portal.injector || portal.viewContainerRef.injector;
			const ngModuleRef = injector.get(NgModuleRef$1, null, { optional: true }) || void 0;
			componentRef = portal.viewContainerRef.createComponent(portal.component, {
				index: portal.viewContainerRef.length,
				injector,
				ngModuleRef,
				projectableNodes: portal.projectableNodes || void 0,
				bindings: portal.bindings || void 0,
				directives: portal.directives || void 0
			});
			this.setDisposeFn(() => componentRef.destroy());
		} else {
			if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._appRef) throw Error("Cannot attach component portal to outlet without an ApplicationRef.");
			const appRef = this._appRef;
			const elementInjector = portal.injector || this._defaultInjector || Injector.NULL;
			const environmentInjector = elementInjector.get(EnvironmentInjector, appRef.injector);
			componentRef = createComponent(portal.component, {
				elementInjector,
				environmentInjector,
				projectableNodes: portal.projectableNodes || void 0,
				bindings: portal.bindings || void 0,
				directives: portal.directives || void 0
			});
			appRef.attachView(componentRef.hostView);
			this.setDisposeFn(() => {
				if (appRef.viewCount > 0) appRef.detachView(componentRef.hostView);
				componentRef.destroy();
			});
		}
		this.outletElement.appendChild(this._getComponentRootNode(componentRef));
		this._attachedPortal = portal;
		return componentRef;
	}
	attachTemplatePortal(portal) {
		let viewContainer = portal.viewContainerRef;
		let viewRef = viewContainer.createEmbeddedView(portal.templateRef, portal.context, { injector: portal.injector });
		viewRef.rootNodes.forEach((rootNode) => this.outletElement.appendChild(rootNode));
		viewRef.detectChanges();
		this.setDisposeFn(() => {
			let index = viewContainer.indexOf(viewRef);
			if (index !== -1) viewContainer.remove(index);
		});
		this._attachedPortal = portal;
		return viewRef;
	}
	attachDomPortal = (portal) => {
		const element = portal.element;
		if (!element.parentNode && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("DOM portal content must be attached to a parent node.");
		const anchorNode = this.outletElement.ownerDocument.createComment("dom-portal");
		element.parentNode.insertBefore(anchorNode, element);
		this.outletElement.appendChild(element);
		this._attachedPortal = portal;
		super.setDisposeFn(() => {
			if (anchorNode.parentNode) anchorNode.parentNode.replaceChild(element, anchorNode);
		});
	};
	dispose() {
		super.dispose();
		this.outletElement.remove();
	}
	_getComponentRootNode(componentRef) {
		return componentRef.hostView.rootNodes[0];
	}
};
var CdkPortal = class CdkPortal extends TemplatePortal {
	constructor() {
		const templateRef = inject(TemplateRef);
		const viewContainerRef = inject(ViewContainerRef);
		super(templateRef, viewContainerRef);
	}
	static ɵfac = function CdkPortal_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || CdkPortal)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: CdkPortal,
		selectors: [[
			"",
			"cdkPortal",
			""
		]],
		exportAs: ["cdkPortal"],
		features: [ɵɵInheritDefinitionFeature]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkPortal, [{
		type: Directive,
		args: [{
			selector: "[cdkPortal]",
			exportAs: "cdkPortal"
		}]
	}], () => [], null);
})();
var CdkPortalOutlet = class CdkPortalOutlet extends BasePortalOutlet {
	_moduleRef = inject(NgModuleRef$1, { optional: true });
	_document = inject(DOCUMENT);
	_viewContainerRef = inject(ViewContainerRef);
	_isInitialized = false;
	_attachedRef = null;
	get portal() {
		return this._attachedPortal;
	}
	set portal(portal) {
		if (this.hasAttached() && !portal && !this._isInitialized) return;
		if (this.hasAttached()) super.detach();
		if (portal) super.attach(portal);
		this._attachedPortal = portal || null;
	}
	attached = new EventEmitter();
	get attachedRef() {
		return this._attachedRef;
	}
	ngOnInit() {
		this._isInitialized = true;
	}
	ngOnDestroy() {
		super.dispose();
		this._attachedRef = this._attachedPortal = null;
	}
	attachComponentPortal(portal) {
		portal.setAttachedHost(this);
		const viewContainerRef = portal.viewContainerRef != null ? portal.viewContainerRef : this._viewContainerRef;
		const ref = viewContainerRef.createComponent(portal.component, {
			index: viewContainerRef.length,
			injector: portal.injector || viewContainerRef.injector,
			projectableNodes: portal.projectableNodes || void 0,
			ngModuleRef: this._moduleRef || void 0,
			bindings: portal.bindings || void 0,
			directives: portal.directives || void 0
		});
		if (viewContainerRef !== this._viewContainerRef) this._getRootNode().appendChild(ref.hostView.rootNodes[0]);
		super.setDisposeFn(() => ref.destroy());
		this._attachedPortal = portal;
		this._attachedRef = ref;
		this.attached.emit(ref);
		return ref;
	}
	attachTemplatePortal(portal) {
		portal.setAttachedHost(this);
		const viewRef = this._viewContainerRef.createEmbeddedView(portal.templateRef, portal.context, { injector: portal.injector });
		super.setDisposeFn(() => this._viewContainerRef.clear());
		this._attachedPortal = portal;
		this._attachedRef = viewRef;
		this.attached.emit(viewRef);
		return viewRef;
	}
	attachDomPortal = (portal) => {
		const element = portal.element;
		if (!element.parentNode && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("DOM portal content must be attached to a parent node.");
		const anchorNode = this._document.createComment("dom-portal");
		portal.setAttachedHost(this);
		element.parentNode.insertBefore(anchorNode, element);
		this._getRootNode().appendChild(element);
		this._attachedPortal = portal;
		super.setDisposeFn(() => {
			if (anchorNode.parentNode) anchorNode.parentNode.replaceChild(element, anchorNode);
		});
	};
	_getRootNode() {
		const nativeElement = this._viewContainerRef.element.nativeElement;
		return nativeElement.nodeType === nativeElement.ELEMENT_NODE ? nativeElement : nativeElement.parentNode;
	}
	static ɵfac = /* @__PURE__ */ (() => {
		let ɵCdkPortalOutlet_BaseFactory;
		return function CdkPortalOutlet_Factory(__ngFactoryType__) {
			return (ɵCdkPortalOutlet_BaseFactory || (ɵCdkPortalOutlet_BaseFactory = ɵɵgetInheritedFactory(CdkPortalOutlet)))(__ngFactoryType__ || CdkPortalOutlet);
		};
	})();
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: CdkPortalOutlet,
		selectors: [[
			"",
			"cdkPortalOutlet",
			""
		]],
		inputs: { portal: [
			0,
			"cdkPortalOutlet",
			"portal"
		] },
		outputs: { attached: "attached" },
		exportAs: ["cdkPortalOutlet"],
		features: [ɵɵInheritDefinitionFeature]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkPortalOutlet, [{
		type: Directive,
		args: [{
			selector: "[cdkPortalOutlet]",
			exportAs: "cdkPortalOutlet"
		}]
	}], null, {
		portal: [{
			type: Input,
			args: ["cdkPortalOutlet"]
		}],
		attached: [{ type: Output }]
	});
})();
var PortalModule = class PortalModule {
	static ɵfac = function PortalModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || PortalModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: PortalModule,
		imports: [CdkPortal, CdkPortalOutlet],
		exports: [CdkPortal, CdkPortalOutlet]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortalModule, [{
		type: NgModule,
		args: [{
			imports: [CdkPortal, CdkPortalOutlet],
			exports: [CdkPortal, CdkPortalOutlet]
		}]
	}], null, null);
})();
//#endregion
//#region node_modules/@angular/cdk/fesm2022/_overlay-module-chunk.mjs
var scrollBehaviorSupported = supportsScrollBehavior();
function createBlockScrollStrategy(injector) {
	return new BlockScrollStrategy(injector.get(ViewportRuler), injector.get(DOCUMENT));
}
var BlockScrollStrategy = class {
	_viewportRuler;
	_previousHTMLStyles = {
		top: "",
		left: ""
	};
	_previousScrollPosition;
	_isEnabled = false;
	_document;
	constructor(_viewportRuler, document) {
		this._viewportRuler = _viewportRuler;
		this._document = document;
	}
	attach() {}
	enable() {
		if (this._canBeEnabled()) {
			const root = this._document.documentElement;
			this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();
			this._previousHTMLStyles.left = root.style.left || "";
			this._previousHTMLStyles.top = root.style.top || "";
			root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
			root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
			root.classList.add("cdk-global-scrollblock");
			this._isEnabled = true;
		}
	}
	disable() {
		if (this._isEnabled) {
			const html = this._document.documentElement;
			const body = this._document.body;
			const htmlStyle = html.style;
			const bodyStyle = body.style;
			const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || "";
			const previousBodyScrollBehavior = bodyStyle.scrollBehavior || "";
			this._isEnabled = false;
			htmlStyle.left = this._previousHTMLStyles.left;
			htmlStyle.top = this._previousHTMLStyles.top;
			html.classList.remove("cdk-global-scrollblock");
			if (scrollBehaviorSupported) htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = "auto";
			window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);
			if (scrollBehaviorSupported) {
				htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
				bodyStyle.scrollBehavior = previousBodyScrollBehavior;
			}
		}
	}
	_canBeEnabled() {
		if (this._document.documentElement.classList.contains("cdk-global-scrollblock") || this._isEnabled) return false;
		const rootElement = this._document.documentElement;
		const viewport = this._viewportRuler.getViewportSize();
		return rootElement.scrollHeight > viewport.height || rootElement.scrollWidth > viewport.width;
	}
};
function getMatScrollStrategyAlreadyAttachedError() {
	return Error(`Scroll strategy has already been attached.`);
}
function createCloseScrollStrategy(injector, config) {
	return new CloseScrollStrategy(injector.get(ScrollDispatcher), injector.get(NgZone), injector.get(ViewportRuler), config);
}
var CloseScrollStrategy = class {
	_scrollDispatcher;
	_ngZone;
	_viewportRuler;
	_config;
	_scrollSubscription = null;
	_overlayRef;
	_initialScrollPosition;
	constructor(_scrollDispatcher, _ngZone, _viewportRuler, _config) {
		this._scrollDispatcher = _scrollDispatcher;
		this._ngZone = _ngZone;
		this._viewportRuler = _viewportRuler;
		this._config = _config;
	}
	attach(overlayRef) {
		if (this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) throw getMatScrollStrategyAlreadyAttachedError();
		this._overlayRef = overlayRef;
	}
	enable() {
		if (this._scrollSubscription) return;
		const stream = this._scrollDispatcher.scrolled(0).pipe(filter((scrollable) => {
			return !scrollable || !this._overlayRef.overlayElement.contains(scrollable.getElementRef().nativeElement);
		}));
		if (this._config && this._config.threshold && this._config.threshold > 1) {
			this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top;
			this._scrollSubscription = stream.subscribe(() => {
				const scrollPosition = this._viewportRuler.getViewportScrollPosition().top;
				if (Math.abs(scrollPosition - this._initialScrollPosition) > this._config.threshold) this._detach();
				else this._overlayRef.updatePosition();
			});
		} else this._scrollSubscription = stream.subscribe(this._detach);
	}
	disable() {
		if (this._scrollSubscription) {
			this._scrollSubscription.unsubscribe();
			this._scrollSubscription = null;
		}
	}
	detach() {
		this.disable();
		this._overlayRef = null;
	}
	_detach = () => {
		this.disable();
		if (this._overlayRef.hasAttached()) this._ngZone.run(() => this._overlayRef.detach());
	};
};
var NoopScrollStrategy = class {
	enable() {}
	disable() {}
	attach() {}
};
function isElementScrolledOutsideView(element, scrollContainers) {
	return scrollContainers.some((containerBounds) => {
		const outsideAbove = element.bottom < containerBounds.top;
		const outsideBelow = element.top > containerBounds.bottom;
		const outsideLeft = element.right < containerBounds.left;
		const outsideRight = element.left > containerBounds.right;
		return outsideAbove || outsideBelow || outsideLeft || outsideRight;
	});
}
function isElementClippedByScrolling(element, scrollContainers) {
	return scrollContainers.some((scrollContainerRect) => {
		const clippedAbove = element.top < scrollContainerRect.top;
		const clippedBelow = element.bottom > scrollContainerRect.bottom;
		const clippedLeft = element.left < scrollContainerRect.left;
		const clippedRight = element.right > scrollContainerRect.right;
		return clippedAbove || clippedBelow || clippedLeft || clippedRight;
	});
}
function createRepositionScrollStrategy(injector, config) {
	return new RepositionScrollStrategy(injector.get(ScrollDispatcher), injector.get(ViewportRuler), injector.get(NgZone), config);
}
var RepositionScrollStrategy = class {
	_scrollDispatcher;
	_viewportRuler;
	_ngZone;
	_config;
	_scrollSubscription = null;
	_overlayRef;
	constructor(_scrollDispatcher, _viewportRuler, _ngZone, _config) {
		this._scrollDispatcher = _scrollDispatcher;
		this._viewportRuler = _viewportRuler;
		this._ngZone = _ngZone;
		this._config = _config;
	}
	attach(overlayRef) {
		if (this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) throw getMatScrollStrategyAlreadyAttachedError();
		this._overlayRef = overlayRef;
	}
	enable() {
		if (!this._scrollSubscription) {
			const throttle = this._config ? this._config.scrollThrottle : 0;
			this._scrollSubscription = this._scrollDispatcher.scrolled(throttle).subscribe(() => {
				this._overlayRef.updatePosition();
				if (this._config && this._config.autoClose) {
					const overlayRect = this._overlayRef.overlayElement.getBoundingClientRect();
					const { width, height } = this._viewportRuler.getViewportSize();
					if (isElementScrolledOutsideView(overlayRect, [{
						width,
						height,
						bottom: height,
						right: width,
						top: 0,
						left: 0
					}])) {
						this.disable();
						this._ngZone.run(() => this._overlayRef.detach());
					}
				}
			});
		}
	}
	disable() {
		if (this._scrollSubscription) {
			this._scrollSubscription.unsubscribe();
			this._scrollSubscription = null;
		}
	}
	detach() {
		this.disable();
		this._overlayRef = null;
	}
};
var ScrollStrategyOptions = class ScrollStrategyOptions {
	_injector = inject(Injector);
	noop = () => new NoopScrollStrategy();
	close = (config) => createCloseScrollStrategy(this._injector, config);
	block = () => createBlockScrollStrategy(this._injector);
	reposition = (config) => createRepositionScrollStrategy(this._injector, config);
	static ɵfac = function ScrollStrategyOptions_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ScrollStrategyOptions)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: ScrollStrategyOptions,
		factory: ScrollStrategyOptions.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollStrategyOptions, [{ type: Service }], null, null);
})();
var OverlayConfig = class {
	positionStrategy;
	scrollStrategy = new NoopScrollStrategy();
	panelClass = "";
	hasBackdrop = false;
	backdropClass = "cdk-overlay-dark-backdrop";
	disableAnimations;
	width;
	height;
	minWidth;
	minHeight;
	maxWidth;
	maxHeight;
	direction;
	disposeOnNavigation = false;
	usePopover;
	eventPredicate;
	constructor(config) {
		if (config) {
			const configKeys = Object.keys(config);
			for (const key of configKeys) if (config[key] !== void 0) this[key] = config[key];
		}
	}
};
var ConnectedOverlayPositionChange = class {
	connectionPair;
	scrollableViewProperties;
	constructor(connectionPair, scrollableViewProperties) {
		this.connectionPair = connectionPair;
		this.scrollableViewProperties = scrollableViewProperties;
	}
};
function validateVerticalPosition(property, value) {
	if (value !== "top" && value !== "bottom" && value !== "center") throw Error(`ConnectedPosition: Invalid ${property} "${value}". Expected "top", "bottom" or "center".`);
}
function validateHorizontalPosition(property, value) {
	if (value !== "start" && value !== "end" && value !== "center") throw Error(`ConnectedPosition: Invalid ${property} "${value}". Expected "start", "end" or "center".`);
}
var BaseOverlayDispatcher = class BaseOverlayDispatcher {
	_attachedOverlays = [];
	_document = inject(DOCUMENT);
	_isAttached = false;
	ngOnDestroy() {
		this.detach();
	}
	add(overlayRef) {
		this.remove(overlayRef);
		this._attachedOverlays.push(overlayRef);
	}
	remove(overlayRef) {
		const index = this._attachedOverlays.indexOf(overlayRef);
		if (index > -1) this._attachedOverlays.splice(index, 1);
		if (this._attachedOverlays.length === 0) this.detach();
	}
	canReceiveEvent(overlayRef, event, stream) {
		if (stream.observers.length < 1) return false;
		if (overlayRef.eventPredicate) return overlayRef.eventPredicate(event);
		return true;
	}
	static ɵfac = function BaseOverlayDispatcher_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || BaseOverlayDispatcher)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: BaseOverlayDispatcher,
		factory: BaseOverlayDispatcher.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseOverlayDispatcher, [{ type: Service }], null, null);
})();
var OverlayKeyboardDispatcher = class OverlayKeyboardDispatcher extends BaseOverlayDispatcher {
	_ngZone = inject(NgZone);
	_renderer = inject(RendererFactory2).createRenderer(null, null);
	_cleanupKeydown;
	add(overlayRef) {
		super.add(overlayRef);
		if (!this._isAttached) {
			this._ngZone.runOutsideAngular(() => {
				this._cleanupKeydown = this._renderer.listen("body", "keydown", this._keydownListener);
			});
			this._isAttached = true;
		}
	}
	detach() {
		if (this._isAttached) {
			this._cleanupKeydown?.();
			this._isAttached = false;
		}
	}
	_keydownListener = (event) => {
		const overlays = this._attachedOverlays;
		for (let i = overlays.length - 1; i > -1; i--) {
			const overlayRef = overlays[i];
			if (this.canReceiveEvent(overlayRef, event, overlayRef._keydownEvents)) {
				this._ngZone.run(() => overlayRef._keydownEvents.next(event));
				break;
			}
		}
	};
	static ɵfac = function OverlayKeyboardDispatcher_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || OverlayKeyboardDispatcher)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: OverlayKeyboardDispatcher,
		factory: OverlayKeyboardDispatcher.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayKeyboardDispatcher, [{ type: Service }], null, null);
})();
var OverlayOutsideClickDispatcher = class OverlayOutsideClickDispatcher extends BaseOverlayDispatcher {
	_platform = inject(Platform);
	_ngZone = inject(NgZone);
	_renderer = inject(RendererFactory2).createRenderer(null, null);
	_cursorOriginalValue;
	_cursorStyleIsSet = false;
	_pointerDownEventTarget = null;
	_cleanups;
	add(overlayRef) {
		super.add(overlayRef);
		if (!this._isAttached) {
			const body = this._document.body;
			const eventOptions = { capture: true };
			const renderer = this._renderer;
			this._cleanups = this._ngZone.runOutsideAngular(() => [
				renderer.listen(body, "pointerdown", this._pointerDownListener, eventOptions),
				renderer.listen(body, "click", this._clickListener, eventOptions),
				renderer.listen(body, "auxclick", this._clickListener, eventOptions),
				renderer.listen(body, "contextmenu", this._clickListener, eventOptions)
			]);
			if (this._platform.IOS && !this._cursorStyleIsSet) {
				this._cursorOriginalValue = body.style.cursor;
				body.style.cursor = "pointer";
				this._cursorStyleIsSet = true;
			}
			this._isAttached = true;
		}
	}
	detach() {
		if (this._isAttached) {
			this._cleanups?.forEach((cleanup) => cleanup());
			this._cleanups = void 0;
			if (this._platform.IOS && this._cursorStyleIsSet) {
				this._document.body.style.cursor = this._cursorOriginalValue;
				this._cursorStyleIsSet = false;
			}
			this._isAttached = false;
		}
	}
	_pointerDownListener = (event) => {
		this._pointerDownEventTarget = _getEventTarget(event);
	};
	_clickListener = (event) => {
		const target = _getEventTarget(event);
		const origin = event.type === "click" && this._pointerDownEventTarget ? this._pointerDownEventTarget : target;
		this._pointerDownEventTarget = null;
		const overlays = this._attachedOverlays.slice();
		for (let i = overlays.length - 1; i > -1; i--) {
			const overlayRef = overlays[i];
			const outsidePointerEvents = overlayRef._outsidePointerEvents;
			if (!overlayRef.hasAttached() || !this.canReceiveEvent(overlayRef, event, outsidePointerEvents)) continue;
			if (containsPierceShadowDom(overlayRef.overlayElement, target) || containsPierceShadowDom(overlayRef.overlayElement, origin)) break;
			if (this._ngZone) this._ngZone.run(() => outsidePointerEvents.next(event));
			else outsidePointerEvents.next(event);
		}
	};
	static ɵfac = function OverlayOutsideClickDispatcher_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || OverlayOutsideClickDispatcher)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: OverlayOutsideClickDispatcher,
		factory: OverlayOutsideClickDispatcher.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayOutsideClickDispatcher, [{ type: Service }], null, null);
})();
function containsPierceShadowDom(parent, child) {
	const supportsShadowRoot = typeof ShadowRoot !== "undefined" && ShadowRoot;
	let current = child;
	while (current) {
		if (current === parent) return true;
		current = supportsShadowRoot && current instanceof ShadowRoot ? current.host : current.parentNode;
	}
	return false;
}
var _CdkOverlayStyleLoader = class _CdkOverlayStyleLoader {
	static ɵfac = function _CdkOverlayStyleLoader_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || _CdkOverlayStyleLoader)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: _CdkOverlayStyleLoader,
		selectors: [["ng-component"]],
		hostAttrs: ["cdk-overlay-style-loader", ""],
		decls: 0,
		vars: 0,
		template: function _CdkOverlayStyleLoader_Template(rf, ctx) {},
		styles: [".cdk-overlay-container, .cdk-global-overlay-wrapper {\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n\n.cdk-overlay-container {\n  position: fixed;\n}\n@layer cdk-overlay {\n  .cdk-overlay-container {\n    z-index: 1000;\n  }\n}\n.cdk-overlay-container:empty {\n  display: none;\n}\n\n.cdk-global-overlay-wrapper {\n  display: flex;\n  position: absolute;\n}\n@layer cdk-overlay {\n  .cdk-global-overlay-wrapper {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-pane {\n  position: absolute;\n  pointer-events: auto;\n  box-sizing: border-box;\n  display: flex;\n  max-width: 100%;\n  max-height: 100%;\n}\n@layer cdk-overlay {\n  .cdk-overlay-pane {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-backdrop {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  pointer-events: auto;\n  -webkit-tap-highlight-color: transparent;\n  opacity: 0;\n  touch-action: manipulation;\n}\n@layer cdk-overlay {\n  .cdk-overlay-backdrop {\n    z-index: 1000;\n    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  }\n}\n@media (prefers-reduced-motion) {\n  .cdk-overlay-backdrop {\n    transition-duration: 1ms;\n  }\n}\n\n.cdk-overlay-backdrop-showing {\n  opacity: 1;\n}\n@media (forced-colors: active) {\n  .cdk-overlay-backdrop-showing {\n    opacity: 0.6;\n  }\n}\n\n@layer cdk-overlay {\n  .cdk-overlay-dark-backdrop {\n    background: rgba(0, 0, 0, 0.32);\n  }\n}\n\n.cdk-overlay-transparent-backdrop {\n  transition: visibility 1ms linear, opacity 1ms linear;\n  visibility: hidden;\n  opacity: 1;\n}\n.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {\n  opacity: 0;\n  visibility: visible;\n}\n\n.cdk-overlay-backdrop-noop-animation {\n  transition: none;\n}\n\n.cdk-overlay-connected-position-bounding-box {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  min-width: 1px;\n  min-height: 1px;\n}\n@layer cdk-overlay {\n  .cdk-overlay-connected-position-bounding-box {\n    z-index: 1000;\n  }\n}\n\n.cdk-global-scrollblock {\n  position: fixed;\n  width: 100%;\n  overflow-y: scroll;\n}\n\n.cdk-overlay-popover {\n  background: none;\n  border: none;\n  padding: 0;\n  outline: 0;\n  overflow: visible;\n  position: fixed;\n  pointer-events: none;\n  white-space: normal;\n  color: inherit;\n  text-decoration: none;\n  width: 100%;\n  height: 100%;\n  inset: auto;\n  top: 0;\n  left: 0;\n}\n.cdk-overlay-popover::backdrop {\n  display: none;\n}\n.cdk-overlay-popover .cdk-overlay-backdrop {\n  position: fixed;\n  z-index: auto;\n}\n"],
		encapsulation: 2
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_CdkOverlayStyleLoader, [{
		type: Component,
		args: [{
			template: "",
			encapsulation: ViewEncapsulation.None,
			host: { "cdk-overlay-style-loader": "" },
			styles: [".cdk-overlay-container, .cdk-global-overlay-wrapper {\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n\n.cdk-overlay-container {\n  position: fixed;\n}\n@layer cdk-overlay {\n  .cdk-overlay-container {\n    z-index: 1000;\n  }\n}\n.cdk-overlay-container:empty {\n  display: none;\n}\n\n.cdk-global-overlay-wrapper {\n  display: flex;\n  position: absolute;\n}\n@layer cdk-overlay {\n  .cdk-global-overlay-wrapper {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-pane {\n  position: absolute;\n  pointer-events: auto;\n  box-sizing: border-box;\n  display: flex;\n  max-width: 100%;\n  max-height: 100%;\n}\n@layer cdk-overlay {\n  .cdk-overlay-pane {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-backdrop {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  pointer-events: auto;\n  -webkit-tap-highlight-color: transparent;\n  opacity: 0;\n  touch-action: manipulation;\n}\n@layer cdk-overlay {\n  .cdk-overlay-backdrop {\n    z-index: 1000;\n    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  }\n}\n@media (prefers-reduced-motion) {\n  .cdk-overlay-backdrop {\n    transition-duration: 1ms;\n  }\n}\n\n.cdk-overlay-backdrop-showing {\n  opacity: 1;\n}\n@media (forced-colors: active) {\n  .cdk-overlay-backdrop-showing {\n    opacity: 0.6;\n  }\n}\n\n@layer cdk-overlay {\n  .cdk-overlay-dark-backdrop {\n    background: rgba(0, 0, 0, 0.32);\n  }\n}\n\n.cdk-overlay-transparent-backdrop {\n  transition: visibility 1ms linear, opacity 1ms linear;\n  visibility: hidden;\n  opacity: 1;\n}\n.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {\n  opacity: 0;\n  visibility: visible;\n}\n\n.cdk-overlay-backdrop-noop-animation {\n  transition: none;\n}\n\n.cdk-overlay-connected-position-bounding-box {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  min-width: 1px;\n  min-height: 1px;\n}\n@layer cdk-overlay {\n  .cdk-overlay-connected-position-bounding-box {\n    z-index: 1000;\n  }\n}\n\n.cdk-global-scrollblock {\n  position: fixed;\n  width: 100%;\n  overflow-y: scroll;\n}\n\n.cdk-overlay-popover {\n  background: none;\n  border: none;\n  padding: 0;\n  outline: 0;\n  overflow: visible;\n  position: fixed;\n  pointer-events: none;\n  white-space: normal;\n  color: inherit;\n  text-decoration: none;\n  width: 100%;\n  height: 100%;\n  inset: auto;\n  top: 0;\n  left: 0;\n}\n.cdk-overlay-popover::backdrop {\n  display: none;\n}\n.cdk-overlay-popover .cdk-overlay-backdrop {\n  position: fixed;\n  z-index: auto;\n}\n"]
		}]
	}], null, null);
})();
var OverlayContainer = class OverlayContainer {
	_platform = inject(Platform);
	_containerElement;
	_document = inject(DOCUMENT);
	_styleLoader = inject(_CdkPrivateStyleLoader);
	ngOnDestroy() {
		this._containerElement?.remove();
	}
	getContainerElement() {
		this._loadStyles();
		if (!this._containerElement) this._createContainer();
		return this._containerElement;
	}
	_createContainer() {
		const containerClass = "cdk-overlay-container";
		if (this._platform.isBrowser || _isTestEnvironment()) {
			const oppositePlatformContainers = this._document.querySelectorAll(`.${containerClass}[platform="server"], .${containerClass}[platform="test"]`);
			for (let i = 0; i < oppositePlatformContainers.length; i++) oppositePlatformContainers[i].remove();
		}
		const container = this._document.createElement("div");
		container.classList.add(containerClass);
		if (_isTestEnvironment()) container.setAttribute("platform", "test");
		else if (!this._platform.isBrowser) container.setAttribute("platform", "server");
		this._document.body.appendChild(container);
		this._containerElement = container;
	}
	_loadStyles() {
		this._styleLoader.load(_CdkOverlayStyleLoader);
	}
	static ɵfac = function OverlayContainer_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || OverlayContainer)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: OverlayContainer,
		factory: OverlayContainer.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayContainer, [{ type: Service }], null, null);
})();
var BackdropRef = class {
	_renderer;
	_ngZone;
	element;
	_cleanupClick;
	_cleanupTransitionEnd;
	_fallbackTimeout;
	constructor(document, _renderer, _ngZone, onClick) {
		this._renderer = _renderer;
		this._ngZone = _ngZone;
		this.element = document.createElement("div");
		this.element.classList.add("cdk-overlay-backdrop");
		this._cleanupClick = _renderer.listen(this.element, "click", onClick);
	}
	detach() {
		this._ngZone.runOutsideAngular(() => {
			const element = this.element;
			clearTimeout(this._fallbackTimeout);
			this._cleanupTransitionEnd?.();
			this._cleanupTransitionEnd = this._renderer.listen(element, "transitionend", this.dispose);
			this._fallbackTimeout = setTimeout(this.dispose, 500);
			element.style.pointerEvents = "none";
			element.classList.remove("cdk-overlay-backdrop-showing");
		});
	}
	dispose = () => {
		clearTimeout(this._fallbackTimeout);
		this._cleanupClick?.();
		this._cleanupTransitionEnd?.();
		this._cleanupClick = this._cleanupTransitionEnd = this._fallbackTimeout = void 0;
		this.element.remove();
	};
};
function isElement(value) {
	return value && value.nodeType === 1;
}
var OverlayRef = class {
	_portalOutlet;
	_host;
	_pane;
	_config;
	_ngZone;
	_keyboardDispatcher;
	_document;
	_location;
	_outsideClickDispatcher;
	_animationsDisabled;
	_injector;
	_renderer;
	_backdropClick = new Subject();
	_attachments = new Subject();
	_detachments = new Subject();
	_positionStrategy;
	_scrollStrategy;
	_locationChanges = Subscription.EMPTY;
	_backdropRef = null;
	_detachContentMutationObserver;
	_detachContentAfterRenderRef;
	_disposed = false;
	_previousHostParent;
	_keydownEvents = new Subject();
	_outsidePointerEvents = new Subject();
	_afterNextRenderRef;
	constructor(_portalOutlet, _host, _pane, _config, _ngZone, _keyboardDispatcher, _document, _location, _outsideClickDispatcher, _animationsDisabled = false, _injector, _renderer) {
		this._portalOutlet = _portalOutlet;
		this._host = _host;
		this._pane = _pane;
		this._config = _config;
		this._ngZone = _ngZone;
		this._keyboardDispatcher = _keyboardDispatcher;
		this._document = _document;
		this._location = _location;
		this._outsideClickDispatcher = _outsideClickDispatcher;
		this._animationsDisabled = _animationsDisabled;
		this._injector = _injector;
		this._renderer = _renderer;
		if (_config.scrollStrategy) {
			this._scrollStrategy = _config.scrollStrategy;
			this._scrollStrategy.attach(this);
		}
		this._positionStrategy = _config.positionStrategy;
	}
	get overlayElement() {
		return this._pane;
	}
	get backdropElement() {
		return this._backdropRef?.element || null;
	}
	get hostElement() {
		return this._host;
	}
	get eventPredicate() {
		return this._config?.eventPredicate || null;
	}
	attach(portal) {
		if (this._disposed) return null;
		this._attachHost();
		const attachResult = this._portalOutlet.attach(portal);
		this._positionStrategy?.attach(this);
		this._updateStackingOrder();
		this._updateElementSize();
		this._updateElementDirection();
		if (this._scrollStrategy) this._scrollStrategy.enable();
		this._afterNextRenderRef?.destroy();
		this._afterNextRenderRef = afterNextRender(() => {
			if (this.hasAttached()) this.updatePosition();
		}, { injector: this._injector });
		this._togglePointerEvents(true);
		if (this._config.hasBackdrop) this._attachBackdrop();
		if (this._config.panelClass) this._toggleClasses(this._pane, this._config.panelClass, true);
		this._attachments.next();
		this._completeDetachContent();
		this._keyboardDispatcher.add(this);
		if (this._config.disposeOnNavigation) this._locationChanges = this._location.subscribe(() => this.dispose());
		this._outsideClickDispatcher.add(this);
		if (typeof attachResult?.onDestroy === "function") attachResult.onDestroy(() => {
			if (this.hasAttached()) this._ngZone.runOutsideAngular(() => Promise.resolve().then(() => this.detach()));
		});
		return attachResult;
	}
	detach() {
		if (!this.hasAttached()) return;
		this.detachBackdrop();
		this._togglePointerEvents(false);
		if (this._positionStrategy && this._positionStrategy.detach) this._positionStrategy.detach();
		if (this._scrollStrategy) this._scrollStrategy.disable();
		const detachmentResult = this._portalOutlet.detach();
		this._detachments.next();
		this._completeDetachContent();
		this._keyboardDispatcher.remove(this);
		this._detachContentWhenEmpty();
		this._locationChanges.unsubscribe();
		this._outsideClickDispatcher.remove(this);
		return detachmentResult;
	}
	dispose() {
		if (this._disposed) return;
		const isAttached = this.hasAttached();
		if (this._positionStrategy) this._positionStrategy.dispose();
		this._disposeScrollStrategy();
		this._backdropRef?.dispose();
		this._locationChanges.unsubscribe();
		this._keyboardDispatcher.remove(this);
		this._portalOutlet.dispose();
		this._attachments.complete();
		this._backdropClick.complete();
		this._keydownEvents.complete();
		this._outsidePointerEvents.complete();
		this._outsideClickDispatcher.remove(this);
		this._host?.remove();
		this._afterNextRenderRef?.destroy();
		this._previousHostParent = this._pane = this._host = this._backdropRef = null;
		if (isAttached) this._detachments.next();
		this._detachments.complete();
		this._completeDetachContent();
		this._disposed = true;
	}
	hasAttached() {
		return this._portalOutlet.hasAttached();
	}
	backdropClick() {
		return this._backdropClick;
	}
	attachments() {
		return this._attachments;
	}
	detachments() {
		return this._detachments;
	}
	keydownEvents() {
		return this._keydownEvents;
	}
	outsidePointerEvents() {
		return this._outsidePointerEvents;
	}
	getConfig() {
		return this._config;
	}
	updatePosition() {
		if (this._positionStrategy) this._positionStrategy.apply();
	}
	updatePositionStrategy(strategy) {
		if (strategy === this._positionStrategy) return;
		if (this._positionStrategy) this._positionStrategy.dispose();
		this._positionStrategy = strategy;
		if (this.hasAttached()) {
			strategy.attach(this);
			this.updatePosition();
		}
	}
	updateSize(sizeConfig) {
		this._config = {
			...this._config,
			...sizeConfig
		};
		this._updateElementSize();
	}
	setDirection(dir) {
		this._config = {
			...this._config,
			direction: dir
		};
		this._updateElementDirection();
	}
	addPanelClass(classes) {
		if (this._pane) this._toggleClasses(this._pane, classes, true);
	}
	removePanelClass(classes) {
		if (this._pane) this._toggleClasses(this._pane, classes, false);
	}
	getDirection() {
		const direction = this._config.direction;
		if (!direction) return "ltr";
		return typeof direction === "string" ? direction : direction.value;
	}
	updateScrollStrategy(strategy) {
		if (strategy === this._scrollStrategy) return;
		this._disposeScrollStrategy();
		this._scrollStrategy = strategy;
		if (this.hasAttached()) {
			strategy.attach(this);
			strategy.enable();
		}
	}
	_updateElementDirection() {
		this._host.setAttribute("dir", this.getDirection());
	}
	_updateElementSize() {
		if (!this._pane) return;
		const style = this._pane.style;
		style.width = coerceCssPixelValue(this._config.width);
		style.height = coerceCssPixelValue(this._config.height);
		style.minWidth = coerceCssPixelValue(this._config.minWidth);
		style.minHeight = coerceCssPixelValue(this._config.minHeight);
		style.maxWidth = coerceCssPixelValue(this._config.maxWidth);
		style.maxHeight = coerceCssPixelValue(this._config.maxHeight);
	}
	_togglePointerEvents(enablePointer) {
		this._pane.style.pointerEvents = enablePointer ? "" : "none";
	}
	_attachHost() {
		if (!this._host.parentElement) {
			const customInsertionPoint = this._config.usePopover ? this._positionStrategy?.getPopoverInsertionPoint?.() : null;
			if (isElement(customInsertionPoint)) customInsertionPoint.after(this._host);
			else if (customInsertionPoint?.type === "parent") customInsertionPoint.element.appendChild(this._host);
			else this._previousHostParent?.appendChild(this._host);
		}
		if (this._config.usePopover) try {
			this._host["showPopover"]();
		} catch {}
	}
	_attachBackdrop() {
		const showingClass = "cdk-overlay-backdrop-showing";
		this._backdropRef?.dispose();
		this._backdropRef = new BackdropRef(this._document, this._renderer, this._ngZone, (event) => {
			this._backdropClick.next(event);
		});
		if (this._animationsDisabled) this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation");
		if (this._config.backdropClass) this._toggleClasses(this._backdropRef.element, this._config.backdropClass, true);
		if (this._config.usePopover) this._host.prepend(this._backdropRef.element);
		else this._host.parentElement.insertBefore(this._backdropRef.element, this._host);
		if (!this._animationsDisabled && typeof requestAnimationFrame !== "undefined") this._ngZone.runOutsideAngular(() => {
			requestAnimationFrame(() => this._backdropRef?.element.classList.add(showingClass));
		});
		else this._backdropRef.element.classList.add(showingClass);
	}
	_updateStackingOrder() {
		if (!this._config.usePopover && this._host.nextSibling) this._host.parentNode.appendChild(this._host);
	}
	detachBackdrop() {
		if (this._animationsDisabled) {
			this._backdropRef?.dispose();
			this._backdropRef = null;
		} else this._backdropRef?.detach();
	}
	_toggleClasses(element, cssClasses, isAdd) {
		const classes = coerceArray(cssClasses || []).filter((c) => !!c);
		if (classes.length) isAdd ? element.classList.add(...classes) : element.classList.remove(...classes);
	}
	_detachContentWhenEmpty() {
		let rethrow = false;
		try {
			this._detachContentAfterRenderRef = afterNextRender(() => {
				rethrow = true;
				this._detachContent();
			}, { injector: this._injector });
		} catch (e) {
			if (rethrow) throw e;
			this._detachContent();
		}
		if (globalThis.MutationObserver && this._pane) {
			this._detachContentMutationObserver ||= new globalThis.MutationObserver(() => {
				this._detachContent();
			});
			this._detachContentMutationObserver.observe(this._pane, { childList: true });
		}
	}
	_detachContent() {
		if (!this._pane || !this._host || this._pane.children.length === 0) {
			if (this._pane && this._config.panelClass) this._toggleClasses(this._pane, this._config.panelClass, false);
			if (this._host && this._host.parentElement) {
				this._previousHostParent = this._host.parentElement;
				this._host.remove();
			}
			this._completeDetachContent();
		}
	}
	_completeDetachContent() {
		this._detachContentAfterRenderRef?.destroy();
		this._detachContentAfterRenderRef = void 0;
		this._detachContentMutationObserver?.disconnect();
	}
	_disposeScrollStrategy() {
		const scrollStrategy = this._scrollStrategy;
		scrollStrategy?.disable();
		scrollStrategy?.detach?.();
	}
};
var boundingBoxClass = "cdk-overlay-connected-position-bounding-box";
var cssUnitPattern = /([A-Za-z%]+)$/;
function createFlexibleConnectedPositionStrategy(injector, origin) {
	return new FlexibleConnectedPositionStrategy(origin, injector.get(ViewportRuler), injector.get(DOCUMENT), injector.get(Platform), injector.get(OverlayContainer));
}
var FlexibleConnectedPositionStrategy = class {
	_viewportRuler;
	_document;
	_platform;
	_overlayContainer;
	_overlayRef;
	_isInitialRender = false;
	_lastBoundingBoxSize = {
		width: 0,
		height: 0
	};
	_isPushed = false;
	_canPush = true;
	_growAfterOpen = false;
	_hasFlexibleDimensions = true;
	_positionLocked = false;
	_originRect;
	_overlayRect;
	_viewportRect;
	_containerRect;
	_viewportMargin = 0;
	_scrollables = [];
	_preferredPositions = [];
	_origin;
	_pane;
	_isDisposed = false;
	_boundingBox = null;
	_lastPosition = null;
	_lastScrollVisibility = null;
	_positionChanges = new Subject();
	_resizeSubscription = Subscription.EMPTY;
	_offsetX = 0;
	_offsetY = 0;
	_transformOriginSelector;
	_appliedPanelClasses = [];
	_previousPushAmount = null;
	_popoverLocation = "global";
	positionChanges = this._positionChanges;
	get positions() {
		return this._preferredPositions;
	}
	constructor(connectedTo, _viewportRuler, _document, _platform, _overlayContainer) {
		this._viewportRuler = _viewportRuler;
		this._document = _document;
		this._platform = _platform;
		this._overlayContainer = _overlayContainer;
		this.setOrigin(connectedTo);
	}
	attach(overlayRef) {
		if (this._overlayRef && overlayRef !== this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("This position strategy is already attached to an overlay");
		this._validatePositions();
		overlayRef.hostElement.classList.add(boundingBoxClass);
		this._overlayRef = overlayRef;
		this._boundingBox = overlayRef.hostElement;
		this._pane = overlayRef.overlayElement;
		this._isDisposed = false;
		this._isInitialRender = true;
		this._lastPosition = null;
		this._resizeSubscription.unsubscribe();
		this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
			this._isInitialRender = true;
			this.apply();
		});
	}
	apply() {
		if (this._isDisposed || !this._platform.isBrowser) return;
		if (!this._isInitialRender && this._positionLocked && this._lastPosition) {
			this.reapplyLastPosition();
			return;
		}
		this._clearPanelClasses();
		this._resetOverlayElementStyles();
		this._resetBoundingBoxStyles();
		this._viewportRect = this._getNarrowedViewportRect();
		this._originRect = this._getOriginRect();
		this._overlayRect = this._pane.getBoundingClientRect();
		this._containerRect = this._getContainerRect();
		const originRect = this._originRect;
		const overlayRect = this._overlayRect;
		const viewportRect = this._viewportRect;
		const containerRect = this._containerRect;
		const flexibleFits = [];
		let fallback;
		for (let pos of this._preferredPositions) {
			let originPoint = this._getOriginPoint(originRect, containerRect, pos);
			let overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);
			let overlayFit = this._getOverlayFit(overlayPoint, overlayRect, viewportRect, pos);
			if (overlayFit.isCompletelyWithinViewport) {
				this._isPushed = false;
				this._applyPosition(pos, originPoint);
				return;
			}
			if (this._canFitWithFlexibleDimensions(overlayFit, overlayPoint, viewportRect)) {
				flexibleFits.push({
					position: pos,
					origin: originPoint,
					overlayRect,
					boundingBoxRect: this._calculateBoundingBoxRect(originPoint, pos)
				});
				continue;
			}
			if (!fallback || fallback.overlayFit.visibleArea < overlayFit.visibleArea) fallback = {
				overlayFit,
				overlayPoint,
				originPoint,
				position: pos,
				overlayRect
			};
		}
		if (flexibleFits.length) {
			let bestFit = null;
			let bestScore = -1;
			for (const fit of flexibleFits) {
				const score = fit.boundingBoxRect.width * fit.boundingBoxRect.height * (fit.position.weight || 1);
				if (score > bestScore) {
					bestScore = score;
					bestFit = fit;
				}
			}
			this._isPushed = false;
			this._applyPosition(bestFit.position, bestFit.origin);
			return;
		}
		if (this._canPush) {
			this._isPushed = true;
			this._applyPosition(fallback.position, fallback.originPoint);
			return;
		}
		this._applyPosition(fallback.position, fallback.originPoint);
	}
	detach() {
		this._clearPanelClasses();
		this._lastPosition = null;
		this._previousPushAmount = null;
		this._resizeSubscription.unsubscribe();
	}
	dispose() {
		if (this._isDisposed) return;
		if (this._boundingBox) extendStyles(this._boundingBox.style, {
			top: "",
			left: "",
			right: "",
			bottom: "",
			height: "",
			width: "",
			alignItems: "",
			justifyContent: ""
		});
		if (this._pane) this._resetOverlayElementStyles();
		if (this._overlayRef) this._overlayRef.hostElement.classList.remove(boundingBoxClass);
		this.detach();
		this._positionChanges.complete();
		this._overlayRef = this._boundingBox = null;
		this._isDisposed = true;
	}
	reapplyLastPosition() {
		if (this._isDisposed || !this._platform.isBrowser) return;
		const lastPosition = this._lastPosition;
		if (lastPosition) {
			this._originRect = this._getOriginRect();
			this._overlayRect = this._pane.getBoundingClientRect();
			this._viewportRect = this._getNarrowedViewportRect();
			this._containerRect = this._getContainerRect();
			this._applyPosition(lastPosition, this._getOriginPoint(this._originRect, this._containerRect, lastPosition));
		} else this.apply();
	}
	withScrollableContainers(scrollables) {
		this._scrollables = scrollables;
		return this;
	}
	withPositions(positions) {
		this._preferredPositions = positions;
		if (positions.indexOf(this._lastPosition) === -1) this._lastPosition = null;
		this._validatePositions();
		return this;
	}
	withViewportMargin(margin) {
		this._viewportMargin = margin;
		return this;
	}
	withFlexibleDimensions(flexibleDimensions = true) {
		this._hasFlexibleDimensions = flexibleDimensions;
		return this;
	}
	withGrowAfterOpen(growAfterOpen = true) {
		this._growAfterOpen = growAfterOpen;
		return this;
	}
	withPush(canPush = true) {
		this._canPush = canPush;
		return this;
	}
	withLockedPosition(isLocked = true) {
		this._positionLocked = isLocked;
		return this;
	}
	setOrigin(origin) {
		this._origin = origin;
		return this;
	}
	withDefaultOffsetX(offset) {
		this._offsetX = offset;
		return this;
	}
	withDefaultOffsetY(offset) {
		this._offsetY = offset;
		return this;
	}
	withTransformOriginOn(selector) {
		this._transformOriginSelector = selector;
		return this;
	}
	withPopoverLocation(location) {
		this._popoverLocation = location;
		return this;
	}
	getPopoverInsertionPoint() {
		if (this._popoverLocation === "global") return null;
		else if (this._popoverLocation !== "inline") return this._popoverLocation;
		if (this._origin instanceof ElementRef) return this._origin.nativeElement;
		else if (isElement(this._origin)) return this._origin;
		else return null;
	}
	_getOriginPoint(originRect, containerRect, pos) {
		let x;
		if (pos.originX == "center") x = originRect.left + originRect.width / 2;
		else {
			const startX = this._isRtl() ? originRect.right : originRect.left;
			const endX = this._isRtl() ? originRect.left : originRect.right;
			x = pos.originX == "start" ? startX : endX;
		}
		if (containerRect.left < 0) x -= containerRect.left;
		let y;
		if (pos.originY == "center") y = originRect.top + originRect.height / 2;
		else y = pos.originY == "top" ? originRect.top : originRect.bottom;
		if (containerRect.top < 0) y -= containerRect.top;
		return {
			x,
			y
		};
	}
	_getOverlayPoint(originPoint, overlayRect, pos) {
		let overlayStartX;
		if (pos.overlayX == "center") overlayStartX = -overlayRect.width / 2;
		else if (pos.overlayX === "start") overlayStartX = this._isRtl() ? -overlayRect.width : 0;
		else overlayStartX = this._isRtl() ? 0 : -overlayRect.width;
		let overlayStartY;
		if (pos.overlayY == "center") overlayStartY = -overlayRect.height / 2;
		else overlayStartY = pos.overlayY == "top" ? 0 : -overlayRect.height;
		return {
			x: originPoint.x + overlayStartX,
			y: originPoint.y + overlayStartY
		};
	}
	_getOverlayFit(point, rawOverlayRect, viewport, position) {
		const overlay = getRoundedBoundingClientRect(rawOverlayRect);
		let { x, y } = point;
		let offsetX = this._getOffset(position, "x");
		let offsetY = this._getOffset(position, "y");
		if (offsetX) x += offsetX;
		if (offsetY) y += offsetY;
		let leftOverflow = 0 - x;
		let rightOverflow = x + overlay.width - viewport.width;
		let topOverflow = 0 - y;
		let bottomOverflow = y + overlay.height - viewport.height;
		let visibleWidth = this._subtractOverflows(overlay.width, leftOverflow, rightOverflow);
		let visibleHeight = this._subtractOverflows(overlay.height, topOverflow, bottomOverflow);
		let visibleArea = visibleWidth * visibleHeight;
		return {
			visibleArea,
			isCompletelyWithinViewport: overlay.width * overlay.height === visibleArea,
			fitsInViewportVertically: visibleHeight === overlay.height,
			fitsInViewportHorizontally: visibleWidth == overlay.width
		};
	}
	_canFitWithFlexibleDimensions(fit, point, viewport) {
		if (this._hasFlexibleDimensions) {
			const availableHeight = viewport.bottom - point.y;
			const availableWidth = viewport.right - point.x;
			const minHeight = getPixelValue(this._overlayRef.getConfig().minHeight);
			const minWidth = getPixelValue(this._overlayRef.getConfig().minWidth);
			const verticalFit = fit.fitsInViewportVertically || minHeight != null && minHeight <= availableHeight;
			const horizontalFit = fit.fitsInViewportHorizontally || minWidth != null && minWidth <= availableWidth;
			return verticalFit && horizontalFit;
		}
		return false;
	}
	_pushOverlayOnScreen(start, rawOverlayRect, scrollPosition) {
		if (this._previousPushAmount && this._positionLocked) return {
			x: start.x + this._previousPushAmount.x,
			y: start.y + this._previousPushAmount.y
		};
		const overlay = getRoundedBoundingClientRect(rawOverlayRect);
		const viewport = this._viewportRect;
		const overflowRight = Math.max(start.x + overlay.width - viewport.width, 0);
		const overflowBottom = Math.max(start.y + overlay.height - viewport.height, 0);
		const overflowTop = Math.max(viewport.top - scrollPosition.top - start.y, 0);
		const overflowLeft = Math.max(viewport.left - scrollPosition.left - start.x, 0);
		let pushX = 0;
		let pushY = 0;
		if (overlay.width <= viewport.width) pushX = overflowLeft || -overflowRight;
		else pushX = start.x < this._getViewportMarginStart() ? viewport.left - scrollPosition.left - start.x : 0;
		if (overlay.height <= viewport.height) pushY = overflowTop || -overflowBottom;
		else pushY = start.y < this._getViewportMarginTop() ? viewport.top - scrollPosition.top - start.y : 0;
		this._previousPushAmount = {
			x: pushX,
			y: pushY
		};
		return {
			x: start.x + pushX,
			y: start.y + pushY
		};
	}
	_applyPosition(position, originPoint) {
		this._setTransformOrigin(position);
		this._setOverlayElementStyles(originPoint, position);
		this._setBoundingBoxStyles(originPoint, position);
		if (position.panelClass) this._addPanelClasses(position.panelClass);
		if (this._positionChanges.observers.length) {
			const scrollVisibility = this._getScrollVisibility();
			if (position !== this._lastPosition || !this._lastScrollVisibility || !compareScrollVisibility(this._lastScrollVisibility, scrollVisibility)) {
				const changeEvent = new ConnectedOverlayPositionChange(position, scrollVisibility);
				this._positionChanges.next(changeEvent);
			}
			this._lastScrollVisibility = scrollVisibility;
		}
		this._lastPosition = position;
		this._isInitialRender = false;
	}
	_setTransformOrigin(position) {
		if (!this._transformOriginSelector) return;
		const elements = this._boundingBox.querySelectorAll(this._transformOriginSelector);
		let xOrigin;
		let yOrigin = position.overlayY;
		if (position.overlayX === "center") xOrigin = "center";
		else if (this._isRtl()) xOrigin = position.overlayX === "start" ? "right" : "left";
		else xOrigin = position.overlayX === "start" ? "left" : "right";
		for (let i = 0; i < elements.length; i++) elements[i].style.transformOrigin = `${xOrigin} ${yOrigin}`;
	}
	_calculateBoundingBoxRect(origin, position) {
		const viewport = this._viewportRect;
		const isRtl = this._isRtl();
		let height, top, bottom;
		if (position.overlayY === "top") {
			top = origin.y;
			height = viewport.height - top + this._getViewportMarginBottom();
		} else if (position.overlayY === "bottom") {
			bottom = viewport.height - origin.y + this._getViewportMarginTop() + this._getViewportMarginBottom();
			height = viewport.height - bottom + this._getViewportMarginTop();
		} else {
			const smallestDistanceToViewportEdge = Math.min(viewport.bottom - origin.y + viewport.top, origin.y);
			const previousHeight = this._lastBoundingBoxSize.height;
			height = smallestDistanceToViewportEdge * 2;
			top = origin.y - smallestDistanceToViewportEdge;
			if (height > previousHeight && !this._isInitialRender && !this._growAfterOpen) top = origin.y - previousHeight / 2;
		}
		const isBoundedByRightViewportEdge = position.overlayX === "start" && !isRtl || position.overlayX === "end" && isRtl;
		const isBoundedByLeftViewportEdge = position.overlayX === "end" && !isRtl || position.overlayX === "start" && isRtl;
		let width, left, right;
		if (isBoundedByLeftViewportEdge) {
			right = viewport.width - origin.x + this._getViewportMarginStart() + this._getViewportMarginEnd();
			width = origin.x - this._getViewportMarginStart();
		} else if (isBoundedByRightViewportEdge) {
			left = origin.x;
			width = viewport.right - origin.x - this._getViewportMarginEnd();
		} else {
			const smallestDistanceToViewportEdge = Math.min(viewport.right - origin.x + viewport.left, origin.x);
			const previousWidth = this._lastBoundingBoxSize.width;
			width = smallestDistanceToViewportEdge * 2;
			left = origin.x - smallestDistanceToViewportEdge;
			if (width > previousWidth && !this._isInitialRender && !this._growAfterOpen) left = origin.x - previousWidth / 2;
		}
		return {
			top,
			left,
			bottom,
			right,
			width,
			height
		};
	}
	_setBoundingBoxStyles(origin, position) {
		const boundingBoxRect = this._calculateBoundingBoxRect(origin, position);
		if (!this._isInitialRender && !this._growAfterOpen) {
			boundingBoxRect.height = Math.min(boundingBoxRect.height, this._lastBoundingBoxSize.height);
			boundingBoxRect.width = Math.min(boundingBoxRect.width, this._lastBoundingBoxSize.width);
		}
		const styles = {};
		if (this._hasExactPosition()) {
			styles.top = styles.left = "0";
			styles.bottom = styles.right = "auto";
			styles.maxHeight = styles.maxWidth = "";
			styles.width = styles.height = "100%";
		} else {
			const maxHeight = this._overlayRef.getConfig().maxHeight;
			const maxWidth = this._overlayRef.getConfig().maxWidth;
			styles.width = coerceCssPixelValue(boundingBoxRect.width);
			styles.height = coerceCssPixelValue(boundingBoxRect.height);
			styles.top = coerceCssPixelValue(boundingBoxRect.top) || "auto";
			styles.bottom = coerceCssPixelValue(boundingBoxRect.bottom) || "auto";
			styles.left = coerceCssPixelValue(boundingBoxRect.left) || "auto";
			styles.right = coerceCssPixelValue(boundingBoxRect.right) || "auto";
			if (position.overlayX === "center") styles.alignItems = "center";
			else styles.alignItems = position.overlayX === "end" ? "flex-end" : "flex-start";
			if (position.overlayY === "center") styles.justifyContent = "center";
			else styles.justifyContent = position.overlayY === "bottom" ? "flex-end" : "flex-start";
			if (maxHeight) styles.maxHeight = coerceCssPixelValue(maxHeight);
			if (maxWidth) styles.maxWidth = coerceCssPixelValue(maxWidth);
		}
		this._lastBoundingBoxSize = boundingBoxRect;
		extendStyles(this._boundingBox.style, styles);
	}
	_resetBoundingBoxStyles() {
		extendStyles(this._boundingBox.style, {
			top: "0",
			left: "0",
			right: "0",
			bottom: "0",
			height: "",
			width: "",
			alignItems: "",
			justifyContent: ""
		});
	}
	_resetOverlayElementStyles() {
		extendStyles(this._pane.style, {
			top: "",
			left: "",
			bottom: "",
			right: "",
			position: "",
			transform: ""
		});
	}
	_setOverlayElementStyles(originPoint, position) {
		const styles = {};
		const hasExactPosition = this._hasExactPosition();
		const hasFlexibleDimensions = this._hasFlexibleDimensions;
		const config = this._overlayRef.getConfig();
		if (hasExactPosition) {
			const scrollPosition = this._viewportRuler.getViewportScrollPosition();
			extendStyles(styles, this._getExactOverlayY(position, originPoint, scrollPosition));
			extendStyles(styles, this._getExactOverlayX(position, originPoint, scrollPosition));
		} else styles.position = "static";
		let transformString = "";
		let offsetX = this._getOffset(position, "x");
		let offsetY = this._getOffset(position, "y");
		if (offsetX) transformString += `translateX(${offsetX}px) `;
		if (offsetY) transformString += `translateY(${offsetY}px)`;
		styles.transform = transformString.trim();
		if (config.maxHeight) {
			if (hasExactPosition) styles.maxHeight = coerceCssPixelValue(config.maxHeight);
			else if (hasFlexibleDimensions) styles.maxHeight = "";
		}
		if (config.maxWidth) {
			if (hasExactPosition) styles.maxWidth = coerceCssPixelValue(config.maxWidth);
			else if (hasFlexibleDimensions) styles.maxWidth = "";
		}
		extendStyles(this._pane.style, styles);
	}
	_getExactOverlayY(position, originPoint, scrollPosition) {
		let styles = {
			top: "",
			bottom: ""
		};
		let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
		if (this._isPushed) overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
		if (position.overlayY === "bottom") styles.bottom = `${this._document.documentElement.clientHeight - (overlayPoint.y + this._overlayRect.height)}px`;
		else styles.top = coerceCssPixelValue(overlayPoint.y);
		return styles;
	}
	_getExactOverlayX(position, originPoint, scrollPosition) {
		let styles = {
			left: "",
			right: ""
		};
		let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
		if (this._isPushed) overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
		let horizontalStyleProperty;
		if (this._isRtl()) horizontalStyleProperty = position.overlayX === "end" ? "left" : "right";
		else horizontalStyleProperty = position.overlayX === "end" ? "right" : "left";
		if (horizontalStyleProperty === "right") styles.right = `${this._document.documentElement.clientWidth - (overlayPoint.x + this._overlayRect.width)}px`;
		else styles.left = coerceCssPixelValue(overlayPoint.x);
		return styles;
	}
	_getScrollVisibility() {
		const originBounds = this._getOriginRect();
		const overlayBounds = this._pane.getBoundingClientRect();
		const scrollContainerBounds = this._scrollables.map((scrollable) => {
			return scrollable.getElementRef().nativeElement.getBoundingClientRect();
		});
		return {
			isOriginClipped: isElementClippedByScrolling(originBounds, scrollContainerBounds),
			isOriginOutsideView: isElementScrolledOutsideView(originBounds, scrollContainerBounds),
			isOverlayClipped: isElementClippedByScrolling(overlayBounds, scrollContainerBounds),
			isOverlayOutsideView: isElementScrolledOutsideView(overlayBounds, scrollContainerBounds)
		};
	}
	_subtractOverflows(length, ...overflows) {
		return overflows.reduce((currentValue, currentOverflow) => {
			return currentValue - Math.max(currentOverflow, 0);
		}, length);
	}
	_getNarrowedViewportRect() {
		const width = this._document.documentElement.clientWidth;
		const height = this._document.documentElement.clientHeight;
		const scrollPosition = this._viewportRuler.getViewportScrollPosition();
		return {
			top: scrollPosition.top + this._getViewportMarginTop(),
			left: scrollPosition.left + this._getViewportMarginStart(),
			right: scrollPosition.left + width - this._getViewportMarginEnd(),
			bottom: scrollPosition.top + height - this._getViewportMarginBottom(),
			width: width - this._getViewportMarginStart() - this._getViewportMarginEnd(),
			height: height - this._getViewportMarginTop() - this._getViewportMarginBottom()
		};
	}
	_isRtl() {
		return this._overlayRef.getDirection() === "rtl";
	}
	_hasExactPosition() {
		return !this._hasFlexibleDimensions || this._isPushed;
	}
	_getOffset(position, axis) {
		if (axis === "x") return position.offsetX == null ? this._offsetX : position.offsetX;
		return position.offsetY == null ? this._offsetY : position.offsetY;
	}
	_validatePositions() {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (!this._preferredPositions.length) throw Error("FlexibleConnectedPositionStrategy: At least one position is required.");
			this._preferredPositions.forEach((pair) => {
				validateHorizontalPosition("originX", pair.originX);
				validateVerticalPosition("originY", pair.originY);
				validateHorizontalPosition("overlayX", pair.overlayX);
				validateVerticalPosition("overlayY", pair.overlayY);
			});
		}
	}
	_addPanelClasses(cssClasses) {
		if (this._pane) coerceArray(cssClasses).forEach((cssClass) => {
			if (cssClass !== "" && this._appliedPanelClasses.indexOf(cssClass) === -1) {
				this._appliedPanelClasses.push(cssClass);
				this._pane.classList.add(cssClass);
			}
		});
	}
	_clearPanelClasses() {
		if (this._pane) {
			this._appliedPanelClasses.forEach((cssClass) => {
				this._pane.classList.remove(cssClass);
			});
			this._appliedPanelClasses = [];
		}
	}
	_getViewportMarginStart() {
		if (typeof this._viewportMargin === "number") return this._viewportMargin;
		return this._viewportMargin?.start ?? 0;
	}
	_getViewportMarginEnd() {
		if (typeof this._viewportMargin === "number") return this._viewportMargin;
		return this._viewportMargin?.end ?? 0;
	}
	_getViewportMarginTop() {
		if (typeof this._viewportMargin === "number") return this._viewportMargin;
		return this._viewportMargin?.top ?? 0;
	}
	_getViewportMarginBottom() {
		if (typeof this._viewportMargin === "number") return this._viewportMargin;
		return this._viewportMargin?.bottom ?? 0;
	}
	_getOriginRect() {
		const origin = this._origin;
		if (origin instanceof ElementRef) return origin.nativeElement.getBoundingClientRect();
		if (origin instanceof Element) return origin.getBoundingClientRect();
		const width = origin.width || 0;
		const height = origin.height || 0;
		return {
			top: origin.y,
			bottom: origin.y + height,
			left: origin.x,
			right: origin.x + width,
			height,
			width
		};
	}
	_getContainerRect() {
		const isInlinePopover = this._overlayRef.getConfig().usePopover && this._popoverLocation !== "global";
		const element = this._overlayContainer.getContainerElement();
		if (isInlinePopover) element.style.display = "block";
		const dimensions = element.getBoundingClientRect();
		if (isInlinePopover) element.style.display = "";
		return dimensions;
	}
};
function extendStyles(destination, source) {
	for (let key in source) if (source.hasOwnProperty(key)) destination[key] = source[key];
	return destination;
}
function getPixelValue(input) {
	if (typeof input !== "number" && input != null) {
		const [value, units] = input.split(cssUnitPattern);
		return !units || units === "px" ? parseFloat(value) : null;
	}
	return input || null;
}
function getRoundedBoundingClientRect(clientRect) {
	return {
		top: Math.floor(clientRect.top),
		right: Math.floor(clientRect.right),
		bottom: Math.floor(clientRect.bottom),
		left: Math.floor(clientRect.left),
		width: Math.floor(clientRect.width),
		height: Math.floor(clientRect.height)
	};
}
function compareScrollVisibility(a, b) {
	if (a === b) return true;
	return a.isOriginClipped === b.isOriginClipped && a.isOriginOutsideView === b.isOriginOutsideView && a.isOverlayClipped === b.isOverlayClipped && a.isOverlayOutsideView === b.isOverlayOutsideView;
}
var wrapperClass = "cdk-global-overlay-wrapper";
function createGlobalPositionStrategy(_injector) {
	return new GlobalPositionStrategy();
}
var GlobalPositionStrategy = class {
	_overlayRef;
	_cssPosition = "static";
	_topOffset = "";
	_bottomOffset = "";
	_alignItems = "";
	_xPosition = "";
	_xOffset = "";
	_width = "";
	_height = "";
	_isDisposed = false;
	attach(overlayRef) {
		const config = overlayRef.getConfig();
		this._overlayRef = overlayRef;
		if (this._width && !config.width) overlayRef.updateSize({ width: this._width });
		if (this._height && !config.height) overlayRef.updateSize({ height: this._height });
		overlayRef.hostElement.classList.add(wrapperClass);
		this._isDisposed = false;
	}
	top(value = "") {
		this._bottomOffset = "";
		this._topOffset = value;
		this._alignItems = "flex-start";
		return this;
	}
	left(value = "") {
		this._xOffset = value;
		this._xPosition = "left";
		return this;
	}
	bottom(value = "") {
		this._topOffset = "";
		this._bottomOffset = value;
		this._alignItems = "flex-end";
		return this;
	}
	right(value = "") {
		this._xOffset = value;
		this._xPosition = "right";
		return this;
	}
	start(value = "") {
		this._xOffset = value;
		this._xPosition = "start";
		return this;
	}
	end(value = "") {
		this._xOffset = value;
		this._xPosition = "end";
		return this;
	}
	width(value = "") {
		if (this._overlayRef) this._overlayRef.updateSize({ width: value });
		else this._width = value;
		return this;
	}
	height(value = "") {
		if (this._overlayRef) this._overlayRef.updateSize({ height: value });
		else this._height = value;
		return this;
	}
	centerHorizontally(offset = "") {
		this.left(offset);
		this._xPosition = "center";
		return this;
	}
	centerVertically(offset = "") {
		this.top(offset);
		this._alignItems = "center";
		return this;
	}
	apply() {
		if (!this._overlayRef || !this._overlayRef.hasAttached()) return;
		const styles = this._overlayRef.overlayElement.style;
		const parentStyles = this._overlayRef.hostElement.style;
		const { width, height, maxWidth, maxHeight } = this._overlayRef.getConfig();
		const shouldBeFlushHorizontally = (width === "100%" || width === "100vw") && (!maxWidth || maxWidth === "100%" || maxWidth === "100vw");
		const shouldBeFlushVertically = (height === "100%" || height === "100vh") && (!maxHeight || maxHeight === "100%" || maxHeight === "100vh");
		const xPosition = this._xPosition;
		const xOffset = this._xOffset;
		const isRtl = this._overlayRef.getConfig().direction === "rtl";
		let marginLeft = "";
		let marginRight = "";
		let justifyContent = "";
		if (shouldBeFlushHorizontally) justifyContent = "flex-start";
		else if (xPosition === "center") {
			justifyContent = "center";
			if (isRtl) marginRight = xOffset;
			else marginLeft = xOffset;
		} else if (isRtl) {
			if (xPosition === "left" || xPosition === "end") {
				justifyContent = "flex-end";
				marginLeft = xOffset;
			} else if (xPosition === "right" || xPosition === "start") {
				justifyContent = "flex-start";
				marginRight = xOffset;
			}
		} else if (xPosition === "left" || xPosition === "start") {
			justifyContent = "flex-start";
			marginLeft = xOffset;
		} else if (xPosition === "right" || xPosition === "end") {
			justifyContent = "flex-end";
			marginRight = xOffset;
		}
		styles.position = this._cssPosition;
		styles.marginLeft = shouldBeFlushHorizontally ? "0" : marginLeft;
		styles.marginTop = shouldBeFlushVertically ? "0" : this._topOffset;
		styles.marginBottom = this._bottomOffset;
		styles.marginRight = shouldBeFlushHorizontally ? "0" : marginRight;
		parentStyles.justifyContent = justifyContent;
		parentStyles.alignItems = shouldBeFlushVertically ? "flex-start" : this._alignItems;
	}
	dispose() {
		if (this._isDisposed || !this._overlayRef) return;
		const styles = this._overlayRef.overlayElement.style;
		const parent = this._overlayRef.hostElement;
		const parentStyles = parent.style;
		parent.classList.remove(wrapperClass);
		parentStyles.justifyContent = parentStyles.alignItems = styles.marginTop = styles.marginBottom = styles.marginLeft = styles.marginRight = styles.position = "";
		this._overlayRef = null;
		this._isDisposed = true;
	}
};
var OverlayPositionBuilder = class OverlayPositionBuilder {
	_injector = inject(Injector);
	global() {
		return createGlobalPositionStrategy();
	}
	flexibleConnectedTo(origin) {
		return createFlexibleConnectedPositionStrategy(this._injector, origin);
	}
	static ɵfac = function OverlayPositionBuilder_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || OverlayPositionBuilder)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: OverlayPositionBuilder,
		factory: OverlayPositionBuilder.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayPositionBuilder, [{ type: Service }], null, null);
})();
var OVERLAY_DEFAULT_CONFIG = new InjectionToken("OVERLAY_DEFAULT_CONFIG");
function createOverlayRef(injector, config) {
	injector.get(_CdkPrivateStyleLoader).load(_CdkOverlayStyleLoader);
	const overlayContainer = injector.get(OverlayContainer);
	const doc = injector.get(DOCUMENT);
	const idGenerator = injector.get(_IdGenerator);
	const appRef = injector.get(ApplicationRef);
	const directionality = injector.get(Directionality);
	const renderer = injector.get(Renderer2, null, { optional: true }) || injector.get(RendererFactory2).createRenderer(null, null);
	const overlayConfig = new OverlayConfig(config);
	const defaultUsePopover = injector.get(OVERLAY_DEFAULT_CONFIG, null, { optional: true })?.usePopover ?? true;
	overlayConfig.direction = overlayConfig.direction || directionality.value;
	if (!doc.body || !("showPopover" in doc.body)) overlayConfig.usePopover = false;
	else overlayConfig.usePopover = config?.usePopover ?? defaultUsePopover;
	const pane = doc.createElement("div");
	const host = doc.createElement("div");
	pane.id = idGenerator.getId("cdk-overlay-");
	pane.classList.add("cdk-overlay-pane");
	host.appendChild(pane);
	if (overlayConfig.usePopover) {
		host.setAttribute("popover", "manual");
		host.classList.add("cdk-overlay-popover");
	}
	const customInsertionPoint = overlayConfig.usePopover ? overlayConfig.positionStrategy?.getPopoverInsertionPoint?.() : null;
	if (isElement(customInsertionPoint)) customInsertionPoint.after(host);
	else if (customInsertionPoint?.type === "parent") customInsertionPoint.element.appendChild(host);
	else overlayContainer.getContainerElement().appendChild(host);
	return new OverlayRef(new DomPortalOutlet(pane, appRef, injector), host, pane, overlayConfig, injector.get(NgZone), injector.get(OverlayKeyboardDispatcher), doc, injector.get(Location), injector.get(OverlayOutsideClickDispatcher), config?.disableAnimations ?? injector.get(ANIMATION_MODULE_TYPE, null, { optional: true }) === "NoopAnimations", injector.get(EnvironmentInjector), renderer);
}
var Overlay = class Overlay {
	scrollStrategies = inject(ScrollStrategyOptions);
	_positionBuilder = inject(OverlayPositionBuilder);
	_injector = inject(Injector);
	create(config) {
		return createOverlayRef(this._injector, config);
	}
	position() {
		return this._positionBuilder;
	}
	static ɵfac = function Overlay_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || Overlay)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: Overlay,
		factory: Overlay.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Overlay, [{ type: Service }], null, null);
})();
var defaultPositionList = [
	{
		originX: "start",
		originY: "bottom",
		overlayX: "start",
		overlayY: "top"
	},
	{
		originX: "start",
		originY: "top",
		overlayX: "start",
		overlayY: "bottom"
	},
	{
		originX: "end",
		originY: "top",
		overlayX: "end",
		overlayY: "bottom"
	},
	{
		originX: "end",
		originY: "bottom",
		overlayX: "end",
		overlayY: "top"
	}
];
var CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY = new InjectionToken("cdk-connected-overlay-scroll-strategy", {
	providedIn: "root",
	factory: () => {
		const injector = inject(Injector);
		return () => createRepositionScrollStrategy(injector);
	}
});
var CdkOverlayOrigin = class CdkOverlayOrigin {
	elementRef = inject(ElementRef);
	static ɵfac = function CdkOverlayOrigin_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || CdkOverlayOrigin)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: CdkOverlayOrigin,
		selectors: [
			[
				"",
				"cdk-overlay-origin",
				""
			],
			[
				"",
				"overlay-origin",
				""
			],
			[
				"",
				"cdkOverlayOrigin",
				""
			]
		],
		exportAs: ["cdkOverlayOrigin"]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkOverlayOrigin, [{
		type: Directive,
		args: [{
			selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]",
			exportAs: "cdkOverlayOrigin"
		}]
	}], null, null);
})();
var CDK_CONNECTED_OVERLAY_DEFAULT_CONFIG = new InjectionToken("cdk-connected-overlay-default-config");
var CdkConnectedOverlay = class CdkConnectedOverlay {
	_dir = inject(Directionality, { optional: true });
	_injector = inject(Injector);
	_overlayRef;
	_templatePortal;
	_backdropSubscription = Subscription.EMPTY;
	_attachSubscription = Subscription.EMPTY;
	_detachSubscription = Subscription.EMPTY;
	_positionSubscription = Subscription.EMPTY;
	_offsetX;
	_offsetY;
	_position;
	_scrollStrategyFactory = inject(CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY);
	_ngZone = inject(NgZone);
	origin;
	positions;
	positionStrategy;
	get offsetX() {
		return this._offsetX;
	}
	set offsetX(offsetX) {
		this._offsetX = offsetX;
		if (this._position) this._updatePositionStrategy(this._position);
	}
	get offsetY() {
		return this._offsetY;
	}
	set offsetY(offsetY) {
		this._offsetY = offsetY;
		if (this._position) this._updatePositionStrategy(this._position);
	}
	width;
	height;
	minWidth;
	minHeight;
	backdropClass;
	panelClass;
	viewportMargin = 0;
	scrollStrategy;
	open = false;
	disableClose = false;
	transformOriginSelector;
	hasBackdrop = false;
	lockPosition = false;
	flexibleDimensions = false;
	growAfterOpen = false;
	push = false;
	disposeOnNavigation = false;
	usePopover;
	matchWidth = false;
	set _config(value) {
		if (typeof value !== "string") this._assignConfig(value);
	}
	backdropClick = new EventEmitter();
	positionChange = new EventEmitter();
	attach = new EventEmitter();
	detach = new EventEmitter();
	overlayKeydown = new EventEmitter();
	overlayOutsideClick = new EventEmitter();
	constructor() {
		const templateRef = inject(TemplateRef);
		const viewContainerRef = inject(ViewContainerRef);
		const defaultConfig = inject(CDK_CONNECTED_OVERLAY_DEFAULT_CONFIG, { optional: true });
		const globalConfig = inject(OVERLAY_DEFAULT_CONFIG, { optional: true });
		this.usePopover = globalConfig?.usePopover === false ? null : "global";
		this._templatePortal = new TemplatePortal(templateRef, viewContainerRef);
		this.scrollStrategy = this._scrollStrategyFactory();
		if (defaultConfig) this._assignConfig(defaultConfig);
	}
	get overlayRef() {
		return this._overlayRef;
	}
	get dir() {
		return this._dir ? this._dir.value : "ltr";
	}
	ngOnDestroy() {
		this._attachSubscription.unsubscribe();
		this._detachSubscription.unsubscribe();
		this._backdropSubscription.unsubscribe();
		this._positionSubscription.unsubscribe();
		this._overlayRef?.dispose();
	}
	ngOnChanges(changes) {
		if (this._position) {
			this._updatePositionStrategy(this._position);
			this._overlayRef?.updateSize({
				width: this._getWidth(),
				minWidth: this.minWidth,
				height: this.height,
				minHeight: this.minHeight
			});
			if (changes["origin"] && this.open) this._position.apply();
		}
		if (changes["open"]) this.open ? this.attachOverlay() : this.detachOverlay();
	}
	_createOverlay() {
		if (!this.positions || !this.positions.length) this.positions = defaultPositionList;
		const overlayRef = this._overlayRef = createOverlayRef(this._injector, this._buildConfig());
		this._attachSubscription = overlayRef.attachments().subscribe(() => this.attach.emit());
		this._detachSubscription = overlayRef.detachments().subscribe(() => this.detach.emit());
		overlayRef.keydownEvents().subscribe((event) => {
			this.overlayKeydown.next(event);
			if (event.keyCode === 27 && !this.disableClose && !hasModifierKey(event)) {
				event.preventDefault();
				this.detachOverlay();
			}
		});
		this._overlayRef.outsidePointerEvents().subscribe((event) => {
			const origin = this._getOriginElement();
			const target = _getEventTarget(event);
			if (!origin || origin !== target && !origin.contains(target)) this.overlayOutsideClick.next(event);
		});
	}
	_buildConfig() {
		const positionStrategy = this._position = this.positionStrategy || this._createPositionStrategy();
		const overlayConfig = new OverlayConfig({
			direction: this._dir || "ltr",
			positionStrategy,
			scrollStrategy: this.scrollStrategy,
			hasBackdrop: this.hasBackdrop,
			disposeOnNavigation: this.disposeOnNavigation,
			usePopover: !!this.usePopover
		});
		if (this.height || this.height === 0) overlayConfig.height = this.height;
		if (this.minWidth || this.minWidth === 0) overlayConfig.minWidth = this.minWidth;
		if (this.minHeight || this.minHeight === 0) overlayConfig.minHeight = this.minHeight;
		if (this.backdropClass) overlayConfig.backdropClass = this.backdropClass;
		if (this.panelClass) overlayConfig.panelClass = this.panelClass;
		return overlayConfig;
	}
	_updatePositionStrategy(positionStrategy) {
		const positions = this.positions.map((currentPosition) => ({
			originX: currentPosition.originX,
			originY: currentPosition.originY,
			overlayX: currentPosition.overlayX,
			overlayY: currentPosition.overlayY,
			offsetX: currentPosition.offsetX || this.offsetX,
			offsetY: currentPosition.offsetY || this.offsetY,
			panelClass: currentPosition.panelClass || void 0
		}));
		return positionStrategy.setOrigin(this._getOrigin()).withPositions(positions).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover === null ? "global" : this.usePopover);
	}
	_createPositionStrategy() {
		const strategy = createFlexibleConnectedPositionStrategy(this._injector, this._getOrigin());
		this._updatePositionStrategy(strategy);
		return strategy;
	}
	_getOrigin() {
		if (this.origin instanceof CdkOverlayOrigin) return this.origin.elementRef;
		else return this.origin;
	}
	_getOriginElement() {
		if (this.origin instanceof CdkOverlayOrigin) return this.origin.elementRef.nativeElement;
		if (this.origin instanceof ElementRef) return this.origin.nativeElement;
		if (typeof Element !== "undefined" && this.origin instanceof Element) return this.origin;
		return null;
	}
	_getWidth() {
		if (this.width) return this.width;
		return this.matchWidth ? this._getOriginElement()?.getBoundingClientRect?.().width : void 0;
	}
	attachOverlay() {
		if (!this._overlayRef) this._createOverlay();
		const ref = this._overlayRef;
		ref.getConfig().hasBackdrop = this.hasBackdrop;
		ref.updateSize({ width: this._getWidth() });
		if (!ref.hasAttached()) ref.attach(this._templatePortal);
		if (this.hasBackdrop) this._backdropSubscription = ref.backdropClick().subscribe((event) => this.backdropClick.emit(event));
		else this._backdropSubscription.unsubscribe();
		this._positionSubscription.unsubscribe();
		if (this.positionChange.observers.length > 0) this._positionSubscription = this._position.positionChanges.pipe(takeWhile(() => this.positionChange.observers.length > 0)).subscribe((position) => {
			this._ngZone.run(() => this.positionChange.emit(position));
			if (this.positionChange.observers.length === 0) this._positionSubscription.unsubscribe();
		});
		this.open = true;
	}
	detachOverlay() {
		this._overlayRef?.detach();
		this._backdropSubscription.unsubscribe();
		this._positionSubscription.unsubscribe();
		this.open = false;
	}
	_assignConfig(config) {
		this.origin = config.origin ?? this.origin;
		this.positions = config.positions ?? this.positions;
		this.positionStrategy = config.positionStrategy ?? this.positionStrategy;
		this.offsetX = config.offsetX ?? this.offsetX;
		this.offsetY = config.offsetY ?? this.offsetY;
		this.width = config.width ?? this.width;
		this.height = config.height ?? this.height;
		this.minWidth = config.minWidth ?? this.minWidth;
		this.minHeight = config.minHeight ?? this.minHeight;
		this.backdropClass = config.backdropClass ?? this.backdropClass;
		this.panelClass = config.panelClass ?? this.panelClass;
		this.viewportMargin = config.viewportMargin ?? this.viewportMargin;
		this.scrollStrategy = config.scrollStrategy ?? this.scrollStrategy;
		this.disableClose = config.disableClose ?? this.disableClose;
		this.transformOriginSelector = config.transformOriginSelector ?? this.transformOriginSelector;
		this.hasBackdrop = config.hasBackdrop ?? this.hasBackdrop;
		this.lockPosition = config.lockPosition ?? this.lockPosition;
		this.flexibleDimensions = config.flexibleDimensions ?? this.flexibleDimensions;
		this.growAfterOpen = config.growAfterOpen ?? this.growAfterOpen;
		this.push = config.push ?? this.push;
		this.disposeOnNavigation = config.disposeOnNavigation ?? this.disposeOnNavigation;
		this.usePopover = config.usePopover ?? this.usePopover;
		this.matchWidth = config.matchWidth ?? this.matchWidth;
	}
	static ɵfac = function CdkConnectedOverlay_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || CdkConnectedOverlay)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: CdkConnectedOverlay,
		selectors: [
			[
				"",
				"cdk-connected-overlay",
				""
			],
			[
				"",
				"connected-overlay",
				""
			],
			[
				"",
				"cdkConnectedOverlay",
				""
			]
		],
		inputs: {
			origin: [
				0,
				"cdkConnectedOverlayOrigin",
				"origin"
			],
			positions: [
				0,
				"cdkConnectedOverlayPositions",
				"positions"
			],
			positionStrategy: [
				0,
				"cdkConnectedOverlayPositionStrategy",
				"positionStrategy"
			],
			offsetX: [
				0,
				"cdkConnectedOverlayOffsetX",
				"offsetX"
			],
			offsetY: [
				0,
				"cdkConnectedOverlayOffsetY",
				"offsetY"
			],
			width: [
				0,
				"cdkConnectedOverlayWidth",
				"width"
			],
			height: [
				0,
				"cdkConnectedOverlayHeight",
				"height"
			],
			minWidth: [
				0,
				"cdkConnectedOverlayMinWidth",
				"minWidth"
			],
			minHeight: [
				0,
				"cdkConnectedOverlayMinHeight",
				"minHeight"
			],
			backdropClass: [
				0,
				"cdkConnectedOverlayBackdropClass",
				"backdropClass"
			],
			panelClass: [
				0,
				"cdkConnectedOverlayPanelClass",
				"panelClass"
			],
			viewportMargin: [
				0,
				"cdkConnectedOverlayViewportMargin",
				"viewportMargin"
			],
			scrollStrategy: [
				0,
				"cdkConnectedOverlayScrollStrategy",
				"scrollStrategy"
			],
			open: [
				0,
				"cdkConnectedOverlayOpen",
				"open"
			],
			disableClose: [
				0,
				"cdkConnectedOverlayDisableClose",
				"disableClose"
			],
			transformOriginSelector: [
				0,
				"cdkConnectedOverlayTransformOriginOn",
				"transformOriginSelector"
			],
			hasBackdrop: [
				2,
				"cdkConnectedOverlayHasBackdrop",
				"hasBackdrop",
				booleanAttribute
			],
			lockPosition: [
				2,
				"cdkConnectedOverlayLockPosition",
				"lockPosition",
				booleanAttribute
			],
			flexibleDimensions: [
				2,
				"cdkConnectedOverlayFlexibleDimensions",
				"flexibleDimensions",
				booleanAttribute
			],
			growAfterOpen: [
				2,
				"cdkConnectedOverlayGrowAfterOpen",
				"growAfterOpen",
				booleanAttribute
			],
			push: [
				2,
				"cdkConnectedOverlayPush",
				"push",
				booleanAttribute
			],
			disposeOnNavigation: [
				2,
				"cdkConnectedOverlayDisposeOnNavigation",
				"disposeOnNavigation",
				booleanAttribute
			],
			usePopover: [
				0,
				"cdkConnectedOverlayUsePopover",
				"usePopover"
			],
			matchWidth: [
				2,
				"cdkConnectedOverlayMatchWidth",
				"matchWidth",
				booleanAttribute
			],
			_config: [
				0,
				"cdkConnectedOverlay",
				"_config"
			]
		},
		outputs: {
			backdropClick: "backdropClick",
			positionChange: "positionChange",
			attach: "attach",
			detach: "detach",
			overlayKeydown: "overlayKeydown",
			overlayOutsideClick: "overlayOutsideClick"
		},
		exportAs: ["cdkConnectedOverlay"],
		features: [ɵɵNgOnChangesFeature]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkConnectedOverlay, [{
		type: Directive,
		args: [{
			selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]",
			exportAs: "cdkConnectedOverlay"
		}]
	}], () => [], {
		origin: [{
			type: Input,
			args: ["cdkConnectedOverlayOrigin"]
		}],
		positions: [{
			type: Input,
			args: ["cdkConnectedOverlayPositions"]
		}],
		positionStrategy: [{
			type: Input,
			args: ["cdkConnectedOverlayPositionStrategy"]
		}],
		offsetX: [{
			type: Input,
			args: ["cdkConnectedOverlayOffsetX"]
		}],
		offsetY: [{
			type: Input,
			args: ["cdkConnectedOverlayOffsetY"]
		}],
		width: [{
			type: Input,
			args: ["cdkConnectedOverlayWidth"]
		}],
		height: [{
			type: Input,
			args: ["cdkConnectedOverlayHeight"]
		}],
		minWidth: [{
			type: Input,
			args: ["cdkConnectedOverlayMinWidth"]
		}],
		minHeight: [{
			type: Input,
			args: ["cdkConnectedOverlayMinHeight"]
		}],
		backdropClass: [{
			type: Input,
			args: ["cdkConnectedOverlayBackdropClass"]
		}],
		panelClass: [{
			type: Input,
			args: ["cdkConnectedOverlayPanelClass"]
		}],
		viewportMargin: [{
			type: Input,
			args: ["cdkConnectedOverlayViewportMargin"]
		}],
		scrollStrategy: [{
			type: Input,
			args: ["cdkConnectedOverlayScrollStrategy"]
		}],
		open: [{
			type: Input,
			args: ["cdkConnectedOverlayOpen"]
		}],
		disableClose: [{
			type: Input,
			args: ["cdkConnectedOverlayDisableClose"]
		}],
		transformOriginSelector: [{
			type: Input,
			args: ["cdkConnectedOverlayTransformOriginOn"]
		}],
		hasBackdrop: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayHasBackdrop",
				transform: booleanAttribute
			}]
		}],
		lockPosition: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayLockPosition",
				transform: booleanAttribute
			}]
		}],
		flexibleDimensions: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayFlexibleDimensions",
				transform: booleanAttribute
			}]
		}],
		growAfterOpen: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayGrowAfterOpen",
				transform: booleanAttribute
			}]
		}],
		push: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayPush",
				transform: booleanAttribute
			}]
		}],
		disposeOnNavigation: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayDisposeOnNavigation",
				transform: booleanAttribute
			}]
		}],
		usePopover: [{
			type: Input,
			args: [{ alias: "cdkConnectedOverlayUsePopover" }]
		}],
		matchWidth: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayMatchWidth",
				transform: booleanAttribute
			}]
		}],
		_config: [{
			type: Input,
			args: ["cdkConnectedOverlay"]
		}],
		backdropClick: [{ type: Output }],
		positionChange: [{ type: Output }],
		attach: [{ type: Output }],
		detach: [{ type: Output }],
		overlayKeydown: [{ type: Output }],
		overlayOutsideClick: [{ type: Output }]
	});
})();
var OverlayModule = class OverlayModule {
	static ɵfac = function OverlayModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || OverlayModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: OverlayModule,
		imports: [
			BidiModule,
			PortalModule,
			ScrollingModule,
			CdkConnectedOverlay,
			CdkOverlayOrigin
		],
		exports: [
			CdkConnectedOverlay,
			CdkOverlayOrigin,
			ScrollingModule
		]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({
		providers: [Overlay],
		imports: [
			BidiModule,
			PortalModule,
			ScrollingModule,
			ScrollingModule
		]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayModule, [{
		type: NgModule,
		args: [{
			imports: [
				BidiModule,
				PortalModule,
				ScrollingModule,
				CdkConnectedOverlay,
				CdkOverlayOrigin
			],
			exports: [
				CdkConnectedOverlay,
				CdkOverlayOrigin,
				ScrollingModule
			],
			providers: [Overlay]
		}]
	}], null, null);
})();
//#endregion
//#region node_modules/@angular/cdk/fesm2022/overlay.mjs
var FullscreenOverlayContainer = class FullscreenOverlayContainer extends OverlayContainer {
	_renderer = inject(RendererFactory2).createRenderer(null, null);
	_fullScreenEventName;
	_cleanupFullScreenListener;
	ngOnDestroy() {
		super.ngOnDestroy();
		this._cleanupFullScreenListener?.();
	}
	_createContainer() {
		const eventName = this._getEventName();
		super._createContainer();
		this._adjustParentForFullscreenChange();
		if (eventName) {
			this._cleanupFullScreenListener?.();
			this._cleanupFullScreenListener = this._renderer.listen("document", eventName, () => {
				this._adjustParentForFullscreenChange();
			});
		}
	}
	_adjustParentForFullscreenChange() {
		if (this._containerElement) (this.getFullscreenElement() || this._document.body).appendChild(this._containerElement);
	}
	_getEventName() {
		if (!this._fullScreenEventName) {
			const _document = this._document;
			if (_document.fullscreenEnabled) this._fullScreenEventName = "fullscreenchange";
			else if (_document.webkitFullscreenEnabled) this._fullScreenEventName = "webkitfullscreenchange";
			else if (_document.mozFullScreenEnabled) this._fullScreenEventName = "mozfullscreenchange";
			else if (_document.msFullscreenEnabled) this._fullScreenEventName = "MSFullscreenChange";
		}
		return this._fullScreenEventName;
	}
	getFullscreenElement() {
		const _document = this._document;
		return _document.fullscreenElement || _document.webkitFullscreenElement || _document.mozFullScreenElement || _document.msFullscreenElement || null;
	}
	static ɵfac = function FullscreenOverlayContainer_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || FullscreenOverlayContainer)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: FullscreenOverlayContainer,
		factory: FullscreenOverlayContainer.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FullscreenOverlayContainer, [{ type: Service }], null, null);
})();
//#endregion
//#region node_modules/@angular/cdk/fesm2022/dialog.mjs
function CdkDialogContainer_ng_template_0_Template(rf, ctx) {}
var DialogConfig = class {
	viewContainerRef;
	injector;
	id;
	role = "dialog";
	panelClass = "";
	hasBackdrop = true;
	backdropClass = "";
	disableClose = false;
	closePredicate;
	width = "";
	height = "";
	minWidth;
	minHeight;
	maxWidth;
	maxHeight;
	positionStrategy;
	data = null;
	direction;
	ariaDescribedBy = null;
	ariaLabelledBy = null;
	ariaLabel = null;
	ariaModal = false;
	autoFocus = "first-tabbable";
	restoreFocus = true;
	scrollStrategy;
	closeOnNavigation = true;
	closeOnDestroy = true;
	closeOnOverlayDetachments = true;
	disableAnimations = false;
	providers;
	container;
	templateContext;
	bindings;
};
function throwDialogContentAlreadyAttachedError() {
	throw Error("Attempting to attach dialog content after content is already attached");
}
var CdkDialogContainer = class CdkDialogContainer extends BasePortalOutlet {
	_elementRef = inject(ElementRef);
	_focusTrapFactory = inject(FocusTrapFactory);
	_config;
	_interactivityChecker = inject(InteractivityChecker);
	_ngZone = inject(NgZone);
	_focusMonitor = inject(FocusMonitor);
	_renderer = inject(Renderer2);
	_changeDetectorRef = inject(ChangeDetectorRef);
	_injector = inject(Injector);
	_platform = inject(Platform);
	_document = inject(DOCUMENT);
	_portalOutlet;
	_focusTrapped = new Subject();
	_focusTrap = null;
	_elementFocusedBeforeDialogWasOpened = null;
	_closeInteractionType = null;
	_ariaLabelledByQueue = [];
	_isDestroyed = false;
	constructor() {
		super();
		this._config = inject(DialogConfig, { optional: true }) || new DialogConfig();
		if (this._config.ariaLabelledBy) this._ariaLabelledByQueue.push(this._config.ariaLabelledBy);
	}
	_addAriaLabelledBy(id) {
		this._ariaLabelledByQueue.push(id);
		this._changeDetectorRef.markForCheck();
	}
	_removeAriaLabelledBy(id) {
		const index = this._ariaLabelledByQueue.indexOf(id);
		if (index > -1) {
			this._ariaLabelledByQueue.splice(index, 1);
			this._changeDetectorRef.markForCheck();
		}
	}
	_contentAttached() {
		this._initializeFocusTrap();
		this._captureInitialFocus();
	}
	_captureInitialFocus() {
		this._trapFocus();
	}
	ngOnDestroy() {
		this._focusTrapped.complete();
		this._isDestroyed = true;
		this._restoreFocus();
	}
	attachComponentPortal(portal) {
		if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) throwDialogContentAlreadyAttachedError();
		const result = this._portalOutlet.attachComponentPortal(portal);
		this._contentAttached();
		return result;
	}
	attachTemplatePortal(portal) {
		if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) throwDialogContentAlreadyAttachedError();
		const result = this._portalOutlet.attachTemplatePortal(portal);
		this._contentAttached();
		return result;
	}
	attachDomPortal = (portal) => {
		if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) throwDialogContentAlreadyAttachedError();
		const result = this._portalOutlet.attachDomPortal(portal);
		this._contentAttached();
		return result;
	};
	_recaptureFocus() {
		if (!this._containsFocus()) this._trapFocus();
	}
	_forceFocus(element, options) {
		if (!this._interactivityChecker.isFocusable(element)) {
			element.tabIndex = -1;
			this._ngZone.runOutsideAngular(() => {
				const callback = () => {
					deregisterBlur();
					deregisterMousedown();
					element.removeAttribute("tabindex");
				};
				const deregisterBlur = this._renderer.listen(element, "blur", callback);
				const deregisterMousedown = this._renderer.listen(element, "mousedown", callback);
			});
		}
		element.focus(options);
	}
	_focusByCssSelector(selector, options) {
		let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
		if (elementToFocus) this._forceFocus(elementToFocus, options);
	}
	_trapFocus(options) {
		if (this._isDestroyed) return;
		afterNextRender(() => {
			const element = this._elementRef.nativeElement;
			switch (this._config.autoFocus) {
				case false:
				case "dialog":
					if (!this._containsFocus()) element.focus(options);
					break;
				case true:
				case "first-tabbable":
					if (!this._focusTrap?.focusInitialElement(options)) this._focusDialogContainer(options);
					break;
				case "first-heading":
					this._focusByCssSelector("h1, h2, h3, h4, h5, h6, [role=\"heading\"]", options);
					break;
				default:
					this._focusByCssSelector(this._config.autoFocus, options);
					break;
			}
			this._focusTrapped.next();
		}, { injector: this._injector });
	}
	_restoreFocus() {
		const focusConfig = this._config.restoreFocus;
		let focusTargetElement = null;
		if (typeof focusConfig === "string") focusTargetElement = this._document.querySelector(focusConfig);
		else if (typeof focusConfig === "boolean") focusTargetElement = focusConfig ? this._elementFocusedBeforeDialogWasOpened : null;
		else if (focusConfig) focusTargetElement = focusConfig;
		if (this._config.restoreFocus && focusTargetElement && typeof focusTargetElement.focus === "function") {
			const activeElement = _getFocusedElementPierceShadowDom();
			const element = this._elementRef.nativeElement;
			if (!activeElement || activeElement === this._document.body || activeElement === element || element.contains(activeElement)) if (this._focusMonitor) {
				this._focusMonitor.focusVia(focusTargetElement, this._closeInteractionType);
				this._closeInteractionType = null;
			} else focusTargetElement.focus();
		}
		if (this._focusTrap) this._focusTrap.destroy();
	}
	_focusDialogContainer(options) {
		this._elementRef.nativeElement.focus?.(options);
	}
	_containsFocus() {
		const element = this._elementRef.nativeElement;
		const activeElement = _getFocusedElementPierceShadowDom();
		return element === activeElement || element.contains(activeElement);
	}
	_initializeFocusTrap() {
		if (this._platform.isBrowser) {
			this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
			if (this._document) this._elementFocusedBeforeDialogWasOpened = _getFocusedElementPierceShadowDom();
		}
	}
	static ɵfac = function CdkDialogContainer_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || CdkDialogContainer)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: CdkDialogContainer,
		selectors: [["cdk-dialog-container"]],
		viewQuery: function CdkDialogContainer_Query(rf, ctx) {
			if (rf & 1) ɵɵviewQuery(CdkPortalOutlet, 7);
			if (rf & 2) {
				let _t;
				ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._portalOutlet = _t.first);
			}
		},
		hostAttrs: [
			"tabindex",
			"-1",
			1,
			"cdk-dialog-container"
		],
		hostVars: 6,
		hostBindings: function CdkDialogContainer_HostBindings(rf, ctx) {
			if (rf & 2) ɵɵattribute("id", ctx._config.id || null)("role", ctx._config.role)("aria-modal", ctx._config.ariaModal)("aria-labelledby", ctx._config.ariaLabel ? null : ctx._ariaLabelledByQueue[0])("aria-label", ctx._config.ariaLabel)("aria-describedby", ctx._config.ariaDescribedBy || null);
		},
		features: [ɵɵInheritDefinitionFeature],
		decls: 1,
		vars: 0,
		consts: [["cdkPortalOutlet", ""]],
		template: function CdkDialogContainer_Template(rf, ctx) {
			if (rf & 1) ɵɵtemplate(0, CdkDialogContainer_ng_template_0_Template, 0, 0, "ng-template", 0);
		},
		dependencies: [CdkPortalOutlet],
		styles: [".cdk-dialog-container {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: inherit;\n  max-height: inherit;\n}\n"],
		encapsulation: 2,
		changeDetection: 1
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkDialogContainer, [{
		type: Component,
		args: [{
			selector: "cdk-dialog-container",
			encapsulation: ViewEncapsulation.None,
			changeDetection: ChangeDetectionStrategy.Eager,
			imports: [CdkPortalOutlet],
			host: {
				"class": "cdk-dialog-container",
				"tabindex": "-1",
				"[attr.id]": "_config.id || null",
				"[attr.role]": "_config.role",
				"[attr.aria-modal]": "_config.ariaModal",
				"[attr.aria-labelledby]": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]",
				"[attr.aria-label]": "_config.ariaLabel",
				"[attr.aria-describedby]": "_config.ariaDescribedBy || null"
			},
			template: "<ng-template cdkPortalOutlet />\n",
			styles: [".cdk-dialog-container {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: inherit;\n  max-height: inherit;\n}\n"]
		}]
	}], () => [], { _portalOutlet: [{
		type: ViewChild,
		args: [CdkPortalOutlet, { static: true }]
	}] });
})();
var DialogRef = class {
	overlayRef;
	config;
	componentInstance = null;
	componentRef = null;
	containerInstance;
	disableClose;
	closed = new Subject();
	backdropClick;
	keydownEvents;
	outsidePointerEvents;
	id;
	_detachSubscription;
	constructor(overlayRef, config) {
		this.overlayRef = overlayRef;
		this.config = config;
		this.disableClose = config.disableClose;
		this.backdropClick = overlayRef.backdropClick();
		this.keydownEvents = overlayRef.keydownEvents();
		this.outsidePointerEvents = overlayRef.outsidePointerEvents();
		this.id = config.id;
		this.keydownEvents.subscribe((event) => {
			if (event.keyCode === 27 && !this.disableClose && !hasModifierKey(event)) {
				event.preventDefault();
				this.close(void 0, { focusOrigin: "keyboard" });
			}
		});
		this.backdropClick.subscribe(() => {
			if (!this.disableClose && this._canClose()) this.close(void 0, { focusOrigin: "mouse" });
			else this.containerInstance._recaptureFocus?.();
		});
		this._detachSubscription = overlayRef.detachments().subscribe(() => {
			if (config.closeOnOverlayDetachments !== false) this.close();
		});
	}
	close(result, options) {
		if (this._canClose(result)) {
			const closedSubject = this.closed;
			this.containerInstance._closeInteractionType = options?.focusOrigin || "program";
			this._detachSubscription.unsubscribe();
			this.overlayRef.dispose();
			closedSubject.next(result);
			closedSubject.complete();
			this.componentInstance = this.containerInstance = null;
		}
	}
	updatePosition() {
		this.overlayRef.updatePosition();
		return this;
	}
	updateSize(width = "", height = "") {
		this.overlayRef.updateSize({
			width,
			height
		});
		return this;
	}
	addPanelClass(classes) {
		this.overlayRef.addPanelClass(classes);
		return this;
	}
	removePanelClass(classes) {
		this.overlayRef.removePanelClass(classes);
		return this;
	}
	_canClose(result) {
		const config = this.config;
		return !!this.containerInstance && (!config.closePredicate || config.closePredicate(result, config, this.componentInstance));
	}
};
var DIALOG_SCROLL_STRATEGY = new InjectionToken("DialogScrollStrategy", {
	providedIn: "root",
	factory: () => {
		const injector = inject(Injector);
		return () => createBlockScrollStrategy(injector);
	}
});
var DIALOG_DATA = new InjectionToken("DialogData");
var DEFAULT_DIALOG_CONFIG = new InjectionToken("DefaultDialogConfig");
function getDirectionality(value) {
	const valueSignal = signal(value, ...ngDevMode ? [{ debugName: "valueSignal" }] : []);
	const change = new EventEmitter();
	return {
		valueSignal,
		get value() {
			return valueSignal();
		},
		change,
		ngOnDestroy() {
			change.complete();
		}
	};
}
var Dialog = class Dialog {
	_injector = inject(Injector);
	_defaultOptions = inject(DEFAULT_DIALOG_CONFIG, { optional: true });
	_parentDialog = inject(Dialog, {
		optional: true,
		skipSelf: true
	});
	_overlayContainer = inject(OverlayContainer);
	_idGenerator = inject(_IdGenerator);
	_openDialogsAtThisLevel = [];
	_afterAllClosedAtThisLevel = new Subject();
	_afterOpenedAtThisLevel = new Subject();
	_ariaHiddenElements = /* @__PURE__ */ new Map();
	_scrollStrategy = inject(DIALOG_SCROLL_STRATEGY);
	get openDialogs() {
		return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
	}
	get afterOpened() {
		return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
	}
	afterAllClosed = defer(() => this.openDialogs.length ? this._getAfterAllClosed() : this._getAfterAllClosed().pipe(startWith(void 0)));
	open(componentOrTemplateRef, config) {
		config = {
			...this._defaultOptions || new DialogConfig(),
			...config
		};
		config.id = config.id || this._idGenerator.getId("cdk-dialog-");
		if (config.id && this.getDialogById(config.id) && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
		const overlayConfig = this._getOverlayConfig(config);
		const overlayRef = createOverlayRef(this._injector, overlayConfig);
		const dialogRef = new DialogRef(overlayRef, config);
		const dialogContainer = this._attachContainer(overlayRef, dialogRef, config);
		dialogRef.containerInstance = dialogContainer;
		if (!this.openDialogs.length) {
			const overlayContainer = this._overlayContainer.getContainerElement();
			if (dialogContainer._focusTrapped) dialogContainer._focusTrapped.pipe(take(1)).subscribe(() => {
				this._hideNonDialogContentFromAssistiveTechnology(overlayContainer);
			});
			else this._hideNonDialogContentFromAssistiveTechnology(overlayContainer);
		}
		this._attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config);
		this.openDialogs.push(dialogRef);
		dialogRef.closed.subscribe(() => this._removeOpenDialog(dialogRef, true));
		this.afterOpened.next(dialogRef);
		return dialogRef;
	}
	closeAll() {
		reverseForEach(this.openDialogs, (dialog) => dialog.close());
	}
	getDialogById(id) {
		return this.openDialogs.find((dialog) => dialog.id === id);
	}
	ngOnDestroy() {
		reverseForEach(this._openDialogsAtThisLevel, (dialog) => {
			if (dialog.config.closeOnDestroy === false) this._removeOpenDialog(dialog, false);
		});
		reverseForEach(this._openDialogsAtThisLevel, (dialog) => dialog.close());
		this._afterAllClosedAtThisLevel.complete();
		this._afterOpenedAtThisLevel.complete();
		this._openDialogsAtThisLevel = [];
	}
	_getOverlayConfig(config) {
		const state = new OverlayConfig({
			positionStrategy: config.positionStrategy || createGlobalPositionStrategy().centerHorizontally().centerVertically(),
			scrollStrategy: config.scrollStrategy || this._scrollStrategy(),
			panelClass: config.panelClass,
			hasBackdrop: config.hasBackdrop,
			direction: config.direction,
			minWidth: config.minWidth,
			minHeight: config.minHeight,
			maxWidth: config.maxWidth,
			maxHeight: config.maxHeight,
			width: config.width,
			height: config.height,
			disposeOnNavigation: config.closeOnNavigation,
			disableAnimations: config.disableAnimations
		});
		if (config.backdropClass) state.backdropClass = config.backdropClass;
		return state;
	}
	_attachContainer(overlay, dialogRef, config) {
		const userInjector = config.injector || config.viewContainerRef?.injector;
		const providers = [
			{
				provide: DialogConfig,
				useValue: config
			},
			{
				provide: DialogRef,
				useValue: dialogRef
			},
			{
				provide: OverlayRef,
				useValue: overlay
			}
		];
		let containerType;
		if (config.container) if (typeof config.container === "function") containerType = config.container;
		else {
			containerType = config.container.type;
			providers.push(...config.container.providers(config));
		}
		else containerType = CdkDialogContainer;
		const containerPortal = new ComponentPortal(containerType, config.viewContainerRef, Injector.create({
			parent: userInjector || this._injector,
			providers
		}));
		return overlay.attach(containerPortal).instance;
	}
	_attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config) {
		if (componentOrTemplateRef instanceof TemplateRef) {
			const injector = this._createInjector(config, dialogRef, dialogContainer, void 0);
			let context = {
				$implicit: config.data,
				dialogRef
			};
			if (config.templateContext) context = {
				...context,
				...typeof config.templateContext === "function" ? config.templateContext() : config.templateContext
			};
			dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, context, injector));
		} else {
			const injector = this._createInjector(config, dialogRef, dialogContainer, this._injector);
			const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector, null, config.bindings));
			dialogRef.componentRef = contentRef;
			dialogRef.componentInstance = contentRef.instance;
		}
	}
	_createInjector(config, dialogRef, dialogContainer, fallbackInjector) {
		const userInjector = config.injector || config.viewContainerRef?.injector;
		const providers = [{
			provide: DIALOG_DATA,
			useValue: config.data
		}, {
			provide: DialogRef,
			useValue: dialogRef
		}];
		if (config.providers) if (typeof config.providers === "function") providers.push(...config.providers(dialogRef, config, dialogContainer));
		else providers.push(...config.providers);
		if (config.direction && (!userInjector || !userInjector.get(Directionality, null, { optional: true }))) providers.push({
			provide: Directionality,
			useValue: getDirectionality(config.direction)
		});
		return Injector.create({
			parent: userInjector || fallbackInjector,
			providers
		});
	}
	_removeOpenDialog(dialogRef, emitEvent) {
		const index = this.openDialogs.indexOf(dialogRef);
		if (index > -1) {
			this.openDialogs.splice(index, 1);
			if (!this.openDialogs.length) {
				this._ariaHiddenElements.forEach((previousValue, element) => {
					if (previousValue) element.setAttribute("aria-hidden", previousValue);
					else element.removeAttribute("aria-hidden");
				});
				this._ariaHiddenElements.clear();
				if (emitEvent) this._getAfterAllClosed().next();
			}
		}
	}
	_hideNonDialogContentFromAssistiveTechnology(overlayContainer) {
		if (overlayContainer.parentElement) {
			const siblings = overlayContainer.parentElement.children;
			for (let i = siblings.length - 1; i > -1; i--) {
				const sibling = siblings[i];
				if (sibling !== overlayContainer && sibling.nodeName !== "SCRIPT" && sibling.nodeName !== "STYLE" && !sibling.hasAttribute("aria-live") && !sibling.hasAttribute("popover")) {
					this._ariaHiddenElements.set(sibling, sibling.getAttribute("aria-hidden"));
					sibling.setAttribute("aria-hidden", "true");
				}
			}
		}
	}
	_getAfterAllClosed() {
		const parent = this._parentDialog;
		return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
	}
	static ɵfac = function Dialog_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || Dialog)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: Dialog,
		factory: Dialog.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Dialog, [{ type: Service }], null, null);
})();
function reverseForEach(items, callback) {
	let i = items.length;
	while (i--) callback(items[i]);
}
var DialogModule = class DialogModule {
	static ɵfac = function DialogModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || DialogModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: DialogModule,
		imports: [
			OverlayModule,
			PortalModule,
			A11yModule,
			CdkDialogContainer
		],
		exports: [PortalModule, CdkDialogContainer]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({
		providers: [Dialog],
		imports: [
			OverlayModule,
			PortalModule,
			A11yModule,
			PortalModule
		]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DialogModule, [{
		type: NgModule,
		args: [{
			imports: [
				OverlayModule,
				PortalModule,
				A11yModule,
				CdkDialogContainer
			],
			exports: [PortalModule, CdkDialogContainer],
			providers: [Dialog]
		}]
	}], null, null);
})();
//#endregion
//#region node_modules/@angular/material/fesm2022/dialog.mjs
function MatDialogContainer_ng_template_2_Template(rf, ctx) {}
var MatDialogConfig = class {
	viewContainerRef;
	injector;
	id;
	role = "dialog";
	panelClass = "";
	hasBackdrop = true;
	backdropClass = "";
	disableClose = false;
	closePredicate;
	width = "";
	height = "";
	minWidth;
	minHeight;
	maxWidth;
	maxHeight;
	position;
	data = null;
	direction;
	ariaDescribedBy = null;
	ariaLabelledBy = null;
	ariaLabel = null;
	ariaModal = false;
	autoFocus = "first-tabbable";
	restoreFocus = true;
	delayFocusTrap = true;
	scrollStrategy;
	closeOnNavigation = true;
	enterAnimationDuration;
	exitAnimationDuration;
	bindings;
};
var OPEN_CLASS = "mdc-dialog--open";
var OPENING_CLASS = "mdc-dialog--opening";
var CLOSING_CLASS = "mdc-dialog--closing";
var OPEN_ANIMATION_DURATION = 150;
var CLOSE_ANIMATION_DURATION = 75;
var MatDialogContainer = class MatDialogContainer extends CdkDialogContainer {
	_animationStateChanged = new EventEmitter();
	_animationsEnabled = !_animationsDisabled();
	_actionSectionCount = 0;
	_hostElement = this._elementRef.nativeElement;
	_enterAnimationDuration = this._animationsEnabled ? parseCssTime(this._config.enterAnimationDuration) ?? OPEN_ANIMATION_DURATION : 0;
	_exitAnimationDuration = this._animationsEnabled ? parseCssTime(this._config.exitAnimationDuration) ?? CLOSE_ANIMATION_DURATION : 0;
	_animationTimer = null;
	_contentAttached() {
		super._contentAttached();
		this._startOpenAnimation();
	}
	_startOpenAnimation() {
		this._animationStateChanged.emit({
			state: "opening",
			totalTime: this._enterAnimationDuration
		});
		if (this._animationsEnabled) {
			this._hostElement.style.setProperty(TRANSITION_DURATION_PROPERTY, `${this._enterAnimationDuration}ms`);
			this._requestAnimationFrame(() => this._hostElement.classList.add(OPENING_CLASS, OPEN_CLASS));
			this._waitForAnimationToComplete(this._enterAnimationDuration, this._finishDialogOpen);
		} else {
			this._hostElement.classList.add(OPEN_CLASS);
			Promise.resolve().then(() => this._finishDialogOpen());
		}
	}
	_startExitAnimation() {
		this._animationStateChanged.emit({
			state: "closing",
			totalTime: this._exitAnimationDuration
		});
		this._hostElement.classList.remove(OPEN_CLASS);
		if (this._animationsEnabled) {
			this._hostElement.style.setProperty(TRANSITION_DURATION_PROPERTY, `${this._exitAnimationDuration}ms`);
			this._requestAnimationFrame(() => this._hostElement.classList.add(CLOSING_CLASS));
			this._waitForAnimationToComplete(this._exitAnimationDuration, this._finishDialogClose);
		} else Promise.resolve().then(() => this._finishDialogClose());
	}
	_updateActionSectionCount(delta) {
		this._actionSectionCount += delta;
		this._changeDetectorRef.markForCheck();
	}
	_finishDialogOpen = () => {
		this._clearAnimationClasses();
		this._openAnimationDone(this._enterAnimationDuration);
	};
	_finishDialogClose = () => {
		this._clearAnimationClasses();
		this._animationStateChanged.emit({
			state: "closed",
			totalTime: this._exitAnimationDuration
		});
	};
	_clearAnimationClasses() {
		this._hostElement.classList.remove(OPENING_CLASS, CLOSING_CLASS);
	}
	_waitForAnimationToComplete(duration, callback) {
		if (this._animationTimer !== null) clearTimeout(this._animationTimer);
		this._animationTimer = setTimeout(callback, duration);
	}
	_requestAnimationFrame(callback) {
		this._ngZone.runOutsideAngular(() => {
			if (typeof requestAnimationFrame === "function") requestAnimationFrame(callback);
			else callback();
		});
	}
	_captureInitialFocus() {
		if (!this._config.delayFocusTrap) this._trapFocus();
	}
	_openAnimationDone(totalTime) {
		if (this._config.delayFocusTrap) this._trapFocus();
		this._animationStateChanged.next({
			state: "opened",
			totalTime
		});
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		if (this._animationTimer !== null) clearTimeout(this._animationTimer);
	}
	attachComponentPortal(portal) {
		const ref = super.attachComponentPortal(portal);
		ref.location.nativeElement.classList.add("mat-mdc-dialog-component-host");
		return ref;
	}
	static ɵfac = /* @__PURE__ */ (() => {
		let ɵMatDialogContainer_BaseFactory;
		return function MatDialogContainer_Factory(__ngFactoryType__) {
			return (ɵMatDialogContainer_BaseFactory || (ɵMatDialogContainer_BaseFactory = ɵɵgetInheritedFactory(MatDialogContainer)))(__ngFactoryType__ || MatDialogContainer);
		};
	})();
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: MatDialogContainer,
		selectors: [["mat-dialog-container"]],
		hostAttrs: [
			"tabindex",
			"-1",
			1,
			"mat-mdc-dialog-container",
			"mdc-dialog"
		],
		hostVars: 10,
		hostBindings: function MatDialogContainer_HostBindings(rf, ctx) {
			if (rf & 2) {
				ɵɵdomProperty("id", ctx._config.id);
				ɵɵattribute("aria-modal", ctx._config.ariaModal)("role", ctx._config.role)("aria-labelledby", ctx._config.ariaLabel ? null : ctx._ariaLabelledByQueue[0])("aria-label", ctx._config.ariaLabel)("aria-describedby", ctx._config.ariaDescribedBy || null);
				ɵɵclassProp("_mat-animation-noopable", !ctx._animationsEnabled)("mat-mdc-dialog-container-with-actions", ctx._actionSectionCount > 0);
			}
		},
		features: [ɵɵInheritDefinitionFeature],
		decls: 3,
		vars: 0,
		consts: [
			[
				1,
				"mat-mdc-dialog-inner-container",
				"mdc-dialog__container"
			],
			[
				1,
				"mat-mdc-dialog-surface",
				"mdc-dialog__surface"
			],
			["cdkPortalOutlet", ""]
		],
		template: function MatDialogContainer_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵelementStart(0, "div", 0)(1, "div", 1);
				ɵɵtemplate(2, MatDialogContainer_ng_template_2_Template, 0, 0, "ng-template", 2);
				ɵɵelementEnd()();
			}
		},
		dependencies: [CdkPortalOutlet],
		styles: [".mat-mdc-dialog-container {\n  width: 100%;\n  height: 100%;\n  display: block;\n  box-sizing: border-box;\n  max-height: inherit;\n  min-height: inherit;\n  min-width: inherit;\n  max-width: inherit;\n  outline: 0;\n}\n\n.cdk-overlay-pane.mat-mdc-dialog-panel {\n  max-width: var(--%NS%mat-dialog-container-max-width, 560px);\n  min-width: var(--%NS%mat-dialog-container-min-width, 280px);\n}\n@media (max-width: 599px) {\n  .cdk-overlay-pane.mat-mdc-dialog-panel {\n    max-width: var(--%NS%mat-dialog-container-small-max-width, calc(100vw - 32px));\n  }\n}\n\n.mat-mdc-dialog-inner-container {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-around;\n  box-sizing: border-box;\n  height: 100%;\n  opacity: 0;\n  transition: opacity linear var(--%NS%mat-dialog-transition-duration, 0ms);\n  max-height: inherit;\n  min-height: inherit;\n  min-width: inherit;\n  max-width: inherit;\n}\n.mdc-dialog--closing .mat-mdc-dialog-inner-container {\n  transition: opacity 75ms linear;\n  transform: none;\n}\n.mdc-dialog--open .mat-mdc-dialog-inner-container {\n  opacity: 1;\n}\n._mat-animation-noopable .mat-mdc-dialog-inner-container {\n  transition: none;\n}\n\n.mat-mdc-dialog-surface {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 0;\n  flex-shrink: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  position: relative;\n  overflow-y: auto;\n  outline: 0;\n  transform: scale(0.8);\n  transition: transform var(--%NS%mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);\n  max-height: inherit;\n  min-height: inherit;\n  min-width: inherit;\n  max-width: inherit;\n  box-shadow: var(--%NS%mat-dialog-container-elevation-shadow, none);\n  border-radius: var(--%NS%mat-dialog-container-shape, var(--%NS%mat-sys-corner-extra-large, 4px));\n  background-color: var(--%NS%mat-dialog-container-color, var(--%NS%mat-sys-surface, white));\n}\n[dir=rtl] .mat-mdc-dialog-surface {\n  text-align: right;\n}\n.mdc-dialog--open .mat-mdc-dialog-surface, .mdc-dialog--closing .mat-mdc-dialog-surface {\n  transform: none;\n}\n._mat-animation-noopable .mat-mdc-dialog-surface {\n  transition: none;\n}\n.mat-mdc-dialog-surface::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 2px solid transparent;\n  border-radius: inherit;\n  content: \"\";\n  pointer-events: none;\n}\n\n.mat-mdc-dialog-title {\n  display: block;\n  position: relative;\n  flex-shrink: 0;\n  box-sizing: border-box;\n  margin: 0 0 1px;\n  padding: var(--%NS%mat-dialog-headline-padding, 6px 24px 13px);\n}\n.mat-mdc-dialog-title::before {\n  display: inline-block;\n  width: 0;\n  height: 40px;\n  content: \"\";\n  vertical-align: 0;\n}\n[dir=rtl] .mat-mdc-dialog-title {\n  text-align: right;\n}\n.mat-mdc-dialog-container .mat-mdc-dialog-title {\n  color: var(--%NS%mat-dialog-subhead-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));\n  font-family: var(--%NS%mat-dialog-subhead-font, var(--%NS%mat-sys-headline-small-font, inherit));\n  line-height: var(--%NS%mat-dialog-subhead-line-height, var(--%NS%mat-sys-headline-small-line-height, 1.5rem));\n  font-size: var(--%NS%mat-dialog-subhead-size, var(--%NS%mat-sys-headline-small-size, 1rem));\n  font-weight: var(--%NS%mat-dialog-subhead-weight, var(--%NS%mat-sys-headline-small-weight, 400));\n  letter-spacing: var(--%NS%mat-dialog-subhead-tracking, var(--%NS%mat-sys-headline-small-tracking, 0.03125em));\n}\n\n.mat-mdc-dialog-content {\n  display: block;\n  flex-grow: 1;\n  box-sizing: border-box;\n  margin: 0;\n  overflow: auto;\n  max-height: 65vh;\n}\n.mat-mdc-dialog-content > :first-child {\n  margin-top: 0;\n}\n.mat-mdc-dialog-content > :last-child {\n  margin-bottom: 0;\n}\n.mat-mdc-dialog-container .mat-mdc-dialog-content {\n  color: var(--%NS%mat-dialog-supporting-text-color, var(--%NS%mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));\n  font-family: var(--%NS%mat-dialog-supporting-text-font, var(--%NS%mat-sys-body-medium-font, inherit));\n  line-height: var(--%NS%mat-dialog-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height, 1.5rem));\n  font-size: var(--%NS%mat-dialog-supporting-text-size, var(--%NS%mat-sys-body-medium-size, 1rem));\n  font-weight: var(--%NS%mat-dialog-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight, 400));\n  letter-spacing: var(--%NS%mat-dialog-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking, 0.03125em));\n}\n.mat-mdc-dialog-container .mat-mdc-dialog-content {\n  padding: var(--%NS%mat-dialog-content-padding, 20px 24px);\n}\n.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content {\n  padding: var(--%NS%mat-dialog-with-actions-content-padding, 20px 24px 0);\n}\n.mat-mdc-dialog-container .mat-mdc-dialog-title + .mat-mdc-dialog-content {\n  padding-top: 0;\n}\n\n.mat-mdc-dialog-actions {\n  display: flex;\n  position: relative;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  box-sizing: border-box;\n  min-height: 52px;\n  margin: 0;\n  border-top: 1px solid transparent;\n  padding: var(--%NS%mat-dialog-actions-padding, 16px 24px);\n  justify-content: var(--%NS%mat-dialog-actions-alignment, flex-end);\n}\n@media (forced-colors: active) {\n  .mat-mdc-dialog-actions {\n    border-top-color: CanvasText;\n  }\n}\n.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start, .mat-mdc-dialog-actions[align=start] {\n  justify-content: start;\n}\n.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center, .mat-mdc-dialog-actions[align=center] {\n  justify-content: center;\n}\n.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end, .mat-mdc-dialog-actions[align=end] {\n  justify-content: flex-end;\n}\n.mat-mdc-dialog-actions .mat-button-base + .mat-button-base,\n.mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {\n  margin-left: 8px;\n}\n[dir=rtl] .mat-mdc-dialog-actions .mat-button-base + .mat-button-base,\n[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {\n  margin-left: 0;\n  margin-right: 8px;\n}\n\n.mat-mdc-dialog-component-host {\n  display: contents;\n}\n"],
		encapsulation: 2,
		changeDetection: 1
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDialogContainer, [{
		type: Component,
		args: [{
			selector: "mat-dialog-container",
			encapsulation: ViewEncapsulation.None,
			changeDetection: ChangeDetectionStrategy.Eager,
			imports: [CdkPortalOutlet],
			host: {
				"class": "mat-mdc-dialog-container mdc-dialog",
				"tabindex": "-1",
				"[attr.aria-modal]": "_config.ariaModal",
				"[id]": "_config.id",
				"[attr.role]": "_config.role",
				"[attr.aria-labelledby]": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]",
				"[attr.aria-label]": "_config.ariaLabel",
				"[attr.aria-describedby]": "_config.ariaDescribedBy || null",
				"[class._mat-animation-noopable]": "!_animationsEnabled",
				"[class.mat-mdc-dialog-container-with-actions]": "_actionSectionCount > 0"
			},
			template: "<div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\">\n  <div class=\"mat-mdc-dialog-surface mdc-dialog__surface\">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n",
			styles: [".mat-mdc-dialog-container {\n  width: 100%;\n  height: 100%;\n  display: block;\n  box-sizing: border-box;\n  max-height: inherit;\n  min-height: inherit;\n  min-width: inherit;\n  max-width: inherit;\n  outline: 0;\n}\n\n.cdk-overlay-pane.mat-mdc-dialog-panel {\n  max-width: var(--mat-dialog-container-max-width, 560px);\n  min-width: var(--mat-dialog-container-min-width, 280px);\n}\n@media (max-width: 599px) {\n  .cdk-overlay-pane.mat-mdc-dialog-panel {\n    max-width: var(--mat-dialog-container-small-max-width, calc(100vw - 32px));\n  }\n}\n\n.mat-mdc-dialog-inner-container {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-around;\n  box-sizing: border-box;\n  height: 100%;\n  opacity: 0;\n  transition: opacity linear var(--mat-dialog-transition-duration, 0ms);\n  max-height: inherit;\n  min-height: inherit;\n  min-width: inherit;\n  max-width: inherit;\n}\n.mdc-dialog--closing .mat-mdc-dialog-inner-container {\n  transition: opacity 75ms linear;\n  transform: none;\n}\n.mdc-dialog--open .mat-mdc-dialog-inner-container {\n  opacity: 1;\n}\n._mat-animation-noopable .mat-mdc-dialog-inner-container {\n  transition: none;\n}\n\n.mat-mdc-dialog-surface {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 0;\n  flex-shrink: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  position: relative;\n  overflow-y: auto;\n  outline: 0;\n  transform: scale(0.8);\n  transition: transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);\n  max-height: inherit;\n  min-height: inherit;\n  min-width: inherit;\n  max-width: inherit;\n  box-shadow: var(--mat-dialog-container-elevation-shadow, none);\n  border-radius: var(--mat-dialog-container-shape, var(--mat-sys-corner-extra-large, 4px));\n  background-color: var(--mat-dialog-container-color, var(--mat-sys-surface, white));\n}\n[dir=rtl] .mat-mdc-dialog-surface {\n  text-align: right;\n}\n.mdc-dialog--open .mat-mdc-dialog-surface, .mdc-dialog--closing .mat-mdc-dialog-surface {\n  transform: none;\n}\n._mat-animation-noopable .mat-mdc-dialog-surface {\n  transition: none;\n}\n.mat-mdc-dialog-surface::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 2px solid transparent;\n  border-radius: inherit;\n  content: \"\";\n  pointer-events: none;\n}\n\n.mat-mdc-dialog-title {\n  display: block;\n  position: relative;\n  flex-shrink: 0;\n  box-sizing: border-box;\n  margin: 0 0 1px;\n  padding: var(--mat-dialog-headline-padding, 6px 24px 13px);\n}\n.mat-mdc-dialog-title::before {\n  display: inline-block;\n  width: 0;\n  height: 40px;\n  content: \"\";\n  vertical-align: 0;\n}\n[dir=rtl] .mat-mdc-dialog-title {\n  text-align: right;\n}\n.mat-mdc-dialog-container .mat-mdc-dialog-title {\n  color: var(--mat-dialog-subhead-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));\n  font-family: var(--mat-dialog-subhead-font, var(--mat-sys-headline-small-font, inherit));\n  line-height: var(--mat-dialog-subhead-line-height, var(--mat-sys-headline-small-line-height, 1.5rem));\n  font-size: var(--mat-dialog-subhead-size, var(--mat-sys-headline-small-size, 1rem));\n  font-weight: var(--mat-dialog-subhead-weight, var(--mat-sys-headline-small-weight, 400));\n  letter-spacing: var(--mat-dialog-subhead-tracking, var(--mat-sys-headline-small-tracking, 0.03125em));\n}\n\n.mat-mdc-dialog-content {\n  display: block;\n  flex-grow: 1;\n  box-sizing: border-box;\n  margin: 0;\n  overflow: auto;\n  max-height: 65vh;\n}\n.mat-mdc-dialog-content > :first-child {\n  margin-top: 0;\n}\n.mat-mdc-dialog-content > :last-child {\n  margin-bottom: 0;\n}\n.mat-mdc-dialog-container .mat-mdc-dialog-content {\n  color: var(--mat-dialog-supporting-text-color, var(--mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));\n  font-family: var(--mat-dialog-supporting-text-font, var(--mat-sys-body-medium-font, inherit));\n  line-height: var(--mat-dialog-supporting-text-line-height, var(--mat-sys-body-medium-line-height, 1.5rem));\n  font-size: var(--mat-dialog-supporting-text-size, var(--mat-sys-body-medium-size, 1rem));\n  font-weight: var(--mat-dialog-supporting-text-weight, var(--mat-sys-body-medium-weight, 400));\n  letter-spacing: var(--mat-dialog-supporting-text-tracking, var(--mat-sys-body-medium-tracking, 0.03125em));\n}\n.mat-mdc-dialog-container .mat-mdc-dialog-content {\n  padding: var(--mat-dialog-content-padding, 20px 24px);\n}\n.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content {\n  padding: var(--mat-dialog-with-actions-content-padding, 20px 24px 0);\n}\n.mat-mdc-dialog-container .mat-mdc-dialog-title + .mat-mdc-dialog-content {\n  padding-top: 0;\n}\n\n.mat-mdc-dialog-actions {\n  display: flex;\n  position: relative;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  box-sizing: border-box;\n  min-height: 52px;\n  margin: 0;\n  border-top: 1px solid transparent;\n  padding: var(--mat-dialog-actions-padding, 16px 24px);\n  justify-content: var(--mat-dialog-actions-alignment, flex-end);\n}\n@media (forced-colors: active) {\n  .mat-mdc-dialog-actions {\n    border-top-color: CanvasText;\n  }\n}\n.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start, .mat-mdc-dialog-actions[align=start] {\n  justify-content: start;\n}\n.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center, .mat-mdc-dialog-actions[align=center] {\n  justify-content: center;\n}\n.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end, .mat-mdc-dialog-actions[align=end] {\n  justify-content: flex-end;\n}\n.mat-mdc-dialog-actions .mat-button-base + .mat-button-base,\n.mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {\n  margin-left: 8px;\n}\n[dir=rtl] .mat-mdc-dialog-actions .mat-button-base + .mat-button-base,\n[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {\n  margin-left: 0;\n  margin-right: 8px;\n}\n\n.mat-mdc-dialog-component-host {\n  display: contents;\n}\n"]
		}]
	}], null, null);
})();
var TRANSITION_DURATION_PROPERTY = "--mat-dialog-transition-duration";
function parseCssTime(time) {
	if (time == null) return null;
	if (typeof time === "number") return time;
	if (time.endsWith("ms")) return coerceNumberProperty(time.substring(0, time.length - 2));
	if (time.endsWith("s")) return coerceNumberProperty(time.substring(0, time.length - 1)) * 1e3;
	if (time === "0") return 0;
	return null;
}
var MatDialogState;
(function(MatDialogState) {
	MatDialogState[MatDialogState["OPEN"] = 0] = "OPEN";
	MatDialogState[MatDialogState["CLOSING"] = 1] = "CLOSING";
	MatDialogState[MatDialogState["CLOSED"] = 2] = "CLOSED";
})(MatDialogState || (MatDialogState = {}));
var MatDialogRef = class {
	_ref;
	_config;
	_containerInstance;
	componentInstance;
	componentRef = null;
	disableClose;
	id;
	_afterOpened = new ReplaySubject(1);
	_beforeClosed = new ReplaySubject(1);
	_result;
	_closeFallbackTimeout;
	_state = MatDialogState.OPEN;
	_closeInteractionType;
	constructor(_ref, _config, _containerInstance) {
		this._ref = _ref;
		this._config = _config;
		this._containerInstance = _containerInstance;
		this.disableClose = _config.disableClose;
		this.id = _ref.id;
		_ref.addPanelClass("mat-mdc-dialog-panel");
		_containerInstance._animationStateChanged.pipe(filter((event) => event.state === "opened"), take(1)).subscribe(() => {
			this._afterOpened.next();
			this._afterOpened.complete();
		});
		_containerInstance._animationStateChanged.pipe(filter((event) => event.state === "closed"), take(1)).subscribe(() => {
			clearTimeout(this._closeFallbackTimeout);
			this._finishDialogClose();
		});
		_ref.overlayRef.detachments().subscribe(() => {
			this._beforeClosed.next(this._result);
			this._beforeClosed.complete();
			this._finishDialogClose();
		});
		merge(this.backdropClick(), this.keydownEvents().pipe(filter((event) => event.keyCode === 27 && !this.disableClose && !hasModifierKey(event)))).subscribe((event) => {
			if (!this.disableClose) {
				event.preventDefault();
				_closeDialogVia(this, event.type === "keydown" ? "keyboard" : "mouse");
			}
		});
	}
	close(dialogResult) {
		const closePredicate = this._config.closePredicate;
		if (closePredicate && !closePredicate(dialogResult, this._config, this.componentInstance)) return;
		this._result = dialogResult;
		this._containerInstance._animationStateChanged.pipe(filter((event) => event.state === "closing"), take(1)).subscribe((event) => {
			this._beforeClosed.next(dialogResult);
			this._beforeClosed.complete();
			this._ref.overlayRef.detachBackdrop();
			this._closeFallbackTimeout = setTimeout(() => this._finishDialogClose(), event.totalTime + 100);
		});
		this._state = MatDialogState.CLOSING;
		this._containerInstance._startExitAnimation();
	}
	afterOpened() {
		return this._afterOpened;
	}
	afterClosed() {
		return this._ref.closed;
	}
	beforeClosed() {
		return this._beforeClosed;
	}
	backdropClick() {
		return this._ref.backdropClick;
	}
	keydownEvents() {
		return this._ref.keydownEvents;
	}
	updatePosition(position) {
		let strategy = this._ref.config.positionStrategy;
		if (position && (position.left || position.right)) position.left ? strategy.left(position.left) : strategy.right(position.right);
		else strategy.centerHorizontally();
		if (position && (position.top || position.bottom)) position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
		else strategy.centerVertically();
		this._ref.updatePosition();
		return this;
	}
	updateSize(width = "", height = "") {
		this._ref.updateSize(width, height);
		return this;
	}
	addPanelClass(classes) {
		this._ref.addPanelClass(classes);
		return this;
	}
	removePanelClass(classes) {
		this._ref.removePanelClass(classes);
		return this;
	}
	getState() {
		return this._state;
	}
	_finishDialogClose() {
		this._state = MatDialogState.CLOSED;
		this._ref.close(this._result, { focusOrigin: this._closeInteractionType });
		this.componentInstance = null;
	}
};
function _closeDialogVia(ref, interactionType, result) {
	ref._closeInteractionType = interactionType;
	return ref.close(result);
}
var MAT_DIALOG_DATA = new InjectionToken("MatMdcDialogData");
var MAT_DIALOG_DEFAULT_OPTIONS = new InjectionToken("mat-mdc-dialog-default-options");
var MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken("mat-mdc-dialog-scroll-strategy", {
	providedIn: "root",
	factory: () => {
		const injector = inject(Injector);
		return () => createBlockScrollStrategy(injector);
	}
});
var MatDialog = class MatDialog {
	_defaultOptions = inject(MAT_DIALOG_DEFAULT_OPTIONS, { optional: true });
	_scrollStrategy = inject(MAT_DIALOG_SCROLL_STRATEGY);
	_parentDialog = inject(MatDialog, {
		optional: true,
		skipSelf: true
	});
	_idGenerator = inject(_IdGenerator);
	_injector = inject(Injector);
	_dialog = inject(Dialog);
	_animationsDisabled = _animationsDisabled();
	_openDialogsAtThisLevel = [];
	_afterAllClosedAtThisLevel = new Subject();
	_afterOpenedAtThisLevel = new Subject();
	dialogConfigClass = MatDialogConfig;
	_dialogRefConstructor;
	_dialogContainerType;
	_dialogDataToken;
	get openDialogs() {
		return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
	}
	get afterOpened() {
		return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
	}
	_getAfterAllClosed() {
		const parent = this._parentDialog;
		return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
	}
	afterAllClosed = defer(() => this.openDialogs.length ? this._getAfterAllClosed() : this._getAfterAllClosed().pipe(startWith(void 0)));
	constructor() {
		this._dialogRefConstructor = MatDialogRef;
		this._dialogContainerType = MatDialogContainer;
		this._dialogDataToken = MAT_DIALOG_DATA;
	}
	open(componentOrTemplateRef, config) {
		let dialogRef;
		config = {
			...this._defaultOptions || new MatDialogConfig(),
			...config
		};
		config.id = config.id || this._idGenerator.getId("mat-mdc-dialog-");
		config.scrollStrategy = config.scrollStrategy || this._scrollStrategy();
		const cdkRef = this._dialog.open(componentOrTemplateRef, {
			...config,
			positionStrategy: createGlobalPositionStrategy(this._injector).centerHorizontally().centerVertically(),
			disableClose: true,
			closePredicate: void 0,
			closeOnDestroy: false,
			closeOnOverlayDetachments: false,
			disableAnimations: this._animationsDisabled || config.enterAnimationDuration?.toLocaleString() === "0" || config.exitAnimationDuration?.toString() === "0",
			container: {
				type: this._dialogContainerType,
				providers: () => [{
					provide: this.dialogConfigClass,
					useValue: config
				}, {
					provide: DialogConfig,
					useValue: config
				}]
			},
			templateContext: () => ({ dialogRef }),
			providers: (ref, cdkConfig, dialogContainer) => {
				dialogRef = new this._dialogRefConstructor(ref, config, dialogContainer);
				dialogRef.updatePosition(config?.position);
				return [
					{
						provide: this._dialogContainerType,
						useValue: dialogContainer
					},
					{
						provide: this._dialogDataToken,
						useValue: cdkConfig.data
					},
					{
						provide: this._dialogRefConstructor,
						useValue: dialogRef
					},
					{
						provide: DialogRef,
						useValue: null
					}
				];
			}
		});
		dialogRef.componentRef = cdkRef.componentRef;
		dialogRef.componentInstance = cdkRef.componentInstance;
		this.openDialogs.push(dialogRef);
		this.afterOpened.next(dialogRef);
		dialogRef.afterClosed().subscribe(() => {
			const index = this.openDialogs.indexOf(dialogRef);
			if (index > -1) {
				this.openDialogs.splice(index, 1);
				if (!this.openDialogs.length) this._getAfterAllClosed().next();
			}
		});
		return dialogRef;
	}
	closeAll() {
		this._closeDialogs(this.openDialogs);
	}
	getDialogById(id) {
		return this.openDialogs.find((dialog) => dialog.id === id);
	}
	ngOnDestroy() {
		this._closeDialogs(this._openDialogsAtThisLevel);
		this._afterAllClosedAtThisLevel.complete();
		this._afterOpenedAtThisLevel.complete();
	}
	_closeDialogs(dialogs) {
		let i = dialogs.length;
		while (i--) dialogs[i].close();
	}
	static ɵfac = function MatDialog_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatDialog)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: MatDialog,
		factory: MatDialog.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDialog, [{ type: Service }], () => [], null);
})();
var MatDialogClose = class MatDialogClose {
	dialogRef = inject(MatDialogRef, { optional: true });
	_elementRef = inject(ElementRef);
	_dialog = inject(MatDialog);
	ariaLabel;
	type = "button";
	dialogResult;
	_matDialogClose;
	ngOnInit() {
		if (!this.dialogRef) this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
	}
	ngOnChanges(changes) {
		const proxiedChange = changes["_matDialogClose"];
		if (proxiedChange) this.dialogResult = proxiedChange.currentValue;
	}
	_onButtonClick(event) {
		if (this._elementRef.nativeElement.getAttribute("aria-disabled") === "true") return;
		_closeDialogVia(this.dialogRef, event.screenX === 0 && event.screenY === 0 ? "keyboard" : "mouse", this.dialogResult);
	}
	static ɵfac = function MatDialogClose_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatDialogClose)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: MatDialogClose,
		selectors: [[
			"",
			"mat-dialog-close",
			""
		], [
			"",
			"matDialogClose",
			""
		]],
		hostVars: 2,
		hostBindings: function MatDialogClose_HostBindings(rf, ctx) {
			if (rf & 1) ɵɵlistener("click", function MatDialogClose_click_HostBindingHandler($event) {
				return ctx._onButtonClick($event);
			});
			if (rf & 2) ɵɵattribute("aria-label", ctx.ariaLabel || null)("type", ctx.type);
		},
		inputs: {
			ariaLabel: [
				0,
				"aria-label",
				"ariaLabel"
			],
			type: "type",
			dialogResult: [
				0,
				"mat-dialog-close",
				"dialogResult"
			],
			_matDialogClose: [
				0,
				"matDialogClose",
				"_matDialogClose"
			]
		},
		exportAs: ["matDialogClose"],
		features: [ɵɵNgOnChangesFeature]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDialogClose, [{
		type: Directive,
		args: [{
			selector: "[mat-dialog-close], [matDialogClose]",
			exportAs: "matDialogClose",
			host: {
				"(click)": "_onButtonClick($event)",
				"[attr.aria-label]": "ariaLabel || null",
				"[attr.type]": "type"
			}
		}]
	}], null, {
		ariaLabel: [{
			type: Input,
			args: ["aria-label"]
		}],
		type: [{ type: Input }],
		dialogResult: [{
			type: Input,
			args: ["mat-dialog-close"]
		}],
		_matDialogClose: [{
			type: Input,
			args: ["matDialogClose"]
		}]
	});
})();
var MatDialogLayoutSection = class MatDialogLayoutSection {
	_dialogRef = inject(MatDialogRef, { optional: true });
	_elementRef = inject(ElementRef);
	_dialog = inject(MatDialog);
	ngOnInit() {
		if (!this._dialogRef) this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
		if (this._dialogRef) Promise.resolve().then(() => {
			this._onAdd();
		});
	}
	ngOnDestroy() {
		if (this._dialogRef?._containerInstance) Promise.resolve().then(() => {
			this._onRemove();
		});
	}
	static ɵfac = function MatDialogLayoutSection_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatDialogLayoutSection)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({ type: MatDialogLayoutSection });
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDialogLayoutSection, [{ type: Directive }], null, null);
})();
var MatDialogTitle = class MatDialogTitle extends MatDialogLayoutSection {
	id = inject(_IdGenerator).getId("mat-mdc-dialog-title-");
	_onAdd() {
		this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id);
	}
	_onRemove() {
		this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id);
	}
	static ɵfac = /* @__PURE__ */ (() => {
		let ɵMatDialogTitle_BaseFactory;
		return function MatDialogTitle_Factory(__ngFactoryType__) {
			return (ɵMatDialogTitle_BaseFactory || (ɵMatDialogTitle_BaseFactory = ɵɵgetInheritedFactory(MatDialogTitle)))(__ngFactoryType__ || MatDialogTitle);
		};
	})();
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: MatDialogTitle,
		selectors: [[
			"",
			"mat-dialog-title",
			""
		], [
			"",
			"matDialogTitle",
			""
		]],
		hostAttrs: [
			1,
			"mat-mdc-dialog-title",
			"mdc-dialog__title"
		],
		hostVars: 1,
		hostBindings: function MatDialogTitle_HostBindings(rf, ctx) {
			if (rf & 2) ɵɵdomProperty("id", ctx.id);
		},
		inputs: { id: "id" },
		exportAs: ["matDialogTitle"],
		features: [ɵɵInheritDefinitionFeature]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDialogTitle, [{
		type: Directive,
		args: [{
			selector: "[mat-dialog-title], [matDialogTitle]",
			exportAs: "matDialogTitle",
			host: {
				"class": "mat-mdc-dialog-title mdc-dialog__title",
				"[id]": "id"
			}
		}]
	}], null, { id: [{ type: Input }] });
})();
var MatDialogContent = class MatDialogContent {
	static ɵfac = function MatDialogContent_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatDialogContent)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: MatDialogContent,
		selectors: [
			[
				"",
				"mat-dialog-content",
				""
			],
			["mat-dialog-content"],
			[
				"",
				"matDialogContent",
				""
			]
		],
		hostAttrs: [
			1,
			"mat-mdc-dialog-content",
			"mdc-dialog__content"
		],
		features: [ɵɵHostDirectivesFeature([CdkScrollable])]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDialogContent, [{
		type: Directive,
		args: [{
			selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
			host: { "class": "mat-mdc-dialog-content mdc-dialog__content" },
			hostDirectives: [CdkScrollable]
		}]
	}], null, null);
})();
var MatDialogActions = class MatDialogActions extends MatDialogLayoutSection {
	align;
	_onAdd() {
		this._dialogRef._containerInstance?._updateActionSectionCount?.(1);
	}
	_onRemove() {
		this._dialogRef._containerInstance?._updateActionSectionCount?.(-1);
	}
	static ɵfac = /* @__PURE__ */ (() => {
		let ɵMatDialogActions_BaseFactory;
		return function MatDialogActions_Factory(__ngFactoryType__) {
			return (ɵMatDialogActions_BaseFactory || (ɵMatDialogActions_BaseFactory = ɵɵgetInheritedFactory(MatDialogActions)))(__ngFactoryType__ || MatDialogActions);
		};
	})();
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: MatDialogActions,
		selectors: [
			[
				"",
				"mat-dialog-actions",
				""
			],
			["mat-dialog-actions"],
			[
				"",
				"matDialogActions",
				""
			]
		],
		hostAttrs: [
			1,
			"mat-mdc-dialog-actions",
			"mdc-dialog__actions"
		],
		hostVars: 6,
		hostBindings: function MatDialogActions_HostBindings(rf, ctx) {
			if (rf & 2) ɵɵclassProp("mat-mdc-dialog-actions-align-start", ctx.align === "start")("mat-mdc-dialog-actions-align-center", ctx.align === "center")("mat-mdc-dialog-actions-align-end", ctx.align === "end");
		},
		inputs: { align: "align" },
		features: [ɵɵInheritDefinitionFeature]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDialogActions, [{
		type: Directive,
		args: [{
			selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
			host: {
				"class": "mat-mdc-dialog-actions mdc-dialog__actions",
				"[class.mat-mdc-dialog-actions-align-start]": "align === \"start\"",
				"[class.mat-mdc-dialog-actions-align-center]": "align === \"center\"",
				"[class.mat-mdc-dialog-actions-align-end]": "align === \"end\""
			}
		}]
	}], null, { align: [{ type: Input }] });
})();
function getClosestDialog(element, openDialogs) {
	let parent = element.nativeElement.parentElement;
	while (parent && !parent.classList.contains("mat-mdc-dialog-container")) parent = parent.parentElement;
	return parent ? openDialogs.find((dialog) => dialog.id === parent.id) : null;
}
var DIRECTIVES = [
	MatDialogContainer,
	MatDialogClose,
	MatDialogTitle,
	MatDialogActions,
	MatDialogContent
];
var MatDialogModule = class MatDialogModule {
	static ɵfac = function MatDialogModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatDialogModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: MatDialogModule,
		imports: [
			DialogModule,
			OverlayModule,
			PortalModule,
			MatDialogContainer,
			MatDialogClose,
			MatDialogTitle,
			MatDialogActions,
			MatDialogContent
		],
		exports: [
			BidiModule,
			MatDialogContainer,
			MatDialogClose,
			MatDialogTitle,
			MatDialogActions,
			MatDialogContent
		]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({
		providers: [MatDialog],
		imports: [
			DialogModule,
			OverlayModule,
			PortalModule,
			BidiModule
		]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDialogModule, [{
		type: NgModule,
		args: [{
			imports: [
				DialogModule,
				OverlayModule,
				PortalModule,
				...DIRECTIVES
			],
			exports: [BidiModule, ...DIRECTIVES],
			providers: [MatDialog]
		}]
	}], null, null);
})();
//#endregion
export { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContainer, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogState, MatDialogTitle, _closeDialogVia };
