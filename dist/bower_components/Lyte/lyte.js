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
}Lyte = {
    version : "2.0.0",
    $ : {},
    registeredMixins : {},
    Mixin : {},
    debug : false,
    performance : false,
    toBeRegistered : []
};

var consoleTime = [];

(function assetsDivCreation() {
    Lyte.$.assetsDiv = document.createElement("div");
    Lyte.$.assetsDiv.setAttribute("id", "lyteAssetsDiv");
    document.head.appendChild(Lyte.$.assetsDiv);
})();

Lyte.registerErrorCodes = function(obj) {
    Object.assign(Lyte.errorCodes, obj);
}

Lyte.getErrorMessage = function(code) {
    var args = Array.from(arguments).slice(1);
    if(Lyte.errorCodes[code]) {
        return Lyte.errorCodes[code].replace(/{(\d+)}/g, function(t, i) {
            return args[i]
        });
    } else {
        return code;
    }
}


Lyte.error = function() {
    var errorObj = arguments[0].stack || Error(Lyte.getErrorMessage.apply(Lyte,arguments))
    if(Lyte.onerror) {
      Lyte.onerror.call(this,errorObj);
    }
    Lyte.triggerEvent("error",errorObj);
    console.error.call(console,errorObj);
}

Lyte.warn = function() {
    var errorObj = arguments[0].stack || Error(Lyte.getErrorMessage.apply(Lyte,arguments));
    console.warn.call(console,errorObj);
}

Lyte.Mixin.register = function(name, mixin){
  Lyte.registeredMixins[name] = mixin;
}

