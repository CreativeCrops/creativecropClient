/*Polyfills for functions not available in other browsers. */

/*Polyfill for Node.after
//Not supported out of the box in IE and Edge. 
//from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/after()/after().md */
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('after')) {
      return;
    }
    Object.defineProperty(item, 'after', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function after() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.parentNode.insertBefore(docFrag, this.nextSibling);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);


/*Polyfill for replaceWith. 
//Not supported out of the box for IE and Edge. */
function ReplaceWith(Ele) {
    var parent = this.parentNode,
        i = arguments.length,
        firstIsNode = +(parent && typeof Ele === 'object');
    if (!parent){
        return;
    } 
    
    while (i-- > firstIsNode){
      if (parent && typeof arguments[i] !== 'object'){
        arguments[i] = document.createTextNode(arguments[i]);
      } if (!parent && arguments[i].parentNode){
        arguments[i].parentNode.removeChild(arguments[i]);
        continue;
      }
      parent.insertBefore(this.previousSibling, arguments[i]);
    }
    if (firstIsNode){
        parent.replaceChild(this, Ele);
    } 
}
if (!Element.prototype.replaceWith){
    Element.prototype.replaceWith = ReplaceWith;
}
if (!CharacterData.prototype.replaceWith){
    CharacterData.prototype.replaceWith = ReplaceWith;
}
if (!DocumentType.prototype.replaceWith) {
    DocumentType.prototype.replaceWith = ReplaceWith;
}

/*Polyfill for startsWith
//Not supported out of the box for  IE */
if(!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

/*Polyfill for endsWith
//Not supported out of the box for  IE */
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}Lyte = {};
Lyte.version = "1.0.6";
Lyte.registeredMixins = {};
Lyte.Mixin = {};
Lyte.debug = false;
Lyte.performance = false;
Lyte.toBeRegistered = [];
var consoleTime = [];

Lyte.Mixin.register = function(name, mixin){
  Lyte.registeredMixins[name] = mixin;
}

Lyte.log = function(text,color) {
  if(Lyte.debug) {
    console.log((color ? "%c" : "")+text,'color:'+color);
  }
}

Lyte.time = function(fn) {
  if(Lyte.performance) {
    var index;
    if((index = consoleTime.indexOf(fn)) != -1) {
      consoleTime.splice(index,1);
      console.timeEnd(fn);
    } else {
      consoleTime.push(fn)
      console.time(fn);
    }
  }
}

Lyte.isRecord = function(object){
  if(object && object.$ && object.$.hasOwnProperty("isModified")) {
    return true;
  }
  return false;
}

Lyte.isComponent = function(object) {
  if(object && object.$node && object.__data) {
    return true;
  }
  return false;
}

Lyte.injectResources = function(files,every,completed) {
  if(files) {
    files = Array.isArray(files) ? files : [files];
    var filesLoaded = -(files.length);
    files.forEach(function(file) {
      var tag,
      fileSplit = file.split('.'),
      type = fileSplit[fileSplit.length-1],
      tags = {js:'script',css:'link'};
      tag = document.createElement(tags[type]);
      if(fileSplit.length == 1) {
        console.error('Type of file is not specified in injectResources.');
        return;
      }
      if(type == 'css') {
        tag.setAttribute('href',file);
        tag.setAttribute('type',"text/css");
        tag.setAttribute('rel',"stylesheet");
      } else {
        tag.setAttribute('src',file);
      }
      tag.onerror = tag.onload = function (event) {
        filesLoaded++
        if(every) {
          every.call(this,event);
        }
        if(completed && filesLoaded == 0) {
          completed();
        }
      };
      document.head.appendChild(tag);
    });  
  }
}

Lyte.checkProperty = function(property,dataVal,key,fieldVal, record){
  var exts = "extends";
  switch(property){
    case "type" : 
      if(Lyte.Transform.hasOwnProperty(fieldVal)){
        if(Array.isArray(dataVal)){
          if(Lyte.Transform[fieldVal][exts] != "array"){
            return {code : "ERR03", message : Lyte.errorCodes.ERR03, expected : fieldVal};
          }
        }
        else if(Lyte.Transform[fieldVal][exts] != (typeof dataVal)){
          return {code : "ERR03", message : Lyte.errorCodes.ERR03, expected : fieldVal};
        }
      }
      else if(Array.isArray(dataVal)){
        if(fieldVal != "array"){
          return {code : "ERR03", message : Lyte.errorCodes.ERR03, expected : fieldVal};
        }
      }
      else if(fieldVal != (typeof dataVal)){
        return {code : "ERR03", message : Lyte.errorCodes.ERR03, expected : fieldVal};
      }
      break;
    case "maximum" :
      if((typeof dataVal == "number") && dataVal > fieldVal){
        return {code : "ERR04", message : Lyte.errorCodes.ERR04, expected : fieldVal};
      }
      break;
    case "minimum" :
      if((typeof dataVal == "number") && dataVal < fieldVal){
        return {code : "ERR05", message : Lyte.errorCodes.ERR05, expected : fieldVal};
      }
      break;
    case "maxLength" :
    case "maxItems" :
      if(dataVal.length > fieldVal){
        return {code : "ERR06", message : Lyte.errorCodes.ERR06, expected : fieldVal};
      }
      break;
    case "minLength" :
    case "minItems" :
      if(dataVal.length < fieldVal){
        return {code : "ERR07", message : Lyte.errorCodes.ERR07, expected : fieldVal};
      }
      break;
    case "pattern" :
      if((typeof dataVal == "string") && !(new RegExp(fieldVal).test(dataVal))){
        return {code : "ERR08", message : Lyte.errorCodes.ERR08, expected : fieldVal};
      }
      break;
    case "uniqueItems" :{
      if(Array.isArray(dataVal) && fieldVal){
        var newArr = [];
        for(var i=0; i<dataVal.length; i++){
          var val = dataVal[i];
          if(newArr.indexOf(val) != -1){
            return {code : "ERR09", message : Lyte.errorCodes.ERR09};
          }
          newArr.push(val);
        }         
      }
      break;        
    }
    case "constant" :
      if(Array.isArray(dataVal)){
        var resp = dataVal.length==fieldVal.length && dataVal.every(function(v,i) { return v === fieldVal[i]});
        if(!resp){
          return {code : "ERR10", message : Lyte.errorCodes.ERR10, expected : fieldVal};
        }
      }
      else if(typeof dataVal == "object"){
        var resp = store.adapter.$.compareObjects(dataVal, fieldVal);
        if(!resp){
          return {code : "ERR10", message : Lyte.errorCodes.ERR10, expected : fieldVal};
        }
      }
      else if(dataVal != fieldVal){
        return {code : "ERR10", message : Lyte.errorCodes.ERR10, expected : fieldVal};
      }
      break;
    case "items" :{
      if(Array.isArray(dataVal)){
        for(var i=0; i<dataVal.length; i++){
          for(var property in fieldVal){
            var resp = Lyte.checkProperty(property, dataVal[i], i, fieldVal[property]);
            if(resp != true){
              return resp;
            }
          }
        }         
      }
      break;        
    }
    case "properties" :
      if(typeof dataVal == "object" && !Array.isArray(dataVal)){
        for(var key in dataVal){
          for(var property in fieldVal){
            var resp = Lyte.checkProperty(property, dataVal[key], key, fieldVal[property]);
            if(resp != true){
              return resp;
            }
          }
        }         
      }
      break;
    case "validation" :{
      var resp =  Lyte.customValidator[fieldVal].apply(record, [key, dataVal]);
      if(resp != true){
        return resp;
      }
    }       
  }
  return true;
}

Lyte.types = ["string", "object", "number", "boolean", "array"];

Lyte.attr = function(type, opts){
  if(opts == undefined){
    opts = {};
  }
  if(this.types.indexOf(type) == -1 && !Lyte.Transform.hasOwnProperty(type)){
    throw new Error("Not a valid field type - "+type);
  }
  opts.type = type;
  return opts;
}

Lyte.defineRelation = function(name,type,opts){
  var relation = {type : "relation", relType : type, relatedTo : name};
  if(opts){
    relation.opts = opts;
  }
  return relation;
}

Lyte.belongsTo = function(name,opts){
  return this.defineRelation(name,"belongsTo",opts);
}

Lyte.hasMany = function(name,opts){
  return this.defineRelation(name,"hasMany",opts);
}

Lyte.Transform = {};

Lyte.customValidator = {};

Lyte.registerDataType = function(fieldTypeName, properties){
  var exts = "extends";
  if(this.Transform.hasOwnProperty(fieldTypeName)){
    throw new Error("Custom Field Type - "+fieldTypeName+" -  already exists.");
  }
  if(properties[exts] == undefined || Lyte.types.indexOf(properties[exts]) == -1){
    throw new Error("Not a valid field type - "+properties[exts]);
  }
  this.Transform[fieldTypeName] = properties;
}

Lyte.registerValidator = function(customValidatorName, func){
  if(this.customValidator.hasOwnProperty(customValidatorName)){
    throw new Error("Custom Validator with name - "+customValidatorName+" - already exists");
  }
  this.customValidator[customValidatorName] = func;
}

