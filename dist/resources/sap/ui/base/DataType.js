/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/future","sap/base/util/ObjectPath","sap/base/assert","sap/base/Log","sap/base/util/isPlainObject","sap/base/util/resolveReference"],function(e,t,n,r,a,i){"use strict";var u=function(){throw new Error};u.prototype.getName=function(){return undefined};u.prototype.getBaseType=function(){return undefined};u.prototype.getPrimitiveType=function(){var e=this;while(e.getBaseType()){e=e.getBaseType()}return e};u.prototype.getComponentType=function(){return undefined};u.prototype.getDefaultValue=function(){return undefined};u.prototype.isArrayType=function(){return false};u.prototype.isEnumType=function(){return false};u.prototype.getEnumValues=function(){return undefined};u.prototype.parseValue=function(e){return e};u.prototype.isValid=undefined;u.prototype.setNormalizer=function(e){n(typeof e==="function","DataType.setNormalizer: fnNormalizer must be a function");this._fnNormalizer=typeof e==="function"?e:undefined};u.prototype.normalize=function(e){return this._fnNormalizer?this._fnNormalizer(e):e};function o(e,t,n){t=t||{};var r=n||u.prototype;var a=Object.create(r);a.getName=function(){return e};if(t.hasOwnProperty("defaultValue")){var i=t.defaultValue;a.getDefaultValue=function(){return i}}if(t.isValid){var o=t.isValid;a.isValid=r.isValid?function(e){if(!r.isValid(e)){return false}return o(e)}:o}if(t.parseValue){a.parseValue=t.parseValue}a.getBaseType=function(){return n};return a}var s={any:o("any",{defaultValue:null,isValid:function(e){return true}}),boolean:o("boolean",{defaultValue:false,isValid:function(e){return typeof e==="boolean"},parseValue:function(e){return e=="true"}}),int:o("int",{defaultValue:0,isValid:function(e){return typeof e==="number"&&(isNaN(e)||Math.floor(e)==e)},parseValue:function(e){return parseInt(e)}}),float:o("float",{defaultValue:0,isValid:function(e){return typeof e==="number"},parseValue:function(e){return parseFloat(e)}}),string:o("string",{defaultValue:"",isValid:function(e){return typeof e==="string"||e instanceof String},parseValue:function(e){return e}}),object:o("object",{defaultValue:null,isValid:function(e){return typeof e==="object"||typeof e==="function"},parseValue:function(e){return e?JSON.parse(e):null}}),function:o("function",{defaultValue:null,isValid:function(e){return e==null||typeof e==="function"},parseValue:function(e,t){if(e===""){return undefined}if(!/^\.?[A-Z_\$][A-Z0-9_\$]*(\.[A-Z_\$][A-Z0-9_\$]*)*$/i.test(e)){throw new Error("Function references must consist of dot separated "+"simple identifiers (A-Z, 0-9, _ or $) only, but was '"+e+"'")}var n,r=t&&t.context,a=t&&t.locals;n=i(e,Object.assign({".":r},a));if(n&&this.isValid(n)){return n}throw new TypeError("The string '"+e+"' couldn't be resolved to a function")}})};var f=o("array",{defaultValue:[]});function p(e){n(e instanceof u,"DataType.<createArrayType>: componentType must be a DataType");var t=Object.create(u.prototype);t.getName=function(){return e.getName()+"[]"};t.getComponentType=function(){return e};t.isValid=function(t){if(t===null){return true}if(Array.isArray(t)){for(var n=0;n<t.length;n++){if(!e.isValid(t[n])){return false}}return true}return false};t.parseValue=function(t){var n=t.split(",");for(var r=0;r<n.length;r++){n[r]=e.parseValue(n[r])}return n};t.isArrayType=function(){return true};t.getBaseType=function(){return f};return t}const l=Object.create(null);function c(e,t){var n={},r;for(var a in t){var i=t[a];if(!r){r=i}if(typeof i!=="string"){throw new Error("Value "+i+" for enum type "+e+" is not a string")}if(!n.hasOwnProperty(i)||a==i){n[i]=a}}var o=Object.create(u.prototype);o.getName=function(){return e};o.isValid=function(e){return typeof e==="string"&&n.hasOwnProperty(e)};o.parseValue=function(e){return t[e]};o.getDefaultValue=function(){return r};o.getBaseType=function(){return s.string};o.isEnumType=function(){return true};o.getEnumValues=function(){return t};return o}u.getType=function(i){n(i&&typeof i==="string","sTypeName must be a non-empty string");var o=s[i];if(!(o instanceof u)){if(i.indexOf("[]",i.length-2)>0){var f=i.slice(0,-2),y=this.getType(f);o=y&&p(y);if(o){s[i]=o}}else if(i!=="array"){o=l[i];if(o==null){o=t.get(i);if(o!=null){r.error(`[DEPRECATED] The type '${i}' was accessed via globals. Defining types via globals is deprecated. `+`In case the referenced type is an enum: require the module 'sap/ui/base/DataType' and call the static 'DataType.registerEnum' API. `+`In case the referenced type is non-primitive, please note that only primitive types (and those derived from them) are supported for ManagedObject properties. `+`If the given type is an interface or a subclass of ManagedObject, you can define a "0..1" aggregation instead of a property`)}}if(o instanceof u){s[i]=o}else if(a(o)){o=s[i]=c(i,o);delete l[i]}else if(o){e.warningThrows("'"+i+"' is not a valid data type. Falling back to type 'any'.");o=s.any}else{e.errorThrows("data type '"+i+"' could not be found.");o=undefined}}}return o};u.createType=function(t,r,a){n(typeof t==="string"&&t,"DataType.createType: type name must be a non-empty string");n(a==null||a instanceof u||typeof a==="string"&&a,"DataType.createType: base type must be empty or a DataType or a non-empty string");if(/[\[\]]/.test(t)){e.errorThrows("DataType.createType: array types ('something[]') must not be created with createType, "+"they're created on-the-fly by DataType.getType")}if(typeof a==="string"){a=u.getType(a)}a=a||s.any;if(a.isArrayType()||a.isEnumType()){e.errorThrows("DataType.createType: base type must not be an array- or enum-type")}if(t==="array"||s[t]instanceof u){if(t==="array"||s[t].getBaseType()==null){throw new Error("DataType.createType: primitive or hidden type "+t+" can't be re-defined")}e.warningThrows("DataTypes.createType: type "+t+" is redefined. "+"This is an unsupported usage of DataType and might cause issues.")}var i=s[t]=o(t,r,a);return i};var y=new Set;u.registerInterfaceTypes=function(e){e.forEach(function(e){y.add(e);(()=>{t.set(e,e)})()})};u.registerEnum=function(e,t){l[e]=t};u._isEnumCandidate=function(e){return!Object.keys(e).some(t=>{const n=typeof e[t];return n==="object"||n==="function"})};u.isInterfaceType=function(e){return y.has(e)};return u},true);
//# sourceMappingURL=DataType.js.map