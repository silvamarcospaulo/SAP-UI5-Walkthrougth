/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseTreeModifier","sap/ui/base/ManagedObject","sap/ui/base/DataType","sap/base/util/merge","sap/ui/util/XMLHelper","sap/ui/core/mvc/EventHandlerResolver","sap/base/util/ObjectPath","sap/base/util/isPlainObject","sap/ui/core/Fragment"],function(e,t,n,r,i,o,a,u,g){"use strict";var s="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1";async function f(e,t,n,r,i,o,a){let u;if(!a){const n=e.namespaceURI;u=await this.createControl(n+"."+t,undefined,i);e.appendChild(u)}else{u=a}if(!o){const e=u.children;let t=0;const n=r<e.length?r:e.length;for(let r=0;r<n;r++){if(e[r].namespaceURI==="sap.ui.core"&&e[r].tagName.includes("ExtensionPoint")){t=t+1-e[r].children.length}}r=r+t}if(r>=u.childElementCount){u.appendChild(n)}else{const t=await this._getControlsInAggregation(e,u);u.insertBefore(n,t[r])}return undefined}var l=r({},e,{targets:"xmlTree",setVisible:function(e,t){if(t){e.removeAttribute("visible")}else{e.setAttribute("visible",t)}},getVisible:function(e){return l.getProperty(e,"visible")},setStashed:function(e,t){if(!t){e.removeAttribute("stashed")}else{e.setAttribute("stashed",t)}l.setVisible(e,!t);return Promise.resolve()},getStashed:function(e){return Promise.all([l.getProperty(e,"stashed"),l.getProperty(e,"visible")]).then(function(e){return!!e[0]||!e[1]})},bindProperty:function(e,t,n){e.setAttribute(t,"{"+n+"}")},unbindProperty:function(e,t){e.removeAttribute(t)},_setProperty:function(e,t,n,r){var i=l._getSerializedValue(n);if(r){i=l._escapeCurlyBracketsInString(i)}e.setAttribute(t,i)},setProperty:function(e,t,n){l._setProperty(e,t,n,true)},getProperty:function(e,r){var i;var o;var a=e.getAttribute(r);return l.getControlMetadata(e).then(function(t){i=t.getProperty(r);if(i){o=i.getType();if(r==="value"&&l.getControlType(e)==="sap.ui.core.CustomData"){return l.getProperty(e,"key").then(function(e){if(e==="sap-ui-custom-settings"){o=n.getType("object")}})}}return undefined}).then(function(){if(i){if(a===null){a=i.getDefaultValue()||o.getDefaultValue()}else{var e=t.bindingParser(a,undefined,true);if(u(e)){if(e.path||e.parts){a=undefined}else{a=e}}else{a=o.parseValue(e||a)}}}return a})},isPropertyInitial:function(e,t){var n=e.getAttribute(t);return n==null},setPropertyBinding:function(e,t,n){if(typeof n!=="string"){throw new Error("For XML, only strings are supported to be set as property binding.")}e.setAttribute(t,n)},getPropertyBinding:function(e,n){var r=e.getAttribute(n);if(r){var i=t.bindingParser(r,undefined,true);if(i&&(i.path||i.parts)){return i}}return undefined},createAndAddCustomData:function(e,t,n){e.setAttributeNS(s,"custom.data.via.modifier:"+t,l._escapeCurlyBracketsInString(n));return Promise.resolve()},getCustomDataInfo:function(e,t){var n=e.attributes["custom.data.via.modifier:"+t];if(n){return{customData:n,customDataValue:n.value}}else{return{}}},createControl:function(e,t,n,r,i,o){var a,u,g;if(!l.bySelector(r,t,n)){var s=e.split(".");var f="";if(s.length>1){u=s.pop();f=s.join(".")}var c=n.ownerDocument.createElementNS(f,u);a=l.getControlIdBySelector(r,t);if(a){c.setAttribute("id",a)}return Promise.resolve().then(function(){if(i){return l.applySettings(c,i)}return undefined}).then(function(){return Promise.resolve(c)})}else{g=new Error("Can't create a control with duplicated ID "+a);return Promise.reject(g)}},applySettings:function(e,t){return l.getControlMetadata(e).then(function(n){var r=n.getJSONKeys();Object.keys(t).forEach(function(n){var i=r[n];var o=t[n];switch(i._iKind){case 0:l._setProperty(e,n,o,false);break;case 3:l.setAssociation(e,n,o);break;default:throw new Error("Unsupported in applySettings on XMLTreeModifier: "+n)}})})},_byId:function(e,t){if(t){if(t.ownerDocument&&t.ownerDocument.getElementById&&t.ownerDocument.getElementById(e)){return t.ownerDocument.getElementById(e)}return t.querySelector("[id='"+e+"']")}return undefined},getId:function(e){return e.getAttribute("id")},getParent:function(e){var t=e.parentNode;if(t&&!l.getId(t)&&!l._isExtensionPoint(t)){t=t.parentNode}return t},_getLocalName:function(e){return e.localName||e.baseName||e.nodeName},getControlType:function(e){return l._getControlTypeInXml(e)},setAssociation:function(e,t,n){if(typeof n!=="string"){n=l.getId(n)}e.setAttribute(t,n)},getAssociation:function(e,t){return e.getAttribute(t)},getAllAggregations:function(e){return l.getControlMetadata(e).then(function(e){return e.getAllAggregations()})},getAggregation:function(e,t){var n=[];var r;return l._isSingleValueAggregation(e,t).then(function(n){r=n;return l._findAggregationNode(e,t)}).then(function(i){if(i){return l._getControlsInAggregation(e,i).then(function(e){n=e})}return l._isAltTypeAggregation(e,t).then(function(i){if(i&&r){return l.getProperty(e,t).then(function(e){n.push(e)})}return undefined})}).then(function(){if(t==="customData"){var i;var o=Array.prototype.slice.call(e.attributes).reduce(function(t,n){var r=l._getLocalName(n);if(n.namespaceURI===s){var o=e.ownerDocument.createElementNS("sap.ui.core","CustomData");o.setAttribute("key",r);o.setAttribute("value",n.value);t.push(o)}else if(n.namespaceURI&&n.name.indexOf("xmlns:")!==0){if(!i){i={}}if(!i.hasOwnProperty(n.namespaceURI)){i[n.namespaceURI]={}}i[n.namespaceURI][r]=n.nodeValue}return t},[]);n=n.concat(o);if(i){var a=e.ownerDocument.createElementNS("sap.ui.core","CustomData");a.setAttribute("key","sap-ui-custom-settings");l.setProperty(a,"value",i);n.push(a)}}return r?n[0]:n})},insertAggregation:async function(e,t,n,r,i,o){const a=await l._findAggregationNode(e,t);return f.call(this,e,t,n,r,i,o,a)},removeAggregation:async function(e,t,n){const r=await l._findAggregationNode(e,t);r.removeChild(n)},moveAggregation:async function(e,t,n,r,i,o,a,u){const g=await l._findAggregationNode(e,t);const s=await l._findAggregationNode(n,r);g.removeChild(i);await f.call(this,n,r,i,o,a,u,s)},replaceAllAggregation:async function(e,t,n){const r=await l._findAggregationNode(e,t);const i=await l._getControlsInAggregation(e,r);i.forEach(function(e){r.removeChild(e)});n.forEach(e=>{r.appendChild(e)})},removeAllAggregation:function(e,t){return l._findAggregationNode(e,t).then(function(t){if(e===t){return l._getControlsInAggregation(e,e).then(function(t){t.forEach(function(t){e.removeChild(t)})})}return e.removeChild(t)})},_findAggregationNode:function(e,t){var n;var r=l._children(e);for(var i=0;i<r.length;i++){var o=r[i];if(o.localName===t){n=o;break}}var a=Promise.resolve(n);if(!n){a=a.then(l._isDefaultAggregation.bind(l,e,t)).then(function(t){if(t){return e}return n})}return a},_isDefaultAggregation:function(e,t){return l.getControlMetadata(e).then(function(e){var n=e.getDefaultAggregation();return n&&t===n.name})},_isNotNamedAggregationNode:function(e,t){return l.getAllAggregations(e).then(function(n){var r=n[t.localName];return e.namespaceURI!==t.namespaceURI||!r})},_isSingleValueAggregation:function(e,t){return l.getAllAggregations(e).then(function(e){var n=e[t];return!n.multiple})},_isAltTypeAggregation:function(e,t){return l.getControlMetadata(e).then(function(e){return e.getAllAggregations()[t]}).then(function(e){return!!e.altTypes})},_isExtensionPoint:function(e){return l._getControlTypeInXml(e)==="sap.ui.core.ExtensionPoint"},getControlMetadata:function(e){return l._getControlMetadataInXml(e)},_getControlsInAggregation:function(e,t){var n=Array.prototype.slice.call(l._children(t));return Promise.all(n.map(function(t){return l._isNotNamedAggregationNode(e,t).then(function(e){return e?t:undefined})})).then(function(e){return e.filter(function(e){return!!e})})},_children:function(e){if(e.children){return e.children}else{var t=[];for(var n=0;n<e.childNodes.length;n++){var r=e.childNodes[n];if(r.nodeType===r.ELEMENT_NODE){t.push(r)}}return t}},getBindingTemplate:function(e,t){return l._findAggregationNode(e,t).then(function(e){if(e){var t=l._children(e);if(t.length===1){return t[0]}}return undefined})},updateAggregation:function(e,t){},findIndexInParentAggregation:function(e){var t=l.getParent(e);if(!t){return Promise.resolve(-1)}return l.getParentAggregationName(e,t).then(function(e){return l.getAggregation(t,e)}).then(function(t){if(Array.isArray(t)){var n=t.map(function(e){return Promise.resolve().then(function(){if(l._isExtensionPoint(e)){return e}return l.getProperty(e,"stashed").then(function(t){return!t?e:undefined})})});return Promise.all(n).then(function(t){return t.filter(function(e){return!!e}).indexOf(e)})}else{return 0}})},getParentAggregationName:function(e,t){return Promise.resolve().then(function(){if(!t.isSameNode(e.parentNode)){return false}else{return l._isNotNamedAggregationNode(t,e)}}).then(function(n){if(n){return l.getControlMetadata(t).then(function(e){return e.getDefaultAggregationName()})}else{return l._getLocalName(e.parentNode)}})},findAggregation:function(e,t){return l.getControlMetadata(e).then(function(e){return e.getAllAggregations()}).then(function(e){if(e){return e[t]}return undefined})},validateType:function(e,t,n,r,i){var o=t.type;return l.getAggregation(n,t.name).then(function(e){if(t.multiple===false&&e&&e.length>0){return false}return g.load({definition:r})}).then(function(e){if(!Array.isArray(e)){e=[e]}var t=e[i].isA(o);e.forEach(function(e){e.destroy()});return t})},instantiateFragment:function(e,t,n){var r=i.parse(e);return l._checkAndPrefixIdsInFragment(r,t).then(function(e){var t;if(e.localName==="FragmentDefinition"){t=l._getElementNodeChildren(e)}else{t=[e]}t.forEach(function(e){if(l._byId(e.getAttribute("id"),n)){throw Error("The following ID is already in the view: "+e.getAttribute("id"))}});return t})},templateControlFragment:function(t,n){return e._templateFragment(t,n).then(function(e){return l._children(e)})},destroy:function(e){var t=e.parentNode;if(t){t.removeChild(e)}},_getFlexCustomData:function(e,t){if(!e){return undefined}return e.getAttributeNS("sap.ui.fl",t)},bindAggregation:function(e,t,n,r){return Promise.resolve().then(function(){l.bindProperty(e,t,n.path);return l.insertAggregation(e,t,n.template,0,r)})},unbindAggregation:function(e,t){return Promise.resolve().then(function(){if(e.hasAttribute(t)){e.removeAttribute(t);return l.removeAllAggregation(e,t)}return undefined})},getExtensionPointInfo:function(e,t){return Promise.resolve().then(function(){if(t&&e){var n=Array.prototype.slice.call(t.getElementsByTagNameNS("sap.ui.core","ExtensionPoint"));var r=n.filter(function(t){return t.getAttribute("name")===e});var i=r.length===1?r[0]:undefined;if(i){var o=l.getParent(i);return Promise.all([l.getParentAggregationName(i,o),l.findIndexInParentAggregation(i)]).then(function(e){var t={parent:o,aggregationName:e[0],index:e[1]+1,defaultContent:Array.prototype.slice.call(l._children(i))};return t})}}return undefined})}});return l},true);
//# sourceMappingURL=XmlTreeModifier.js.map