Lyte.patterns = {
  email : /([A-Za-z0-9._%\-'+/]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,22})$|[\s]+/,
  url : /(^(ht|f)tp(s?):\/\/[0-9a-zA-Z][-.\w]*(:[0-9])*(\/?)([a-zA-Z0-9\-.?,:'/\\+=&amp;%$#_[\]@!()*;~]*)?$)/,
  ampm : /^(AM|PM|am|pm)$/,
  hour : /^(0?[0-9]|1[0-9]|2[0-4])$/,
  minute : /^(0?[0-9]|[1-5][0-9]|60)$/,
  boolean : /^(true|false|TRUE|FALSE)$/,
  alphaNumeric : /([a-zA-Z0-9])+/,
  alphabetsOnly : /([a-zA-Z])+/,
  numeric : /([0-9])+/,
  phoneNo : /^[0-9a-zA-Z+.()\-;\s]+$/
}

Lyte.validate = function(object, key, value, component) {
  var definition = component.__data[key];
  var isError = false;
  for(var defKey in definition) {
    isError = Lyte.checkProperty(defKey, value, key, definition[defKey], object);
    if(isError !== true) {
      return isError;
    }
  }
  return false;
}

Lyte.registerPattern = function(patternName, pattern){
  this.patterns[patternName] = pattern;
}

Lyte.errorCodes = {
  ERR01 : "Primary key cannot be modified", ERR02 : "Mandatory field cannot be empty", ERR03 : "Type of value does not match the specified data type", ERR04 : "Value is greater than the maximum value allowed",
  ERR05 : "Value is less than the minimum value allowed", ERR06 : "Length of string/array is greater than the maximum limit allowed", ERR07 : "Length of string/array is less than the minimum limit allowed",
  ERR08 : "String does not match the specified pattern", ERR09 : "Values in array are not unique", ERR10 : "Value is not equal to the specified constant", ERR11 : "Model of related field is not defined",
  ERR12 : "Model of backward relation is not defined", ERR13 : "Record not found", ERR14 : "Model does not match the related field model", ERR15 : "Error in creating a record as a relation",
  ERR16 : "Record with primary key already exists", ERR17 : "Value cannot be changed because record has been deleted", ERR18 : "Action not defined", ERR19 : "Model not defined",
  ERR20 : "Key not specified", ERR21 : "'belongsTo' relationship expects a single object/id", ERR22 : "Type not specified for polymorphic relation", ERR23: "Primary Key value not present", ERR24: "Error while relating record"
}

Lyte.registeredGlobalEvents = {};
Lyte.triggerEvent = function() {
   var args = Array.prototype.slice.call(arguments, 1)
   var eventName = arguments[0];
   var stopEvent = false;
   var s = this.registeredGlobalEvents[eventName];
     if(!s) {
       s = this.registeredGlobalEvents[eventName] = {"listeners" : []};
     } else {
       for(var i=0;i<s.listeners.length;i++) {
         var func = s.listeners[i];
         if(func) {
            var ret = func.apply(this, args);
            if(ret === false) {
              stopEvent = true;
              break;
            }
         }
       }
     }
     var customEvent = new CustomEvent(eventName, {"detail" : args});
     if(!stopEvent) {
      document.dispatchEvent(customEvent); 
     } 
 }

 Lyte.addEventListener = function(eventName, func) {
   if(typeof func !== "function") {
       console.error("Second parameter to LyteComponent.addGlobalEventListener() must be a function");
       return;
   }
   var s = this.registeredGlobalEvents[eventName];
   if(!s) {
     s = this.registeredGlobalEvents[eventName] = {"listeners" : []};
   }
   var d = s.listeners.push(func);
   return eventName + "-" + (d - 1);
 }

Lyte.removeEventListener = function(id) {
   if(!id) {
     console.error("listener unique id not specified");
     return;
   }
   var globalId  = id.split("-");
   var s = this.registeredGlobalEvents[globalId[0]];
   if(!s || !s.listeners[globalId[1]]) {
       console.error("No such listener registered");
       return;
   }
   s.listeners[globalId[1]] = null;
 }

Lyte.deepCopyObject = function( obj )  {
  var current, copies = [{source : obj, target : Object.create(Object.getPrototypeOf(obj))}], keys, propertyIndex, descriptor, nextSource, indexOf, sourceReferences = [obj];
  var cloneObject = copies[0].target, targetReferences = [cloneObject];
  while(current = copies.shift()){
      keys = Object.getOwnPropertyNames(current.source);
      for(propertyIndex = 0; propertyIndex < keys.length; propertyIndex++){
          descriptor = Object.getOwnPropertyDescriptor(current.source, keys[propertyIndex]);
          if(!descriptor.value || typeof descriptor.value != "object"){
              Object.defineProperty(current.target, keys[propertyIndex], descriptor);
              continue;
          }
          nextSource = descriptor.value;
          descriptor.value = Array.isArray(nextSource) ? [] : Object.create(Object.getPrototypeOf(nextSource));
          indexOf = sourceReferences.indexOf(nextSource);
          if(indexOf != -1){
              descriptor.value = targetReferences[indexOf];
              Object.defineProperty(current.target, keys[propertyIndex], descriptor);
              continue;
          }
          sourceReferences.push(nextSource);
          targetReferences.push(descriptor.value);
          Object.defineProperty(current.target, keys[propertyIndex], descriptor);
          copies.push({source : nextSource, target : descriptor.value});
      }
  }
  return cloneObject;
}

Lyte.resolvePromises = function(promises) {
  if(Array.isArray(promises)) {
    return promiseArray(promises);
  } else if(typeof promises == "object") {
    return promiseHash(promises);
  }

  function promiseHash(promiseObj) {
    var actPromKeys = [],promises = [],promiseKeys = Object.keys(promiseObj);
    promiseKeys.forEach(function(key) {
        actPromKeys.push(key)
        promises.push(promiseObj[key]);
    });
    if(!promises.length) {
      return promiseObj;
    } else {
       var obj = {},promise = new Promise(function(resolve,reject) {
          Promise.all(promises).then(function(data) {
          data.forEach(function(dataVal, index) {
              obj[actPromKeys[index]] = dataVal;
            });  
          resolve(obj);
        },function(err) {
          reject(err);
          console.error(err);
        });
      });   
     return promise;
    }
  }

  function promiseArray(promiseArray) {
    var array = [];
    var promise = new Promise(function(resolve,reject) {
      Promise.all(promiseArray).then(function(data) {
        promiseArray.forEach(function(key,index){
          array[index] = data[index];
        });
        resolve(array);
      },function(err) {
        reject(err);
        console.error(err);
      });
    });   
   return promise;
  }
};

Lyte.createCustomElement = function (customElementName, definition) {
  var constructor = definition.constructor;
  delete definition.constructor;
  this.defProperty = function(obj, key, val) {
    var obj1 = {};
    if(val.get) {
      obj1.get = val.get
    }
    if(val.set) {
      obj1.set = val.set
    }
    Object.defineProperty(obj, key, obj1);
  }
  class classDef extends HTMLElement {
    constructor() {
      super();
      if(constructor) {
        constructor.apply(this, Array.from(arguments));
      }
    }
  }
  var staticDef = definition.static;
  if(staticDef) {
    for(var key in staticDef) {
      if(typeof staticDef[key] === "object") {
        this.defProperty(classDef, key, staticDef[key]);
      } else {
        Object.defineProperty(classDef, key, {
          value : staticDef[key]
        });
      }
    }
    delete definition.static;
  }
  for(var key in definition) {
    if(typeof definition[key] === "object") {
      this.defProperty(classDef.prototype, key, definition[key]);
    } else {
      Object.defineProperty(classDef.prototype, key, { value : definition[key]});
    }
  }
  definition.static = staticDef[key];
  definition.constructor = constructor;
  if (document.readyState === "complete" || document.readyState === "interactive") {     
    // document is already ready to go
    customElements.define(customElementName,classDef);
  }
  else{
    Lyte.toBeRegistered.push({name:customElementName, def: classDef});
  }
}

function domContentLoaded1() {
  let comp = Lyte.toBeRegistered;    
  if(comp.length){    
      for(let j=0; j<comp.length;j++){
          customElements.define(comp[j].name, comp[j].def);    
      }    
      Lyte.toBeRegistered = [];    
  }
}


if(document.readyState === "complete" || document.readyState === "interactive") {
    domContentLoaded1();
} else {
    document.addEventListener("DOMContentLoaded", function(e){
        domContentLoaded1();
    },true);
}
Lyte.Router = {
  definitions : {}
};
(function _router(window) {
  window._router = _router;
  var newTransInfo,
  LR = Lyte.Router,
  dloc = document.location,
  trans,prevTrans,
  removeFromCache = [],
  Route,
  routeHash = {},
  decidedTrans,
  redirectIndex,
  removeIndex,
  listeners,
  reqFiles = {},
  availableTags = {},
  logger = 'route', 
  instance,
  historyObj,
  callOnError,
  removeTemplate = [],
  configurations = {},
  routeDef = {
    get : function(arr) {
      var routeObj = LR.definitions;
      arr.forEach(function(key)  {
        routeObj = routeObj[key];
      });
      return routeObj && routeObj.$ || undefined;
    },
    set : function(dir,value) {
      var cache = LR.definitions,
      dirLen = dir.length-1;
      dir.forEach(function(key,i) {
        if(dirLen === i) {
          if(cache[key]) {
            cache[key].$ = value;
          } else {
            cache[key] = {$ : value};
          }
        } else if(!cache[key])  {
          cache[key]={};
        }
        cache = cache[key];
      });
    }
  },

  listener = {
    history: false,

    init: function (fn, history) {
      var self = this;
      this.history = history;
      if (!listeners) {
        listeners = [];
      }

      function onchange(onChangeEvent) {
       listeners.forEach(function(listener)  {
         listener(onChangeEvent);
       });
      }
      // if ('onhashchange' in window && (document.documentMode === undefined || document.documentMode > 7)) {
        // if (this.history === true) {
            window.onpopstate = onchange;
        // } else {
          // window.onhashchange = onchange;
        // }
      // }
      listeners.push(fn);
      return;
    },
    
     addToHistory : function(obj) {
      var url;
      obj.fromHistory = obj.fromHistory == undefined ? false : obj.fromHistory;
      if (obj.url) {
        url = instance.history ? _delimit(shiftBaseURL(obj.url, true)) : '#'+_delimit(obj.url);
      }
      obj.title = obj.title || document.title;
      if (url) {
        window.history[obj.type](obj.data, obj.title, url);
      } else {
        window.history[obj.type](obj.data, obj.title);
      }
      delete obj.type;
      return obj;
    }
  };

  function Router(routes) {
    this.routes = routes;
    this.history = configurations.history == "html5" ? true : false;
    this.baseURL =  configurations.baseURL;
    this.deferInit = configurations.deferInit || false;
    return this;
  };

  LR.configureDefaults = function(options) {
    configurations = options || {};
  }; 

  LR.removeFromCache = function(arr) {
    arr = arr == "*" ? Object.keys(availableTags) : (Array.isArray(arr) ? arr : [arr]); 
    removeFromCache = removeFromCache.concat(arr);
    return;
  }

  LR.beforeRouteTransition = LR.afterRouteTransition = function() {};

   LR.configureRoutes = function (map) {
    instance = this.instance = new Router(typeof map == "function" ? parseRouteMapping.call(this, map) : map);
    window.addEventListener('DOMContentLoaded', function () { /* move this code outside.*/
      if(!instance.deferInit && LR.init) {
        LR.init();
        LR.init = undefined
      }
    });
  };

  LR.init = function() {
    instance.init();
    linkToRegistration();
  }

  function linkToRegistration() {
    class LinkTo extends HTMLElement {
      static get observedAttributes() {
        return ['lt-prop-route', 'lt-prop-dp', 'lt-prop-qp', 'lt-prop', 'lt-prop-class', 'lt-prop-id', 'lt-prop-rel', 'lt-prop-title', 'lt-prop-style', 'lt-prop-target']
      }
      attributeChangedCallback(attr, oldValue, newValue) {
        if(this.hasAttribute("lyte-rendered") && this._linkCreated) {
          let firstChild = this.children[0];
          //If attr is ltProp
          if(attr === "lt-prop") {
            this.handleLtProp();
            if(!this.hasAttribute("lt-prop-custom")) {
              this.setCustomAttributes(firstChild, true);
            }
            this.getMatchedObject();
            if(firstChild.tagName === "A") {
              this.constructHref(firstChild);
            }
          } 
          //if it is a route transition attribute
          else if(/^(lt-prop-route|lt-prop-dp|lt-prop-qp)$/.test(attr)) {
            this.getMatchedObject();
            if(firstChild.tagName === "A") {
              this.constructHref(firstChild);
            }
          }
          //for rest of the attributes
          else if(!this.hasAttribute('lt-prop-custom')) {
            firstChild.setAttribute(attr.substring(8), newValue);
          }
        }
      }
      connectedCallback() {
        this.ltProp = this.ltProp || {};
        if(this.hasAttribute("lyte-rendered")) {
        this._linkCreated = true;
        this.getMatchedObject();
        return;
        } 
        this.handleLtProp();
        let isCustom = this.hasAttribute("lt-prop-custom") || this.ltProp.custom,
        linkTag;
        if(isCustom) {
          //To set the matched object. 
          this.getMatchedObject();
          if(this.children[0].tagName === "A") {
            //update only href.
            this.constructHref(this.children[0]);
          }
        } else {
          linkTag = document.createElement("a");
          let length = this.childNodes.length;
            for(let i=0; i<length; i++) {
              linkTag.appendChild(this.childNodes[0]);
            }
            //update Href and other attributes to linkTag
            this.setCustomAttributes(linkTag);
            // sets Matched Obj in this and constructs href
            this.getMatchedObject();
            this.constructHref(linkTag);
            this.appendChild(linkTag);
        }
        this.setAttribute("lyte-rendered", "");
        this._linkCreated = true;
      }
      handleLtProp() {
        var ltProp = this.getAttribute("lt-prop");
        if(ltProp) {
          try{
            var jsonObj = JSON.parse(ltProp);
            this.ltProp = jsonObj;
          } catch(e) {
            console.warn("Error while parsing ltProp in link-to");
          }
        }
      }
      setCustomAttributes(linkTag, onlyLtProp) {
      for(let key in this.ltProp) {
        if(/^(id|class|style|target)$/.test(key)) {
            linkTag.setAttribute(key, this.ltProp[key]);
          }
      }
      if(!onlyLtProp) {
        var attrs = this.attributes;
        for(let i=0;i<attrs.length;i++) {
          let attrName = attrs[i].nodeName;
          if(attrName !== "lt-prop" && /^(lt-prop-id|lt-prop-class|lt-prop-style|lt-prop-target)$/.test(attrName)) {
            linkTag.setAttribute(attrName.substring(8), attrs[i].nodeValue);
          }
        }
      }
      }
      constructHref(linkTag) {
        let matched;
        if(matched = normalizeMatchedObj(this.matched)) {
          let href = constructURLFromRoute(matched);
          href = instance.history ?  shiftBaseURL(href,true) : "#" + href;
          linkTag.setAttribute("href", href); 
        }
      }
      getMatchedObject() {
        let matched = this.matched || {};
        matched.route = this.getAttribute("lt-prop-route") || this.ltProp.route;
        let dynamicParams = this.getAttribute("lt-prop-dp") || this.ltProp.dp || [],
        queryParams = this.getAttribute("lt-prop-qp") || this.ltProp.qp || {};
        if(!(dynamicParams instanceof Array)) {
          try{
            matched.dynamicParams = JSON.parse(dynamicParams) || [];  
          }catch(e) {
            console.error("Error while parsing dynamicParams in link-to.");
            matched.dynamicParams = []  
          }
        } else {
          matched.dynamicParams = [];
        }
        if(!(queryParams instanceof Object)) {
          try{
            matched.queryParams = JSON.parse(queryParams);
          } catch(e) {
            console.error("Error while parsing queryParams in link-to.");
            matched.queryParams = {};
          }
        } else {
          matched.queryParams = {}
        }
        this.matched = matched;
      }
    }
    customElements.define('link-to', LinkTo);
  }

  document.addEventListener("click", function(event) {
    if(event.button == 2) {
      return;
    }
    var targetElem = event.target || event.srcElement;
    while(targetElem) {
      if(targetElem.nodeName === "LINK-TO") {
        break;
      } else {
        targetElem = targetElem.parentNode;
      }
    }
    if(targetElem) {
      if(targetElem.children[0].tagName === "A" && (event.ctrlKey == true || event.metaKey == true || event.which == 2 || (targetElem.children[0].hasAttribute("target") && targetElem.children[0].getAttribute("target") !== "_self")) ) {
        return;  
      }
      event.preventDefault();
      var currentTransition = Lyte.Router.getRouteInstance().transition,
      transitionInstance;
      if(currentTransition && LR.checkIfSameRoute(targetElem.matched, currentTransition.info) && targetElem.hasAttribute("lt-prop-refresh-route")) {
          transitionInstance = LR.getRouteInstance(targetElem.getAttribute("lt-prop-refresh-route")).refresh(); 
      } else {
        transitionInstance = LR.transitionTo(targetElem.matched);
      }
      var transObj = {};
      if(targetElem.getAttribute("lt-prop-trans")) {
        try{
          transObj = JSON.parse("lt-prop-trans");  
        }
        catch(e) {
        }
      }

      transitionData = targetElem.getAttribute("lt-prop-td");
      transitionData = transitionData || transObj.data;
      if(transitionData) {
        if(typeof transitionData === "string") {
          try{
          transitionData = JSON.parse(transitionData);
          } catch(e) {
          }
        }
        transObj.data = transitionData;
      }
      for(var key in transObj) {
        transitionInstance[key] = transObj[key];
      }
    }
  },true);


  LR.checkIfSameRoute = function(transInfo1, transInfo2) {
    if(transInfo1.route == transInfo2.route && transInfo1.dynamicParams.length === transInfo1.dynamicParams.length && _compareObj(transInfo1.queryParams,transInfo2.queryParams)) {
      if(transInfo1.dynamicParams.length) {
        for(var i = 0; i <= transInfo1.dynamicParams.length; i++) {
          return transInfo1.dynamicParams[i] == transInfo2.dynamicParams[i];
        }
      }
      return true;
    }
    return false;
  }

  LR.addRoutes = function(map) { 
    Object.assign(this.instance.routes,parseRouteMapping.call(this,map));
  };
    
  function parseRouteMapping(map) {
    Lyte.time('parseRouteMapping')
    var routesObj = {},
    mapObj = {}, 
    pathStringArr = [], 
    routeStringArr = [], 
    pathString;
    this.route = function route(routeName,obj,nestedFn) {
      if(typeof obj == "object") {
        if(!obj.path) {obj.path = _delimit(routeName)};
        if(_presence(obj.path,"?")) {
          var split = obj.path.split('?');
          obj.defQP = Router.frameQueryParams(split[1]);
          obj.path = split[0];
        } else if(obj.queryParams) {
          obj.defQP = obj.queryParams;
          delete obj.queryParams;
        }
      } else {
        if(typeof obj == "function") {
          nestedFn = obj;
        }
        obj = {path : _delimit(routeName)};  
      }
      if(obj.path == '/') {
        mapObj = _getObj(pathStringArr,routeHash)[obj.path] = {$ : {}};
        pathStringArr.push('/');
      } else {
        var trimedPath = obj.path;
        mapObj = _getObj(pathStringArr,routeHash)[obj.path] = {$ : {}};
        if(dynamicRouteCheck(trimedPath) || wildcardRouteCheck(trimedPath)) {
          _splitPath(trimedPath).every(function(seg,index,arr) {
            if(dynamicRouteCheck(seg)) {
              obj.dynamicKey = mapObj.$.dynamicKey = seg.replace(":","");
              obj.dynamicIndex = mapObj.$.dynamicIndex = index;
              return false;
            } else if(wildcardRouteCheck(seg)) {
              obj.dynamicKey = mapObj.$.dynamicKey = seg.replace("*","");
              obj.dynamicIndex = mapObj.$.dynamicIndex = index;
              obj.wildcard = mapObj.$.wildcard = true;
              obj.sufix = mapObj.$.sufix = [];
              for(var indx=index+1;indx<arr.length;indx++){
                mapObj.$.sufix.push(arr[indx])
              }
              return false;
            }
            return true;
          });
        } else {
          obj.dynamicKey = mapObj.$.dynamicKey = undefined;
        }
        pathStringArr.push(trimedPath);
      }
      routeStringArr.push(routeName);
      mapObj.$.route = Array.from(routeStringArr);
      var routes = routesObj;
      routeStringArr.forEach(function(r,index) {
        if(index +1 != routeStringArr.length) {
          routes = routes[r]; 
        }
      });
      routes[routeName] = {$ : obj};
      if(nestedFn) {
        nestedFn.call(this,{});
      }
      routeStringArr.pop();
      pathStringArr.pop();
    }
    map.call(this,{});
    Lyte.time('parseRouteMapping')
    return routesObj;
  };

  LR.replaceWith = function() {
    var args = normalizeTransitionParams.apply(this,arguments);
    if(args) {
      args.replace = true;
      return routeTransition(args);  
    }
    
  }

  LR.transitionTo = function() {
    var matched;
    if(matched = normalizeTransitionParams.apply(this,arguments)) {
      return routeTransition(matched);  
    }
  }

  LR.getURL = function () {
    var url,matched;
    if(matched  = normalizeTransitionParams.apply(this,arguments)) {
      url = constructURLFromRoute(matched);
    }
    return instance.history ? shiftBaseURL(url, true) : url;
  };

  LR.getRoute = function(url) {
    var matched = traverse(shiftBaseURL(url),true);
    if(matched) {
      matched.dynamicParams = matched.dynamicParams.filter(function(e) {
         return e !== undefined;
      });
      matched.route = matched.route.join('.')  
    }
    return matched;  
  }  

  function routeTransition(matched) {
    if(matched) {
      decidedTrans = redirectIndex = undefined;
      var url,
      title;
      if(typeof matched == "object") {
        if(trans) {
          title = trans.title;
          var fromRedirect = trans.runLoop && trans.runLoop.current && trans.runLoop.current[0] && trans.runLoop.current[0].hook == "redirect";
          if(fromRedirect) {
            url = validateRedirect(matched);    
          } else {
            url = constructURLFromRoute(matched);
          }  
        } else {
          url = constructURLFromRoute(matched);
        }
      } else {
        console.warn('Not a valid route transition');
      }
      newTransInfo = {type : matched.replace ? "replaceState" : "pushState",url : url, title : title,fromHistory : false};
      Lyte.log('Transitioning to '+url,logger)
      if(!fromRedirect) {
        var processed;
        if(processed = setParamsInDef(matched)) {
          dispatch(url,processed);  
        } else {
          return;
        }
      }
      return trans.routeTrans;  
    } else {
      console.error('Transition tried without arguments.');      
    }
  };

  Router.prototype.init = function (r) {
    var self = this;
    this.handler = function(onChangeEvent) {
      var url;
      if(self.history) {
        url = LR.getLocation();
      } else {
        var newURL = onChangeEvent && onChangeEvent.newURL || dloc.hash;
        url = checkForEmptyPath(newURL.replace(/.*#/, ''));
      }
      historyObj = {fromHistory : true};
      if(onChangeEvent && history.state) {
        historyObj.data = history.state;
      }
      dispatch(url);
    };
    
    listener.init(this.handler, this.history);
    if(this.history) {
      if(LR.getLocation()) {
        this.handler();
      }   
    } else {
      historyObj = {fromHistory : true};
      dispatch(LR.getLocation());
    }
    return this;
  };

  LR.getLocation = function() {
    if(instance.history) {
      var path = checkForEmptyPath(dloc.pathname+dloc.search);
      path = shiftBaseURL(path);
      return _delimit(path);  
    } else {
      return _delimit(checkForEmptyPath(dloc.hash.replace(/^(#\/|#|\/)/, '')))
    }
  }

  function checkForEmptyPath(path) {
    if(!path) {
      listener.addToHistory({ type: "replaceState", title: document.title, url: (path = '/') });
    }
    return path;
  }

  function shiftBaseURL(path,append) {
    var baseURL = instance.baseURL;
    if(baseURL && path) {
      baseURL = _delimit(instance.baseURL);
      if(path.indexOf(baseURL) == 0 && !append) {
        return path.replace(baseURL,'');
      } else if(append && path.indexOf(baseURL) == -1) {
        return baseURL+path;
      } 
    } 
    return path;
    
  };

  function constructURLFromRoute(matched) {
    if(matched) {
      if(matched.route && !Array.isArray(matched.route)) {
        matched.route = matched.route.split('.');
      }
      var qp,
      url = '';  
      matched.route.forEach(function(route,index) {
        var queryParams,
        _route = matched.route.slice(0,index+1),
        routeObj = _getObj(_route,instance.routes);
        if(!routeObj) {
          console.error('There is no url mapped for the route "'+_route.join('.')+'".');
          return false;
        }
        var path = routeObj.$.path;
        if(queryParams = routeObj.$.defQP) {
          for(var key in queryParams) {
            if(matched.queryParams && !matched.queryParams.hasOwnProperty(key)) {
              matched.queryParams[key] = queryParams[key];
            } 
          };
        }
        if(routeObj.$.dynamicKey) {
          var dynamicPathSplit = _splitPath(path);
          if(!matched.dynamicParams || !matched.dynamicParams[index]) {
            console.error('Dynamic params for the route '+route+' is not defined.');
            return false;   
          } else {
            dynamicPathSplit[routeObj.$.dynamicIndex] = encodeURI(matched.dynamicParams[index]);
            url += _delimit(dynamicPathSplit.join('/')); 
          } 
        } else {
          url += _delimit(path);
        }
      });
      url = url[url.length-1] == '/' && url.length != 1  ? url.slice(0,-1) : url;
      qp = Object.keys(matched.queryParams).filter(function(key){
          return matched.queryParams[key] != undefined ? key : false;
        });
      if(matched.queryParams && qp.length) {
        url += '?';
        qp.forEach(function(key,index) {
          url+= key+'='+encodeURIComponent(matched.queryParams[key])+(index < qp.length-1 ? '&' : '');  
        });
      }
      return validateURL(url);
    }
  };

  function dispatch(path,processed) {
    Lyte.time('RouteTransition')
    if(trans && (trans.running || (prevTrans && trans != prevTrans))) {
      trans.abort();
    }
    LR.error = false;
    if(!processed) {
      processed = traverse(path);  
    }
    if(processed && processed.matched.route.length) {
      Lyte.time('constructRunLoop')
      invoke(processed);
      Lyte.time('constructRunLoop')
      processed.prevTrans = prevTrans;
      trans.runLoop = constructRunLoop(processed);
      setTimeout(function() {
        if(newTransInfo && trans.routeTrans.data) {
          newTransInfo.data = trans.routeTrans.data;
        }
        trans.run();
      },0);
    } 
    return;
  };



  function constructRunLoop(processed) {
    var basicHooks = ["beforeModel","model","afterModel","redirect","renderTemplate","afterRender"],
    currentRoutes = processed.currentRoutes,
    matched = processed.matched,
    prevTrans = processed.decidedTrans || processed.prevTrans,
    fromRedirect = processed.validateTransition,
    refreshRouteFrom = processed.refreshRouteFrom,
    sameTrans = true,
    similar = true,
    toRemove = true,
    templateToRemove,
    runLoop = [],
    forceFetch = [],
    req = [],
    b4Exit = [],
    willTransit = [],
    didTransit = [],
    leavingRoutes = [],
    matchedLen = matched.route.length,
    prevCurrentRoutes,prevCurrentRoute;

    if(refreshRouteFrom) {
      refreshRouteFrom = refreshRouteFrom.split('.');
      refreshRouteFrom.pop();
    }
    
    function pushBasicHooks(route,index) {
      if(!fromRedirect) {
        var routeCheck = prevTrans && prevTrans.currentRoutes && prevTrans.currentRoutes[index] && prevTrans.currentRoutes[index].routeName == route.routeName && (!refreshRouteFrom || refreshRouteFrom[index] == route.routeName);
        if(routeCheck && redirectIndex != undefined && index >= redirectIndex) {
          runLoop.push({hook : "redirect", index : index})
          if(index == redirectIndex) {
            ["renderTemplate","afterRender"].forEach(function(hook) {
              var obj = {};
              obj.hook = hook;
              obj.index = index;
              runLoop.push(obj);
            })
          }
        } else {
          req.push({hook : "getResources",index : index})
          req.push({hook : "getDependencies",index : index});
          basicHooks.forEach(function(hook) {
            var obj = {};
            obj.hook = hook;
            obj.index = index;
            if(route.forceFetch && !_presence(["redirect","renderTemplate","afterRender"],hook)) {
              forceFetch.push(obj);
              if(hook == "afterModel") {
                route._fetchStatus = "pending";
              }
            } else {
              runLoop.push(obj);
            }
          });
        }
      }
    }
    
    currentRoutes.forEach(function(currentRoute,index) {
      if(prevTrans) {
        prevCurrentRoutes = prevTrans.currentRoutes;
        prevCurrentRoute = prevCurrentRoutes[index];
        if(prevCurrentRoute && similar && prevCurrentRoute.routeName == currentRoute.routeName && prevTrans.routeInstances[index]._rendered && (!refreshRouteFrom || refreshRouteFrom[index] == currentRoute.routeName)) {
          function routeDiff() {
            pushBasicHooks(currentRoute,index);
            similar = false;
          }

          function pushRedirect() {
            if(!fromRedirect) {
              trans.routeInstances[index]._rendered = true;
              runLoop.push({hook : "redirect",index : index});  
            }
          }

          if((currentRoute._queryParams || currentRoute._dynamicParams) && !processed.ignore) {
            if(currentRoute._queryParams) {
              currentRoute.queryParams.forEach(function(key) {
                if((matched.queryParams || prevTrans.matched.queryParams) && matched.queryParams[key] != prevTrans.matched.queryParams[key] && similar) {
                  routeDiff()
                } 
              });
            }
            if(currentRoute._dynamicParams) {
              if(matched.dynamicParams[index] != prevTrans.matched.dynamicParams[index] && similar) {
                routeDiff()
              } 
            };
            if(similar) {
              pushRedirect()
            }
          } else {
            pushRedirect()
          }
        } else {
          similar = false;
          pushBasicHooks(currentRoute,index);
          if(prevCurrentRoute) {
            if(!sameTrans || prevCurrentRoute.routeName != currentRoute.routeName) {
              sameTrans = false;
              leavingRoutes.push(prevCurrentRoute);
              if(toRemove && prevTrans.routeInstances[index]._rendered) {
                templateToRemove = index;
                toRemove = false;
                if(fromRedirect) {
                  return index;
                }
              } else if(fromRedirect) {
                return index;
              }
            }
          }
        }
        if(matchedLen == index+1) {
          if(prevTrans.matched.route.length > matchedLen) {
            if(toRemove && prevTrans.routeInstances[index+1]._rendered) {
              templateToRemove = templateToRemove == undefined ? index+1 : templateToRemove;
            }
            leavingRoutes = leavingRoutes.concat(prevCurrentRoutes.slice(index+1));
          }
        }
      } else {
        pushBasicHooks(currentRoute,index)
      }
      var revIndex = currentRoutes.length-index-1;
      didTransit.push({hook : "didTransition",index : revIndex});
    });
    if(fromRedirect) {
      return templateToRemove;
    }
    if(prevTrans) {
      if(processed.decidedTrans) {
        leavingRoutes = instance.prevTransition.currentRoutes.slice(instance.prevTransition.leavingRoutesIndex+1);
      }
      var len = instance.prevTransition.currentRoutes.length;
      instance.prevTransition.currentRoutes.forEach(function(r,i) {
        willTransit.push({hook : "willTransition",index : len-i-1, route : r});
      });
      leavingRoutes.forEach(function(r,i){
        var revIndex = len-i-1;
        b4Exit.push({hook : "beforeExit",index : revIndex});
      }); 
    }
      
    runLoop = {previous : willTransit.concat(b4Exit), current : req.concat(runLoop).concat(didTransit),forceFetch : forceFetch};
    runLoop.current.removeTemplate = prevTrans && prevTrans.runLoop && prevTrans.runLoop.current && prevTrans.runLoop.current.removeTemplate;
    if(templateToRemove != undefined) {
      runLoop.current.removeTemplate = runLoop.current.removeTemplate || [];
      runLoop.current.removeTemplate.push({index : templateToRemove, routeInstances : prevTrans.routeInstances});  
    }
    return runLoop;
  }

  function invoke(processed) {
    instance.transition = trans =  new Transition(processed);
    trans.routeTrans = limitTransition(trans);
    trans.routeInstances = Router.initRoute(processed.matched);
    if(historyObj) {
      trans.routeTrans.data = historyObj.data;
      LR.beforeRouteTransition(prevTrans && prevTrans.routeTrans || undefined,trans.routeTrans,historyObj);
      trans.running = true;
      historyObj.data = trans.routeTrans.data;
      historyObj.type = "replaceState";
      listener.addToHistory(historyObj);
      historyObj = undefined;  
    } else if(trans.routeTrans.data) {
      listener.addToHistory({type : "replaceState", data : trans.routeTrans.data});
    }
  };

  function _getObj(arr,obj) {
    arr.every(function(key)  {
      if(obj && obj[key]) {
        obj = obj[key];
        return true;
      }
      return obj = false;
    });
    return obj;
  }

  function Transition(processed) {
    this.matched = processed.matched;
    this.target = processed.matched.target;
    this.info = {
      route : processed.matched.target,
      queryParams : processed.matched.queryParams,
      dynamicParams : processed.matched.dynamicParams.filter(_arrayClean)
    };
    this.currentRoutes = processed.currentRoutes;
    this.aborted = this.paused = false;
    this.abort = function() {
      if(!this.aborted) {
        if(this.runningPromise) {
          this.runningPromise.reject('aborted');  
        }
        if(this.constructor.name == "transition") {
          delete this.runLoop.current.removeTemplate;
        }
        this.aborted = true;

        transitionCompleted(this.currentPromise && this.currentPromise.hook == "willTransition")
      }
    }.bind(this);
    this.pause = function() {
      this.paused = trans.currentPromise;
      this.resume = this.routeTrans.resume = function(t) {
        t = t || this;
        if(t.runningPromise) {
          t.runningPromise.reject('aborted');
        }
        delete t.routeTrans.resume; 
        delete t.resume;
        var state = trans.paused.state;
        if(t.runLoop[state][0].hook ==  trans.paused.hook && t.runLoop[state][0].index == trans.paused.index) {
          t.runLoop[state].splice(0,1);  
        }
        t.paused = false;
        t.run();
      }.bind(this);
      return this.routeTrans;
    }.bind(this);
  }

  function getRequirements(object) {
    var req = object.req,
    cached,
    route = object.inst,
    hook = trans.currentPromise.hook,
    index = object.index,
    errorType = getRequirementsErrorType(req),
    currentRoute = object.currentRoute;
    return new Promise(function(resolve) {
      processRequirements(currentRoute[req], resolve);   
    }).then(function() {
      currentRoute[req+'Loaded'] = true;
      if(!currentRoute[errorType] || !currentRoute[errorType].length) {
        if(trans.pending && trans.pending[req] != undefined && trans.pending[req] == index) {
          trans.run();
        }
      } else {
        if(!trans.aborted) {
          if(!trans.paused) {
            trans.pause();  
          }
          callOnError(hook,index,currentRoute[errorType]);  
        }
      }         
    });

    function processRequirements(files, resolve) {
      if(!files) {
        resolve();
      } else {
        if(!Array.isArray(files)) {
          files = [files];
        }
        if(!files.length) {
          resolve();
        }
        var len = -(files.length);
        files.forEach(function(file) {
          if(typeof file == "string"){
            requestFile(file, availableTags[file], function() {
              loaded();
            });  
          } else if(Array.isArray(file)) {
            new Promise(function(r){
              processRequirements(file, r);
            }).then(function(){
              loaded();
            })
          } else {
            new Promise(function(r){
              processRequirements(file.parent, r);
            }).then(function(){
              new Promise(function(r1){
                processRequirements(file.child, r1)
              }).then(function(){
                loaded();
              })
            })
          }
        })
      }

      function loaded() {
        len++;
        if(len == 0){
          resolve();
        }
      }
      
      function requestFile(file,cached,resolve) {
        if(reqFiles[file]) {
          reqFiles[file].$.push({ type: req, index: index ,resolve : resolve});
        } else {
          reqFiles[file] = {$ : [{type : req, index : index}]};
          if(cached && cached.event.type != "error") {
            if(removeFromCache.indexOf(file) != -1) {
              removeFromCache.splice(removeFromCache.indexOf(file),1);
            }
            fileLoaded.call(cached.tag,cached.event,true);
            resolve();
          } else {
            Lyte.injectResources([file],fileLoaded, resolve);
          }
        }
      }

      function fileLoaded(event,cached) {
        var file = this.getAttribute('src') || this.getAttribute('href');
        if(!cached) {
            if(availableTags[file]) {
              availableTags[file].tag.remove();
            }
            this.onerror = this.onload = undefined;
            availableTags[file] = {tag : this, event : {type : event.type}};
        }
        requirements.set(file,event,cached);  
      }
    }
  }

  var requirements = {
    get : function(def,type) {
      return def[type+'Loaded'] != false;
    },
    set : function(file,event) {
      if(reqFiles[file]) {
        var respDetails = reqFiles[file].$;
        respDetails.forEach(function(resp) {
          var def = trans.currentRoutes[resp.index];
          if(resp.resolve) {
            resp.resolve();
          }
          if(event.type == "error") {
            var type = getRequirementsErrorType(resp.type);
            def[type] ? def[type].push(event) : (def[type] = [event]);
          }
        });
        delete reqFiles[file];
      }   
    }
  }

  var getRequirementsErrorType = function(type) {
    return type == "_dependencies" ? "_errorDependencies" : "_errorResources";
  } 

  function templateDelete(arr) {
    arr.forEach(function(obj) {
      for (var inst, i = obj.routeInstances.length - 1; i >= obj.index; i--) {
        inst = obj.routeInstances[i];
        if (inst.outlet) {
          if (inst.component) {
            inst.component._route = undefined;
          }
          Lyte.triggerEvent("beforeTemplateDestroy", inst.outletName, inst);
          inst.outlet.innerHTML = "";
        }
      }
    });
  }

  Transition.prototype.run = function() {
    var run = {},
    action,
    boundParams = params.bind(this);
      
    function params(index,model) { 
      return {queryParams : this.currentRoutes[index]._queryParams, 
              dynamicParam : this.currentRoutes[index]._dynamicParams}
    };

    run.getResources = run.getDependencies = function(hook,index) {
      var req = {getDependencies : "_dependencies",getResources : "_resources"},
      currentRoute = this.currentRoutes[index],
      callback = currentRoute[hook],
      routeInstance = this.routeInstances[index],
      require = callAction(callback,routeInstance,boundParams(index));
      currentRoute[req[hook]+'Loaded'] = callback ? false : true;
      if(callback && !this.aborted && !this.paused) {
        currentRoute[req[hook]] = require;
        getRequirements({inst : routeInstance, currentRoute : currentRoute, req : req[hook], index : index})
      }  
      
      return callHook();
    };

    run.beforeModel = run.model = run.afterModel =  function(hook,index) {
      return callHook(this.currentRoutes[index][hook],this.routeInstances[index],boundParams(index));
    };

    run.afterModel =  function(hook,index) {
      var routeInstance = this.routeInstances[index];
      return callHook(this.currentRoutes[index][hook],routeInstance,routeInstance.currentModel,boundParams(index));
    };

    callOnError = run.onError = function(hook,index,error) {
      var routeInstance = trans.routeInstances[index],
      resp;
      console.error('Error on '+hook+' of route '+routeInstance.routeName);  
      for(var action,i = trans.currentPromise.index;0 <= i;i--) {
        if(trans.currentRoutes[i].actions && (action = trans.currentRoutes[i].actions.onError)) {
          if(action.call(trans.routeInstances[i],error,trans.routeTrans,boundParams(index),hook) == false) {
            i = -1;
          }
        } 
      }
      if(trans.paused) {
        trans.abort();
      }
    }

    function callAction(callback,instance) {
      if(callback) {
        var hook = trans.currentPromise.hook,
        stopTrans = _presence(["getResources","getDependencies"],hook);
        try {
          return callback.apply(instance,Array.from(arguments).slice(2));
        } catch(err) {
          processError(stopTrans,err,instance);
          return;
        }  
      }
    }

    function processError(stopTrans,err,instance) {
      if(trans.currentPromise) {
        var hook = trans.currentPromise.hook,
        index = trans.currentPromise.index,
        state = trans.currentPromise.state;
        trans.pause();
        console.error(err);
        if(!stopTrans) {
          console.error('Error on '+hook+' of route '+instance.routeName);
          if(_presence(["willTransition","didTransition","beforeExit"],hook)) {
            trans.resume()
          } else {
            trans.abort();
          }
        } else {
          callOnError(hook,index,err);
        }  
      }
    }

    function callHook(callback,instance) {
      if(callback) { 
        var args = arguments,
        resp,
        hook = trans.currentPromise.hook, 
        stopTrans = _presence(["beforeModel","model","afterModel"],hook);
        return Promise.resolve(new Promise(function(resolve,reject) {
          try {
            resp = Promise.resolve(callback.apply(instance,Array.from(args).slice(2)));
          } catch(err) {
            processError(stopTrans,err,instance);
            return;
          }
          resp.then(function(data) {
            resolve(data);
          },function(err) {
            console.error(err);
            if(hook == "model") {
              instance.currentModel = err;
            } 
            processError(stopTrans,err,instance);
          });  
        }));
      } else {
        return Promise.resolve();
      }
    }

    run.redirect =  function(hook,index) {
      var routeInstance = this.routeInstances[index];
      return callHook(this.currentRoutes[index][hook],routeInstance,routeInstance.currentModel,boundParams(index));
    };

    run.afterRender = function(hook,index) {
      var routeInstance = this.routeInstances[index];
      routeInstance._rendered = true;
      return callHook(this.currentRoutes[index][hook],routeInstance,routeInstance.currentModel,boundParams(index),routeInstance.component);
    };
    
    run.willTransition = function(hook,index) {
      var prevCurrentRoute = prevTrans.currentRoutes[index];
      if(prevCurrentRoute.actions && (action = prevCurrentRoute.actions[hook]) && (callAction(action,prevTrans.routeInstances[index],trans.routeTrans) == false)) {
        removeHooks("previous",hook);
      }
      return callHook()
    };
    
    run.didTransition = function(hook,index) {
      var toCall;
      if(this.currentRoutes[index].actions && (action = this.currentRoutes[index].actions[hook]) && (callAction(action,this.routeInstances[index],boundParams(index)) == false)) {
        toCall = true;
        removeHooks("current",hook);
      }
      if(toCall || !index) {
        run.removeTemplate(trans.runLoop.current.removeTemplate);
        transitionCompleted();
      }
      return callHook();
    };

    run.beforeExit = function(hook,index) {
      var prevTransRouteInstance = prevTrans.routeInstances[index],
      callback = prevTrans.currentRoutes[index][hook];
      return callHook(callback,prevTransRouteInstance,prevTransRouteInstance.currentModel,params.call(prevTrans,index));
    };

    run.renderTemplate = function(hook,index) {
      var currentRoute = this.currentRoutes[index],
      routeInstance = this.routeInstances[index];
      if(trans.runLoop.current.removeTemplate && this.currentRoutes.length == index+1) {
        run.removeTemplate(trans.runLoop.current.removeTemplate)
      }
      if(this.currentRoutes[index][hook]) {
        var renderTemplate = callAction(currentRoute[hook],routeInstance,routeInstance.currentModel,params.apply(this,[index]));
        if(renderTemplate && trans.runLoop.current.removeTemplate) {
          run.removeTemplate(trans.runLoop.current.removeTemplate)
        }
        if(renderTemplate && renderTemplate.outlet) {
          routeInstance.outletName = renderTemplate.outlet;
          var data = routeInstance.currentModel,outlet,parentOutlet;
          if(outlet = getOutlet(renderTemplate.outlet,routeInstance.parent)) {
            if(renderTemplate.component) {
              var component;
              if(routeInstance.component && routeInstance.outlet == outlet && outlet.contains(routeInstance.component)) {
                component = routeInstance.component;
                component._route = routeInstance;
                routeInstance.outlet = outlet;
                routeInstance.component = component;
                setDataInComponent(component,data)
              } else {
                Lyte.triggerEvent("beforeTemplateDestroy", renderTemplate.outlet , routeInstance);
                outlet.innerHTML = '';
                component = document.createElement(renderTemplate.component);
                component._route = routeInstance;
                routeInstance.outlet = outlet;
                routeInstance.component = component;
                setDataInComponent(component,data)
                outlet.appendChild(component);
              }
            } else if(renderTemplate.html) {
              routeInstance.component = undefined;
              routeInstance.outlet = outlet;
              Lyte.triggerEvent("beforeTemplateDestroy", renderTemplate.outlet ,routeInstance);
              outlet.innerHTML = renderTemplate.html;
              var scripts = outlet.getElementsByTagName('script');
              if(scripts.length) {
                scriptExecution(Array.from(scripts),outlet);
              }
            }
          }
        }
      }
      return callHook();

      function setDataInComponent(component,data) {
        if(data) {
           if(typeof data == "object" && !Array.isArray(data)) {
            component.setData(data);
          } else {
            processError(true,new Error('Data provided for component is not valid.').stack,routeInstance)
          }   
        }
      }
      
      function getOutlet(outlet,parent) {
        var _outlet;
        if(parent) {
            _outlet =  parent.outletName ? document.querySelector(parent.outletName).querySelector(outlet) : undefined;
            if(!_outlet) { return getOutlet(outlet,parent.parent) }
        } else if(!(_outlet = document.querySelector(outlet))) {
          console.error('There is no outlet named ' +outlet+'.');
        }
        return _outlet;
      }

      function scriptExecution(scriptNode,elm) {
        for(var i=0,scrLen=scriptNode.length;i<scrLen;i++) {
          var currentScript = scriptNode[i],parent = currentScript.parentNode,
          s = document.createElement("script");
          for (var j = 0,attrLen = currentScript.attributes.length; j < attrLen ; j++) {
            s.setAttribute(currentScript.attributes[j].name, currentScript.attributes[j].value);
          }
          s.innerHTML = currentScript.innerHTML;
          parent.appendChild(s)
          parent.removeChild(currentScript)
        }
      }
    };
    
    run.removeTemplate = function(arr) {
      if (prevTrans && arr) {
        templateDelete(arr);
      }
      delete trans.runLoop.current.removeTemplate;
      if(removeFromCache.length) {
        removeFromCache.forEach(function(file) {
          if(availableTags[file]) {
            availableTags[file].tag.remove();
            delete availableTags[file];  
          }
        });
        removeFromCache = [];
      }
      return callHook();
    };

    processRunLoop.call(this);
    document.title = this.title = this.routeInstances[this.routeInstances.length-1].title || document.title;

    function processRunLoop() {
      this.pending = {};
      new Promise(function(resolve,reject) {
        this.runningPromise = {resolve : resolve, reject : reject};
        nestedPromises.call(this,this.runLoop,'previous',resolve);
      }.bind(this)).then(function() {
        if(newTransInfo) {
          LR.beforeRouteTransition((decidedTrans && decidedTrans.routeTrans || prevTrans && prevTrans.routeTrans || undefined),trans.routeTrans,newTransInfo);
          trans.running = true;
          newTransInfo.data = trans.routeTrans.data;
          listener.addToHistory(newTransInfo);
          newTransInfo = undefined;
        } else if(trans.routeTrans.data) {
          listener.addToHistory({data : trans.routeTrans.data,type : "replaceState"});
        }
        nestedPromises.call(this,this.runLoop,'current');
      }.bind(this),function(error) {
        if(error != 'aborted') {
          console.error(error)
          console.log('Promise is rejected');  
        }
      });
    }

    function removeHooks(type,hook) {
      var index;
      for(var i = 0;i < trans.runLoop[type].length;i++) {
        var obj = trans.runLoop[type][i];
        if(obj.hook == hook) {
          trans.runLoop[type].splice(i,1);
          i--;
        }
      }
    }

    function nestedForcedPromises(forcedLoop,resolve) {
      if(forcedLoop && forcedLoop.length) {
        var promise = forcedLoop[0],
        currentRoute = this.currentRoutes[promise.index],
        routeInstance = this.routeInstances[promise.index];
        promise.state = "forced";
        trans.currentPromise = promise;
        if(promise.hook == "beforeModel" && !requirements.get(routeInstance,'_dependencies')) {
          this.pending._dependencies = promise.index;
          return;
        }
        logCallbacks(promise);
        run[promise.hook].call(this,promise.hook,promise.index).then(function(data) {
          switch(promise.hook) {
            case "model":
              this.routeInstances[promise.index].currentModel = data;
              break;
            case "afterModel" : 
              currentRoute._fetchStatus = "completed";
              if(this.pending.forceFetch != undefined && this.pending.forceFetch == promise.index) {
                trans.run();
                // delete this.pending.forceFetch;
                // nestedPromises.call(this,this.runLoop,'current');
              }
              break;
          }
          forcedLoop.splice(0,1);
          nestedForcedPromises.call(this,forcedLoop);
        }.bind(this)); 
      }
    }

    function logCallbacks(promise) {
      var hook = promise.hook,
      index = promise.index;
      var route = promise.state == "previous" ? prevTrans.currentRoutes[index] : trans.currentRoutes[index];
      Lyte.log(hook +' of route '+route.routeName,logger,'MediumOrchid');  
    }
    
    function nestedPromises(loop,state,resolve) {
      var runLoop = loop[state];
      if(runLoop && runLoop.length) {
        var promise = runLoop[0],
        currentRoute = this.currentRoutes[promise.index],
        routeInstance = this.routeInstances[promise.index];
        if(!this.aborted && !this.paused) {
          if (promise.hook == "beforeModel" && !requirements.get(currentRoute,"_dependencies")) {
            this.pending._dependencies = promise.index;
            return;
          } else if(promise.hook == "renderTemplate" && !requirements.get(currentRoute,"_resources")) {
            this.pending._resources = promise.index;
            return;
          } else if(promise.hook == "redirect" && currentRoute.forceFetch && currentRoute._fetchStatus == "pending") {
            if(!this.forceFetchRunning) {
              nestedForcedPromises.call(this,this.runLoop.forceFetch);
              this.forceFetchRunning = true;
            }
            this.pending.forceFetch = promise.index;
            return;
          } else {
            promise.state = state;
            trans.currentPromise = promise;
            logCallbacks(promise);
            Lyte.time(promise.hook+promise.index)
            run[promise.hook].call(this,promise.hook,promise.index).then(function(data) {
              Lyte.time(promise.hook+promise.index)
              if(promise.hook == "model") {
                this.routeInstances[promise.index].currentModel = data;
              } 
              runLoop.splice(0,1);
              nestedPromises.call(this,loop,state,resolve);
            }.bind(this));
          }
        } 
      } else if(resolve) {
        resolve();
      }
    }
  }

  Router.frameQueryParams = function(url) {
    if(url && _presence(url,"=")) {
      var qp = {},params = _presence(url,"?") ? url.split("?")[1] : url;
      params = _presence(params,"&") ? params.split(/&/g) : [params];
      params.forEach(function(param) {
        var split = param.split('=');
        qp[split[0]] = split[1] ? decodeURIComponent(split[1]) : split[1];
      });
      return qp;
    } 
    return;    
  }

  Router.frameDynamicParams = function(url,matched) {
    if(url) {
      var routesObj = instance.routes,
      dynamicParam,
      framedDP = [],
      urlSplit = _splitPath(url.split('?')[0]);
      matched.route.forEach(function(r,i,arr) {
        routesObj = _getObj([r],routesObj);
        if(routesObj.$.wildcard) {
          if(routesObj.$.sufix.length) {
            var dp = urlSplit.slice(0,urlSplit.indexOf(routesObj.$.sufix[0]));
            framedDP.push(decodeURI(dp.join('/')));
            _pop(dp.concat(routesObj.$.sufix));
          } else {
            framedDP.push(decodeURI(urlSplit.join('/')));   
          }
          return; 
        } else if(routesObj.$.dynamicKey) {
          dynamicParam = urlSplit[routesObj.$.dynamicIndex];
          _pop(_splitPath(routesObj.$.path));
          framedDP.push(decodeURI(dynamicParam));
        } else {
          _pop(_splitPath(routesObj.$.path))
          framedDP.push(undefined);
        }
      });
      return framedDP;
      function _pop(path) {
        path.forEach(function() {
          urlSplit.shift();
        });  
      }
    }
  }

  function _presence(str,char) {
    return str.indexOf(char) != -1 ? true : false;
  }

  function transitionCompleted(reverseTrans) {
    if(trans.running) {
      Lyte.time('RouteTransition');
      reqFiles = {};
      trans.running = false;
      LR.afterRouteTransition(trans.routeTrans);
      window.$lr = LR.getRouteInstance();
      Lyte.log('Transition completed.',logger)
    }
    if(reverseTrans) {
      instance.prevTransition = instance.transition = trans = prevTrans;
    } else {
      instance.prevTransition = instance.transition = prevTrans =  trans;  
    }
  }

  function _arrayClean(r) {
    return r != undefined;
  }

  function _arrayUniquePush(arr,value) {
    if(!_presence(arr,value)) {
      arr.push(value);
      return true;
    }
    return false;
  }

  function _objContains(obj,key) {
    var exist = false;
    for(var k in obj) {
      if(k == key) {
        exist = true;
        break;
      }
    }
    return exist;
  }

  function _delimit(seg) {
    return seg[0] == "/"? seg : "/"+seg;
  }

  function _splitPath(path) {
    return path.match(/[^/?]+/g) || [];
  }

  function validateURL(url) {
    // url = url.replace(/\/$/, '')
    url = url.replace(/\/\//g,'/')
    url = url.replace(/\/\?/g,'?')
    return url;
  }

  function traverse(path,get) {
    if(!path) {
      console.error('path is not valid');
      return;
    }
    var url = path,selectedPaths = [],
    pathSplit = path.split('?'), 
    path = decodeURI(pathSplit[0]),
    params = pathSplit[1],
    pathSplitArr = _splitPath(path);
    if(path == '/') {
      if(_getObj(['/'],routeHash)) {
        selectedPaths.push([path]);  
      } else {
        console.error("url '"+path +"' is not defined in router");
        return;
      }
    } else {
      var pathLevel = 0,
      pathArrLevel = [0],
      exactMatch,
      matchedPath = [];
      matchedPath.dynamicParams = [];
      findPossibleMatch(routeHash);

      function checkArrayMatch(arr1,arr2,l,pathObj,matchedPath) {
        if(!(pathObj.$.wildcard || pathObj.$.dynamicKey)) {
          var prevObj;
          if(prevObj = _getObj(matchedPath,routeHash).$) {
            if(prevObj.wildcard) {
              var pathArr = arr2.slice(l);
              if(!(l += pathArr.indexOf(arr1[0]))) {
                return false;
              }  
            }
          }
        }
        for(var i = 0;i < arr1.length; i++,l++) {
          if(arr1[i] != arr2[l] && !dynamicRouteCheck(arr1[i])) {
            if(wildcardRouteCheck(arr1[i])) {
              if(pathObj.$.sufix.length) {
                l = arr2.indexOf(pathObj.$.sufix[0])-1; 
              }
            } else if(arr1[l] == '/') {
              l--;
            } else {
              return false;  
            }
          }
        }
        return l;
      }

      function findPossibleMatch(mapObj) {
        for(var mapPath in mapObj) {
          if(!exactMatch) {
            var pathObj = mapObj[mapPath],
            innerLevel;
            if(mapPath != "$") {
              var mapPathSplit = _splitPath(mapPath);
              if(mapPathSplit) {
                if((innerLevel = checkArrayMatch(mapPathSplit,pathSplitArr,pathLevel,pathObj,matchedPath)) !== false) {
                  pathArrLevel.push(innerLevel);
                  pathLevel = pathArrLevel[pathArrLevel.length-1];
                  if(pathSplitArr.length == pathLevel) {
                    var path = Array.from(matchedPath.concat(mapPath));
                    if(pathObj["/"]) {
                      path = path.concat('/');
                    }
                    selectedPaths.push(path);
                    if(pathObj.$.wildcard) {
                      pathArrLevel.pop()
                      pathLevel = pathArrLevel[pathArrLevel.length-1];
                    } else {
                      exactMatch = path;
                      return;  
                    }
                  } else {
                    var innerRoutes = Object.keys(pathObj);
                    matchedPath.push(mapPath);
                    if(pathSplitArr[pathLevel]) {
                      if(pathObj.$.wildcard && !pathObj.$.sufix.length && innerRoutes.length == 1) {
                        var wildcard = Array.from(matchedPath);
                        if(pathObj["/"]) {
                          wildcard = wildcard.concat('/');
                        }
                        selectedPaths.push(wildcard);
                      } else if(innerRoutes.length > 1) {
                        findPossibleMatch(pathObj);    
                      }
                    } 
                    matchedPath.pop();
                    pathArrLevel.pop()
                    pathLevel = pathArrLevel[pathArrLevel.length-1];
                  }
                }
              }
            }
          }
        }
      }
    }
    if(exactMatch) {
      return pathProcessor(get,exactMatch,path,params);
    } else if(selectedPaths.length == 1) {
      return pathProcessor(get,selectedPaths[0],path,params);
    } else if(selectedPaths.length) {
      var staticSegmentsInMatch = [],
      wildcardRoute,
      maxStaticSeg;
      for(var i = 0;i < selectedPaths.length;i++) {
        if(selectedPaths[i].length == 1) {
          wildcardRoute = selectedPaths[i];  
        }
        staticSegmentsInMatch.push(refine(selectedPaths[i]));
      }
      if(maxStaticSeg = Math.max(...staticSegmentsInMatch)) {
        return pathProcessor(get,selectedPaths[staticSegmentsInMatch.indexOf(maxStaticSeg)],path,params);
      } else if(wildcardRoute) {
        return pathProcessor(get,wildcardRoute,path,params);
      } else {
        console.error("url '"+path +"' is not defined in router");  
      }

      function refine(arr1) {
        arr1 = Array.from(arr1);
        var staticPath = 0;
        if(arr1[0] == "/") {
          staticPath++;
          arr1.shift();
        }
        var counter = -1;
        arr1.forEach(function(seg,i) {
          _splitPath(seg).forEach(function(innerSeg,j) {
            counter++;
            if(innerSeg == pathSplitArr[counter]) {
              staticPath++;
            }
          });  
        });
        return staticPath;
      }
    } else {
      console.error("url '"+path +"' is not defined in router");
    }

    function pathProcessor(get,selectedPaths,path,params) {
      var newURL,
      newMatched,
      matched = {};
      matched.route = _getObj(selectedPaths,routeHash).$.route;
      matched.queryParams = params ? Router.frameQueryParams(params) : {},
      matched.dynamicParams = Router.frameDynamicParams(path,matched);
      if(get) {return matched}
      var transInfo = setParamsInDef(matched);
      if(LR.error) {return false}
      newMatched = Lyte.deepCopyObject(transInfo.matched);
      newURL = constructURLFromRoute(newMatched);
      if(!_compareObj(newMatched.queryParams,matched.queryParams)) {
        historyObj = listener.addToHistory({type : "replaceState",data : window.history.state,title : document.title,url : newURL,fromHistory : true});
      }
      return transInfo;
    };
  };

  function setParamsInDef(matched) {
    var routeDef = LR.definitions,
    routesObj = instance.routes,
    currentRoutes = [];
    matched.target = "";
    matched._routes = [];
    matched.route.every(function(r,i) {
      matched.target = matched.target ? matched.target+'.'+r : r;
      routesObj = _getObj([r],routesObj);
      routeDef = _getObj([r],routeDef);
      if(!routeDef || !routeDef.$) {
        console.error('There is no route object for the route "'+matched.target+'"');
        LR.error = true;
        return false;
      }
      r = matched.target.split('.');
      matched._routes.push(r);
      var obj = routeDef.$;
      if(obj.queryParams) {
        obj._queryParams = {};
        obj.queryParams.forEach(function(key) {
            obj._queryParams[key] = matched.queryParams[key] != undefined ? matched.queryParams[key] : (routesObj.defQP && routesObj.defQP[key] ? routesObj.defQP[key] : undefined);
        });
      }
      obj._dynamicParams = matched.dynamicParams[i];
      return currentRoutes.push(obj);
    });
    if(LR.error) {return false;}
    return {currentRoutes : currentRoutes, matched : matched};
  };

  LR.registerRoute = function(dir,fns,options) {
    if(options && options.mixins) {
      if(!Array.isArray(options.mixins)) {
        options.mixins = [options.mixins]
      }
      options.mixins.forEach(function(mixin) {
        var regMixin = Lyte.registeredMixins[mixin];
        if(regMixin) {
          for(var key in regMixin) {
            fns[key] = regMixin[key];
          }           
        }
      });
    }
    fns._objPath = dir.replace(/\//g,'.');
    var dir = dir.split('.'),len = dir.length -1;
    fns.routeName = dir[len];
    routeDef.set(dir,fns);
  }

  function limitTransition(int) {
    var routeTrans = new transition(int);
    function transition(int) {
      var predefined = ['runLoop','paused','currentRoutes','routeInstances','aborted','currentPromise','run','pending'];
      for(var prop in int) {
        if(predefined.indexOf(prop) == -1) {
          if(prop == 'info') {
            this.info = deepCopyObject(int[prop]);
          } else {
            this[prop] = int[prop];  
          }
        }
      }
    }
    return routeTrans;
  }

  function dynamicRouteCheck(route) {
    return _presence(route,":") ? true : false;
  }

  function wildcardRouteCheck(route) {
    return _presence(route,"*") ? true : false;
  }
  
  function _compareObj(obj1,obj2) {
    var obj1keys = Object.keys(obj1),
    obj2keys = Object.keys(obj2);
    if(obj1keys.length != obj2keys.length) {
      return false;
    } else {
      for(var key in obj1) {
        if(obj1[key] != obj2[key]) {
          return false;
        }
      }
      return true;
    }
  }

  LR.getRouteInstance = function(routeName) {
    if(this.instance && trans && trans.routeInstances) {
      if(routeName == "*") {
        return trans.routeInstances;
      } else {
        routeName = routeName || trans.target;
        var match;
        trans.routeInstances.every(function(instance,index) {
          instance = trans.routeInstances[trans.routeInstances.length-1-index]
          if(instance._objPath == routeName) {
            match = instance;
            return false;
          }
          return true;
        });
        return match;
      }
    }
  }

  function normalizeTransitionParams(obj) {
    // To normalize argument for transition, returns matched obj from obj or native tranisitionTo argument.
    if(typeof obj == "object") {
      if(obj.route) {
        return normalizeMatchedObj(obj);
      }
    } else {
      var params = {};
      params.queryParams = {};
      params.dynamicParams = [];
      Array.from(arguments).forEach(function(arg,index) {
        if(Array.isArray(arg)) {
          console.error(JSON.stringify(arg)+' is not a valid argument.')
        } else {
          if(index == 0) {
            params.route = arg;
          } else if(typeof arg == "object") {
            params.queryParams = arg;
          } else {
            params.dynamicParams.push(arg);
          }  
        }
      });
      return normalizeMatchedObj(params);  
    }
  }

  function normalizeMatchedObj(obj) {
    // To construct dynamic params array.
    if(obj.route) {
      var matched = {}
      matched.route = obj.route.split('.');
      matched.queryParams = obj.queryParams || {};
      matched.dynamicParams = [];
      matched.target = "";
      matched._routes = [];
      var dynamicParams = obj.dynamicParams ? Array.from(obj.dynamicParams) : [];
      try {
        matched.route.forEach(function(route,index) {
          matched.target = matched.target ? matched.target+'.'+route : route;
          var r = matched.target.split('.');
          var routesObj = _getObj(matched.route.slice(0,index+1),instance.routes);
          matched._routes.push(r);
          if(routesObj) {
            matched.dynamicParams.push(routesObj.$.dynamicKey ? dynamicParams.shift() : undefined);
          } else {
            throw 'There is no url mapped for the route "'+matched.target+'".'
          }
        });
      } catch(e) {
        console.error(e);
        return false  
      }
      return matched;  
    }
  }

  Router.initRoute = function(matched) {
    var routeObj,
    len = matched.route.length,
    routeInstances = [],
    predefined = ["getResources","getDependencies","beforeModel","model","afterModel","redirect","renderTemplate","afterRender","beforeExit"];

    Route = function(fns,index,prevInstance)  {
      if(prevInstance) {
        for(var key in prevInstance) {
          if(_presence(["_queryParams","_dynamicParams","_rendered"],key)) {
            this[key] = fns[key];
          } else {
            this[key] = prevInstance[key];
          }
        }
        if(this.component) {
          this.component._route = this;
        }
      } else {
        for(var key in fns) {
          if(!_presence(predefined,key)) {
            this[key] = fns[key];
          } 
        };
      }
      this.parent = routeInstances[index-1];
      this.transition = trans.routeTrans;
      this.replaceWith = LR.replaceWith;
      this.transitionTo = LR.transitionTo;
      this.refresh = function() {
        trans.abort();
        var processed = {currentRoutes : trans.currentRoutes,matched : trans.matched, refreshRouteFrom : this._objPath};
        newTransInfo = {type : "replaceState",data : trans.data,title : document.title,fromHistory : false};
        dispatch(undefined,processed);
        return trans.routeTrans;
      }
      this.setTitle = function(title) {
        document.title = this.title = title;
      }
      this.getQueryParams = function() {
        return this._queryParams;
      }
      this.getDynamicParam = function() {
        return this._dynamicParams;
      }
      this.getRouteInstance = function(routeName) {
        return LR.getRouteInstance(routeName);
      }
      this.setQueryParams = function(key,value,refresh)  {
        var obj = {},
        matched = {};
        if(typeof key == "object") {
          for(var i in key) {
            obj[i] = key[i];
          }
          refresh = value;
        } else {
          obj[key] = value;
        }
        matched.route = Array.from(trans.matched.route);
        matched.dynamicParams = Array.from(trans.matched.dynamicParams);
        matched.queryParams = Object.assign({},trans.matched.queryParams,obj);
        if(!_compareObj(trans.matched.queryParams,matched.queryParams)) {
          var url = constructURLFromRoute(matched),
          processed = setParamsInDef(matched);
          processed.ignore = refresh == false;
          newTransInfo = { type: "pushState", data: trans.data, url: url, title: document.title, fromHistory: false };
          dispatch(url, processed);
        }
        return trans.routeTrans;
      }
      if(this.init) {this.init()}
      if(typeof LyteComponent !== "undefined") {this.throwEvent = LyteComponent.throwEvent}
    }

    var refMatch = decidedTrans || prevTrans,
    similarRoute = true;

    for(var i=0;i<len;i++) {
      routeObj = routeDef.get(trans.matched._routes[i]);
      if(!routeObj) {return false;}
      if(refMatch && similarRoute && refMatch.matched && refMatch.matched.route[i] == matched.route[i]) {
        routeInstances.push(new Route(routeObj,i,refMatch.routeInstances[i]))
      } else {
        routeInstances[i] = new Route(routeObj,i);
        similarRoute = false;
      }
    }
    return routeInstances;
  }

  function commonRouteCheck(matched,prev) {
    var j = prev.route.length;
    matched.route.every(function(r,i) {
      if(r == prev.route[i]) {
        return true;
      } else {
        j = i-1;
        return false;
      }
    });
    return j;
  }

  function decideTransition(processed) {
    if(prevTrans) {
      processed.validateTransition = true;
      processed.prevTrans = trans;
      removeIndex = constructRunLoop(processed);
      delete processed.validateTransition;
      if(removeIndex == undefined || removeIndex >= redirectIndex) {
        var currentTransCommonRoute = commonRouteCheck(processed.matched,trans.matched),
        prevTransCommonRoute = commonRouteCheck(processed.matched,prevTrans.matched);
        if(currentTransCommonRoute < prevTransCommonRoute) {
          redirectIndex = undefined;
          trans.leavingRoutesIndex = currentTransCommonRoute;
          processed.decidedTrans = prevTrans;
        }
      }
    }
  }

  function validateRedirect(newMatch) {
    var promise = trans.runLoop.current[0],
    url = constructURLFromRoute(newMatch),
    processed = setParamsInDef(newMatch);
    redirectIndex = promise.index;
    decideTransition(processed);
    dispatch(url,processed);
    return url;
  }
})(window);
if(!window.Lyte) {
    console.error("Lyte is not defined");
}
window.isIE11Lyte = false;
window.isEdgeLyte = false;
window.replaceWithNeeded = false;
//temporary fix for IE 11
if(navigator.userAgent.match(/rv:11/)) {
	window.isIE11Lyte = true;
    window.action = function() {
        return;
    }
}
if(navigator.userAgent.match('Edge')) {
    window.isEdgeLyte = true;
}

if(window.isIE11Lyte || window.isEdgeLyte) {
	var doc = document.createDocumentFragment();
	doc.appendChild(document.createTextNode("  dummy "));
	doc.childNodes[0].replaceWith(document.createTextNode("changed"));
	if(doc.childNodes[0].textContent !== "changed") {
		window.replaceWithNeeded = true;
	}
}

Lyte.Component = {};
Lyte.arrayUtils =  function() {
    return LyteComponent.arrayFunctions.apply(LyteComponent, arguments);
};
Lyte.objectUtils =  function() {
    return LyteComponent.objectFunctions.apply(LyteComponent, arguments);
}

Lyte.Component.register = function() {
    LyteComponent.registerComponent.apply(LyteComponent, arguments);
}

Lyte.Component.registerHelper = function() {
    LyteComponent.registerHelper.apply(LyteComponent, arguments);
}
Lyte.Component.set = function() {
    LyteComponent.set.apply(LyteComponent, arguments);
}
Lyte.Component.registeredHelpers = {};
Lyte.Component.registeredComponents = {};
function noop() {

}
Lyte.Component.registerCustomPropHandler = function(propName) {
    let dasherized = LyteComponent.String.dasherize(propName);
    propName = LyteComponent.String.toCamelCase(propName);
    if(LyteComponent.customPropHandlers.indexOf(propName) === -1) {
        LyteComponent.customPropHandlers.push(propName);
        customElementPrototype.prototype[propName] = function() {
            let argsLength = arguments.length;
            let arg0 = arguments[0];
            if(!arg0) {
                //Read all the values
                let obj = {};
                for(let key in this.component.data) {
                    if(key.startsWith(propName)) {
                        let objKey = key.substring(propName.length);
                        objKey = LyteComponent.String.lowerCaseFirstLetter(objKey);
                        obj[objKey] = this.component.data[key];
                    }
                }
                return obj;
                
            } else if(typeof arg0 === "string") {
                if(argsLength > 1) {
                    //Set a value
                    this.set(propName+ LyteComponent.String.upperCaseFirstLetter(arg0), arguments[1]);
                } else {
                    //Read a value
                    let actKey = propName + LyteComponent.String.upperCaseFirstLetter(arg0);
                    return this.component.data[actKey];
                }
            } else if(typeof arg0 === "object") {
                //Write a set of values
                for(let key in arg0) {
                    let objKey = propName + LyteComponent.String.upperCaseFirstLetter(key);
                    this.set(objKey, arg0[key]);
                }
            }
        }
        LyteComponent.customPropRegex = new RegExp("^(" + LyteComponent.customPropHandlers.join("|")+ ")");
    }
}
Lyte.Component.unregisterComponent = function(componentName) {
    if(Lyte.Component.registeredComponents[componentName]) {
        var comp = LyteComponent._registeredComponents[componentName];
        if(comp.activeInstances > 0) {
            console.warn("There are active instances of the component " + componentName + " and hence cannot be unregistered");
        } else {
            //Do the unregisteration here
            comp._properties = {};
            comp.component = null;
            comp._mixins = null;
            comp._actions = null;
            comp._template = null;
            comp._dynamicNodes = null;
            comp._callBacks = {};
            comp._observers = [];
            comp._data = undefined;
            comp._methods = {};
            comp.prototype.get = noop;
            comp.prototype.set = noop;
            delete Lyte.Component.registeredComponents[componentName];
        }
    } else {
        console.warn("Component "+ componentName + " not yet registered");
    }
}
    
var elementPrototype = typeof HTMLElement !== "undefined" ? HTMLElement : Element;



function onDomContentForLyte() {
    if(!window.isIE11Lyte){
        document.body.appendChild(LyteComponent.lyteComponentsDiv);
        if(LyteComponent.needDummyComponentsDiv) {
          document.body.appendChild(LyteComponent.dummyLyteComponentsDiv);  
        } else {
          LyteComponent.dummyLyteComponentsDiv.remove();
          LyteComponent.dummyLyteComponentsDiv = undefined;
        }
    }
    document.head.appendChild(LyteComponent.styleDiv);
    let bodyEvents = ["focus","focusin","focusout","resize","scroll","click","dblclick","mousedown","mouseup","mousemove","mouseover","mouseout","mouseenter","mouseleave","change","select","submit","keydown","keypress","keyup","contextmenu"];    
    for(let i=0; i<bodyEvents.length; i++){    
        var evnt = bodyEvents[i];    
        document.body.addEventListener(evnt,globalEventHandler, true);    
    }    
    let comp = LyteComponent.toBeRegistered;    
    if(comp.length){    
        for(let j=0; j<comp.length;j++){
            customElements.define(comp[j].name, comp[j].def);    
        }    
        LyteComponent.toBeRegistered = [];    
    }
}

document.addEventListener("change", function(event) {
	var target = event.target || event.srcElement;
	if(!target._attributeDetails) {
		return;
	}
	var attributeName = "value";
	if(target.type === "checkbox" || target.type=== "radio") {
		attributeName = "checked";
	}
	let contextSwitchArray = [];
	var attrNode ;
	var attrDetail = target._attributeDetails[attributeName]
	if(!attrDetail || !attrDetail.isLbind) {
		return;
	}
	//attrNode = (attributeName === "checked") ? target._attributeDetails[attributeName].bindedNode : target.getAttributeNode(attributeName);
	var callee = target;
	if(!target._callee){
		while(callee && !LyteComponent.isCustomElement(callee) && callee.tagName !== "LYTE-YIELD") {
			if(callee.tagName === "BODY") {
				callee = null;
				break;
			}
			callee = callee.parentNode;
		}
		if(callee && callee.tagName === "LYTE-YIELD"){
			target._callee = callee._callee._callee;
		} else {
			target._callee = callee;
		}
	}
	let self = target._callee;
	if(target) {
		LyteComponent.newAddContext(target, contextSwitchArray);
	}
	let obj = LyteComponent.getNew(self.component.data, attrDetail.dynamicValue);
	LyteComponent.set(obj.context, obj.lastKey, target[attributeName]);
	if(target) {
		LyteComponent.newRemoveContext(target, contextSwitchArray);
	}		
});
var globalEventHandler = function(ev){
	var evnt = ev.type;
	var target = ev.target,toRemove;
	if(!window.event){
		toRemove = true;
		window.event = ev;
	}
	while((target.getAttribute && !target.getAttribute(evnt)) && target.tagName != "BODY"){
		target = target.parentNode;
	}
 	var callee = target;
	if(!target._callee){
		while(callee && !LyteComponent.isCustomElement(callee) && callee.tagName !== "LYTE-YIELD") {
			if(callee.tagName === "BODY") {
				callee = null;
				break;
			}
			callee = callee.parentNode;
		}
		if(callee && callee.tagName === "LYTE-YIELD"){
			target._callee = callee._callee._callee;
		} else {
			target._callee = callee === target ? undefined : callee;
		}
	}
	if(target._evBoundEvents && target._evBoundEvents[evnt]) {
        //Not needed - but check and remove
		let actions = target._callee? target._callee.constructor._actions : target.constructor._actions ;
        //let actions = target.constructor._actions;
		let actObj = target._evBoundEvents[evnt];
        let cloneActObj = Lyte.deepCopyObject(actObj);
		cloneActObj.args.shift();
		LyteComponent.throwAction.call(target,target,evnt,cloneActObj, undefined, undefined, target, ev);
	} else if(target.getAttribute(evnt)){
		let actions = target._callee.constructor._actions;
		let func = target.getAttribute(evnt).split(" => ")[1];
		let actObj = target._boundEvents[evnt];
		let cloneActObj = Lyte.deepCopyObject(actObj);
		cloneActObj.args.shift();
		LyteComponent.throwAction.call(target._callee,target._callee,evnt,cloneActObj, undefined, undefined, target, ev);
	}
	if(target.tagName === "LABEL"){
		var input = target.querySelector("input");
		if(input.getAttribute(evnt)){
			let actions = target._callee.constructor._actions;
			let func = input.getAttribute(evnt).split(" => ")[1];
			//	let actObj = target._callee.constructor.getHelper(func);
			let actObj = target._boundEvents[evnt];
			let args = Array.from(actObj.args);
			let cloneActObj = Object.assign({},actObj);
			args.shift();
			cloneActObj.args = args;
			LyteComponent.throwAction.call(target._callee,target._callee,evnt,cloneActObj, undefined, undefined, input,ev);
		}
	}
	if(toRemove){
		window.event = undefined;
	}
}

class LyteYield extends HTMLElement{
	disconnectedCallback(){
		if(LyteComponent.ignoreDisconnect) {
		    return;
		}
		var nodeContextSwitchArray = [];
		LyteComponent.newAddContext(this, nodeContextSwitchArray);
		LyteComponent.removeSelectedBindingDeep(this._properties, this.component.data);
		let node = this._registerYield;
		if(!node) {
		return;
		}
		var toAppendContextSwitchArray = [];
		//newContext not needed
        var del = "delete";//for ie 11.0
		LyteComponent.newAddContext(node, toAppendContextSwitchArray);
		for(let key in this._dynamicProperty) {
			if(this._dynamicProperty[key].isActualNode) {
				this._dynamicProperty[key].isActualNode._helperNodes[del](this);
			}else {
				if(node._callee.getProperty(key)._helperNodes) {
					node._callee.getProperty(key)._helperNodes[del](this);
				}
			}
		}
		this._dynamicProperty = {};
		for(let i=0;i<this._helpers.length;i++) {
			node._callee.removeHelpers(this._helpers[i]);
		}
		this._helpers = [];
		LyteComponent.newRemoveContext(node, toAppendContextSwitchArray);
		LyteComponent.newRemoveContext(this, nodeContextSwitchArray);
	}
	getProperty(key) {
        	let arr = key.split('.');
        	let property = this;
        	if(!property._properties[arr[0]]) {
            		property._properties[arr[0]] = {};
       	 	} 
       	 	property = property._properties[arr[0]];
        
        	Object.defineProperty(property, '_path', {enumerable: false, value : arr[0]});
        	for(let i=1;i<arr.length;i++) {
            		if(!property[arr[i]]) {
                		property[arr[i]] = {};
                		Object.defineProperty(property[arr[i]], '_path', {enumerable: false, value : property._path + "." + arr[i]});
           	 	}
            	property = property[arr[i]];
       	 	}
       		return property;
    	}
}

customElements.define("lyte-yield", LyteYield);

class customElementPrototype extends elementPrototype{
    constructor() {
        super();
        if(!Lyte.Component.registeredComponents[this.localName]) {
        	return;
        }
        this.constructor.activeInstances++; 
        this.component = new this.constructor.component();
        this.data = {};
        this._properties = {};
        this.component.methods = {};
//        this.component.data = this.constructor._data ? this.constructor._data() : {};
        //comment the following two when return cli update is done.
        this.component.data = {};
        let data = this.constructor._data ? this.constructor._data() : {};
        var def = "default";
        for(let key in data) {
            this.component.data[key] = data[key][def];
        }
        this.component.data.errors = {};
        this.component.__data = data;
        for(let key in this.constructor._methods) {
            this.component.methods[key] = this.constructor._methods[key];
        }
        Object.defineProperty(this.component.data, '__component__', {
        	value : this,
        	configurable : true,
        	writable: true,
            enumerable : false
        });
        this.component.$node = this;
        this.callback("constructor");
        this._actions = this._actions ? this._actions : {};
        this._callee = this._callee || this.getCallee(this.parentNode);
    }
    getMethods(arg0) {
        return this.component.getMethods(arg0);
    }
    setMethods(arg0, arg1) {
        return this.component.setMethods(arg0, arg1);
    }
    getData(arg0) {
        return this.component.getData(arg0);
    }
    setData(arg0, arg1) {
        return this.component.setData(arg0, arg1);
    }
    getCallee(callee){
        while(callee &&  !LyteComponent.isCustomElement(callee) && callee.tagName !== "LYTE-YIELD") {
            if(callee.tagName === "BODY") {
                callee = null;
                break;
            }
            callee = callee.parentNode;
        }
        if(callee && callee.tagName === "LYTE-YIELD") {
        return callee._callee._callee;
        }
        return ((this ===  callee) ? undefined : callee);
    }
    afterConnected() {
        //initProperties is used because, we may have cases where the component wouldn't have been registered but 
        //it would be in dom already with some attributes. In those cases we can store the data in _initProperties as key, value.
        //These properties would then be applied to the component, once it gets instantiated. 
        
        //This is done, in order to solve when on a string value update of an if helper, the binding in the true or false case must be established. 
        //Without this, we won't establish the _properties in the component to the actual Data. 
        
        let obsattr = this.constructor._observedAttributes;
        for(let i=0;i<obsattr.length;i++){
            let key = obsattr[i];
            let prop = this.getProperty(key);
            Object.defineProperty(prop, '__fromComponent', {
            	value : true,
                enumerable : false
            });
        }
        this.getProperty("errors");
        if(this._initProperties) {
            let initProperties = this._initProperties;
            for(let key in initProperties) {
                if(this.component.__data[key] && typeof initProperties[key] === "string" && this.component.__data[key].type !== "string") {
                    var obj = {"newValue" : initProperties[key], "dataType" : this.component.__data[key].type, "attr" : key, "tagName" : this.tagName};
                    if(LyteComponent.getProperData(obj)) {
                        this.component.data[key] = obj.newValue;
                    }    
                } else {
                    this.component.data[key] = initProperties[key];
                }
            }
            this._initProperties = undefined;
        }
        if(this._initMethods) {
            let initMethods = this._initMethods;
            for(let key in initMethods) {
                this.component.methods[key] = initMethods[key];
            }
            this._initMethods = undefined;
        }
        this.callback('init');
        this.onCallBack('init');
        this.registerYields();
        let content = this.renderNodes(this.constructor._template.content, this.constructor._dynamicNodes,undefined,undefined, undefined, undefined, this.constructor._templateContent);
        return content;
    }
    //This is the function where the actual rendering takes place. 
    //It takes the template, finds the actual dynamic nodes uwing dynamicNodes argument and then binds each node with the associated
    //property by calling bindNode. 
    getDynamicNode(content, positions){
        let dynamicN = content;
        for(var i=0; i<positions.length; i++){
            dynamicN = (dynamicN.tagName != "TEMPLATE" || window.isIE11Lyte) ? dynamicN.childNodes[positions[i]] : dynamicN.content.childNodes[positions[i]];
        }
        return dynamicN;
    }
    //RN
    renderNodes(toAppend, dynamicNodes, helperNode, options, establishBindings, returnVal, templateContent) {
        options = options || {};
        let content;
        /*if(window.isIE11Lyte){
            let newFrag = toAppend.cloneNode(true, "lyte");
            this.constructor.splitTextNodes(newFrag);
            content = newFrag;
        }
        else{
            content = toAppend.cloneNode(true, "lyte");
        }*/
        if (window.isIE11Lyte || window.isEdgeLyte) {
	        var div = document.createElement("div");
	        div.innerHTML = templateContent;
	        content = div.childNodes[0];
	        window.timer++;
	        this.constructor.splitTextNodes(content);
        } else {
        	content = toAppend.cloneNode(true, "lyte");
      	}
        let updateHelpers = [],processLast = [],helperFunc,stoppedNode;
        for(let i=0;i<dynamicNodes.length;i++) {
            let info = dynamicNodes[i], type = info.type, pos = info.position, dynamicN = content, helperInfo;
            dynamicN = this.getDynamicNode(dynamicN,pos);
            if(type ===  "componentDynamic") {
            	if(options.node) {
            		dynamicN._contextSwitchInfo = options;
            	} else if(helperNode) {
            		dynamicN._contextSwitchInfo	= helperNode._contextSwitchInfo;
            	}
            } 
            else if(type === "text"){
                 this.bindNode(dynamicN, undefined, helperNode, options, dynamicNodes[i], processLast, establishBindings);
            }
            else if(type === "attr"){
            	dynamicN._attributeDetails = info.attr;            	
                if(dynamicN.nodeName === "LYTE-YIELD") {
                    dynamicN._callee = this;
                    dynamicN.component = {}
                    dynamicN.component.data = {};
                    Object.defineProperty(dynamicN.component.data, "__component__", {
                    	value : dynamicN,
                    	configurable : true,
                    	writable : true,
                        enumerable : false
                    });
                    dynamicN._properties = {};
                    for(let j=0;j<dynamicN.attributes.length;j++) {
                        let attr = dynamicN.attributes[j];
                        if(attr.nodeName !== "is" && attr.nodeName !== "yield-name") {
                            dynamicN._properties[LyteComponent.String.toCamelCase(attr.nodeName)] = {};
                        }
                    }
                }
                let toBeRemoved = [];
				for(let key in info.attr) {
                	let attr = info.attr[key];
                	let attrName = key;
                    if(attr && (attr.dynamicValue || attr.helperInfo)) {
                       if(options.node) {
                                dynamicN._contextSwitchInfo = options;
                            }
                            else if(helperNode) {
                                dynamicN._contextSwitchInfo = helperNode._contextSwitchInfo;
                          }
			 if(attr.globalEvent) {
                            dynamicN._boundEvents = dynamicN._boundEvents || {};
                            let actionName = attr.helperInfo.args[0];
                            let boundName;
                            if(actionName.startsWith('"') || actionName.startsWith("'")) {
                                boundName = actionName.substring(1, actionName.length - 1);
                            } else {
                                console.warn("Deprecation warning. Action name " + actionName + " must be in quotes");
                                boundName = actionName;
                            }
                            dynamicN._boundEvents[attrName] = {"name" : boundName, "args" : attr.helperInfo.args};
                        } else {
                            /*this.bindNode(dynamicN.getAttributeNode(attrName), toBeRemoved, helperNode, options, attr, undefined, establishBindings);
                             */
                            if(!dynamicN.hasAttribute(attrName)) {
                                dynamicN.setAttribute(attrName, "{{dummy}}");
                            }
                        	var node = this.bindNode(dynamicN.getAttributeNode(attrName), toBeRemoved, helperNode, options, attr, undefined, establishBindings);
                            if(node !== dynamicN.getAttributeNode(attrName)) {
                            	dynamicN._removedAttributes = dynamicN._removedAttributes || {};
                            	dynamicN._removedAttributes[attrName] = node;
                            }
                        }
                    }
                }
                //Added now
                if(info.attr && Object.keys(info.attr).length) {
                	dynamicN._callee = this;
                }
                for(let d=0;d<toBeRemoved.length;d++) {
                    dynamicN.removeAttribute(toBeRemoved[d]);
                }
            }
            else if(/^(for|forIn|component)$/.test(type)){
            	if(options.node) {
            		dynamicN._contextSwitchInfo = options;
            	} else if(helperNode) {
            		dynamicN._contextSwitchInfo	= helperNode._contextSwitchInfo;
            	}
                dynamicN._dynamicNodes = info.dynamicNodes;
                if(window.isIE11Lyte || window.isEdgeLyte) {
                    dynamicN._templateContent = info.templateContent;  
                }
                let returnVal;
                switch(type) {
                case "for" : 
                	returnVal = this.updateForHelper(dynamicN,{"type" : "default"} , options.node? options : undefined);
                	break;
                case "forIn" : 
                	returnVal = this.updateForInHelper(dynamicN,{"type" : "default"} , options.node? options : undefined);
                	break;
                case "component" : 
                	returnVal = this.updateDynamicComponent(dynamicN, false, options.node ? options : undefined);
                }
                if(returnVal) {
                	updateHelpers.push(returnVal);
                }
            }
            else if(/^(if|switch)$/.test(type)){
                var def ="default";
                dynamicN._cases = info.cases; 
                dynamicN._default = info[def];
                if(options.node) {
            		dynamicN._contextSwitchInfo = options;
            	} else if(helperNode) {
            		dynamicN._contextSwitchInfo	= helperNode._contextSwitchInfo;
            	}
                let returnVal = this.updateSwitchHelper(type, dynamicN, options.node ? options : undefined, undefined, establishBindings);
                if(returnVal) {
                	updateHelpers.push(returnVal);
                	let isBreak = returnVal.toAppendMain.querySelector("template[is=break]");
                	if(isBreak) {
                		dynamicN._isStopped = "break";
                		content = this.constructor.getTrimmedContent(content, info.position,undefined);
                		stoppedNode = info.position;
                		break;
                	}
                	let isContinue = returnVal.toAppendMain.querySelector("template[is=continue]");
                	if(isContinue) {
                		dynamicN._isStopped = "continue";
                		content = this.constructor.getTrimmedContent(content, info.position,undefined);
//                		stoppedNode = info.position;
                		break;
                	}
                }
            } else if(type === "registerYield") {
                dynamicN._dynamicNodes = info.dynamicNodes;
                if(window.isIE11Lyte || window.isEdgeLyte) {
                    dynamicN._templateContent = info.templateContent;  
                }
//                updateHelpers.push(dynamicN);
                if(options.node) {
                    dynamicN._contextSwitchInfo = options;
                }
                else if(helperNode) {
                    dynamicN._contextSwitchInfo = helperNode._contextSwitchInfo;
                }
                //Added now                
                dynamicN._callee = this;
            } else if(type === "insertYield") {
            	if(options.node) {
            		dynamicN._contextSwitchInfo = options;
            	} else if(helperNode) {
            		dynamicN._contextSwitchInfo	= helperNode._contextSwitchInfo;
            	}
                dynamicN.component = dynamicN.component || {"data" : {}};
                dynamicN._properties = dynamicN._properties || {};
                this.updateYield(dynamicN, false, options.node? options : undefined);
            }
        }
        for(let i=0;i<processLast.length;i++) {
             let dynamicPosition = processLast[i].dynamicPositions;
                 let processNode = dynamicPosition.initialNode;
                 let nodeValue = dynamicPosition.dynamicNodeValue;
                 let childLen = nodeValue.childNodes.length;
                 if(!childLen) {
                    nodeValue.appendChild(document.createTextNode(""));
                        childLen = 1;
                 }
                 let startingNode = nodeValue.childNodes[0];
                 if(window.replaceWithNeeded && processNode.parentNode.nodeName === "#document-fragment") {
                 	while(nodeValue.childNodes.length) {
                 		processNode.parentNode.insertBefore(nodeValue.childNodes[0],processNode);
                    }
                 	processNode.remove();
                 } else {
                	 processNode.replaceWith.apply(processNode,nodeValue.childNodes);
                 }
                 processLast[i].dynamicPositions = {startingNode : startingNode, length: childLen}
        }
        if(stoppedNode) {
        	returnVal = returnVal || {};
        	returnVal.stop = true;
        }
        if(helperNode) {
            if(options.type) {
                helperNode._helpers[options.itemIndex] = updateHelpers;
                if(window.isIE11Lyte || window.isEdgeLyte) {
                    content = this.constructor.createDocFragment1(content);  
                }
                return content;
            } else {
                helperNode._helpers = updateHelpers;
                if(window.isIE11Lyte || window.isEdgeLyte) {
                    content = this.constructor.createDocFragment1(content);  
                }
                return content;
            }
        }
        this.executeBlockHelpers(updateHelpers);
        if(window.isIE11Lyte || window.isEdgeLyte) {
            content = this.constructor.createDocFragment1(content);  
        }
        return content;
    }

    executeBlockHelpers(updateHelpers, node) {
	    for(let i=0;i<updateHelpers.length;i++) {
	    		updateHelpers[i].lastNode.parentNode.insertBefore(updateHelpers[i].toAppendMain, updateHelpers[i].lastNode);
	    		updateHelpers[i] = updateHelpers[i].lastNode;
	    		//updateHelpers[i]._parentIf = node;
//	    		if(!updateHelpers[i]._contextSwitchInfo && node) {
//	    			updateHelpers[i]._contextSwitchInfo = node._contextSwitchInfo;
//	    		}
	    }	
    }
    
    updateBlockHelpers(updateHelpers,contextSwitchInfo){
        for(let i=0;i<updateHelpers.length;i++) {
            switch(updateHelpers[i].getAttribute('is')) {
            case "for" :
                this.updateForHelper(updateHelpers[i], {"type" : "default"},contextSwitchInfo);
                break;
            case "if" : 
                this.updateSwitchHelper("if",updateHelpers[i],contextSwitchInfo);
                break;
            case "forIn" : 
                this.updateForInHelper(updateHelpers[i] , {"type" : "default"},contextSwitchInfo);
                break;
            case "switch" :
                this.updateSwitchHelper("switch",updateHelpers[i],contextSwitchInfo);
                break;
            case "component" : 
                this.updateDynamicComponent(updateHelpers[i], false, contextSwitchInfo);
                break;
            case "insertYield" : 
//              this.updateYield(updateHelpers[i], false, contextSwitchInfo);
                break;
            case "yield" : 
            case "registerYield" : 
                if(contextSwitchInfo) {
                    updateHelpers[i]._contextSwitchInfo = contextSwitchInfo;
                }
                break;
            default: 
                if(updateHelpers[i].tagName === "LYTE-YIELD") {
                    this.updateYield(updateHelpers[i], false, contextSwitchInfo);
                }
                
            }
         }
    }
    //AttributeChangedCallback will be called for the attributes mentioned in the this._observedAttributes array. 
    static get observedAttributes() {
    		let newArr = [];
            for(let i=0;i<this._observedAttributes.length;i++) {
                newArr[i] = LyteComponent.String.dasherize(this._observedAttributes[i]);
            }

            LyteComponent.customPropHandlers.forEach(function(item,index) {
                newArr.push(LyteComponent.String.dasherize(item));
            })
            return newArr;	
    }
    
    //Callback from browser, whenever any of the observed attribute changes. 
    //We call the component set, in order to affect the related changes. 
    attributeChangedCallback(attr, oldValue, newValue) {
       	if(this.constructor._observedMethodAttributes && this.constructor._observedMethodAttributes[attr]) {
   		 	return;
    	}
        let actualAttr = LyteComponent.String.toCamelCase(attr);
        isCustomProp = LyteComponent.customPropHandlers.indexOf(actualAttr);
        if(isCustomProp !== -1) {
            let propValue = LyteComponent.customPropHandlers[isCustomProp];
            let lyteProps = newValue;
            if(lyteProps) {
                try{
                    lyteProps = JSON.parse(lyteProps);
                    for(let key in lyteProps) {
                        let actKey = propValue + LyteComponent.String.upperCaseFirstLetter(key);
                        this.set(actKey, lyteProps[key]);
                    }
                } catch (e) {
                    console.error("Error while parsing "+ attr);
                }
            }
            return;
        }
        if(newValue===  null || oldValue === newValue) {
            return;
        }
        let dataType = this.component.__data[actualAttr].type;
        var obj = {"newValue" : newValue, "dataType" : dataType, "attr" : attr, "tagName" : this.tagName};
        if(LyteComponent.getProperData(obj)) {
            newValue = obj.newValue;
        } else {
            return;
        }
        //newValue = newValue.startsWith("boolean:")? (newValue.substring(newValue.indexOf(":") + 1) ==="true"? true: false) : newValue;
        if(this.component.data[actualAttr] !== newValue) {
                //this.set(actualAttr, typeof newValue === "object" ? JSON.parse(newValue): newValue);
                this.set(actualAttr, newValue);
        }
    }
    
    //Used to remove helpers of specific index in a for helper. 
    removeHelpersSpecificIndex(node, index) {
        if(node._helpers[index]) {
            for(let j=0;j<node._helpers[index].length;j++) {
                    this.removeHelpers(node._helpers[index][j]);
            }
        }
        if(node._forContent[index]) {
            for(let i=0;i<node._forContent[index].length; i++ ) {
                node._forContent[index][i].remove();
            }
            node._items[index] = {"_dynamicProperty" : {}, "itemProperty" : {}, "indexProperty": {}};
        }
    }
    //Used to remove all the helpers within an helper. 
    removeHelpers(node, update) {
        var del = "delete";
        let parent;
        var contextSwitchArray = [];
        LyteComponent.newAddContext(node, contextSwitchArray);
        if(node._forContent) {
            if(node.getAttribute("is") === "for") {
        	if(node._helpers) {
                for(let i=0;i<node._helpers.length;i++) {
                    for(let j=0;j<node._helpers[i].length;j++) {
                            this.removeHelpers(node._helpers[i][j]);
                    }
                    node._helpers[i] = [];
                }
            }
            for(let s=0;s<node._forContent.length;s++) {
                for(let i=0;i<node._forContent[s].length; i++ ) {
                    node._forContent[s][i].remove();
                }
            }
            let key = node.getAttribute("item");
            if(node._items.length) {
                let prop = node._items[0].itemProperty;
                let dynProp = node._items[0]._dynamicProperty;
                for(let dP in dynProp) {
                    let property = this.getProperty(dP); 
                    if(property._helperNodes){
                        property._helperNodes[del](node);                    
                    }
                }
                if(prop) {
                    for(let i=0;i<node._items.length;i++) {
                        this.removeBindings({[key] : node._items[i].itemProperty}, {[key] : node._attributes.items[i]});
                    }
                }
            }
            if(!update) {
            	if(node._actualBinding) {
            		if(node._attributes.items && node._attributes.items._bindings && node._actualBinding._createdBinding) {
                        node._attributes.items._bindings[del](node._actualBinding);
                    } 
                    if(node._actualBinding._forHelpers) {
                        node._actualBinding._forHelpers[del](node);
                    }
                    if(node._removedAttributes && node._removedAttributes.items && node._removedAttributes.items._multipleProperty) {
                    	node._removedAttributes.items._multipleProperty.actProp._forHelpers[del](node);
                    }
            	}
            }
            node._items = [];
        } else {
        	if(node._helpers) {
                let keys = Object.keys(node._helpers);
                for(let i=0;i<keys.length;i++) {
                    for(let j=0;j<node._helpers[keys[i]].length;j++) {
                        this.removeHelpers(node._helpers[keys[i]][j]);
                    }
                    node._helpers[keys[i]] = [];
                }
            }
            for(var ind in node._forContent) {
                for(let i=0;i<node._forContent[ind].length; i++ ) {
                    node._forContent[ind][i].remove();
                }
            }
            let items = node._items;
            let key = node.getAttribute("key");
            for(let index in items){
                let item = items[index];
                let prop = item.itemProperty;
                let dynamicProp = item._dynamicProperty;
                for(let dP in dynamicProp) {
                    let property = this.getProperty(dP); 
                    if(property._helperNodes){
                        property._helperNodes[del](node);                    
                    }
                }
                if(prop) {
                    for(let index in node._items) {
                        this.removeBindings({[key] : node._items[index].itemProperty}, {[key] : node._attributes.object[index]});
                    }
                }

            }
            if(!update) {
                if(node._actualBinding) {
                    if(node._attributes.object && node._attributes.object._bindings && node._actualBinding._createdBinding) {
                        node._attributes.object._bindings[del](node._actualBinding);
                    } 
                    if(node._actualBinding._forHelpers) {
                        node._actualBinding._forHelpers[del](node);
                    }
                }
                if(node._removedAttributes.items && node._removedAttributes.items._multipleProperty) {
                	node._removedAttributes.items._multipleProperty.actProp._forHelpers[del](node);
                }
                if(node._propBindingObject && node._attributes.object && node._attributes.object._bindings) {
                    node._attributes.object._bindings[del](node._propBindingObject);
                }
            }
            node._items= {};
          }
        } else if(node._caseContent || node._yieldContent) {
        	if(node._helpers) {
                for(let j=0;j<node._helpers.length;j++) {
                    this.removeHelpers(node._helpers[j]);
                }
                node._helpers = [];
            }
        	if(node._caseContent){
                for(let i=0;i<node._caseContent.length; i++ ) {
                    node._caseContent[i].remove();
                }
                for(let key in node._dynamicProperty) {
                    if(node._dynamicProperty[key].isActualNode) {
                        node._dynamicProperty[key].isActualNode._helperNodes[del](node);
                    }else {
                        if(this.getProperty(key)._helperNodes) {
                            this.getProperty(key)._helperNodes[del](node);
                        }
                    }
                }
                node._dynamicProperty = {};
                //node._parentIf = null;
            } else {
                for(let i=0;i<node._yieldContent.length; i++ ) {
                    node._yieldContent[i].remove();
                }
                node._dynamicProperty = {};
            }
        } else if(node._renderedComponent) {
            if(node._renderedComponent[node._currentComponent]) {
                node._renderedComponent[node._currentComponent].remove();
            }
            for(let key in node._renderedComponent) {
                node._renderedComponent[key] = null;
            }
        }
          LyteComponent.newRemoveContext(node, contextSwitchArray);
    }
    
    updateYield(node, update, contextSwitchInfo) {
        if(!node._callee) {
            node._callee = this;
        }        
        let toAppend = node._callee._yields[node.getAttribute("yield-name")];
        if(!toAppend) {
        	return;
        }
        //ADded now
        let parentScope = toAppend._callee || node._callee._callee;
        if(!parentScope) {
            node.appendChild(toAppend.content.cloneNode(true, "lyte"));
            return;
        }    
	    if(!toAppend._callee) {
    		toAppend._callee = parentScope;
    	} 
        node._dynamicProperty = node._dynamicProperty || {};
        //set values from child component. 
        let obj = {},contextSwitchingArray = {},self = this,contextSwitchArray = [];
        LyteComponent.newAddContext(toAppend, contextSwitchArray);
        Object.keys(node._properties).forEach(function(key) {
            contextSwitchingArray[key] = {};
            contextSwitchingArray[key].value = parentScope.component.data[key];
            contextSwitchingArray[key].property = parentScope._properties[key];
            parentScope._properties[key] = node._properties[key];
            parentScope.component.data[key] = node.component.data[key];
        }); 
        let content = parentScope.renderNodes(toAppend.content, toAppend._dynamicNodes, node, {"node" : node}, true, undefined, toAppend._templateContent);
        LyteComponent.establishBindings(node._properties, node.component.data);
        parentScope.executeBlockHelpers(node._helpers);
        Object.keys(node._properties).forEach(function(key) {
            parentScope.component.data[key] = contextSwitchingArray[key].value;
            parentScope._properties[key] = contextSwitchingArray[key].property;
        });
        LyteComponent.newRemoveContext(toAppend, contextSwitchArray); 
        node.appendChild(content);
        node._registerYield = toAppend;	    
    }
    
     // It constructs/updates the dynamicComponent creation
    updateDynamicComponent(node, update, contextSwitchInfo) {
    	let returnVal;
        node._callee = this;
        let keepAlive = node.hasAttribute("lyte-keep-alive");
        node._renderedComponent = node._renderedComponent || {};
        node._contextSwitchInfo = contextSwitchInfo || node._contextSwitchInfo;
        node._dynamicProperty = node._dynamicProperty || {};
        let componentName = node.getAttribute("component-name") || (node._attributes ? node._attributes["component-name"] : undefined);
        if(!componentName) {
            return;
        }
        let component,newComponent = false;
        if(update) {
        	if(keepAlive) {
        		LyteComponent.ignoreDisconnect = true;
        	}
            if(node._renderedComponent[node._currentComponent]) {
                node._renderedComponent[node._currentComponent].remove();
            }
            LyteComponent.ignoreDisconnect = false;
            if(!keepAlive) {
                node._dynamicProperty = {};
            }
            if(node._renderedComponent[componentName] && keepAlive) {
                component = node._renderedComponent[componentName];
            } else {
                component = document.createElement(componentName);
                newComponent = true;
            }
        }  else {
            component = document.createElement(componentName);
            newComponent = true;
        }
        if(!keepAlive && node._currentComponent) {
            node._renderedComponent[node._currentComponent] = null;
        }
        if(newComponent) {
//          let componentData = {};
            for(let i=0;i<node.attributes.length;i++) {
                if(node.attributes[i].name !== "is" && node.attributes[i].name !== "component-name" && node.attributes[i].name !== "lyte-keep-alive") {
                    component.setAttribute(node.attributes[i].name, node.attributes[i].value);
                }
            }
//          componentData = component._attributes;
            if(node._attributes) {
                for(var key in node._attributes) {
                	if(key!== "component-name") {
                		component.setData(LyteComponent.String.toCamelCase(key), node._attributes[key]);
                	}
                }
            }
            let toAppend = this.renderNodes(node.content, node._dynamicNodes, node, undefined, undefined, undefined, node._templateContent);
            component.appendChild(toAppend);
        }
        if(newComponent) {
                component._toRegEvnts = node._toRegEvnts;
        }
        if(!update) {
        	returnVal = {"toAppendMain" : component, "lastNode" : node};
        } else {
        	node.parentNode.insertBefore(component, node);
        }
        node._renderedComponent[componentName] = component;
        node._currentComponent = componentName;
	    component._callee = this;
	    component._actions = node._actions;
        component.setMethods(node._initMethods);
        component._attributeDetails = node._attributeDetails;
        component._boundEvents = node._boundEvents;
        return returnVal;
    }
    //updFH
    // It constructs/updates the for helper. 
    updateForHelper(node, options, contextSwitchInfo) {
        let callee = this;
        node._callee = this;
        node._attributes = node._attributes || {};
        node._contextSwitchInfo = contextSwitchInfo || node._contextSwitchInfo;
        let  indexValue = node.getAttribute("index");
        if(!indexValue) {
            node.setAttribute("index", "index");
            indexValue = "index";
        }
        let itemValue = node.getAttribute("item");
        if(!itemValue) {
            node.setAttribute("item", "item");
            itemValue = "item";
        }
        let initialItemValue = callee.component.data[itemValue],initialIndexValue = callee.component.data[indexValue];
        let initialItemProp = callee._properties[itemValue],initialIndexProp = callee._properties[indexValue];
        callee._properties[itemValue] = callee._properties[indexValue] = {};
        let items = node._attributes.items,content = node.content,dynamicNodes = node._dynamicNodes,lastNode = node;
        if(!node._items) {
            node._items = [];
        }
        let lastIndexForIteration;
        let firstIndexForIteration;
        let firstIndex = options.firstIndex;
        let secondIndex = options.secondIndex;
        let thirdIndex = options.thirdIndex;
        if(options) {
            switch(options.type) {
            case "remove"  :{
                lastIndexForIteration = firstIndex;
                for(let i=firstIndex, v=secondIndex;v>0;v--, i++) {
                    this.removeHelpersSpecificIndex(node, i);
                }
                //ln
                /*for(let i=(firstIndex)?firstIndex-secondIndex:firstIndex;i<node._items.length;i++) {
                    let forItem = node._items[i].itemProperty;
                    if(forItem._helperNodes){
                        for (var item of forItem._helperNodes){
                            let ind = item._contextSwitchInfo.itemIndex;
                            item._contextSwitchInfo.itemIndex = (ind)? ind- secondIndex : ind;
                        }
                    }
                }*/
                for(let i=firstIndex + secondIndex; i<node._items.length;i++) {        
                    node._items[i]._contextSwitchInfo.itemIndex = node._items[i]._contextSwitchInfo.itemIndex - secondIndex;        
                }
                node._items.splice(firstIndex, secondIndex);
                node._helpers.splice(firstIndex, secondIndex);
                node._forContent.splice(firstIndex, secondIndex);
                break;
            }
            case "insert" : {
                firstIndexForIteration = firstIndex;
                lastIndexForIteration = secondIndex;
                if(node._forContent[firstIndex]) {
                    lastNode = node._forContent[firstIndex][0];
                }
                let newArr = [], newObj = [], newArr1 = [];
                for(let v=secondIndex, k=firstIndex;v>0;v--, k++) {
                    newArr.push([]);
                    newObj.push({});
                    newArr1.push([]);
                }
                node._helpers.splice.apply(node._helpers, [firstIndex, 0].concat(newArr));
                node._items.splice.apply(node._items, [firstIndex, 0].concat(newObj));
                //ln
//                  for(let i=firstIndex + secondIndex;i<node._items.length;i++) {
//                      let forItem = node._items[i].itemProperty;
//                      for (var item of forItem._helperNodes){
//                          item._contextSwitchInfo.itemIndex = item._contextSwitchInfo.itemIndex + secondIndex;
//                      }
//                  }
                for(let i=firstIndex + secondIndex; i<node._items.length;i++) {
                    node._items[i]._contextSwitchInfo.itemIndex = node._items[i]._contextSwitchInfo.itemIndex + secondIndex;
                }
                node._forContent.splice.apply(node._forContent, [firstIndex, 0].concat(newArr1));
            }
                break;
            case "replace" : {
                firstIndexForIteration = firstIndex;
                lastIndexForIteration = secondIndex;
                this.removeHelpersSpecificIndex(node, firstIndex);
                let toAppendMain = document.createDocumentFragment();
                if(node._forContent[firstIndex+1]) {
                    lastNode = node._forContent[firstIndex+1][0];
                }
                let newArr = [], newObj = [], newArr1 = [];
                for(let v=secondIndex, k=firstIndex;v>0;v--, k++) {
                    newArr.push([]);
                    newArr1.push([]);
                    newObj.push({});
                }
                node._helpers.splice.apply(node._helpers,[firstIndex, 1].concat(newArr));
                node._items.splice.apply(node._items, [firstIndex, 1].concat(newObj));
//                  for(let i=firstIndex + secondIndex;i<node._items.length;i++) {
//                      let forItem = node._items[i].itemProperty._forItem;
//                      forItem.itemIndex = forItem.itemIndex + secondIndex - 1 ;
//                  }
                for(let i=firstIndex + secondIndex; i<node._items.length;i++) {
                    node._items[i]._contextSwitchInfo.itemIndex = node._items[i]._contextSwitchInfo.itemIndex + secondIndex - 1;
                }
                node._forContent.splice.apply(node._forContent, [firstIndex, 1].concat(newArr1));
                break;
            }
            case "splice" : {
                firstIndexForIteration = firstIndex;
                lastIndexForIteration = secondIndex;
                for(let i=thirdIndex,j=0;i>0;i-- , j++) {
                    this.removeHelpersSpecificIndex(node, firstIndex + j);
                }
                let toAppendMain = document.createDocumentFragment();
                if(node._forContent[firstIndex+thirdIndex]) {
                    lastNode = node._forContent[firstIndex+thirdIndex][0];
                }
                let newArr = [], newObj = [], newArr1 = [];
                for(let v=secondIndex, k=firstIndex;v>0;v--, k++) {
                    newArr.push([]);
                    newArr1.push([]);
                    newObj.push({});
                }
                node._helpers.splice.apply(node._helpers,[firstIndex, thirdIndex].concat(newArr));
                node._items.splice.apply(node._items, [firstIndex, thirdIndex].concat(newObj));
//                  for(let i=firstIndex + secondIndex;i<node._items.length;i++) {
//                      let forItem = node._items[i].itemProperty._forItem;
//                      forItem.itemIndex = forItem.itemIndex + secondIndex - 1 ;
//                  }
                for(let i=firstIndex + secondIndex; i<node._items.length;i++) {
                    node._items[i]._contextSwitchInfo.itemIndex = node._items[i]._contextSwitchInfo.itemIndex + secondIndex - thirdIndex;
                }
                node._forContent.splice.apply(node._forContent, [firstIndex, thirdIndex].concat(newArr1));
                break;
            }
            break;
            case "update" : 
            {
                let key = node.getAttribute("item");
//                  this.removeHelpers(node, true);
                for(let i=0;i<node._items.length;i++) {
                    this.removeHelpersSpecificIndex(node, i);
                }
//                  if(node._attributes.items) {
//                      for(let i=0;i<node._attributes.items.length && node._items[i];i++) {
//                          LyteComponent.removeSelectedBindingDeep(node._items[i].itemProperty[key], node._attributes.items[i]);
//                      }
//                  }
                node._items = [];
        }
            case "default" : 
            {
                node._forContent = [];
                node._helpers = [];
                firstIndexForIteration = 0;
                lastIndexForIteration = items? items.length : 0 ;
            }
            break;
            default: 
            console.error("Error in updateForHelper");  

            }
        }
        if(!lastNode) {
            lastNode = node;
        }
	while(lastNode !== node && lastNode.tagName === "TEMPLATE") {
            let lastNodeType = lastNode.getAttribute("is");
            switch(lastNodeType) {
            case "for" :
            case "forIn" : 
                lastNode = lastNode._forContent[0][0] || lastNode;
                break;
            case "if" :
            case "switch" : 
                lastNode = lastNode._caseContent[0] || lastNode;
                break;
            case "component" : 
                lastNode = lastNode._renderedComponent[lastNode._currentComponent] || lastNode;
                break;
            }
        }
        let returnVal;
        if(options.type !== "remove") {
            var toAppendMain = document.createDocumentFragment();
            for(let k = firstIndexForIteration,v=lastIndexForIteration;v>0; k++, v--) {
                node._helpers[k] = [];
                node._items[k] = {"_dynamicProperty" : {}, "itemProperty" : {}, "indexProperty": {}};
                callee.component.data[itemValue] = items[k];
                callee.component.data[indexValue] = k;
                callee._properties[itemValue] = {};
                callee._properties[indexValue] = {};
                let optns = {"itemValue" : itemValue, "itemIndex" : k, "type" : "for", "node" : node, "indexValue" : indexValue};
//                  Object.defineProperty(callee._properties[itemValue], '_forItem', {
//                      enumerable: false, 
//                      writable: true, 
//                      configurable: true, 
//                      value : optns
//                  });
                node._items[k]._contextSwitchInfo = optns;
                let breakCheck = {};
                let toAppend = this.renderNodes(content, dynamicNodes, node, optns, undefined, breakCheck, node._templateContent);
                node._items[k].itemProperty = this.getProperty(itemValue);
                node._items[k].indexProperty = this.getProperty(indexValue);    
//                  if(options.type !== "default") {
                    LyteComponent.establishBindings({[itemValue] : node._items[k].itemProperty},{[itemValue]:node._attributes.items[k]});
//                  }
                node._forContent[k] = Array.from(toAppend.childNodes);
                //Needs to revisit this and make sure it happen within renderNodes function itself;
//                  if(options.type !== "update") {
                this.executeBlockHelpers(node._helpers[k]);
                toAppendMain.appendChild(toAppend);
                if(breakCheck.stop) {
                    break;
                }
            }
            if(options.type === "default") {
                returnVal = {"toAppendMain" : toAppendMain, "lastNode" : lastNode};
            } else {
                lastNode.parentNode.insertBefore(toAppendMain, lastNode);
            }
            if(node._removedAttributes && node._removedAttributes.items && node._removedAttributes.items._multipleProperty) {
            	LyteComponent.establishBindings({"items" : node._removedAttributes.items._multipleProperty.actProp}, {"items" : items});
            }
        }
        for(let i=lastIndexForIteration;i<node._items.length;i++) {
//              for(let j=0;j<node._helpers[i].length;j++) {
//                  node._helpers[j]._contextSwitchInfo.itemIndex = i;
//              }
            if(node._items[i].indexProperty) {
                LyteComponent.affectChanges(node._items[i].indexProperty);
            }
        }
        callee.component.data[itemValue] = initialItemValue;
        callee.component.data[indexValue] = initialIndexValue;
        callee._properties[itemValue] = initialItemProp;
        callee._properties[indexValue] = initialIndexProp;
        return returnVal;
    }
    //It constructs/updates forIn Helper.
    //updFIH
    updateForInHelper(node, options, contextSwitchInfo) {
        let callee = this;
        node._callee = this;
        node._attributes = node._attributes || {};
        contextSwitchInfo = contextSwitchInfo ? contextSwitchInfo : node._contextSwitchInfo;
        node._contextSwitchInfo = contextSwitchInfo;
        let key = node.getAttribute("key");
        if(!key) {
            key = "key";
            node.setAttribute("key", "key");
        }
        let value = node.getAttribute("value");
        if(!value) {
            value = "value";
            node.setAttribute("value", "value");
        }
        let initialKeyValue = callee.component.data[key];
        let initialValueValue = callee.component.data[value];
        let initialKeyProp = callee._properties[key];
        let initialValueProp = callee._properties[value];
        callee._properties[key] = callee._properties[value] = {};
        let object = node._attributes.object;
        let content = node.content;
        let dynamicNodes = node._dynamicNodes;
        let lastNode = node;
        let keysArray = [];
        if(!node._items) {
            node._items = {};
        }
        if(options) {
            switch(options.type) {
            case "delete"  :{
                this.removeHelpersSpecificIndex(node, options.property);
                var delIndex = node._keysArray.indexOf(options.property);
                if(delIndex > -1) {
                  node._keysArray.splice(delIndex,1);
                }
                delete node._propBindingObject[options.property];
            }
            break;
            case "add" : {
                keysArray = [options.property];
                node._keysArray.push(options.property);
            }
            break;
            case "update" : 
            {
                node._keysArray.forEach(function (itemKey, index, array) {
                    this.removeHelpersSpecificIndex(node, itemKey);
                }, this);
                node._keysArray = keysArray = object ? Object.keys(object) : [];
                node._items = {};
                node._propBindingObject = {};
            }
            break;
            case "default" : 
            {
                node._forContent = {};
                node._helpers = {};
                node._keysArray = keysArray = object? Object.keys(object) : [];
//                  keysArray = Object.keys(object);

            }
            break;
            default: 
            console.error("Error in updateForHelper");  

            }
        }
        let returnVal;
        if(!object) {
            let toAppendMain = document.createDocumentFragment();
            if(options.type !== "default") {
                lastNode.parentNode.insertBefore(toAppendMain, lastNode);
            } else {
                return {"toAppendMain" : toAppendMain, "lastNode" : lastNode};
            }    
        }
        if(object && options.type !== "remove") {
            var toAppendMain = document.createDocumentFragment();
            node._propBindingObject = node._propBindingObject || {};
            keysArray.forEach(function(itemKey, index, array) {
                node._helpers[itemKey] = [];
                node._items[itemKey] = {"_dynamicProperty" : {}, "itemProperty" : {}};
                callee.component.data[key] = itemKey;
                callee.component.data[value] = object[itemKey];
                callee._properties[key] = {};
                callee._properties[value] = {};
                let optns = {"itemIndex" : itemKey, "itemValue" : value, "keyValue" : key, "type" : "forIn", "node" : node};
                node._items[itemKey]._contextSwitchInfo = optns;
                let toAppend = this.renderNodes(content, dynamicNodes, node, optns, undefined, undefined, node._templateContent);
                node._items[itemKey].itemProperty = this.getProperty(value);
                node._propBindingObject[itemKey] = node._items[itemKey].itemProperty;
                node._forContent[itemKey] = Array.from(toAppend.childNodes);
//                    this.updateBlockHelpers(node._helpers[itemKey], optns);
                this.executeBlockHelpers(node._helpers[itemKey]);
                toAppendMain.appendChild(toAppend);
            }, this); 
//              if(options.type !== "update") {
                if(!node._attributes.object._bindings) {
                    Object.defineProperty(node._attributes.object, '_bindings', {
                        value : new Set(),
                        enumerable : false, 
                        writable : true, 
                        configurable : true
                    });
                }
                node._attributes.object._bindings.add(node._propBindingObject);
                LyteComponent.establishBindings(node._propBindingObject, node._attributes.object);
//              }
                if(options.type !== "default") {
                    lastNode.parentNode.insertBefore(toAppendMain, lastNode);
                } else {
                    returnVal = {"toAppendMain" : toAppendMain, "lastNode" : lastNode};
                }

        }
        callee.component.data[key] = initialKeyValue;
        callee.component.data[value] = initialValueValue;
        callee._properties[key] = initialKeyProp;
        callee._properties[value] = initialValueProp;
        return returnVal;
    }
        
    static getArrayIndex(array,value) {
        for(let i=0;i<array.length;i++) {
            if(array[i] === value) {
                return i
            };
        }
    }
    
    static getTrimmedContent(content, position, node) {
        let dummyContent = content;
        if(node) {
            position = [];
            let parentNode = node.parentNode;
            while(true) {
                position.unshift(this.getArrayIndex(parentNode.childNodes,node));
                parentNode = parentNode.parentNode;
                node = node.parentNode;
                if(!parentNode) {
                    break;
                }
            }
        }
        for(let i=0;i<position.length;i++) {
            for(let j=content.childNodes.length-1;j>position[i];j--) {
                content.childNodes[j].remove();
            }
            content = content.childNodes[position[i]];
        }
        return dummyContent;
    }
   //updSH
    updateSwitchHelper(type,node, contextSwitchInfo, update, establishBindings){
        let isNew = false;
        let lastNode = node;
        if(!node._callee) {
            node._callee = this;
            isNew = true;
        }
        contextSwitchInfo = contextSwitchInfo ? contextSwitchInfo : node._contextSwitchInfo;
        node._contextSwitchInfo = contextSwitchInfo;
        node._dynamicProperty = node._dynamicProperty ? node._dynamicProperty : {};
        let currentCaseName;
        let value;
        if(node.getAttribute("value")=== "" || node.getAttribute("value")) {
            value = node.getAttribute("value");
        } else if(node._attributes) {
            value = node._attributes.value;
        }
        if(node._currentCase && value === node._currentCase){
            return;
        }
        if(value) {
            currentCaseName = type === "if" ? "true" : value.toString();
        } else {
            if(type=== "if")  {
                currentCaseName = "false";
            } else {
                switch(value) {
                case undefined : 
                    currentCaseName = "undefined";
                    break;
                case null : 
                    currentCaseName = "null";
                    break;
                case false: 
                    currentCaseName = "false";
                    break;
                case "": 
                    currentCaseName = '""';
                    break;
                }
            }
        }
        if(currentCaseName === node._currentCase) {
            return;
        }
        node._currentCase = currentCaseName;
//        let currentCase = node.content.querySelector('[case=\''+currentCaseName+'\']'),scope;
        let scope = node._cases[currentCaseName];
        let defaultContent;
        if(!scope){
            scope = node._default;
            defaultContent = (window.isIE11Lyte || window.isEdgeLyte) ? scope.templateContent : node.content.querySelector('[default]');
            node._isDefault = true; 
            if(!defaultContent) {
                if(node._caseContent && node._caseContent.length) {
                    this.removeHelpers(node);
                }
                node._caseContent = [];
                let emptyTextNode = document.createTextNode("");
                node._caseContent.push(emptyTextNode);
                node._currentCaseName = currentCaseName;
                if(update) {
                	lastNode.parentNode.insertBefore(emptyTextNode, node);
                	return;
                } else {
                	let toAppendMain = document.createDocumentFragment();
                	toAppendMain.append(emptyTextNode);
                	return {lastNode : lastNode, toAppendMain : toAppendMain};
                }
            }
        }
        
//        if(currentCase) {
//              if(currentCase.tagName === "TEMPLATE" && !currentCase.getAttribute("is")){
//                  currentCase = currentCase.content;
//              } else {
//                  let temp = document.createElement('template');
//                  let clone = currentCase.cloneNode(true);
//                  temp.content.appendChild(clone);
//                  currentCase.removeAttribute('slot');
//                  currentCase = temp.content;
//              }
//              scope.content = currentCase;
//        }
 
        if(node._caseContent && node._caseContent.length) {
            this.removeHelpers(node);
        }
        let dummyScope = scope;
        let additionalContentArr = [];
        let cnt=0;
        let dummyCaseName = currentCaseName;
        let template;
        if(defaultContent) {
            template = defaultContent
        } else {
            template = (window.isIE11Lyte || window.isEdgeLyte) ? {} : node.content.querySelector('[case=\''+dummyCaseName+'\']');
        }
        let contentArr = [];
        while(dummyScope) {
            let dynamicNodes = dummyScope.dynamicNodes;
            let processedContent = this.renderNodes(template.content, dynamicNodes, node, undefined, establishBindings, undefined, dummyScope.templateContent);
            contentArr.push(processedContent);
            if(dummyScope.additional) {
                if(dummyScope.additional.next) {
                    template = (window.isIE11Lyte || window.isEdgeLyte) ? {} : node.content.querySelector('[case=\''+dummyScope.additional.next+'\']');
                    dummyScope = node._cases[dummyScope.additional.next];
                } else {
                    template = (window.isIE11Lyte || window.isEdgeLyte) ? {} : node.content.querySelector('[default]');
                    dummyScope = node._default;
                }
            } else {
                    break;
            }
        }
        node._caseContent = [];
        let toAppendMain = document.createDocumentFragment();;
        for(let i=0;i<contentArr.length;i++) {
            if(contentArr[i].nodeType == 11){
//                for(let j=0;j<contentArr[i].childNodes.length;j++) {
//                    node._caseContent.push(contentArr[i].childNodes[j]);
//                }
                node._caseContent = node._caseContent.concat(Array.from(contentArr[i].childNodes));
            }
            else{
                node._caseContent.push(contentArr[i]);
            }
                toAppendMain.append(contentArr[i]);
//            node.parentNode.insertBefore(contentArr[i], node);
        }
          this.executeBlockHelpers(node._helpers, node);
          if(update) {
        	  let returnVal;
        	  if(toAppendMain.querySelector("template[is=break]")) {
        		  returnVal = "break";
        	  } else if(toAppendMain.querySelector("template[is=continue]")) {
        		  returnVal = "continue";
        	  }
        	  node.parentNode.insertBefore(toAppendMain, node);
        	  return returnVal;
          } else {
        	  return {"toAppendMain" : toAppendMain, "lastNode" : node};
          }
    }
    
    dummy(a,b) {
        let dummy = this.constructor._properties[boundValue].observer;
    }
    
    callObservers(boundValue, key) {
        let property = this.constructor._properties[boundValue];
        let observers = property?property.observer: undefined;
        if(observers) {
            for(let i=0;i<observers.length;i++) {
                if(key.indexOf('.') === -1 || observers[i].path === key) {
                    this["_"+observers[i].functionName].apply(this);
                }
            }
        }
    }
    
    static updateValue(property, path, value) {
        let pathVals = path.split('.');
        let context = property;
        for(let i=0;i<pathVals.length -1;i++) {
            context = context[pathVals[i]];
        }
        context[pathVals[i]] = value;
    }
    
    static createDocFragment(template){
        let childNodes = template.cloneNode(true,"lyte").childNodes;
//           let childNodes = template.childNodes;
        let frag = document.createDocumentFragment();
        let len = childNodes.length;
        for(let i=0; i<len; i++){
            frag.appendChild(childNodes[0]);
        }
        return frag;
    }
    
    static createDocFragment1(template) {
        if(window.isEdgeLyte) {
            return template.content;
        }
    	let childNodes = template.childNodes;
    	let frag = document.createDocumentFragment();
    	let len = childNodes.length;
    	for(let i=0; i<len; i++){
            frag.appendChild(childNodes[0]);
        }
    	return frag;
    }
    
    static _registerComponent(a,b) {
        let componentsDiv = LyteComponent.lyteComponentsDiv;
        let styleDiv = LyteComponent.styleDiv;
        if(this._template && typeof this._template === "string"){
            this._template.replace(/\\'/g,"'");
            let div = document.createElement("div");
            div.innerHTML = this._template;
            while(div.firstChild){
                if(div.firstChild.nodeName === "STYLE") {
                    styleDiv.appendChild(div.firstChild);
                } else {
                    componentsDiv.appendChild(div.firstChild);
                }
            }
/*        } else if(document.querySelector("#" + a)) { */
        } else if(document.querySelector("template[tag-name='"+a+"']")) {
            componentsDiv.appendChild(document.querySelector("template[tag-name='"+a+"']") );
        }
        this._template = componentsDiv.querySelector("template[tag-name='"+a+"']");
        if(!this._template) {
        	return;
        }
        if(LyteComponent.needDummyComponentsDiv) {
              LyteComponent.dummyLyteComponentsDiv.appendChild(this._template.cloneNode(true));  
        }
        if(this._template && !this._template.content){
//            var frag = document.createDocumentFragment();
//            let childNodes = this._template.cloneNode(true,"lyte").childNodes;
//            //let childNodes = this._template.childNodes;
//            let len = childNodes.length;
//            for(let i=0; i<len; i++){
//                frag.appendChild(childNodes[0]);
//            }
//            this._template.content = frag;
        }
        var s = window.isIE11Lyte ? this._template : this._template.content;//)?this._template.content:document.createDocumentFragment(this._template);
        //This is used to split text nodes which contain multiple dynamic values 
        //Eg." Name is {{name}} and age is {{age}} "
        this.splitTextNodes(s);
        //This is used to find the dynamicNodes and helper nodes for the given component. 
        if(!this._dynamicNodes){
        console.error("Component " + a + " is not compiled. Please compile using Lyte CLI. ");
	    } else {
        doCompile(s, this._dynamicNodes, a);
        if(window.isEdgeLyte) { 
          this._templateContent = this._template.outerHTML;
        } else if(window.isIE11Lyte) {
          this._templateContent = s.outerHTML;
        }
        if(this._templateAttributes) {
            var ta = [this._templateAttributes];
            doCompile(this._template, ta, a);
            this._templateAttributes = ta[0];
            if(this._templateAttributes && this._templateAttributes.attr) {
                var attributesT = this._template.attributes;
                try{
                    for(let i=0;i<attributesT.length;i++) {
                        if(!this._templateAttributes.attr[attributesT[i].name] && attributesT[i].name !== "tag-name" && attributesT[i].name !== "use-strict") {
                            this._templateAttributes.attr[attributesT[i].name] = {"name" : attributesT[i].name, "staticValue" :  attributesT[i].value};
                        }
                    }    
                } catch(e) {
                    console.error("Error with templateAttributes. ")
                }
            }
        }
        }
    }
    //This is used to split text nodes which contain multiple dynamicNodes. 
    static splitTextNodes(node) {
        if(node && node.childNodes && node.childNodes.length) {
            for(let i=node.childNodes.length-1;i>=0;i--) {
                this.splitTextNodes(node.childNodes[i]);
            }
        }
        if(node.tagName === "TEMPLATE" && !window.isIE11Lyte) {
            this.splitTextNodes(node.content);
        }
        if(node.nodeType === node.TEXT_NODE) {
            let nodeValue = node.nodeValue;
            if(nodeValue){
                let mustacheValues = nodeValue.match(/{{[^}]*?(?:(?:('|")[^\1]*?\1)[^}]*?)*}}/g); //'
                if(!mustacheValues) {
                    return;
                }
                let newNodeArray = [];
                for(let i=0;i<mustacheValues.length;i++) {
                    let mustacheStartIndex = nodeValue.indexOf(mustacheValues[i]);
                    let mustacheEndIndex = mustacheStartIndex + mustacheValues[i].length;
                    if(mustacheStartIndex) {
                            newNodeArray.push(document.createTextNode(nodeValue.substring(0, mustacheStartIndex)));
                    }
                    newNodeArray.push(document.createTextNode(nodeValue.substring(mustacheStartIndex, mustacheEndIndex)));
                    nodeValue = nodeValue.substring(mustacheEndIndex);
                }
                if(!(!nodeValue.trim() && node.nextSibling && node.nextSibling.nodeType === 3 && !node.nextSibling.nodeValue.trim())) {
                    newNodeArray.push(document.createTextNode(nodeValue));
                }
                //Fix for IE Edge issue with higher versions where node.replaceWith is not working when the parent is a doc fragment.
                if(window.replaceWithNeeded && node.parentNode.nodeName === "#document-fragment") {
                	for(let i=0;i<newNodeArray.length;i++) {
                        node.parentNode.insertBefore(newNodeArray[i],node);
                      }
                    node.remove();
                } else {
                	node.replaceWith.apply(node, newNodeArray);
                }
            }
        }
    }
    //It registers the binding of the node with the properties with which the dynamicNode depends. 
    bindNode(node, toBeRemoved, helperNode, options, nodeInfo, processLast, establishBindings, isTemplate) {
        let itemValue = options.itemValue;
        let forIndex = options.itemIndex;
        let forType = options.type;
        let indexValue = options.indexValue;
        let dynamicValue = nodeInfo.dynamicValue;
        let helperFunc = nodeInfo.helperInfo;
        let nodeValue, ownerElement = node.ownerElement;
        let dynamicValuesArray = [];
//        if(node.nodeType === 2 && LyteComponent.isCustomElement(node.ownerElement,true) ) {
//          node = {nodeName : node.nodeName, ownerElement: ownerElement, nodeType : 2, nodeValue : node.nodeValue};
//        }
        node._callee = this;
        let isHelper = false;
        if(helperFunc && Object.keys(helperFunc).length) {
            isHelper = true;
            let attrName = node.nodeName;
            nodeValue = node.helperValue = helperFunc;
            let helperArgs = [];
            if(helperFunc.name === "action"){
                let actName = helperFunc.args[0];
                helperFunc.args[0] = actName.startsWith("'")? actName.replace(/'/g,''):  actName;
                if(forType) {
                    ownerElement._contextSwitchInfo = options;
                } else if(helperNode) {
                    ownerElement._contextSwitchInfo = helperNode._contextSwitchInfo;
                }
                actName = helperFunc.args.slice(0,1)[0];
                let args = helperFunc.args.slice(1,helperFunc.args.length), isCustom = false;
                let attrName = node.nodeName;
                if(attrName.indexOf("-") != -1){
                    isCustom = true;
                }
                helperArgs = [ownerElement,attrName,isCustom,{name:actName,args:args}];
                this.processHelper({"name" : helperFunc.name, "args" : helperArgs}, node);
                return;
            }
            else{
                helperArgs = this.processArgs(this,helperFunc.args,dynamicValuesArray);
            }
            nodeValue = this.processHelper({"name" : helperFunc.name, "args" : helperArgs}, node);
            if(helperFunc.name === "unescape"){
//              let test = node.replaceWith.apply(node,nodeValue.childNodes);
                let obj = {initialNode : node, dynamicNodeValue : nodeValue};
                node = {dynamicPositions : obj, "_callee" : node._callee, helperValue : node.helperValue};
                processLast.push(node);
            }
        } else {
            helperFunc = {};
            node.syntaxValue = dynamicValue;
            let dynamicValues = [];
            nodeValue = LyteComponent.get(this.component.data, dynamicValue, dynamicValues);
            dynamicValuesArray.push(dynamicValues);
        }
        if(node.nodeType === 2 && ( (typeof nodeValue !== "string" && (LyteComponent.isCustomElement(node.ownerElement,true) || typeof nodeValue === "boolean") ) || LyteComponent.isControlHelper(node.ownerElement) )) {
        //	let bindedNode = node;
        	node = {nodeName : node.nodeName, ownerElement: ownerElement, nodeType : 2, nodeValue : node.nodeValue, _callee : this, syntaxValue : node.syntaxValue, helperValue : node.helperValue, _attributeDetails : node._attributeDetails};
        //	node.ownerElement._attributeDetails[node.nodeName].bindedNode = node;
        }
        let actMultiProp; 
        if(helperFunc.name !== "unbound") {
            let dynamicProp;
            if(helperNode) {
                dynamicProp = forType? helperNode._items[forIndex]._dynamicProperty : helperNode._dynamicProperty;
            }
            for(let d=0;d<dynamicValuesArray.length;d++) {
            	let dynamicValues = dynamicValuesArray[d];
            	for(let v=0;v<dynamicValues.length;v++) {
            		let actProperty = this.getProperty(dynamicValues[v]);
            		if(helperNode) {
            			let ind = dynamicValues[v].search(/\W/);
            			let boundValue;
            			if(ind !== -1) {
            				boundValue = dynamicValues[v].substring(0, ind);
            			} else {
            				boundValue = dynamicValues[v];
            			}
            			if(boundValue !== itemValue && boundValue !== indexValue && (!options.node || !options.node._properties || !options.node._properties[boundValue])) {
            				if(!actProperty._helperNodes) {
            					Object.defineProperty(actProperty, '_helperNodes', {
            						value : new Set(), 
            						writable: true, 
            						enumerable: false,
            						configurable: true
            					});
            				}
            				actProperty._helperNodes.add(
            						helperNode
            				);
            				dynamicProp[dynamicValues[v]] ? dynamicProp[dynamicValues[v]].push(node): (dynamicProp[dynamicValues[v]] = []).push(node);
            			} 
            			else {
            				node._contextSwitchInfo = options;
            				if(!actProperty._dynamicNodes) {
            					actProperty._dynamicNodes = [];
            					Object.defineProperty(actProperty, '_dynamicNodes', {
            						value: [],
            						enumerable: false, 
            						writable: true, 
            						configurable: true
            					});
            				}
            				actProperty._dynamicNodes.push(node);
            				actMultiProp = actProperty;
            			}
            		} else {
            			if(!actProperty._dynamicNodes) {
            				Object.defineProperty(actProperty, '_dynamicNodes', {
            					value : [], 
            					enumerable: false, 
            					writable: true,
            					configurable: true
            				});
            			}
            			actProperty._dynamicNodes.push(node);
            		}
            		if(ownerElement && ownerElement.tagName === "TEMPLATE" && /^(for|forIn)$/.test(ownerElement.getAttribute("is")) && !isHelper)  {
            			let type= ownerElement.getAttribute("is");
            			if( (type=== "for" && node.nodeName === "items") || (type==="forIn" && node.nodeName === "object")) {
            				if(!actProperty._forHelpers) {
            					Object.defineProperty(actProperty, '_forHelpers', {
            						value : new Set(), 
            						enumerable: false, 
            						writable: true,
            						configurable: true
            					});
            				}
            				node.ownerElement._actualBinding = actProperty;
            				actProperty._forHelpers.add(node.ownerElement);
            			}
            		}
            		if(establishBindings) {
            			LyteComponent.establishSelectedBinding(actProperty, this.component.data, this );
            		}
            	}
            	if(dynamicValues.length > 1) {
            		node._multipleProperty = {"dynamicProp" : actMultiProp ? undefined : dynamicProp, "actProp" : this.getProperty(dynamicValues[0]), "helperNode" : helperNode};
            	}
            }
        }
        nodeValue = !typeof nodeValue === "boolean" && !typeof nodeValue === "number" ? (nodeValue? nodeValue : ""): nodeValue;
        if(node.nodeType === 2) {
            let parentNode = node._parentNode? node._parentNode : node.ownerElement;
            if(parentNode.tagName) {
                let is = parentNode.getAttribute("is");
            }
            let isCustomElement = LyteComponent.isCustomElement(parentNode,true);
            if(isCustomElement) {
                 if(parentNode.set) {
                    parentNode.set(LyteComponent.String.toCamelCase(node.nodeName), nodeValue);
                 } else {
                    parentNode._initProperties = parentNode._initProperties || {};
                     parentNode._initProperties[LyteComponent.String.toCamelCase(node.nodeName)] =nodeValue;
                }
            }
            let origNodeValue = nodeValue;
            //!== "string"
            if(isCustomElement && typeof nodeValue !== "string" && !isTemplate) {
                parentNode._attributes = parentNode._attributes || {};
                parentNode._attributes[node.nodeName] = nodeValue;
                if(parentNode.nodeName === "TEMPLATE" && isHelper && nodeValue) {
                    if((parentNode.getAttribute("is") === "for" && node.nodeName === "items") || (parentNode.getAttribute("is") === "forIn" && node.nodeName === "object")) {
                        if(!nodeValue._bindings) {
                            Object.defineProperty(nodeValue, '_bindings', {
                                value : new Set(),
                                enumerable : false,
                                writable: true,
                                configurable: true
                            });
                        }
                        //node._actualBinding = {"_forHelpers" : new Set().add(parentNode)};
                        node.ownerElement._actualBinding = {"_forHelpers" : new Set().add(parentNode), "_createdBinding" : true};
                        nodeValue._bindings.add(node.ownerElement._actualBinding);
                    }
                }
                toBeRemoved.push(node.nodeName);
            }
            else {
                if(typeof nodeValue === "boolean") {
                    parentNode._attributes = node.ownerElement._attributes || {};
                    parentNode._attributes[node.nodeName] = nodeValue;
                    if(!nodeValue) {
//                      node.ownerElement.removeAttribute(node.nodeName);
                        toBeRemoved.push(node.nodeName);
                    } else {
                        parentNode.setAttribute(node.nodeName, "");
                    }
                } else {
                    nodeValue = (typeof nodeValue === "object") ? ((typeof Record != "undefined" && nodeValue instanceof Record) ? JSON.stringify(nodeValue.$.toJSON()) : JSON.stringify(nodeValue)) : (nodeValue === undefined ? '' : nodeValue);
                    if(LyteComponent.isControlHelper(node.ownerElement)) {
                    	 parentNode._attributes = node.ownerElement._attributes || {};
                         parentNode._attributes[node.nodeName] = nodeValue;
                         toBeRemoved.push(node.nodeName);
                    } else {
                         let locNodeVal = nodeValue === undefined ? "" : nodeValue;
                         if(node.nodeName === "style") {
                            node.ownerElement.setAttribute("style",locNodeVal);
                         } else {
                            node.nodeValue = locNodeVal;
                         }
                    }
                    
                }
            }
            if(parentNode.tagName === "LYTE-YIELD" /*parentNode.getAttribute("is") === "insertYield"*/) {
                parentNode.component.data[LyteComponent.String.toCamelCase(node.nodeName)] = origNodeValue;
            }
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(parentNode.nodeName)) {
                        if (node.nodeName === "value") {
                            parentNode.value = nodeValue;
                        } else if (node.nodeName === "checked") {
                            parentNode.checked = nodeValue;
                        }
            }
        } 
        else {
            node.nodeValue = nodeValue === undefined ? '' : nodeValue;
        }
	return node;
    }
    
    debounce(func, threshold) {
        var timeout;
        return function debounced() {
            var obj = this, args = arguments;
            function delayed() {
            	func.apply(obj, args);
                timeout = null;
            };
            if (timeout){
            	clearTimeout(timeout);
            }
            timeout = setTimeout(delayed, threshold || 100);
            //console.log(timeout,threshold);
        };
    }
    getProperty(key) {
        let arr = key.split('.');
        let property = this;
        if(!property._properties[arr[0]]) {
            property._properties[arr[0]] = {};
        } 
        property = property._properties[arr[0]];
        
        Object.defineProperty(property, '_path', {enumerable: false, value : arr[0]});
        for(let i=1;i<arr.length;i++) {
            if(!property[arr[i]]) {
                property[arr[i]] = {};
                Object.defineProperty(property[arr[i]], '_path', {enumerable: false, value : property._path + "." + arr[i]});
            }
            property = property[arr[i]];
        }
        return property;
    }
    //updN
    updateNode(node, updatePath) {
        var del = "delete";
        let multiplePropNode = false;
        let multipleProp;
        if(node._multipleProperty && updatePath !== node._multipleProperty.actProp._path) {
            multiplePropNode = false;
            multipleProp = node._multipleProperty;
            let nodes;
            if(multipleProp.dynamicProp) {
                multiplePropNode = multipleProp;
                nodes = multipleProp.dynamicProp[multipleProp.actProp._path];
                if(nodes) {
                    let index = nodes.indexOf(node);
                    nodes.splice(index, 1);
                }
                let helperNode = multipleProp.helperNode;
                if(nodes.length === 0) {
                    if(helperNode.getAttribute("is") === "if") {
                        multipleProp.actProp._helperNodes[del](helperNode);
                        delete multipleProp.dynamicProp[multipleProp.actProp._path];
                    } else {
                        delete multipleProp.dynamicProp[multipleProp.actProp._path];
                        if(helperNode._items) {
                            let removeHelper = true;
                            for(let i=0;i<helperNode._items.length;i++) {
                                if(helperNode._items[i]._dynamicProperty && helperNode._items[i]._dynamicProperty[multipleProp.actProp._path]) {
                                    removeHelper = false;
                                    break;
                                }
                            }
                            if(removeHelper) {
                                multipleProp.actProp._helperNodes[del](helperNode);
                                //console.log('for helper is removed');
                            }
                        }
                    }
                }
            }
            if(!multiplePropNode) {
                multiplePropNode = "dynamicNodes";
                nodes = multipleProp.actProp._dynamicNodes;
                if(nodes) {
                    let index = nodes.indexOf(node);
                    nodes.splice(index, 1);
                    if(!nodes.length) {
                        delete multipleProp.actProp._dynamicNodes;
                    }
                }
            }
        }
        if(!node.syntaxValue && !node.helperValue) {
            return;
        }
        let contextSwitchInfo;
        let isYieldContext;
        if(node._contextSwitchInfo || (node.nodeType === 2 && node.ownerElement._contextSwitchInfo)) {
            contextSwitchInfo = node._contextSwitchInfo || node.ownerElement._contextSwitchInfo;
            var contextSwitchArray = [];
            LyteComponent.changeContext(contextSwitchInfo.node, contextSwitchArray, contextSwitchInfo );
        } else if(node.tagName === "LYTE-YIELD" && node._callee._contextSwitchInfo) {
        	isYieldContext = true;
        	contextSwitchInfo = node._callee._contextSwitchInfo;
        	var contextSwitchArray = [];
        	LyteComponent.changeContext(contextSwitchInfo.node, contextSwitchArray, contextSwitchInfo, true);
        }
        let nodeValue;
        if(node.helperValue){
            nodeValue = node.helperValue;
                    let helperFunc = nodeValue;
                    let dynamicValues = [];
                    let helperRetVal = this.processHelper({name : helperFunc.name, args : this.processArgs(this,helperFunc.args)}, node); 
                    nodeValue = helperRetVal;
                    if(helperFunc.name === "unescape") {
                        let oldDynamicPosition = node.dynamicPositions;
                        let oldStartingNode = oldDynamicPosition.startingNode;
                        let oldChldLen = oldDynamicPosition.length;
                        while(oldChldLen > 1) {
                            let next = oldStartingNode.nextSibling;
                            oldStartingNode.remove();
                            oldStartingNode = next;
                            oldChldLen--;
                        }
                        let childLen = nodeValue.childNodes.length;
                        if(!childLen) {
                            nodeValue.appendChild(document.createTextNode(""));
                            childLen = 1;
                        }
                        let startingNode = nodeValue.childNodes[0];
                        oldStartingNode.replaceWith.apply(oldStartingNode,nodeValue.childNodes);
                        let obj = {startingNode : startingNode, length: childLen};
                        node.dynamicPositions = obj;
                    }
        } else {
            let boundValue = node.syntaxValue;
            let path;
            if(boundValue.indexOf('.') !== -1 || boundValue.indexOf('[') !== -1) {
                path = boundValue;
                boundValue = boundValue.substring(0,boundValue.indexOf('.'));
            }
            let dynamicValues = [];
            let value = path ? LyteComponent.get(this.component.data, path, dynamicValues) : this.component.data[boundValue]; 
            if(multiplePropNode) {
                let prop = this.getProperty(dynamicValues[0]);
                let totalProp = this.getProperty(dynamicValues[0].substring(0, dynamicValues[0].indexOf('.')));
                let value = this.getData(dynamicValues[0].substring(0, dynamicValues[0].indexOf('.')));              
                if(multiplePropNode === "dynamicNodes") {
                    if(!prop._dynamicNodes) {
                        Object.defineProperty(prop, '_dynamicNodes', {
                            value: [],
                            enumerable: false, 
                            writable: true,
                            configurable: true
                        });
                    }
                    prop._dynamicNodes.push(node);
                } else {
                    if(!prop._helperNodes) {
                        Object.defineProperty(prop, '_helperNodes', {
                            value : new Set(), 
                            writable: true, 
                            enumerable: false,
                            configurable: true
                        });
                    }
                    prop._helperNodes.add(
                            multipleProp.helperNode
                    );
                    let dynamicProp = multipleProp.dynamicProp;
                    dynamicProp[prop._path] ? dynamicProp[prop._path].push(node): (dynamicProp[prop._path] = []).push(node);
                }
                LyteComponent.establishBindings(totalProp, value);
                node._multipleProperty.actProp = prop;
            }
            nodeValue = !typeof value === "boolean" && !typeof value === "number" ? (value? value : ""): value;
        }
        
        if(node.nodeType === 2) {
        	let parentNodes = [];
            let pN = node._parentNode ? node._parentNode :  node.ownerElement;
            if(pN.tagName === "TEMPLATE" && pN.getAttribute("is") === "component" && node.nodeName !== "component-name") {
            	let isKeepAlive = pN.hasAttribute("lyte-keep-alive");
            	if(isKeepAlive) {
            		for(var key in pN._renderedComponent) {
            			parentNodes.push(pN._renderedComponent[key]);
            		}
            	} else {
            		parentNodes.push(pN._renderedComponent[pN.getAttribute("component-name")]);
            	}
            } else {
            	parentNodes.push(pN);
            }
            for(let i=0;i<parentNodes.length;i++) {
            	let parentNode = parentNodes[i];
            	if(parentNode.set) {
                    parentNode.set(LyteComponent.String.toCamelCase(node.nodeName), nodeValue);
                    } else {
                        parentNode._initProperties = parentNode._initProperties || {};
                        parentNode._initProperties[LyteComponent.String.toCamelCase(node.nodeName)] = nodeValue;
                    }
                    
                    if(parentNode.tagName === "LYTE-YIELD" && parentNode.component.data && node.nodeName && parentNode.component.data[node.nodeName] !== nodeValue /*parentNode.getAttribute("is") === "insertYield"*/) {
                        LyteComponent.set(parentNode.component.data, LyteComponent.String.toCamelCase(node.nodeName), nodeValue, undefined, parentNode);
                    }
                    parentNode._attributes = parentNode._attributes || {};
                    //!== "string"
                    if(LyteComponent.isCustomElement(parentNode,true) && typeof nodeValue !== "string" && typeof nodeValue !== "undefined") {
                        if(node.ownerElement.nodeName === "TEMPLATE" && node.helperValue) {
                            if((node.ownerElement.getAttribute("is") ===  "for" && node.nodeName === "items") || (node.ownerElement.getAttribute("is") ===  "forIn" && node.nodeName === "object")) {
                                let oldValue = node.ownerElement._attributes[node.nodeName];
                                let newValue = nodeValue;
                                LyteComponent.removeSelectedBindingDeep(node.ownerElement._actualBinding, oldValue);
                                if(newValue) {
                                	if(!newValue._bindings) {
                                		 Object.defineProperty(newValue, '_bindings', {
                                             enumerable: false, 
                                             writable: true,
                                             value : new Set(),
                                             configurable: true
                                         });
                                	}
                                    newValue._bindings.add(node.ownerElement._actualBinding);
                                    LyteComponent.establishBindings(node.ownerElement._actualBinding, newValue);
                                }
                                if(node.nodeName === "object") {
                                    LyteComponent.removeSelectedBindingDeep(node.ownerElement._propBindingObject, oldValue);
                                }
                                //console.log("old Value ", oldValue, " new Value ", newValue);
                            }
                        }
                        parentNode.removeAttribute(node.nodeName);
                    } else {
                        if(typeof nodeValue === "boolean") {
                            parentNode._attributes = parentNode._attributes || {};
                            parentNode._attributes[node.nodeName] = nodeValue;
                            if(!nodeValue) {
                                parentNode.removeAttribute(node.nodeName);
                            } else {
                                parentNode.setAttribute(node.nodeName, "");
                            }
                        
                        } else {
                            nodeValue = typeof nodeValue === "object" ?((typeof Record != "undefined" && nodeValue instanceof Record) ? JSON.stringify(nodeValue.$.toJSON()) : JSON.stringify(nodeValue)) : nodeValue;
                            let locNodeVal = nodeValue === undefined ? "" : nodeValue;
                            if(node.nodeName === "style") {
                                node.ownerElement.setAttribute("style",locNodeVal);
                            } else {
                                node.nodeValue = locNodeVal;
                            }
                        }
                    }
                    parentNode._attributes[node.nodeName] = nodeValue;
                    if(/^(INPUT|TEXTAREA|SELECT)$/.test(parentNode.nodeName)) {
                        if(node.nodeName === "value") {
                            parentNode.value = nodeValue;
                        } else if(node.nodeName === "checked") {
                            parentNode.checked = nodeValue;
                        }
                    }
                    let isStopped = parentNode._isStopped;
                    let result;
                    switch(parentNode.getAttribute("is")) {
                        case "for" :
                            this.updateForHelper(parentNode, {"type" : "update"});
                            break;
                        case "if" : 
                            result = this.updateSwitchHelper("if",parentNode, undefined, true, true);
                            break;
                        case "forIn" : 
                            this.updateForInHelper(parentNode , {"type" : "update"});
                            break;
                        case "switch" :
                            this.updateSwitchHelper("switch",parentNode, undefined, true, true);
                            break;
                        case "component" : 
                            this.updateDynamicComponent(parentNode, "update");
                            break;
                        default:            
                    }
                	let handleBreakOptions;
                	if(isStopped &&  isStopped !== result) {
                		//console.log("new value is stopped");
                		if(!result) {
                			//console.log("new value is not stopped");
                			if(isStopped === "break") {
                				handleBreakOptions = "SM"
                			} else {
                				handleBreakOptions = "SS"
                			}
                		} else if(result === "break") {
                			handleBreakOptions = "MS";
                			//console.log("old value is continue and new value is break");
                		} else {
                			handleBreakOptions = "SM";
                			//console.log("old value is break and new value is continue");
                		}
                	} else if(result === "break") {
                		handleBreakOptions = "MS";
                		//console.log("old value not stopped and new value is break");
//                		this.handleBreak(parentNode._contextSwitchInfo, "break");
                	} else if(result === "continue") {
                		handleBreakOptions = "SS";
                		//console.log("old value not stopped and new value is continue");
//                		this.handleBreak1(parentNode._contextSwitchInfo , "continue");
                	}
                	if(handleBreakOptions) {
                		this.handleBreak(parentNode._contextSwitchInfo, handleBreakOptions);
                	}
            }
        }
        else {
            node.nodeValue = nodeValue === undefined ? '' : nodeValue;
        }
        if(contextSwitchInfo) {
            LyteComponent.removeContext(contextSwitchInfo.node, contextSwitchArray, contextSwitchInfo, isYieldContext);
        }
    }
    
    handleBreak(contextSwitchInfo, options) {
    	if(contextSwitchInfo) {
    		let forTemplate = contextSwitchInfo.node;
    		let breakIndex = contextSwitchInfo.itemIndex;
			let itemValue = forTemplate.getAttribute("item");
			let forContent = contextSwitchInfo.node._forContent;
			let endIndex = options[0] === "M" ? forContent.length : breakIndex + 1;
			for(let j=breakIndex;j<endIndex;j++) {
    			let currentForContent = forContent[j];
    			for(let i=0;i<currentForContent.length;i++) {
    				currentForContent[i].remove();
    				if(currentForContent[i]._forContent || currentForContent[i]._caseContent) {
    					this.removeHelpers(currentForContent[i]);
    				}
    			}	
    				forContent[j] = [];
    				LyteComponent.removeSelectedBindingDeep(forTemplate._items[j].itemProperty, forTemplate._attributes.items[j]);
    				forTemplate._helpers[j] = [];
    				forTemplate._items[j] = {"_dynamicProperty" : {}, "itemProperty" : {}, "indexProperty": {}};
    		}
			let length = forTemplate._attributes.items.length;
			if(options[1] === "M") {
				this.updateForHelper(forTemplate, {firstIndex : breakIndex, secondIndex : length - breakIndex, "type" : "replace"}, undefined, {});
			} else {
				this.updateForHelper(forTemplate, {firstIndex : breakIndex, secondIndex : 1, "type" : "replace"}, undefined, {});
			}
    	}
    }
    
    createCustomEvent(eventName, parentNode, actObj){
        const customEvent = new CustomEvent(eventName);
        parentNode._actions[eventName] = customEvent;
        parentNode._actions[eventName].processAction = actObj;
    }

    isEmptyString(str){
        return (!(typeof str === "string") || str === "" );
    }

    processArgs(scope,args,dynamicValues,event, node){
        let helpers , j ;
        dynamicValues = dynamicValues || [];
        args = (Array.isArray(args)) ? Array.from(args) : args;
        for(let i=0; i<args.length; i++){
            if(!this.isEmptyString(args[i])) {
                if(args[i].startsWith("'") && args[i].endsWith("'")){
                    args[i] = args[i].substr(1,args[i].length-2);       
                } else {
                    args[i] = args[i].trim();
                    let dynamicVals = [];
                    if(event) {
                    	if(args[i] === "event") {
                    		args[i] = event;
                    	} else if(args[i] === "this") {
                    		args[i] = node;
                    	} else {
                    		args[i] = LyteComponent.get(scope.component.data,args[i],dynamicVals);
                    	}
                    } else {
                    	args[i] = LyteComponent.get(scope.component.data,args[i],dynamicVals);
                    }
                    dynamicValues.push(dynamicVals);
                }
            } else if(args[i] && args[i].type){
                this.internalHelpers(scope,args,i,dynamicValues, event, node);
            }
        }
        return args;
    }
    
    internalHelpers(scope,args,i,dynamicValues, event, node){
        //helperFunc = this.constructor.getHelper(args[i]);
        let helperFunc = args[i].value;
        let helperVal =  this.processHelper({"name" : helperFunc.name, "args" : this.processArgs(scope,helperFunc.args,dynamicValues, event, node)});
        args[i] = helperVal;
   }
    
    processHelper(helperFunc, node){
        let args = [];
        if(helperFunc.name === "method") {
            args.push(this, node);
        }
        if(helperFunc.name === "lbind"){
        	args.push(node.ownerElement);
        }
        if(!Lyte.Component.registeredHelpers[helperFunc.name]){
            console.error("helper ",helperFunc.name," is not defined");
            return;
	}
        return Lyte.Component.registeredHelpers[helperFunc.name].apply(this,args.concat(helperFunc.args));
    }
    
    getActionProperty(prop){
        let hostProp = this._properties;
        let value = (hostProp)?hostProp[prop].value:undefined;
        return value;
    }
    
    hasInternalBindings(content){
        return content.match(/[(]{1}[^)]+[)]{1}/);
    }
    
    getArgValues(argNames, properties) {
        let argValueArray = [];
        for(let i=0;i<argNames.length;i++) {
            argValueArray.push(properties[argNames[i]].value);
        }
        return argValueArray;
    }
    
    createEventListeners(node,actionType,actObj){
        let self = this;
        node._callee = this;
        if(!/^(focus|focusin|focusout|resize|scroll|click|dblclick|mousedown|mouseup|mousemove|mouseover|mouseout|mouseenter|mouseleave|change|select|submit|keydown|keypress|keyup|contextmenu)$/.test(actionType)){
            let infoAttr = actionType.substr(2);
            let infoAttrVal = node.getAttribute(infoAttr);
            var evntListener = function(event) {
        		var toRemove;
                if(!window.event) {
                    window.event = event;
                    toRemove = true;
                }
                LyteComponent.throwAction.call(self,self,actionType.substr(2),actObj, undefined, undefined, node, event);
                if(toRemove) {
                    window.event = undefined;
                }
        	};
            if ((Lyte.Component.registeredComponents[node.localName] && !node.component) || (node.tagName === "TEMPLATE" && node.getAttribute("is") === "component")) {
            	node._toRegEvnts = node._toRegEvnts || {};
            	node._toRegEvnts[actionType.substr(2)] = {"listener" : evntListener , "attrVal" : this.tagName.toLowerCase()+" => "+actObj.name};
            } else {
            	node.setAttribute(infoAttr, this.tagName.toLowerCase()+" => "+actObj.name);
            	//Event is not in capture phase because, in capture phase, multiple event listeners in hierarchy are called from parent to child (since registration is done in that order)
            	node.addEventListener(actionType.substr(2), evntListener);
            }
            if(node.hasAttribute(actionType)){
            	node[actionType] = undefined;
            }
            node.removeAttribute(actionType);
        }
    }
    
    registerYields() {
        this._yields = {};
        let yields = this.querySelectorAll('template[is=registerYield],template[is=yield]');
        for(let i=0;i<yields.length;i++) {
            this._yields[yields[i].getAttribute("yield-name")] = yields[i];
        }
    }
    
    connectedCallback(){
        if(this.hasAttribute("lyte-rendered") || !Lyte.Component.registeredComponents[this.localName]) {
            return;
        }

        let templateAttributes = this.constructor._templateAttributes;
        if(templateAttributes && templateAttributes.attr) {
        	for(let key in templateAttributes.attr) {
//        		let attr = templateAttributes.attr[i];
				let attr = templateAttributes.attr[key];
        		if((!this.hasAttribute(attr.name) && !this.component.data.hasOwnProperty(attr.name) ) || attr.globalEvent) {
        			if(attr.globalEvent) {
                        this._evBoundEvents = this._evBoundEvents || {};
                        let actionName = attr.helperInfo.args[0];
					    let boundName;
					    if(actionName.startsWith('"') || actionName.startsWith("'")) {
						boundName = actionName.substring(1, actionName.length - 1);
					    } else {
						console.warn("Deprecation warning. Action name should be in quotes");
						boundName = actionName;
					    }
                        this._evBoundEvents[attr.name] = {"name" : boundName, "args" : attr.helperInfo.args, "from" : "component"};
                        let prevAttribute = this.getAttribute(attr.name);
                        let currentAttribute = this.constructor._template.getAttribute(attr.name);
                        //this.setAttribute("ev:"+attr.name, this.constructor._template.getAttribute(attr.name));
                        this.setAttribute(attr.name, currentAttribute + (prevAttribute ? " ; " + prevAttribute : ""));
                    } else {
                        attr.from = "component";
                        if(attr.staticValue) {
                            this.setAttribute(templateAttributes.attr[key].name, attr.staticValue);
                        } else {
                            this.setAttribute(templateAttributes.attr[key].name, "{{dummy}}");
                            this.bindNode(this.getAttributeNode(templateAttributes.attr[key].name), [], undefined, {}, templateAttributes.attr[key], undefined, undefined, true );
                        }
                    }
        			
        		}
        	}
        }
        for(let key in this._toRegEvnts) {
        	this.addEventListener(key, this._toRegEvnts[key].listener);
        	if(this.hasAttribute(key)) {
        		this.setAttribute(key, this.getAttribute(key) + " ; "+ this._toRegEvnts[key].attrVal);
        	} else {
        		this.setAttribute(key, this._toRegEvnts[key].attrVal);
        	}
        }
        this._toRegEvnts = {};
        let content =  this.afterConnected();
        LyteComponent.establishObserverBindings.call(this,this.constructor._observers);
        //this.establishObserverBindings();
        Object.defineProperty(this.component, '_bindings', {
            enumerable: false, 
            writable: true, 
            configurable: true,
            value : new Set()
        });
        this.component._bindings.add(this._properties);
        LyteComponent.establishBindings(this._properties, this.component.data);
        this.appendChild(content);
        if(this.tagName == "CRM-STAGEBOARD" || this.tagName === "TEST-COMPONENT5"){
          console.timeEnd(this.tagName);
        }
	    this.setAttribute("lyte-rendered", "");
        const customEvent = new CustomEvent("onReady");
        this.dispatchEvent(customEvent);
        this.callback("didConnect");
        this.onCallBack("didConnect");
    }
    onCallBack(name){
        let callbacks = this.constructor._callBacks[name];
        if(callbacks){
            for(let i=0;i<callbacks.length;i++){
                try{
                    callbacks[i].value.call(this.component);    
                } catch(e) {
                    console.error(e);
                }
                
            }
        }
    }
    callback(name){
        var func = this.component[name];
        if(func){
            try{
                func.apply(this.component);    
            } catch(e) {
                console.error(e);
            }
        }
    }
    establishObserverBindings() {
        let observers = this.constructor._observers;
        for(let i=0;i<observers.length;i++) {
            let props = observers[i].properties;
            for(let j=0;j<props.length;j++) {
                let actProp;
                let isArrayObserver = false;
                if(props[j].indexOf('.[]') !== -1) {
                    isArrayObserver = true;
                    actProp = this.getProperty(props[j].substring(0, props[j].indexOf('.[]')));
                } else {
                    actProp = this.getProperty(props[j]);
                }
                if(!actProp._observers) {
                    Object.defineProperty(actProp, '_observers', {
                        value : new Set(),
                        enumerable: false, 
                        writable: true,
                        configurable: true
                    });
                }
                actProp._observers.add({callee : this, observer: observers[i], isArrayObserver : isArrayObserver});
            }
        }
    }
    removeBindings(properties, actualData) {
        var del = "delete";
        for(let i in properties) {
            let actData = actualData[i];
            if(actData && actData._bindings) {
                actData._bindings[del](properties[i]);
                //Error while trying to delete _bindings from actData when actData is of type Array
                /*  if(!actData._bindings.size) {
                    delete actData._bindings;
                } */
            }
            if(typeof properties[i] === "object" && actData) {
                this.removeBindings(properties[i], actData);
            }
        }
    }
    disconnectedCallback() {
        if(LyteComponent.ignoreDisconnect) {
	       return;
	    }
	    this.component._bindings = null;
        LyteComponent.removeSelectedBindingDeep(this._properties, this.component.data);
//      LyteComponent.removeBindings(this._properties, this.component);
        for(let key in this._properties) {
            this._properties[key] = {};
        }
        this.callback('didDestroy');
        this.onCallBack('didDestroy');
	var self = this;
	//setTimeout added to delay setting component to null until the LyteYield’s disconnectedCallbacks have been called. 
        setTimeout(function() {
	 self.component.$node = null;
        self.component.__data = null;
        self.component.data.__component__ = null;
        self.component.data = null;
        self.component = null;
	self = null;
	 },0);
        this.constructor.activeInstances--;
    }
}

Function.prototype.on = function(){
    return {"type": "callBack", "value":(this.type === "observer") ? this.value:this , "properties":arguments, "observes":(this.type === "observer" ? this: undefined)}
}
Function.prototype.observes = function() {
    return {"type" : "observer", "value" : this, "properties" : arguments, "on":Function.prototype.on}
}
Function.prototype.computed = function() {
    return {"type" : "computed", "value" : this, "properties" : arguments}
}

 
let LyteComponent = {
        "customPropRegex" : "",
        "customPropHandlers" : [],
		"_registeredComponents" : {},
        "toBeRegistered" : [],
        "throwEvent" : function(eventName){
            let self = this.$node ? this.$node : this;
            const evt = self._actions? self._actions[eventName] : undefined; 
            let customArgs = [];        
            if(arguments.length > 1){        
                for(let i=1;i<arguments.length; i++){            
                    customArgs.push(arguments[i]);                
                    }        
                }
                //wait for release
                //eventName = LyteComponent.String.toCamelCase(eventName);
                LyteComponent.throwAction.call(self,self._callee,eventName,undefined,true,customArgs,self);
            if(this.$node) {
                self.dispatchEvent(evt? evt : new CustomEvent(eventName, {"detail" : customArgs}));
            }
        },
        //this and scope reference should be either a node or a route.
        "throwAction" : function(scope,eventName,actObj,isCustom,customArgs, node, event, hasHandled){
            let actionsObj;
            if(this._route && isCustom) {
                scope = this._route;
                actionsObj = scope.actions || (scope.actions = {});
            } else if(this.routeName) {
                //process for the parent route and get the current component and proceed;
                let parentRoute = this.parent;
                if(parentRoute) {
                    if(parentRoute.component) {
                        scope = parentRoute.component;
                        actionsObj = scope.constructor._actions; 
                    } else {
                        scope = parentRoute;
                        actionsObj =  scope.actions || (scope.actions = {});            
                    }
                }
            } else if(scope){
                    actionsObj = scope.constructor._actions
            }
            if(!scope) {
                //Only warning is thrown because, we can have a eventListener for the dom directly. 
                if(!hasHandled) {
                    console.warn("Nothing handled the action "+ eventName + ".");    
                }
                return;
            }
            actObj = (actObj) ? actObj : this._actions && this._actions[eventName]? this._actions[eventName].processAction : void 0;     
            //wait for release
            /* 
            var dasherizedEventName = LyteComponent.String.dasherize(eventName);
            actObj = (actObj) ? actObj : this._actions && this._actions[dasherizedEventName]? this._actions[dasherizedEventName].processAction : void 0;     
            */
            let args = customArgs ? customArgs : [];
            if(actObj){
            	var contextSwitchArray = [];
                if(node) {
                	LyteComponent.newAddContext(node, contextSwitchArray);
                }
                args.splice.apply(args, [0,0].concat(this.processArgs(scope,actObj.args, undefined, event, node)));
                if(node) {
                	LyteComponent.newRemoveContext(node, contextSwitchArray);
                }
                if(actionsObj[actObj.name]){
                    if(!isCustom){  
                        //args.unshift(window.event);
                        let parent = node.parentNode;
                        let val = actionsObj[actObj.name].apply(this.component,args);
                        hasHandled = true;   
                        if(val !== false){
                        	if(actObj.from && node.getAttribute(event.type) && node._boundEvents && node._boundEvents[event.type]) {
                        		let actions = node._callee.constructor._actions;
                        		let actObj = node._boundEvents[event.type];
                        		let cloneActObj = Lyte.deepCopyObject(actObj);
		                        cloneActObj.args.shift();
                        		LyteComponent.throwAction.call(node._callee,node._callee,event.type,cloneActObj, undefined, undefined, node, event, hasHandled);
                        	} else {
                        		if(LyteComponent.isCustomElement(node)){
                        			scope = parent;
                        		}
                        		if(parent){
                        			while(parent && !parent.getAttribute(eventName) && parent.tagName != "BODY"){
                        				parent = parent.parentNode;
                        			}
                        			if(!parent || parent.tagName === "BODY"){
                        				return;
                        			}
                        			if(!parent._callee){
                        				parent._callee = parent.getCallee ? parent.getCallee(parent) : this.getCallee(parent);
                        			}
                        			if(parent && event.type === eventName && !event.cancelBubble){
                                       if(parent._evBoundEvents && parent._evBoundEvents[eventName]) {
                                           let actObj = parent._evBoundEvents[eventName];
                        		           let cloneActObj = Lyte.deepCopyObject(actObj);
		                                   cloneActObj.args.shift();
                                           LyteComponent.throwAction.call(parent._callee,parent._callee,eventName,cloneActObj,undefined,undefined,parent,event, hasHandled);  
                                       } else if(parent && parent._boundEvents && parent._boundEvents[eventName]) {
                                           let actObj = parent._boundEvents[eventName];
                        		           let cloneActObj = Lyte.deepCopyObject(actObj);
		                                   cloneActObj.args.shift();
                                           LyteComponent.throwAction.call(parent._callee,parent._callee,eventName,cloneActObj,undefined,undefined,parent,event, hasHandled);  
                                       } 
                        			}
                        		}
                        	}
                        }
                    }            
                    else{                
                        actionsObj[actObj.name].apply(this._callee.component,args);
                        hasHandled = true;                                             
                    } 
                }
                else{
                    console.error("Action named " + actObj.name + " doesn't exist");
                }
            } else if(isCustom) {
                var eventsObj = actionsObj[eventName]  || actionsObj[LyteComponent.String.toCamelCase(eventName)] || actionsObj[LyteComponent.String.dasherize(eventName)];
                if(eventsObj) {
                    var scopeS = LyteComponent.isCustomElement(scope) ? scope.component : scope;   
                    let val = eventsObj.apply(scopeS, args);
                    //let val = eventsObj.apply(LyteComponent.isCustomElement(scope)? scope.component : scope, args);
                    hasHandled = true;
                    if(val !== false) {
                        LyteComponent.throwAction.call(scope, scope._callee, eventName, actObj, isCustom, customArgs, undefined, undefined, hasHandled);
                    }
                } else {
                    LyteComponent.throwAction.call(scope, scope._callee, eventName, actObj, isCustom, customArgs, undefined, undefined, hasHandled);
                }
            }
            
        },
        "processHelperArgs" : function(){
            
        },
        "isControlHelper" : function(ownerElement) {
        	return ownerElement.tagName === "TEMPLATE" && ownerElement.getAttribute("is") && ownerElement.getAttribute("is") !== "component";
        },
        "isCustomElement" : function(node, isTemplate) {
            return (node.tagName ==="TEMPLATE" && isTemplate )  || (node.nodeName && node.nodeName.indexOf('-') !== -1 && (Lyte.Component.registeredComponents[node.localName] || node.tagName === "LYTE-YIELD"));
        },
        "componentSet" : function(key, value, forceExecute) {
            if(!forceExecute && this.get(key) === value) {
                return;
            }
            //temporary fix
            LyteComponent.set(this.data, key, value, undefined, this.$node);
        },
        "componentGet" : function(key) {
            return key ? LyteComponent.get(this.data, key) : this.data;
        },
        "nodeGet" : function(key) {
            return key ? this.component.get(key) : this.component.data;
        },
        "nodeSet" : function(key, value) {
            this.component.set(key, value);
        },
        "registerComponent" : function(componentName, definition, options) {
            if(Lyte.Component.registeredComponents[componentName]) {
            console.warn("Component "+ componentName + " already registered");
            return;
            }
            let customCrmComponent;
            if(LyteComponent._registeredComponents[componentName]) {
            	customCrmComponent = LyteComponent._registeredComponents[componentName];
            } else {
            	customCrmComponent = class extends customElementPrototype {}
                customCrmComponent._properties = {};
                customCrmComponent.activeInstances = 0;
                customCrmComponent.prototype.get = this.nodeGet;
                customCrmComponent.prototype.set = this.nodeSet;
                customCrmComponent.prototype.throwAction = this.throwAction;
            }
            options = options ? options : {};
            let mixinsToBeUsed = [];
            if(options.mixins) {
                options.mixins.forEach(function(mixin) {
                    mixinsToBeUsed.push(Lyte.registeredMixins[mixin]);
                });
            }
            
            function Component() {}
            customCrmComponent.component = Component;
            Component.prototype.set = this.componentSet;
            Component.prototype.get = this.componentGet;
            Component.prototype.throwEvent = this.throwEvent;
            Component.prototype.executeMethod = LyteComponent.executeMethod;
            Component.prototype.getData = LyteComponent.componentGetData;
            Component.prototype.setData = LyteComponent.componentSetData;
            Component.prototype.getMethods = LyteComponent.componentGetMethods;
            Component.prototype.setMethods = LyteComponent.componentSetMethods;
            customCrmComponent._mixins = options.mixins;
            let mixinslen = mixinsToBeUsed.length;
            for(let i=0; i<mixinslen ; i++) {
                for(let item in mixinsToBeUsed[i]){
                        Component.prototype[item] = mixinsToBeUsed[i][item];
                }
            }
            customCrmComponent._actions = definition.actions? definition.actions : {};
            customCrmComponent._template = definition._template;
            delete definition._template;
            customCrmComponent._dynamicNodes = definition._dynamicNodes;
            delete definition._dynamicNodes;
            customCrmComponent._templateAttributes = definition._templateAttributes;
            delete definition._templateAttributes;
            customCrmComponent._callBacks = {};
            customCrmComponent._observers = [];
//            let properties = definition.data ? definition.data : {};
            let properties = definition.data ? definition.data : undefined;
            let methods = definition.methods ? definition.methods: {};
//            customCrmComponent._observedAttributes = Object.keys(properties);
            customCrmComponent._observedAttributes = definition._observedAttributes || [];
            customCrmComponent._observedMethodAttributes = definition._observedMethodAttributes || {};
            delete definition._observedAttributes;
            delete definition._observedMethodAttributes;
            delete definition.data;
            delete definition.methods;
            for(let key in definition) {
                if(definition[key].type === "observer") {
                        customCrmComponent._observers.push(definition[key]);
                } else if(definition[key].type === "callBack"){
                    let props = definition[key].properties;
                    for(var k=0;k<props.length;k++){
                        if(!customCrmComponent._callBacks[props[k]]){
                            customCrmComponent._callBacks[props[k]] = [];
                        }
                        customCrmComponent._callBacks[props[k]].push(definition[key]);
                    }
                    if(definition[key].observes){
                        customCrmComponent._observers.push(definition[key].observes);
                    }
                } 
                else {
                        Component.prototype[key] = definition[key];
                }
            }
//          for(let key in properties) {
//              Component.prototype[key] = properties[key];
//          }
            customCrmComponent._data = properties;
            customCrmComponent._methods = methods;
            customCrmComponent._registerComponent(componentName,customCrmComponent);
            Lyte.Component.registeredComponents[componentName] = true;
            if(!LyteComponent._registeredComponents[componentName]) {
            	if (document.readyState === "complete" || document.readyState === "interactive") {     
            		// document is already ready to go
            		customElements.define(componentName, customCrmComponent);
            	}
            	else{
            		LyteComponent.toBeRegistered.push({name:componentName, def: customCrmComponent});
            	}
            }
            LyteComponent._registeredComponents[componentName] = customCrmComponent;
        },
        "registerHelper" : function(name,helper){
            Lyte.Component.registeredHelpers[name] = helper;
        },
        "registerMixin" : function(name,mixin){
            Lyte.Mixin.register.call(Lyte, name, mixin);
        },
        "update":function(object, property, value, fromStore,oldValue,setterScope, actualProperty){
        	let fromComponent = object.__component__;
        	if(!oldValue){
                oldValue = object[property];
                if(!object.hasOwnProperty(property) && !(object instanceof Array)) {
                    LyteComponent.objectFunctions(object, "add", property, value, true)
                }
                if(fromComponent && fromComponent.tagName !== "LYTE-YIELD") {
                	let error = Lyte.validate(object, property, value, fromComponent.component);
                	if(error) {
                		LyteComponent.set(fromComponent.component.data.errors, property, error);
                		return;
                	} else {
                		if(fromComponent.component.data.errors[property]) {
                			Lyte.objectUtils(fromComponent.component.data.errors, "delete", property);
                		}
	                	object[property] = value;
                	}
                } else {
                	object[property] = value;
                }
            }
            let toBeExecuted = fromComponent ? true : false;
            if(fromComponent && actualProperty && typeof value === "string" && fromComponent.getAttribute(LyteComponent.String.dasherize(property)) !==  value) {
                let dasherizedAttr = LyteComponent.String.dasherize(property);
                 if(!LyteComponent.customPropRegex.exec(property) || fromComponent.hasAttribute(dasherizedAttr)) {
                    fromComponent.setAttribute(LyteComponent.String.dasherize(property), value);
                 }
            }
            if(value && typeof value !== "string" && typeof value !== "boolean" && typeof value !== "number" ) {
                //newValue is of type object 
                
                if(oldValue && typeof oldValue === "object" && oldValue._bindings) {
                    //Both oldValue and newValue are objects. 
                    if(!value._bindings) {
                        Object.defineProperty(value, '_bindings', {
                            enumerable: false, 
                            writable: true, 
                            value : new Set(),
                            configurable: true
                        });
                    }
                    //for changing only child component
                    if(fromComponent && fromComponent.component.data === object && property.indexOf('.')=== -1) {
                        let bindings = fromComponent.getProperty(property);
                        this.removeSelectedBindingDeep(bindings, oldValue);
                        value._bindings.add(bindings);
                        this.establishBindings(bindings, value);
                        //For removing binding in the object due to forIn Helper ( actual object binding and not the _dynamicNodes binding).
                        if(bindings._forHelpers) {
                            let bindfor = bindings._forHelpers.toArrayLyte();
                            for(var i=0;i<bindfor.length;i++){
                                let item = bindfor[i];
                                if(item._propBindingObject) {
                                    this.removeSelectedBindingDeep(item._propBindingObject, oldValue);
//                                  value._bindings.add(item._propBindingObject);
//                                  this.establishBindings(item._propBindingObject, value);
                                }
                            }
                        }
                        this.affectChanges(bindings,undefined,oldValue,setterScope,object[property]);
                    } else {
                    	//To change only the bindings present in the object and not all the bindings present in the oldValue.
                    	if(object._bindings) {
                    		let oldbind = object._bindings.toArrayLyte();
                            for(let i=0; i<oldbind.length;i++){
                                let item = oldbind[i][property];
                                if(item) {
                                	this.removeSelectedBindingDeep(item, oldValue);
                                	value._bindings.add(item);
                                	this.establishBindings(item, value);
                                	//For removing binding in the object due to forIn Helper ( actual object binding and not the _dynamicNodes binding).
                                	if(item._forHelpers) {
                                		let forbind = item._forHelpers.toArrayLyte();
                                		for(let j=0;j<forbind.length;j++){
                                			let itemBinding = forbind[j];
                                			if(itemBinding._propBindingObject) {
                                				this.removeSelectedBindingDeep(itemBinding._propBindingObject, oldValue);
                                			}
                                		}
                                	}
                                	this.affectChanges(item,undefined,oldValue,setterScope,object[property]);
                                }
                            }
                    	}
                    
                    
                    }
                } else {
                    //newValue is object and oldValue is string. Hence establish bindings from oldValue's object and place it in the newValue. 
                    if(object._bindings) {
                        if(!value._bindings) {
                            Object.defineProperty(value, "_bindings", {
                                enumerable: false, 
                                writable: true, 
                                value : new Set(),
                                configurable: true
                            });
                        }
                        let objbind = object._bindings.toArrayLyte();
                        for(let i=0;i<objbind.length;i++){
                            let item = objbind[i];
                            if(item[property]) {
                                value._bindings.add(item[property]);
                                this.establishBindings(item[property], value);
                                this.affectChanges(item[property],undefined,oldValue,setterScope,object[property]);
                            }
                        }
                    }
                }
            } else {
                //newValue is string
                
                if(oldValue && typeof oldValue === "object" && oldValue._bindings) {
                    //newValue is string and oldValue is object 
                    let objbind = object._bindings.toArrayLyte();
                    for(let i=0;i<objbind.length;i++){
                        let item = objbind[i];
                        if(item[property]) {
                            //oldValue._bindings.delete(item[property]);
                            //if(oldValue._bindings.size === 0) {
                            //  delete oldValue._bindings;
                            //  break;
                            //}
                        this.removeSelectedBindingDeep(item[property], oldValue);
                            if(item[property]._forHelpers) {
                                let forbind = item[property]._forHelpers.toArrayLyte();
                                for(let j=0;j<forbind.length;j++){
                                    let itemBinding =forbind[j];
                                    if(itemBinding._propBindingObject) {
                                        this.removeSelectedBindingDeep(itemBinding._propBindingObject, oldValue);
                                    }
                                }
                            }
                        }
                    }
                }
                
                //when newValue and oldValue , both are string, no need to change bindings. 
                if(object._bindings) {
                    let objbind = object._bindings.toArrayLyte();
                    for(let i=0;i<objbind.length;i++){
                        let item = objbind[i];
                        if(item[property]) {
                            this.affectChanges(item[property],undefined,oldValue,setterScope,object[property]);
                        }
                    }
                }
            }
            if(toBeExecuted && fromComponent._attributeDetails && fromComponent._callee) {
            	//let syntaxValue = fromComponent.getAttributeNode(property).syntaxValue;
            	let attrDetail = fromComponent._attributeDetails[LyteComponent.String.dasherize(property)];
            	let syntaxValue;
            	if(attrDetail && attrDetail.isLbind) {
            		syntaxValue = attrDetail.dynamicValue;
            	}
            	if(syntaxValue) {
            		let contextSwitchArray;
            		if(fromComponent._contextSwitchInfo) {
            			contextSwitchArray = [];
            			LyteComponent.changeContext(fromComponent._contextSwitchInfo.node, contextSwitchArray, fromComponent._contextSwitchInfo )
            		}
            		let obj = LyteComponent.getNew(fromComponent._callee.component.data, syntaxValue);
            		let exec = false;
            		if(obj.context === fromComponent._callee.component.data) {
            			if(fromComponent._callee._properties[obj.lastKey] && fromComponent._callee._properties[obj.lastKey].__fromComponent) {
            				exec = true;
            			}
            		} else {
            			exec = true;
            		}
            		//self.setData(this._lbind,this.value);
            		if(exec) {
            			LyteComponent.set(obj.context, obj.lastKey, value, undefined, fromComponent._callee);
            		}
            		if(contextSwitchArray) {
            			LyteComponent.removeContext(fromComponent._contextSwitchInfo.node, contextSwitchArray, fromComponent._contextSwitchInfo )
            		}
            	}
            }
        },
        "set" : function(object, property, value, fromStore) {
            if(typeof property === "string" && object[property] === value) {
        		return;
        	}
            let lastIndex = -1;
            let actualProperty = property;
            if(!(property instanceof Object)){
                lastIndex = property.lastIndexOf('.');
            }
            if(lastIndex !== -1) {
                let outerPropertyPath = property.substring(0, lastIndex);
                property = property.substring(lastIndex + 1);
                object = LyteComponent.get(object, outerPropertyPath);
            }
            let oldValues = [];
            if(object._setterScope){
                var setterScope = object._setterScope;
            }
            actualProperty = actualProperty === property ? actualProperty : undefined
            if(property instanceof Object){
            	if(Lyte.isRecord(object) && !fromStore) {
                        for(let key in property){
                            if(Array.isArray(object[key])){
                                oldValues.push({key:key,oldValue:object[key].slice(0)});    
                            }
                            else{
                                oldValues.push({key:key,oldValue:object[key]});
                            }
                        }
                        let record = store.$.setData(object.$, property);
                        if(record.$.isError){
                            return record;
                        }
                        for(let i=0; i<oldValues.length; i++){
                            LyteComponent.update(object,oldValues[i].key,object[oldValues[i].key],fromStore,(oldValues[i].oldValue === undefined)?null:oldValues[i].oldValue ,setterScope, actualProperty);
                        }
                } else {
                    //object[property] =  value;
                    for(let key in property){
                        LyteComponent.update(object,key,property[key],fromStore,undefined,setterScope, actualProperty);
                    }
                }
            }
            else{
                if(Lyte.isRecord(object) && !fromStore) {
                    let old = object[property];
                    let record = store.$.setData(object.$, property,value);
                    if(record.$.isError){
                        return record;
                    }
                    //Commented because update will happend when "set" is called from setData of store. 
                    //LyteComponent.update(object,property,value,fromStore,(old === undefined) ? null : old,setterScope , actualProperty);    
                } else {
                    LyteComponent.update(object,property,value,fromStore,undefined,setterScope,actualProperty);
                }
            }
        },
        "newAddContext" : function(node, contextSwitchArray) {
        	let isYield = node.tagName === "LYTE-YIELD";
        	if(node._contextSwitchInfo) {
        		LyteComponent.changeContext(node._contextSwitchInfo.node, contextSwitchArray, node._contextSwitchInfo, isYield);
        	} else if(isYield && node._callee._contextSwitchInfo) {
        		LyteComponent.changeContext(node._callee._contextSwitchInfo.node, contextSwitchArray, node._callee._contextSwitchInfo, true);
        	}
        }, 
        "newRemoveContext" : function(node, contextSwitchArray) {
        	let isYield = node.tagName === "LYTE-YIELD";
        	if(node._contextSwitchInfo) {
        		LyteComponent.removeContext(node._contextSwitchInfo.node, contextSwitchArray, node._contextSwitchInfo, isYield);
        	} else if(isYield && node._callee._contextSwitchInfo) {
        		LyteComponent.removeContext(node._callee._contextSwitchInfo.node, contextSwitchArray, node._callee._contextSwitchInfo, true);
        	}
        },
        "changeContext" : function(node, contextSwitchArray, contextSwitchInfo, proceedFurther) {
            if(!contextSwitchInfo) {
                return;
            }
            if(node._contextSwitchInfo) {
                LyteComponent.changeContext(node._contextSwitchInfo.node, contextSwitchArray, node._contextSwitchInfo, node.tagName === "LYTE-YIELD" || proceedFurther);
            } else if((node.tagName === "LYTE-YIELD" || proceedFurther) && node._callee && node._callee._contextSwitchInfo) {
            	LyteComponent.changeContext(node._callee._contextSwitchInfo.node, contextSwitchArray, node._callee._contextSwitchInfo);
            }
            let indexValue, itemValue;
            if(contextSwitchInfo.type) {
                if(contextSwitchInfo.type === "for") {
                    indexValue = node.getAttribute("index");
                    itemValue = node.getAttribute("item");
                    if(node._items.length === 0) {
                        return;
                    }
                } else {
                    indexValue = node.getAttribute("key");
                    itemValue = node.getAttribute("value");
                    if(Object.keys(node._items).length === 0) {
                        return;
                    }
                }
                let callee = node._callee;
                let initialItemValue = callee.component.data[itemValue];
                let initialIndexValue = callee.component.data[indexValue];
                let initialItemProp = callee._properties[itemValue];
                let initialIndexProp = callee._properties[indexValue];
                let items = contextSwitchInfo.type === "for" ? node._attributes.items : node._attributes.object;
                callee.component.data[itemValue] = items[contextSwitchInfo.itemIndex];
                callee.component.data[indexValue] = contextSwitchInfo.itemIndex;
                callee._properties[itemValue] = node._items[contextSwitchInfo.itemIndex].itemProperty;
                callee._properties[indexValue] = {};
                let dummyObject = {"initialItemValue" : initialItemValue , "initialIndexValue" : initialIndexValue, "initialItemProp" : initialItemProp, "initialIndexProp" : initialIndexProp};
                contextSwitchArray.push(dummyObject);
            } else {
                //handling for yield
                let dummyObject = {};
                let callee = node._callee._callee;
                Object.keys(contextSwitchInfo.node._properties).forEach(function(key) {
                    dummyObject[key] = {};
                    dummyObject[key].value = callee.component.data[key];
                    dummyObject[key].property = callee._properties[key];
                    callee._properties[key] = contextSwitchInfo.node._properties[key];
                    callee.component.data[key] = contextSwitchInfo.node.component.data[key];
                }); 
                contextSwitchArray.push(dummyObject);
            }
        },
        "removeContext" : function(node, contextSwitchArray, contextSwitchInfo, proceedFurther) {
            if(!contextSwitchInfo) {
                return;
            }
            if(node._contextSwitchInfo) {
                LyteComponent.removeContext(node._contextSwitchInfo.node, contextSwitchArray, node._contextSwitchInfo, node.tagName === "LYTE-YIELD" || proceedFurther);
            } else if((node.tagName === "LYTE-YIELD" || proceedFurther) && node._callee && node._callee._contextSwitchInfo) {
            	LyteComponent.removeContext(node._callee._contextSwitchInfo.node, contextSwitchArray, node._callee._contextSwitchInfo)
            }
            let indexValue, itemValue;
            if(contextSwitchInfo.type) {
                if(contextSwitchInfo.type === "for") {
                    indexValue = node.getAttribute("index");
                    itemValue = node.getAttribute("item");
                    if(node._items.length === 0) {
                        return;
                    }
                } else {
                    indexValue = node.getAttribute("key");
                    itemValue = node.getAttribute("value");
                    if(Object.keys(node._items).length === 0) {
                        return;
                    }
                }
                let callee = node._callee;
                let items = node._attributes.items;
                let removedObject = contextSwitchArray.shift();
                callee.component.data[itemValue] = removedObject.initialItemValue;
                callee.component.data[indexValue] = removedObject.initialIndexValue;
                callee._properties[itemValue] = removedObject.initialItemProp;
                callee._properties[indexValue] = removedObject.initialIndexProp;
            } else {
                let callee = node._callee._callee;
                let removedObject = contextSwitchArray.shift();
                Object.keys(contextSwitchInfo.node._properties).forEach(function(key) {
                    callee.component.data[key] = removedObject[key].value;
                    callee._properties[key] = removedObject[key].property;
                });
            }
        },
        "objectFunctions" : function() {
            let object = arguments[0];
            let functionName = arguments[1];
            let property = arguments[2];
            let newValue = arguments[3];
            let fromComponent = arguments[4];
            if(functionName === "add" && !fromComponent) {
            	LyteComponent.set(object, property, newValue);
            	return;
            }
            let options = {};
            options.type = functionName;
            options.property = property;
            if(!/^(add|delete)$/.test(functionName)) {
                console.error("No such function exists in objectFunctions");
                return;
            }
            let bindings = object._bindings;
            if(functionName === "delete") {
            	LyteComponent.set(object, property, undefined);
            }
            if(bindings) {
                let bind = bindings.toArrayLyte();
                for(let i=0;i<bind.length;i++) {
                    let binding = bind[i];
                    let forHelpers = binding._forHelpers;
                    if(forHelpers) {
                    	let helperBind = forHelpers.toArrayLyte();
                        for(let j=0;j<helperBind.length;j++) {
                            let forHelper = helperBind[j];
                            let itemValue = forHelper.getAttribute("key");
                            //Need to check
//                            LyteComponent.removeSelectedBindingDeep({[itemValue] :                        forHelper._items[property].itemProperty}, {[itemValue] : object[property]});
                        	let contextSwitchArray = [];
                            if(functionName === "add") {
                            	LyteComponent.newAddContext(forHelper, contextSwitchArray);
                            }
                            forHelper._callee.updateForInHelper(forHelper, options);
                            if(functionName === "add") {
                                LyteComponent.newRemoveContext(forHelper, contextSwitchArray);
                            }
                        }
                    }
                }
            }
            if(functionName === "delete") {
                delete object[property];
            }
        },
        "arrayFunctions" : function() {
            let array = arguments[0];
            let functionName = arguments[1];
            if(/^(replaceAt|removeAt|shift)$/.test(functionName) && !array.length) {
                console.warn(functionName + " operation cannot be performed on empty array");
                return;
            }
            switch(functionName) {
            case "replaceAt" : 
                {
                let index = parseInt(arguments[2]);
                if(index > array.length) {
                    console.warn("index provided for replaceAt is greater than array length");
                    return [];
                }
                //let args = Array.prototype.slice.call(arguments, 3);
                let args = arguments[3];
                if(!(args instanceof Array)) {
                    args = [args];
                }
                let deletedItems = array.splice.apply(array, [index, 1].concat(args));
                let options = {"firstIndex" : index, "secondIndex" : args.length, "type" : "replace"};
                //All references updated by now
                
                //remove binding from previous object
                if(array._bindings) {
                    let objbind = array._bindings.toArrayLyte();
                    for(let i=0;i<objbind.length;i++){
                        let item = objbind[i];
                        if(item._forHelpers) {
                            let helperbind = item._forHelpers.toArrayLyte();
                            for(let j=0;j<helperbind.length;j++){
                                let helper = helperbind[j];
                                let finalIndex = index + deletedItems.length;
                                let itemValue = helper.getAttribute("item");
                                for(let i=index, j=0;i<finalIndex;i++,j++) {
                                    LyteComponent.removeSelectedBindingDeep({[itemValue] : helper._items[i].itemProperty}, {[itemValue] : deletedItems[j]});
                                }
                                let contextSwitchArray = [];
                                LyteComponent.newAddContext(helper, contextSwitchArray);
                                helper._callee.updateForHelper(helper, options);
                                LyteComponent.newRemoveContext(helper, contextSwitchArray);
                            }
                        }
                        for(let key in item) {
                            let parsedKey = parseInt(key);
                            if(!isNaN(parsedKey) && parsedKey >= options.firstIndex) {
                                let diff = parsedKey - options.firstIndex;
                                let oldObject;
                                if(diff <= options.thirdIndex) {
                                    oldObject = deletedItems[diff];
                                } else {
                                    oldObject = array[options.firstIndex - 1  + options.secondIndex + diff];
                                }
                                this.removeSelectedBindingDeep(item[key], oldObject);
                                if(item[key]._forHelpers) {
                                    let bindfor = item[key]._forHelpers.toArrayLyte();
                                    for(var j=0;j<bindfor.length;j++){
                                        let item1 = bindfor[j];
                                        if(item1._propBindingObject) {
                                            this.removeSelectedBindingDeep(item1._propBindingObject, oldObject);
//                                          value._bindings.add(item._propBindingObject);
//                                          this.establishBindings(item._propBindingObject, value);
                                        }
                                    }
                                }
                                if(array[parsedKey] && typeof array[parsedKey] === "object") {
                                    if(!array[parsedKey]._bindings) {
                                        Object.defineProperty(array[parsedKey], '_bindings', {
                                            enumerable: false, 
                                            writable: true, 
                                            value : new Set(),
                                            configurable: true
                                        });
                                    }
                                this.establishBindings({"dummy" : item[key]},{"dummy" : array[parsedKey]});
                                }
                                this.affectChanges(item[key]);
                            }
                        }
                    }
                }
                LyteComponent.callArrayObservers(array,{type:"array",insertedItems:args,index:index});
                return deletedItems[0];
                }
                break;
            case "splice" : {
                let index = parseInt(arguments[2]);
                if(index > array.length) {
                    console.warn("index provided for replaceAt is greater than array length");
                    return [];
                }
                //let args = Array.prototype.slice.call(arguments, 3);
                let toBeDeleted = arguments[3];
                let args = arguments[4];
                if(!(args instanceof Array)) {
                    args = [args];
                }
                let deletedItems = array.splice.apply(array, [index, toBeDeleted].concat(args));
                let options = {"firstIndex" : index, "secondIndex" : args.length, "thirdIndex" : toBeDeleted, "type" : "splice"};
                //All references updated by now
                
                //remove binding from previous object
                if(array._bindings) {
                    let objbind = array._bindings.toArrayLyte();
                    for(let i=0;i<objbind.length;i++){
                        let item = objbind[i];
                        if(item._forHelpers) {
                            let helperbind = item._forHelpers.toArrayLyte();
                            for(let j=0;j<helperbind.length;j++){
                                let helper = helperbind[j];
                                let finalIndex = index + deletedItems.length;
                                let itemValue = helper.getAttribute("item");
                                for(let i=index, j=0;i<finalIndex;i++,j++) {
                                    LyteComponent.removeSelectedBindingDeep({[itemValue] : helper._items[i].itemProperty}, {[itemValue] : deletedItems[j]});
                                }
                                let contextSwitchArray = [];
                                LyteComponent.newAddContext(helper, contextSwitchArray);
                                helper._callee.updateForHelper(helper, options);
                                LyteComponent.newRemoveContext(helper, contextSwitchArray);
                            }
                        }
                        for(let key in item) {
                            let parsedKey = parseInt(key);
                            if(!isNaN(parsedKey) && parsedKey >= options.firstIndex) {
                                let diff = parsedKey - options.firstIndex;
                                let oldObject;
                                if(diff <= options.thirdIndex) {
                                    oldObject = deletedItems[diff];
                                } else {
                                    oldObject = array[options.firstIndex - options.thirdIndex  + options.secondIndex + diff];
                                }
                                this.removeSelectedBindingDeep(item[key], oldObject);
                                if(item[key]._forHelpers) {
                                    let bindfor = item[key]._forHelpers.toArrayLyte();
                                    for(var j=0;j<bindfor.length;j++){
                                        let item1 = bindfor[j];
                                        if(item1._propBindingObject) {
                                            this.removeSelectedBindingDeep(item1._propBindingObject, oldObject);
//                                          value._bindings.add(item._propBindingObject);
//                                          this.establishBindings(item._propBindingObject, value);
                                        }
                                    }
                                }
                                if(array[parsedKey] && typeof array[parsedKey] === "object") {
                                    if(!array[parsedKey]._bindings) {
                                        Object.defineProperty(array[parsedKey], '_bindings', {
                                            enumerable: false, 
                                            writable: true, 
                                            value : new Set(),
                                            configurable: true
                                        });
                                    }
                                this.establishBindings({"dummy" : item[key]},{"dummy" : array[parsedKey]});
                                }
                                this.affectChanges(item[key]);
                            }
                        }
                    }
                }
                LyteComponent.callArrayObservers(array,{type:'array',index:index,insertedItems:args, removedItems:deletedItems});
                return deletedItems;
            }
            break;
            case "push" : 
                {
                let toPush = arguments[2];
                if(!(toPush instanceof Array)) {
                    toPush = [toPush];
                }
                LyteComponent.arrayFunctions(array, 'insertAt', array.length, toPush);
                }
                break;
            case "pop" : 
                   return LyteComponent.arrayFunctions(array, 'remove', array.length -1)[0];
                break;
            case "shift" : 
            case "shiftObject" :
                  return LyteComponent.arrayFunctions(array, 'remove', 0)[0];
                  break;
            case "removeAt" : 
            case "remove" : 
                {
                let index = parseInt(arguments[2]);
                if(index > array.length) {
                    console.warn("index provided for removeAt is greater than array length");
                    return [];
                }
                let length = arguments[3] ? parseInt(arguments[3]) : 1;
                let options = {"firstIndex" : index, "secondIndex" : length, "type" : "remove"};
                let deletedItems = array.splice(index,length);
                if(array._bindings) {
                    let objbind = array._bindings.toArrayLyte();
                    for(let i=0;i<objbind.length;i++){
                        let item = objbind[i];
                        if(item._forHelpers) {
                            let helperbind = item._forHelpers.toArrayLyte();
                            for(let j=0;j<helperbind.length;j++){
                                let helper = helperbind[j];
                                let finalIndex = index + deletedItems.length;
                                let itemValue = helper.getAttribute("item");
                                for(let i=index, j=0;i<finalIndex;i++,j++) {
                                    LyteComponent.removeSelectedBindingDeep({[itemValue] : helper._items[i].itemProperty}, {[itemValue] : deletedItems[j]});
                                }
                                let contextSwitchArray = [];
                                LyteComponent.newAddContext(helper, contextSwitchArray);
                                helper._callee.updateForHelper(helper, options);
                                LyteComponent.newRemoveContext(helper, contextSwitchArray);
                            }
                           }
                            for(let key in item) {
                            let parsedKey = parseInt(key);
                            if(!isNaN(parsedKey) && parsedKey >= options.firstIndex) {
                                let diff = parsedKey - options.firstIndex;
                                let oldObject;
                                if(diff < options.secondIndex) {
                                    oldObject = deletedItems[diff];
                                } else {
                                    oldObject = array[options.firstIndex - options.secondIndex + diff];
                                }
                                this.removeSelectedBindingDeep(item[key], oldObject);
                                if(item[key]._forHelpers) {
                                    let bindfor = item[key]._forHelpers.toArrayLyte();
                                    for(var j=0;j<bindfor.length;j++){
                                        let item1 = bindfor[j];
                                        if(item1._propBindingObject) {
                                            this.removeSelectedBindingDeep(item1._propBindingObject, oldObject);
//                                          value._bindings.add(item._propBindingObject);
//                                          this.establishBindings(item._propBindingObject, value);
                                        }
                                    }
                                }
                                if(array[parsedKey] && typeof array[parsedKey] === "object") {
                                    if(!array[parsedKey]._bindings) {
                                        Object.defineProperty(array[parsedKey], '_bindings', {
                                            enumerable: false, 
                                            writable: true, 
                                            value : new Set(),
                                            configurable: true
                                        });
                                    }
                                this.establishBindings({"dummy" : item[key]},{"dummy" : array[parsedKey]});
                                }
                                this.affectChanges(item[key]);
                            }
                        }
                    }
                }
                LyteComponent.callArrayObservers(array,{type:"array",removedItems:deletedItems,index:index});
                return deletedItems;
                }
                break;
            case "unshift" : 
            case "unshiftObject" : 
            case "unshiftObjects" : 
                //LyteComponent.arrayFunctions.apply(LyteComponent, [array, 'insertAt', 0].concat(Array.prototype.slice.call(arguments, 2)));
                {
                let toPush = arguments[2];
                if(!(toPush instanceof Array)) {
                    toPush = [toPush];
                }
                LyteComponent.arrayFunctions(array, 'insertAt', 0, toPush);
                }
                break;
            case "insertAt" : 
                {
                let index = parseInt(arguments[2]);
                //let args = Array.prototype.slice.call(arguments, 3);
                let args = arguments[3];
                let len = args.length;
                if(!(args instanceof Array)) {
                    args = [args];
                }
                for(let i=index;i>array.length;i--) {
                    args.unshift(undefined);
                    index--;
                }
                let options = {"firstIndex" : index, "secondIndex" : args.length, "type" : "insert"};
                array.splice.apply(array, [index, 0].concat(args));
                if(array._bindings) {
                    let arrbind = array._bindings.toArrayLyte();
                    for(let i=0;i<arrbind.length;i++){
                        let item = arrbind[i];
                        if(item._forHelpers) {
                            let forbind = item._forHelpers.toArrayLyte();
                            for(let j=0;j<forbind.length;j++){
                                let helper = forbind[j];
                                let contextSwitchArray = [];
                                LyteComponent.newAddContext(helper, contextSwitchArray);
                                helper._callee.updateForHelper(helper, options);
                                LyteComponent.newRemoveContext(helper, contextSwitchArray);
                            }
                        }
                        for(let key in item) {
                            let parsedKey = parseInt(key);
                            if(!isNaN(parsedKey) && parsedKey >= options.firstIndex) {
                                this.removeSelectedBindingDeep(item[key], array[parsedKey+options.secondIndex]);
                                if(item[key]._forHelpers) {
                                    let bindfor = item[key]._forHelpers.toArrayLyte();
                                    for(var j=0;j<bindfor.length;j++){
                                        let item1 = bindfor[j];
                                        if(item1._propBindingObject) {
                                            this.removeSelectedBindingDeep(item1._propBindingObject, oldObject);
//                                          value._bindings.add(item._propBindingObject);
//                                          this.establishBindings(item._propBindingObject, value);
                                        }
                                    }
                                }
                                if(array[parsedKey] && typeof array[parsedKey] === "object") {
                                    if(!array[parsedKey]._bindings) {
                                        Object.defineProperty(array[parsedKey], '_bindings', {
                                            enumerable: false, 
                                            writable: true, 
                                            value : new Set(),
                                            configurable: true
                                        });
                                    }
                                this.establishBindings({"dummy" : item[key]},{"dummy" : array[parsedKey]});    
                                }
                                this.affectChanges(item[key]);
                            }
                        }
                    }
                }
                LyteComponent.callArrayObservers(array,{type:"array",insertedItems:(!(arguments[3] instanceof Array)) ? [arguments[3]]: arguments[0].slice(parseInt(arguments[2]),len+1),index:parseInt(arguments[2])});
                }
                break;
            case "concat" : 
                //LyteComponent.arrayFunctions.apply(LyteComponent, [array, 'insertAt',array.length].concat(arguments[2]));
                LyteComponent.arrayFunctions(array, 'insertAt', array.length, arguments[2]);
                break;
            default: 
                console.error("array Function " + functionName + " doesn't exist");
                return;
            }
        },
        "callArrayObservers" : function(array,args) {
            if(array._bindings) {
                let objbind = array._bindings.toArrayLyte();
                for(let i=0;i<objbind.length;i++){
                    let binding = objbind[i];
                    let path = objbind[i]._path;
                    if(binding._observers) {
                        let obsbind = binding._observers.toArrayLyte();
                        for(let j=0;j<obsbind.length;j++){
                            let observer = obsbind[j];
                            if(observer.isArrayObserver) {
                                if(args){
                                    args.item = path;
                                }
                                observer.observer.value.call( observer.callee && observer.callee.component ? observer.callee.component : array._setterScope? array._setterScope : window , args);                               }
                        }
                    }
                    if(binding.length) {
                        this.affectChanges(binding.length);
                    }
                }
            }
        },
        "establishUpdateBindings" : function(bindings, property, actualData) {
            let objbind = bindings.toArrayLyte();
            for(let i=0;i<objbind.length;i++){
                let item = objbind[i];
                if(item[property]) {
                    if(!actualData._bindings) {
                        Object.defineProperty(actualData, "_bindings", {
                            value: new Set(),
                            enumerable: false,
                            configurable: true, 
                            writable : true
                        });
                    }
                    actualData._bindings.add(item[property]);
                    this.establishBindings(item[property], actualData);
                }

            }
        },
        "establishSelectedBinding" : function(property, actualData,node) {
            if(!property) {
                return;
            }
            let propName = property._path;
            let props = propName.split('.');
            let currentProp = node.getProperty(props[0]);
            let currentValue = actualData[props[0]];
            for(let i=0;i<props.length;i++) {
                if(typeof currentValue !== "object") {
                    break;
                } 
                if(!currentValue._bindings) {
                    Object.defineProperty(currentValue, '_bindings', {
                        enumerable : false, 
                        configurable : true, 
                        writable : true, 
                        value : new Set()
                    });
                }
                    currentValue._bindings.add(currentProp);
                    currentProp = currentProp[props[i+1]];
                    currentValue = currentValue[props[i+1]];
            }
        },
        "establishBindings": function(properties, actualData) {
            if(properties._helperNodes) {
                let path = properties._path;
                let arr = properties._helperNodes.toArrayLyte();
                for(let s=0;s<arr.length;s++) {
                    let nodes = arr[s]._dynamicProperty ? arr[s]._dynamicProperty[path]: undefined;
                    if(nodes) {
                        for(let j=0;j<nodes.length;j++) {
                            let node = nodes[j];
                            let helper = node.ownerElement;
                            if(helper && helper.tagName === "TEMPLATE" && helper.getAttribute("is") === "for") {
                                if(helper._items) {
                                    let item = helper.getAttribute("item");
                                    for(let i=0;i<helper._items.length;i++) {
                                        let data = actualData[i];
                                        let item = helper.getAttribute("item");
                                        if(data) {
                                            if(typeof helper._items[i] === "object") {
                                                this.establishBindings(helper._items[i].itemProperty, {[item] : data});
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for(let i in properties) {
                let actData = actualData[i];
                if(!actData || typeof actData === "string" || typeof actData === "number" || typeof actData === "boolean") {
                    if(!actualData._bindings) {
                        Object.defineProperty(actualData, "_bindings", {
                            value: new Set(),
                            enumerable: false,
                            writable: true,
                            configurable: true
                        });
                    }
                    actualData._bindings.add(properties);
                } else {
                    if(!actData._bindings) {
                        Object.defineProperty(actData, '_bindings', {
                            value : new Set(),
                            enumerable: false, 
                            writable: true,
                            configurable: true
                        });
                    }
                    actData._bindings.add(properties[i]);
                    if(typeof properties[i] === "object") {
                        this.establishBindings(properties[i], actData);
                    }
                }
            }
        },
        "removeSelectedBindingDeep" : function(binding, actualData) {
            var del = "delete";
            if(!actualData) {
                return;
            }
            if(actualData._bindings) {
                actualData._bindings[del](binding);
                if(!actualData._bindings.size) {
                    delete actualData._bindings;
                }
            }
            for(let i in binding) {
                let actData = actualData[i];
                if(actData && actData._bindings) {
                    actData._bindings[del](binding[i]);
                    if(!actData._bindings.size) {
                        delete actualData._bindings;
                    }
                }
                if(typeof binding[i] === "object" && actData) {
                    this.removeSelectedBindingDeep(binding[i], actData);
                }
            }
            if(binding._forHelpers) {
                let objbind = binding._forHelpers.toArrayLyte();
                for(let i=0;i<objbind.length;i++){
                    let fH = objbind[i];
                    if(fH.getAttribute("is") === "for") {
                        let item = fH.getAttribute("item");
                        let items = fH._attributes.items;
                        let itemCases = fH._items;
                        for(let i=0;i<itemCases.length;i++) {
                            this.removeSelectedBindingDeep(itemCases[i].itemProperty, items[i]);
                        }
                    } else {
                        if(fH._propBindingObject) {
                            if(actualData._bindings) {
                                actualData._bindings[del](fH._propBindingObject);
                                if(!actualData._bindings.size) {
                                    delete actualData._bindings;
                                }
                                this.removeSelectedBindingDeep(fH._propBindingObject, actualData);
                            }
                        }
                    }
                }
            }
        },
        "removeAllBindings" : function(properties, data) {
            var del = "delete";
            for(let key in properties) {
                if(data[key] && data[key]._bindings) {
                    data[key]._bindings[del](properties[key]);
                    if(!data[key]._bindings.size) {
                        delete data[key]._bindings;
                    }
                }
                if(data[key] && typeof data[key] !== "string") {
                    LyteComponent.removeAllBindings(properties[key], data[key]);
                }
            }
        },
        "affectChanges" : function(item, contextAlreadySwitched,oldValue,setterScope,newValue) {
            if(item._dynamicNodes) {
                for(let i=0;i<item._dynamicNodes.length;i++) {
                    item._dynamicNodes[i]._callee.updateNode(item._dynamicNodes[i], item._path);
                }
            }
            let propPath = item._path;
            if(item._helperNodes) {
                let nodes = [],itemHelperNodes = item._helperNodes.toArrayLyte();
                for(let s=0;s<itemHelperNodes.length;s++){
                    if(!item._helperNodes.has(itemHelperNodes[s])) {
                        continue;
                    }
                    if(itemHelperNodes[s].getAttribute("is") === "for" && itemHelperNodes[s]._items) {
                        let innerContextSwitchArray = [];
                        LyteComponent.newAddContext(itemHelperNodes[s], innerContextSwitchArray);
                        let  indexValue = itemHelperNodes[s].getAttribute("index");
                        let itemValue = itemHelperNodes[s].getAttribute("item");
                        let callee = itemHelperNodes[s]._callee;
                        let initialItemValue = callee.component.data[itemValue];
                        let initialIndexValue = callee.component.data[indexValue];
                        let initialItemProp = callee._properties[itemValue];
                        let initialIndexProp = callee._properties[indexValue];
                        let items = itemHelperNodes[s]._attributes.items;
                        for(let i=0;i<itemHelperNodes[s]._items.length;i++) {
                            callee.component.data[itemValue] = items[i];
                            callee.component.data[indexValue] = i;
                            callee._properties[itemValue] = itemHelperNodes[s]._items[i].itemProperty;
                            if(itemHelperNodes[s]._items[i]._dynamicProperty[propPath]) {
                                nodes = itemHelperNodes[s]._items[i]._dynamicProperty[propPath];
                                for(let i=0;i<nodes.length;i++) {
                                    nodes[i]._callee.updateNode(nodes[i], propPath);
                                }
                            }
                        }
                        callee.component.data[itemValue] = initialItemValue;
                        callee.component.data[indexValue] = initialIndexValue;
                        callee._properties[itemValue] = initialItemProp;
                        callee._properties[indexValue] = initialIndexProp;
                        LyteComponent.newRemoveContext(itemHelperNodes[s], innerContextSwitchArray);                                    
                    } else if(itemHelperNodes[s].getAttribute("is") === "forIn" && itemHelperNodes[s]._items) {
                        let innerContextSwitchArray = [];
                        LyteComponent.newAddContext(itemHelperNodes[s], innerContextSwitchArray);
                        let  indexValue = itemHelperNodes[s].getAttribute("key");
                        let itemValue = itemHelperNodes[s].getAttribute("value");
                        let callee = itemHelperNodes[s]._callee;
                        let initialItemValue = callee.component.data[itemValue];
                        let initialIndexValue = callee.component.data[indexValue];
                        let initialItemProp = callee._properties[itemValue];
                        let initialIndexProp = callee._properties[indexValue];
                        let object = itemHelperNodes[s]._attributes.object;
                        for(let key in itemHelperNodes[s]._items) {
                            callee.component.data[itemValue] = object[key];
                            callee.component.data[indexValue] = key;
                            callee._properties[itemValue] = itemHelperNodes[s]._items[key].itemProperty;
                            if(itemHelperNodes[s]._items[key]._dynamicProperty[propPath]) {
                                nodes = itemHelperNodes[s]._items[key]._dynamicProperty[propPath];
                                for(let i=0;i<nodes.length;i++) {
                                    nodes[i]._callee.updateNode(nodes[i], propPath);
                                }
                            }
                        }
                        callee.component.data[itemValue] = initialItemValue;
                        callee.component.data[indexValue] = initialIndexValue;
                        callee._properties[itemValue] = initialItemProp;
                        callee._properties[indexValue] = initialIndexProp;
                        LyteComponent.newRemoveContext(itemHelperNodes[s], innerContextSwitchArray);    
                    } else {
                        nodes = itemHelperNodes[s]._dynamicProperty[item._path] || [];
                        let contextSwitchArray = [];
                        LyteComponent.newAddContext(itemHelperNodes[s], contextSwitchArray);
                        for(let i=0;i<nodes.length;i++) {
                            nodes[i]._callee.updateNode(nodes[i], item._path);
                        }
                        LyteComponent.newRemoveContext(itemHelperNodes[s], contextSwitchArray);
                    }
                }
            }
            if(item._observers) {
                let objbind = item._observers.toArrayLyte();
                for(let i=0;i<objbind.length;i++){
                    let observer = objbind[i];
                    observer.observer.value.call( observer.callee && observer.callee.component ? observer.callee.component : setterScope ? setterScope : window ,{type:"change",oldValue:oldValue,newValue:newValue, item: item._path});                      
                }
            }
            if(Array.isArray(item)){
                for(var i=0;i<item.length;i++){
                    for(let key in item[i]) {
                        this.affectChanges(item[i][key], true,oldValue?(oldValue[i]?oldValue[i][key]:oldValue[i]):oldValue,setterScope,newValue?(newValue[i]?newValue[i][key]:newValue[i]):newValue);
                    }
                }
            }
            else{
                for(let key in item) {
                    this.affectChanges(item[key], true,oldValue?oldValue[key]:oldValue,setterScope,newValue?newValue[key]:newValue);
                }
            }
        },
        "getDynamicData":function(context,dataArr){
            var self = this;
            dataArr.forEach(function(item,index){
                if(Array.isArray(item)){
                    if(context === undefined){
                        return undefined;
                    }
                    var inner = self.getDynamicData.call(self,self.component.data,item);
                    if(inner === undefined){
                        return undefined;
                    }
                    context = context[inner];
                }else{
                    if(context === undefined){
                        return undefined;
                    }
                    context = context[item];
                }
            });
            return context;
        },
        "get" : function(context, path, ac) {
            if(!ac) {
                ac = [];
            }
            try{
                let arr = path.match(/([^[\]]+|\[\])/g);
                let initialContext = context;
                ac.push(arr[0]);
                let locArr = arr[0].split('.'); 
                for(let k=0;k<locArr.length;k++) {
                    context = context[locArr[k]];
                }
                for(let i=1;i<arr.length;i++) {
                    let locVal = arr[i];
                    //this is context switching
                    if(locVal.startsWith(".")) {
                        //direct context switching
                        let locArr = locVal.substring(1).split('.');
                        for(let k=0;k<locArr.length;k++) {
                            context = context[locArr[k]];
                        }
                        ac[ac.length -1] = ac[ac.length - 1] + locVal;
                    } else if(locVal.startsWith("'") || locVal.startsWith('"') || !isNaN(locVal)) {
                        if(!isNaN(locVal)) {
                            ac[ac.length-1] = ac[0] + "." + locVal;
                        } else {
                            ac[ac.length-1] = ac[0] + "." + locVal.substring(1, locVal.length -1);
                        } 
                        context = context[locVal.substring(1, locVal.length -1)];
                    } else {
                        let length = ac.length;
                        let val = this.get(initialContext, locVal, ac);
                        ac[0] = ac[0] + "." + val;
                        context = context[val];
                    }
                    }
                return context;
            } catch(e) {
                return undefined;
            }
        },
        "getNew" : function(context, path) {
            try{
                let arr = path.match(/([^[\]]+|\[\])/g);
                let initialContext = context;
                let locArr = arr[0].split('.'); 
                if(arr.length < 2) {
                    if(locArr.length <2) {
                        return {"context": initialContext, "lastKey" : locArr[0]};
                    } else {
                        for(var k=0;k<locArr.length-1;k++) {
                            context = context[locArr[k]];
                        }
                        return {"context" : context, "lastKey" : locArr[k]}
                    }
                }
                for(let k=0;k<locArr.length;k++) {
                    context = context[locArr[k]];
                }
                for(var i=1;i<arr.length - 1;i++) {
                    let locVal = arr[i];
                    //this is context switching
                    if(locVal.startsWith(".")) {
                        //direct context switching
                        let locArr = locVal.substring(1).split('.');
                        for(let k=0;k<locArr.length;k++) {
                            context = context[locArr[k]];
                        }
                    } else if(locVal.startsWith("'") || locVal.startsWith('"') || !isNaN(locVal)) {
                        context = context[locVal.substring(1, locVal.length -1)];
                    } else {
                        let val = this.get(initialContext, locVal);
                        context = context[val];
                    }
                    }
                let lastKey = arr[i];
                if(lastKey.startsWith(".")) {
                    //direct context switching
                    let locArr = lastKey.substring(1).split('.');
                    let k=0
                    for(;k<locArr.length - 1;k++) {
                        context = context[locArr[k]];
                    }
                    lastKey = locArr[k];
                } else if(lastKey.startsWith("'") || lastKey.startsWith('"') || !isNaN(lastKey)) {
                    lastKey = lastKey.substring(1, lastKey.length -1);
                } else {
                    lastKey = this.get(initialContext, lastKey);
                }
                return {"context" : context, "lastKey" : lastKey };
            } catch(e) {
                return undefined;
            }
        },
        "componentGetData" : function(key){
            if(key) {
                return this.get(key);
            } else {
                return this.data;
            }
        },
        "componentSetData" : function(arg0, arg1) {
            if(typeof arg0 === "string") {
                this.set(arg0, arg1);
            } else if(arg0 instanceof Object) {
                for(let key in arg0) {
                    this.set(key, arg0[key]);
                }
            }
        },
        "componentGetMethods" : function(key) {
            if(key) {
                return this.methods[key];
            } else {
                return this.methods;
            }
        }, 
        "componentSetMethods" : function(arg0, arg1) {
            if(typeof arg0 === "string") {
                this.methods[arg0] = arg1;
            } else if(arg0 instanceof Object) {
                for(let key in arg0) {
                    this.methods[key] = arg0[key];
                }
            }
        },
        "render" : function(componentName, data, outlet) {
            if(componentName) {
                var component = document.createElement(componentName);
            } else {
                console.error("Component name not specified");
                return;
            }
            if(data){
                component.setData(data);
            }
            if(outlet) {
                let actOutlet = document.querySelector(outlet);
                if(actOutlet) {
                    actOutlet.appendChild(component);
                } else {
                    console.warn("Specified outlet doesn't exist");
                }
            }
            return component;
        },
        "String" : {
            "upperCaseFirstLetter" : function(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            "lowerCaseFirstLetter" : function(string) {
                return string.charAt(0).toLowerCase() + string.slice(1);
            }, 
            "toCamelCase" : function(string) {
                return string.replace(/(-\w)/g, function(m){return m[1].toUpperCase();})
            }, 
            "dasherize" : function(string) {
                return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            }
        },
        "appendChild" : function(outlet, component) {
            LyteComponent.ignoreDisconnect = true;
            outlet.appendChild(component);
            LyteComponent.ignoreDisconnect = false;
        },
        "replaceWith" : function() {
            var argumentsArr = Array.from(arguments);
            var oldNode = argumentsArr.shift();
            LyteComponent.ignoreDisconnect = true;
            oldNode.replaceWith.apply(oldNode, argumentsArr);
            LyteComponent.ignoreDisconnect = false;
        },	
        "insertBefore" : function(referenceNode, newNode) {
            LyteComponent.ignoreDisconnect = true;
            referenceNode.parentNode.insertBefore(newNode, referenceNode ? referenceNode : null);
            LyteComponent.ignoreDisconnect = false;
        },
        "insertAfter" : function() {
            var argumentsArr = Array.from(arguments);
            var referenceNode = argumentsArr.shift();
            LyteComponent.ignoreDisconnect = true;
            referenceNode.after.apply(referenceNode, argumentsArr);
            LyteComponent.ignoreDisconnect = false;
        },
        "executeMethod" : function() {
            let args = Array.prototype.slice.call(arguments, 1);
            var methodName = LyteComponent.String.toCamelCase(arguments[0]);
            if(!this.methods[methodName]) {
                console.error(methodName + " method not found");
                return;
            }
            return this.methods[methodName].apply(this, args);
        },
        "establishObserverBindings":function(observers,fromStore,properties) {
            //let observers = this.constructor._observers;
            let scope = this;
            if(fromStore){
                scope = fromStore;      
            }
            for(let i=0;i<observers.length;i++) {
                let props = observers[i].properties;
                for(let j=0;j<props.length;j++) {
                    let actProp;
                    let isArrayObserver = false;
                    if(props[j].indexOf('.[]') !== -1) {
                        isArrayObserver = true;
                        actProp = LyteComponent.getProperty.call(this,props[j].substring(0, props[j].indexOf('.[]')),fromStore,properties);
                    } else {
                        actProp = LyteComponent.getProperty.call(this,props[j],fromStore,properties);
                    }
                    if(!actProp._observers) {
                        Object.defineProperty(actProp, '_observers', {
                            value : new Set(),
                            enumerable: false, 
                            writable: true,
                            configurable: true
                        });
                    }
                    actProp._observers.add({callee : scope, observer: observers[i], isArrayObserver : isArrayObserver});
                }
            }
        },
        "getProperty":function(key,fromStore,properties) {
            let arr = key.split('.');
            let property = this;
            if(fromStore){
                property = properties;
                if(!properties[arr[0]]){
                    properties[arr[0]] = {};
                }
                property = properties[arr[0]];
            }
            else {                      
                if(!property._properties[arr[0]]) {
                    property._properties[arr[0]] = {};
                } 
                property = property._properties[arr[0]];
            }

            Object.defineProperty(property, '_path', {enumerable: false, value : arr[0]});
            for(let i=1;i<arr.length;i++) {
                if(!property[arr[i]]) {
                    property[arr[i]] = {};
                    Object.defineProperty(property[arr[i]], '_path', {enumerable: false, value : property._path + "." + arr[i]});
                }
                property = property[arr[i]];
            }
            return property;
        }, 
        "getProperData" : function(obj) {
            var dataType = obj.dataType;
            var attr = obj.attr;
            var newValue = obj.newValue;
            var tagName = obj.tagName;
            switch(dataType) {
            case "boolean" : 
                {
                    if(!newValue || newValue === "false") {
                        newValue= false;
                    } else {
                        newValue = true;
                    }
                }
                break;
            case "object" : 
                try{
                    newValue = JSON.parse(newValue);
                    if(!(newValue instanceof Object)) {
                        console.warn("data type of the value provided for attribute "+ attr + " of " + tagName + " is not valid");
                    }
                } catch(e) {
                    console.warn("attribute "+attr+ " is not a valid JSON string.");
                    return;
                }
                break;
            case "array":
                try{
                    newValue = JSON.parse(newValue);
                    if(!(newValue instanceof Array)) {
                        console.warn("data type of the value provided for attribute "+ attr + " of " + tagName + " is not valid");
                    }
                } catch(e) {
                    console.warn("attribute "+attr+ " is not a valid JSON string.");
                    return;
                }
                break;
            case "number":
                {
            let numValue = +newValue;
                if(newValue === numValue+"") {
                    newValue = numValue;
                } else {
                    console.warn("data type of the value provided for attribute "+ attr + " of " + tagName + " is not valid");
                    return;
                }
            }
                break;
            }
            obj.newValue = newValue;
            return true;
        }

}
Lyte.Component.render = LyteComponent.render;
LyteComponent.lyteComponentsDiv = document.createElement("div");
LyteComponent.styleDiv = document.createElement("div");
LyteComponent.lyteComponentsDiv.setAttribute("id", "lyte-components-div");
LyteComponent.dummyLyteComponentsDiv = document.createElement("div");
LyteComponent.dummyLyteComponentsDiv.setAttribute("id", "dummy-lyte-components-div");

Set.prototype.toArrayLyte = function() {
    if(this.constructor.name === "Set"){
        return Array.from(this);
    }
    else{
        return Array.from(this._values);
    }
}
//LyteComponent.registerListener(function() {
//  
//});

if(document.readyState === "complete" || document.readyState === "interactive") {
    onDomContentForLyte();
} else {
    document.addEventListener("DOMContentLoaded", function(e){
        onDomContentForLyte();
    },true);
}

// Compilation functions 

function getMustache(value){
    value=(value && typeof value === "string") ? value.trim() : value;
    if(/^{{(?=[\s]*[\w-_]+)/.test(value)){
        let arr = value.match(/{{[a-zA-Z0-9_.[\]()]*(?![\\])}}/g);
        if(arr && arr.length > 1){
            //console.log("length>1",value)
            return undefined;
        }
        if(!this.syntaxCheck(value) || !(/{{[^}]*?(?:(?:('|")[^\1]*?\1)[^}]*?)*}}$/.test(value))){ //'
            return undefined;
        }
        let dynamic = value.match(/[\w!@#$%^&*)(+=.,_-]+[\s]*[(]{0,1}(?:"([^"]|\\")*?"|'([^']|\\')*?'|[\w\s!@#$%^&*)([\]+=.,_-]*?)*?[)]{0,1}[\s]*(?=}})/g); //'
        if(dynamic && dynamic.length > 1){
            return undefined;
        }
        else{
            dynamic = (dynamic) ? dynamic[0].trim(): dynamic;                
        }
//        let dynamic = /[\w!@#\$%\^\&*\)\(+=.,_-]+(?:"([^"]|\\")*?"|'([^']|\\')*?'|[\w\s!@#\$%\^\&*\)\(\[\]+=.,_-]*?)*?(?=}}$)/.exec(value);
        return dynamic;
    }
    return undefined;
}

function getHelper(dynamicValue){
    let helperValue = /\((?:[^)]*|(?:(?:"(?:[^"\\]|\\.)*?")|(?:'([^'\\]|\\.)*?')|[\w\s!@#$%^&*)([\]+=.,_-]*?)*?)\)$/.exec(dynamicValue);
    if(helperValue){
        return getHelperInfo(dynamicValue,helperValue);
    }
    return undefined;
}


function getHelperInfo(dynamicValue, helperValue){
    let helperFunc = {};
    helperFunc.name = dynamicValue.substr(0,helperValue.index).replace(/\s/g,'');
    helperValue = (helperValue) ? helperValue[0].trim() : helperValue;
    let args = getHelperArgs(helperValue.substr(1,helperValue.length-2));
    if(args === false){
        return false;
    }
    helperFunc.args = args;
    return helperFunc;
}

function getHelperArgs(str){
    let stack = [], args = [] , from=0;
    let lastPushed; 
    for(let i=0; i<str.length; i++){
        if(!stack.length && str.charAt(i) === ","){
            let toPush = str.substr(from,i-from);
            toPush = toPush.trim();
            if(toPush && toPush.startsWith("\"") && toPush.endsWith("\"")){
                toPush = toPush.slice(1,-1);
                toPush = "'" + toPush + "'";
            }
            toPush = getHelperArgValue(toPush);
            args.push(toPush);
            from = i + 1;
        }
        else if(str.charAt(i) === "("){
            if(lastPushed != "'" || lastPushed != "\""){
                stack.push(str.charAt(i));
                lastPushed = str.charAt(i);
            }
        }
        else if(str.charAt(i) === ")"){
            if(stack[stack.length-1] === "("){
                stack.pop();
            }
        }
        else if(str.charAt(i) === "'" && str.charAt(i-1) !== "\\"){
            if(stack[stack.length-1] === "'"){
                stack.pop();
            }
            else if(stack[stack.length-1] !== "\""){
                stack.push(str.charAt(i));
                lastPushed = str.charAt(i);
            }
        }
        else if(str.charAt(i) === "\"" && str.charAt(i-1) !== "\\"){
            if(stack[stack.length-1] === "\""){
                stack.pop();
//              str.replaceAt(i, "'");
            }
            else if(stack[stack.length-1] !== "'"){
                stack.push(str.charAt(i));
                lastPushed = str.charAt(i);
//              str.replaceAt(i, "'");
            }
        }
    }
    let toPush = str.substr(from,str.length-from);
    toPush = toPush.trim();
    if(toPush && toPush.startsWith("\"") && toPush.endsWith("\"")){
        toPush = toPush.slice(1,-1);
        toPush = "'" + toPush + "'";
    }
    toPush = getHelperArgValue(toPush);
    args.push(toPush);
    return args;
}

function syntaxCheck(value){
    var stack = [],lastAdded;
    for(var i=0;i<value.length;i++){
        if(value[i] === "'"){
            if(lastAdded === "'" && value[i-1] !== "\\"){
                stack.pop();
                lastAdded = undefined;
            }
            else if(!stack.length){
                lastAdded = value[i];
                stack.push(lastAdded);
            }
        }
        else if(value[i] === "\""){
            if(lastAdded === "\"" && value[i-1] !== "\\"){
                stack.pop();
                lastAdded = undefined;
            }
            else if(!stack.length){
                lastAdded = value[i];
                stack.push(lastAdded);
            }
        }
    }
    if(stack.length){
        return false;
    }
    return true;
}

function doCompile(dynamicN, dynamicNodes, componentName) {
    for(let j=0;j<dynamicNodes.length;j++) {
        let info = dynamicNodes[j], type = info.type, pos = info.position, helperInfo;
        let dynN = this.getDynamicNode(dynamicN,pos);
        switch(type) {
        case "text" : {
            let mustache = this.getMustache(dynN.nodeValue),dynamicValue,helperFunc;
            if(mustache){
                    helperFunc = this.getHelper(mustache);
            }   
            let dynamic = this.getMustache(dynN.nodeValue);
            if(helperFunc){
                 info.helperInfo = helperFunc;                 
            }
            else if(dynamic){
                //deepNodes.push({type: "text", position:deepN.slice(), dynamicValue: dynamic});
                info.dynamicValue = dynamic;
//              LN to do
//              deepNodes.push({type: "text", position:deepN.slice(), dynamicValue: getDynamicValue(dynamic)});                    
            }
        }
        break;
        case "attr" : {
            let add = false, toBeRemoved = [],toBeAdded = [];
            let node = dynN;
            let attr = info.attr = info.attr || {};
            for(let i=0;i<node.attributes.length;i++) {
                if(node.attributes[i].nodeValue.indexOf("{{") !== -1) {
                    let val = node.attributes[i].nodeValue;
                    let actValue = this.getMustache(val), actObj ;
                    if(actValue){
                        actObj = this.getHelper(actValue);  
                    }
                    else if(/{{.*}}/.test(val) && !(/\\{{.*}}/.test(val))){
                        actObj = this.splitMixedText(val);
                    }
                    if( actObj && (actObj.name === "action" || actObj.name === "method") && /^(onfocus|onfocusin|onfocusout|onresize|onscroll|onclick|ondblclick|onmousedown|onmouseup|onmousemove|onmouseover|onmouseout|onmouseenter|onmouseleave|onchange|onselect|onsubmit|onkeydown|onkeypress|onkeyup|oncontextmenu)$/.test(node.attributes[i].name)){
                            attr[node.attributes[i].name.substr(2)] = {name:node.attributes[i].name.substr(2),helperInfo: actObj, globalEvent: true};
                            let actArgs = deepCopyObject(actObj.args);
                            let actName = actArgs.splice(0,1)[0];
                            actName = actName.startsWith("'")? actName.replace(/'/g,''):  actName;
                            let actString = this.getArgString(actName, actArgs);
                            node.setAttribute(node.attributes[i].name.substr(2),componentName+" => "+ actString);
                            toBeRemoved.push(node.attributes[i].name);                            
                    }
                    else{
                        if(actObj || actValue) {
                            let attrToPush = {};
                            if(node.attributes[i].name.startsWith("lbind:")) {
                                toBeRemoved.push(node.attributes[i].name);
                                toBeAdded.push({"name" : node.attributes[i].name.substring(6), "value": node.attributes[i].nodeValue});
                                attrToPush.isLbind = true;
                                attrToPush.name = node.attributes[i].name.substring(6);
                            }
                            else {
                                attrToPush.name = node.attributes[i].name;
                            }
                            if(actObj) {
                                if(actObj.name === "lbind") {
                                    attrToPush.dynamicValue = actObj.args[0];
                                    attrToPush.isLbind = true;
                                }
                                else {
                                    attrToPush.helperInfo = actObj;
                                }
                            } 
                            else {
                                attrToPush.dynamicValue = actValue;
//                              LN to do
//                              attrToPush.dynamicValue = getDynamicValue(actValue);
                            }
                            add = true;
                            attr[attrToPush.name] = attrToPush;
                        }                  
                    }
                }
            }
            if(toBeRemoved.length){
                for(let i=0; i<toBeRemoved.length;i++){
                    node.removeAttribute(toBeRemoved[i]);
                }
            }
            if(toBeAdded.length) {
                for(let i=0;i<toBeAdded.length;i++) {
                    node.setAttribute(toBeAdded[i].name, toBeAdded[i].value);
                }
            }
        } 
        break;
        case "for" : 
        case "forIn" : 
        case "component" :
        case "registerYield" :{
            doCompile(window.isIE11Lyte ? dynN : dynN.content, info.dynamicNodes, componentName);
            if(window.isIE11Lyte || window.isEdgeLyte) {
            	info.templateContent = dynN.outerHTML;
            	dynN.innerHTML = "";  
	        }
        }
        break;
        case "if" : 
        case "switch" : {
            var def = "default";
            if(window.isIE11Lyte || window.isEdgeLyte) {
            	var cases = {};
                var defCase;
                var dynNchildNodes = window.isEdgeLyte ? dynN.content.childNodes : dynN.childNodes;
                for(var i=0;i<dynNchildNodes.length;i++) {
                  if(dynNchildNodes[i].tagName === "TEMPLATE"){
                	  if(dynNchildNodes[i].getAttribute("case")) {
                		  cases[dynNchildNodes[i].getAttribute("case")] = dynNchildNodes[i];
                	  } else if(dynNchildNodes[i].hasAttribute("default")) {
                		  defCase = dynNchildNodes[i];
                	  }
                  }
                }
                for (var key in info.cases) {
                    doCompile(cases[key], info.cases[key].dynamicNodes, componentName);
                    cases[key].remove();
                    info.cases[key].templateContent = cases[key].outerHTML;
                }
                if (info[def].dynamicNodes) {
                    doCompile(defCase, info[def].dynamicNodes, componentName);
                    defCase.remove();
                    info[def].templateContent = defCase.outerHTML;
                }
            } else {
            	for(let key in info.cases) {
            		doCompile(dynN.content.querySelector("[case='"+key+ "']").content, info.cases[key].dynamicNodes,componentName);
            	}
            	if(info[def].dynamicNodes) {
            		doCompile(dynN.content.querySelector("[default]").content, info[def].dynamicNodes,componentName);
            	}
            	
            }
        }
        break;    
        }
    }
}

function getDynamicNode(content, positions){
    let dynamicN = content;
    for(var i=0; i<positions.length; i++){
        dynamicN = (dynamicN.tagName != "TEMPLATE" || window.isIE11Lyte) ? dynamicN.childNodes[positions[i]] : dynamicN.content.childNodes[positions[i]];
    }
    return dynamicN;
}

function splitMixedText(str){
    var stack=[], start=0, helper = { name:"concat", args: []};
    for(var i=0;i<str.length;i++){
      var j = i;
      if(str[i-1] !== "\\" && str[i] === "{" && str[++i] === "{"){
        stack.push('{{');
        helper.args.push("'"+str.substr(start,j-start)+"'");
        start = i + 1;
      }
      else if(str[i] === "}" && str[++i] === "}" && stack.length){
        stack.pop(start);
        var toPush = str.substr(start,j-start);
        var actObj = this.getHelper(toPush);  
        if(actObj){
            toPush = actObj;
        helper.args.push({type:"helper",value:toPush});
        }
        else{
            helper.args.push(toPush);
        }
        start = i + 1;
     }

    }
    if(start<str.length){
        helper.args.push("'"+str.substr(start,str.length-start)+"'");
    }
    return helper;
}

function getHelperArgValue(argValue) {
    switch(argValue) {
        case "undefined" : 
            return undefined
        case "true" : 
            return true;
        case "false" : 
            return false;
        case "null" : 
            return null;
        case "" : 
            return undefined;
        default :
            if(argValue && argValue.startsWith("'") && argValue.endsWith("'")){
                return argValue;
            }
            else if(/\([\w\s,')(]*/.test(argValue)) {
                return {"type" : "helper" , "value" : getHelper(argValue)}
            } else if(!isNaN(argValue)) {
                return parseInt(argValue);
            } else {
                return argValue;
            }
    }
}

function deepCopyObject( obj )  {
    var current, copies = [{source : obj, target : Object.create(Object.getPrototypeOf(obj))}], keys, propertyIndex, descriptor, nextSource, indexOf, sourceReferences = [obj];
    var cloneObject = copies[0].target, targetReferences = [cloneObject];
    while(current = copies.shift()){
        keys = Object.getOwnPropertyNames(current.source);
        for(propertyIndex = 0; propertyIndex < keys.length; propertyIndex++){
            descriptor = Object.getOwnPropertyDescriptor(current.source, keys[propertyIndex]);
            if(!descriptor.value || typeof descriptor.value != "object"){
                Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                continue;
            }
              nextSource = descriptor.value;
              descriptor.value = Array.isArray(nextSource) ? [] : Object.create(Object.getPrototypeOf(nextSource));
              indexOf = sourceReferences.indexOf(nextSource);
              if(indexOf != -1){
                  descriptor.value = targetReferences[indexOf];
                  Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                  continue;
              }
              sourceReferences.push(nextSource);
              targetReferences.push(descriptor.value);
              Object.defineProperty(current.target, keys[propertyIndex], descriptor);
              copies.push({source : nextSource, target : descriptor.value});
          }
      }
    return cloneObject;
}

function getArgString(name, array) {
    let retString;
    for(let i=0;i<array.length;i++) {
        if(typeof array[i] === "object") {
            array[i] = this.getArgString(array[i].value.name, array[i].value.args);
        }
    }
    if(name) {
        retString = name +  "(" + array.toString() + ")";
    } else {
        retString = array.toString();
    }
    return retString;
}

LyteComponent.registerHelper("unbound",function(value){
     return value;
});

LyteComponent.registerHelper("action",function(parentNode,attrName,isCustom,actObj){
    if(isCustom){
        parentNode._actions = parentNode._actions? parentNode._actions : {};
        if(!parentNode._actions[attrName]){
            this.createCustomEvent(attrName, parentNode, actObj); 
            parentNode.removeAttribute(attrName);
        }
    }
    else{
        
        this.createEventListeners(parentNode,attrName,actObj);    
    }
});

LyteComponent.registerHelper("lbind",function(name){
	return this.getData(name);
});

LyteComponent.registerHelper("method", function(parentComponent, attributeNode, functionName) {
    var parentComponent = arguments[0];
    var attributeNode = arguments[1];
    var functionName = arguments[2];
    var self = arguments[0].component;
    var childComponent = attributeNode? attributeNode.ownerElement : null;
    var attributeName = arguments[1].nodeName;
    attributeNode = null;
    var args = Array.prototype.slice.call(arguments, 3);
    var newFunc = function() {
        let customArgs = Array.from(arguments);
        let mainArgs = args.concat(customArgs);
        return self.methods[functionName].apply(self, mainArgs);
    }
    if(childComponent) {
        if(!childComponent.set) {
            childComponent.setMethods(LyteComponent.String.toCamelCase(attributeName), newFunc);
        } else {
            childComponent.component.methods[LyteComponent.String.toCamelCase(attributeName)] = newFunc;
        }
    } else {
        return newFunc;
    }
});

LyteComponent.registerHelper("unescape",function(value){
    let divEle = document.createElement("div"),position,totalLength;
    divEle.innerHTML = value;
    return divEle;
});

LyteComponent.registerHelper("debugger", function() {
    debugger;
});

LyteComponent.registerHelper("log", function() {
    console.log.apply(window, Array.from(arguments));
});

LyteComponent.registerHelper("ifEquals", function(arg1, arg2) {
    if(arg1 === arg2) {
        return true;
    } else {
        return false;
    }
});

LyteComponent.registerHelper("if", function(value, trueValue, falseValue) {
    if(value) {
        return trueValue;
    } else {
        return falseValue;
    }
});

LyteComponent.registerHelper("negate", function(arg1) {
    return !arg1;
});


LyteComponent.registerHelper("ifNotEquals", function(arg1, arg2) {
    if(arg1 === arg2) {
        return false;
    } else {
        return true;
    }
});

LyteComponent.registerHelper('concat',function(){
	var resp = '';
	var argLength = arguments.length;
	for(var i=0;i<argLength;i++){
		if(arguments[i] != undefined){
			resp += arguments[i];
		}
	}
	return resp;
});


Object.defineProperty(HTMLElement.prototype, 'setData', {
    enumerable: false, 
    value : function(arg0, arg1) {
        this._initProperties = this._initProperties || {};
        if(typeof arg0 === "string") {
            this._initProperties[arg0] = arg1
        } else if(arg0 instanceof Object) {
            for(let key in arg0) {
                this._initProperties[key] = arg0[key];
            }
        }
    }
});

Object.defineProperty(HTMLElement.prototype, 'setMethods', {
    enumerable: false, 
    value : function(arg0, arg1) {
        this._initMethods = this._initMethods || {};
        if(typeof arg0 === "string") {
            this._initMethods[arg0] = arg1
        } else if(arg0 instanceof Object) {
            for(let key in arg0) {
                this._initMethods[key] = arg0[key];
            }
        }
    }
});

LyteComponent.registerHelper('expHandlers',function(leftOperand,operator,rightOperand){
    if(operator == '++' ){
    	if(rightOperand == "postfix"){
    	   return (leftOperand++)
    	} else if(rightOperand == "prefix"){
    		return (++leftOperand)
    	}
    } else if(operator == "--"){
    	if(rightOperand == "postfix"){
    	   return (leftOperand--)
    	} else if(rightOperand == "prefix"){
    		return (--leftOperand)
    	}
    } else if((operator == "==")|| (operator == "===")){
    	return leftOperand == rightOperand;
    } else if((operator == "!=") || (operator =="!==")) {
        return leftOperand != rightOperand;
    } else if( operator == "&&") {
    	return leftOperand && rightOperand;
    } else if(operator == "||") {
    	return leftOperand || rightOperand;
    } else if(operator == "+" && rightOperand){
    	return leftOperand+rightOperand;
    } else if(operator == '-' && rightOperand){
    	return leftOperand-rightOperand;
    } else if(operator == '*'){
    	return leftOperand * rightOperand;
    } else if(operator == "/"){
    	return leftOperand / rightOperand;
    } else if(operator == "%"){
    	return leftOperand % rightOperand;
    } else if(operator == "<"){
    	return leftOperand < rightOperand;
    } else if(operator == ">") {
    	return leftOperand > rightOperand;
    } else if(operator == "<=") {
    	return leftOperand <= rightOperand;
    } else if(operator == ">=") {
    	return leftOperand >= rightOperand;
    } else if(operator == '|') {
        return leftOperand | rightOperand;
    } else if(operator == '&') {
        return leftOperand & rightOperand;
    }
    else if(operator == "!" ){
        return (!leftOperand)
    } else if(operator == "-" && !rightOperand){
        return (-leftOperand)
    } else if(operator == '=') {
        leftOperand = rightOperand;
        return leftOperand;
    } else if(operator == "+=") {
        return leftOperand += rightOperand;
    } else if(operator == '-=') {
        return leftOperand -= rightOperand;
    } else if(operator == "*=") {
        return leftOperand *= rightOperand;
    } else if(operator == '/=') {
        return leftOperand /= rightOperand;
    }
});


Lyte.Component.register("lyte-event-listener",{
            _template : "<template tag-name=\"lyte-event-listener\"></template>",
            _dynamicNodes : [],
            _observedAttributes : ['eventName'],
            init: function() {
                let self = this;
                let regId = Lyte.addEventListener(this.get('eventName'), function() {
                    let args = Array.prototype.slice.call(arguments);
                    args.splice(0,0,'on-fire')
                    self.throwEvent.apply(self, args );
                });
                //this.set('regId', regId);
                this.regId = regId;
            },
            data: function(){
                return {
                    "eventName" : Lyte.attr("string")
                }
            }, 
            didDestroy : function() {
                Lyte.removeEventListener(this.regId);
            }
        });

Lyte.Component.registerCustomPropHandler("ltProp");