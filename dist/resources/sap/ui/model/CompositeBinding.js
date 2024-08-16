/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BindingMode","./ChangeReason","./CompositeDataState","./CompositeType","./Context","./PropertyBinding","sap/base/Log","sap/base/util/deepEqual","sap/ui/base/DataType","sap/ui/base/SyncPromise"],function(t,e,n,a,i,s,r,u,o,h){"use strict";var l=s.extend("sap.ui.model.CompositeBinding",{constructor:function(t,e,n){var a;s.apply(this,[null,""]);this.aBindings=t;this.aValues=null;this.bRawValues=e;this.bPreventUpdate=false;this.bInternalValues=n;this.bMultipleModels=this.aBindings.some(function(t){var e=t.getModel();a=a||e;return a&&e&&e!==a});this.aOriginalValues=undefined;this.fnChangeHandler=undefined;this.fnDataStateChangeHandler=undefined},metadata:{publicMethods:["getBindings","attachChange","detachChange"]}});l.prototype.destroy=function(){this.aBindings.forEach(function(t){t.destroy()});s.prototype.destroy.apply(this)};l.prototype.getPath=function(){return null};l.prototype.getModel=function(){return null};l.prototype.getContext=function(){return null};l.prototype.isResolved=function(){return this.aBindings.every(function(t){return t.isResolved()})};l.prototype.setType=function(t,e){const n=this;function i(){n.oType?.processPartTypes(n.aBindings.map(function(t){return t.getType()}))}if(t&&!(t instanceof a)){throw new Error("Only CompositeType can be used as type for composite bindings!")}s.prototype.setType.apply(this,arguments);if(this.oType){t.getPartsIgnoringMessages().forEach(function(t){var e=n.aBindings[t];if(e&&e.supportsIgnoreMessages()&&e.getIgnoreMessages()===undefined){e.setIgnoreMessages(true)}});this.bRawValues=this.oType.getUseRawValues();this.bInternalValues=this.oType.getUseInternalValues();i();t.getPartsListeningToTypeChanges().forEach(t=>{this.aBindings[t].registerTypeChanged(i)});if(this.bRawValues&&this.bInternalValues){throw new Error(this.oType+" has both 'bUseRawValues' & 'bUseInternalValues' set to true. Only one of them is allowed to be true")}}};l.prototype.setContext=function(t,e){var n,a,s=this.aBindings,r=t&&t.getModel(),u=e&&e.fnIsBindingRelevant?e.fnIsBindingRelevant:function(e){return!t||r&&r===s[e].getModel()};s.forEach(function(e,s){var r;if(u(s)){r=e.getContext();n=n||e.isRelative()&&i.hasChanged(r,t);a=a||n&&r!==t;e.setContext(t)}});if(n){this.checkUpdate(a&&this.getDataState().getControlMessages().length)}};l.prototype.setValue=function(e){if(this.bSuspended){return}this.aBindings.forEach(function(n,a){var i=e[a],s=n.getBindingMode();if(i!==undefined&&s!==t.OneWay&&s!==t.OneTime){n.setValue(i)}});this.getDataState().setValue(this.getValue())};l.prototype.getValue=function(){return this.aBindings.map(function(t){return t.getValue()})};l.prototype.getOriginalValue=function(){return this.aBindings.map(function(t){return t.getDataState().getOriginalValue()})};l.prototype.getExternalValue=function(){var t=[],e,n;switch(this.sInternalType){case"raw":return this.getRawValue();case"internal":return this.getInternalValue();default:e=this.sInternalType&&o.getType(this.sInternalType);t=this.getCurrentValues();if(this.fnFormatter){n=this.fnFormatter.apply(this,t)}else if(this.oType){n=this.oType.formatValue(t,this.sInternalType)}else if(e instanceof o&&e.isArrayType()){n=t}else if(t.length>1){n=t.join(" ")}else{n=t[0]}return n}};l.prototype.setExternalValue=function(e){var n,a,i,s,u=this;if(this.sInternalType==="raw"){this.setRawValue(e);return undefined}else if(this.sInternalType==="internal"){this.setInternalValue(e);return undefined}n=this.sInternalType&&o.getType(this.sInternalType);if(this.fnFormatter){r.warning("Tried to use twoway binding, but a formatter function is used");return undefined}a=this.getDataState();let l;if(this.oType){l=this.aBindings.map(t=>t.getContext());s=h.resolve().then(function(){var t;if(u.oType.getParseWithValues()){t=u.getCurrentValues()}return u.oType.parseValue(e,u.sInternalType,t)}).then(function(t){var e=u.getValidateValues(t);return h.all([t,u.oType.validateValue(e)])}).then(function(t){return t[0]}).catch(function(t){a.setInvalidValue(e);u.checkDataState();throw t})}else if(Array.isArray(e)&&n instanceof o&&n.isArrayType()){s=h.resolve(e)}else if(typeof e=="string"){s=h.resolve(e.split(" "))}else{s=h.resolve([e])}i=s.then(function(n){u.aBindings.forEach(function(a,i){var s=a.getBindingMode();e=n[i];let r;if(l&&l[i]!==a.getContext()){r=l[i]}if(e!==undefined&&s!==t.OneWay&&s!==t.OneTime){if(u.bRawValues){a._setRawValue(e,r)}else if(u.bInternalValues){a._setInternalValue(e,r)}else{a._setExternalValue(e,r)}}});a.setValue(u.getValue());a.setInvalidValue(undefined)});i.catch(function(){});return i.unwrap()};l.prototype.getInternalValue=function(){return this.aBindings.map(function(t){return t.getInternalValue()})};l.prototype.setInternalValue=function(e){var n=this.getDataState(),a,i=this;if(this.oType){a=h.resolve(e).then(function(t){if(!i.bInternalValues){t=i.aBindings.map(function(e,n){return e._internalToRaw(t[n])});if(!i.bRawValues){t=i.aBindings.map(function(e,n){return e._rawToExternal(t[n])})}}return i.oType.validateValue(t)}).then(function(){return e}).catch(function(t){n.setInvalidValue(e);i.checkDataState();throw t})}else{a=h.resolve(e)}return a.then(function(){i.aBindings.forEach(function(n,a){var i=e[a],s=n.getBindingMode();if(i!==undefined&&s!==t.OneWay&&s!==t.OneTime){n.setInternalValue(i)}});n.setValue(i.getValue());n.setInvalidValue(undefined)}).unwrap()};l.prototype.getRawValue=function(){return this.aBindings.map(function(t){return t.getRawValue()})};l.prototype.setRawValue=function(e){var n=this.getDataState(),a,i=this;if(this.oType){a=h.resolve(e).then(function(t){if(!i.bRawValues){if(i.bInternalValues){t=i.aBindings.map(function(e,n){return e._rawToInternal(t[n])})}else{t=i.aBindings.map(function(e,n){return e._rawToExternal(t[n])})}}return i.oType.validateValue(t)}).then(function(){return e}).catch(function(t){n.setInvalidValue(e);i.checkDataState();throw t})}else{a=h.resolve(e)}return a.then(function(){i.aBindings.forEach(function(n,a){var i=e[a],s=n.getBindingMode();if(i!==undefined&&s!==t.OneWay&&s!==t.OneTime){n.setRawValue(i)}});n.setValue(i.getValue());n.setInvalidValue(undefined)}).unwrap()};l.prototype.getCurrentValues=function(){if(this.bRawValues){return this.getRawValue()}else if(this.bInternalValues){return this.getInternalValue()}else{return this.aBindings.map(function(t){return t.getExternalValue()})}};l.prototype.getValidateValues=function(t){var e,n,a=t;n=this.aBindings.some(function(e,n){return t[n]===undefined});if(n){e=this.getCurrentValues();a=e.map(function(e,n){return t[n]===undefined?e:t[n]})}return a};l.prototype.getBindings=function(){return this.aBindings};l.prototype.hasValidation=function(){if(this.getType()){return true}var t=this.getBindings();for(var e=0;e<t.length;++e){if(t[e].hasValidation()){return true}}return false};l.prototype.attachChange=function(e,n){var a=this;this.fnChangeHandler=function(e){if(a.bSuspended){return}var n=e.getSource();if(n.getBindingMode()==t.OneTime){n.detachChange(a.fnChangeHandler)}a.checkUpdate(true)};this.attachEvent("change",e,n);if(this.aBindings){this.aBindings.forEach(function(t){t.attachChange(a.fnChangeHandler)})}};l.prototype.detachChange=function(t,e){var n=this;this.detachEvent("change",t,e);if(this.aBindings){this.aBindings.forEach(function(t){t.detachChange(n.fnChangeHandler)})}};l.prototype.attachDataStateChange=function(e,n){var a=this;this.fnDataStateChangeHandler=function(e){var n=e.getSource();if(n.getBindingMode()==t.OneTime){n.detachDataStateChange(a.fnChangeHandler)}a.checkDataState()};this.attachEvent("DataStateChange",e,n);if(this.aBindings){this.aBindings.forEach(function(t){t.attachEvent("DataStateChange",a.fnDataStateChangeHandler)})}};l.prototype.detachDataStateChange=function(t,e){var n=this;this.detachEvent("DataStateChange",t,e);if(this.aBindings){this.aBindings.forEach(function(t){t.detachEvent("DataStateChange",n.fnDataStateChangeHandler)})}};l.prototype.attachAggregatedDataStateChange=function(e,n){var a=this;if(!this.fnDataStateChangeHandler){this.fnDataStateChangeHandler=function(e){var n=e.getSource();if(n.getBindingMode()==t.OneTime){n.detachDataStateChange(a.fnChangeHandler)}a.checkDataState()}}this.attachEvent("AggregatedDataStateChange",e,n);if(this.aBindings){this.aBindings.forEach(function(t){t.attachEvent("DataStateChange",a.fnDataStateChangeHandler)})}};l.prototype.detachAggregatedDataStateChange=function(t,e){var n=this;this.detachEvent("AggregatedDataStateChange",t,e);if(this.aBindings){this.aBindings.forEach(function(t){t.detachEvent("DataStateChange",n.fnDataStateChangeHandler)})}};l.prototype.updateRequired=function(t){var e=false;this.aBindings.forEach(function(n){e=e||n.updateRequired(t)});return e};l.prototype.initialize=function(){this.bPreventUpdate=true;if(this.aBindings){this.aBindings.forEach(function(t){t.initialize()})}this.bPreventUpdate=false;if(!this.bSuspended){this.checkUpdate(true)}return this};l.prototype.getDataState=function(){if(!this.oDataState){this.oDataState=new n(this.aBindings.map(function(t){return t.getDataState()}))}return this.oDataState};l.prototype.suspend=function(){this.bSuspended=true;this.aBindings.forEach(function(t){t.suspend()})};l.prototype.resume=function(){this.aBindings.forEach(function(t){t.resume()});this.bSuspended=false;this.checkUpdate(true)};l.prototype.checkUpdate=function(t){var n=false;if(this.bPreventUpdate||this.bSuspended&&!t){return}if(this.bMultipleModels&&this.aBindings.some(function(t){var e=t.getModel();return e&&e.bDestroyed})){return}var a=this.getDataState();var i=this.getOriginalValue();if(t||!u(i,this.aOriginalValues)){this.aOriginalValues=i;a.setOriginalValue(i);n=true}var s=this.getValue();if(!u(s,this.aValues)||t){this.aValues=s;a.setValue(s);this._fireChange({reason:e.Change});n=true}if(n){this.checkDataState()}};return l});
//# sourceMappingURL=CompositeBinding.js.map