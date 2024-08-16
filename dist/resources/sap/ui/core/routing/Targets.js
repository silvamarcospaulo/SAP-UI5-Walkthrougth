/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/EventProvider","./Target","./async/Targets","./sync/Targets","sap/base/future","sap/base/Log","sap/base/util/deepExtend"],function(t,e,i,a,r,n,s){"use strict";var o=t.extend("sap.ui.core.routing.Targets",{constructor:function(e){t.apply(this);this._mTargets={};this._oLastTitleTarget={};this._oConfig=e.config;this._oCache=e.cache||e.views;if(!this._oConfig){this._oConfig={_async:false}}function r(){if(new URLSearchParams(window.location.search).get("sap-ui-xx-asyncRouting")==="true"){n.warning("Activation of async view loading in routing via url parameter is only temporarily supported and may be removed soon","Targets");return true}return false}if(this._oConfig._async===undefined){this._oConfig._async=this._oConfig.async===undefined?r():this._oConfig.async}var s=this._oConfig._async?i:a;for(var o in s){this[o]=s[o]}Object.keys(e.targets).forEach(function(t){this._createTarget(t,e.targets[t])}.bind(this));Object.keys(this._mTargets).forEach(function(t){this._addParentTo(this._mTargets[t])}.bind(this))},_setRouter:function(t){if(!this._oRouter){this._oRouter=t}else{n.warning("The Targets is already connected with a router and this call of _setRouter is ignored")}return this},destroy:function(){var e;t.prototype.destroy.apply(this);for(e in this._mTargets){if(this._mTargets.hasOwnProperty(e)){this._mTargets[e].destroy()}}this._mTargets=null;this._oCache=null;this._oConfig=null;this.bIsDestroyed=true;return this},getViews:function(){return this._oCache},getCache:function(){return this._oCache},getTarget:function(t,e){var i=this,a=this._alignTargetsInfo(t),r;r=a.reduce(function(t,a){var r=i._mTargets[a.name];if(r){t.push(r)}else if(!e){n.error('The target you tried to get "'+a.name+'" does not exist!',i)}return t},[]);return r.length<=1?r[0]:r},addTarget:function(t,e){var i=this.getTarget(t,true),a;if(i){r.errorThrows("Target with name "+t+" already exists",this)}else{a=this._createTarget(t,e);this._addParentTo(a)}return this},suspend:function(t){var e=this._alignTargetsInfo(t);e.forEach(function(t){var e=t.name;var i=this.getTarget(e);if(i){i.suspend()}}.bind(this));return this},resume:function(t){var e=this._alignTargetsInfo(t);e.forEach(function(t){var e=t.name;var i=this.getTarget(e);if(i){i.resume()}}.bind(this));return this},attachDisplay:function(t,e,i){return this.attachEvent(this.M_EVENTS.DISPLAY,t,e,i)},detachDisplay:function(t,e){return this.detachEvent(this.M_EVENTS.DISPLAY,t,e)},fireDisplay:function(t){return this.fireEvent(this.M_EVENTS.DISPLAY,t)},attachTitleChanged:function(t,e,i){this.attachEvent(this.M_EVENTS.TITLE_CHANGED,t,e,i);return this},detachTitleChanged:function(t,e){return this.detachEvent(this.M_EVENTS.TITLE_CHANGED,t,e)},fireTitleChanged:function(t){if(this._oLastTitleTarget.name!==t.name||this._oLastTitleTarget.title!==t.title){this._oLastTitleTarget.name=t.name;this._oLastTitleTarget.title=t.title;this.fireEvent(this.M_EVENTS.TITLE_CHANGED,t)}return this},M_EVENTS:{DISPLAY:"display",TITLE_CHANGED:"titleChanged"},_alignTargetsInfo:function(t){if(t===undefined){return[]}if(!Array.isArray(t)){return typeof t==="object"?[t]:[{name:t}]}return t.map(function(t){if(typeof t!=="object"){t={name:t}}return t})},_createTarget:function(t,e){var i,a,r={_name:t};if(this._vRootViewId){r.rootView=this._vRootViewId}a=s(r,this._oConfig,e);i=this._constructTarget(a);i.attachDisplay(function(e){var i=e.getParameters();this.fireDisplay({name:t,view:i.view,object:i.object,control:i.control,config:i.config,data:i.data,routeRelevant:i.routeRelevant})},this);this._mTargets[t]=i;return i},_addParentTo:function(t){var e,i=t._oOptions.parent;if(!i){return}e=this._mTargets[i];if(!e){r.errorThrows("The target '"+t._oOptions._name+"' has a parent '"+i+"' defined, but it was not found in the other targets",this);return}t._oParent=e},_constructTarget:function(t,i){return new e(t,this._oCache,i)},_setRootViewId:function(t){var e,i;for(e in this._mTargets){if(this._mTargets.hasOwnProperty(e)){i=this._mTargets[e]._oOptions;if(i.rootView===undefined){i.rootView=t}}}this._vRootViewId=t},_getTitleTargetName:function(t,e){var i,a;if(e){t=[e]}t=this._alignTargetsInfo(t);t.some(function(t){i=this.getTarget(t);while(i&&!i._oOptions.title){i=i._oParent}if(i){a=i._oOptions._name;return true}}.bind(this));return a},_forwardTitleChanged:function(t){this.fireTitleChanged({name:t.getParameter("name"),title:t.getParameter("title")})},_attachTitleChanged:function(t,e){var i,a;a=this._getTitleTargetName(t,e);if(a){i=this.getTarget(a)}if(this._oLastDisplayedTitleTarget){this._oLastDisplayedTitleTarget.detachTitleChanged(this._forwardTitleChanged,this);this._oLastDisplayedTitleTarget._bIsDisplayed=false}if(i){i.attachTitleChanged({name:i._oOptions._name},this._forwardTitleChanged,this);this._oLastDisplayedTitleTarget=i}else if(e){r.errorThrows('The target with the name "'+e+'" where the titleChanged event should be fired does not exist!',this)}}});return o});
//# sourceMappingURL=Targets.js.map