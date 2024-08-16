/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./AnimationMode","./Component","./Configuration","./ControlBehavior","./Element","./ElementRegistry","./Lib","./Rendering","./RenderManager","./UIArea","./Messaging","./StaticArea","./Supportability","./Theming","sap/base/assert","sap/base/config","sap/base/Event","sap/base/Log","sap/base/i18n/Formatting","sap/base/util/Deferred","sap/base/util/isEmptyObject","sap/base/util/ObjectPath","sap/base/util/Version","sap/ui/Device","sap/ui/VersionInfo","sap/ui/base/EventProvider","sap/ui/base/Interface","sap/ui/base/ManagedObject","sap/ui/base/Object","sap/ui/base/syncXHRFix","sap/ui/core/support/Hotkeys","sap/ui/core/util/_LocalizationHelper","sap/ui/dom/getComputedStyleFix","sap/ui/performance/Measurement","sap/ui/performance/trace/initTraces","sap/ui/security/FrameOptions","sap/ui/security/Security","sap/ui/test/RecorderHotkeyListener","sap/ui/thirdparty/jquery","jquery.sap.global","sap/ui/events/PasteEventFix","sap/ui/events/jquery/EventSimulation","sap/ui/thirdparty/URI","sap/ui/thirdparty/jqueryui/jquery-ui-position"],function(e,t,n,i,o,r,a,s,u,p,c,l,d,f,h,g,y,m,b,v,E,C,T,S,M,L,I,_,R,A,P,w,j,V,U,B,O,k,jQuery){"use strict";var x;if(S.browser.firefox){j();A()}if(g.get({name:"sapUiNoConflict",type:g.Type.Boolean,freeze:true})){jQuery.noConflict()}const z=g.get({name:"sapUiLogLevel",type:g.Type.String,defaultValue:undefined,external:true});if(z){m.setLevel(m.Level[z.toUpperCase()]||parseInt(z))}else if(!globalThis["sap-ui-optimized"]){m.setLevel(m.Level.DEBUG)}const N=T(jQuery.fn.jquery);if(N.compareTo("3.6.0")!=0){m.warning("SAPUI5's default jQuery version is 3.6.0; current version is "+jQuery.fn.jquery+". Please note that we only support version 3.6.0.")}sap.ui.loader._.logger=m.getLogger("sap.ui.ModuleSystem",g.get({name:"sapUiXxDebugModuleLoading",type:g.Type.Boolean,external:true,freeze:true})?m.Level.DEBUG:Math.min(m.getLevel(),m.Level.INFO));P.init();k.init();if(sap.ui.getCore&&sap.ui.getCore()){return sap.ui.getCore()}U();var q;var F=function(){var e=g.get({name:"sapUiOnInit",type:e=>{if(typeof e==="string"||typeof e==="function"){return e}else{throw new TypeError("unsupported value")}}});if(e){if(typeof e==="string"){var t=/^module\:((?:[_$.\-a-zA-Z0-9]+\/)*[_$.\-a-zA-Z0-9]+)$/.exec(e);if(t&&t[1]){setTimeout(sap.ui.require.bind(null,[t[1]]),0)}else if(typeof globalThis[e]==="function"){globalThis[e]()}else{throw Error("Invalid init module "+e+" provided via config option 'sapUiOnInit'")}}else{e()}}};function D(){var e=g.get({name:"sapUiOnInit",type:g.Type.Code,defaultValue:g.get({name:"sapUiEvtOninit",type:g.Type.Code})});if(e){if(typeof e==="function"){e()}else if(typeof e==="string"){var t=/^module\:((?:[_$.\-a-zA-Z0-9]+\/)*[_$.\-a-zA-Z0-9]+)$/.exec(e);if(t&&t[1]){setTimeout(sap.ui.require.bind(sap.ui,[t[1]]),0)}else{var n=C.get(e);if(typeof n==="function"){n()}else{m.warning("[Deprecated] Do not use inline JavaScript code with the oninit attribute."+" Use the module:... syntax or the name of a global function");window.eval(e)}}}}}function H(){var e=g.get({name:"sapUiXxWaitForTheme",type:g.Type.String,external:true}).toLowerCase();if(e==="true"){e="rendering"}if(e!=="rendering"&&e!=="init"){e=undefined}return e}function X(e){if(/^jquery\.sap\./.test(e)){return e}return e.replace(/\./g,"/")}var $=function(e,t){var n=[],i=0,o=0;this.startTask=function(e){var t=n.length;n[t]={name:e,finished:false};i++;return t};this.finishTask=function(t,a){if(!n[t]||n[t].finished){throw new Error("trying to finish non existing or already finished task")}n[t].finished=true;i--;if(a===false){o++}if(i===0){m.info("Sync point '"+e+"' finished (tasks:"+n.length+", open:"+i+", failures:"+o+")");r()}};function r(){if(t){t(i,o)}t=null}m.info("Sync point '"+e+"' created")};var G=R.extend("sap.ui.core.Core",{constructor:function(){R.call(this);var e=this,t="sap.ui.core.Core";if(x){m.error("Only the framework must create an instance of sap/ui/core/Core."+" To get access to its functionality, require sap/ui/core/Core,"+" and use the module export directly without using 'new'.");return x}q=new L;["attachEvent","detachEvent","getEventingParent"].forEach(function(e){G.prototype[e]=q[e].bind(q)});this.bBooted=false;this.bInitialized=false;this.bReady=false;this.aPlugins=[];this.oModels={};this.oEventBus=null;Object.defineProperty(this,"mElements",{get:function(){m.error("oCore.mElements was a private member and has been removed. Use one of the methods in sap.ui.core.ElementRegistry instead");return r.all()},configurable:false});this.mObjects={template:{}};this.oRootComponent=null;this.pReady=new v;this.bInitLegacyLib=false;m.info("Creating Core",null,t);V.start("coreComplete","Core.js - complete");V.start("coreBoot","Core.js - boot");V.start("coreInit","Core.js - init");var i=sap.ui.require("sap/base/config/GlobalConfigurationProvider");i.freeze();(()=>{const e=globalThis["sap-ui-config"];for(const t in e){const n=e[t];const i=t.toLowerCase();if(!Object.hasOwn(e,i)){e[i]=n;delete e[t]}}})();const o={};const s=g.get({name:"sapUiResourceRoots",type:g.Type.MergedObject})??{};for(const e in s){o[X(e)]=s[e]||"."}sap.ui.loader.config({paths:o});n.setCore(this);(function(){var e=g.get({name:"sapUiXxHandleValidation",type:g.Type.Boolean,external:true});if(e){c.registerObject(this,true)}}).bind(this)();var u=g.get({name:"sapUiFrameOptionsConfig",type:g.Type.Object});u.mode=O.getFrameOptions();u.allowlistService=O.getAllowlistService();this.oFrameOptions=new B(u);this.aModules=g.get({name:"sapUiModules",type:g.Type.StringArray})??[];this.aLibs=g.get({name:"sapUiLibs",type:g.Type.StringArray})??[];this.aModules=this.aModules.filter(e=>{const t=e.match(/^(.*)\.library$/);if(t){this.aLibs.push(t[1])}else{return e}});(()=>{const e="/sap/bc/lrep";const t=g.get({name:"sapUiFlexibilityServices",type:e=>e,external:true,defaultValue:e});const n=g.get({name:"sapUiXxSkipAutomaticFlLibLoading",type:g.Type.Boolean,external:true});if(t&&t!==e&&!n&&!this.aLibs.includes("sap.ui.fl")){this.aLibs.push("sap.ui.fl")}})();if(d.isDebugModeEnabled()){this.aModules.unshift("sap.ui.debug.DebugEnv")}var p=this.aLibs.indexOf("sap.ui.core");if(p!=0){if(p>0){this.aLibs.splice(p,1)}this.aLibs.unshift("sap.ui.core")}if(g.get({name:"sapUiXxLesssupport",type:g.Type.Boolean})&&!this.aModules.includes("sap.ui.core.plugin.LessSupport")){m.info("Including LessSupport into declared modules");this.aModules.push("sap.ui.core.plugin.LessSupport")}var l=a.getPreloadMode();var h=l==="async"||sap.ui.loader.config().async;document.documentElement.classList.add("sapUiTheme-"+f.getTheme());m.info("Declared theme "+f.getTheme(),null,t);m.info("Declared modules: "+this.aModules,t);m.info("Declared libraries: "+this.aLibs,t);w.init();w.registerForUpdate("Core",()=>({Core:this}));this._setupBrowser();this._setupOS();this._setupAnimation();sap.ui.getCore=function(){return e.getInterface()};var y=new $("UI5 Document Ready",function(t,n){e.init()});var b=y.startTask("document.ready");var E=y.startTask("preload and boot");var C=function(){m.trace("document is ready");y.finishTask(b);document.removeEventListener("DOMContentLoaded",C)};if(document.readyState!=="loading"){C()}else{document.addEventListener("DOMContentLoaded",C)}var T=new $("UI5 Core Preloads and Bootstrap Script",function(t,n){m.trace("Core loaded: open="+t+", failures="+n);e._boot(h,function(){y.finishTask(E);V.end("coreBoot")})});var S=T.startTask("create sp2 tasks task");if(a.getVersionedLibCss()){var I=T.startTask("load version info");var _=function(e){if(e){m.trace('Loaded "sap-ui-version.json".')}else{m.error('Could not load "sap-ui-version.json".')}T.finishTask(I)};if(h){M.load().then(_,function(e){m.error('Unexpected error when loading "sap-ui-version.json": '+e);T.finishTask(I)})}else{_(sap.ui.getVersionInfo({async:h,failOnError:false}))}}this._polyfillFlexbox();var A=T.startTask("bootstrap script");this.boot=function(){if(this.bBooted){return}this.bBooted=true;P.call(this);T.finishTask(A)};function P(){var t=g.get({name:"sapUiXxBootTask",type:g.Type.Function});if(t){var n=T.startTask("custom boot task");t(function(e){T.finishTask(n,typeof e==="undefined"||e===true)})}if(l==="sync"||l==="async"){var i=a._load(e.aLibs,{sync:!h,preloadOnly:true});if(h){var o=T.startTask("preload bootstrap libraries");i.then(function(){T.finishTask(o)},function(){T.finishTask(o,false)})}}var r=g.get({name:"sapUiAppCacheBuster",type:g.Type.StringArray,external:true,freeze:true});if(r&&r.length>0){if(h){var s=T.startTask("require AppCachebuster");sap.ui.require(["sap/ui/core/AppCacheBuster"],function(e){e.boot(T,r);T.finishTask(s)})}if(!h){var u=sap.ui.requireSync("sap/ui/core/AppCacheBuster");u.boot(T,r)}}if(d.getSupportSettings()!==null){var p=T.startTask("support info script");var c=function(e,t){e.initializeSupportMode(d.getSupportSettings(),h);t.initSupportRules(d.getSupportSettings());T.finishTask(p)};if(h){sap.ui.require(["sap/ui/core/support/Support","sap/ui/support/Bootstrap"],c,function(e){m.error("Could not load support mode modules:",e)})}if(!h){m.warning("Synchronous loading of Support mode. Set preload configuration to 'async' or switch to asynchronous bootstrap to prevent these synchronous request.","SyncXHR",null,function(){return{type:"SyncXHR",name:"support-mode"}});c(sap.ui.requireSync("sap/ui/core/support/Support"),sap.ui.requireSync("sap/ui/support/Bootstrap"))}}if(d.getTestRecorderSettings()!==null){var f=T.startTask("test recorder script");var y=function(e){e.init(d.getTestRecorderSettings());T.finishTask(f)};if(h){sap.ui.require(["sap/ui/testrecorder/Bootstrap"],y,function(e){m.error("Could not load test recorder:",e)})}if(!h){m.warning("Synchronous loading of Test recorder mode. Set preload configuration to 'async' or switch to asynchronous bootstrap to prevent these synchronous request.","SyncXHR",null,function(){return{type:"SyncXHR",name:"test-recorder-mode"}});y(sap.ui.requireSync("sap/ui/testrecorder/Bootstrap"))}}T.finishTask(S)}},metadata:{publicMethods:["ready","boot","getConfiguration","isMobile","isInitialized","attachInit","lock","unlock","isLocked","attachInitEvent","registerPlugin","unregisterPlugin","setRoot","getRootComponent","getApplication","getControl","getComponent","getTemplate","createComponent","getCurrentFocusedControlId","getEventBus","byId","attachIntervalTimer","detachIntervalTimer","getElementById","byFieldGroupId","getLoadedLibraries","loadLibrary","initLibrary","getLibraryResourceBundle","attachLibraryChanged","detachLibraryChanged","loadLibraries","setModel","getModel","hasModel","getMessageManager","attachEvent","detachEvent","attachControlEvent","detachControlEvent","attachParseError","detachParseError","attachValidationError","detachValidationError","attachFormatError","detachFormatError","attachValidationSuccess","detachValidationSuccess","attachLocalizationChanged","detachLocalizationChanged","fireFormatError","fireValidationSuccess","fireValidationError","fireParseError","getStaticAreaRef","isStaticAreaRef","createRenderManager","createUIArea","getUIArea","getUIDirty","applyChanges","getRenderManager","addPrerenderingTask","applyTheme","setThemeRoot","attachThemeChanged","detachThemeChanged","isThemeApplied","notifyContentDensityChanged","attachThemeScopingChanged","detachThemeScopingChanged","fireThemeScopingChanged","includeLibraryTheme"]}});G.M_EVENTS={ControlEvent:"ControlEvent",UIUpdated:"UIUpdated",ThemeChanged:"ThemeChanged",ThemeScopingChanged:"themeScopingChanged",LocalizationChanged:"localizationChanged",LibraryChanged:"libraryChanged",ValidationError:"validationError",ParseError:"parseError",FormatError:"formatError",ValidationSuccess:"validationSuccess"};G.prototype._setupBrowser=function(){var e="sap.ui.core.Core";var t=document.documentElement;var n=S.browser;var i=n.name;if(i){if(i===n.BROWSER.SAFARI&&n.mobile){i="m"+i}i=i+(n.version===-1?"":Math.floor(n.version));t.dataset.sapUiBrowser=i;m.debug("Browser-Id: "+i,null,e)}};G.prototype._setupOS=function(){var e=document.documentElement;e.dataset.sapUiOs=S.os.name+S.os.versionStr;var t=null;switch(S.os.name){case S.os.OS.IOS:t="sap-ios";break;case S.os.OS.ANDROID:t="sap-android";break}if(t){e.classList.add(t)}};G.prototype._setupAnimation=function(){function t(){var t=document.documentElement;var n=i.getAnimationMode();t.dataset.sapUiAnimationMode=n;var o=n!==e.minimal&&n!==e.none;t.dataset.sapUiAnimation=o?"on":"off";if(typeof jQuery!=="undefined"){jQuery.fx.off=!o}}i.attachChange(function(e){if(e.animationMode){t()}});t()};G.prototype._polyfillFlexbox=function(){jQuery.support.useFlexBoxPolyfill=false};G.prototype._boot=function(e,t){this.aModules.push("sap/ui/core/date/"+b.getCalendarType());if(e){return this._requireModulesAsync().then(function(){t()})}m.warning("Modules and libraries declared via bootstrap-configuration are loaded synchronously. Set preload configuration to"+" 'async' or switch to asynchronous bootstrap to prevent these requests.","SyncXHR",null,function(){return{type:"SyncXHR",name:"legacy-module"}});this.aLibs.forEach(function(e){a._load(e,{sync:true})});this.aModules.forEach(function(e){sap.ui.requireSync(/^jquery\.sap\./.test(e)?e:e.replace(/\./g,"/"))});t()};G.prototype._requireModulesAsync=function(){var e=[];this.aModules.forEach(function(t){e.push(/^jquery\.sap\./.test(t)?t:t.replace(/\./g,"/"))});return Promise.all([a._load(this.aLibs),new Promise(function(t){sap.ui.require(e,function(){t(Array.prototype.slice.call(arguments))})})])};G.prototype.applyTheme=function(e,t){h(typeof e==="string","sThemeName must be a string");h(typeof t==="string"||typeof t==="undefined","sThemeBaseUrl must be a string or undefined");if(t){f.setThemeRoot(e,t)}f.setTheme(e)};G.prototype.setThemeRoot=function(e,t,n,i){if(typeof t==="string"){i=n;n=t;t=undefined}f.setThemeRoot(e,n,t,i);return this};G.prototype.init=function(){if(this.bInitialized){return}p.setCore(this);var e="sap.ui.core.Core.init()";m.info("Initializing",null,e);V.end("coreInit");this._setBodyAccessibilityRole();var t=H();if(this.isThemeApplied()||!t){this._executeInitialization()}else{s.suspend();if(t==="rendering"){s.notifyInteractionStep();this._executeInitialization();s.getLogger().debug("delay initial rendering until theme has been loaded");f.attachAppliedOnce(function(){s.resume("after theme has been loaded")})}else if(t==="init"){s.getLogger().debug("delay init event and initial rendering until theme has been loaded");s.notifyInteractionStep();f.attachAppliedOnce(function(){this._executeInitialization();s.resume("after theme has been loaded")}.bind(this))}}};G.prototype._setupRootComponent=function(){var e="sap.ui.core.Core.init()";var t=n.getRootComponent();if(t){m.info("Loading Root Component: "+t,null,e);var i=sap.ui.component({name:t});this.oRootComponent=i;var o=g.get({name:"sapUiXxRootComponentNode",type:g.Type.String});if(o&&i.isA("sap.ui.core.UIComponent")){var r=document.getElementById(o);if(r){m.info("Creating ComponentContainer for Root Component: "+t,null,e);var a=sap.ui.requireSync("sap/ui/core/ComponentContainer"),s=new a({component:i,propagateModel:true});s.placeAt(r)}}}else{var u=n.getApplication();if(u){m.warning("The configuration 'application' is deprecated. Please use the configuration 'component' instead! "+"Please migrate from sap.ui.app.Application to sap.ui.core.Component.","SyncXHR",null,function(){return{type:"Deprecation",name:"sap.ui.core"}});m.info("Loading Application: "+u,null,e);sap.ui.requireSync(u.replace(/\./g,"/"));var p=C.get(u);h(p!==undefined,'The specified application "'+u+'" could not be found!');var c=new p;h(R.isObjectA(c,"sap.ui.app.Application"),'The specified application "'+u+'" must be an instance of sap.ui.app.Application!')}}};G.prototype._setBodyAccessibilityRole=function(){var e=document.body;if(i.isAccessibilityEnabled()&&n.getAutoAriaBodyRole()&&!e.getAttribute("role")){e.setAttribute("role","application")}};G.prototype._executeInitialization=function(){var e="sap.ui.core.Core.init()";if(this.bInitialized){return}this.bInitialized=true;m.info("Initialized",null,e);m.info("Starting Plugins",null,e);this.startPlugins();m.info("Plugins started",null,e);F=D;F();this._setupRootComponent();this.pReady.resolve();this.bReady=true};G.prototype.isInitialized=function(){return this.bInitialized};G.prototype.isThemeApplied=function(){var e=false;function t(){e=true}f.attachAppliedOnce(t);return e};f.attachApplied(function(e){q&&q.fireEvent(G.M_EVENTS.ThemeChanged,y.getParameters(e))});G.prototype.attachInitEvent=function(e){h(typeof e==="function","fnFunction must be a function");if(!this.bReady){this.pReady.promise.then(e)}};G.prototype.attachInit=function(e){h(typeof e==="function","fnFunction must be a function");this.ready(e)};G.prototype.lock=function(){this.bLocked=true;p.registry.forEach(e=>{e.lock()})};G.prototype.unlock=function(){this.bLocked=false;p.registry.forEach(e=>{e.unlock()})};G.prototype.isLocked=function(){return this.bLocked};G.prototype.getConfiguration=function(){return n};G.prototype.getRenderManager=function(){return this.createRenderManager()};G.prototype.createRenderManager=function(){h(this.isInitialized(),"A RenderManager should be created only after the Core has been initialized");var e=new u;return e.getInterface()};G.prototype.getCurrentFocusedControlId=function(){if(!this.isInitialized()){throw new Error("Core must be initialized")}return o.getActiveElement()?.getId()||null};G.prototype.loadLibrary=function(e,t){var n={name:e};var i={sync:true};if(typeof t==="boolean"){i.sync=!t}else if(typeof t==="string"){n.url=t}else if(typeof t==="object"){i.sync=!t.async;n.url=t.url}var o=a._load(n,i);if(!i.sync){return o.then(function(e){return e[0]})}else{return o[0]}};G.prototype.loadLibraries=function(e,t){t=Object.assign({async:true},t);t.sync=!t.async;var n=a._load(e,t);if(!t.sync){return n}else{return undefined}};G.prototype.createComponent=function(e,n,i,o){if(typeof e==="string"){e={name:e,url:n};if(typeof i==="object"){e.settings=i}else{e.id=i;e.settings=o}}if(e.async&&(e.manifest!==undefined||e.manifestFirst===undefined&&e.manifestUrl===undefined)){if(e.manifest===undefined){e.manifest=false}return t.create(e)}return sap.ui.component(e)};G.prototype.getRootComponent=function(){return this.oRootComponent};G.prototype.initLibrary=function(e){h(typeof e==="string"||typeof e==="object","oLibInfo must be a string or object");var t=typeof e==="string";if(t){e={name:e}}var n=e.name,i="sap.ui.core.Core.initLibrary()";if(t){m.error("[Deprecated] library "+n+" uses old fashioned initLibrary() call (rebuild with newest generator)")}if(!n){m.error("A library name must be provided.",null,i);return}var o=a._get(n);if(o&&o.isSettingsEnhanced()){return C.get(n)}return a.init(e)};G.prototype.includeLibraryTheme=function(e,t,n){var i=a._get(e,true);i._includeTheme(t,n)};G.prototype.getLoadedLibraries=function(){return a.all()};G.prototype.getLibraryResourceBundle=function(e,t,n){if(typeof e==="boolean"){n=e;e=undefined;t=undefined}if(typeof t==="boolean"){n=t;t=undefined}h(e===undefined&&t===undefined||typeof e==="string","sLibraryName must be a string or there is no argument given at all");h(t===undefined||typeof t==="string","sLocale must be a string or omitted");e=e||"sap.ui.core";var i=a._get(e||"sap.ui.core",true);return i._loadResourceBundle(t,!n)};function Z(e,t){h(typeof e==="string"||typeof e==="object","oDomRef must be a string or object");h(t instanceof I||R.isObjectA(t,"sap.ui.core.Control"),"oControl must be a Control or Interface");if(t){t.placeAt(e,"only")}}G.prototype.setRoot=Z;G.prototype.createUIArea=function(e){if(typeof e==="string"&&e===l.STATIC_UIAREA_ID){return l.getUIArea()}return p.create(e)};G.prototype.getUIArea=function(e){h(typeof e==="string"||typeof e==="object","o must be a string or object");var t="";if(typeof e=="string"){t=e}else{t=e.id}if(t){return p.registry.get(t)}return null};G.prototype.getUIDirty=function(){return s.isPending()};G.prototype.notifyContentDensityChanged=f.notifyContentDensityChanged;G.prototype.attachThemeChanged=function(e,t){q.attachEvent(G.M_EVENTS.ThemeChanged,e,t)};G.prototype.detachThemeChanged=function(e,t){q.detachEvent(G.M_EVENTS.ThemeChanged,e,t)};G.prototype.attachThemeScopingChanged=function(e,t){q.attachEvent(G.M_EVENTS.ThemeScopingChanged,e,t)};G.prototype.detachThemeScopingChanged=function(e,t){q.detachEvent(G.M_EVENTS.ThemeScopingChanged,e,t)};f.attachThemeScopingChanged(function(e){q.fireEvent(G.M_EVENTS.ThemeScopingChanged,y.getParameters(e))});G.prototype.attachLocalizationChanged=function(e,t){q.attachEvent(G.M_EVENTS.LocalizationChanged,e,t)};G.prototype.detachLocalizationChanged=function(e,t){q.detachEvent(G.M_EVENTS.LocalizationChanged,e,t)};G.prototype.fireLocalizationChanged=function(e){q.fireEvent(G.M_EVENTS.LocalizationChanged,{changes:e})};G.prototype.attachLibraryChanged=function(e,t){q.attachEvent(G.M_EVENTS.LibraryChanged,e,t)};G.prototype.detachLibraryChanged=function(e,t){q.detachEvent(G.M_EVENTS.LibraryChanged,e,t)};a.attachLibraryChanged(function(e){q.fireEvent(G.M_EVENTS.LibraryChanged,e.getParameters())});G.prototype.applyChanges=function(){s.renderPendingUIUpdates("forced by applyChanges")};G.prototype.registerObject=function(e){var t=e.getId(),n=e.getMetadata().getStereotype(),i=this.getObject(n,t);if(i&&i!==e){m.error('adding object "'+n+"\" with duplicate id '"+t+"'");throw new Error('Error: adding object "'+n+"\" with duplicate id '"+t+"'")}this.mObjects[n][t]=e};G.prototype.deregisterObject=function(e){var t=e.getId(),n=e.getMetadata().getStereotype();delete this.mObjects[n][t]};G.prototype.byId=o.getElementById;G.prototype.getControl=o.getElementById;G.prototype.getElementById=o.getElementById;G.prototype.getObject=function(e,t){h(t==null||typeof t==="string","sId must be a string when defined");h(this.mObjects[e]!==undefined,"sType must be a supported stereotype");return t==null?undefined:this.mObjects[e]&&this.mObjects[e][t]};G.prototype.getComponent=t.registry.get;G.prototype.getTemplate=function(e){m.warning("Synchronous loading of 'sap/ui/core/tmpl/Template'. Use 'sap/ui/core/tmpl/Template' module and"+" call Template.byId instead","SyncXHR",null,function(){return{type:"SyncXHR",name:"Core.prototype.getTemplate"}});var t=sap.ui.requireSync("sap/ui/core/tmpl/Template");return t.byId(e)};G.prototype.getStaticAreaRef=function(){return l.getDomRef()};G.prototype.isStaticAreaRef=function(e){return l.getDomRef()===e};var W;G.prototype.attachIntervalTimer=function(e,t){m.warning("Usage of sap.ui.getCore().attachIntervalTimer() is deprecated. "+"Please use 'IntervalTrigger.addListener()' from 'sap/ui/core/IntervalTrigger' module instead.","Deprecation",null,function(){return{type:"sap.ui.core.Core",name:"Core"}});if(!W){W=sap.ui.require("sap/ui/core/IntervalTrigger")||sap.ui.requireSync("sap/ui/core/IntervalTrigger")}W.addListener(e,t)};G.prototype.detachIntervalTimer=function(e,t){if(W){W.removeListener(e,t)}};G.prototype.attachControlEvent=function(e,t){q.attachEvent(G.M_EVENTS.ControlEvent,e,t)};G.prototype.detachControlEvent=function(e,t){q.detachEvent(G.M_EVENTS.ControlEvent,e,t)};G.prototype.fireControlEvent=function(e){q.fireEvent(G.M_EVENTS.ControlEvent,e)};G.prototype._handleControlEvent=function(e,t){var n=jQuery.Event(e.type);Object.assign(n,e);n.originalEvent=undefined;this.fireControlEvent({browserEvent:n,uiArea:t})};G.prototype.getApplication=function(){return sap.ui.getApplication&&sap.ui.getApplication()};G.prototype.registerPlugin=function(e){h(typeof e==="object","oPlugin must be an object");if(!e){return}for(var t=0,n=this.aPlugins.length;t<n;t++){if(this.aPlugins[t]===e){return}}this.aPlugins.push(e);if(this.bInitialized&&e&&e.startPlugin){e.startPlugin(this)}};G.prototype.unregisterPlugin=function(e){h(typeof e==="object","oPlugin must be an object");if(!e){return}var t=-1;for(var n=this.aPlugins.length;n--;n>=0){if(this.aPlugins[n]===e){t=n;break}}if(t==-1){return}if(this.bInitialized&&e&&e.stopPlugin){e.stopPlugin(this)}this.aPlugins.splice(t,1)};G.prototype.startPlugins=function(){for(var e=0,t=this.aPlugins.length;e<t;e++){var n=this.aPlugins[e];if(n&&n.startPlugin){n.startPlugin(this,true)}}};G.prototype.stopPlugins=function(){for(var e=0,t=this.aPlugins.length;e<t;e++){var n=this.aPlugins[e];if(n&&n.stopPlugin){n.stopPlugin(this)}}};G.prototype.setModel=function(e,t){h(e==null||R.isObjectA(e,"sap.ui.model.Model"),"oModel must be an instance of sap.ui.model.Model, null or undefined");h(t===undefined||typeof t==="string"&&!/^(undefined|null)?$/.test(t),"sName must be a string or omitted");var n=this,i;if(!e&&this.oModels[t]){delete this.oModels[t];if(E(n.oModels)&&E(n.oBindingContexts)){i=_._oEmptyPropagatedProperties}else{i={oModels:Object.assign({},n.oModels),oBindingContexts:{},aPropagationListeners:[]}}p.registry.forEach(function(n){if(e!=n.getModel(t)){n._propagateProperties(t,n,i,false,t)}})}else if(e&&e!==this.oModels[t]){this.oModels[t]=e;p.registry.forEach(function(n){if(e!=n.getModel(t)){var i={oModels:Object.assign({},this.oModels),oBindingContexts:{},aPropagationListeners:[]};n._propagateProperties(t,n,i,false,t)}}.bind(this))}return this};G.prototype.getMessageManager=function(){return c};G.prototype.byFieldGroupId=function(e){return o.registry.filter(function(t){return t.isA("sap.ui.core.Control")&&t.checkFieldGroupIds(e)})};G.prototype.getModel=function(e){h(e===undefined||typeof e==="string"&&!/^(undefined|null)?$/.test(e),"sName must be a string or omitted");return this.oModels[e]};G.prototype.hasModel=function(){return!E(this.oModels)};G.prototype.getEventBus=function(){if(!this.oEventBus){var e=sap.ui.require("sap/ui/core/EventBus");if(!e){m.warning("Synchronous loading of EventBus. Ensure that 'sap/ui/core/EventBus' module is loaded"+" before this function is called.","SyncXHR",null,function(){return{type:"SyncXHR",name:"core-eventbus"}});e=sap.ui.requireSync("sap/ui/core/EventBus")}var t=this.oEventBus=e.getInstance();this._preserveHandler=function(e){t.publish("sap.ui","__preserveContent",{domNode:e.domNode})};u.attachPreserveContent(this._preserveHandler)}return this.oEventBus};G.prototype.attachValidationError=function(e,t,n){if(typeof e==="function"){n=t;t=e;e=undefined}q.attachEvent(G.M_EVENTS.ValidationError,e,t,n);return this};G.prototype.detachValidationError=function(e,t){q.detachEvent(G.M_EVENTS.ValidationError,e,t);return this};G.prototype.attachParseError=function(e,t,n){if(typeof e==="function"){n=t;t=e;e=undefined}q.attachEvent(G.M_EVENTS.ParseError,e,t,n);return this};G.prototype.detachParseError=function(e,t){q.detachEvent(G.M_EVENTS.ParseError,e,t);return this};G.prototype.attachFormatError=function(e,t,n){if(typeof e==="function"){n=t;t=e;e=undefined}q.attachEvent(G.M_EVENTS.FormatError,e,t,n);return this};G.prototype.detachFormatError=function(e,t){q.detachEvent(G.M_EVENTS.FormatError,e,t);return this};G.prototype.attachValidationSuccess=function(e,t,n){if(typeof e==="function"){n=t;t=e;e=undefined}q.attachEvent(G.M_EVENTS.ValidationSuccess,e,t,n);return this};G.prototype.detachValidationSuccess=function(e,t){q.detachEvent(G.M_EVENTS.ValidationSuccess,e,t);return this};G.prototype.fireParseError=function(e){q.fireEvent(G.M_EVENTS.ParseError,e);return this};G.prototype.fireValidationError=function(e){q.fireEvent(G.M_EVENTS.ValidationError,e);return this};G.prototype.fireFormatError=function(e){q.fireEvent(G.M_EVENTS.FormatError,e);return this};G.prototype.fireValidationSuccess=function(e){q.fireEvent(G.M_EVENTS.ValidationSuccess,e);return this};G.prototype.isMobile=function(){return S.browser.mobile};G.prototype._getEventProvider=function(){return q};G.prototype.addPrerenderingTask=function(e,t){s.addPrerenderingTask(e,t)};G.prototype.ready=function(e){if(e){if(this.bReady){e()}else{this.pReady.promise.then(e)}}return this.pReady.promise};G.prototype.destroy=function(){u.detachPreserveContent(this._preserveHandler);q.destroy();R.prototype.destroy.call(this)};sap.ui.setRoot=Z;x=(new G).getInterface();return x});
//# sourceMappingURL=Core.js.map