Lyte.Mixin.exists = function(name) {
  if(!Lyte.registeredMixins[name]) {
    Lyte.error('Mixin used before being registered.');
    return false;
  }
  return true;
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


/* --------- lyte router v2 changes starts---- */
var reqFiles = {};

Lyte.injectResources = function (files, every, completed) {
  var successFiles = [],
  errorFiles = []; 
  every = every || function() {};
  completed = completed || function() {};
  return new Promise(function(resolve) {
    processRequirements(files, resolve);   
  }).then(function() {
    completed(successFiles,errorFiles);  
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
          requestFile(file, Lyte.injectResources.availableTags[file], function() {
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
      if(len == 0) {
        resolve();
      }
    }
    
    function requestFile(file,cached,resolve) {
      if(reqFiles[file]) {
        reqFiles[file].push(resolve)
      } else {
        reqFiles[file] = [resolve];
        if(cached && cached.event.type != "error") {
          if(Lyte.removeFromCache.arr.indexOf(file) != -1) {
            Lyte.removeFromCache.arr.splice(Lyte.removeFromCache.arr.indexOf(file),1);
          }
          fileLoaded.call(cached.tag,cached.event,true);
          resolve();
        } else {
          makeRequest(file,
            function(event) {
              reqFiles[file].forEach(function(resolve) {
                resolve();
              });
              fileLoaded.call(this,event);
              every.call(this,event);
            }
          );
        }
      }
    }

    function fileLoaded(event,cached) {
      var file = this.getAttribute('src') || this.getAttribute('href');
      delete reqFiles[file];
      if(!cached) {
        if(Lyte.injectResources.availableTags[file]) {
          Lyte.injectResources.availableTags[file].tag.remove();
        }
        this.onerror = this.onload = undefined;
        Lyte.injectResources.availableTags[file] = {tag : this, event : {type : event.type}};
      }
    }
  }

  function makeRequest(file,callBack) {
    var tag,
    fileSplit = file.split('.'),
    type = fileSplit[fileSplit.length - 1],
    tags = { js: 'script', css: 'link' };
    tag = document.createElement(tags[type]);
    if (fileSplit.length == 1) {
      Lyte.error('Type of file is not specified in injectResources.');
      return;
    }
    if (type == 'css') {
      tag.setAttribute('href', file);
      tag.setAttribute('type', "text/css");
      tag.setAttribute('rel', "stylesheet");
    } else {
      tag.setAttribute('src', file);
    }
    tag.onerror = tag.onload = function (event) {
      if(event.type == "error") {
        errorFiles.push(event);  
      } else {
        successFiles.push(event);
      }
      if(callBack) {
        callBack.call(this,event);
      }
    };
    document.getElementById("lyteAssetsDiv").appendChild(tag);
  };
};

Lyte.injectResources.availableTags = [];

Lyte.removeFromCache = function(arr) {
  Lyte.removeFromCache.assign(arr);
  if(Lyte.removeFromCache.arr.length) {
    Lyte.removeFromCache.arr.forEach(function(file) {
      if(Lyte.injectResources.availableTags[file]) {
        Lyte.injectResources.availableTags[file].tag.remove();
        delete Lyte.injectResources.availableTags[file];  
      }
    });
    Lyte.removeFromCache.arr = [];
  }
}

Lyte.removeFromCache.arr = [];

Lyte.removeFromCache.assign = function(arr) {
  arr = arr == "*" ? Object.keys(Lyte.injectResources.availableTags) : (Array.isArray(arr) ? arr : [arr]); 
  Lyte.removeFromCache.arr = Lyte.removeFromCache.arr.concat(arr);
  return;
}

/* --------- lyte router v2 changes ends ---- */

Lyte.checkProperty = function(property, dataVal, key, fieldVal, record, type){
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
      else if(dataVal !== undefined){
        if(Array.isArray(dataVal)){
           if(fieldVal != "array"){
              return {code : "ERR03", message : Lyte.errorCodes.ERR03, expected : fieldVal};
           }
        }
        else if(fieldVal != (typeof dataVal)){
          return {code : "ERR03", message : Lyte.errorCodes.ERR03, expected : fieldVal};
        }
      }
      break;
    case "mandatory":
      if(dataVal == undefined || dataVal == null || dataVal == ""){
        return {code : "ERR02", message: Lyte.errorCodes.ERR02 };
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
      if(dataVal && dataVal.length > fieldVal){
        return {code : "ERR06", message : Lyte.errorCodes.ERR06, expected : fieldVal};
      }
      break;
    case "minLength" :
    case "minItems" :
      if(dataVal && dataVal.length < fieldVal){
        return {code : "ERR07", message : Lyte.errorCodes.ERR07, expected : fieldVal};
      }
      break;
    case "pattern" :
      if(dataVal && (typeof dataVal == "string") && !(new RegExp(fieldVal).test(dataVal))){
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
      else if(dataVal && dataVal != fieldVal){
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
  var obj = {};
  obj.type = type;
  if(opts == undefined){
    opts = {};
  }
  if(this.types.indexOf(type) == -1 && !Lyte.Transform.hasOwnProperty(type)){
    throw new Error("Not a valid field type - "+type);
  }
  Object.assign(obj,opts);
  return obj;
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
  email : /^([A-Za-z0-9._%\-'+/]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,22})$/,
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
  var type = definition ? definition.type : undefined;
  for(var defKey in definition) {
    isError = Lyte.checkProperty(defKey, value, key, definition[defKey], object, type);
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
  ERR20 : "Key not specified", ERR21 : "'belongsTo' relationship expects a single object/id", ERR22 : "Type not specified for polymorphic relation", ERR23: "Primary Key value not present", ERR24: "Error while relating record", ERR25: "Backward relation not present"
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
       Lyte.error("Second parameter to LyteComponent.addGlobalEventListener() must be a function");
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
     Lyte.error("listener unique id not specified");
     return;
   }
   var globalId  = id.split("-");
   var s = this.registeredGlobalEvents[globalId[0]];
   if(!s || !s.listeners[globalId[1]]) {
       Lyte.error("No such listener registered");
       return;
   }
   s.listeners[globalId[1]] = null;
 }

Lyte.deepCopyObject = function( obj )  {
  var targetVal = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  var current, copies = [{source : obj, target : targetVal}], keys, propertyIndex, descriptor, nextSource, indexOf, sourceReferences = [obj];
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
          descriptor.value = Array.isArray(nextSource) ? [] : nextSource instanceof Set ? new Set() : Object.create(Object.getPrototypeOf(nextSource));
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
  if(typeof promises != "string") {
    if(Array.isArray(promises)) {
      return promiseArray(promises);
    } else if(typeof promises == "object") {
      return promiseHash(promises);
    }    
  } else {
      return promises;
  }

  function promiseHash(promiseObj) {
    var actPromKeys = [],
    promises = [],
    promiseKeys = Object.keys(promiseObj);
    promiseKeys.forEach(function(key) {
        var value = promiseObj[key];
      if(value instanceof Promise) {
        actPromKeys.push(key)
        promises.push(value);
      }
    });
    if(!promises.length) {
      return promiseObj;
    } else {
       var obj = {},promise = new Promise(function(resolve,reject) {
          Promise.all(promises).then(function(data) {
            promiseKeys.forEach(function(promiseKey) {
              if(actPromKeys.indexOf(promiseKey) != -1) {
                obj[promiseKey] = data[actPromKeys.indexOf(promiseKey)]
              } else {
                obj[promiseKey] = promiseObj[promiseKey];
              }
            });
          resolve(obj);
        },function(err) {
          reject(err);
          Lyte.error(err);
        });
      });   
     return promise;
    }
  }

  function promiseArray(promiseArray) {
    var array = [],
    hasPromise = false;
    promiseArray.every(function(item,i) {
        if(item instanceof Promise) { 
            hasPromise = true;
            return false;
        }
        return true
    });
    if(!hasPromise) {
        return promiseArray;
    }
    var promise = new Promise(function(resolve,reject) {
      Promise.all(promiseArray).then(function(data) {
        promiseArray.forEach(function(key,index){
          array[index] = data[index];
        });
        resolve(array);
      },function(err) {
        reject(err);
        Lyte.error(err);
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
};
(function _router(window) {
  window.lyteRouter = function Router(routes) {
    window._router = _router;
    var newTransInfo,
    LR = this,
    definitions = {},
    dloc = document.location,
    config = {
      queryParamOptions : {}
    },
    trans,
    prevTrans,
    Route,
    routeHash = {},
    visibleTrans,
    logger = 'route',
    historyObj,
    initialLoad = true,
    fromHistoryGo = false,
    allowHistoryChange = false,
    routeParser,
    run = {},
    invokeRunLoop,
    basicHooks = ["beforeModel","model","afterModel","redirect","renderTemplate","afterRender"],
    reqestedType = {getDependencies : "dependencies",getResources : "resources"},
    stoppableHooks = ["getResources","getDependencies","beforeModel","model","afterModel"],
    processedDispatch;

    run.getResources = run.getDependencies = function(hook,index) {
      var currentRoute = this.currentRoutes[index],
      callback = currentRoute[hook],
      routeInstance = this.routeInstances[index],
      require = callHookWithoutPromise.call(this,callback,routeInstance,hook,params(index));
      currentRoute.__lp[reqestedType[hook]+'Loaded'] = callback ? false : true;
      if(callback && !this.aborted && !this.paused) {
        currentRoute.__lp[reqestedType[hook]] = require;
        if(require && hook == "getDependencies") {
          console.log('Requesting files in getDependencies will stall execution of route till download completes. Please validate files before requesting.');
        }
        getRequirements.call(this,{reqType : reqestedType[hook],currentRoute : currentRoute,  index : index});
      }
      return callHookWithPromise();
    };

    run.beforeModel = run.model = function(hook,index) {
      return callHookWithPromise.call(this,this.currentRoutes[index][hook],this.routeInstances[index],params(index));
    };

    run.afterModel =  function(hook,index) {
      var routeInstance = this.routeInstances[index];
      return callHookWithPromise.call(this,this.currentRoutes[index][hook],routeInstance,routeInstance.currentModel,params(index));
    };

    run.onError = function(index,errObj) {
      consoleError(420,errObj.hook,this.routeInstances[index].routeName);
      for(; index >= 0; index--) {
          if(callAction.call(this,"onError",index,[errObj.error,this.routeTrans,params(index),errObj.hook]) == false) {
            break;
          }  
        }
      if(this.paused) {
        this.abort({state : errObj.state, internalAbort : true});
      }
    };

    run.willTransition = function(hook,index) {
      if(callAction.call(prevTrans,hook,index,[trans.routeTrans]) == false) {
        removeHook(trans.runLoop.previous,hook);
      }
      return callHookWithPromise();
    };

    run.beforeRouteTransition = function() {
      if(newTransInfo && !this.aborted) {
        newTransInfo.state = getHistoryState({replace : newTransInfo.replace,data : trans.routeTrans.data,matched : trans.matched});
        LR.beforeRouteTransition(prevTrans && prevTrans.routeTrans || undefined, trans.routeTrans, getHistoryObj(newTransInfo));
        trans.routeTrans.state = 102;
        if(newTransInfo && trans.routeTrans.data) {
          newTransInfo.state.data = trans.routeTrans.data
        }
        addToHistory(newTransInfo);
        newTransInfo = undefined;
        trans.runningPromise.reject('aborted');
        processedDispatch.previous = false;
        trans.runLoop = constructRunLoop(processedDispatch);
        trans.run();
      }
      return callHookWithPromise();
    };

    run.onBeforeLoad = function() {
      trans.beforeLoadCalled = true;
      return new Promise(function(resolve,reject) {
        for(var len,i=1;i <= trans.matched.route.length;i++) {
          len = trans.matched.route.length-i;
          if((callAction.call(trans,"onBeforeLoad",len,[params(len)]) == false) || (i == trans.matched.route.length)) {
            resolve();
            break;
          }
        }
      });
    };

    run.redirect =  function(hook,index) {
      var routeInstance = this.routeInstances[index];
      return callHookWithPromise.call(this,this.currentRoutes[index][hook],routeInstance,routeInstance.currentModel,params(index));
    };

    run.afterRender = function(hook,index) {
      this.routeInstances[index].__lp.rendered =  true;
      return new Promise(function(resolve, reject) {
        var ar = setTimeout(function() {
          var routeInstance = this.routeInstances[index];
          callHookWithPromise.call(this,this.currentRoutes[index][hook],routeInstance,routeInstance.currentModel,params(index),routeInstance.component).then(function(data) {
            resolve(data);
          }, function(data) {
            reject(data);
          });
        }.bind(this,hook,index),0);
        this.timeouteFns.push(ar);          
      }.bind(this));
    };
    
    run.didTransition = function(hook,index) {
      return new Promise(function(resolve, reject) {
        var dt = setTimeout(function() {
          run.removeTemplate.call(this,this.runLoop.templateToRemove);
          if(callAction.call(this,hook,index,[params(index),trans.routeTrans]) == false) {
            removeHook(trans.runLoop.current,hook);
          }
          resolve();
          if(index == 0) {
            transitionCompleted({state : 200});
          }
        }.bind(this,hook,index),0);
        this.timeouteFns.push(dt);          
      }.bind(this));
    };

    run.beforeExit = function(hook,index) {
      var prevTransRouteInstance = prevTrans.routeInstances[index],
      callback = prevTrans.currentRoutes[index][hook];
      return callHookWithPromise.call(this,callback,prevTransRouteInstance,prevTransRouteInstance.currentModel,params(index,prevTrans));
    };

    run.renderTemplate = function(hook,index) {
      var currentRoute = this.currentRoutes[index],
      routeInstance = this.routeInstances[index];
      if(this.runLoop.templateToRemove && this.currentRoutes.length == index+1) {
        run.removeTemplate.call(this,this.runLoop.templateToRemove)
      }
      if(this.currentRoutes[index][hook]) {
        var renderTemplate = callHookWithoutPromise.call(this,currentRoute[hook],routeInstance,hook,routeInstance.currentModel,params(index));
        if(!this.aborted) {
          run.removeTemplate.call(this,this.runLoop.templateToRemove);
          if(visibleTrans != this) {
            visibleTrans = this;
          }
          if(renderTemplate && renderTemplate.outlet) {
            routeInstance.outletName = renderTemplate.outlet;
            var data = routeInstance.currentModel,
            outlet;
            if(outlet = getOutlet(renderTemplate.outlet,routeInstance.parent)) {
              if(renderTemplate.component) {
                var component;
                if(routeInstance.component && (routeInstance.component.tagName.toLocaleLowerCase() == renderTemplate.component) && routeInstance.outlet == outlet && outlet.contains(routeInstance.component)) {
                  component = routeInstance.component;
                  component._route = routeInstance;
                  routeInstance.outlet = outlet;
                  routeInstance.component = component;
                  setDataInComponent.call(this,component,data);
                } else {
                  Lyte.triggerEvent("beforeTemplateDestroy", renderTemplate.outlet , routeInstance);
                  outlet.innerHTML = '';
                  component = document.createElement(renderTemplate.component);
                  component._route = routeInstance;
                  routeInstance.outlet = outlet;
                  routeInstance.component = component;
                  setDataInComponent(component,data);
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
          } else {
            console.warn("renderTemplate hook should return either component or HTML. Rendering of HTML directly into the DOM within the renderTemplate hook is deprecated.");
          }
        }  
      }
      return callHookWithPromise();

      function setDataInComponent(component,data) {
        if(data) {
           if(typeof data == "object" && !Array.isArray(data)) {
            component.setData(data);
          } else {
            processError.call(this,true,Error(getError(203)).stack,routeInstance);
          }   
        }
      }
      
      function getOutlet(outlet,parent) {
        var _outlet;
        if(parent) {
          _outlet =  parent.outletName ? document.querySelector(parent.outletName).querySelector(outlet) : undefined;
          if(!_outlet) {
            return getOutlet(outlet,parent.parent);
          }
        } else if(!(_outlet = document.querySelector(outlet))) {
          consoleError(428,outlet);
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
          parent.appendChild(s);
          parent.removeChild(currentScript);
        }
      }
    };
    
    run.removeTemplate = function(arr) {
      if(!this.routeCleared) {
        this.routeCleared = true;
        if (prevTrans && arr) {
          templateDelete(arr);
        }
        delete this.runLoop.templateToRemove;
        Lyte.removeFromCache();
      }
    };

    function params(index,t) {
      t = t || trans;
      return {queryParams : t.routeInstances[index].__lp.queryParams, 
              dynamicParam : t.routeInstances[index].__lp.dynamicParam};
    }
      
    function addToHistory(obj) {
      var type = obj.replace ? "replaceState" : "pushState",
      url = obj.url ? (config.history ? _delimit(shiftBaseURL(obj.url, true)) : '#'+_delimit(obj.url)) : undefined;
      obj.title = obj.title || document.title;
      /* support for windows, undefined is appended to url */
      if(url) {
        window.history[type](obj.state, obj.title, url);
      } else {
        window.history[type](obj.state, obj.title);
      }
      return obj;
    }

    function getHistoryState(obj) {
      /* 
        state data which needs to be pushed to history. 
          - Matched object is added to process url directly with history back and forward.
          - Index is used to detect browser back or forward.
      */
      return {
        meta : {
          matched : obj.matched,
          index : (obj.replace && history.state && history.state.meta) ? history.state.meta.index : (initialLoad ? history.length-1 : history.length)
        },
        data : obj.data
      };
    }

    function getHistoryObj(obj) {
      /* parses history state to history object. */
      if(!LR.history) {
        historyRegistration();
      }
      LR.history.fromHistory = obj.fromHistory ? ((LR.history.index = obj.state.meta.index) < history.length-1 ? 'back' : 'forward') : false;
      allowHistoryChange = true;
      LR.history.state = history.state ? history.state.data : {};
      LR.history.initial = initialLoad;
      return LR.history;
    }

    this.configureDefaults = function(options) {
      options = options || {};
      config.history = options.history == "html5" ? true : false;
      config.baseURL =  options.baseURL;
      config.deferInit = options.deferInit || false;
      config.queryParamOptions = {
        sticky : options.queryParamOptions && options.queryParamOptions.hasOwnProperty('sticky') ?  options.queryParamOptions.sticky : true
      };
      this.__lp = {
        version : "2.0.0",
        config : config,
        getDefinition : function(arr,def) {
          if(arr == "*") {
            return definitions;
          } else {
            def = def || definitions;
            def = _getObj(arr,def);
            return def && def.__lp || undefined;  
          }
        }
      };
    }; 

    this.configureRoutes = function (map) {
      if(!this.__lp) {
        this.configureDefaults();
      }
      config.routes = typeof map == "function" ? parseRouteMapping.call(this, map) : map;
      if(document.readyState === "complete" || document.readyState === "interactive") { 
        init();
      } else {
        window.addEventListener('DOMContentLoaded', function() {
          init();
        });
      }
      function init () { /* move this code outside.*/
        if(!config.deferInit && LR.init) {
          LR.init();
          delete LR.init;
        }  
      }
    };

    this.init = function(r) {
      window.onpopstate = function(onChangeEvent) {
        if(fromHistoryGo) {
          fromHistoryGo = false;
          return;
        }
        var url;
        if(config.history) {
          url = getLocation();
          if(trans && trans.url == url) {
            return;
          }
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
      
      if(config.history) {
        if(getLocation()) {
          window.onpopstate();
        }   
      } else {
        historyObj = {fromHistory : true};
        dispatch(getLocation());
      }
      linkToRegistration();
      return this;
    };
    
    this.beforeRouteTransition = this.afterRouteTransition = function() {};

    function setRouteDef(dir,value) {
      var cache = definitions,
      dirLen = dir.length-1;
      dir.forEach(function(key,i) {
        if(dirLen === i) {
          if(cache[key]) {
            cache[key].__lp = value;
          } else {
            cache[key] = {__lp : value};
          }
        } else if(!cache[key])  {
          cache[key]={};
        }
        cache = cache[key];
      });
    }   

    function linkToRegistration() {
      class LinkTo extends HTMLElement {
        static get observedAttributes() {
          return ['lt-prop-route', 'lt-prop-dp', 'lt-prop-fragment', 'lt-prop-qp', 'lt-prop', 'lt-prop-class', 'lt-prop-id', 'lt-prop-rel', 'lt-prop-title', 'lt-prop-style', 'lt-prop-target'];
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
              if(!this.pendingCallback) {
                this.pendingCallback = true;
                setTimeout(function() {
                  this.pendingCallback = false;
                  this.getMatchedObject();
                }.bind(this),0);  
              }
              if(firstChild.tagName === "A") {
                this.constructHref(firstChild);
              }
            } 
            //if it is a route transition attribute
            else if(/^(lt-prop-route|lt-prop-fragment|lt-prop-dp|lt-prop-qp)$/.test(attr)) {
              this.getMatchedObject();
              if(firstChild.tagName === "A") {
                this.constructHref(firstChild, attr, oldValue, newValue);
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
          if(LyteComponent) {
            this._linkToEventId = LyteComponent.addLyteEventListener(this, "click", function(event) {
              linkToEventListener(event, this);
            }, this);
          } else {
            this.addEventListener("click", linkToEventListener);
          }
          //linkToEventListener(this);
          this._linkCreated = true;
        }
        modifyLinkToTagsInRoute(remove) {
          let def = definitions;
          let routes = remove && remove != true ? remove : this.matched.route;
          if(!routes) {
            consoleError(498,"route","link-to");
            return;
          } 
          routes =  dotSerperator(routes);
          routes.forEach(function(r) {
            def =  _getObj(r,def);
            if(!def || !def.__lp) {
              Error(getError(422,this.matched.target));
              return false;
            }
            var definition = def.__lp.__lp;
            if(remove) {
              definition.linkTags.splice(definition.linkTags.indexOf(this),1);
            } else {
              definition.linkTags.push(this);  
            }
          }.bind(this));
        }
        disconnectedCallback() {
          if(this._linkToEventId && !LyteComponent.ignoreDisconnect) {
            this.modifyLinkToTagsInRoute(true);
            LyteComponent.removeLyteEventListener(this, this._linkToEventId);
          }
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
        constructHref(linkTag, attr, oldValue , newValue) {
          let href;
          if(href = LR.getURL(this.matched)) {
            linkTag.setAttribute("href", href); 
            if(attr) {
              if(attr == "lt-prop-route") {
                this.modifyLinkToTagsInRoute(oldValue);
                this.modifyLinkToTagsInRoute();
              } else {
                this.modifyLinkToTagsInRoute(this.matched.route);
                this.modifyLinkToTagsInRoute();
              }
            } else {
              this.modifyLinkToTagsInRoute();
            }
          }
        }
      }
      LinkTo.prototype.getMatchedObject = function(reset) {
        let matched = reset ? {} : (this.matched ? this.matched : {});
        matched.route = this.getAttribute("lt-prop-route") || this.ltProp.route;
        matched.fragment = this.getAttribute("lt-prop-fragment");
        let dynamicParams = this.getAttribute("lt-prop-dp") || this.ltProp.dp || [],
        queryParams = this.getAttribute("lt-prop-qp") || this.ltProp.qp || {};
        if(!(dynamicParams instanceof Array)) {
          try {
            matched.dynamicParams = JSON.parse(dynamicParams) || [];  
          } catch(e) {
            consoleError(498,"dynamicParams","link-to");
            matched.dynamicParams = [];
            return;
          }
        } else {
          matched.dynamicParams = [];
        }
        if(!(queryParams instanceof Object)) {
          try{
            matched.queryParams = JSON.parse(queryParams);
          } catch(e) {
            consoleError(498,"queryParams","link-to");
            matched.queryParams = {};
          }
        } else {
          matched.queryParams = {};
        }
        return this.matched = matched;
      };
      customElements.define('link-to', LinkTo);
    }

    function linkToEventListener(event, linkTo) {
      if(event.button == 2 || event.defaultPrevented) {
        return;
      }
      var targetElem = linkTo || event.currentTarget;
      if(targetElem.children[0].tagName === "A" && (event.ctrlKey == true || event.metaKey == true || event.which == 2 || (targetElem.children[0].hasAttribute("target") && targetElem.children[0].getAttribute("target") !== "_self")) ) {
        return;  
      }
      event.preventDefault();
      var currentTransition = LR.getRouteInstance().transition,
      transitionInstance;
      if(currentTransition && LR.checkIfSameRoute(targetElem.matched, currentTransition.info) && targetElem.hasAttribute("lt-prop-refresh-route")) {
          transitionInstance = LR.getRouteInstance(targetElem.getAttribute("lt-prop-refresh-route")).refresh(); 
      } else {
        transitionInstance = LR.transitionTo(targetElem.matched);
      }
      var transObj = {};
      if(targetElem.getAttribute("lt-prop-trans")) {
        try{
          transObj = JSON.parse(targetElem.getAttribute("lt-prop-trans"));  
        }
        catch(e) {
          consoleError(498, "lt-prop-trans", "link-to");
        }
      }

      let transitionData = targetElem.getAttribute("lt-prop-td");
      transitionData = transitionData || transObj.data;
      if(transitionData) {
        if(typeof transitionData === "string") {
          try{
          transitionData = JSON.parse(transitionData);
          } catch(e) {
            consoleError(498, "lt-prop-td", "link-to");
          }
        }
        transObj.data = transitionData;
      }
      for(var key in transObj) {
        transitionInstance[key] = transObj[key];
      }
    }

    this.checkIfSameRoute = function(transInfo1, transInfo2) {
      if(transInfo1.route == transInfo2.route && transInfo1.dynamicParams.length === transInfo1.dynamicParams.length && _compareObj(transInfo1.queryParams,transInfo2.queryParams)) {
        if(transInfo1.dynamicParams.length) {
          for(var i = 0; i <= transInfo1.dynamicParams.length; i++) {
            return transInfo1.dynamicParams[i] == transInfo2.dynamicParams[i];
          }
        }
        return true;
      }
      return false;
    };

    this.addRoutes = function(map) { 
      console.warn("addRoutes function will be deprecated from next version");
      Object.assign(config.routes,parseRouteMapping.call(routeParser,map));
    };

    function dotSerperator(str) {
      return str.split('.').filter(function(s) {return s != "";});
    }
    
    function _arrayClean(e) {
       return e != undefined;
    }

    function parseRouteMapping(map) {
      Lyte.time('parseRouteMapping');
      var routesObj = {},
      mapObj = {}, 
      pathStringArr = [], 
      routeStringArr = [];
      routeParser = {
        route : function(routeName,obj,nestedFn) {
          if(typeof obj == "object") {
            if(!obj.path) {obj.path = _delimit(routeName);}
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
            mapObj = _getObj(pathStringArr,routeHash)[obj.path] = {__lp : {}};
            pathStringArr.push('/');
          } else {
            var trimedPath = obj.path;
            mapObj = _getObj(pathStringArr,routeHash)[obj.path] = {__lp : {}};
            if(dynamicRouteCheck(trimedPath) || wildcardRouteCheck(trimedPath)) {
              _splitPath(trimedPath).every(function(seg,index,arr) {
                if(dynamicRouteCheck(seg)) {
                  obj.dynamicKey = mapObj.__lp.dynamicKey = seg.replace(":","");
                  obj.dynamicIndex = mapObj.__lp.dynamicIndex = index;
                  return false;
                } else if(wildcardRouteCheck(seg)) {
                  obj.dynamicKey = mapObj.__lp.dynamicKey = seg.replace("*","");
                  obj.dynamicIndex = mapObj.__lp.dynamicIndex = index;
                  obj.wildcard = mapObj.__lp.wildcard = true;
                  obj.sufix = mapObj.__lp.sufix = [];
                  for(var indx=index+1;indx<arr.length;indx++){
                    mapObj.__lp.sufix.push(arr[indx]);
                  }
                  return false;
                }
                return true;
              });
            } else {
              obj.dynamicKey = mapObj.__lp.dynamicKey = undefined;
            }
            pathStringArr.push(trimedPath);
          }
          routeStringArr.push(routeName);
          mapObj.__lp.route = Array.from(routeStringArr);
          var routes = routesObj;
          routeStringArr.forEach(function(r,index) {
            if(index +1 != routeStringArr.length) {
              routes = routes[r]; 
            }
          });
          routes[routeName] = {__lp : obj};
          if(nestedFn) {
            nestedFn.call(this,{});
          }
          routeStringArr.pop();
          pathStringArr.pop();
        }
      };
      map.call(routeParser,{});
      Lyte.time('parseRouteMapping');
      return routesObj;
    }

    this.replaceWith = function() {
      var args = normalizeTransitionParams.apply(this,arguments);
      if(args) {
        args.replace = true;
        return routeTransition(args);   
      }
    };

    this.transitionTo = function() {
      var matched;
      if(matched = normalizeTransitionParams.apply(this,arguments)) {
        return routeTransition(matched);  
      }
    };

    this.getURL = function () {
      var url,matched;
      if(matched  = normalizeTransitionParams.apply(this,arguments)) {
        url = constructURLFromRoute(matched);
      }
      return config.history ? shiftBaseURL(url, true) : '#'+url;
    };

    this.getRoute = function(url) {
      var matched = traverse(shiftBaseURL(url),true);
      if(matched) {
        matched.dynamicParams = matched.dynamicParams.filter(_arrayClean);
        matched.route = matched.route.join('.');
      }
      return matched;  
    };

    function routeTransition(matched) {
      if(matched) {
        if(typeof matched == "object") {
          var url;
          newTransInfo = {replace : matched.replace, title : trans ? trans.title : document.title,fromHistory : false};
          url = dispatchTransition(matched);
          Lyte.log('Transitioning to '+matched.route.join('.')+' '+url,logger);
        } else {
          consoleError(498,JSON.stringify(matched));
        }
        return trans.routeTrans;  
      } else {
        consoleError(499);
      }
    }

     function getLocation() {
      if(config.history) {
        var path = checkForEmptyPath(dloc.pathname + dloc.search + (dloc.hash || ""));
        path = shiftBaseURL(path);
        return _delimit(path);  
      } else {
        return _delimit(checkForEmptyPath(dloc.hash.replace(/^(#\/|#|\/)/, '')));
      }
    }

    function checkForEmptyPath(path) {
      if(!path) {
        addToHistory({
          replace : true,
          state : getHistoryState({
            replace : true,
            data : history.state && history.state.data || undefined
          }),
          url: (path = '/') 
        });
      }
      return path;
    }

    function shiftBaseURL(path,append) {
      var baseURL = config.baseURL;
      if(baseURL && path) {
        baseURL = _delimit(config.baseURL);
        if(path.indexOf(baseURL) == 0 && !append) {
          return path.replace(baseURL,'');
        } else if(append && path.indexOf(baseURL) == -1) {
          return baseURL+path;
        } 
      } 
      return path;
    }

    function constructURLFromRoute(matched) {
      if(matched) {
        if(matched.route && !Array.isArray(matched.route)) {
          matched.route = dotSerperator(matched.route);
        }
        var sameRoute = trans ? true : false,
        refreshModel = false,
        qp,
        def = definitions,
        routeObj = config.routes,
        url = '';  
        matched.route.forEach(function(route,index) {
          if(sameRoute && trans && trans.matched.route[index] != route) {
            sameRoute = false;
          }
          var _route = matched.route.slice(0,index+1);
          routeObj = _getObj(route,routeObj);
          def = _getObj(route,def);
          if(!routeObj && !routeObj.__lp) {
            consoleError(422,_route.join('.'));
            return false;
          }
          var path = routeObj.__lp.path;
          if(!def || !def.__lp) {
            if(defaultQP = routeObj.__lp.defQP) {
              for(var key in defaultQP) {
                if(matched.queryParams && !matched.queryParams.hasOwnProperty(key)) {
                  matched.queryParams[key] = defaultQP[key];
                } 
              }
            }
          } else if(def.__lp.queryParams) {
            var defaultQP = routeObj.__lp.defQP,
      queryParamsDef = def.__lp.__lp.queryParamsDef;
            for(var key in queryParamsDef) {
              if(!matched.queryParams.hasOwnProperty(key)) {
                if(sameRoute && queryParamsDef[key].sticky) {
                  matched.queryParams[key] = def.__lp.__lp.queryParams[key];
                } else if(defaultQP && defaultQP.hasOwnProperty(key)) {
                  matched.queryParams[key] = defaultQP[key];
                }
              }
              if(!refreshModel && queryParamsDef[key].refreshModel) {
                matched.refreshModel = true;
              }
            }
          }
          if(routeObj.__lp.dynamicKey) {
            var dynamicPathSplit = _splitPath(path);
            if(!matched.dynamicParams || matched.dynamicParams[index] == undefined) {
              consoleError(499,route);
              return false;   
            } else {
              dynamicPathSplit[routeObj.__lp.dynamicIndex] = encodeURI(matched.dynamicParams[index]);
              url += _delimit(dynamicPathSplit.join('/')); 
            } 
          } else {
            url += _delimit(path);
          }
        }.bind(this));
        url = url[url.length-1] == '/' && url.length != 1  ? url.slice(0,-1) : url;
        qp = Object.keys(matched.queryParams).filter(function(key){
            return matched.queryParams[key] == undefined ? false : key;
          });
        if(matched.queryParams && qp.length) {
          url += '?';
          qp.forEach(function(key,index) {
            url+= key+'='+encodeURIComponent(matched.queryParams[key])+(index < qp.length-1 ? '&' : '');  
          });
        }
        if(config.history && matched.fragment) {
          url = url+"#"+matched.fragment;
        }
        return validateURL(url);
      }
    }

    function historyRegistration() {
      LR.history = new History();
      function History() {
        return this;
      }

      Object.defineProperty(History.prototype, 'state', {
        get : function() {
          return history.state.data;
        },
        set : function(data) {
          if(allowHistoryChange) {
            allowHistoryChange = false;
          } else {
            console.warn('setting on data will not be pushed to history. If needed, use `Lyte.Router.history.replaceState`.');
          }
          return data;
        }
      });

      History.prototype.replaceState = function() {
        stateChange.apply(Array.from(arguments).push(true));
      };

      History.prototype.pushState = function() {
        stateChange.apply(Array.from(arguments));
      };

      function stateChange(data,title,url,replace) {
        addToHistory({
          state : {
            meta : replace ? history.state.meta : history.state.meta+1,
            data : data
          },
          title: title, 
          url: url
        });
      }
    }  

    function dispatch(path,processed) {
      Lyte.time('RouteTransition');
      if(trans && (trans.routeTrans.state && trans.routeTrans.state == 102  || (prevTrans && trans != prevTrans))) {
        clearTimeout(invokeRunLoop);
        trans.abort({state : 409, internalAbort : true});
      }
      processed = processed || (!initialLoad && history.state && history.state.meta && history.state.meta.matched ? setParamsInDef(history.state.meta.matched) : traverse(path));
      if(processed && processed.matched.route.length) {
        processed.prevTrans = processed.prevTrans || prevTrans;
        invoke(path,processed);
        invokeRunLoop = setTimeout(function() {
          Lyte.time('constructRunLoop');
          processed.previous = true;
          trans.runLoop = constructRunLoop(processedDispatch = processed);
          if(newTransInfo && trans.routeTrans.data) {
            newTransInfo.data = trans.routeTrans.data;
          }
          trans.running = true;
          trans.run();
          Lyte.time('constructRunLoop');  
        },0);
      } 
      return;
    }

    function getTransitionDiffernce(prevTrans, matched, currentRoutes) {
      var like = true,
      similar = true,
      rendered = [],
      common = [],
      unRendered = [],
      templateToRemove,
      currentRoute;   

      function compareRoute(index) {
        var same = true;
        if(!currentRoute.queryParams && !currentRoute.__lp.dynamicParam) {
          return true;
        }
        if(currentRoute.__lp.dynamicParam && prevMatched.dynamicParams[index] != matched.dynamicParams[index]) {
          return false;
        } else if(currentRoute.queryParams) {
          currentRoute.queryParams.every(function(key) {
            if(same && currentRoute.__lp.queryParamsDef[key].refreshModel && (matched.queryParams || prevMatched.queryParams) && matched.queryParams[key] != prevMatched.queryParams[key]) {
              return same = false;
            } else {
              return true;
            } 
          });
        }
        return same;
      }

      if(prevTrans) {
        var prevMatched = prevTrans.matched;
        matched.route.forEach(function(route,index) {
          if(similar && route == prevMatched.route[index]) {
            currentRoute = currentRoutes ? currentRoutes[index] : LR.__lp.getDefinition(route.slice(0,index));
            if(like && compareRoute(index)) {
              if(prevTrans.routeInstances[index].__lp.rendered) {
                rendered.push(route);  
              } else {
                like = false;
                unRendered.push(route);  
              }
              common.push(route);
            } else {
              like = false;
              unRendered.push(route);
            }
          } else {
            similar = false;
            if(templateToRemove == undefined && prevTrans.routeInstances[index] && prevTrans.routeInstances[index].__lp.rendered) {
              templateToRemove = index;
            }
            unRendered.push(route);
          }
        });
        if(prevMatched.route.length > matched.route.length) {
          var index = matched.route.length;
          if(templateToRemove == undefined && prevTrans.routeInstances[index].__lp.rendered) {
            templateToRemove = index;
          }
        }
      } else {
        unRendered = unRendered.concat(matched.route);
      }
      return {
        rendered : rendered,
        unRendered : unRendered,
        common : common,
        templateToRemove : templateToRemove
      };
    }

    function constructRunLoop(processed) {
      var transComparison = processed.transComparison || getTransitionDiffernce(prevTrans, processed.matched,processed.currentRoutes),
      runLoop = [],
      forceFetch = {
        beforeModel : [],
        model : [],
        afterModel : []
      },
      req = [],
      b4Exit = [],
      willTransit = [],
      didTransit = [];

      if (processed.previous) {
        var b4RouteTrans = [{hook : 'beforeRouteTransition'}];
        if(prevTrans) {
          for(var i = prevTrans.matched.route.length-1; i>=0; i--) {
            if(prevTrans.matched.route[i] && prevTrans.matched.route[i] != trans.matched.route[i]) {
              b4Exit.push({hook : "beforeExit", index : i});
            }
            willTransit.push({hook : "willTransition", index : i});
          }
          return {previous : willTransit.concat(b4Exit.concat(b4RouteTrans)) ,current : [],forceFetch : []};   
        }
        return {previous : b4RouteTrans,current : [],forceFetch : []};
      }
      if(transComparison.rendered && transComparison.rendered.length) {
        transComparison.rendered.forEach(function(hook,index) {
          trans.routeInstances[index].__lp.rendered = true;
          runLoop.push({hook : "redirect",index : index});
          didTransit.push({hook : "didTransition",index : trans.matched.route.length-index-1});
        });
      }
      if(transComparison.unRendered && transComparison.unRendered.length) {
        transComparison.unRendered.forEach(function(hook,index) {
          index = transComparison.rendered.length+index;
          if(transComparison.executed && transComparison.executed.index == index) {
            if(transComparison.executed.hook == "getResources") {
              req.push({hook : "getDependencies",index : index});  
            }
          } else {
            req.push({hook : "getResources",index : index});
            req.push({hook : "getDependencies",index : index});
          }
          var routeInstance = trans.routeInstances[index];
          if(typeof routeInstance.forceFetch == "function" ? callHookWithoutPromise.call(this,routeInstance.forceFetch,routeInstance,"forceFetch",params(index)) : routeInstance.forceFetch) {
            ["beforeModel","model","afterModel"].forEach(function(h) {
              forceFetch[h].push({hook : h,index : index});
            });
            processed.currentRoutes[index]._fetchStatus = "pending";
            ["redirect","renderTemplate","afterRender"].forEach(function(h) {
              runLoop.push({hook : h,index : index});  
            });
          } else {
            var resume = false;
            basicHooks.forEach(function(h) {
              if(transComparison.executed && transComparison.executed.index == index) {
                if(transComparison.executed.hook == h || resume) {
                  if(h == "redirect") {
                    runLoop.push({hook : h,index : index});
                  } 
                  if(!resume) {
                    resume = true;
                  } else {
                    runLoop.push({hook : h,index : index});
                  }
                }
              } else {
                runLoop.push({hook : h,index : index});    
              }
            });  
          }
          didTransit.push({hook : "didTransition",index : trans.matched.route.length-index-1});
        });
      }
      
      runLoop = {
        previous : [],
        current : req.concat(runLoop).concat(didTransit),
        forceFetch : forceFetch
      };
      runLoop.templateToRemove = (prevTrans && prevTrans.runLoop.templateToRemove) ? prevTrans.runLoop.templateToRemove : [];
      if(transComparison.templateToRemove != undefined) {
        runLoop.templateToRemove.push({index : transComparison.templateToRemove, routeInstances : prevTrans.routeInstances});
      }
      return runLoop;
    }

    function invoke(path,processed) {
      LR.__lp.trans = trans = new Transition(processed);
      trans.url = path;
      trans.runLoop = {previous : [],current : [],forceFetch : []};
      trans.routeTrans = limitTransition(trans);
      trans.routeInstances = Router.initRoute(processed);
      if(historyObj) {
        newTransInfo = historyObj;
        trans.routeTrans.data = history.state ? history.state.data : {};
        historyObj.replace = true;
        historyObj = undefined;
      } else if(trans.routeTrans.data) {
        LR.history.replaceState(trans.routeTrans.data);
      }
    }

    function _getObj(arr,obj) {
      if(!obj) {
        consoleError(getError(498));
        return;
      } else if(!arr) {
        return obj;
      } else if(!Array.isArray(arr) && typeof arr == 'string') {
        arr = dotSerperator(arr);
      }
      arr.every(function(key)  {
        if(obj && obj[key]) {
          obj = obj[key];
          return true;
        }
        return obj = false;
      });
      return obj;
    }

    function abortRunningPromises(trans) {
     if(trans.runningPromise) {
        trans.runningPromise.reject('aborted');  
      }
      if(trans.forcedRunningPromise) {
        trans.forcedRunningPromise.reject('aborted');   
      }
    }

    function Transition(processed) {
      this.matched = processed.matched;
      this.target = processed.matched.target;
      this.timeouteFns = [];
      this.info = {
        route : processed.matched.target,
        queryParams : processed.matched.queryParams,
        dynamicParams : processed.matched.dynamicParams.filter(_arrayClean)
      };
      if(processed.matched.fragment) {
        this.info.fragment = processed.matched.fragment;
      }
      this.currentRoutes = processed.currentRoutes;
      this.aborted = this.paused = false;
      this.abort = function(obj) {
        if(!this.aborted) {
          abortRunningPromises(this);
          this.timeouteFns.forEach(function(callback) {
            clearTimeout(callback);
          });
          this.aborted = true;
          if(!obj) {
            obj = {state : 308};
          } 
          Lyte.log('Transition aborted.',logger);
          if(!obj.internalAbort) {
            delete this.runLoop.templateToRemove;
            if(prevTrans.url != getLocation() && this.routeTrans.state == 201) {
              fromHistoryGo = true;
              if(history.state && history.state.meta && history.state.meta.index != undefined && history.state.meta.index < history.length) {
                history.go(1);
              } else {
                history.go(-1);
              }
            }  
          }
          transitionCompleted(obj);
        }
      }.bind(this);
      this.pause = function() {
        if(!this.paused) {
          Lyte.log('Transition paused.',logger);
          abortRunningPromises(this);
          this.routeTrans.state = 307;
          this.paused = trans.currentPromise || true;
          this.resume = this.routeTrans.resume = function(t) {
            t = t || this;
            delete t.routeTrans.resume;
            delete t.resume;
            Lyte.log('Transition resumed.',logger);
            if(t.paused) {
              if(t.paused != true) {
                var state = t.paused.state;
                if(t.runLoop[state][0] && t.runLoop[state][0].hook == t.paused.hook && t.runLoop[state][0].index == t.paused.index) {
                  removeHook(t.runLoop[state],t.paused.hook,t.paused.index);
                }
              }
              t.paused = false;
              t.routeTrans.state = 102;
              t.run();
            }
          }.bind(this);
          return this.routeTrans;
        }
      }.bind(this);
    }

    function getRequirements(object) {
      var reqType = object.reqType,
      currentRoute = object.currentRoute,
      index = object.index,
      hook = trans.currentPromise.hook,
      errorType = reqType == "dependencies" ? "errorDependencies" : "errorResources",
      self = this;
      Lyte.injectResources(currentRoute.__lp[reqType],function() {
        //callback after every file request
      },function(successFiles,errorFiles) {
        currentRoute.__lp[reqType+'Loaded'] = true;
        if(!errorFiles.length) {
          if(trans.pending && trans.pending[reqType] != undefined && trans.pending[reqType] == index) {
            trans.run();
          }
        } else {
          if(!self.aborted) {
            if(!self.paused) {
              self.pause();  
            }
            run.onError.call(self,index,{state : 424, error : (currentRoute.__lp[errorType] = errorFiles), hook : hook});  
          }
        }         
      });
    }

    var requirements = {
      get : function(def,type) {
        return def.__lp[type+'Loaded'] != false;
      }
    };

    function templateDelete(arr) {
      arr.forEach(function(obj) {
        for (var inst, i = obj.routeInstances.length - 1; i >= obj.index; i--) {
          inst = obj.routeInstances[i];
          delete inst.__lp.rendered;  
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

    function errorStoppableHook(hook) {
      return _presence(stoppableHooks,hook);
    }

    function callHookWithPromise(callback,instance) {
      if(callback) { 
        var args = arguments,
        resp,
        hook = trans.currentPromise.hook, 
        stopTrans = errorStoppableHook(hook),
        self = this;
        return Promise.resolve(new Promise(function(resolve,reject) {
          try {
            var result = callback.apply(instance,Array.from(args).slice(2));
            if(stopTrans && result) {
              result = Lyte.resolvePromises(result);
            }
            resp = Promise.resolve(result);
          } catch(err) {
            processError.call(self,stopTrans,err,instance);
            return;
          }
          resp.then(function(data) {
            resolve(data);
          },function(err) {
            consoleError(err);
            if(hook == "model") {
              instance.currentModel = err;
            } 
            processError.call(self,stopTrans,err,instance);
          });  
        }));
      } else {
        return Promise.resolve();
      }
    }

    function callHookWithoutPromise(callback,instance,hook) {
      if(callback) {
        var stopTrans = errorStoppableHook(hook);
        try {
          return callback.apply(instance,Array.from(arguments).slice(3));
        } catch(err) {
          processError.call(this,stopTrans,err,instance);
          return;
        }  
      }
    }

    function callAction(hook,index,args) {
      var action;
      if(this.routeInstances[index].actions && (action = this.routeInstances[index].actions[hook])) {
        try {
          if(action.apply(this.routeInstances[index],args) == false) {
            return false;
          }
        } catch(e) {
          consoleError(e);
          return false;
        } 
      }
    }

    function processError(stopTrans,err,instance) {
      if(trans.currentPromise) {
        var hook = trans.currentPromise.hook,
        index = trans.currentPromise.index;
        trans.pause();
        consoleError(err);
        if(!stopTrans) {
          consoleError(420,hook,instance.routeName);
          if(_presence(["willTransition","didTransition","beforeExit"],hook)) {
            trans.resume();
          } else {
            trans.abort({state : 4, internalAbort : true});
          }
        } else {
          run.onError.call(this,index,{state : 420, error : err, hook : hook});
        }  
      }
    }

    Transition.prototype.run = function() {
      processRunLoop.call(this);
      document.title = this.title = this.routeInstances[this.routeInstances.length-1].title || document.title;

      function runLoopPromise(fn,fnName,loop,success,failure) {
        success = success || function() {};
        failure = failure || function(error) {
          if(error != 'aborted') {
            consoleError(error);
          }
        };
        new Promise(function(resolve,reject) {
          if(fnName == "nestedForcedPromises" ) {
            this.forcedRunningPromise = {resolve : resolve, reject : reject};
            fn.call(this,this.runLoop.forceFetch,resolve);
          } else {
            this.runningPromise = {resolve : resolve, reject : reject};
            fn.call(this,this.runLoop,loop,resolve);  
          }
        }.bind(this)).then(success,failure);
      }

      function processRunLoop() {
        this.pending = {};
        runLoopPromise.call(this,nestedPromises,"nestedPromises",'previous',function() {
          if(!trans.beforeLoadCalled) {
            run.onBeforeLoad();
          }
          runLoopPromise.call(this,nestedPromises,"nestedPromises",'current');
        }.bind(this));
      }

      function nestedForcedPromises(forcedLoop,resolve,promise) {
        if(forcedLoop && forcedLoop.beforeModel.length || forcedLoop.model.length || forcedLoop.afterModel.length) {
          promise = promise || forcedLoop.beforeModel[0];
          var self = this,
          currentRoute = this.currentRoutes[promise.index],
          routeInstance = this.routeInstances[promise.index];
          promise.state = "forced";
          trans.currentPromise = promise;
          if(promise.hook == "beforeModel" && !requirements.get(routeInstance,'dependencies')) {
            this.pending.dependencies = promise.index;
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
                  this.run();
                }
                break;
            }
            if(this.forcedRunningPromise.resolve == resolve && promise.hook != "afterModel") {
              getObjWithIndex(forcedLoop[promise.hook],promise.index,true);
              nestedForcedPromises.call(self,forcedLoop,resolve,getObjWithIndex(forcedLoop[promise.hook == "beforeModel" ? "model" : "afterModel"],promise.index));
            }
          }.bind(this));
          if(forcedLoop.beforeModel.length > 1) {
            getObjWithIndex(forcedLoop[promise.hook],promise.index,true);
            nestedForcedPromises.call(this,forcedLoop,resolve);  
          }
        }

        function getObjWithIndex(arr,index,isDelete) {
          for(var i=0;i<arr.length;i++) {
            var prom = arr[i];
            if(prom.index == index) {
              if(isDelete) {
                arr.splice(i,1);
                return;
              }
              return prom;
            }
          }
        }
      }

      function logCallbacks(promise) {
        var hook = promise.hook,
        index = promise.index;
        if(promise.hook == "beforeRouteTransition") {
          Lyte.log(hook,logger,'MediumOrchid');
          return;  
        }
        var route = promise.state == "previous" ? prevTrans.currentRoutes[index] : trans.currentRoutes[index];
        Lyte.log(hook +' of route '+route.routeName,logger,'MediumOrchid');  
      }
      
      function nestedPromises(loop,state,resolve) {
        var runLoop = loop[state];
        if(runLoop && runLoop.length) {
          var promise = runLoop[0],
          currentRoute = this.currentRoutes[promise.index];
          if(!this.aborted && !this.paused) {
            if(promise.hook == "beforeModel" && !requirements.get(currentRoute,"dependencies")) {
              this.pending.dependencies = promise.index;
              return;
            } else if(promise.hook == "renderTemplate" && !requirements.get(currentRoute,"resources")) {
              this.pending.resources = promise.index;
              return;
            } else if(promise.hook == "redirect" && currentRoute.forceFetch && currentRoute._fetchStatus == "pending") {
              if(!this.forceFetchRunning) {
                runLoopPromise.call(this,nestedForcedPromises,"nestedForcedPromises");
                this.forceFetchRunning = true;
              }
              this.pending.forceFetch = promise.index;
              return;
            } else {
              promise.state = state;
              trans.currentPromise = promise;
              logCallbacks(promise);
              Lyte.time(promise.hook+promise.index);
              run[promise.hook].call(this,promise.hook,promise.index).then(function(data) {
                Lyte.time(promise.hook+promise.index);
                if(promise.hook == "model") {
                    this.routeInstances[promise.index].currentModel = data;
                }
                if(this.runningPromise.resolve == resolve) {
                  removeHook(loop[state],promise.hook,promise.index);
                  nestedPromises.call(this,loop,state,resolve);  
                }
              }.bind(this));
            }
          } 
        } else if(resolve) {
          resolve();
        }
      }
    };

    function removeHook(loop,hook,index) {
      for(var i = 0;i < loop.length; i++) {
        var obj = loop[i];
        if(obj.hook == hook) {
          if(index != undefined) {
            if(index == obj.index) {
              loop.splice(i,1);
              break;
            }
          } else {
            loop.splice(i,1);
            i--;
          }
        }
      }
    }

    Router.frameQueryParams = function(url) {
      if(url && _presence(url,"=")) {
        var qp = {},
        params = _presence(url,"?") ? url.split("?")[1] : url;
        params = _presence(params,"&") ? params.split(/&/g) : [params];
        params.forEach(function(param) {
          var split = param.split('=');
          qp[split[0]] = split[1] ? decodeURIComponent(split[1]) : split[1];
        });
        return qp;
      } 
      return;    
    };

    Router.frameDynamicParams = function(url,matched) {
      if(url) { 
        var routesObj = config.routes,
        dynamicParam,
        framedDP = [],
        urlSplit = _splitPath(url.split('?')[0]);
        matched.route.forEach(function(r,i,arr) {
          routesObj = _getObj([r],routesObj);
          if(routesObj.__lp.wildcard) {
            if(routesObj.__lp.sufix.length) {
              var dp = urlSplit.slice(0,urlSplit.indexOf(routesObj.__lp.sufix[0]));
              framedDP.push(decodeURI(dp.join('/')));
              _pop(dp.concat(routesObj.__lp.sufix));
            } else {
              framedDP.push(decodeURI(urlSplit.join('/')));   
            }
            return; 
          } else if(routesObj.__lp.dynamicKey) {
            dynamicParam = urlSplit[routesObj.__lp.dynamicIndex];
            _pop(_splitPath(routesObj.__lp.path));
            framedDP.push(decodeURI(dynamicParam));
          } else {
            _pop(_splitPath(routesObj.__lp.path));
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
    };

    function _presence(str,char) {
      return str.indexOf(char) != -1 ? true : false;
    }

    function transitionCompleted(obj) {
      if(trans.running) {
        trans.running = false;
        if (trans.routeTrans.state && trans.routeTrans.state != 201) {
          LR.afterRouteTransition(trans.routeTrans);
          trans.routeTrans.state = obj.state;
        }
        if(initialLoad || trans.routeTrans.state == 200) {
          LR.__lp.prevTrans = prevTrans =  trans;
          Lyte.time('RouteTransition');
          Lyte.log('Transition completed.',logger);
          if(config.history && trans.info.fragment) {
            var elem;
            if((elem = document.getElementById(trans.routeTrans.info.fragment)) && elem.scrollIntoView) {
              elem.scrollIntoView();
            }
          }
        } else if(obj.internalAbort || visibleTrans == trans) {
          LR.__lp.prevTrans = prevTrans = trans;
        } else {
          LR.__lp.trans = trans = prevTrans;  
        }
        if(initialLoad) {
          initialLoad = false;
        }
      }
    }

    function _delimit(seg) {
      return seg[0] == "/"? seg : "/"+seg;
    }

    function _splitPath(path) {
      return path.match(/[^/?]+/g) || [];
    }

    function validateURL(url) {
      url = url.replace(/\/\//g,'/');
      url = url.replace(/\/\?/g,'?');
      return url;
    }

    function getError(code,arr) {
      arr = Array.isArray(arr) ? arr : Array.from(arguments).slice(1);
      var errors = {
      400 : "url '"+arr[0]+"' is not defined in router.",
      422 : "There is no route definition for the route "+arr[0]+".",
      498 : "Invalid argument "+arr[0]+(arr[1] ? " provided in link-to." : "."),
      499 : arr[0] ? "Dynamic params for the route "+arr[0]+" is not provided." : "Transition tried without arguments.",
      420 : "Error on "+arr[0]+" of route "+arr[1]+".",
      428 : "There is no outlet named "+arr[0]+".",
      203 : "Data provided for component is not valid."
    };
      return 'LRE '+code+': '+errors[code];
    }

    function consoleError() {
      Lyte.error(arguments[0].stack || arguments.length == 1 ? arguments[0] : getError.apply(this,arguments));
    }

    function traverse(path,get) {
      if(!path) {
        consoleError(400,'');
        return;
      }
      var selectedPaths = [],
      fragment;
      if(config.history) {
        var fragSplit = path.split('#');
        if(fragSplit[1]) {
          fragment = fragSplit[1];  
          path = fragSplit[0];
        }
      }
      var pathSplit = path.split('?');
      path = decodeURI(pathSplit[0]);
      path = decodeURI(pathSplit[0]);
      var params = pathSplit[1],
      pathSplitArr = _splitPath(path);
      if(path == '/') {
        if(_getObj(['/'],routeHash)) {
          selectedPaths.push([path]);  
        } else {
          consoleError(400,path);
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
          if(!(pathObj.__lp.wildcard || pathObj.__lp.dynamicKey)) {
            var prevObj;
            if(prevObj = _getObj(matchedPath,routeHash).__lp) {
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
                if(pathObj.__lp.sufix.length) {
                  l = arr2.indexOf(pathObj.__lp.sufix[0])-1; 
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
              if(mapPath != "__lp") {
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
                      if(pathObj.__lp.wildcard || pathObj.__lp.dynamicKey) {
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
                        if(pathObj.__lp.wildcard && !pathObj.__lp.sufix.length && innerRoutes.length == 1) {
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
                      pathArrLevel.pop();
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
          consoleError(400,path);
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
        consoleError(400,path);
      }

      function pathProcessor(get,selectedPaths,path,params) {
        var newURL,
        newMatched,
        matched = {
          route : _getObj(selectedPaths,routeHash).__lp.route,
          queryParams : params ? Router.frameQueryParams(params) : {}
        };
        if(config.history) {
          matched.fragment = fragment
        }
        matched.dynamicParams = Router.frameDynamicParams(path,matched);
        if(get) {return matched;}
        var transInfo = setParamsInDef(matched);
        if(transInfo != false) {
          newMatched = Lyte.deepCopyObject(transInfo.matched);
          newURL = constructURLFromRoute(newMatched);
          if(!_compareObj(newMatched.queryParams,matched.queryParams)) {
            historyObj = addToHistory({replace : true,data : window.history.state,url : newURL,fromHistory : true});
          }  
        }
        return transInfo;
      }
    }

    function setParamsInDef(matched) {
      var def = definitions,
      routesObj = config.routes,
      currentRoutes = [];
      matched.target = "";
      matched._routes = [];
      try {
        matched.route.every(function(r,i) { 
          matched.target = matched.target ? matched.target+'.'+r : r;
          routesObj = _getObj([r],routesObj);
          def = _getObj([r],def);
          if(!def || !def.__lp) {
            throw Error(getError(422,matched.target));
          }
          r = dotSerperator(matched.target);
          var obj = def.__lp;
          matched._routes.push(r);
          if(obj.queryParams) {
            obj.__lp.queryParams = {};
            obj.queryParams.forEach(function(key) {
              obj.__lp.queryParams[key] = matched.queryParams[key];
            });
          }
          obj.__lp.dynamicParam = matched.dynamicParams[i];
          var linkTags = def.__lp.__lp.linkTags;
          if(linkTags.length) {
            linkTags.forEach(function(tag) {
              if(tag.firstChild.tagName === "A") {
                tag.firstChild.setAttribute("href", LR.getURL(tag.getMatchedObject(true))); 
              }
            });
          }
          return currentRoutes.push(obj);
        });  
      } catch(e) {
        consoleError(e);
        return false;
      }
      return {currentRoutes : currentRoutes, matched : matched};
    }

    this.registerRoute = function(dir,fns,options) {
      if(options && options.mixins) {
        if(!Array.isArray(options.mixins)) {
          options.mixins = [options.mixins];
        }
        options.mixins.forEach(function(mixin) {
          if(Lyte.Mixin.exists(mixin)) {
            var regMixin = Lyte.registeredMixins[mixin];
            if(regMixin) {
              for(var key in regMixin) {
                if(key == "actions") {
                  for(var action in regMixin.actions) {
                    fns.actions[action] = regMixin.actions[action];
                  }
                } else {
                  fns[key] = regMixin[key];  
                }
              }           
            }  
          }
        });
      }
      fns.__lp = {
        objPath : dir.replace(/\//g,'.'),
        linkTags : []
      };
      if(fns.queryParams) {
        fns.__lp.queryParamsDef = {};
        fns.queryParams.forEach(function(qp,i) {
          if(typeof qp == "string") {
            fns.__lp.queryParamsDef[qp] = {
              sticky : config.queryParamOptions.sticky,
              refreshModel : true
            };
          } else {
            for(var key in qp) {
              fns.__lp.queryParamsDef[key] = {
                sticky : qp[key].hasOwnProperty('sticky') ? qp[key].sticky : config.queryParamOptions.sticky,
                refreshModel : qp[key].hasOwnProperty('refreshModel') ? qp[key].refreshModel : true
              };
            }
            fns.queryParams[i] = key;
          }
        });  
      }
      dir = dotSerperator(dir);
      var len = dir.length -1;
      fns.routeName = dir[len];
      setRouteDef(dir,fns);
    };

    var transPredefined = ['runLoop','paused','currentRoutes','routeInstances','aborted','currentPromise','run','pending','matched','timeouteFns'];

    function limitTransition(int) {
      var routeTrans = new transition(int);
      routeTrans.state = 201;
      function transition(int) {
        
        for(var prop in int) {
          if(transPredefined.indexOf(prop) == -1) {
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

    this.getRouteInstance = function(routeName) {
      if(LR && trans && trans.routeInstances) {
        if(routeName == "*") {
          return trans.routeInstances;
        } else {
          routeName = routeName || trans.target;
          var match;
          trans.routeInstances.every(function(inst,index) {
            inst = trans.routeInstances[trans.routeInstances  .length-1-index];
            if(inst.__lp.objPath == routeName) {
              match = inst;
              return false;
            }
            return true;
          });
          return match;
        }
      }
    };

    function normalizeTransitionParams(obj) {
      // To normalize argument for transition, returns matched obj from obj or native tranisitionTo argument.
      if(typeof obj == "object") {
        if(obj.route) {
          return normalizeMatchedObj(obj);
        }
      } else {
        var params = {
          queryParams : {},
          dynamicParams : []
        };
        Array.from(arguments).forEach(function(arg,index) {
          if(Array.isArray(arg)) {
            consoleError(498,JSON.stringify(arg));
            return;
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
        var matched = {
          route : dotSerperator(obj.route),
          queryParams : obj.queryParams || {},
          dynamicParams : [],
          fragment : obj.fragment,
          target : "",
          _routes : []
        };
        var dynamicParams = obj.dynamicParams ? Array.from(obj.dynamicParams) : [];
        try {
          matched.route.forEach(function(route,index) {
            matched.target = matched.target ? matched.target+'.'+route : route;
            var r = dotSerperator(matched.target);
            matched._routes.push(r);
            var routesObj = _getObj(matched.route.slice(0,index+1),config.routes);
            if(routesObj) {
              matched.dynamicParams.push(routesObj.__lp.dynamicKey ? dynamicParams.shift() : undefined);
            } else {
              throw Error(getError(400,matched.target));
            }
          });
        } catch(e) {
          consoleError(e);
          return false;
        }
        return matched;  
      }
    }

    var routePredefined = ["getResources","getDependencies","beforeModel","model","afterModel","redirect","renderTemplate","afterRender","beforeExit"];

    Router.initRoute = function(processed) {
      var routeObj,
      matched = processed.matched,
      len = matched.route.length,
      routeInstances = []

      Route = function(fns,index,prevInstance)  {
        if(prevInstance) {
          for(var key in prevInstance) {
            if(key == "__lp") {
              this.__lp = {};
              for(var key in fns.__lp) {
                if(key != "rendered") {
                  this.__lp[key] = fns.__lp[key];
                }
              }
            } else {
              this[key] = prevInstance[key];
            }
          }
          if(this.component) {
            this.component._route = this;
          }
        } else {
          for(var key in fns) {
            if(!_presence(routePredefined,key)) {
              this[key] = fns[key];
            } 
          }
        }
        this.parent = routeInstances[index-1];
        this.transition = trans.routeTrans;
        this.replaceWith = LR.replaceWith;
        this.transitionTo = LR.transitionTo;
        this.removeFromCache = function(arr) {
          Lyte.removeFromCache.assign(arr);
          return;
        };
        this.refresh = function(obj) {
          var processed = {currentRoutes : trans.currentRoutes,matched : trans.matched},
          refreshFrom = dotSerperator(this.__lp.objPath).length-1,
          route = Array.from(matched.route);
          processed.transComparison = {
            unRendered : route.splice(refreshFrom),
            rendered : route
          };
          if(obj && obj.refreshTemplate) {
            for(var i = refreshFrom;i < matched.route.length; i++) {
              delete trans.routeInstances[i].component;
            }
          }
          newTransInfo = {replace : true,data : trans.data,fromHistory : false};
          dispatch(undefined,processed);
          return trans.routeTrans;
        };
        this.setTitle = function(title) {
          document.title = this.title = title;
        };
        this.getQueryParams = function() {
          return this.__lp.queryParams || {};
        };
        this.getDynamicParam = function() {
          return this.__lp.dynamicParam;
        };
        this.getRouteInstance = function(routeName) {
          return LR.getRouteInstance(routeName);
        };
        this.setDynamicParam = function(value) {
          if(this.__lp.dynamicParam && this.__lp.dynamicParam != value) {
            var dynamicParams = Array.from(trans.matched.dynamicParams);
            dynamicParams.splice(this.__lp.objPath.split(".").length-1, 1, value);
            var matched = {
              route: Array.from(trans.matched.route),
              dynamicParams: dynamicParams,
              queryParams: Object.assign({}, trans.matched.queryParams)
            };
            var url = constructURLFromRoute(matched),
                processed = setParamsInDef(matched);
            newTransInfo = {
              data: trans.data,
              url: url,
              fromHistory: false
            };
            dispatch(url, processed);
            return trans.routeTrans;
          }
        };
        this.setQueryParams = function(key,value,refresh)  {
          var obj = {};
          if(typeof key == "object") {
            for(var i in key) {
              obj[i] = key[i];
            }
            refresh = value;
          } else {
            obj[key] = value;
          }
          var matched = {
            route : Array.from(trans.matched.route),
            dynamicParams : Array.from(trans.matched.dynamicParams),
            queryParams : Object.assign({},trans.matched.queryParams,obj)
          };
          if(!_compareObj(trans.matched.queryParams,matched.queryParams)) {
            var url = constructURLFromRoute(matched),
            processed = setParamsInDef(matched);
            if(refresh == false || !matched.refreshModel) {
              processed.transComparison = {
                rendered : matched.route,
                unRendered : []
              };  
            }
            newTransInfo = {
              data : trans.data,
              url : url,
              fromHistory: false 
            };
            dispatch(url, processed);
          }
          return trans.routeTrans;
        };
        if(this.init) {this.init();}
        if(typeof LyteComponent !== "undefined") {this.throwEvent = LyteComponent.throwEvent;}
      };

      var refMatch = processed.prevTrans,
      similarRoute = true;

      for(var i=0;i<len;i++) {
        routeObj = LR.__lp.getDefinition(trans.matched._routes[i]);
        if(!routeObj) {return false;}
        if(refMatch && similarRoute && refMatch.matched && refMatch.matched.route[i] == matched.route[i]) {
          routeInstances.push(new Route(routeObj,i,refMatch.routeInstances[i]));
        } else {
          routeInstances[i] = new Route(routeObj,i);
          similarRoute = false;
        }
      }
      return routeInstances;
    };

    function dispatchTransition(newMatch) {
      var url = newTransInfo.url = constructURLFromRoute(newMatch),
      processed = setParamsInDef(newMatch);
      dispatch(url,decideTransition(processed));
      return url;
    }

    var allHooks = ["getResources","getDependencies","beforeModel","model","afterModel","redirect","renderTemplate","afterRender"];

    function decideTransition(processed) {
      if(prevTrans && trans.running) {
        var transComparison = getTransitionDiffernce(trans,processed.matched,processed.currentRoutes);
        if(trans.currentPromise) {
          var hook = trans.currentPromise.hook;
          if(trans.routeTrans.state == 102 && trans.currentPromise.state == "current" && hook != "didTransition") {
            trans.abort({state : 308, internalAbort : true});
            var transitioningRoute = allHooks.indexOf(trans.currentPromise.hook) <= 5 ? trans.currentPromise.index : trans.currentPromise.index+1;
            if((transComparison.common.length-1) <= transitioningRoute) {
              var visibleTransComparison = getTransitionDiffernce(visibleTrans,processed.matched,processed.currentRoutes);
              if(transComparison.common.length < visibleTransComparison.common.length) {
                if(trans.runLoop.templateToRemove.length) {
                  trans.runLoop.templateToRemove.pop();
                }
                processed.prevTrans = visibleTrans;
                transComparison = visibleTransComparison;
              } else if(trans.currentPromise.index <= transComparison.common.length -1) {
                transComparison.executed = trans.currentPromise;  
              }
            }
          }
        }
        processed.transComparison = transComparison;  
      } else {
        trans.abort({state : 308, internalAbort : true});
      }
      return processed;
    }
    return this;
  }; 
  window.$LR = Lyte.Router = new lyteRouter();
})(window);
Lyte.registerErrorCodes({
    "LC001" : "Error while parsing custom prop handler attribute {0}. Check if the value provided is a valid JSON",
    "LC002" : "{0} Component is not compiled. Please compile using Lyte CLI",
    "LC003" : "Helper named {0} is not defined",
    "LC004" : "Action named {0} doesn't exists",
    "LC005" : "Lyte.objectUtils doesn't support {0} function", 
    "LC006" : "Lyte.arrayUtils doesn't support {0} function", 
    "LC007" : "Component name not specified in Lyte.Component.render", 
    "LC008" : "Specified outlet {0} doesn't exists - Lyte.Component.render", 
    "LC009" : "Method named {0} doesn't exists"
});

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
    var s = document.createElement("div");
    s.innerHTML= "<template><div>c</div></template>";
    if(s.querySelector("template").childNodes.length) {
        window.isIE11Lyte = true;
    } else {
        window.isEdgeLyte = true;    
    }
    s.remove()
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
            var template = document.querySelector("template[tag-name="+componentName+ "]")
            if(template) {
                template.remove();
            }
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
    let bodyEvents = ["focus","focusin","focusout","resize","scroll","click","dblclick","mousedown","mouseup","mousemove","mouseover","mouseout","change","select","submit","keydown","keypress","keyup","contextmenu"];    
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
			target._callee = callee._registerYield._callee;
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
    let eventStopped = false;
	while((target.getAttribute && !target.getAttribute(evnt)) && target.tagName != "BODY"){
		if(LyteComponent.hasLyteEvents(target, evnt)) {
            eventStopped = LyteComponent.handleLyteEvents(target, ev);
            if(eventStopped) {
                break;
            }
        }
        target = target.parentNode;
	}
    if(eventStopped) {
        return;
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
			target._callee = callee._registerYield._callee;
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
	} else if(target.getAttribute && target.getAttribute(evnt)){
		let actions = target._callee.constructor._actions;
		let func = target.getAttribute(evnt).split(" => ")[1];
		let actObj = target._boundEvents[evnt];
		let cloneActObj = Lyte.deepCopyObject(actObj);
		cloneActObj.args.shift();
		LyteComponent.throwAction.call(target._callee,target._callee,evnt,cloneActObj, undefined, undefined, target, ev);
	}
	if(target.tagName === "LABEL"){
		var input = target.querySelector("input");
		if(input && input.getAttribute(evnt)){
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
                let helperNodes = node._callee.getProperty(key)._helperNodes;
				if(helperNodes) {
					helperNodes[del](this);
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
        return callee._registerYield._callee;
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
                if(this.component.__data[key] && this.component.__data[key].type !== LyteComponent.getDataType(initProperties[key]) && (initProperties[key] !== undefined  || this.component.__data[key].type === "boolean")) {
                    this.component.data[key] = LyteComponent.typeCast(initProperties[key], this.component.__data[key].type);
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
        if(this.component.data.lyteUnbound) {
        	LyteComponent.unbound = true;
        }
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
                        	var node = this.bindNode(dynamicN.attributes.getNamedItem(attrName), toBeRemoved, helperNode, options, attr, undefined, establishBindings);
                            if(node !== dynamicN.attributes.getNamedItem(attrName)) {
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
                	returnVal = this.updateForHelper(dynamicN,{"type" : "default"} , options.node? options : undefined, establishBindings);
                	break;
                case "forIn" : 
                	returnVal = this.updateForInHelper(dynamicN,{"type" : "default"} , options.node? options : undefined, establishBindings);
                	break;
                case "component" : 
                	returnVal = this.updateDynamicComponent(dynamicN, false, options.node ? options : undefined, establishBindings);
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
        let isCustomProp = LyteComponent.customPropHandlers.indexOf(actualAttr);
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
                    Lyte.error("LC001", attr);
                }
            }
            return;
        }
        if(oldValue === newValue) {
            return;
        }
        var attrNode = this.attributes.getNamedItem(attr);
        if(attrNode && attrNode.__lyteIgnore) {
        	this.attributes.getNamedItem(attr).__lyteIgnore = false;
        	return;
        }
        let dataType = this.component.__data[actualAttr].type;
        if(dataType !== "string") {
        	let obj = {"attr" : attr, "tagName" : this.tagName};
        	newValue = LyteComponent.typeCast(newValue, dataType, obj);
        	if(obj.isError) {
        		console.warn("data type of the value provided for attribute "+attr+ " of " + this.tagName + " is not valid");
        		return;
        	}
        }
        if(this.component.data[actualAttr] !== newValue) {
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
                for(let i=0;i<node._items.length;i++) {
                    let dynProp = node._items[i]._dynamicProperty;
                    for(let dP in dynProp) {
                        let property = this.getProperty(dP); 
                        if(property._helperNodes){
                            property._helperNodes[del](node);                    
                        }
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
                    if(node._removedAttributes && node._removedAttributes.items && !node._removedAttributes.items.helperValue && node._removedAttributes.items._multipleProperty) {
                    	node._removedAttributes.items._multipleProperty[0].actProp._forHelpers[del](node);
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
                    this.removeBindings({[key] : node._items[index].itemProperty}, {[key] : node._attributes.object[index]});
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
                if(node._removedAttributes.items && !node._removedAttributes.items.helperValue && node._removedAttributes.items._multipleProperty) {
                	node._removedAttributes.items._multipleProperty[0].actProp._forHelpers[del](node);
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
                        let helperNodes = this.getProperty(key)._helperNodes;
                        if(helperNodes) {
                            helperNodes[del](node);
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
        node._registerYield = toAppend;
        //ADded now
        let parentScope = toAppend._callee || node._callee._callee;
        if(!parentScope) {
            node.appendChild(toAppend.content.cloneNode(true, "lyte"));
            node._helpers = [];
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
        if(!node.component.data.lyteUnbound) {        	
        	LyteComponent.establishBindings(node._properties, node.component.data);
        }
        parentScope.executeBlockHelpers(node._helpers);
        Object.keys(node._properties).forEach(function(key) {
            parentScope.component.data[key] = contextSwitchingArray[key].value;
            parentScope._properties[key] = contextSwitchingArray[key].property;
        });
        LyteComponent.newRemoveContext(toAppend, contextSwitchArray); 
        node.appendChild(content);
    }
    
     // It constructs/updates the dynamicComponent creation
    //upddc
    updateDynamicComponent(node, update, contextSwitchInfo, establishBindings) {
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
            let toAppend = this.renderNodes(node.content, node._dynamicNodes, node, undefined, establishBindings, undefined, node._templateContent);
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
    updateForHelper(node, options, contextSwitchInfo, establishBindings) {
        let callee = this;
        node._callee = this;
        node._attributes = node._attributes || {};
        if(options.type === "update" && node._currentItems === node._attributes.items) {
            return {};
        }
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
        var localUnbound = false;
        var initialUnbound = LyteComponent.unbound;
        if(node.hasAttribute("unbound")) {
        	localUnbound = true;
        	LyteComponent.unbound = true;
        }
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
            Lyte.error("Error in updateForHelper");
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
                let toAppend = this.renderNodes(content, dynamicNodes, node, optns, establishBindings, breakCheck, node._templateContent);
                node._items[k].itemProperty = this.getProperty(itemValue);
                node._items[k].indexProperty = this.getProperty(indexValue);    
//                  if(options.type !== "default") {
                if(!LyteComponent.unbound) {
                	LyteComponent.establishBindings({[itemValue] : node._items[k].itemProperty},{[itemValue]:node._attributes.items[k]});
                }
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
            if(localUnbound) {
            	LyteComponent.unbound = initialUnbound;
            }
            if(options.type === "default") {
                returnVal = {"toAppendMain" : toAppendMain, "lastNode" : lastNode};
            } else {
                lastNode.parentNode.insertBefore(toAppendMain, lastNode);
            }
            if(!localUnbound && node._removedAttributes && node._removedAttributes.items && !node._removedAttributes.items.helperValue && node._removedAttributes.items._multipleProperty) {
            	LyteComponent.establishBindings({"items" : node._removedAttributes.items._multipleProperty[0].actProp}, {"items" : items});
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
        node._currentItems = items;
        return returnVal;
    }
    //It constructs/updates forIn Helper.
    //updFIH
    updateForInHelper(node, options, contextSwitchInfo, establishBindings) {
        let callee = this;
        node._callee = this;
        node._attributes = node._attributes || {};
        if(options.type === "update" && node._currentObject === node._attributes.object) {
            return {};
        }
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
        let localUnbound = false;
        let initialUnbound = LyteComponent.unbound;
        if(node.hasAttribute("unbound")) {
        	localUnbound = true;
        	LyteComponent.unbound = true;
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
            Lyte.error("Error in updateForHelper");  

            }
        }
        let returnVal;
        if(!object) {
            let toAppendMain = document.createDocumentFragment();
            if(options.type !== "default") {
                lastNode.parentNode.insertBefore(toAppendMain, lastNode);
            } else {
                returnVal = {"toAppendMain" : toAppendMain, "lastNode" : lastNode};
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
                let toAppend = this.renderNodes(content, dynamicNodes, node, optns, establishBindings, undefined, node._templateContent);
                node._items[itemKey].itemProperty = this.getProperty(value);
                node._propBindingObject[itemKey] = node._items[itemKey].itemProperty;
                node._forContent[itemKey] = Array.from(toAppend.childNodes);
//                    this.updateBlockHelpers(node._helpers[itemKey], optns);
                this.executeBlockHelpers(node._helpers[itemKey]);
                toAppendMain.appendChild(toAppend);
            }, this); 
//              if(options.type !== "update") {
            	if(!LyteComponent.unbound) {
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
            	}
//              }
				if(localUnbound) {
					LyteComponent.unbound = initialUnbound;	
				}
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
        node._currentObject = object;
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
            template = (window.isIE11Lyte || window.isEdgeLyte) ? {} : node.content.querySelector('[case=\''+LyteComponent.cssEscape(dummyCaseName)+'\']');
        }
        let contentArr = [];
        while(dummyScope) {
            let dynamicNodes = dummyScope.dynamicNodes;
            let processedContent = this.renderNodes(template.content, dynamicNodes, node, undefined, establishBindings, undefined, dummyScope.templateContent);
            contentArr.push(processedContent);
            if(dummyScope.additional) {
                if(dummyScope.additional.next) {
                    template = (window.isIE11Lyte || window.isEdgeLyte) ? {} : node.content.querySelector('[case=\''+LyteComponent.cssEscape(dummyScope.additional.next)+'\']');
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
        let styleDiv = Lyte.$.assetsDiv;
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
            if(Lyte.Compile.getDynamicNodes) {
            this._dynamicNodes = Lyte.Compile.getDynamicNodes(a).dynamicNodes;
            } else {
            Lyte.error("LC002", a);  
            }
	    } 
        if(this._dynamicNodes) {
        doCompile(s, this._dynamicNodes, a);
        if(window.isEdgeLyte) { 
          this._templateContent = this._template.outerHTML;
        } else if(window.isIE11Lyte) {
          this._templateContent = s.outerHTML;
        }
        this._templateAttributes = this._templateAttributes || {type : "attr", "attr" : {}, position: []};
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
                Lyte.error("Error with templateAttributes. ");
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
                helperArgs = this.processArgs(this,helperFunc.args,dynamicValuesArray,undefined,node);
            }
            nodeValue = this.processHelper({"name" : helperFunc.name, "args" : helperArgs}, node);
            if(helperFunc.name === "unescape"){
//              let test = node.replaceWith.apply(node,nodeValue.childNodes);
                let obj = {initialNode : node, dynamicNodeValue : nodeValue};
                node = {dynamicPositions : obj, "_callee" : node._callee, helperValue : node.helperValue};
                nodeValue = undefined;
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
        if(helperFunc.name !== "unbound" && !LyteComponent.unbound) {
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
            				if(boundValue !== indexValue) {
            					actMultiProp = actProperty;
            				}
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
            		node._multipleProperty = node._multipleProperty || [];
            		node._multipleProperty.push({"dynamicProp" : actMultiProp ? undefined : dynamicProp, "actProp" : this.getProperty(dynamicValues[0]), "helperNode" : helperNode, "dynamicValues" : dynamicValues});
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
                    if((parentNode.getAttribute("is") === "for" && node.nodeName === "items") || (parentNode.getAttribute("is") === "forIn" && node.nodeName === "object") && !LyteComponent.unbound) {
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
                            parentNode.value = (nodeValue === undefined) ? "" : nodeValue;
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
        let multiplePropNode = [];
        let multipleProp;
        if(node._multipleProperty) {
        	for(var i=0;i<node._multipleProperty.length;i++) {
        		if(node._multipleProperty[i] && node._multipleProperty[i].dynamicValues.lastIndexOf(updatePath) > 0) {
                    multiplePropNode[i] = false;
                    multipleProp = node._multipleProperty[i];
		            let nodes;
		            if(multipleProp.dynamicProp) {
                        multiplePropNode[i] = multipleProp;
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
		            if(!multiplePropNode[i]) {
		                multiplePropNode[i] = "dynamicNodes";
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
        let dynamicValues = [];
        if(node.helperValue){
            nodeValue = node.helperValue;
                    let helperFunc = nodeValue;
                    let helperRetVal = this.processHelper({name : helperFunc.name, args : this.processArgs(this,helperFunc.args, dynamicValues)}, node);  
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
                        nodeValue = undefined;
                    }
        } else {
            let boundValue = node.syntaxValue;
            let path;
            if(boundValue.indexOf('.') !== -1 || boundValue.indexOf('[') !== -1) {
                path = boundValue;
                boundValue = boundValue.substring(0,boundValue.indexOf('.'));
            }
            let value = path ? LyteComponent.get(this.component.data, path, dynamicValues) : this.component.data[boundValue]; 
            nodeValue = !typeof value === "boolean" && !typeof value === "number" ? (value? value : ""): value;
        }
		if(!(dynamicValues[0] instanceof Array)) {
        	dynamicValues = [dynamicValues];
		}
        
        if(multiplePropNode) {
        	for(var i=0;i<multiplePropNode.length;i++) {
        		if(multiplePropNode[i]) {
					let multipleProp = node._multipleProperty[i];
                    let prop = this.getProperty(dynamicValues[i][0]);
                    let totalProp = this.getProperty(dynamicValues[i][0].substring(0, dynamicValues[i][0].indexOf('.')));
                    let value = this.getData(dynamicValues[i][0].substring(0, dynamicValues[i][0].indexOf('.')));                            
	                if(multiplePropNode[i] === "dynamicNodes") {
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
                    node._multipleProperty[i].actProp = prop;
                    node._multipleProperty[i].dynamicValues = dynamicValues[i];
	        	}
	        }
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
            }
            parentNodes.push(pN);
            for(let i=0;i<parentNodes.length;i++) {
            	let parentNode = parentNodes[i];
            	if(parentNode.set) {
                    parentNode.set(LyteComponent.String.toCamelCase(node.nodeName), nodeValue, true);
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
                        if(node.ownerElement.nodeName === "TEMPLATE") {
                            if(node.helperValue) {
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
                            //Needs revisiting
                            //parentNode.removeAttribute(node.nodeName);
                        }

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
                            parentNode.value = (nodeValue === undefined) ? "" : nodeValue;
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
                            if(node.nodeName === "component-name") {
                                this.updateDynamicComponent(parentNode, "update");    
                            }
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
                	if(args[i] === "event" && event) {
                		args[i] = event;
                	} else if(args[i] === "this" && node) {
                		args[i] = node.nodeType === 2 ? node.ownerElement : node;
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
            Lyte.error("LC003" , helperFunc.name);
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
        if(!/^(focus|focusin|focusout|resize|scroll|click|dblclick|mousedown|mouseup|mousemove|mouseover|mouseout|change|select|submit|keydown|keypress|keyup|contextmenu)$/.test(actionType)){
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
            let parentYield;
            if(yields[i].hasAttribute("from-parent") && this._callee && (parentYield = this._callee._yields[yields[i].getAttribute("yield-name")]) ) {
                this._yields[yields[i].getAttribute("yield-name")] = parentYield;
            } else {
                this._yields[yields[i].getAttribute("yield-name")] = yields[i];
            }
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
							this.bindNode(this.attributes.getNamedItem(templateAttributes.attr[key].name), [], undefined, {}, templateAttributes.attr[key], undefined, undefined, true );
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
        if(!LyteComponent.unbound) {
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
        }
        LyteComponent.unbound = false;
        this.appendChild(content);
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
                    Lyte.error(e);
                }
                
            }
        }
    }
    callback(name){
        var func = this.component[name];
        var args;
        if(func){
            if(arguments.length > 1) {
                args = Array.from(arguments);
                args.splice(0,1)
            }
            try{
                func.apply(this.component, args || []);    
            } catch(e) {
                Lyte.error(e);
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
            if(!self.component) {
                return;
            }
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
                        if(val !== false && !event.cancelBubble){
                        	if(actObj.from && node.getAttribute(event.type) && node._boundEvents && node._boundEvents[event.type]) {
                        		let actions = node._callee.constructor._actions;
                        		let actObj = node._boundEvents[event.type];
                        		let cloneActObj = Lyte.deepCopyObject(actObj);
		                        cloneActObj.args.shift();
                        		LyteComponent.throwAction.call(node._callee,node._callee,event.type,cloneActObj, undefined, undefined, node, event, hasHandled);
                        	} else {
                                if(LyteComponent.hasLyteEvents(node, eventName)) {
                                    let eventStopped = LyteComponent.handleLyteEvents(node, event);
                                    val = eventStopped ? false : true;       
                                }
                                if(val === false) {
                                    return;
                                }
                        		if(LyteComponent.isCustomElement(node)){
                        			scope = parent;
                        		}
                        		if(parent){
                                    let eventStopped;
                        			while(parent && !parent.getAttribute(eventName) && parent.tagName != "BODY"){
                        				if(LyteComponent.hasLyteEvents(parent, eventName)) {
                                            eventStopped = LyteComponent.handleLyteEvents(parent, event);
                                            if(eventStopped) {
                                                break;
                                            }
                                        }
                                        parent = parent.parentNode;
                        			}
                        			if(eventStopped || !parent || parent.tagName === "BODY"){
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
                    Lyte.error("LC004" , actObj.name);
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
        "componentSet" : function(key, value, forceExecute, fromParent) {
            if(!forceExecute && this.get(key) === value) {
                return;
            }
            //temporary fix
            LyteComponent.set(this.data, key, value, undefined, fromParent);
        },
        "componentGet" : function(key) {
            return key ? LyteComponent.get(this.data, key) : this.data;
        },
        "nodeGet" : function(key) {
            return key ? this.component.get(key) : this.component.data;
        },
        "nodeSet" : function(key, value, fromParent) {
            this.component.set(key, value, undefined, fromParent);
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

            let actionsFromMixin = {};
            let methodsFromMixin = {};
            let newDefinition = {};
            for(let i=0; i<mixinslen ; i++) {
                for(let item in mixinsToBeUsed[i]){
                    if(item === "actions") {
                        Object.assign(actionsFromMixin, mixinsToBeUsed[i][item]);    
                    } else if(item === "methods") {
                        Object.assign(methodsFromMixin, mixinsToBeUsed[i][item]);    
                    } else {
                        //Component.prototype[item] = mixinsToBeUsed[i][item];    
                        newDefinition[item] = mixinsToBeUsed[i][item];
                    }
                }
            }
            definition = Object.assign(newDefinition, definition);
            customCrmComponent._actions = Object.assign({}, actionsFromMixin, definition.actions);
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
            let methods = Object.assign({},methodsFromMixin, definition.methods);
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
        "typeCast" : function(value, dataType, obj) {
        	if(value === null) {
        		if(dataType !== "boolean") {
        			return undefined;
        		} else {
        			return false;
        		}
        	}
        	try {
        		switch(dataType) {
            	case "string" : 
            		return typeof value === "object" ? JSON.stringify(value) : value.toString(); 	
            	break;
            	case "number" :
            		{
            		let val = +value;
            		if(isNaN(val)) {
            			throw "TypeCast exception";
            		} 
            		return val;
            		}
            	break;
            	case "array" : 
            	case "object" :
            		return JSON.parse(value);
            		break;
            	case "boolean" :
            		return ( (!value && value !== "") || value=== "false") ? false : true; 
            	break;
            	default : 
            		return value;
            	}
        	} catch(e) {
        		if(obj) {
        			obj.isError = true;
        		}
        		return value;
        	}
        	
        },
        "getDataType" : function(value) {
            var type = typeof value;
            if(type === "object") {
                if(value instanceof Array) {
                    return "array";
                }
            }
            return type;
        },
        "update":function(object, property, value, fromStore,oldValue,setterScope, actualProperty, fromParent){
        	let fromComponent = object.__component__;
        	let updateAttr = true;
        	if(!oldValue){
                oldValue = object[property];
                if(!object.hasOwnProperty(property) && !(object instanceof Array)) {
                    LyteComponent.objectFunctions(object, "add", property, value, true)
                }
                if(fromComponent && fromComponent.tagName !== "LYTE-YIELD") {
                	let dataType, dataDef = fromComponent.component.__data[property];
                	if(dataDef && (dataType = dataDef.type)) {
                		updateAttr = !dataDef.hideAttr;
                		if(dataType !== LyteComponent.getDataType(value) && (value !== undefined || dataType === "boolean")) {
                			value = LyteComponent.typeCast(value, dataType);
                		}
                	}
                	if(value === oldValue) {
                		return;
                	}
                	let error = Lyte.validate(object, property, value, fromComponent.component);
                	if(error) {
                		LyteComponent.set(fromComponent.component.data.errors, property, error);
                		fromComponent.callback("onError", property, error);
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
            let dasherizedAttr = LyteComponent.String.dasherize(property);
            if(fromComponent && actualProperty && ( (typeof value === "string" && fromComponent.getAttribute(dasherizedAttr) !==  value) || fromComponent.hasAttribute(dasherizedAttr) )) {
                 if((!LyteComponent.customPropRegex.exec(property) || fromComponent.hasAttribute(dasherizedAttr) ) && updateAttr) {
                     if(typeof value === "object") {
                    	 let jsonString = JSON.stringify(value);
                    	 fromComponent.attributes.getNamedItem(dasherizedAttr).__lyteIgnore = true;
                    	 fromComponent.setAttribute(dasherizedAttr, jsonString);
                     } else {
                    	 let attributeString = LyteComponent.typeCast(value, "string");
                    	 if(fromComponent.getAttribute(dasherizedAttr) !== attributeString) {
                             let detAttr = fromComponent.attributes.getNamedItem(dasherizedAttr);
                             if(detAttr) {
                                 detAttr.__lyteIgnore = true;
                             }
                             attributeString = attributeString || "";
                             fromComponent.setAttribute(dasherizedAttr, attributeString);
                         }
                     }
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
            if(toBeExecuted && !fromParent && fromComponent._attributeDetails && fromComponent._callee) {
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
            			LyteComponent.set(obj.context, obj.lastKey, value);
            		}
            		if(contextSwitchArray) {
            			LyteComponent.removeContext(fromComponent._contextSwitchInfo.node, contextSwitchArray, fromComponent._contextSwitchInfo )
            		}
            	}
            }
        },
        "set" : function(object, property, value, fromStore, fromParent) {
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
                            LyteComponent.update(object,oldValues[i].key,object[oldValues[i].key],fromStore,(oldValues[i].oldValue === undefined)?null:oldValues[i].oldValue ,setterScope, actualProperty, fromParent);
                        }
                } else {
                    //object[property] =  value;
                    for(let key in property){
                        LyteComponent.update(object,key,property[key],fromStore,undefined,setterScope, actualProperty, fromParent);
                    }
                }
            }
            else{
                if(Lyte.isRecord(object) && !fromStore) {
                    let old = object[property];
					let dataType = object.$.model.fieldList[property];
                    dataType = dataType ? dataType.type : undefined;
                    if(dataType && (value !== undefined || dataType === "boolean") && dataType !== LyteComponent.getDataType(value)) {
                        value = LyteComponent.typeCast(value, dataType);
                    }
                    let record = store.$.setData(object.$, property,value);
                    if(record.$.isError){
                        return record;
                    }
                    //Commented because update will happend when "set" is called from setData of store. 
                    //LyteComponent.update(object,property,value,fromStore,(old === undefined) ? null : old,setterScope , actualProperty);    
                } else {
                    LyteComponent.update(object,property,value,fromStore,undefined,setterScope,actualProperty, fromParent);
                }
            }
        },
        "newAddContext" : function(node, contextSwitchArray) {
        	let isYield = node.tagName === "LYTE-YIELD";
        	if(node._contextSwitchInfo && (!isYield || node._contextSwitchInfo.node.tagName !== "LYTE-YIELD")) {
        		LyteComponent.changeContext(node._contextSwitchInfo.node, contextSwitchArray, node._contextSwitchInfo, isYield);
        	} else if(isYield && node._callee._contextSwitchInfo) {
        		LyteComponent.changeContext(node._callee._contextSwitchInfo.node, contextSwitchArray, node._callee._contextSwitchInfo, true);
        	}
        }, 
        "newRemoveContext" : function(node, contextSwitchArray) {
        	let isYield = node.tagName === "LYTE-YIELD";
        	if(node._contextSwitchInfo && (!isYield || node._contextSwitchInfo.node.tagName !== "LYTE-YIELD")) {
        		LyteComponent.removeContext(node._contextSwitchInfo.node, contextSwitchArray, node._contextSwitchInfo, isYield);
        	} else if(isYield && node._callee._contextSwitchInfo) {
        		LyteComponent.removeContext(node._callee._contextSwitchInfo.node, contextSwitchArray, node._callee._contextSwitchInfo, true);
        	}
        },
        "changeContext" : function(node, contextSwitchArray, contextSwitchInfo, proceedFurther) {
            if(!contextSwitchInfo) {
                return;
            }
            let isYield = node.tagName === "LYTE-YIELD";
            if(node._contextSwitchInfo && (!isYield || node._contextSwitchInfo.node.tagName !== "LYTE-YIELD")) {
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
                let callee = node._registerYield._callee;
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
            let isYield = node.tagName === "LYTE-YIELD";
            if(node._contextSwitchInfo && (!isYield || node._contextSwitchInfo.node.tagName !== "LYTE-YIELD")) {
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
                let callee = node._registerYield._callee;
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
                Lyte.error("LC005", functionName);
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
            let commArgs = arguments[2];
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
                                if(helper.hasAttribute("unbound")) {
                            		continue;
                            	}
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
                                if(helper.hasAttribute("unbound")) {
                            		continue;
                            	}
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
                                if(helper.hasAttribute("unbound")) {
                            		continue;
                            	}
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
            case "removeObject" : 
                    commArgs = [commArgs];
            case "removeObjects" :
                if(!(commArgs instanceof Array)) {
                    commArgs = [commArgs];
                }
                for(var i=0;i<commArgs.length;i++) {
                    let inde = array.indexOf(commArgs[i]);
                    if(inde !== -1) {
                       LyteComponent.arrayFunctions(array, 'removeAt', inde);                         
                    }
                }
                //Lyte.arrayUtils(array, 'removeObject', actObj);
                //Lyte.arrayUtils(array, 'removeObjects', []);
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
                            	if(forbind[j].hasAttribute("unbound")) {
                            		continue;
                            	}
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
                let position = parseInt(arguments[2]);
		LyteComponent.callArrayObservers(array,{type:"array",insertedItems:(!(arguments[3] instanceof Array)) ? [arguments[3]]: arguments[0].slice(position,position+len),index:position});
                }
                break;
            case "concat" : 
                //LyteComponent.arrayFunctions.apply(LyteComponent, [array, 'insertAt',array.length].concat(arguments[2]));
                LyteComponent.arrayFunctions(array, 'insertAt', array.length, arguments[2]);
                break;
            default: 
                Lyte.error("LC006" , functionName);
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
                if(!currentValue || typeof currentValue !== "object") {
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
                        delete actData._bindings;
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
                    var inner = LyteComponent.getDynamicData.call(self,self.component.data,item);
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
                Lyte.error("LC007");
                return;
            }
            if(data){
                component.setData(data);
            }
            if(outlet) {
                let actOutlet = document.querySelector(outlet);
                if(actOutlet) {
                    actOutlet.appendChild(component);
                    component._callee = component.getCallee(actOutlet);
                } else {
                    Lyte.error("LC008", outlet);
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
                Lyte.error("LC009", methodName);
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
        }, 
        "cssEscape" : function(string) {
            if(string) {
                return string.replace(/['"]/g, "\\$&");    
            } else {
                return string;
            }
            
        }

}
Lyte.Component.render = LyteComponent.render;
LyteComponent.lyteComponentsDiv = document.createElement("div");
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
                    if( actObj && (actObj.name === "action" || actObj.name === "method") && /^(onfocus|onfocusin|onfocusout|onresize|onscroll|onclick|ondblclick|onmousedown|onmouseup|onmousemove|onmouseover|onmouseout|onchange|onselect|onsubmit|onkeydown|onkeypress|onkeyup|oncontextmenu)$/.test(node.attributes[i].name)){
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
            		doCompile(dynN.content.querySelector("[case='"+LyteComponent.cssEscape(key)+ "']").content, info.cases[key].dynamicNodes,componentName);
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

LyteComponent.addLyteEventListener = function(element, eventName, func, context) {
  element._lyteEvents = element._lyteEvents || {};
  element._lyteEvents[eventName] = element._lyteEvents[eventName] || []; 
  var ind = element._lyteEvents[eventName].push({"func" : func, "fromEventListener" : true, "context" : context});
  return eventName + "-" + ind; 
}

LyteComponent.removeLyteEventListener = function(element, listenerId) {
    if(!listenerId) {
        Lyte.error("No listenerId provided");
        return;
    }
    var split = listenerId.split('-');
    var eventName = split[0];
    var index = parseInt(split[1]);
    if(!element._lyteEvents || !element._lyteEvents[split[0]] || isNaN(index)) {
        Lyte.error("Invalid listenerId / listener is not available");
        return;
    }
    element._lyteEvents[split[0]][split[1] - 1] = {};
}

LyteComponent.hasLyteEvents = function(element, eventName) {
    if(element._lyteEvents && element._lyteEvents[eventName]) {
        return true;
    } else {
        return false;
    }
}

LyteComponent.handleLyteEvents = function(element, event) {
    var funcs = element._lyteEvents[event.type];
    var ret;
    var eventStopped;
    for(var i=0;i<funcs.length;i++) {
        if(funcs[i].func) {
            ret = funcs[i].func.call(funcs[i].context ? funcs[i].context : window, event);
            if(ret === false || event.cancelBubble) {
                eventStopped = true;
                break;
            } 
        }
    }
    if(eventStopped) {
        event.stopPropagation();
    }
    return eventStopped;
}

//$Id$
Lyte.registerErrorCodes({
	LD01: "Primary key value might be missing in the response data that is received, {0}",
	LD02: "{0} not present, {0}",
	LD03: "Cannot set the error {0} for {1}",
	LD04: "No such record to merge, {0}",
	LD05: "Model( {0} ) of related property - {1} not found in model - {2}",
	LD06: "Backward relation not present in {0} for the property {1} in model( {2} )",
	LD07: "{0} type not handled in handleArrayOperations",
	LD08: "{0} {1} will be deprecated from next version {2}",
	LD09: "deserializeKey cannot be processed for payload with more than two keys. Please use payloadKey callback instead or try modifying the same in normalizeResponse callback"
});
var $Record = function $Record(){
	Object.assign(this, {inIDB : false, isModified : false, isNew : false, isDeleted : false, isError : false, events : [], validatedOnCreate : true, error : {}});
}
/* Record Constructor
Steps Done: 
* Assign data
* Assign $Record -> Maintaining Record state
* Assign ref of model,record to act independently
***
*/
var Record = function Record(modelName,data){
	Object.assign(this, data);
	Object.defineProperties(this, {
		$ :{
			enumerable : false,
			writable : true,
			value : new $Record()
		}
	});
	var model = store.modelFor(modelName);
	Object.defineProperties(this.$, {
		model : {
			enumerable : false,
			value : model
		},
		record : {
			enumerable : false,
			value : this
		},
		_attributes : {
			enumerable : false,
			value : {},
			writable : true
		},
		isDirty: {
			enumerable:false,
			value: function value(){
				var result = [];
				if(this.record.$.isModified){
					return true;
				}
				var relations = this.model.relations;
				for(var rel in relations){
					var rel_model = relations[rel];
					for(var j=0;j<rel_model.length;j++){
						var rel = rel_model[j];
						if(rel.opts && rel.opts.serialize && rel.opts.serialize === "record"){
							var key = rel.relKey;
							var type = rel.relType;
							var records = this.record[key];
							if(type === "belongsTo" && records && records.$ && records.$.isModified){
								result.push(key);
                            }
							else if(type === "hasMany" && records){
								for(var k=0;k<records.length;k++){
									if(records[k] && records[k].$ && records[k].$.isModified){
                                        result.push(key);
                                    }
								}
							}
						}
					}
				}
                if(result.length){
					return result;
				}
				return false;
			}
		},
		undoStack : {
			enumerable : false,
			value : [],
			writable : true
		},
		redoStack : {
			enumerable : false,
			value : [],
			writable : true
		}
	});
	var parent = store.$.saveParent;
	if(parent && this !== parent){
		Object.defineProperty(this.$,"parent",{
			value: parent,
			enumerable:false
		})
	}
    var fields = model.fieldList, record = {}, errorObj = new error1();
    for(var field in fields){
        var fieldKeys = fields[field];
        if(fieldKeys.type != "relation"){
            var val = data[field];
            if(val == undefined || val === "" || val == null){
                if(fieldKeys.hasOwnProperty("default")){
                    this[field] = fieldKeys.default;
                }
            }            
        }
    }
	var props = model._properties;
	if(Object.keys(props).length){
//		store.$.establishBindingsScope(props,this);
		if(!this._bindings){
			Object.defineProperty(this, '_bindings', {
				value : new Set(),
				enumerable : false, 
				writable : true
			});
		}
		this._bindings.add(props);
		store.$.establishObserverBindings(this,props);
	}
//	console.log(this.$.model._properties);
}
/* Assigning the following in $record.prototype 
So it will be available to all record.$
*/

Object.defineProperties($Record.prototype,{
	get: {
		enumerable:false,
		value:function value(attr){
			return this.record[attr];
		}
	},
	set: {
		enumerable : false,
		value : function value(attr, value){
			if(this.isDeleted){
				store.$.setRecordError(this, this.model._primaryKey, "ERR17");
			}
			else if(typeof LyteComponent != "undefined"){
				var resp;
				if(typeof attr === "string" && this.record[attr] !== value){
					resp = LyteComponent.set(this.record, attr, value);
				}
				else if(typeof attr === "object"){
					for(key in attr){
						if(this.record[key] === attr[key]){
							delete attr[key];
						}
					}
					resp = LyteComponent.set(this.record, attr, value);
				}
				if(resp && resp.$ && resp.$.isError){
					return resp;
				}
			}
			else{
				store.$.setData(this, attr, value);
			}
			return this.record;
		}
	},
	getDirtyAttributes : {
		enumerable : false,
		value : function value(){
			var attributes = this._attributes, ret = [];
			if(Object.keys(attributes).length){
				for(var key in attributes){
					ret.push(key);
				}
			}
			return ret;
		}
	},
	rollBackAttributes : {
		enumerable : false,
		value : function value(attr){
			if(!Array.isArray(attr)){
				attr = [attr];
			}
			var record = this.record, changed = [], model = this.model;
			for(var i=0; i<attr.length; i++){
				var key = attr[i];
				if(this._attributes.hasOwnProperty(key)){
					var field = model.fieldList[key], oldVal = this._attributes[key];
					if(field.type == "relation"){
						store.$.rollBackRecordsArray(oldVal, record, model, field);
					}
					else{
						if(typeof LyteComponent != "undefined"){
							LyteComponent.set(record, key, oldVal);
						}
						else{
							record[key] = oldVal;
						}						
					}
					changed.push(key);
					delete this._attributes[key];
					store.$.clearRecordError(this, key);
				}
			}
			if(!Object.keys(this._attributes).length){
				this.isModified = false;
				if(!this.isNew){
					store.$.deleteFromArray(model.dirty, this.get(model._primaryKey));
				}
			}
			if(changed.length > 0){
                var arr = [record,changed];
				this.emit("change", arr);
				model.emit("change", arr);
			}
		}
	},
	rollBack : {
		enumerable : false,
		value : function value(){
			var model = this.model, pK = model._primaryKey;
			if(this.isDeleted){
				var index = store.$.getIndex(model._deleted, pK, this.get(pK));
				store.$.rollBackDelete(model, index);
			}
			else if(this.isNew){
				store.$.rollBackNew(model, this.record, pK);
			}			
			else if(this.isModified){
				this.rollBackAttributes(this.getDirtyAttributes());
			}
            else if(this.isError){
                store.$.clearRecordError(this);
			}
			store.$.removeOnSave(this.model._name, this.record[pK]);
		}
	},
	deleteRecord : {
		enumerable : false,
		value : function value(){
			var model = this.model, record = this.record, pK = model._primaryKey;
			store.$.removeFromStore(model, record[pK]);
		}		
	},
	destroyRecord : {
		enumerable:false,
		value:function value(customData,qP){
			this.deleteRecord();
			return this.save(customData,qP,"destroyRecord");
		}				
	},
    addEventListener : {
		enumerable : false,
		value : function value(type, func){
            return store.$.eventListeners.add(this, type, func);
        }
 	},
	removeEventListener : {
		enumerable : false,
		value : function value(id){
            store.$.eventListeners.remove(this,id);
		}
	},
	emit : {
		enumerable : false,
		value : function value(type, args){
            store.$.eventListeners.emit(this,type,args);
        }
	},
	triggerAction: {
		enumerable : false,
		value : function value(actionName,customData,qP){
			var model = this.model, actions = model.actions, action = (actions) ? actions[actionName] : undefined;
			if(action){
				return store.adapter.$.handleAction(actionName, model, this.record,customData,qP);
			}
			return Promise.reject({code : "ERR18", message : Lyte.errorCodes.ERR18, data : actionName});
 		}
	},
	save: {
		enumerable : false,
		value : function value(customData,qP,options,destroy){
			var model = this.model, record = this.record, dirty = this.isDirty(), validateOnSave = options && options.validateOnSave;
            if(this.isDeleted){
				if(!this.isNew){
					return store.adapter.$.del(model._name, record, true,destroy,customData,qP);
				}
				store.adapter.$.handleResponse(undefined, record, record, undefined, undefined, model);
			}
			else if(this.isNew){
				var fields = model.fieldList, err = this;
				for(var field in fields){
					var val = record[field], fieldKeys = fields[field];
					if(fieldKeys.type == "relation"){
						continue;
					}
					if(!this.validatedOnCreate || validateOnSave){
						if(fieldKeys.mandatory && (val == null || val == undefined || val === "" || (Array.isArray(val) && val.length == 0) )){
                                store.$.setRecordError(err,field,{code : "ERR02", message : Lyte.errorCodes.ERR02});
								//err[field] = {code : "ERR02", message : Lyte.errorCodes.ERR02};
						}
						else{
							for(var property in fieldKeys){
								var resp = Lyte.checkProperty(property, record[field], field, fieldKeys[property]);
								if(resp != true){
									store.$.setError(err,field,resp);
                                    //err[field] = resp;
									break;
								}
							}							
						}							
					}
					if(Lyte.Transform[fieldKeys.type] && Lyte.Transform[fieldKeys.type].serialize){
						record[field] = Lyte.Transform[fieldKeys.type].serialize(record[field]);
					}
				}
				if(err && err.isError && Object.keys(err.error).length > 0){
					return Promise.reject(err.record);
				}
				return store.adapter.$.create(model._name, record, true ,customData,qP);
			}
			else if(this.isModified || (dirty && dirty.length) ){
				var data = {};
				if(options && validateOnSave){
					for(var field in fields){
						var val = record[field], fieldKeys = fields[field];
						if(fieldKeys.type == "relation"){
							continue;	
						}
						if(fieldKeys.mandatory && (val == null || val == undefined || val === "" || (Array.isArray(val) && val.length == 0))){
								store.$.setRecordError(record.$, field , {code : "ERR02", message : Lyte.errorCodes.ERR02});
								//err[field] = {code : "ERR02", message : Lyte.errorCodes.ERR02};
						}
						else{
							for(var property in fieldKeys){
								var resp = Lyte.checkProperty(property, record[field], field, fieldKeys[property]);
								if(resp != true){
									store.$.setError(err,field,resp);
									//err[field] = resp;
									break;
								}
							}							
						}							
					}
				}
				if(options && !options.ignoreError){
					if(record && record.$ && record.$.isError){
						return Promise.reject(record.$.error);
					}
				}
				for(var field in this._attributes){
					if(Lyte.Transform[model.fieldList[field].type] && Lyte.Transform[model.fieldList[field].type].serialize){
						data[field] = Lyte.Transform[model.fieldList[field].type].serialize(record[field]);
					}
					else{
						data[field] = record[field];
					}
				}
                for(var i=0;i<dirty.length;i++){
					data[dirty[i]] = record[dirty[i]];
				}
				var pK = model._primaryKey;
				data[pK] = record.$.get(pK);
				return store.adapter.$.put(model._name, data, record, true, customData,qP);
			}
			return Promise.resolve();
		}
	},
	getInitialValues : {
		enumerable : false,
		value : function(attr){
			var isAttrPassed = false;
			if(attr){
				if(!Array.isArray(attr)){
					attr = [attr];
				}
				isAttrPassed = true;
			}
			else{
				attr = this.getDirtyAttributes();
			}
			var ret = {}, rec = this.record;
			for(var i=0; i<attr.length; i++){
				if(rec[attr] == undefined || !rec[attr[i]].add){
					ret[attr[i]] = this._attributes[attr[i]];					
				}
				else{
					ret[attr[i]] = rec[attr[i]].slice(0);
					var arr = this._attributes[attr[i]], pK = rec[attr[i]].model._primaryKey;
					for(var j=arr.length-1; j>=0; j--){
						if(arr[j]._type == "added"){
							for(var k=0; k<arr[j].records.length; k++){
								var index = store.$.getIndex(ret[attr[i]], pK, arr[j].records[k][pK]);
								if(index == -1){
									continue;
								}
								ret[attr[i]].splice(index, 1);
							}
						}
						else if(arr[j]._type == "removed"){
							for(var k=arr[j].records.length-1; k>=0; k--){
								ret[attr[i]].splice(arr[j]._indices[k], 1, arr[j].records[k]);
							}
						}
						else if(arr[j]._type == "changed"){
							ret[attr[i]] = arr[j].records;
						}
					}
				}
			}
			if(isAttrPassed){
				return ret[attr[0]];
			}
			return ret;
		}
	},
    toJSON:{
        enumerable:false,
        value: function(idb){
            return Object.assign({}, store.$.toJSON(this.model._name, this.record, idb? "idb" : true));
        }
	},
	undo:{
		enumerable:false,
		value: function(){
			var obj = this.undoStack.pop(),undo, redoObj = {};
			if(obj){
				for(var key in obj){
					var undo = obj[key];
					if(undo._type == "update"){
						if(undo.val){
							store.$.setData(this,key,undo.val,redoObj)
						}else if(undo.records){
							store.$.setData(this,key,undo.records,redoObj)	
						}
					}
					else if(undo._type == "propAdd"){
						if(typeof LyteComponent != "undefined"){
							redoObj[key] = {type:"propDelete", val:this.record[key]};
							LyteComponent.objectFunction(this.record, "delete", key);
						}
						else{
							delete this.record[key];
						}
					}
					else if(undo._type == "added"){
						this.record.$.get(key).remove(undo.records,undefined,redoObj);
					}
					else if(undo._type == "removed"){
						store.$.rollBackRecordsArray([undo], this.record, this.model, this.model.fieldList[key])
						undo._type = "added";
						redoObj[key] = undo;
					}
				}
				this.redoStack.push(redoObj);				
			}
		}
	},
	redo:{
		enumerable:false,
		value:function(){
			var obj = this.redoStack.pop(),redo, undoObj = {};
			if(obj){
				for(var key in obj){
					var redo = obj[key];
					if(redo._type == "update"){
						if(redo.val){
							store.$.setData(this,key,redo.val,undoObj)
						}else if(redo.records){
							store.$.setData(this,key,redo.records,undoObj)	
						}
					}
					else if(redo._type == "propDelete"){
						undoObj[key] = {type:"propAdd"}
						store.$.setData(this,key,redo.val,undoObj);
					}
					else if(redo._type == "added"){
						this.record.$.get(key).remove(redo.records,undefined,undoObj);
					}
					else if(redo._type == "removed"){
						store.$.rollBackRecordsArray([redo], this.record, this.model, this.model.fieldList[key])
						redo._type = "added";
						undoObj[key] = redo;
					}
	
				}
				this.undoStack.push(undoObj);
			}
		}	
	}
});

/* Model Object Constructor 
*/
var Model = function Model(name,fields){
	Object.assign(this, {_name : name, _primaryKey : "id", fieldList : {id : {type : "string", primaryKey : true, defined : false}}, relations : {}, _properties : {}, data : [], dirty : [], _deleted : [],
		events : {}});
	var obs = [];
	for(var key in fields){
		store.$.registerField(this,key,fields[key],obs);
	}
	if(typeof LyteComponent != "undefined"){
		LyteComponent.establishObserverBindings(obs,true,this._properties);
	}
	store.$.defineArrayUtils(this.data);
	store.$.defineUtilsFor(this.data,this);
	Object.defineProperty(this,"extends", {
		enumerable: false,
		value: store.$.extendModel
	});
}
Model.prototype.addEventListener = function(type, func){
    return store.$.eventListeners.add(this,type,func);
}
Model.prototype.removeEventListener = function(id){
    store.$.eventListeners.remove(this,id);
}
Model.prototype.emit = function(type, args){
    store.$.eventListeners.emit(this,type,args);
}
Model.prototype.on = function(type,func){
    return this.addEventListener(type,func);
}

var store={
	model : {},
	$:{ 
		request: {},
		toRelate : {},
		idbQueue:[],
		idbQ: {},
		idbQ2: {},
		checkWithQp:function(arr, data){
			var ind = -1;
			arr = arr || [];
			arr.forEach(function(item, index){
				var qp1 = item.qP || {};
				var qp2 = data.qP || {};
				if(qp1 == qp2){
					ind =  index;
					return;
				}
				var qp1L = Object.keys(qp1).length;
				var qp2L = Object.keys(qp2).length, i=0;
				if(qp1L != qp2L){
					return;
				}        
				for(var key in qp1){
					if(qp1[key] == qp2[key]){
						i++;
					}
				}
				if(i == qp1L){
					ind = index;
					return;
				}
			});
			return ind;
		},
		// requestHandling:function(type, modelName, reqType, key, urlObj){
		// 	var req = store.$.request;
		// 	var q = req[modelName] = req[modelName] || {};
		// 	switch(reqType){
		// 		case "findRecord":{
		// 			var reqQ = q[reqType] = q[reqType] || {};
		// 			if(reqQ.hasOwnProperty(key)){
		// 				if(type == "add"){
		// 					return -1;
		// 				}
		// 				else{
		// 					delete reqQ[key];
		// 					return;
		// 				}
		// 			}
		// 			reqQ[key] = {qP: urlObj.qP}
		// 			break;
		// 		}
		// 		case "findAll":{
		// 			var reqQ = q[reqType] = q[reqType] || [];
		// 			var ret = this.checkWithQp(reqQ, {qP:urlObj.qP});
		// 			if(ret != -1){
		// 				if(type == "add"){
		// 					return -1;
		// 				}
		// 				else{
		// 					reqQ.splice(ret,1);
		// 					return;
		// 				}
		// 			}
		// 			reqQ.push({qP:urlObj.qP});
		// 			break;
		// 		}
		// 	}
		// },		
		handleCachedResponse:function(batch,resp){
			var cached = store.$.cachedBatch = store.$.cachedBatch || {}
			var arr = cached[batch] || [], count = 0;
			arr.forEach(function(item,index){
				resp.splice((item.ind+count++),0,item.data);
			});
			delete cached[batch];
			return resp;
		},
		addToCachedBatch:function(data){
			var curr = store.$.currentBatch;
			var cached = store.$.cachedBatch = store.$.cachedBatch || {};
			var cachedB = cached[curr] = cached[curr] || [];
			var arr = store.$.batch[curr] || [];
			var ind = arr.length;
			cachedB.push({ind:ind, data:data});
		},
		establishToRelated:function(record, relArr){
			console.time("establishToRelated");
			var bModel = record.$.model, rel = {};
			relArr.forEach(function(item, index){
				var rec = store.peekRecord(item.model, item.pkVal);
				if(rec){
					var fModel = rec.$.model;
					store.$.getRelations(fModel, item.key, bModel, rel);
					store.$.establishLink(rel.forward, rel.backward, rec, record);
				}
			});
			console.timeEnd("establishToRelated");
		},
		checkObjAndAddToArr:function(arr, obj, keys){
			var len = keys.length, res = -1;
			arr.forEach(function(item, index){
				var i=0;
				for(var key in keys){
					if(item[key] == obj[key]){
						i++;
					}	
				}
				if(i == len){
					res = index;
					return;
				}
			});
			if(res == -1){
				arr.push(obj);
			}
			return res;
		},
		addToRelate:function(modelName, data, rel, key){
			var relMod = rel.forward.relatedTo;
			var toRelMod = store.$.toRelate[relMod] = store.$.toRelate[relMod] || {};
			var toRel = toRelMod[key] = toRelMod[key] || [];
			var pkVal = data[data.$.model._primaryKey];
			var obj = {model : modelName, pkVal : pkVal, key : rel.forward.relKey};
			this.checkObjAndAddToArr(toRel, obj, ["record","key"]);
		},
		addOnSave:function(modelName,record,attr,field,pK,relPk){
			store.$.onSave = store.$.onSave || {};
			var saveMod = store.$.onSave[modelName] = store.$.onSave[modelName] || {};
			var saveQ = saveMod[record[pK]] = saveMod[record[pK]] || {} 
			var recs = record[attr] || [];
			if(field.relType == "belongsTo"){
				recs = !Array.isArray(record[attr]) ? [record[attr]] : record[attr]; 
			}
			recs.forEach(function(item, index){
				var q = saveQ[field.relKey] = saveQ[field.relKey] || [];
				store.$.checkAndAddToArray(q, item[relPk]);
			});
		},
		addToIDBonSave:function(modelName, rec){
			var model = store.model[modelName];
			var fields = model.fieldList;
			var saveMod = store.$.onSave ? store.$.onSave[modelName] : undefined;
			if(saveMod){
				var pK = store.model[modelName]._primaryKey;
				var saveQ = rec && pK ? saveMod[rec[pK]] : undefined;
				if(saveQ){
					for(var key in saveQ){
						var ids = saveQ[key];
						var relMod = fields[key].relatedTo;
						ids.forEach(function(item, index){
							var rec = store.peekRecord(relMod,item);
							var parent = rec.$.parent;
							if(Lyte.isRecord(parent)){
								var mod = parent.$.model;
								var modName = mod._name;
								var modPk = mod._primaryKey;
								store.$.checkAndAddToIDBQ(modName, "updateRecord", store.peekRecord(modName,parent[modPk]).$.toJSON(true));
							}
							else{
								store.$.checkAndAddToIDBQ(relMod, "updateRecord", store.peekRecord(relMod,item).$.toJSON(true));
							}
						});
					}
					store.$.removeOnSave(modelName, rec[pK]);
				}
			}
		},
		removeOnSave:function(modelName, pkVal){
			var saveMod = store.$.onSave ? store.$.onSave[modelName] : undefined;
			if(saveMod && saveMod[pkVal]){
				delete saveMod[pkVal];
			}
		},
		checkAndAddToIDBQ:function(modelName, type, data){
			var obj = {model: modelName, type:type, data:data};
			var q = store.$.idbQ2[modelName] = store.$.idbQ2[modelName] || [];
			q.push(obj);
		},
		checkAndRemoveKey:function(rawData, fields, deserializeKeys){
			for(var key in rawData){
				var field = fields[key];
				if(field && field.type == "relation"){
					if(deserializeKeys && !this.checkPresenceInArray(deserializeKeys,key)){
						delete rawData[key];
					}
					else{
						this.removeNotNeededKeys(field.relatedTo, rawData[key]);
					}
				} 
			}
		},
		removeNotNeededKeys:function(modelName, rawData){
			var model = store.model[modelName];
			var fields = model.fieldList;
			var deserializeKeys = model.idb ? model.idb.deserializeKeys : undefined;
			if(model){
				var self = this;
				if(Array.isArray(rawData)){
					rawData.forEach(function(item, index){
						self.checkAndRemoveKey(item, fields, deserializeKeys);
					});
				}
				else{
					this.checkAndRemoveKey(rawData, fields, deserializeKeys)
				}
			}
			return rawData;
		},
		idbQ2Push:function(modelName,rawData,queryParams,type,key){
			try{
				var model = store.model[modelName];
				if(model.hasOwnProperty("idb")){
					rawData = Lyte.deepCopyObject(rawData);
					var qObj = {model:modelName,type:type};
					var pK = model._primaryKey;
					var q =	store.$.idbQ2[modelName] = store.$.idbQ2[modelName] || [];
					switch(type){
						case "action":{
							delete q[type];
							return;
						}
						case "update":
						case "create":{
							qObj.data = []
							rawData.forEach(function(item,index){
								qObj.data.push(Lyte.isRecord(item)?item.$.toJSON():item);
							});
							break;
						}
						case "updateRecord":
						case "createRecord":{
							qObj.data = rawData;
							break;
						}
						case "delete":{
							qObj.data = rawData;
							break;
						}
						case "destroyRecord":
						case "deleteRecord":{
							qObj.id = rawData;
							break;
						}
						case "findRecord":
							qObj.key = key;		
						case "findAll": {
							rawData[modelName] = this.removeNotNeededKeys(modelName, rawData[modelName]);
							// for(var i=0; i<q.length; i++){
							// 	var item = q[i];
							// 	var qP = item.queryParams, len = 0;
							// 	qpLen = typeof qP =="object" ? Object.keys(qP).length : 0;
							// 	if(queryParams === undefined){
							// 		if(queryParams == qP){
							// 			item.data = rawData;
							// 			return;
							// 		}
							// 		continue;					
							// 	}
							// 	for(var key in qP){
							// 		if(qP[key] == queryParams[key]){
							// 			len++;
							// 		}
							// 	}
							// 	if(len && qpLen && len == qpLen){
							// 		item.data = rawData;
							// 		return;
							// 	}	
							// }
							qObj.queryParams = queryParams;
							qObj.data = rawData;
							break;
						}
						case "pushPayload": {
							rawData = this.removeNotNeededKeys(modelName, rawData);
							qObj.data = rawData;
							break;
						}
					}
					q.push(qObj);
				}	
			}
			catch(err){
				console.log("Error while adding to IDBQueue ",err);
			}
		},
		isEmpty:function(val){
			if(val != undefined && val !== "" && val != null){
				return false;
			}
			return true;
		},
		registerField:function(model,key,field,obs){
			// var field = fields[key];
			if(field.type == "observer"){
				obs.push(field);
			}
			else if(field.type == "callBack"){
				if(field.observes){
					obs.push(field.observes);
				}
				var props = field.properties;
				for(var i=0;i<props.length;i++){
					if(props[i] === "didLoad" || props[i] === "init"){
						if(!model.didLoad){
							model.didLoad = [];
						}
						model.didLoad.push(field.value);	
					}
					else if(props[i] === "add" || props[i] === "change"){
						model.on(props[i],field.value);
					}
				}
				if(key == "didLoad"){
					if(!model.didLoad){
						model.didLoad = [];
					}
					model.didLoad.push(field.value);
				}
			}
			else if(key == "didLoad"){
				if(!model.didLoad){
					model.didLoad = [];
				}
				model.didLoad.push(field);
			}
			else if(Object.keys(field).length){
				if(field.primaryKey){
					if(model.fieldList.id.defined == false){
						delete model.fieldList.id;
					}
					model._primaryKey = key;
				}
				model.fieldList[key] = field;				
			}
			if(field.type === "relation"){
				field.relKey = key;
				if(!model.relations[field.relatedTo]){
					model.relations[field.relatedTo] = [];
				}
				model.relations[field.relatedTo].push(model.fieldList[key]);
			}	
		},
        setError:function(err,attr,codeObj){
            if(err.$.hasOwnProperty("error")){
                if(typeof LyteComponent != "undefined"){
                    LyteComponent.set(err.$.error,attr,codeObj);
                }else{
                    err.$.error[attr] = codeObj;                    
                }
            }
            else{
                Lyte.error("LD03",err,attr);
            }
		},  
		unregisterCallback:function(type,name){
			var callback = store[type][name];
			if(!callback){
				Lyte.error(type," not present - ",name);
				return;
			}
			var extendedBy = callback.__extendedBy;
			extendedBy.forEach(function(item){
				store.$.unregisterCallback(type,item);
			});
			if(callback.$super){
				callback.$super.__extendedBy.splice(callback.$super.__extendedBy.indexOf(name));
			}
			delete store[type][name];
		},
        eventListeners : {
          add: function(scope,type,func){
            scope.events = scope.events || {};
            scope.events[type] = scope.events[type] || [];
            scope.events[type].push({f : func});
            return  type+"-"+(scope.events[type].length-1);              
          },
          remove: function(scope,id){
            var type;
            if(id){
                if(/^(add|remove|change)$/.test(id)){
                    type = id;
                    (scope.events && scope.events[type]) ? delete scope.events[type] : undefined;   
                }
                else{
                    var arr = id ? id.split("-") : undefined;
                    if(arr){
                        var listeners = scope.events[arr[0]];
                        if(listeners && arr[1]){
                            listeners[arr[1]] = null;
                        }   
                    }            
                }
            }else{
                var ev = scope.events;
                for(var evType in ev){
                    (ev && ev[evType]) ? delete ev[evType] : undefined;
                }
            }
          },
          emit:function(scope,type,args){
            var listeners = (scope.events && scope.events[type]) ? scope.events[type] : [];
            for(var i=0; i<listeners.length; i++){
                (listeners[i]) ? listeners[i].f.apply(null, args) : undefined;
            }            
          }
        },
        extendCallback:function(scope,type,parent){
            var callback = scope[type];
            var res;
            if(parent && typeof parent === "string"){
                res = callback[parent];
                if(!res){
					callback.__toAddSuper = callback.__toAddSuper || {};
                     if(!callback.__toAddSuper.hasOwnProperty(parent)){
                        callback.__toAddSuper[parent] = [];   
                     }
                     callback.__toAddSuper[parent].push(this.__name);
                }
            }	
            if(res && res.is == type && !this.$super){
				this.$super = res;
				res.__extendedBy.push(this.__name);
            }
            return this;            
        },
		extendModel:function(extend){
			if(!extend || !store.model[extend]){
				return;
			}
			var parentFields = Object.assign({},store.model[extend].fieldList);
			for(var key in parentFields){
				if(parentFields[key].type == "relation"){
					delete parentFields[key];
				}
			}
			this.fieldList = Object.assign(this.fieldList, parentFields);
			var name = this._name;
			store.model[name].extend = extend;
			store.model[extend].extendedBy = store.model[extend].extendedBy || {};
			store.model[extend].extendedBy[name] = true;
			if(!store.adapter[name] && store.adapter[extend]){
				store.adapter[name] = store.adapter[extend];
			}
			if(!store.serializer[name] && store.serializer[extend]){
				store.serializer[name] = store.serializer[extend];
			}
		},
		establishObserverBindings:function(obj,prop,record){
			if(!record){
				record = obj;
			}
			for(key in prop){
				if(obj[key] instanceof Object && !(obj[key]._bindings && obj[key]._setterScope)){
					if(!obj[key]._bindings){
                        Object.defineProperty(obj[key], '_bindings', {
                            value : new Set(),
                            enumerable : false, 
                            writable : true
                        });                        
                    }
					if(record && !obj[key]._setterScope){
						Object.defineProperty(obj[key], '_setterScope', {
							value : record,
							enumerable : false 
						});	
					}
					obj[key]._bindings.add(prop[key]);
					if(Object.keys(prop[key]).length){
						this.establishObserverBindings(obj[key],prop[key],obj);
					}
				}
				else{
					if(!obj._setterScope){
						Object.defineProperty(obj, '_setterScope', {
							value : obj,
							enumerable : false 
						});
					}
				}	
			}
		},
		setData:function(self, attr, value, redoObj){
			var toEmit = {emit : false, attr : [], oldRec : {}};
			if(attr instanceof Object){
				for(var key in attr){
					this.setValue(self, key, attr[key], toEmit);
				}
			}
			else{
				this.setValue(self, attr, value, toEmit);
			}
			if(toEmit.emit){
                var arr = [self.record, toEmit.attr];
				self.emit("change", arr);
				self.model.emit("change", arr);
				store.emit("change", [self.model._name,self.record, toEmit.attr]);
				if(redoObj){
					for(var key in toEmit.oldRec){
						redoObj[key] = toEmit.oldRec[key];
					}
				}
				else{
					self.undoStack.push(toEmit.oldRec);
				}
			}
			return self.record;
		},
		setValue:function(self,attr,value, toEmit){
			var model = self.model, oldAttrVal, hasAttr, pK = model._primaryKey;
			if(attr != model._primaryKey){
				var field = model.fieldList[attr], record = self.record;
				if(!field){
					hasAttr = record.hasOwnProperty(attr),oldAttrVal = record[attr];
					if(typeof LyteComponent != "undefined"){
						LyteComponent.set(record,attr,value,true);
					}
					else{
						record[attr] = value;
					}					
				}
				else if(field.mandatory && (value == undefined || value == null || value === "")){
					store.$.setRecordError(self, attr, "ERR02");
				}
				else if(field.relType){
					var rel ={}, oldVal, oldVal1, relMod = store.modelFor(field.relatedTo), relPk = relMod._primaryKey;
					this.getRelations(model, field.relKey, relMod, rel);
					if(record[attr] && field.relType == "hasMany"){
						oldVal = [];
						record[attr].forEach(function(item, index){
							oldVal.push(item[relPk]);
						});
						// oldVal = record[attr].slice(0);
						// oldVal1 = record[attr].mapBy(relMod._primaryKey);
						store.$.addOnSave(model._name,record,attr,field,pK,relPk);
						this.toDemolishLink(model, record, rel.forward);
						record[attr].splice(0, record[attr].length);
					}
					else if(record[attr] && field.relType == "belongsTo"){
						oldVal = record[attr][relPk];
						// oldVal = this.createCopy(record[attr]);
						store.$.addOnSave(model._name,record,attr,field,pK,relPk);
						// oldVal1 = record[attr][relMod._primaryKey];
						this.toDemolishLink(model, record, rel.forward);
						record[attr] = undefined;
					}
					if(!Array.isArray(value)){
						value = [value];
					}
					else if(field.relType == "belongsTo"){
						this.revertToOldVal(record, attr, oldVal, rel);
						store.$.setRecordError(self, attr, "ERR21", value);
						return;
					}
					var bModel = relMod, bPk = bModel._primaryKey, bPkType = bModel.fieldList[bPk].type, err = [];
					for(var i=0; i<value.length; i++){
						if(value[i] == undefined){
							continue;
						}
						var relRecord = value[i], relMod1 = (value[i] && value[i]._type) ? value[i]._type : field.relatedTo;
						if(typeof value[i] == bPkType){
							relRecord = store.peekRecord((value[i]._type) ? value[i]._type : field.relatedTo, value[i]);
							if(relRecord == undefined){
								this.addToRelate(model._name, record, rel, value[i]);
							}
							else
							 if(relRecord.$ && relRecord.$.isError){
								err.push({code : "ERR15", message : Lyte.errorCodes.ERR15, error : Object.assign({}, relRecord)});
								continue;
							}
						}
						else if(typeof value[i] == "object"){
							if(relRecord.$ && relRecord.$.isError){
								err.push({code : "ERR15", message : Lyte.errorCodes.ERR15, error : Object.assign({}, relRecord)});
								continue;
							}
							else if(!Lyte.isRecord(relRecord)){
								relRecord = this.newRecord(relMod1, value[i]);
								if(relRecord.$.isError){
									err.push({code : "ERR15", data : value[i], message : Lyte.errorCodes.ERR15, error : Object.assign({}, relRecord)});
									continue;
								}
							}
						}
						var changed = this.establishLink(rel.forward, rel.backward, record, relRecord);
						if(changed != true){
							err.push({code : changed, data : value[i], message : Lyte.errorCodes[changed]});
						}
						else{
							store.$.addOnSave(model._name,record,attr,field,pK,relPk);
						}
					}
					if(err.length && (err.length == value.length)){
						this.revertToOldVal(record, attr, oldVal, rel);
						if(field.relType == "belongsTo"){
							store.$.setRecordError(self, attr, err[0]);
						}
						else{
							store.$.setRecordError(self, attr, err);
						}
						return;
					}
					else{
						if(err.length > 1){
							store.$.setRecordError(self, attr, err);
						}
						else{
							store.$.clearRecordError(self, attr);
						}
						if(!record.$._attributes.hasOwnProperty(attr)){
							record.$._attributes[attr] = [];
						}
						record.$._attributes[attr].push({_type : "changed", records : oldVal});
						toEmit.emit = true;
						toEmit.attr.push(attr);
						var obj = {}; obj.records = oldVal; obj._type = "update";
						toEmit.oldRec[attr] = obj;
						var arr = record.$.getInitialValues(attr), changed = true;
						if(arr && Array.isArray(record[attr]) && arr.length == record[attr].length){
							changed = false;
							for(var i=0; i<arr.length; i++){
								if(!store.$.compareRecords(arr[i], record[attr][i], bPk)){
									changed = true;
									break;
								}
							}
						}
						if(!changed){
							delete record.$._attributes[attr];
						}
					}
				}
				else{
					if(value !== record[attr]){
						for(var property in field){
							var resp = Lyte.checkProperty(property, value, attr, field[property]);
							if(resp != true){
								store.$.setRecordError(self, attr, resp, value);
								return;
							}
						}
						var attribute = record.$._attributes[attr];
						if( !record.$._attributes.hasOwnProperty(attr)){
							record.$._attributes[attr] = this.createCopy(record[attr]);
						}
						else if((typeof value == "object" && store.adapter.$.compareObjects(attribute, value)) || (attribute == value)){
							delete record.$._attributes[attr];
						}
						hasAttr = record.hasOwnProperty(attr);
						oldAttrVal = record[attr];
                        if(typeof LyteComponent != "undefined"){
							LyteComponent.set(record,attr,value,true);
						}
						else{
							record[attr] = value;
						}
						toEmit.emit = true;
						toEmit.attr.push(attr);
						store.$.clearRecordError(self, attr);
						var obj = {};
						obj._type = "update";
						obj.val = oldAttrVal;
						if(!hasAttr){
							obj.type = "propAdd";
						}
						toEmit.oldRec[attr] = obj;	
					}
					else if(value === record[attr] && record.$.isError && record.$.error[attr]){
						var valid = true;
						for(var property in field){
							var resp = Lyte.checkProperty(property, value, attr, field[property]);
							if(resp != true){
								valid = false;
							}
						}
						if(valid){
							store.$.clearRecordError(self,attr);
						}
					}
				}
				if(Object.keys(record.$._attributes).length){
					self.isModified = true;
					this.checkAndAddToArray(model.dirty, record[model._primaryKey]);
				}
				else{
					self.isModified = false;
					if(!self.isNew){
						this.deleteFromArray(model.dirty, record[model._primaryKey]);
					}
				}
			}
			else{
				store.$.setRecordError(self, attr, "ERR01", value);
			}
		},
		checkForCorrectRelation:function(rel,record){
			var relatedTo = rel.relatedTo;
            if(!Lyte.isRecord(record)){
                return false;
            }
			if(rel.opts && rel.opts.polymorphic){
				return (record.$.model.extend ? rel.relatedTo === record.$.model.extend : false);
			}
			return (rel && record ? relatedTo === record.$.model._name : false);
		},
        removeKeys:function(fieldList,record){
            for(var key in record){
                if(!fieldList.hasOwnProperty(key)){
                    delete record[key];
                }
                else{
                    var field = fieldList[key];
                    if(field.type === "belongsTo" || field.type === "hasMany" && record[key]){
                        this.removeNotDefinedKeys(field.relatedTo,record[key], (field.opts && field.opts.polymorphic) ? true: undefined);
                    }
                }
            }
        },
		removeNotDefinedKeys:function(model,records,polymorphic){
			var fieldList = model.fieldList;
			if(Array.isArray(records)){
				for(var i=0; i<records.length; i++){
					var record = records[i];
					this.removeKeys((polymorphic)?(Lyte.isRecord(record)?record.$.model.fieldList:fieldList):fieldList,record);
				}				
			}
			else{
                this.removeKeys((polymorphic)?(Lyte.isRecord(records)?records.$.model.fieldList:fieldList):fieldList,records);
			}
		},
		add:function(value,type,redoObj){
			var record= this.record, model = record.$.model, attr = this.key, field = model.fieldList[attr], rel = {};
			store.$.getRelations(model, field.relKey, store.modelFor(field.relatedTo), rel);
			if(!Array.isArray(value)){
				value = [value];
			}
			var relMod = store.modelFor(rel.forward.relatedTo);
			var pK = relMod._primaryKey, err = [], arr = [];
			for(var i=0; i<value.length; i++){
				var rec = value[i];
				if(typeof rec == "object" && !Lyte.isRecord(rec)){
					rec = store.$.newRecord((rec._type) ? rec._type : type ? type : field.relatedTo, rec);
				}
				else if(relMod.fieldList[pK].type.toLowerCase() == typeof rec){
					if(this.polymorphic && !type){
						err.push({code : "ERR22", data : value[i], message : Lyte.errorCodes.ERR22});
						continue;
					}
					rec = store.peekRecord((type) ? type : rel.forward.relatedTo, rec);
				}
				var polyType = (rec && rec._type)?rec._type: type ? type: undefined ;
				if(rec == undefined){
					err.push({code : "ERR13", data : value[i], message : Lyte.errorCodes.ERR13});
				}
				else if(rec.$ && rec.$.isError){
					err.push({code : "ERR15", data : value[i], message : Lyte.errorCodes.ERR15, error : rec});
				}
				else if(Lyte.isRecord(rec) && !store.$.hasDuplicateRelation(rec, record[attr], pK, polyType)){
					var resp = store.$.establishLink(rel.forward, rel.backward, record, rec);
					if(resp != true){
						err.push({code : resp, data : value[i], message : Lyte.errorCodes[resp]});
					}
					else{
						arr.push(rec);
					}
				}
			}
			if(arr.length){
				if(!record.$._attributes[attr]){
					record.$._attributes[attr] = [];
				}
				record.$._attributes[attr].push({_type : "added", records : arr});
				store.$.emit("change", record, [attr]);
				if(store.$.hasRecordsArrayChanged(record, attr)){
					record.$.isModified = true;
					store.$.checkAndAddToArray(model.dirty, record[model._primaryKey]);
				}
				else{
					record.$.isModified = false;
					delete record.$._attributes[attr];
					if(!record.$.isNew){
						store.$.deleteFromArray(model.dirty, record[model._primaryKey]);
					}
				}
				var obj = {_type:"added", records: arr};
				if(redoObj){
					redoObj[attr] = obj; 
				}
				else{
					var stackObj = {};
					stackObj[attr] = obj;
					record.$.undoStack.push(stackObj);
				}
			}
			if(err.length > 0){
				store.$.setRecordError(record.$, attr, err);
			}
			else{
				store.$.clearRecordError(record.$, attr);
			}
			return record;
		},
		remove:function(key,type,redoObj){
			var record = this.record, model = record.$.model, attr =  this.key, field = model.fieldList[attr], rel = {};
			store.$.getRelations(model, field.relKey, store.modelFor(field.relatedTo), rel);
			if(!Array.isArray(key)){
				key = [key];
			}
			var relMod = store.modelFor(rel.forward.relatedTo);
			var pK = relMod._primaryKey, err = [], relatedRecord, arr = [], indices = [];
			for(var i=0; i<key.length; i++){
				if(relMod.fieldList[pK].type.toLowerCase() == typeof key[i]){
					if(this.polymorphic == true && !type){
						err.push({code : "ERR22", data : key[i], message : Lyte.errorCodes.ERR22});
						continue;
					}
					relatedRecord = store.peekRecord((type)?type:rel.forward.relatedTo,key[i]);
				}
				else if(Lyte.isRecord(key[i])){
					relatedRecord = key[i];
				}
                var polyType = (relatedRecord && relatedRecord._type) ? relatedRecord._type : type ? type : undefined;
				if(relatedRecord){
					var index = store.$.getIndex(record[attr], pK, relatedRecord.$.get(pK),polyType);
					store.$.demolishLink(relatedRecord, pK, store.peekRecord(rel.backward.relatedTo, record[model._primaryKey]), rel.forward.relKey);
					store.$.demolishLink(record, model._primaryKey, store.peekRecord((polyType)?polyType:rel.forward.relatedTo, relatedRecord[pK]), rel.backward.relKey);
					arr.push(relatedRecord);
					indices.push(index);
				}
			}
			if(arr.length){
				if(!record.$._attributes[attr]){
					record.$._attributes[attr] = [{_type : "removed", records : arr, _indices : indices}];
					record.$.isModified = true;
					store.$.checkAndAddToArray(model.dirty, record[model._primaryKey]);
				}
				else if(store.$.hasRecordsArrayChanged(record, attr)){
					record.$._attributes[attr].push({_type : "removed", records : arr, _indices : indices});
				}
				else{
					record.$.isModified = false;
					delete record.$._attributes[attr];
					if(!record.$.isNew){
						store.$.deleteFromArray(model.dirty, record[model._primaryKey]);															
					}
				}
				store.$.emit("change", record, [attr]);
				var obj = {_type:"removed", records: arr, _indices : indices};
				if(redoObj){
					redoObj[attr] = obj; 
				}
				else{
					var stackObj = {};
					stackObj[attr] = obj;
					record.$.undoStack.push(stackObj);
				}
			}
			if(err.length > 0){
				store.$.setRecordError(record.$, attr, err);
			}
			else{
				store.$.clearRecordError(record.$, attr);
			}
		},
		filter:function(record,filObj,len){
			var j=0;
			for(var key in filObj){
				if(record[key] === filObj[key]){
					j++;
				}
			}
			if(j === len){
				return true;
			}
		},
		filterBy : function(obj){
			var len = Object.keys(obj).length, j = 0, arr = [];
			for(var i=0; i<this.length; i++){
				if(store.$.filter(this[i],obj,len)){
					arr.push(this[i]);
				}
			}
			if(!arr.filterBy){
				store.$.defineArrayUtils(arr);
				store.$.defineUtilsFor(arr,this.model);
			}
			return arr;
		},
		removeSelfCircularReference : function(modelName,obj,expose,type){
			var model = store.modelFor(modelName), fieldList = model.fieldList, pK = model._primaryKey;
			var extended = model.extend ? true : false;
			store.$.recStack[modelName] = store.$.recStack[modelName] || []; 
			var ret = store.$.checkAndAddToArray(store.$.recStack[modelName], obj[pK]);
			for(var key in obj){
				var field = fieldList[key], extMod, swap;
				var removePk = (type == "create" && model._primaryKey == key) ? true: false;
				if(removePk){
					delete obj[key];
					continue;
				}
				if(!field && extended){
				    extMod = store.modelFor(model.extend);
					field = extMod.fieldList[key];
					swap = true;
				}
				if(obj[key] && field && field.type == "relation"){
					var bModel = store.modelFor(field.relatedTo);
					if(bModel == undefined){
						continue;
					}
					var relKey = field.relKey, rel = {};
					if(swap){
						this.getRelations(extMod, field.relKey, store.modelFor(field.relatedTo), rel);						
					}
					else{
						this.getRelations(model, relKey, bModel, rel);
					}
					var opts = field.opts;
					var serialize = opts ? opts.serialize : undefined, val = obj[relKey], pK = model._primaryKey, pkVal = obj[pK];
					var polymorphic = opts ? opts.polymorphic : undefined, bPk = bModel._primaryKey;
					if(expose == "idb"){
						if(Array.isArray(val)){
							val.forEach(function(item, index){
								if(Lyte.isRecord(item) && item.$.inIDB){
									val[index] = item[bPk];										
								}
								else if(!store.$.checkPresenceInArray(store.$.recStack[field.relatedTo],item[bPk])){
									store.$.removeBackwardRel(item, rel, pK, pkVal, true);
									store.$.removeSelfCircularReference(bModel._name, item, expose);
								}
								else{
									val[index] = item[bPk];										
								}
							});
						}
						else if(val && Lyte.isRecord(val)){
							if(Lyte.isRecord(val) && val.$.inIDB){
								obj[relKey] = val[bPk];
							}
							else if(!this.checkPresenceInArray(store.$.recStack[field.relatedTo],val[bPk])){
								this.removeBackwardRel(val, rel, pK, pkVal, true);
								this.removeSelfCircularReference(bModel._name, val,expose);
							}else{
								obj[relKey] = val[bPk];
							}
						}
					}
					else if(expose || serialize == "id"){
						if(Array.isArray(val)){
							if(polymorphic){
								obj[relKey] = this.polymorphicToJSON(field,val);
							}
							else{
								obj[relKey] = val.map(function(value, i){
									return value[pK];
								});   
							}
						}
						else if(val && Lyte.isRecord(val)){
							if(polymorphic){
								obj[relKey] = this.polymorphicToJSON(field,val);								
							}
							else{
								obj[relKey] = val[bPk];
							}
						}
					}
					else if(serialize === "record"){
						if(Array.isArray(val)){
							val = Array.from(val);
							for(var j=0; j<val.length; j++){
								if(val[j] && Lyte.isRecord(val[j])){
									this.removeBackwardRel(val[j], rel, pK, pkVal);
									this.removeSelfCircularReference(bModel._name, val[j],expose);
								}
							}
						}
						else if(val && Lyte.isRecord(val)){
							this.removeBackwardRel(val, rel, pK, pkVal);
							this.removeSelfCircularReference(bModel._name, val, expose);
						}
					}
					else{
						delete obj[relKey];
					}
				}
			}
		},
		removeBackwardRel:function(val,rel,pK,pkVal,wholeRelKey){
			if(wholeRelKey){
				delete val[rel.backward.relKey];
				return; 
			}
			var rec = val[rel.backward.relKey];
			if(Array.isArray(rec)){
				for(var i=0; i<rec.length; i++){
					if(rec[i][pK] === pkVal){
						rec.splice(i,1);
						if(rec.length == 0){
							delete val[rel.backward.relKey];
						}
						return;
					}								
				}
			}
			else if(rec && Lyte.isRecord(rec) && rec[pK] == pkVal){
				delete val[rel.backward.relKey];
			}
		},
		polymorphicToJSON : function(rel,data){
			var opts = rel.opts;
			if(opts && opts.polymorphic){
				if(Array.isArray(data)){
					var res = [];
					data.forEach(function(item, index){
						res.push(store.$.polyToJSON(item));
					});
					return res;
				}
				else{
					return store.$.polyToJSON(data);
				}
			}
		},
		polyToJSON : function(data){
			var type = data ? data._type : undefined;
			var polyMod = store.modelFor(type);
			var pK = polyMod ? polyMod._primaryKey : undefined;
			var poly = {};
			poly[pK] = data[pK];
			poly._type = data._type;
			return poly;
		},
		toJSON : function(modelName,obj,expose,type){
			var copyObj;
			store.$.recStack = {};
			if(Array.isArray(obj)){
				var arr = [];
				for(var i=0; i<obj.length; i++){
					copyObj = Lyte.deepCopyObject(obj[i]);
					this.removeSelfCircularReference(modelName, copyObj,expose,type);
					if(expose == "idb"){
						this.removeNotNeededKeys(modelName, copyObj);
					}
					arr.push(copyObj);
				}
				return arr;
			}
			else if(typeof obj === "object" || Lyte.isRecord(obj)){
				copyObj = Lyte.deepCopyObject(obj);
				this.removeSelfCircularReference(modelName,copyObj,expose,type);
				if(expose == "idb"){
					this.removeNotNeededKeys(modelName, copyObj);						
				}
			}
			store.$.recStack = {};
			return copyObj;
		},
		deepCopyObject : function( obj )  
		{
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
		},
		createCopy : function(data){
			if(Array.isArray(data)){
				if(data.save){
					var arr = [];
					for(var i=0; i<data.length; i++){
						var rec = Lyte.deepCopyObject(data[i]);
						arr.push(rec);
					}
					return arr;
				}
			}
			else if(data && ( Lyte.isRecord(data) || typeof data == "object")){
				return Lyte.deepCopyObject(data);
			}
			return data;
		},
		compareRecords  : function(a,b,pK,type){
			if(Lyte.isRecord(a) && Lyte.isRecord(b) && pK){
				var val1 = a.$.get(pK),val2 = b.$.get(pK);
				if(type && a._type && type !== a._type){
					return false;
				}
				return val1 === val2;
			}
			return false;
		},
		hasRecordInArray : function(array,record,pK,type){
			if(Lyte.isRecord(record) && pK){
				for(var i=0; i<array.length; i++){
					if(type && array[i]._type !== type){
						continue;
					}
					if(this.compareRecords(array[i], record, pK)){
						return true;
					}
				}
			}
			return false;
		},
		hasDuplicateRelation : function(toRelate,relation,pK,type){
			if(Array.isArray(relation)){
				return this.hasRecordInArray(relation, toRelate, pK, type);
			}
			else if(relation && Lyte.isRecord(relation)){
				return this.compareRecords(toRelate, relation, pK,type);
			}
			return false;
		},
		checkPresenceInArray : function(arr,value){
			return arr && arr.some(function(val,key){
				return val === value;
			});
		},
		checkAndAddToArray : function(arr,value){
			if(!this.checkPresenceInArray(arr,value)){
				arr.push(value);
			}else{
				return -1;
			}
		},
		deleteFromArray : function(arr,value){
			for(var i=0; i<arr.length; i++){
				if(arr[i] == value){
					arr.splice(i, 1);
				}
			}
		},
        generateRandomPk:function(model, opts, pK, pkType){
            var random = opts[pK] = Math.floor(Math.random()*100000 + 1);
            if(pkType == "string"){
                opts[pK] = random.toString();                    
            }
            while(this.isDuplicateRecord(model.data, opts, pK)){
                var random = opts[pK] = Math.floor(Math.random()*100000 + 1);
                if(pkType == "string"){
                    opts[pK] = random.toString();                                            
                }
            }            
        },
		newRecord:function(name,opts, withoutValidation){
			var model = store.modelFor(name);
			if(model == undefined){
				return new error1("id", {code : "ERR19", data : name, message : Lyte.errorCodes.ERR19, data:name});
			}
			if(opts == undefined){
				opts = {};
			}
			var fields = model.fieldList, record = {}, errorObj = new error1();
			var pK = model._primaryKey;
			if(!opts[pK]){
                var type = fields[pK].type;
                this.generateRandomPk(model, opts, pK, type)
			}
			else if(this.isDuplicateRecord(model.data, opts, pK)){
                store.$.setError(errorObj,pK,{code : "ERR16", data : record[pK], message : Lyte.errorCodes.ERR16})
			}
			for(var field in fields){
				var fieldKeys = fields[field];
				// if(fieldKeys.type == "object"){
				// 	record[field] = {};
				// }
				// else if(fieldKeys.type == "array"){
				// 	record[field] = [];
				// }
				if(fieldKeys.relType == "hasMany"){
					record[field] = [];
				}
				var val = opts[field];     
				if(fieldKeys.type != "relation"){
					if(val == undefined || val == "" || val == null){
						if(fieldKeys.hasOwnProperty("default")){
							record[field] = fieldKeys.default;
						}
						if(fieldKeys.mandatory && store.$.isEmpty(record[field]) && !withoutValidation){
							store.$.setError(errorObj,field,{code : "ERR02", message : Lyte.errorCodes.ERR02});
							//errorObj[field] = {code : "ERR02", message : Lyte.errorCodes.ERR02};
						}
						if(fieldKeys.pattern && !withoutValidation){
							if(!(new RegExp(fieldKeys.pattern).test(val))){
								store.$.setError(errorObj,field,{code : "ERR08", message : Lyte.errorCodes.ERR08,expected:fieldKeys.pattern});
							}
						}
					}
					else if(!withoutValidation){
						for(var property in fieldKeys){
							var resp = Lyte.checkProperty(property, val, field, fieldKeys[property], opts);
							if(resp != true){
								store.$.setError(errorObj,field,resp);
								break;
							}
						}
					}	
				}    
			}
			for(var opt_key in opts){
				record[opt_key] = opts[opt_key];
			}
			record = new Record(name, record);
			var relations = model.relations;
			for(var key in relations){
				var relation = relations[key];
				for(var i=0; i<relation.length; i++){
					if(record && record[relation[i].relKey]){
						var optsRelVal = opts[relation[i].relKey];
						record[relation[i].relKey] = undefined;
						var fieldKeys = relation[i], rel = {}, resp = this.getRelations(model, fieldKeys.relKey, store.modelFor(fieldKeys.relatedTo), rel);
						if(resp != true){
							store.$.setError(errorObj,fieldKeys.relKey,{code : resp, data : relation, message : Lyte.errorCodes[resp]});
							continue;
						}
						var bModel = store.modelFor(fieldKeys.relatedTo), bPkType = bModel.fieldList[bModel._primaryKey].type;
						if(!Array.isArray(optsRelVal)){
							optsRelVal = [optsRelVal];
						}
						else if(relation[i].relType == "belongsTo"){
							store.$.setError(errorObj,fieldKeys.relKey,{code : "ERR21", data : optsRelVal, message : Lyte.errorCodes.ERR21});
							continue;
						}
						errorObj[fieldKeys.relKey] = [];
						for(var j=0; j<optsRelVal.length; j++){
							var relRecord = undefined;
							if(optsRelVal[j] && Lyte.isRecord(optsRelVal[j])){
								relRecord = optsRelVal[j];
							}
							else if(optsRelVal[j] && typeof optsRelVal[j] == bPkType.toLowerCase()){
								relRecord = store.peekRecord(fieldKeys.relatedTo, optsRelVal[j]);
							}
							else if(optsRelVal[j] && typeof optsRelVal[j] == "object"){
								relRecord = this.newRecord(fieldKeys.relatedTo, optsRelVal[j]);
							}
							if(relRecord && relRecord.$ && relRecord.$.isError){
								store.$.setError(errorObj, fieldKeys.relKey,{code : "ERR15", data : optsRelVal[j], message : Lyte.errorCodes.ERR15, error : Object.assign({}, relRecord)});
								continue;
							}
							if(relRecord && relRecord.$ && !relRecord.$.isError){
								resp = this.establishLink(rel.forward, rel.backward, record, relRecord);
								if(resp != true){
                                    store.$.setError(errorObj,fieldKeys.relKey,{code : resp, data : optsRelVal[j], message : Lyte.errorCodes[resp]});
								}							
							}							
						}
						if(errorObj[fieldKeys.relKey].length == 0){
							delete errorObj[fieldKeys.relKey];
						}
						if(relation[i].relType == "hasMany"){
							var fieldkey = relation[i].relKey;
							if(record[fieldkey] == undefined){
								record[fieldkey] = [];
							}
							if(!record[fieldkey].add){
								if(relation[i].opts && relation[i].opts.polymorphic){
									Object.defineProperty(record[fieldkey], "polymorphic", {
										enumerable: false,
										value: true
									});
								}
								store.$.defineArrayUtils(record[fieldkey]);
								store.$.defineUtilsFor(record[fieldkey], store.modelFor(relation[i].relatedTo),record,fieldkey);
								store.$.definePolymorphicUtils(record[fieldkey]);
							}
						}
					}
				}
			}
			if(errorObj && errorObj.$ && Object.keys(errorObj.$.error).length > 0){
				return errorObj;
			}
			record.$.isNew = true;
			var toRel = store.$.toRelate[model._name], pkVal = record[pK];
			if(toRel && toRel.hasOwnProperty(pkVal)){
				store.$.establishToRelated(record, toRel[pkVal]);
				delete toRel[pkVal];
			}
			if(model.didLoad){
				var callBack = model.didLoad;
				for(var i=0;i<callBack.length;i++){
					callBack[i].apply(record);				
				}
			}
			this.handleArrayOperations(model.data,"push",record);
			this.checkAndAddToArray(model.dirty, record[model._primaryKey]);
			model.emit("add",[record]);
            store.emit("add",[model._name,record]);
			if(withoutValidation){
				record.$.validatedOnCreate = false;
			}
			return record;
		},
		toInsertData: function(modelName, payLoad, saveParent){
			var model = store.modelFor(modelName);
			var data = this.insertIntoStore(model, payLoad[modelName],saveParent,true);
			delete model.rel;
			return data;
		},
		insertIntoStore:function(model,data,saveParent,stack){
			var ret;
			if(Array.isArray(data)){
				ret = [];
				for(var i=0; i<data.length; i++){
					ret[i] = this.insertIntoStore(model, data[i], saveParent, stack);
                    if(ret[i] && ret[i].$ && ret[i].$.isError){
                        ret.$ = ret.$ || Object.defineProperty(ret,"$",{
                            enumerable:false,
                            value:{}
                        });
                        ret.$.isError = true;
                    }
				}
			}
			else if(data && Object.keys(data).length){
				var currentModel = model;
				if(data._type && model.extendedBy){
					currentModel = (model.extendedBy[data._type]) ? store.modelFor(data._type) : undefined;
				}
				if(Lyte.isRecord(data))
				{
					return undefined;
				}
				if(!this.isDuplicateRecord(currentModel.data, data, currentModel._primaryKey)){
					var rec = new Record(currentModel._name, data);
					var pK = currentModel._primaryKey;
					var toRel = store.$.toRelate[currentModel._name], pkVal = rec[pK];
					if(toRel && toRel.hasOwnProperty(pkVal)){
						store.$.establishToRelated(rec, toRel[pkVal]);
						delete toRel[pkVal];
					}
					if(saveParent){
						store.$.saveParent = rec;
					}
					var recStack = store.$.recStack =  store.$.recStack || {};
					var rObj = recStack[model._name] = recStack[model._name] || {};
					rObj[rec[model._primaryKey]] = rec;
					ret = this.validateAndPush(currentModel,rec);
				}
				else{
					ret = this.validateAndMerge(currentModel,data);
				}
				if(saveParent){
					store.$.saveParent = undefined;
				}
				if(stack){
					store.$.recStack = {};
				}
			}
			return ret;
		},
		removeFromStore:function(model,keys,fromStore){
			var data = model.data;
			if(data.length == 0){
				return;
			}
			if(!Array.isArray(keys)){
				keys = [keys];
			}
			var pKey = model._primaryKey;
			for(var i=0; i<keys.length; i++){
				var index = this.getIndex(data, pKey, keys[i]);
				if(index == -1){
					continue;
				}
				if(Object.keys(model.relations).length){
					this.toDemolishRelation(model, index);
				}
				var deleted;
				deleted = this.handleArrayOperations(data,"removeAt",undefined,index,1)
				if(deleted && !fromStore){
					deleted[0].$.isDeleted = true;
					if(deleted[0].$.isNew || deleted[0].$.isModified){
						store.$.deleteFromArray(model.dirty, deleted[0][pKey]);
					}
					model._deleted.push(deleted[0]);
					model.emit("remove", [deleted[0]]);
                    store.emit("remove", [model._name,deleted[0]])
				}
			}
		},
		getIndex:function(data,pKey,key,type){
			for(var i=0;data && i<data.length;i++){
				if(type && data[i]._type !== type){
					continue;
				}
				if(data[i][pKey] == key){
					return i;
				}
			}
			return -1;
		},
		isDuplicateRecord:function(model_data,data,pKey){
			if(model_data.length){
				return model_data.some(function(record){
					if(data[pKey]== record[pKey]){
						return true;
					}
				});
			}
			return false;
		},
		validateAndPush:function(model,data){
			if(!model.rel){
				model.rel = {};
			}
			var pK = model._primaryKey;
            if(!data.hasOwnProperty(pK)){
                return new error1(pK, {code : "ERR23", data : data, message : Lyte.errorCodes.ERR23});
            }
			data = this.validateJSON(model, data);
			if(!data.$.isError){
				if(model.didLoad){
					var callBack = model.didLoad;
					for(var i=0;i<callBack.length;i++){
						callBack[i].apply(data);				
					}
				}
				if(this.isDuplicateRecord(model.data, data, pK)){
					this.mergeData(store.peekRecord(model._name,data[pK]),data);
				}
				else{
					this.handleArrayOperations(model.data,"push",data);
                    model.emit("add",[data]);
                    store.emit("add",[model._name,data])
                }
			}
			return data;
		},
		validateAndMerge:function(model,data){
            if(!model.rel){
                model.rel  = {};
            }
            var pKey = model._primaryKey;
            var record = store.peekRecord(model._name, data[pKey]);
            if(!record || !Lyte.isRecord(record)){
                Lyte.error("LD04",data);
                return false;
            }
            var toValidate = this.mergeData(record, data);
            record = this.validateJSON(model, record, Object.keys(data),toValidate);
			if(!record.$.isError && model.didLoad){
                var callBack = model.didLoad;
                for(var i=0;i<callBack.length;i++){
                    callBack[i].apply(record);				
                }
                //model.didLoad.apply(record);
            }
            return record;
		},
		mergeData:function(record,data){
            if(!record || !data){
                return;
            }
            var model = record.$.model, field, pK = model._primaryKey, toValidate = {}, toPartialAdd = {};
            for(var key in data){
                field = model.fieldList[key];
                if(field){
                    if(field.type != "relation"){
                        if(typeof LyteComponent != "undefined"){
                            LyteComponent.set(record,key,data[key],true);                                            
                        }
                        else{
                            record[key] = data[key];
                        }
                        toValidate[key] = field;
                    }
                    else if(field && field.type == "relation"){
                        switch(this.compareRelations(record,data,key,field)){
                            case 0:{
                                var rel = {};
                                store.$.getRelations(record.$.model, key, store.modelFor(record.$.model.fieldList[key].relatedTo), rel);
                                this.toDemolishLink(record.$.model, record, rel.forward);   
                                if(typeof LyteComponent != "undefined"){
                                    LyteComponent.set(record,key,data[key],true);                                    
                                }
                                else{
                                    record[key] = data[key];                                                                
                                }
                                toValidate[key] = field;
                                break;
                            }
                            case 1:{
                                break;
                            }
                            case 2:{
                                this.mergeData(record[key],data[key]);
                                break;
                            }
                            case 3:{
                                toValidate[key] = field;
                                toPartialAdd[key] = data[key];
                                break;
                            }
                            //case 4 to handle
                            default : break;    
                        }
                    }
                }
                else{
                    if(typeof LyteComponent != "undefined"){
                        LyteComponent.set(record,key,data[key],true);                                            
                    }
                    else{
                        record[key] = data[key];
                    }
                }
            }
            return {toValidate:toValidate,toPartialAdd:toPartialAdd};
		},
        compareRelations:function(record,data,key,field){
            //return 0 - not same, 1 -same, 2 - merge, 3 - partial add, 4 - delete and partial add
            var pK = store.modelFor(field.relatedTo)._primaryKey,result = [];
            if(field.relType == "belongsTo"){
                return this.compareRecordWithObj(record[key],data[key],pK);   
            }else{
                var len = data[key].length,old=0,status=1;
                for(var i=0;i<len;i++){
                    var obj = data[key][i];
                    var ind = this.getIndex(record[key],pK,(typeof obj == "object") ? obj[pK] : obj);
                    if(ind == -1){
                        status = 0;
                        continue;
                    }
                    var res = this.compareRecordWithObj(record[key][ind],obj,pK);
                    if(res == 1 || res == 2){
                     old++;   
                    }
                    if(res == 2){
                        this.mergeData(record[key][ind],obj);
                    }
                    else if(res == 0){
                    	status = 0;
                    }
                }
                if(status == 0){
                    if(old > 0){
                        if(old == record[key].length){
                            return 3;
                        }
                        else{
                            return 0;
                            //todo return 4
                        }                        
                    }
                    else{
                        return 0;
                    }
                }
                else if(old < record[key].length){
                	return 0;
                }
                return 1;
            }
        },
        compareRecordWithObj:function(rec,obj,pK){
            if(!rec){
                return 0;
            }
            var recModel = rec.$.model;
            var recFields = recModel.fieldList;
            if( !Lyte.isRecord(rec) ){
                return 0;
            }
            var field = recModel.fieldList[pK];
            if(typeof obj == field.type){
               if(rec[pK] == obj){
                return 1;
               }
               else{
                   return 0;
               }
            }  
            else if(typeof obj == "object"){
              if(rec[pK] != obj[pK]){
                return 0;
              }
              else{
                  for(var data_key in obj){
                  var field = recFields[data_key];
                  if(field){
                        if(field.type == "relation"){
                            var res = this.compareRelations(rec,obj,data_key,field);
                            if(res == 1){
                                continue;
                            }
							return 0;
                        }
                        else if(rec[data_key] != obj[data_key]){
                            return 2;
                        }                    
                    }
                }
                return 1;
              }
            } 
            return 0;
        },
		validateJSON:function(model,data,keys,toValidate){
            var validate = (toValidate) ? toValidate.toValidate : undefined;
            var fields = (validate && Object.keys(validate).length) ? validate : model.fieldList;
			var extended = model.extend ? true : false;
			for(var key in data){
				if(keys && keys.indexOf(key) == -1){
					continue;
				}
				var fld = fields[key];
				if(fld){
					if(fld.type == "relation" && data[key]){
						var partialAdd = (toValidate && toValidate.toPartialAdd) ? toValidate.toPartialAdd[key] : undefined;
						var resp = this.handleRelation(key, model, fld, data, partialAdd);
						if(resp != true){
							return new error1(key, {code : resp, data : data, message : Lyte.errorCodes[resp]});
						}
						if(fld.relType == "hasMany" && !data[key].add){
							store.$.defineArrayUtils(data[key]);
							store.$.definePolymorphicUtils(data[key]);
							store.$.defineUtilsFor(data[key],model,data,key);
						}
					}
					else if(fld.type){
						var fieldKeys = fld;
						if(data[key] == undefined && fieldKeys.default){
							data[key] = fieldKeys.default;
						}
						if(data[key] && Lyte.Transform.hasOwnProperty(fieldKeys.type) && Lyte.Transform[fieldKeys.type].hasOwnProperty("deserialize")){
							data[key] = Lyte.Transform[fieldKeys.type].deserialize(data[key]);
						}
					}
				}
				else{
					if(extended){
						var extMod = store.modelFor(model.extend);
						var extKey = extMod.fieldList[key];
						if(extKey && extKey.type == "relation"){
							var partialAdd = (toValidate && toValidate.toPartialAdd) ? toValidate.toPartialAdd[key] : undefined;
							var resp = this.handleRelation(key, extMod, extKey, data, partialAdd);
							if(resp != true){
								return new error1(key, {code : resp, data : data, message : Lyte.errorCodes[resp]});
							}
							if(extKey.relType == "hasMany" && !data[key].add){
								store.$.defineArrayUtils(data[key]);
								store.$.definePolymorphicUtils(data[key]);
								store.$.defineUtilsFor(data[key],extMod,data,key);
							}
						}
					}
				}
			}
			return data;
		},
		handleRelation:function(key,model,field,data,partialAdd){
			var rel = {};
			if (!model.rel.hasOwnProperty(key)){
				var relResp = this.getRelations(model,key,store.modelFor(field.relatedTo),rel);	
				if(relResp !== true){
					return relResp;
				}
				model.rel[key] = rel;
			}
			else{
				rel = model.rel[key];
			}
			return this.solveRelation(rel, model, store.modelFor(field.relatedTo), key, data, partialAdd);
		},
		getRelations:function(fModel,key,bModel,rel){
			if(bModel == undefined){
				Lyte.error("LD05",fModel.fieldList[key].relatedTo,key,fModel._name)
				return "ERR11";
			}
			rel.forward = fModel.fieldList[key];
			rel.backward = this.getBackwardRel(fModel,rel.forward,bModel);
			if(rel.backward === undefined){
				Lyte.error("LD06",bModel._name,key,fModel._name);
				return "ERR25"
			}
			return true;
		},
		getBackwardRel:function(fModel,rel,bModel){
			var inverse, polymorphic;
			if(rel.opts){
				inverse = rel.opts.inverse;
				polymorphic = rel.opts.polymorphic;
				if(inverse === null){
					return null;
				}
				if(polymorphic){
					var extendedModels = bModel.extendedBy;
					if(extendedModels){
						for(var key in extendedModels){
                            var extModel = store.modelFor(key);
							if(extModel.relations[fModel._name]){
								bModel = extModel;
								break;
							}
						}
					}
				}
			}
			var relatedTo;
			if(inverse && inverse != ""){
				relatedTo = inverse;
			}
			else{
				var bRel = bModel.relations[fModel._name];
                var extFmodel = store.modelFor(fModel.extend);
				if(!bRel && extFmodel && bModel.relations[extFmodel._name] && bModel.relations[extFmodel._name].opts && bModel.relations[extFmodel._name].opts.polymorphic){
					bRel = bModel.relations[extFmodel._name];
				}
				relatedTo = (bRel && bRel.length == 1 )?bRel[0].relKey:undefined;
			}
			if(!relatedTo){
				var bRels = bModel.relations[fModel._name];
                var extFmodel_1 = store.modelFor(fModel.extend);
				if(!bRels && extFmodel_1 && bModel.relations[extFmodel_1._name] && bModel.relations[extFmodel_1._name].opts && bModel.relations[extFmodel_1._name].opts.polymorphic){
					bRels = bModel.relations[extFmodel_1._name];
				}
				if(bRels){
					for(var i=0;i<bRels.length;i++){
						if(bRels[i] && bRels[i].opts && bRels[i].opts.inverse === rel.relKey){
							relatedTo = bRels[i].relKey;
							break;
						}
					}
				}
			}
			return relatedTo?bModel.fieldList[relatedTo]:undefined;			
		},
		solveRelation:function(rel,fModel,bModel,key,data,partialAdd){
			var backward = rel.backward, forward = rel.forward;
			if(!backward){
				if(forward.relatedTo === fModel._name){
					backward = forward;
				}
				if(backward === undefined){
					return "ERR12";
				}
			}
            if(partialAdd){
                val = partialAdd;
            }
            else{
                if(data[key] && (data[key].add || Lyte.isRecord(data[key]) ) ){
                    return true;
                }
                if(!Array.isArray(data[key])){
                    data[key] = [data[key]];
                }
                else if(forward.relType == "belongsTo"){
                    return "ERR21";
                }
                var val = data[key].splice(0, data[key].length);
                if(forward.relType == "belongsTo"){
                    data[key] = undefined;				
                }                
            }
			for(var i=0; i<val.length; i++){
				var relatedRecord;
				if(typeof val[i] == bModel.fieldList[bModel._primaryKey].type){
					relatedRecord = store.peekRecord(bModel._name, val[i]) ||  ((store.$.recStack && store.$.recStack[bModel._name]) ? store.$.recStack[bModel._name][val[i]] : undefined );					
				}
				else if(typeof val[i] == "object" && !Lyte.isRecord(val[i])){
					relatedRecord = this.insertIntoStore(bModel, val[i]);					
				}
                if(relatedRecord && relatedRecord.$ &&relatedRecord.$.isError){
                    data.$.isError = true;
                    var errObj = {code:"ERR24", message: Lyte.errorCodes.ERR24, data: data, error: relatedRecord.$.error};
                    if(typeof LyteComponent != "undefined"){
                        LyteComponent.set(data.$.error,key,errObj);
                    }else{
                        data.$.error[key] = errObj;                        
                    }
                }
				else if(relatedRecord){
					if(!this.hasDuplicateRelation(relatedRecord, data[key], bModel._primaryKey, val[i]._type)){
						this.establishLink(forward, backward, data, relatedRecord);							
					}
				}
				else{
					this.addToRelate(fModel._name, data, rel, val[i]);
				}
			}
			return true;
		},
		establishLink:function(forward,backward,data,relatedRecord, index){
			if(!relatedRecord){
				return "ERR13";
			}
			if( !this.checkForCorrectRelation(forward, relatedRecord) ){
				return "ERR14";
			}
			var fRelKey = forward.relKey, type = relatedRecord._type;
			if(forward.relType == "belongsTo"){
                if(data[fRelKey] !== relatedRecord){
                    if(typeof LyteComponent != "undefined"){
                            LyteComponent.set(data, fRelKey, relatedRecord, true);
                    }
                    else{
                        data[fRelKey] = relatedRecord;
					}
                }
			}
			else if(forward.relType === "hasMany"){
				if(!data[fRelKey]){
                    if(typeof LyteComponent != "undefined"){
                        LyteComponent.set(data,fRelKey,[],true);
                    }
                    else{
                        data[fRelKey] = [];
                    }
				}
				if(!data[fRelKey].model){
					var relModel = relatedRecord.$.model;
					if(type){
						Object.defineProperty(data[fRelKey], "polymorphic", {
							enumerable: false,
							value: true
						});
						relModel = store.modelFor(relModel.extend);
					}
                    store.$.establishObserverBindings(data,data.$.model._properties);
					store.$.defineArrayUtils(data[fRelKey]);
					store.$.definePolymorphicUtils(data[fRelKey]);
					store.$.defineUtilsFor(data[fRelKey],relModel,data,fRelKey);
				}
				if( !this.hasDuplicateRelation(relatedRecord, data[fRelKey], (forward?store.modelFor(forward.relatedTo)._primaryKey : undefined),type) ){
					if(index != undefined){
						if(typeof LyteComponent != "undefined"){
 							LyteComponent.arrayFunctions(data[fRelKey],"insertAt",index,relatedRecord);						
						}
						else{
							data[fRelKey].splice(index, 0, relatedRecord);
						}
					}
					else{
						this.handleArrayOperations(data[fRelKey],"push",relatedRecord);
					}
				}
			}
			if(forward == backward){
				return true;
			}
			if(backward === null){
				if(relatedRecord.hasOwnProperty(bRelKey)){
					delete relatedRecord[bRelKey];
				}
				return true;
			}
			var bRelKey = backward.relKey, relRecMod = relatedRecord.$.model;
			if( !this.checkForCorrectRelation(backward, data) ){
				return "ERR14";
			}
			if(backward.relType == "belongsTo"){
				if(relatedRecord[bRelKey] != undefined  && relatedRecord[backward.relKey] !== data){
					this.toDemolishLink(relRecMod, relatedRecord, backward);
				}
                if(relatedRecord[bRelKey] !== data){
                    if(typeof LyteComponent != "undefined"){
                        LyteComponent.set(relatedRecord, bRelKey, data, true);
                    }
                    else{
                        relatedRecord[bRelKey] = data;				
					}
                }
			}
			else if(backward.relType === "hasMany"){
				if(!relatedRecord[bRelKey]){
                    if(typeof LyteComponent != "undefined"){
                        LyteComponent.set(relatedRecord,bRelKey,[],true);
                    }
                    else{
					   relatedRecord[bRelKey] = [];                        
                    }
				}
				if(!relatedRecord[bRelKey].model){
					store.$.defineArrayUtils(relatedRecord[bRelKey]);
					store.$.definePolymorphicUtils(relatedRecord[bRelKey]);
					store.$.defineUtilsFor(relatedRecord[bRelKey],data.$.model,relatedRecord,bRelKey);
				}
				if( !this.hasDuplicateRelation(data, relatedRecord[bRelKey], (backward ? store.modelFor(backward.relatedTo)._primaryKey : undefined), type) ){
					this.handleArrayOperations(relatedRecord[bRelKey],"push",data);
				}
			}
			return true;
		},
		toDemolishRelation:function(model,index){
			var record = model.data[index], relations = model.relations;
			for(var key in relations){
				var rel = relations[key];
				for(var i=0; i<rel.length; i++){
					var relation = rel[i];
					if(!record[relation.relKey]){
						continue;
					}
					this.toDemolishLink(model, record, relation);
				}
			}
		},
		toDemolishLink:function(model,record,relation){
			var records = record[relation.relKey], priKey = model._primaryKey, relatedModel = store.modelFor(relation.relatedTo), relPriKey = relatedModel._primaryKey, relatedModelName = relation.relatedTo, bRelation = this.getBackwardRel(model, relation, relatedModel);
			if(bRelation === null){
				return;
			}
			if(Array.isArray(records)){
				for(var i=0; i<records.length; i++){
					this.demolishLink(record, priKey, records[i], bRelation.relKey);
				}
			}
			else if(Lyte.isRecord(records)){
				this.demolishLink(record, priKey, records, bRelation.relKey);
			}
		},
		demolishLink : function(record, priKey, relatedRecord, bRelKey){
			var links = relatedRecord[bRelKey];
			var relMod = relatedRecord.$.model;
			if(Array.isArray(links)){
                var ind = this.getIndex(links, priKey, record[priKey],record._type);
                if(ind != -1){
					this.handleArrayOperations(relatedRecord[bRelKey],"removeAt",undefined,ind,1);
				}
			}
			else if(links && (typeof links == "object" || Lyte.isRecord(links)) ){
				delete relatedRecord[bRelKey];
			}
		},
		rollBackRecordsArray : function(oldVal, record, model, field){
			var rel = {}, pK = model._primaryKey, relPK = store.modelFor(field.relatedTo)._primaryKey;
			store.$.getRelations(model, field.relKey, store.modelFor(field.relatedTo), rel);
			for(var i=oldVal.length-1; i>=0; i--){
				var records = oldVal[i].records;
				if(oldVal[i]._type == "added"){
					for(var j=0; j<records.length; j++){
						var relatedRecord = records[j];
						this.demolishLink(relatedRecord, relPK, record, rel.forward.relKey);
						this.demolishLink(record, pK, relatedRecord, rel.backward.relKey);
					}
				}
				else if(oldVal[i]._type == "removed"){
					for(var j=records.length-1; j>=0; j--){
						var relatedRecord = records[j];
						this.establishLink(rel.forward, rel.backward, record, relatedRecord, oldVal[i]._indices[j]);
					}
				}
				else if(oldVal[i]._type == "changed"){
					var currentRecords = record[field.relKey];
					if(!Array.isArray(currentRecords)){
						currentRecords = [currentRecords];
					}
					while(currentRecords.length){
						var relatedRecord = currentRecords[0];
						this.demolishLink(relatedRecord, relPK, record, rel.forward.relKey);
						this.demolishLink(record, pK, relatedRecord, rel.backward.relKey);
						if(rel.forward.relType == "belongsTo"){
							break;
						}
					}
					if(!Array.isArray(records)){
						records = [records];
					}
					for(var j=0; j<records.length; j++){
						var relatedRecord = records[j];
						if(typeof relatedRecord == "string"){
							relatedRecord = store.peekRecord(rel.forward.relatedTo,relatedRecord);
						}
						this.establishLink(rel.forward, rel.backward, record, relatedRecord);
					}						
				}
			}
		},
		sortBy : function(field, order){
			var fieldArr = store.$.mapBy.call(this, field);
            var model = this.model;
            var fie = model.fieldList[field];
            if(fie && fie.type == "string"){
                fieldArr.sort();
                if(order == "desc"){
                    fieldArr.reverse();
                }                
            }
            else{
                fieldArr.sort(function(a,b){return a-b;});
                if(order == "desc"){
                    fieldArr.sort(function(a,b){return b-a;});
                }
            }
			var oldArr = this.slice(0), newArr = [];
			for(var i=0; i<fieldArr.length; i++){
				if(fieldArr[i] == undefined){
					continue;
				}
				var index = store.$.getIndex(oldArr, field, fieldArr[i]);
				newArr.push(oldArr[index]);
				oldArr.splice(index, 1);
			}
			if(oldArr.length > 0){
				if(order == "desc"){
					newArr = newArr.concat(oldArr);
				}
				else{
					newArr = oldArr.concat(newArr);
				}				
			}
			store.$.defineArrayUtils(newArr);
			store.$.defineUtilsFor(newArr,this.model);
			return newArr;
		},
		mapBy : function(field){
			return this.map(function(value){
				return value.$.get(field);
			});
		},
		revertToOldVal : function(record, attr, oldVal, rel){
			if(oldVal == undefined || oldVal.length == 0){
				return;
			}
			else{
				if(!Array.isArray(oldVal)){
					oldVal = [oldVal];
				}
				for(var i =0; i<oldVal.length; i++){
					this.establishLink(rel.forward, rel.backward, record, oldVal[i]);
				}
			}
		},
		rollBackDelete : function(model, index){
			var deleted = model._deleted, rec = deleted.splice(index, 1)[0], pK = model._primaryKey;
			rec.$.isDeleted = false;
			this.handleArrayOperations(model.data,"push",rec);
			var relArr = model.relations;
			if(relArr){
				for(var key in relArr){
					var rel = relArr[key] || [];
					var self = this;
					rel.forEach(function(item, index){
						var key = item.relKey, bRel, bMod;
						if(rec.hasOwnProperty(key)){
							bMod = store.modelFor(item.relatedTo);
							bRel = self.getBackwardRel(model,item,bMod);
						}
						self.establishLink(item,bRel,rec,rec[key]);
					});
				}
			}
			if(rec.$.isNew || rec.$.isModified){
				this.checkAndAddToArray(model.dirty, rec[model._primaryKey]);
			}
			store.$.clearRecordError(rec.$, pK, "ERR17");
			model.emit("add", [rec]);
            store.emit("add", [model._name,rec]);
		},
		rollBackNew : function(model, record, pK){
			var index = this.getIndex(model.data, pK, record[pK]);
			this.handleArrayOperations(model.data,"removeAt",undefined,index,1);
			record.$.isNew = false;
			model.emit("delete", [record]);
            store.emit("delete", [model._name,record]);
			this.deleteFromArray(model.dirty, record[pK]);
		},
		emit : function(type, record, attr, err){
			record.$.emit(type, [record,attr,err]);
			record.$.model.emit(type, [record, attr, err]);
            store.emit(type, [record.$.model._name, record, attr, err]);
		},
		hasRecordsArrayChanged : function(record, attr){
			var arr = record.$.getInitialValues(attr), changed = true, pK = record.$.model._primaryKey;
			if(arr && arr.length == record[attr].length){
				changed = false;
				for(var i=0; i<arr.length; i++){
					if(!this.compareRecords(arr[i], record[attr][i], pK)){
						return true;
					}
				}
			}
			return changed;
		},
		setRecordError : function($record, field, code, value){
			$record.isError = true;
            var errObj = code;
			if(typeof errObj == "object"){
				if(typeof LyteComponent != "undefined"){
                    LyteComponent.set($record.error,field,errObj);
                }else{
                    $record.error[field] = errObj;                    
                }
			}
			else{
				errObj = {code : code, message : Lyte.errorCodes[code]};
                if(typeof LyteComponent != "undefined"){
                    LyteComponent.set($record.error,field,errObj);
                }else{
				    $record.error[field] = errObj;                    
                }
				if(value){
					if(typeof LyteComponent != "undefined"){
                        LyteComponent.set($record.error[field],"value",value);
                    }else{
                        $record.error[field].value = value;                        
                    }
				}				
			}
            store.$.emit("error",$record.record,field,errObj);
		},
		clearRecordError : function($record, field, code){
			if(code){
				if($record.error.code == code){
					if(typeof LyteComponent != "undefined"){
                        Lyte.objectUtils($record.error,"delete",field);
                    }
                    else{
                        delete $record.error[field];                        
                    }
				}
			}
			else if(field){
                if(typeof LyteComponent != "undefined"){
                    Lyte.objectUtils($record.error,"delete",field);
                }
                else{
                    delete $record.error[field];                        
                }
			}
			else{
                if(typeof LyteComponent != "undefined"){
                    for(var err in $record.error){
                        Lyte.objectUtils($record.error,"delete",err);
                    }
                }
                else{
                    $record.error = {};
                }   
			}
			if(Object.keys($record.error).length == 0){
				$record.isError = false;
			}
		},
        cacheQuery: function(modelName, queryParams, data){
			store.model.cachedQueries = store.model.cachedQueries || {};
			store.model.cachedQueries[modelName] = store.model.cachedQueries[modelName] || [];
			store.model.cachedQueries[modelName].push({queryParams : queryParams, data : data});
		},
		cacheRecordQuery: function(modelName, key, queryParams, data){
			store.model.cachedRecordQueries = store.model.cachedRecordQueries || {};
			store.model.cachedRecordQueries[modelName] = store.model.cachedRecordQueries[modelName] || {};
			store.model.cachedRecordQueries[modelName][key] = store.model.cachedRecordQueries[modelName][key] || [];
			store.model.cachedRecordQueries[modelName][key].push({queryParams : queryParams, data : data});
		},
		handleArrayOperations:function(data,type,obj,pos,len){
			if(typeof Lyte.arrayUtils != "undefined"){
                switch(type){
                    case "push":
                        Lyte.arrayUtils(data, type, obj);
                        break;
                    case "removeAt":
                        return Lyte.arrayUtils(data,type,pos,len);
                        break;
                    default:
                        Lyte.error("LD07", type);
                        break;
                }
			}
			else{
				switch(type){
					case "push":
						data.push(obj);
						break;
					case "removeAt":
						return data.splice(pos,len);
						break;
                    default:
                        Lyte.error("LD07", type);
                        break;
				}
			}
		},
		defineArrayUtils:function(obj){
			Object.defineProperties(obj, {
				filterBy : {
					enumerable : false,
					value : store.$.filterBy
				},
				sortBy : {
					enumerable : false,
					value : store.$.sortBy
				},
				mapBy : {
					enumerable : false,
					value : store.$.mapBy
				}
			});
		},
		definePolymorphicUtils:function(obj){
			Object.defineProperties(obj,{
				add : {
					enumerable : false,
					value : store.$.add
				},
				remove : {
					enumerable : false,
					value : store.$.remove
				}
			})
		},
		defineUtilsFor:function(obj,model,record,key){
			if(model){
				Object.defineProperty(obj,"model",{
					enumerable:false,
					value:model
				});
			}
			if(record){
				Object.defineProperty(obj,"record",{
					enumerable:false,
					writable:true,
					value:record
				});
			}
			if(key){
				Object.defineProperty(obj,"key",{
					enumerable:false,
					value:key
				});
			}
		}
	}
}

function Adapter(opts,parent,name){
	var self = this;
	if(parent && parent.mixins && parent.mixins.length){
		parent.mixins.forEach(function(item,index){
			var mixin = Lyte.registeredMixins[item];
			for(var key in mixin){
				self[key] = mixin[key];
			}
		});
	}
	for(key in opts){
		this[key] = opts[key];
	}
	this.__extendedBy = [];
    if(store.adapter.__toAddSuper && store.adapter.__toAddSuper.hasOwnProperty(name)){
        var addSuper = store.adapter.__toAddSuper[name];
        for(var i=0; i<addSuper.length; i++){
            var child = store.adapter[addSuper[i]];
            if(child.is == "adapter"){
				child.$super = this;
				this.__extendedBy.push(addSuper[i]);
            }
        }
        delete store.adapter.__toAddSuper[name];
    }
	Object.defineProperty(this,"extends", {
		enumerable: false,
		value: function value(name){
			store.$.extendCallback.call(this,store,"adapter",name);
		}
	});
	Object.defineProperty(this,"is", {
		value: "adapter",
		enumerable: false
	});
    Object.defineProperty(this,"__name", {
		value: name,
		enumerable: false
	});
}
store.adapter = {
	$: {
        getFromAdapter:function(adapter,key){
			var result = adapter ? adapter[key] : undefined;
			while(result == undefined){
				if(adapter && adapter.$super){
					adapter = adapter.$super;
					result = adapter ? adapter[key] : undefined;
				}
				else{
					adapter = store.adapter.application;
					if(adapter && adapter.hasOwnProperty(key)){
						result = adapter[key];
					}
					else{
						switch(key){
							case "host":{
								result = window.location.origin ? window.location.origin : window.location.protocol+"//"+window.location.host;
								break;
							}
							case "namespace": {
								result = "";
								break;
							}
							case "actionNamespace":{
								result = "action";
								break;
							}
							case "batchNamespace":{
								result = "batch";
								break;
							}
							default:
								result = undefined;	
						}
						break;
					}
				}
			}
			return result;
		},
		buildURL : function(type,method,modelName,key, snapshot, queryParams,actionName,customData){
			var adapter = store.adapter[modelName], host = this.getFromAdapter(adapter,"host"), url = "";
			if(!store.$.makeBatch){
				if(host != undefined){
					url += host;
					if(host[host.length-1] != "/"){
						url+="/";					
					}
				}
			}
			var namespace = this.getFromAdapter(adapter,"namespace");
			if(namespace != "" && namespace[namespace.length-1] != "/"){
				url+=namespace+"/";
			}
			else{
				url+=namespace;
			}
			if(type != "batch"){
				url+=modelName;
				if(key){
					url+="/"+key;
				}	
			}
			if(type == "action"){
				url+="/"+this.getFromAdapter(adapter,"actionNamespace");
				var actions = store.modelFor(modelName).actions, action = actions[actionName].endPoint?actions[actionName].endPoint:actionName;
				url+="/"+action;
			} else if(type == "batch"){
				url+=this.getFromAdapter(store.adapter.application,"batchNamespace");
			}
            if(!queryParams){
				queryParams = {};
			}
			var scope =  this.getCallBackScope(modelName, "headersForRequest"), args, ret = {method : (method)? method : ""};
			if(scope){
				args = this.constructArgs(type, queryParams, customData, actionName, key);
				ret.headers = this.callBack(scope, args);
			}
			scope = this.getCallBackScope(modelName, "buildURL");
			if(scope){
				args = this.constructArgs(modelName, type, queryParams, snapshot, url,actionName,customData, key);
				url = this.callBack(scope, args);
			}
			scope = this.getCallBackScope(modelName, "methodForRequest");
			if(scope){
				args = this.constructArgs(method, type, queryParams, customData, actionName, key);
				ret.method = this.callBack(scope, args);
			}
            if(!store.$.makeBatch && Object.keys(queryParams).length){
				url+="?";
				var index = 0;
				for(var key in queryParams){
					if(index != 0){
						url+="&";
					}
					url+=key+"="+encodeURIComponent(queryParams[key]);
					index++;
				}
			}
            if(adapter && adapter.withCredentials == true){
                ret.withCredentials = true;
            }
			ret.url = url;
			ret.qP = queryParams;
			return ret;
		},
		getCallBackScope:function(modelName,type){
			var adapter = store.adapter[modelName], scope, application = store.adapter.application;
			while(scope == undefined){
				if(adapter && adapter[type] && typeof adapter[type] == "function"){
					return {scope : adapter, func : adapter[type]};
				}
				else if(adapter && adapter.$super){
					adapter = adapter.$super;
				}
				else if(application && application[type] && typeof application[type] == "function"){
					return {scope : application, func : application[type]};
				}
				else{
					return undefined;
				}
			}
		},
		callBack:function(callback,args){
			return callbackValue = callback.func.apply(callback.scope, args);
 		},
 		constructArgs:function(){
 			var arg = arguments, arr = [];
 			for(var i=0; i<arg.length; i++){
 				arr.push(arg[i]);
 			}
 			return arr;
 		},
		get : function(type, modelName, key, queryParams, cacheQuery, customData){
			var mdl = store.modelFor(modelName), makeBatch = store.$.makeBatch;
			if(mdl){
				if(type == "findAll" && queryParams && store.model.cachedQueries && store.model.cachedQueries[modelName]){
					var cachedQueries = store.model.cachedQueries[modelName], sendData;
					for(var i=0; i<cachedQueries.length; i++){
						var params = cachedQueries[i].queryParams;
						if(this.compareObjects(params, queryParams, true)){
							sendData = [cachedQueries[i].data, "cache"];
							break;
						}
					}
					if(sendData){
						return new Promise(function(resolve, reject){
							if(makeBatch){
								store.$.addToCachedBatch(sendData);
							}
							resolve(sendData);
						});
					}
				}
				else if(type == "findRecord" && queryParams && store.model.cachedRecordQueries && store.model.cachedRecordQueries[modelName] && store.model.cachedRecordQueries[modelName][key]){
					var cachedQueries = store.model.cachedRecordQueries[modelName][key], sendData;
					for(var i=0; i<cachedQueries.length; i++){
						var params = cachedQueries[i].queryParams;
						if(this.compareObjects(params, queryParams,true)){
							sendData = [cachedQueries[i].data, "cache"];
							break;
						}
					}
					if(sendData){
						return new Promise(function(resolve, reject){
							if(makeBatch){
								store.$.addToCachedBatch(sendData);
							}
							resolve(sendData);
						});
					}
				}
				else{
					var scope = this.getCallBackScope(modelName, (type == "findRecord" ? "reloadRecord" : "reloadAll"));
					if(scope){
						var records;
						if(type == "findRecord"){
							records = store.peekRecord(modelName,key);							
						}
						else if(type == "findAll"){
							records = store.peekAll(modelName);
						}
						if(!this.callBack(scope, [records, queryParams])){
							var toRet = {};
							toRet[modelName] = records;
							return new Promise(function(resolve, reject){
								if(makeBatch){
									store.$.addToCachedBatch(toRet);
								}
								resolve([toRet, "cache"], "success", undefined, true);
							});
						}
					}
				}

				var urlObj = this.buildURL(type, "GET", modelName, key, undefined, queryParams,undefined,customData), self = this, xhr, res, rej;
				return new Promise(function(resolve, reject){
					res = resolve, rej = reject;
					var model = store.modelFor(modelName);
					var idbObj = model.idb;
					var processRequest = self.getFromAdapter(store.adapter[modelName],"processRequest"),payLoad, sendXHR = true;
					if(processRequest){
						sendXHR = false;
						var returnPromise = self.callGeneric(type,modelName,undefined,undefined,customData);
						if(returnPromise instanceof Promise){
							returnPromise.then(function(resp){
                                resp = (resp == "" ? JSON.parse("{}") : JSON.parse(resp));
								payLoad = self.getResponse(resp,modelName,type,key,urlObj);
								resolve([payLoad]);
							},function(message){
                                reject(message);
							});
						}
						else{
							sendXHR = true;
						}
					}
					var argsXHR = [modelName,type,key,urlObj,resolve,reject,"get"];
					if(makeBatch){
						store.adapter.$.constructBatch.apply(store.adapter.$, argsXHR).then(function(resObj){
							var payLoad = resObj.content;
							store.adapter.$.getSuccess(modelName,type,key,urlObj,undefined,resolve,payLoad,resObj);
							resolve(payLoad);							
						},function(){
							store.adapter.$.sendXHR.apply(store.adapter.$, argsXHR).then(function(xhrReq){
								store.adapter.$.getSuccess(modelName,type,key,urlObj,xhrReq,resolve);
							},function(xhrReq){
								store.adapter.$.getFailure(modelName,type,key,urlObj,xhrReq,reject);
							});
						});
					}
					else if(idbObj){
						store.adapter.$.getFromIDB(idbObj, modelName, type, queryParams, key, urlObj).then(function(payLoad){
							var scope =  store.serializer.$.getCallBackScope(modelName, "idbResponse"), args;
							if(scope){
								args = self.constructArgs(modelName, type, queryParams, key, payLoad);
								payLoad = self.callBack(scope, args);
							}
							if(payLoad == false){
								store.adapter.$.sendXHR.apply(store.adapter.$, argsXHR).then(function(xhrReq){
									store.adapter.$.getSuccess(modelName,type,key,urlObj,xhrReq,resolve);
								}, function(xhrReq){
									store.adapter.$.getFailure(modelName,type,key,urlObj,xhrReq,reject);
								});							
							}
							else{
								store.adapter.$.getSuccess(modelName,type,key,urlObj,undefined,resolve,payLoad);
							}
						},function(message){
							store.adapter.$.sendXHR.apply(store.adapter.$, argsXHR).then(function(xhrReq){
								store.adapter.$.getSuccess(modelName,type,key,urlObj,xhrReq,resolve);
							}, function(xhrReq){
								store.adapter.$.getFailure(modelName,type,key,urlObj,xhrReq,reject);
							});							
						});
					}
					else if(sendXHR){
						store.adapter.$.sendXHR.apply(store.adapter.$, argsXHR).then(function(xhrReq){
							store.adapter.$.getSuccess(modelName,type,key,urlObj,xhrReq,resolve);
						},function(xhrReq){
							store.adapter.$.getFailure(modelName,type,key,urlObj,xhrReq,reject);
						});
					}
				});
				
			}
			else {
				return Promise.reject({code : "ERR19", message : Lyte.errorCodes.ERR19, data:modelName});
			}
		},
		constructBatch:function(modelName,type,key,urlObj){
			return new Promise(function(resolve, reject){
				var batch = store.$.currentBatch;
				var q = store.$.batch[batch] = store.$.batch[batch] || [];
				var pro = store.$.batchPromise[batch] = store.$.batchPromise[batch] || []; 
				var batchObj = {};
				batchObj.method = urlObj.method;
				batchObj.uri = "/" + urlObj.url;
				batchObj.parameters = urlObj.qP;
				batchObj.content = typeof urlObj.data == "string" ? JSON.parse(urlObj.data) : undefined;
				q.push(batchObj);
				pro.push({resolve:resolve,reject:reject});	
			});
		},
		getFromIDB : function(idbObj ,modelName, type, queryParams,key, urlObj, xhr){
			return new Promise(function(resolve, reject){
				if(worker){
					var reqType = idbObj.queryCache ? "getCachedData" : type == "findAll" ? "getAll" : "get";
					var obj = {resolve : resolve, reject: reject, type:reqType, model:modelName, req:type, key:key};
					if(reqType == "getCachedData"){
						obj.queryParams = queryParams;
					}
					LyteIDB.postMessage(obj);
				}else{
					reject();
				}
			});
		},
		sendXHR:function(modelName,type,key,urlObj,resolve,reject,xhrType,data){
			return new Promise(function(res, rej){
				// var doXHR = store.$.requestHandling("add",modelName, type, key, urlObj);
				// if(doXHR == -1){
				// 	reject("Duplicate request "+urlObj.url);
				// }	
				var xhr = new XMLHttpRequest();
				xhr.open(urlObj.method, urlObj.url, true);
				for(var header in urlObj.headers){
					xhr.setRequestHeader(header, urlObj.headers[header]);
				}
				xhr.withCredentials = (urlObj.withCredentials)?true:false;
				store.emit("beforeRequest", [xhr, modelName, type, key]);
				xhr.send(urlObj.data);
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
						// store.$.requestHandling("remove",modelName, type, key, urlObj);
						store.emit("afterRequest",[xhr, modelName, type, key]);
						if(xhr.status.toString()[0] == "2" || xhr.status.toString()[0] == "3"){
							return res(xhr);
						}
						else{
							return rej(xhr);
						}
					}
				}
			});
		},
		getSuccess:function(modelName,type,key,urlObj,xhr,resolve,response,resObj){
			var resp = response, payLoad, req = xhr, batchIndex, batch;
			if(req){
				resp = req.responseText;
				resp = (resp == "" ? JSON.parse("{}") : JSON.parse(resp));
			}
			if(resObj){
				batchIndex = resObj.index;
				batch = resObj.batch;
				req = resObj.resp;
			}
			if(req){
				if(store.adapter && store.adapter[modelName]){
					var scope =  this.getCallBackScope(modelName, "parseResponse"), args;
					if(scope){
						args = this.constructArgs(type, modelName, req, resp);
						resp = this.callBack(scope, args);
					}
				}	
			}
			payLoad = this.getResponse(resp,modelName,type,key,urlObj,xhr);
			var resArr = xhr ? [payLoad, xhr.statusText, xhr] : (batchIndex != undefined) ? [payLoad,"batch",{index:batchIndex,batch:batch}] : [payLoad];
			resolve(resArr);
		},
		getFailure:function(modelName,type,key,urlObj,xhr,reject){
			var scope =  this.getCallBackScope(modelName, "parseResponse"), args, resp;
			if(scope){
				args = this.constructArgs(type, modelName, xhr);
				resp = this.callBack(scope, args);
			}
			reject(xhr);
		},
        getResponse:function(resp,modelName,type,key,urlObj,xhr){
            resp = store.serializer.$.normalizeResponse(modelName, type, resp, key, xhr ? xhr.status : xhr, urlObj.headers);
            var scope = store.serializer.$.getCallBackScope(modelName, "extractMeta");
            var payLoad = resp,args;
            if(typeof payLoad != "object"){
                payLoad = JSON.parse(payLoad);
            }
            if(scope){
				args = this.constructArgs(payLoad,modelName,type);
				var metaRes = this.callBack(scope, args);
				if(!store.$.isEmpty(metaRes)){
					payLoad.meta = metaRes;
				}
			}
			var keys = Object.keys(payLoad);
			var len = keys.length; 
            if(len){				
				scope = store.serializer.$.getCallBackScope(modelName, "payloadKey");
				if(scope){
					args = this.constructArgs(modelName,type);
					var plKey = this.callBack(scope, args);
					if(plKey && plKey != modelName){
						var temp = payLoad[plKey];
						payLoad[modelName] = temp;
						delete payLoad[plKey];
					}
				}
                scope = store.serializer.$.getCallBackScope(modelName, "deserializeKey");
                if(scope){
					Lyte.warn("LD08", "deserializeKey", "callback", "Please use payloadKey callback instead");
					if(len > 2){
						Lyte.error("LD09");
					}
						var index = 0;
						if(len == 2 && keys[0] == "meta"){
							index = 1;
						}
						args = this.constructArgs(modelName,type);
						var deserializeKey = this.callBack(scope, args), rec = payLoad[keys[index]];
						delete payLoad[keys[index]];
						payLoad[deserializeKey] = rec;
					// }
					// else if(len > 2){
					// 	console.error("Couldn't resolve using deserializekey, since there are more than 2 keys in the payLoad",modelName,type,Object.assign({},payLoad));
					// }
				}
//					store.serializer.$.buildJSON(modelName, type, payLoad, key, xhr.status, urlObj.headers);
                store.serializer.$.normalize(modelName, type, payLoad, key, xhr ? xhr.status : xhr, urlObj.headers);
            }
            return payLoad;
		},
		create : function(modelName, data, isSingleRecord, customData, qP){
			var type= isSingleRecord ? "createRecord": "create";
			var urlObj = this.buildURL(type, "POST", modelName, undefined, data,qP,undefined,customData);
			var changedData = store.$.toJSON(modelName, data, undefined, "create");
			store.$.removeNotDefinedKeys(store.modelFor(modelName), changedData);
			this.sendingData(modelName, changedData, urlObj, type, customData, data);
			return this.handleRequest(urlObj, modelName, data, type, changedData, customData);
		},
		put : function(modelName, data, record, isSingleRecord,customData, qP){
			var type = (isSingleRecord) ? "updateRecord" : "update";
			var urlObj = this.buildURL(type, "PATCH", modelName, isSingleRecord ? data[store.modelFor(modelName)._primaryKey] : undefined, data,qP,undefined,customData);
            var updatedData = store.$.toJSON(modelName, data);
            store.$.removeNotDefinedKeys(store.modelFor(modelName), updatedData);
			this.sendingData(modelName, updatedData, urlObj,type,customData, record);
			return this.handleRequest(urlObj, modelName, record, type, updatedData, customData);
		},
		del : function(modelName, data, isSingleRecord, destroy, customData, qP){
			var type = destroy || "deleteRecord";
			var pk = store.modelFor(modelName)._primaryKey;
			var urlObj = this.buildURL(type, "DELETE", modelName, isSingleRecord ? data[pk] : undefined, data,qP,undefined,customData);
			var ids = [];
			if(!isSingleRecord){
				ids = data.map(function(val){
					return val[pk];
				});				
			}
			var pkVal = (isSingleRecord) ?  (data ? data[pk] : undefined) : ids;
			this.sendingData(modelName, pkVal, urlObj, type, customData, data);
			return this.handleRequest(urlObj, modelName, data, type, pkVal, customData);
		},
		sendingData:function(modelName,data,urlObj,type,customData,snapshot){
			var scope = store.serializer.$.getCallBackScope(modelName, "serializeKey");
			var serializeKey = modelName;
			var payload = {};
			if(scope){
				var args = this.constructArgs(modelName,type,customData);
				serializeKey = this.callBack(scope, args);
			}
			if(!serializeKey){
				payload = data;
			}
			else if(Array.isArray(data) || typeof data == "object" || Lyte.isRecord(data)){
				payload[serializeKey] = data;
			}
			var scope = store.serializer.$.getCallBackScope(modelName, "serialize");
			if(scope){
				var args = this.constructArgs(type,payload,snapshot,customData,modelName);
				payload = this.callBack(scope, args);
			}
            if(type !== "deleteRecord" && type !== "destroyRecord" ){
				urlObj.data = payload;				
			}
			else if(scope){
				if(payload && payload !== undefined && payload !== null && payload !== ''){
					urlObj.data = payload;
				}
			}
		},
		handleAction:function(actionName,model,record,customData,qP){
			var pkVal;
			if(record && Lyte.isRecord(record)){
				pkVal = record.$.get(model._primaryKey);				
			}
			var modelName = model._name;
			var method = "action";
			var urlObj = this.buildURL(method, "POST", model._name, pkVal, record, qP, actionName,customData);
			var scope = store.serializer.$.getCallBackScope(model._name, "serialize");
			if(scope){
				var args = this.constructArgs(actionName,undefined,record,customData,modelName);
				urlObj.data = this.callBack(scope, args);
			}
			return this.handleRequest(urlObj, model._name, undefined, method,undefined,customData);
		},
		handleRequest:function(urlObj,modelName,data,type,changedData,customData){
			if(urlObj.data && (typeof urlObj.data == "object" || Lyte.isRecord(urlObj.data) || Array.isArray(urlObj.data)) && !(urlObj.data instanceof FormData)){
				urlObj.data = JSON.stringify(urlObj.data);
			}
			var self = this, xhr;
			return new Promise(function(resolve, reject){
				var processRequest = self.getFromAdapter(store.adapter[modelName],"processRequest"),sendXHR = true;
				var makeBatch = store.$.makeBatch;
				if(processRequest){
					sendXHR = false;
					var returnPromise = self.callGeneric(type,modelName,urlObj.data,data,customData),response;
					if(returnPromise instanceof Promise){						
						returnPromise.then(function(resp){
                            resp = (resp == "" ? JSON.parse("{}") : JSON.parse(resp));
							response = self.genericResponse(resp,modelName,type,data,urlObj);
							if(response == false){
								reject("Data is not in the format as store expects in "+modelName+" for type- "+type);								
							}
							resolve(response);
						},function(message){
							reject(message);
						});
					}
					else{
						sendXHR = true;
					}
				}
				if(makeBatch){
					store.adapter.$.constructBatch(modelName,type,key,urlObj).then(function(respObj){
						var resp = respObj.content; 
						store.adapter.$.handleSuccess(modelName, type, xhr, data, urlObj, resolve, resp, respObj);
						resolve(resp);
					},function(){
						store.adapter.$.handleFailure(modelName, type, xhr, reject);
					});
				}
				else if(sendXHR){
					var argsXHR = [modelName,type,key,urlObj,resolve,reject,"other",data];
					store.adapter.$.sendXHR.apply(store.adapter.$, argsXHR).then(function(xhrReq){
						store.adapter.$.handleSuccess(modelName, type, xhrReq, data, urlObj, resolve);					
					},function(xhrReq){
						store.adapter.$.handleFailure(modelName, type, xhrReq, reject);
					});
				}
			});
			
		},
		handleSuccess:function(modelName, type, xhr, data, urlObj, resolve, resp, respObj){
			var resp = resp ? resp : xhr.responseText, response, req, batchIndex, batch;
			resp = (resp == "" ? JSON.parse("{}") : typeof resp == "string" ? JSON.parse(resp) : resp);
			if(xhr){
				req = xhr;
			}
			if(respObj){
				batchIndex = respObj.index;
				batch = respObj.batch;
				req = respObj.resp;
			}
			if(req){
				if(store.adapter && store.adapter[modelName]){
					var scope =  this.getCallBackScope(modelName, "parseResponse"), args;
					if(scope){
						args = this.constructArgs(type, modelName, req, resp);
						resp = this.callBack(scope, args);
					}
				}	
			}

			response = this.genericResponse(resp,modelName,type,data,urlObj,xhr);
			if(response == false){
				reject("Response is not in the format as store expects in model, "+modelName+" for type "+type);
			}
			else{
				if(batchIndex != undefined){
					store.$.batchResponse[batch][batchIndex] = response;
				}
				if(type != "action"){
					this.updateIDB(modelName,type,data);
				}
				resolve(response);
			}
		},
		handleFailure:function(modelName, type, xhr, reject){
			if(xhr){
				var scope =  this.getCallBackScope(modelName, "parseResponse"), args;
				if(scope){
					args = this.constructArgs(type, modelName, xhr);
					resp = this.callBack(scope, args);
				}	
			}
			reject(xhr);
		},
		updateIDB:function(modelName,type, data){
			if(data && !Array.isArray(data)){
				data = [data];
			}
			var q =	store.$.idbQ2[modelName] = store.$.idbQ2[modelName] || [];
			if(data){
				switch(type){
					case "update":
					case "updateRecord":
					{
						data.forEach(function(item, index){
							if(item && Lyte.isRecord(item)){
								var model = store.model[modelName];
								var relations = model.relations;
								var parent = item.$.parent;
								if(parent){
									var pModel = parent.$.model._name;
									var parentQ = store.$.idbQ2[pModel] = store.$.idbQ2[pModel] || [];
									parentQ.push({type:"updateRecord",model:pModel,data:parent.$.toJSON(true)});
								}
								else{
									q.push({type:"updateRecord",model:modelName,data:item.$.toJSON(true)});
								}
								store.adapter.$.updateRelationsIDB(item, relations);
								store.$.addToIDBonSave(modelName,item);
							}
						});
						break;
					}
					case "delete":
					case "deleteRecord":
					case "destroyRecord":
					{
						var parent, pModel, parentQ;
						var pK = store.modelFor(modelName)._primaryKey;
						data.forEach(function(item, index){
							if(item && Lyte.isRecord(item)){
								var model = store.model[modelName];
								var relations = model.relations;
								parent = item.$.parent;
								if(parent){
									pModel = parent.$.model._name;
									parentQ = store.$.idbQ2[pModel] = store.$.idbQ2[pModel] || [];
									parentQ.push({type:"updateRecord",model:parent.$.model._name,data:parent.$.toJSON(true)});
								}
								else{
									q.push({type:"deleteRecord",model:modelName,key:item[pK]});
								}
								store.adapter.$.updateRelationsIDB(item, relations);
								store.$.removeOnSave(modelName,item[pK]);
							}
						});
						break;
					}
					case "create":
					case "createRecord":{
						data.forEach(function(item, index){
							if(item && Lyte.isRecord(item)){
								var model = store.model[modelName];
								var relations = model.relations;
								q.push({type:"createRecord",model:modelName,data:item.$.toJSON(true)});
								store.adapter.$.updateRelationsIDB(item, relations);
								store.$.addToIDBonSave(modelName,item);
							}
						});
						break;
					}
				}
			}
		},	
		updateRelationsIDB : function(item, relations){
			for(var key in relations){
				var rel = relations[key];
				rel.forEach(function(obj){
					var relKey = obj.relKey;
					var relModel = obj.relatedTo;
					var relQ = store.$.idbQ2[relModel] = store.$.idbQ2[relModel] || [];										
					var data = item[relKey];
					if(data){
						if(Array.isArray(data)){
							data.forEach(function(rec){
								if(Lyte.isRecord(rec) && !rec.$.parent && rec.$.inIDB){
									relQ.push({type:"updateRecord",model:relModel,data:rec.$.toJSON(true)});
								}
							});
						}
						else if(Lyte.isRecord(data) && !data.$.parent && data.$.inIDB){
							relQ.push({type:"updateRecord",model:relModel,data:data.$.toJSON(true)});
						}
					}
				});
			}
		},
        callGeneric : function(type, modelName,data,record,customData){
			var scope = this.getCallBackScope(modelName, "processRequest"),result;
			if(scope){
				var args = this.constructArgs(type,modelName,data,record,customData);
				result = this.callBack(scope, args);
			}
			return result;
		},
		genericResponse:function(resp,modelName,type,data,urlObj,xhr){
            var response = resp;
            var scope,args;
			scope = store.serializer.$.getCallBackScope(modelName, "extractMeta");
			if(scope){
				args = this.constructArgs(response,modelName,type);
				var metaRes = this.callBack(scope, args);
				if(!store.$.isEmpty(metaRes)){
					response.meta = metaRes;
				}
			}
			if(response && type != "action"){
				response = store.serializer.$.buildJSON(modelName, type, response, Lyte.isRecord(data) ? data[store.modelFor(modelName)._primaryKey] :undefined ,xhr ? xhr.status : xhr, urlObj.headers);
				scope = store.serializer.$.getCallBackScope(modelName, "payloadKey");
				if(scope){
					args = this.constructArgs(modelName,type);
					var plKey = this.callBack(scope, args);
					if(plKey && plKey != modelName){
						var temp = response[plKey];
						response[modelName] = temp;		
						delete response[plKey];
					}			
				}					
				var keys = Object.keys(response);
				var len = keys.length;
				scope = store.serializer.$.getCallBackScope(modelName, "deserializeKey");
				if(scope){
					Lyte.warn("LD08", "deserializeKey", "callback", "Please use payloadKey callback instead");
					if(len > 2){
						Lyte.error("LD09");
					}
						var index = 0;
						if(keys[0] == "meta"){
							index = 1;
						}
						var args = this.constructArgs(modelName,type), deserializeKey = this.callBack(scope, args), rec = response[keys[index]];
						delete response[keys[index]];
						response[deserializeKey] = rec;	
				}	
				this.handleResponse(urlObj, data, response[modelName], xhr ? xhr.statusText : xhr, xhr, store.modelFor(modelName));
			}
			return response;
		},
        checkResponse:function(data,model,response,pK){
		//var rawData = Lyte.isRecord(data) ? data.$.toJSON() : undefined;
			var dirtyId;
			if(data.$.isNew){
            	if(data.hasOwnProperty(pK) && response.hasOwnProperty(pK)){
					dirtyId = data[pK];
					if(typeof LyteComponent != "undefined"){
            			LyteComponent.set(data,pK,response[pK],true);
            		}
            		else{
            			data[pK] = response[pK];
            		}
            	}
                var result = store.$.validateAndMerge(model, response);						
				data.$.isNew = false;
				if(result == false){
					Lyte.error("LD01", response);
				}
            }
            if(data.$.isModified){
				dirtyId = data[pK];
                data.$.isModified = false;
				data.$._attributes = {};
                if(!data.$.isDeleted && response){
				   var result =  store.$.validateAndMerge(model, response);
				   if(result == false){
					  Lyte.error("LD01", response);
				   }						
                }
            }
            if(model.dirty.length){
                store.$.deleteFromArray(model.dirty, dirtyId);
            }
            if(data.$.isDeleted){
                data.$.isDeleted = false;
                var deleted = model._deleted, index = store.$.getIndex(deleted, pK, data[pK]);
                model._deleted.splice(index,1);
            }
            var dirty = data.$.isDirty();
            for(var j=0; j < dirty.length ;j++){
                var records = data[dirty[j]];
                if(Array.isArray(records)){
                    for(var k=0;k<records.length;k++){
                        records[k].$.isModified = false;
                    }
                }
                else if(Lyte.isRecord(records)){
                    records.$.isModified = false;
                }
            }
			store.$.clearRecordError(data.$);   
        },
		handleResponse:function(urlObj,data, response,textStatus,xhr, model){
			var pK = model._primaryKey;
			if(Array.isArray(data)){
				for(var i=0; i<data.length; i++){
				  ret = this.checkResponse(data[i],model,Array.isArray(response) ? response[i] : response,pK);	
				}
			}
			else{
                this.checkResponse(data,model,response,pK);	
			}
		},
        /*Compares two objects
        params - obj1, obj2
        return true/false
        */
		compareObjects : function(obj1, obj2, qP){
            if(!(obj1 instanceof Object) || !(obj2 instanceof Object)){
                return false;
            }
			if(Object.keys(obj1).length != Object.keys(obj2).length){
				return false;
			}
			for(var key in obj1){
				var val1 = obj1[key], val2 = obj2[key];
				if(qP && Array.isArray(val1) && Array.isArray(val2)){
					var len = val1.length;
					for(var i=0; i<len; i++){
						if(val1[i] != val2[i]){
							return false;
						}
					}
				}
				else if(val2 == undefined || val1 != val2){
					return false;
				}
			}
			return true;
		},
		handleBatchPromise:function(obj){
			var response = obj.response;
			var batch = obj.batch;
			//callback
			scope = store.serializer.$.getCallBackScope("application", "normalizeResponse");
			if(scope){
				args = this.constructArgs(undefined,"batch",obj.response);
				response = this.callBack(scope, args);
			}
			var resp = response.batch_requests;
			resp.forEach(function(item, index){
				var pro = store.$.batchPromise[batch][index];
				var code = item.status.toString()[0];
				if(code == "2"){
					pro.resolve({content:item.content,index:index,batch:batch,resp:item});
				}
				else if(code == "4" || code == "5"){
					pro.reject();
				}
			});
			// obj.resolve(response);
			delete store.$.batch[batch];
			delete store.$.batchPromise[batch];
		}
	}
}
Object.defineProperty(store.adapter,"extends",{
	enumerable:false,
	value: function value(adapterName,opts,parent){
			if(!adapterName){
				return;
			}
			if(store.adapter.hasOwnProperty(adapterName)){
				throw new Error("Adapter with name - "+adapterName+" -  already exists");
			}
			store.adapter[adapterName] = new Adapter(opts,parent,adapterName);
			return store.adapter[adapterName];
	}
});

function Serializer(opts,parent,name){
	for(key in opts){
		this[key] = opts[key];
	}
	var self = this;
	if(parent && parent.mixins && parent.mixins.length){
		parent.mixins.forEach(function(item,index){
			var mixin = Lyte.registeredMixins[item];
			for(var key in mixin){
				self[key] = mixin[key];
			}
		});
    }
    this.__extendedBy = [];
    if(store.serializer.__toAddSuper && store.serializer.__toAddSuper.hasOwnProperty(name)){
        var addSuper = store.serializer.__toAddSuper[name];
        for(var i=0; i<addSuper.length; i++){
            var child = store.serializer[addSuper[i]];
            if(child.is == "serializer"){
                child.$super = this;
                this.__extendedBy.push(addSuper[i]);
            }
        }
        delete store.serializer.__toAddSuper[name];
    }
	Object.defineProperty(this,"extends", {
		enumerable: false,
		value: function value(name){
			store.$.extendCallback.call(this,store,"serializer",name);
		}
	});
	Object.defineProperty(this,"is", {
		value: "serializer",
		enumerable:false
	});
    Object.defineProperty(this,"__name", {
		value: name,
		enumerable: false
	});
}
store.serializer = {
    $:{
        getCallBackScope:function(modelName,type){
            var serializer = store.serializer[modelName], scope, application = store.serializer.application;
            while(scope == undefined){
                if(serializer && serializer[type] && typeof serializer[type] == "function"){
                    return {scope : serializer, func : serializer[type]};
                }
                else if(serializer && serializer.$super){
                    serializer = serializer.$super;
                }
                else if(application && application[type] && typeof application[type] == "function"){
                    return {scope : application, func : application[type]};
                }
                else{
                    return undefined;
                }
            }
        },
        buildJSON:function(modelName, type, payLoad, id, status, headers){
            var scope = this.getCallBackScope(modelName, "normalizeResponse");
            var realData = payLoad;
            if(scope){
                var args = store.adapter.$.constructArgs(modelName, type, realData, id, status, headers);
                realData = store.adapter.$.callBack(scope, args);
            }
            var changed = false, recs;
            if(/^(findRecord|findAll)$/.test(type) || realData[modelName]){
                recs = realData[modelName];
                changed = true;
                scope = this.getCallBackScope(modelName, "normalize");
                if(scope){
                    if(Array.isArray(recs)){
                        for(var i=0; i<recs.length; i++){
                            var args = store.adapter.$.constructArgs(modelName, type, recs[i]);
                            recs[i] = store.adapter.$.callBack(scope, args);
                        }
                    }					
                    else{
                        var args = store.adapter.$.constructArgs(modelName, type, recs);
                        recs = store.adapter.$.callBack(scope, args);
                    }
                }
                realData[modelName] = recs;
            }
            return realData;
        },
        normalizeResponse : function(modelName,type,payLoad,id, status, headers){
            var scope = this.getCallBackScope(modelName, "normalizeResponse");
            var realData = payLoad;
            if(scope){
                var args = store.adapter.$.constructArgs(modelName, type, realData, id, status, headers);
                realData = store.adapter.$.callBack(scope, args);
            }
            return realData;
        },
        normalize : function(modelName,type,payLoad,id, status, headers){
            var realData = payLoad, changed = false;
            if(/^(findRecord|findAll)$/.test(type) || realData[modelName]){
                realData = realData[modelName];
                changed = true;
            }
            var scope = this.getCallBackScope(modelName, "normalize");
            if(scope){
                if(Array.isArray(realData)){
                    for(var i=0; i<realData.length; i++){
                        var args = store.adapter.$.constructArgs(modelName, type, realData[i]);
                        realData[i] = store.adapter.$.callBack(scope, args);
                    }
                }					
                else{
                    var args = store.adapter.$.constructArgs(modelName, type, realData);
                    realData = store.adapter.$.callBack(scope, args);
                }
            }
            if(changed){
                payLoad = {};
                payLoad[modelName] = realData;
            }
        } 
    }
}
Object.defineProperty(store.serializer,"extends",{
	enumerable:false,
	value:function value(serializerName, opts, parent){
		if(store.serializer.hasOwnProperty(serializerName)){
			throw new Error("Serializer with name - "+serializerName+" -  already exists");
		}
		store.serializer[serializerName] = new Serializer(opts,parent,serializerName);
		return store.serializer[serializerName];
	}
});
Object.defineProperties(store,{
	triggerUpdate:{
		enumerable:false,
		value: function value(modelName, pkVal, keys, qP, customData){
			var obj = {};
			var record = store.peekRecord(modelName, pkVal);
			if(record){
				var model = record.$.model;
				var pK = model._primaryKey;
				var fields = keys || Object.keys(model.fieldList);	
				fields.forEach(function(item){
					obj[item] = record[item];
				});
				obj[pK] = record[pK];
				return store.adapter.$.put(modelName, obj, record, true, customData, qP);	
			}
			return Promise.reject("No such record found");
		}
	},
	batch:{
		enumerable:false,
		value:function value(func){
			return new Promise(function(resolve, reject){
				store.$.makeBatch = true;
				store.$.batch = store.$.batch || {};
				store.$.batchPromise = store.$.batchPromise || {};
				var bLen = (store.$.currentBatch === undefined) ? Object.keys(store.$.batch).length : (store.$.currentBatch + 1);
				var batch = store.$.currentBatch = bLen;
				try{
					func();
				}
				catch(e){
					store.$.makeBatch = false;
					throw e;
				}
				store.$.makeBatch = false;
				var payLoad = {batch:store.$.batch[batch]};
				var urlObj = store.adapter.$.buildURL("batch", "POST", "application");
				var batchPl = payLoad.batch;
				if(store.$.isEmpty(batchPl) || batchPl == {}){
					if(store.$.cachedBatch && store.$.cachedBatch[batch] && store.$.cachedBatch[batch].length){
						var finalRes = store.$.handleCachedResponse(batch, []);
						return resolve(finalRes);
					}
					return resolve();					
				}
				var scope = store.serializer.$.getCallBackScope("application", "serialize");
				if(scope){
					var args = store.adapter.$.constructArgs("batch",payLoad);
					payLoad = store.adapter.$.callBack(scope, args);
				}
				var xhr = new XMLHttpRequest();
				xhr.open("POST", urlObj.url, true);
				for(var header in urlObj.headers){
					xhr.setRequestHeader(header, urlObj.headers[header]);
				}
				xhr.withCredentials = (urlObj.withCredentials)?true:false;
				xhr.send(JSON.stringify(payLoad));
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
						if(xhr.status.toString()[0] == "2" || xhr.status.toString()[0] == "3"){
							var resp = JSON.parse(xhr.responseText);
							store.$.batchResponse = store.$.batchResponse || {};
							store.$.batchResponse[batch] = [];
							store.adapter.$.handleBatchPromise({response:resp,batch:batch,resolve:resolve});
							setTimeout(function(){
								var finalRes = store.$.handleCachedResponse(batch, store.$.batchResponse[batch]);
								resolve(finalRes);
								store.$.batchResponse[batch] = [];
							},0);
						}
						else{
							setTimeout(function(){
								reject();
							},0);
						}
					}
				}					
			});
		}
	},
	pushPayload:{
		enumerable:false,
		value:function value(modelName,data,deserialize){
			var model = store.modelFor(modelName);
	    	var result = data, len;
			if(deserialize){
                data = store.serializer.$.buildJSON(modelName,"pushPayload",data);
                var scope = store.serializer.$.getCallBackScope(modelName, "deserializeKey");
		len = data ? Object.keys(data).length : undefined;
                if(scope){
					Lyte.warn("LD08", "deserializeKey", "callback", "Please use payloadKey callback instead");
					if(len > 2){
						Lyte.error("LD09");
					}
					var keys = Object.keys(data), index = 0;
					if(keys.length == 2 && keys[0] == "meta"){
						index = 1;
					}
					var args = store.adapter.$.constructArgs(modelName,"pushPayload"), deserializeKey = store.adapter.$.callBack(scope, args), rec = data[keys[index]];
					delete data[keys[index]];
					data[deserializeKey] = rec;
					
                }
                result = data[modelName];
			}
			store.$.idbQ2Push(modelName,data,undefined,"pushPayload");
  			data = store.$.insertIntoStore(model, result, true);
			delete model.rel;
			return data;
		}
	},
	registerModel:{
		enumerable:false,
		value:function value(name,fields,options){
			if(store.model.hasOwnProperty(name)){
				throw new Error("Model with name - "+name+" - already exists");
			}
			var extend,actions,idb;
			if(options && typeof options == "object"){
				extend = options.extends || undefined;
				actions = options.actions || undefined;
				idb = options.idb || undefined;
			}
			if(extend){
				var parentFields = Object.assign({},store.model[extend].fieldList);
				for(var key in parentFields){
					if(parentFields[key].type == "relation"){
						delete parentFields[key];
					}
				}
				fields = Object.assign(fields, parentFields);
			}
			store.model[name] = new Model(name, fields);
			if(extend){
				store.model[name].extend = extend;
				if(!store.model[extend].extendedBy){
					store.model[extend].extendedBy = {};
				}
				store.model[extend].extendedBy[name] = true;
				if(!store.adapter[name] && store.adapter[extend]){
					store.adapter[name] = store.adapter[extend];
				}
				if(!store.serializer[name] && store.serializer[extend]){
					store.serializer[name] = store.serializer[extend];
				}
				if(store.model[extend].actions){
					if(actions == undefined){
						actions = {};
					}
					for(var key in store.model[extend].actions){
						if(!actions.hasOwnProperty(key)){
							actions[key] = store.model[extend].actions[key]; 							
						}
					}					
				}
			}
			if(actions){
				store.model[name].actions = actions;
			}
			if(idb){
				store.model[name].idb = idb;
			}
			return store.model[name];
		}
	},
    unregisterModel:{
      enumerable:false,
      value:function(name){
		var model = store.modelFor(name);
		if(!model){
			Lyte.error("LD02","Model ",name);
			return;
		}
		if(model.data.length){
			store.unloadAll(name);
		}
		var extendedBy = model.extendedBy;
		if(extendedBy && Object.keys(extendedBy).length){
			for(var ext in extendedBy){
				store.unregisterModel(ext);
			}
		}
		var extend = model.extend;
		if(extend){
			var ext = store.modelFor(extend);
			delete ext.extendedBy[name];
		}
		delete store.model[name];  
      }
	},
	unregisterAdapter:{
		enumerable:false,
		value:function value(name){
			store.$.unregisterCallback("adapter",name);
		}
	},
	unregisterSerializer:{
		enumerable:false,
		value:function value(name){
			store.$.unregisterCallback("serializer",name);
		}
	},
	addField:{
		enumerable:false,
		value:function value(modelName,key,type,options){
			var model = store.modelFor(modelName);
			var field = Lyte.attr(type,options);
			var obs = [];
			store.$.registerField(model,key,field,obs);
		}
	},
	modelFor:{
		enumerable:false,		
		value:function value(name){
			return store.model[name];
		}
	},
	createRecord:{
		enumerable : false,
		value : function value(modelName, opts, withoutValidation){
			return this.$.newRecord(modelName, opts, withoutValidation);
		}
	},
	deleteRecord:{
		enumerable : false,
		value : function value(modelName, key){
			this.$.removeFromStore(store.modelFor(modelName), key);
		}
	},
    /*
	 args - modelName, queryParams, cacheQuery, cacheData, customData
	 	cacheQuery - true/false (default false) -> whether to cache the request with queryparams or not
	 	cacheData - true/false (default true) -> whether to store the data in the store or not
	 	customData - some custom data that can be sent, which will be received as the last param in all adapter functions
	 */
	findAll:{
		enumerable:false,
		value : function value(modelName, queryParams, cacheQuery,cacheData,customData){
			return store.adapter.$.get("findAll", modelName, undefined, queryParams, cacheQuery,customData).then(function(){
				var data = arguments[0][0];
				var fromCache = arguments[0][1] == "cache" ? true : false; 
				var batchObj = arguments[0][1] == "batch" ? arguments[0][2] : undefined; 
				var fromIDB = arguments[0][1] == "idb" ? true : false;
				if(cacheData === false){
                    if(cacheQuery && Object.keys(queryParams).length > 0){
						store.$.cacheQuery(modelName, queryParams, data);
					}
					return data;
				}
				if(data && !data.save){
					if(!fromCache){
//						var rawData = Lyte.deepCopyObject(data);
						if(!fromIDB){
							store.$.idbQ2Push(modelName,data,queryParams,"findAll");
						}
						var records = store.$.toInsertData(modelName, data,true);
						data[modelName] = records;
						if(data.meta && records){
							if(!data[modelName].$){
								Object.defineProperty(data[modelName], "$", {
									enumerable : false,
									value : {meta : data.meta}
								});	
							}
							else{
								data[modelName].meta = data.meta;
							}
						}
						if(cacheQuery && Object.keys(queryParams).length > 0){
							store.$.cacheQuery(modelName, queryParams, data);								
						}						
					}
					if(batchObj != undefined){
						store.$.batchResponse[batchObj.batch][batchObj.index] = data[modelName];
					}
					return data[modelName];	
				}
				return arguments;
			}, function(e){
				return Promise.reject(e);
			});
		}		
	},
    /*
	 args - modelName , key, queryParams, cacheQuery, cacheData, customData
	 	cacheQuery - true/false (default - false) -> to cache the query with queryParams and key
	 	cacheData - true/false (default - true) -> to store the data in store / not
	 	customData - custom data that will be available as last param in all adapter callbacks 
	 */
	findRecord:{
		enumerable:false,		
		value : function value(modelName, key, queryParams, cacheQuery,cacheData,customData){
			if(key == undefined){
				return Promise.reject({code : "ERR20", message : Lyte.errorCodes.ERR20});
			}
			return store.adapter.$.get("findRecord", modelName, key, queryParams, cacheQuery,customData).then(function(){
				var data = arguments[0][0], fromCache = arguments[0][1] == "cache" ? true : false;
				var batchObj = arguments[0][1] == "batch" ? arguments[0][2] : undefined; 
				var fromIDB = arguments[0][1] == "idb" ? true : false;
				if(cacheData === false){
                    if(arguments[0][1] != "cache" && cacheQuery && Object.keys(queryParams).length > 0){
						store.$.cacheRecordQuery(modelName, key, queryParams, data);
					}
					return data;
				}
				if(data){
					if(!fromCache){
						//var rawData = Lyte.deepCopyObject(data);
						if(!fromIDB){
							store.$.idbQ2Push(modelName,data,queryParams,"findRecord",key);
						}
						if(!Lyte.isRecord(data)){
							var record = store.$.toInsertData(modelName, data, true);
							data[modelName] = record;
							if(data.meta){
								record.$.meta = data.meta;
							}
						}
						if(arguments[0][1] != "cache" && cacheQuery && Object.keys(queryParams).length > 0){
							store.$.cacheRecordQuery(modelName, key, queryParams, data);
						}						
					}
					if(batchObj != undefined){
						store.$.batchResponse[batchObj.batch][batchObj.index] = data[modelName];
					}
					return data[modelName];	
				}
				return arguments;
			}, function(e){
				return Promise.reject(e);
			});
		}
	},
	peekRecord:{
		enumerable:false,		
		value : function value(modelName, pKey){
			var model = this.modelFor(modelName);
			if( !model ){
				Lyte.error("LD02","Model ",modelName);
				return;
			}
			var data = model.data, primaryKey = this.model[modelName]._primaryKey;
			var record = data.filter(function(record){
				if(record[primaryKey] == pKey){
					return record;
				}
			});
			if(record[0]){
				return record[0];
			}
			return undefined;
		}
	},
	peekAll:{
		enumerable : false,
		value : function value(modelName){
			var model = this.modelFor(modelName), arr;
			if( !model ){
				Lyte.error("LD02","Model ",modelName);
				return;
			}
			arr= model.data;
//			if(arr.length){
				return arr;
//			}
//			return undefined;
		}	
	},
	deleteMany:{
		enumerable : false,
		value : function value(modelName, keys){
			this.$.removeFromStore(store.modelFor(modelName), keys);
		}
	},
	unloadRecord:{
		enumerable : false,
		value : function value(modelName, key){
			var data = store.peekRecord(modelName, key);
			var model = store.modelFor(modelName);
			var pkVal;
			if(data){
				pkVal = data[model._primaryKey];
				this.$.removeFromStore(model, pkVal, true);
				for(var i=0; i<model._deleted.length; i++){
					if(model._deleted[i].$.get(model._primaryKey) == key){
						model._deleted.splice(i, 1);
						break;
					}
				}
				if(this.model.cachedRecordQueries && this.model.cachedRecordQueries[modelName] && this.model.cachedRecordQueries[modelName][key]){
					this.model.cachedRecordQueries[modelName][key] = [];
				}
			}
		}
	},
	unloadAll:{
		enumerable:false,		
		value : function value(modelName){
			var keys = [];
			var data = store.peekAll(modelName);
			var model = this.modelFor(modelName);
			if(data){
				for(var i=0; i<data.length; i++){
					keys.push(data[i][model._primaryKey]);
				}				
			}
			this.$.removeFromStore(model, keys, true);
			this.model[modelName].dirty = [];
			this.model[modelName]._deleted = [];
			if(this.model.cachedQueries && this.model.cachedQueries[modelName]){
				this.model.cachedQueries[modelName] = [];
			}
		}
	},
	triggerAction:{
		enumerable:false,
		value:function value(modelName,actionName,customData,qP){
			var model = store.modelFor(modelName);
			var actions = model.actions, action = (actions)?model.actions[actionName]:undefined;
			if(action){
				return store.adapter.$.handleAction(actionName,model,store.peekAll(modelName),customData,qP).then(function(data){
					return data;
				},function(err){
					return Promise.reject(err);
				});
			}
			else{
				return Promise.reject({code : "ERR18", message : Lyte.errorCodes.ERR18});
			}
		}
	},
	rollBack :{
		enumerable:false,
		value:function value(modelName){

			var model = this.modelFor(modelName);
			if(model == undefined){
				return;
			}
			var pK = model._primaryKey,self = this;
            while(model.dirty.length){
				var rec = self.peekRecord(modelName, model.dirty[0]);
				if(rec && rec.$.isModified){
					rec.$.rollBackAttributes(rec.$.getDirtyAttributes());
				}
				else if(rec && rec.$.isNew){
					self.$.rollBackNew(model, rec, pK);
				}                                
            }
//            model.dirty.forEach(function(item,index){
//				var rec = self.peekRecord(modelName, item);
//				if(rec && rec.$.isModified){
//					rec.$.rollBackAttributes(rec.$.getDirtyAttributes());
//				}
//				else if(rec && rec.$.isNew){
//					self.$.rollBackNew(model, rec, pK);
//				}                
//            });
			while(model._deleted.length > 0){
				this.$.rollBackDelete(model, 0);
			}
		}
	},
	create : {
		enumerable : false,
		value : function value(modelName, recordObject, customData, qP){
			var model = store.modelFor(modelName);
			if(model == undefined){
				return Promise.reject({code : "ERR19", message : Lyte.errorCodes.ERR19, data:modelName});
			}
			if(recordObject){
				var resp = this.$.newRecord(modelName, recordObject);
				if(resp.$.isError){
					return Promise.reject(resp);
				}				
			}
			var dirty = model.dirty, created = [];
			for(var i=0; i<dirty.length; i++){
				var rec = store.peekRecord(modelName, dirty[i]);
				if(rec && rec.$.isNew){
					created.push(rec);
				}
			}
			if(created.length){
				return store.adapter.$.create(modelName, created, false, customData, qP);
			}
			return Promise.resolve();
		}
	},
	update : {
		enumerable : false,
		value : function value(modelName, customData, qP){
			var model = this.modelFor(modelName);
			if(model == undefined){
				return Promise.reject({code : "ERR19", message : Lyte.errorCodes.ERR19, data : modelName});
			}
			var changed = [], recordsChanged = [], pK = model._primaryKey;
			var records = store.peekAll(modelName);
			records.forEach(function(item, index){
				var rec = item;
				var dirty = rec.$.isDirty();
				if((rec && rec.$.isModified && !rec.$.isNew) || (dirty && dirty.length)){
					var attr = rec.$._attributes, obj = {};
					for(var key in attr){
						obj[key] = rec.$.get(key);
					}
					for(var j=0;j<dirty.length;j++){
						obj[dirty[j]] = rec[dirty[j]];
					}
					obj[pK] = rec.$.get(pK);
					changed.push(obj);
					recordsChanged.push(rec);
				}
			});
			if(changed.length){
				return store.adapter.$.put(modelName, changed, recordsChanged,false, customData);
			}
			return Promise.resolve();
		}
	},
	delete : {
		enumerable : false,
		value : function value(modelName, key, customData, qP){
			var model = store.modelFor(modelName);
			if(model == undefined){
				return Promise.reject({code : "ERR19", message : Lyte.errorCodes.ERR19,data:modelName});
			}
			if(key){
				this.deleteRecord(modelName, key);				
			}
			var deleted = [];
			for(var i=0; i<model._deleted.length; i++){
				if(!model._deleted[i].$.isNew){
					deleted.push(model._deleted[i]);					
				}
				else{
					store.adapter.$.handleResponse(undefined, model._deleted[i], model._deleted[i], undefined, undefined, model);
				}
			}
			if(deleted.length){
				var pK = model._primaryKey;
				var prm = store.adapter.$.del(modelName, deleted,undefined,"delete",customData);
				prm.then(function(resp){
					return resp;
				}, function(e){
					return Promise.reject(e);
				});
				return prm;
			}
			return Promise.resolve();
		}
	},
	registerAdapter : {
		enumerable : false,
		value : store.adapter.extends
	},
	registerSerializer : {
		enumerable : false,
		value : store.serializer.extends
	},
	clearCachedQuery : {
		enumerable : false,
		value : function(modelName, key, queryParams){
			var cachedQueries = [];
			if(key && typeof key == "object"){
				queryParams = key;
				if(this.model.cachedQueries && this.model.cachedQueries[modelName]){
					cachedQueries = this.model.cachedQueries[modelName];
				}
			}
			else{
				if(this.model.cachedRecordQueries && this.model.cachedRecordQueries[modelName] && this.model.cachedRecordQueries[modelName][key]){
					cachedQueries = this.model.cachedRecordQueries[modelName][key];
				}
			}
			for(var i=0; i<cachedQueries.length; i++){
				if(this.adapter.$.compareObjects(cachedQueries[i].queryParams, queryParams, true)){
					cachedQueries.splice(i, 1);
					break;
				}
			}
		}
	},
	setErrorMessages : {
		enumerable : false,
		value : function(obj){
			Object.assign(Lyte.errorCodes, obj);
		}
	},
    addEventListener : {
        enumerable : false,
        value:function(type,func){
            return store.$.eventListeners.add(store,type,func);
        }
    },
    removeEventListener : {
        enumerable : false,
        value:function(id){
            store.$.eventListeners.remove(store,id);
        }
    },
    emit : {
        enumerable : false,
        value:function(type,args){
            store.$.eventListeners.emit(store,type,args);
        }
    }
});

var error1 = function error1(attr, obj){
	Object.defineProperties(this, {
		$ : {
			enumerable : false,
			value : {isError : true , error: {}}
		}
	});
    if(attr){
		store.$.setError(this,attr,obj);
	}
}