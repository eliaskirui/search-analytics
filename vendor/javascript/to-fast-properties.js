var t={};let e=null;function FastObject(t){if(null!==e&&typeof e.property){const t=e;e=FastObject.prototype=null;return t}e=FastObject.prototype=null==t?Object.create(null):t;return new FastObject}FastObject();t=function toFastproperties(t){return FastObject(t)};var r=t;export default r;

