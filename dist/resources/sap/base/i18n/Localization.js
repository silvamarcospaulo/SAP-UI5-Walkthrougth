/*!
* OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/base/config","sap/base/Eventing","sap/base/Log","sap/base/i18n/LanguageTag","sap/base/i18n/date/CalendarType","sap/base/i18n/date/TimezoneUtils"],function(e,n,t,a,g,i){"use strict";const r=e.getWritableInstance();let o;const l=new n;let s;let u=false;const c={"ar-SA":g.Islamic,fa:g.Persian,th:g.Buddhist,default:g.Gregorian};const p={ZH:"zh-Hans",ZF:"zh-Hant",SH:"sr-Latn",CT:"cnr","6N":"en-GB","1P":"pt-PT","1X":"es-MX","3F":"fr-CA","1Q":"en-US-x-saptrc","2Q":"en-US-x-sappsd","3Q":"en-US-x-saprigi"};const f={iw:"he",ji:"yi"};const d=(e=>Object.keys(e).reduce((n,t)=>{n[e[t]]=t;return n},{}))(p);function T(e){let n;if(e){const t=/-(saptrc|sappsd|saprigi)(?:-|$)/i.exec(e);n=t&&"en-US-x-"+t[1].toLowerCase()}return n}function L(e){const n=/\$([-a-z0-9A-Z._]+)(?::([^$]*))?\$/.exec(e);return n&&n[2]?n[2].split(/,/):null}const y=L("$cldr-rtl-locales:ar,fa,he$")||[];const h=L("$core-i18n-locales:,ar,bg,ca,cnr,cs,cy,da,de,el,en,en_GB,es,es_MX,et,fi,fr,fr_CA,hi,hr,hu,id,it,iw,ja,kk,ko,lt,lv,mk,ms,nl,no,pl,pt,pt_PT,ro,ru,sh,sk,sl,sr,sv,th,tr,uk,vi,zh_CN,zh_TW$");function m(e){let n;if(e&&typeof e==="string"){e=p[e.toUpperCase()]||e;try{n=new a(e)}catch(e){}}return[n,e]}function z(e){let n;if(e){n=new a(e)}return n}function S(){return globalThis.navigator?globalThis.navigator.languages&&globalThis.navigator.languages[0]||globalThis.navigator.language||"en":(new Intl.Collator).resolvedOptions().locale||"en"}function b(e,n){if(!e){throw new TypeError(n)}}function v(){return Array.prototype.filter.call(arguments,Boolean).join("-")}function x(e){const n=i.isValidTimezone(e);if(!n){t.error("The provided timezone '"+e+"' is not a valid IANA timezone ID."+" Falling back to browser's local timezone '"+i.getLocalTimezone()+"'.")}return n}const A={attachChange:function(e){l.attachEvent("change",e)},detachChange:function(e){l.detachEvent("change",e)},getActiveTerminologies:function(){return r.get({name:"sapUiActiveTerminologies",type:e.Type.StringArray,defaultValue:undefined,external:true})},getLanguage:function(){let n,a;if(o){return o}const g=r.get({name:"sapUiLanguage",type:e.Type.String,external:true});const i=r.get({name:"sapLocale",type:e.Type.String,external:true});const l=r.get({name:"sapLanguage",type:e.Type.String,external:true});if(i){n=z(i);a=i}else if(l){if(!g&&!u){t.warning("sap-language '"+l+"' is not a valid BCP47 language tag and will only be used as SAP logon language");u=true}[n,a]=m(l)}if(!n){if(g){n=z(g);a=g}else{a=S();n=z(g)}}return a},getModernLanguage:function(e){return f[e]||e},setLanguage:function(n,t){const a=z(n),g=A.getRTL();b(a,"Localization.setLanguage: sLanguage must be a valid BCP47 language tag");b(t==null||typeof t==="string"&&/^[A-Z0-9]{2,2}$/i.test(t),"Localization.setLanguage: sSAPLogonLanguage must be null or be a string of length 2, consisting of digits and latin characters only");t=t||"";if(a.toString()!=A.getLanguageTag().toString()||t!==r.get({name:"sapLanguage",type:e.Type.String,external:true})){r.set("sapLanguage",t);o=n;s={};s.language=A.getLanguageTag().toString();const e=A.getRTL();if(g!=e){s.rtl=e}w()}},getTimezone:function(){let n=r.get({name:"sapTimezone",type:e.Type.String,external:true,defaultValue:r.get({name:"sapUiTimezone",type:e.Type.String,external:true})});if(!n||!x(n)){n=i.getLocalTimezone()}return n},setTimezone:function(e){b(e==null||typeof e==="string","Localization.setTimezone: sTimezone must be null or be a string");const n=A.getTimezone();e=e===null||!x(e)?undefined:e;r.set("sapTimezone",e);if(A.getTimezone()!==n){s={};s.timezone=A.getTimezone();w()}},getLanguageTag:function(){const e=new a(A.getLanguage());const n=A.getModernLanguage(e.language);const t=e.script;let g=e.toString();if(n==="sr"&&t==="Latn"){g=g.replace("sr-Latn","sh")}else{g=g.replace(e.language,n)}return new a(g)},getRTL:function(){return r.get({name:"sapRtl",type:e.Type.Boolean,external:true,defaultValue:r.get({name:"sapUiRtl",type:e.Type.Boolean,defaultValue:function(){return C(A.getLanguageTag())},external:true})})},setRTL:function(e){b(e===null||typeof e==="boolean","bRTL must be null or a boolean");e=e===null?undefined:e;const n=A.getRTL();r.set("sapRtl",e);const t=A.getRTL();if(n!=t){s={};s.rtl=t;w()}},_getSAPLogonLanguage:function(e){let n=e.language||"";if(n.indexOf("-")>=0){n=n.slice(0,n.indexOf("-"))}n=A.getModernLanguage(n);if(n==="zh"&&!e.script&&e.region==="TW"){return"ZF"}return d[v(n,e.script)]||d[v(n,e.region)]||d[T(e.privateUse)]||n.toUpperCase()},getSAPLogonLanguage:function(){let n;const a=r.get({name:"sapLanguage",type:e.Type.String,external:true}).toUpperCase();try{[n]=m(a)}catch(e){}if(a&&!n){t.warning("sap-language '"+a+"' is not a valid BCP47 language tag and will only be used as SAP logon language")}return a||A._getSAPLogonLanguage(A.getLanguageTag())},getPreferredCalendarType:function(){const e=A.getLanguageTag();return c[e.language+"-"+e.region]||c[e.language]||c["default"]},getLanguagesDeliveredWithCore:function(){return h},getSupportedLanguages:function(){let n=e.get({name:"sapUiXxSupportedLanguages",type:e.Type.StringArray,external:true});if(n.length===0||n.length===1&&n[0]==="*"){n=[]}else if(n.length===1&&n[0]==="default"){n=this.getLanguagesDeliveredWithCore()||[]}return n}};function C(e){let n=e.language||"";n=A.getModernLanguage(e.language);const t=e.region||"";if(t&&y.indexOf(n+"_"+t)>=0){return true}return y.indexOf(n)>=0}function w(){l.fireEvent("change",s);s=undefined}return A});
//# sourceMappingURL=Localization.js.map