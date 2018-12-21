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
}var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Lyte = {
  version: "2.0.0",
  $: {},
  registeredMixins: {},
  Mixin: {},
  debug: false,
  performance: false,
  toBeRegistered: []
};

var consoleTime = [];

(function assetsDivCreation() {
  Lyte.$.assetsDiv = document.createElement("div");
  Lyte.$.assetsDiv.setAttribute("id", "lyteAssetsDiv");
  document.head.appendChild(Lyte.$.assetsDiv);
})();

Lyte.registerErrorCodes = function (obj) {
  Object.assign(Lyte.errorCodes, obj);
};

Lyte.getErrorMessage = function (code) {
  var args = Array.from(arguments).slice(1);
  if (Lyte.errorCodes[code]) {
    return Lyte.errorCodes[code].replace(/{(\d+)}/g, function (t, i) {
      return args[i];
    });
  } else {
    return code;
  }
};

Lyte.error = function () {
  var errorObj = arguments[0].stack || Error(Lyte.getErrorMessage.apply(Lyte, arguments));
  if (Lyte.onerror) {
    Lyte.onerror.call(this, errorObj);
  }
  Lyte.triggerEvent("error", errorObj);
  console.error.call(console, errorObj);
};

Lyte.warn = function () {
  var errorObj = arguments[0].stack || Error(Lyte.getErrorMessage.apply(Lyte, arguments));
  console.warn.call(console, errorObj);
};

Lyte.Mixin.register = function (name, mixin) {
  Lyte.registeredMixins[name] = mixin;
};

Lyte.Mixin.exists = function (name) {
  if (!Lyte.registeredMixins[name]) {
    Lyte.error('Mixin used before being registered.');
    return false;
  }
  return true;
};

Lyte.log = function (text, color) {
  if (Lyte.debug) {
    console.log((color ? "%c" : "") + text, 'color:' + color);
  }
};

Lyte.time = function (fn) {
  if (Lyte.performance) {
    var index;
    if ((index = consoleTime.indexOf(fn)) != -1) {
      consoleTime.splice(index, 1);
      console.timeEnd(fn);
    } else {
      consoleTime.push(fn);
      console.time(fn);
    }
  }
};

Lyte.isRecord = function (object) {
  if (object && object.$ && object.$.hasOwnProperty("isModified")) {
    return true;
  }
  return false;
};

Lyte.isComponent = function (object) {
  if (object && object.$node && object.__data) {
    return true;
  }
  return false;
};

/* --------- lyte router v2 changes starts---- */
var reqFiles = {};

Lyte.injectResources = function (files, every, completed) {
  var successFiles = [],
      errorFiles = [];
  every = every || function () {};
  completed = completed || function () {};
  return new Promise(function (resolve) {
    processRequirements(files, resolve);
  }).then(function () {
    completed(successFiles, errorFiles);
  });

  function processRequirements(files, resolve) {
    if (!files) {
      resolve();
    } else {
      if (!Array.isArray(files)) {
        files = [files];
      }
      if (!files.length) {
        resolve();
      }
      var len = -files.length;
      files.forEach(function (file) {
        if (typeof file == "string") {
          requestFile(file, Lyte.injectResources.availableTags[file], function () {
            loaded();
          });
        } else if (Array.isArray(file)) {
          new Promise(function (r) {
            processRequirements(file, r);
          }).then(function () {
            loaded();
          });
        } else {
          new Promise(function (r) {
            processRequirements(file.parent, r);
          }).then(function () {
            new Promise(function (r1) {
              processRequirements(file.child, r1);
            }).then(function () {
              loaded();
            });
          });
        }
      });
    }

    function loaded() {
      len++;
      if (len == 0) {
        resolve();
      }
    }

    function requestFile(file, cached, resolve) {
      if (reqFiles[file]) {
        reqFiles[file].push(resolve);
      } else {
        reqFiles[file] = [resolve];
        if (cached && cached.event.type != "error") {
          if (Lyte.removeFromCache.arr.indexOf(file) != -1) {
            Lyte.removeFromCache.arr.splice(Lyte.removeFromCache.arr.indexOf(file), 1);
          }
          fileLoaded.call(cached.tag, cached.event, true);
          resolve();
        } else {
          makeRequest(file, function (event) {
            reqFiles[file].forEach(function (resolve) {
              resolve();
            });
            fileLoaded.call(this, event);
            every.call(this, event);
          });
        }
      }
    }

    function fileLoaded(event, cached) {
      var file = this.getAttribute('src') || this.getAttribute('href');
      delete reqFiles[file];
      if (!cached) {
        if (Lyte.injectResources.availableTags[file]) {
          Lyte.injectResources.availableTags[file].tag.remove();
        }
        this.onerror = this.onload = undefined;
        Lyte.injectResources.availableTags[file] = { tag: this, event: { type: event.type } };
      }
    }
  }

  function makeRequest(file, callBack) {
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
      if (event.type == "error") {
        errorFiles.push(event);
      } else {
        successFiles.push(event);
      }
      if (callBack) {
        callBack.call(this, event);
      }
    };
    document.getElementById("lyteAssetsDiv").appendChild(tag);
  };
};

Lyte.injectResources.availableTags = [];

Lyte.removeFromCache = function (arr) {
  Lyte.removeFromCache.assign(arr);
  if (Lyte.removeFromCache.arr.length) {
    Lyte.removeFromCache.arr.forEach(function (file) {
      if (Lyte.injectResources.availableTags[file]) {
        Lyte.injectResources.availableTags[file].tag.remove();
        delete Lyte.injectResources.availableTags[file];
      }
    });
    Lyte.removeFromCache.arr = [];
  }
};

Lyte.removeFromCache.arr = [];

Lyte.removeFromCache.assign = function (arr) {
  arr = arr == "*" ? Object.keys(Lyte.injectResources.availableTags) : Array.isArray(arr) ? arr : [arr];
  Lyte.removeFromCache.arr = Lyte.removeFromCache.arr.concat(arr);
  return;
};

/* --------- lyte router v2 changes ends ---- */

Lyte.checkProperty = function (property, dataVal, key, fieldVal, record, type) {
  var exts = "extends";
  switch (property) {
    case "type":
      if (Lyte.Transform.hasOwnProperty(fieldVal)) {
        if (Array.isArray(dataVal)) {
          if (Lyte.Transform[fieldVal][exts] != "array") {
            return { code: "ERR03", message: Lyte.errorCodes.ERR03, expected: fieldVal };
          }
        } else if (Lyte.Transform[fieldVal][exts] != (typeof dataVal === "undefined" ? "undefined" : _typeof(dataVal))) {
          return { code: "ERR03", message: Lyte.errorCodes.ERR03, expected: fieldVal };
        }
      } else if (dataVal !== undefined) {
        if (Array.isArray(dataVal)) {
          if (fieldVal != "array") {
            return { code: "ERR03", message: Lyte.errorCodes.ERR03, expected: fieldVal };
          }
        } else if (fieldVal != (typeof dataVal === "undefined" ? "undefined" : _typeof(dataVal))) {
          return { code: "ERR03", message: Lyte.errorCodes.ERR03, expected: fieldVal };
        }
      }
      break;
    case "mandatory":
      if (dataVal == undefined || dataVal == null || dataVal == "") {
        return { code: "ERR02", message: Lyte.errorCodes.ERR02 };
      }
      break;
    case "maximum":
      if (typeof dataVal == "number" && dataVal > fieldVal) {
        return { code: "ERR04", message: Lyte.errorCodes.ERR04, expected: fieldVal };
      }
      break;
    case "minimum":
      if (typeof dataVal == "number" && dataVal < fieldVal) {
        return { code: "ERR05", message: Lyte.errorCodes.ERR05, expected: fieldVal };
      }
      break;
    case "maxLength":
    case "maxItems":
      if (dataVal && dataVal.length > fieldVal) {
        return { code: "ERR06", message: Lyte.errorCodes.ERR06, expected: fieldVal };
      }
      break;
    case "minLength":
    case "minItems":
      if (dataVal && dataVal.length < fieldVal) {
        return { code: "ERR07", message: Lyte.errorCodes.ERR07, expected: fieldVal };
      }
      break;
    case "pattern":
      if (dataVal && typeof dataVal == "string" && !new RegExp(fieldVal).test(dataVal)) {
        return { code: "ERR08", message: Lyte.errorCodes.ERR08, expected: fieldVal };
      }
      break;
    case "uniqueItems":
      {
        if (Array.isArray(dataVal) && fieldVal) {
          var newArr = [];
          for (var i = 0; i < dataVal.length; i++) {
            var val = dataVal[i];
            if (newArr.indexOf(val) != -1) {
              return { code: "ERR09", message: Lyte.errorCodes.ERR09 };
            }
            newArr.push(val);
          }
        }
        break;
      }
    case "constant":
      if (Array.isArray(dataVal)) {
        var resp = dataVal.length == fieldVal.length && dataVal.every(function (v, i) {
          return v === fieldVal[i];
        });
        if (!resp) {
          return { code: "ERR10", message: Lyte.errorCodes.ERR10, expected: fieldVal };
        }
      } else if ((typeof dataVal === "undefined" ? "undefined" : _typeof(dataVal)) == "object") {
        var resp = store.adapter.$.compareObjects(dataVal, fieldVal);
        if (!resp) {
          return { code: "ERR10", message: Lyte.errorCodes.ERR10, expected: fieldVal };
        }
      } else if (dataVal && dataVal != fieldVal) {
        return { code: "ERR10", message: Lyte.errorCodes.ERR10, expected: fieldVal };
      }
      break;
    case "items":
      {
        if (Array.isArray(dataVal)) {
          for (var i = 0; i < dataVal.length; i++) {
            for (var property in fieldVal) {
              var resp = Lyte.checkProperty(property, dataVal[i], i, fieldVal[property]);
              if (resp != true) {
                return resp;
              }
            }
          }
        }
        break;
      }
    case "properties":
      if ((typeof dataVal === "undefined" ? "undefined" : _typeof(dataVal)) == "object" && !Array.isArray(dataVal)) {
        for (var key in dataVal) {
          for (var property in fieldVal) {
            var resp = Lyte.checkProperty(property, dataVal[key], key, fieldVal[property]);
            if (resp != true) {
              return resp;
            }
          }
        }
      }
      break;
    case "validation":
      {
        var resp = Lyte.customValidator[fieldVal].apply(record, [key, dataVal]);
        if (resp != true) {
          return resp;
        }
      }
  }
  return true;
};

Lyte.types = ["string", "object", "number", "boolean", "array"];

Lyte.attr = function (type, opts) {
  var obj = {};
  obj.type = type;
  if (opts == undefined) {
    opts = {};
  }
  if (this.types.indexOf(type) == -1 && !Lyte.Transform.hasOwnProperty(type)) {
    throw new Error("Not a valid field type - " + type);
  }
  Object.assign(obj, opts);
  return obj;
};

Lyte.defineRelation = function (name, type, opts) {
  var relation = { type: "relation", relType: type, relatedTo: name };
  if (opts) {
    relation.opts = opts;
  }
  return relation;
};

Lyte.belongsTo = function (name, opts) {
  return this.defineRelation(name, "belongsTo", opts);
};

Lyte.hasMany = function (name, opts) {
  return this.defineRelation(name, "hasMany", opts);
};

Lyte.Transform = {};

Lyte.customValidator = {};

Lyte.registerDataType = function (fieldTypeName, properties) {
  var exts = "extends";
  if (this.Transform.hasOwnProperty(fieldTypeName)) {
    throw new Error("Custom Field Type - " + fieldTypeName + " -  already exists.");
  }
  if (properties[exts] == undefined || Lyte.types.indexOf(properties[exts]) == -1) {
    throw new Error("Not a valid field type - " + properties[exts]);
  }
  this.Transform[fieldTypeName] = properties;
};

Lyte.registerValidator = function (customValidatorName, func) {
  if (this.customValidator.hasOwnProperty(customValidatorName)) {
    throw new Error("Custom Validator with name - " + customValidatorName + " - already exists");
  }
  this.customValidator[customValidatorName] = func;
};

Lyte.patterns = {
  email: /^([A-Za-z0-9._%\-'+/]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,22})$/,
  url: /(^(ht|f)tp(s?):\/\/[0-9a-zA-Z][-.\w]*(:[0-9])*(\/?)([a-zA-Z0-9\-.?,:'/\\+=&amp;%$#_[\]@!()*;~]*)?$)/,
  ampm: /^(AM|PM|am|pm)$/,
  hour: /^(0?[0-9]|1[0-9]|2[0-4])$/,
  minute: /^(0?[0-9]|[1-5][0-9]|60)$/,
  boolean: /^(true|false|TRUE|FALSE)$/,
  alphaNumeric: /([a-zA-Z0-9])+/,
  alphabetsOnly: /([a-zA-Z])+/,
  numeric: /([0-9])+/,
  phoneNo: /^[0-9a-zA-Z+.()\-;\s]+$/
};

Lyte.validate = function (object, key, value, component) {
  var definition = component.__data[key];
  var isError = false;
  var type = definition ? definition.type : undefined;
  for (var defKey in definition) {
    isError = Lyte.checkProperty(defKey, value, key, definition[defKey], object, type);
    if (isError !== true) {
      return isError;
    }
  }
  return false;
};

Lyte.registerPattern = function (patternName, pattern) {
  this.patterns[patternName] = pattern;
};

Lyte.errorCodes = {
  ERR01: "Primary key cannot be modified", ERR02: "Mandatory field cannot be empty", ERR03: "Type of value does not match the specified data type", ERR04: "Value is greater than the maximum value allowed",
  ERR05: "Value is less than the minimum value allowed", ERR06: "Length of string/array is greater than the maximum limit allowed", ERR07: "Length of string/array is less than the minimum limit allowed",
  ERR08: "String does not match the specified pattern", ERR09: "Values in array are not unique", ERR10: "Value is not equal to the specified constant", ERR11: "Model of related field is not defined",
  ERR12: "Model of backward relation is not defined", ERR13: "Record not found", ERR14: "Model does not match the related field model", ERR15: "Error in creating a record as a relation",
  ERR16: "Record with primary key already exists", ERR17: "Value cannot be changed because record has been deleted", ERR18: "Action not defined", ERR19: "Model not defined",
  ERR20: "Key not specified", ERR21: "'belongsTo' relationship expects a single object/id", ERR22: "Type not specified for polymorphic relation", ERR23: "Primary Key value not present", ERR24: "Error while relating record", ERR25: "Backward relation not present"
};

Lyte.registeredGlobalEvents = {};
Lyte.triggerEvent = function () {
  var args = Array.prototype.slice.call(arguments, 1);
  var eventName = arguments[0];
  var stopEvent = false;
  var s = this.registeredGlobalEvents[eventName];
  if (!s) {
    s = this.registeredGlobalEvents[eventName] = { "listeners": [] };
  } else {
    for (var i = 0; i < s.listeners.length; i++) {
      var func = s.listeners[i];
      if (func) {
        var ret = func.apply(this, args);
        if (ret === false) {
          stopEvent = true;
          break;
        }
      }
    }
  }
  var customEvent = new CustomEvent(eventName, { "detail": args });
  if (!stopEvent) {
    document.dispatchEvent(customEvent);
  }
};

Lyte.addEventListener = function (eventName, func) {
  if (typeof func !== "function") {
    Lyte.error("Second parameter to LyteComponent.addGlobalEventListener() must be a function");
    return;
  }
  var s = this.registeredGlobalEvents[eventName];
  if (!s) {
    s = this.registeredGlobalEvents[eventName] = { "listeners": [] };
  }
  var d = s.listeners.push(func);
  return eventName + "-" + (d - 1);
};

Lyte.removeEventListener = function (id) {
  if (!id) {
    Lyte.error("listener unique id not specified");
    return;
  }
  var globalId = id.split("-");
  var s = this.registeredGlobalEvents[globalId[0]];
  if (!s || !s.listeners[globalId[1]]) {
    Lyte.error("No such listener registered");
    return;
  }
  s.listeners[globalId[1]] = null;
};

Lyte.deepCopyObject = function (obj) {
  var targetVal = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  var current,
      copies = [{ source: obj, target: targetVal }],
      keys,
      propertyIndex,
      descriptor,
      nextSource,
      indexOf,
      sourceReferences = [obj];
  var cloneObject = copies[0].target,
      targetReferences = [cloneObject];
  while (current = copies.shift()) {
    keys = Object.getOwnPropertyNames(current.source);
    for (propertyIndex = 0; propertyIndex < keys.length; propertyIndex++) {
      descriptor = Object.getOwnPropertyDescriptor(current.source, keys[propertyIndex]);
      if (!descriptor.value || _typeof(descriptor.value) != "object") {
        Object.defineProperty(current.target, keys[propertyIndex], descriptor);
        continue;
      }
      nextSource = descriptor.value;
      descriptor.value = Array.isArray(nextSource) ? [] : nextSource instanceof Set ? new Set() : Object.create(Object.getPrototypeOf(nextSource));
      indexOf = sourceReferences.indexOf(nextSource);
      if (indexOf != -1) {
        descriptor.value = targetReferences[indexOf];
        Object.defineProperty(current.target, keys[propertyIndex], descriptor);
        continue;
      }
      sourceReferences.push(nextSource);
      targetReferences.push(descriptor.value);
      Object.defineProperty(current.target, keys[propertyIndex], descriptor);
      copies.push({ source: nextSource, target: descriptor.value });
    }
  }
  return cloneObject;
};

Lyte.resolvePromises = function (promises) {
  if (typeof promises != "string") {
    if (Array.isArray(promises)) {
      return promiseArray(promises);
    } else if ((typeof promises === "undefined" ? "undefined" : _typeof(promises)) == "object") {
      return promiseHash(promises);
    }
  } else {
    return promises;
  }

  function promiseHash(promiseObj) {
    var actPromKeys = [],
        promises = [],
        promiseKeys = Object.keys(promiseObj);
    promiseKeys.forEach(function (key) {
      var value = promiseObj[key];
      if (value instanceof Promise) {
        actPromKeys.push(key);
        promises.push(value);
      }
    });
    if (!promises.length) {
      return promiseObj;
    } else {
      var obj = {},
          promise = new Promise(function (resolve, reject) {
        Promise.all(promises).then(function (data) {
          promiseKeys.forEach(function (promiseKey) {
            if (actPromKeys.indexOf(promiseKey) != -1) {
              obj[promiseKey] = data[actPromKeys.indexOf(promiseKey)];
            } else {
              obj[promiseKey] = promiseObj[promiseKey];
            }
          });
          resolve(obj);
        }, function (err) {
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
    promiseArray.every(function (item, i) {
      if (item instanceof Promise) {
        hasPromise = true;
        return false;
      }
      return true;
    });
    if (!hasPromise) {
      return promiseArray;
    }
    var promise = new Promise(function (resolve, reject) {
      Promise.all(promiseArray).then(function (data) {
        promiseArray.forEach(function (key, index) {
          array[index] = data[index];
        });
        resolve(array);
      }, function (err) {
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
  this.defProperty = function (obj, key, val) {
    var obj1 = {};
    if (val.get) {
      obj1.get = val.get;
    }
    if (val.set) {
      obj1.set = val.set;
    }
    Object.defineProperty(obj, key, obj1);
  };

  var classDef = function (_HTMLElement) {
    _inherits(classDef, _HTMLElement);

    function classDef() {
      _classCallCheck(this, classDef);

      var _this = _possibleConstructorReturn(this, (classDef.__proto__ || Object.getPrototypeOf(classDef)).call(this));

      if (constructor) {
        constructor.apply(_this, Array.from(arguments));
      }
      return _this;
    }

    return classDef;
  }(HTMLElement);

  var staticDef = definition.static;
  if (staticDef) {
    for (var key in staticDef) {
      if (_typeof(staticDef[key]) === "object") {
        this.defProperty(classDef, key, staticDef[key]);
      } else {
        Object.defineProperty(classDef, key, {
          value: staticDef[key]
        });
      }
    }
    delete definition.static;
  }
  for (var key in definition) {
    if (_typeof(definition[key]) === "object") {
      this.defProperty(classDef.prototype, key, definition[key]);
    } else {
      Object.defineProperty(classDef.prototype, key, { value: definition[key] });
    }
  }
  definition.static = staticDef[key];
  definition.constructor = constructor;
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // document is already ready to go
    customElements.define(customElementName, classDef);
  } else {
    Lyte.toBeRegistered.push({ name: customElementName, def: classDef });
  }
};

function domContentLoaded1() {
  var comp = Lyte.toBeRegistered;
  if (comp.length) {
    for (var j = 0; j < comp.length; j++) {
      customElements.define(comp[j].name, comp[j].def);
    }
    Lyte.toBeRegistered = [];
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  domContentLoaded1();
} else {
  document.addEventListener("DOMContentLoaded", function (e) {
    domContentLoaded1();
  }, true);
};"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function _router(window) {
  window.lyteRouter = function Router(routes) {
    window._router = _router;
    var newTransInfo,
        LR = this,
        definitions = {},
        dloc = document.location,
        config = {
      queryParamOptions: {}
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
        basicHooks = ["beforeModel", "model", "afterModel", "redirect", "renderTemplate", "afterRender"],
        reqestedType = { getDependencies: "dependencies", getResources: "resources" },
        stoppableHooks = ["getResources", "getDependencies", "beforeModel", "model", "afterModel"],
        processedDispatch;

    run.getResources = run.getDependencies = function (hook, index) {
      var currentRoute = this.currentRoutes[index],
          callback = currentRoute[hook],
          routeInstance = this.routeInstances[index],
          require = callHookWithoutPromise.call(this, callback, routeInstance, hook, params(index));
      currentRoute.__lp[reqestedType[hook] + 'Loaded'] = callback ? false : true;
      if (callback && !this.aborted && !this.paused) {
        currentRoute.__lp[reqestedType[hook]] = require;
        if (require && hook == "getDependencies") {
          console.log('Requesting files in getDependencies will stall execution of route till download completes. Please validate files before requesting.');
        }
        getRequirements.call(this, { reqType: reqestedType[hook], currentRoute: currentRoute, index: index });
      }
      return callHookWithPromise();
    };

    run.beforeModel = run.model = function (hook, index) {
      return callHookWithPromise.call(this, this.currentRoutes[index][hook], this.routeInstances[index], params(index));
    };

    run.afterModel = function (hook, index) {
      var routeInstance = this.routeInstances[index];
      return callHookWithPromise.call(this, this.currentRoutes[index][hook], routeInstance, routeInstance.currentModel, params(index));
    };

    run.onError = function (index, errObj) {
      consoleError(420, errObj.hook, this.routeInstances[index].routeName);
      for (; index >= 0; index--) {
        if (callAction.call(this, "onError", index, [errObj.error, this.routeTrans, params(index), errObj.hook]) == false) {
          break;
        }
      }
      if (this.paused) {
        this.abort({ state: errObj.state, internalAbort: true });
      }
    };

    run.willTransition = function (hook, index) {
      if (callAction.call(prevTrans, hook, index, [trans.routeTrans]) == false) {
        removeHook(trans.runLoop.previous, hook);
      }
      return callHookWithPromise();
    };

    run.beforeRouteTransition = function () {
      if (newTransInfo && !this.aborted) {
        newTransInfo.state = getHistoryState({ replace: newTransInfo.replace, data: trans.routeTrans.data, matched: trans.matched });
        LR.beforeRouteTransition(prevTrans && prevTrans.routeTrans || undefined, trans.routeTrans, getHistoryObj(newTransInfo));
        trans.routeTrans.state = 102;
        if (newTransInfo && trans.routeTrans.data) {
          newTransInfo.state.data = trans.routeTrans.data;
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

    run.onBeforeLoad = function () {
      trans.beforeLoadCalled = true;
      return new Promise(function (resolve, reject) {
        for (var len, i = 1; i <= trans.matched.route.length; i++) {
          len = trans.matched.route.length - i;
          if (callAction.call(trans, "onBeforeLoad", len, [params(len)]) == false || i == trans.matched.route.length) {
            resolve();
            break;
          }
        }
      });
    };

    run.redirect = function (hook, index) {
      var routeInstance = this.routeInstances[index];
      return callHookWithPromise.call(this, this.currentRoutes[index][hook], routeInstance, routeInstance.currentModel, params(index));
    };

    run.afterRender = function (hook, index) {
      this.routeInstances[index].__lp.rendered = true;
      return new Promise(function (resolve, reject) {
        var ar = setTimeout(function () {
          var routeInstance = this.routeInstances[index];
          callHookWithPromise.call(this, this.currentRoutes[index][hook], routeInstance, routeInstance.currentModel, params(index), routeInstance.component).then(function (data) {
            resolve(data);
          }, function (data) {
            reject(data);
          });
        }.bind(this, hook, index), 0);
        this.timeouteFns.push(ar);
      }.bind(this));
    };

    run.didTransition = function (hook, index) {
      return new Promise(function (resolve, reject) {
        var dt = setTimeout(function () {
          run.removeTemplate.call(this, this.runLoop.templateToRemove);
          if (callAction.call(this, hook, index, [params(index), trans.routeTrans]) == false) {
            removeHook(trans.runLoop.current, hook);
          }
          resolve();
          if (index == 0) {
            transitionCompleted({ state: 200 });
          }
        }.bind(this, hook, index), 0);
        this.timeouteFns.push(dt);
      }.bind(this));
    };

    run.beforeExit = function (hook, index) {
      var prevTransRouteInstance = prevTrans.routeInstances[index],
          callback = prevTrans.currentRoutes[index][hook];
      return callHookWithPromise.call(this, callback, prevTransRouteInstance, prevTransRouteInstance.currentModel, params(index, prevTrans));
    };

    run.renderTemplate = function (hook, index) {
      var currentRoute = this.currentRoutes[index],
          routeInstance = this.routeInstances[index];
      if (this.runLoop.templateToRemove && this.currentRoutes.length == index + 1) {
        run.removeTemplate.call(this, this.runLoop.templateToRemove);
      }
      if (this.currentRoutes[index][hook]) {
        var renderTemplate = callHookWithoutPromise.call(this, currentRoute[hook], routeInstance, hook, routeInstance.currentModel, params(index));
        if (!this.aborted) {
          run.removeTemplate.call(this, this.runLoop.templateToRemove);
          if (visibleTrans != this) {
            visibleTrans = this;
          }
          if (renderTemplate && renderTemplate.outlet) {
            routeInstance.outletName = renderTemplate.outlet;
            var data = routeInstance.currentModel,
                outlet;
            if (outlet = getOutlet(renderTemplate.outlet, routeInstance.parent)) {
              if (renderTemplate.component) {
                var component;
                if (routeInstance.component && routeInstance.component.tagName.toLocaleLowerCase() == renderTemplate.component && routeInstance.outlet == outlet && outlet.contains(routeInstance.component)) {
                  component = routeInstance.component;
                  component._route = routeInstance;
                  routeInstance.outlet = outlet;
                  routeInstance.component = component;
                  setDataInComponent.call(this, component, data);
                } else {
                  Lyte.triggerEvent("beforeTemplateDestroy", renderTemplate.outlet, routeInstance);
                  outlet.innerHTML = '';
                  component = document.createElement(renderTemplate.component);
                  component._route = routeInstance;
                  routeInstance.outlet = outlet;
                  routeInstance.component = component;
                  setDataInComponent(component, data);
                  outlet.appendChild(component);
                }
              } else if (renderTemplate.html) {
                routeInstance.component = undefined;
                routeInstance.outlet = outlet;
                Lyte.triggerEvent("beforeTemplateDestroy", renderTemplate.outlet, routeInstance);
                outlet.innerHTML = renderTemplate.html;
                var scripts = outlet.getElementsByTagName('script');
                if (scripts.length) {
                  scriptExecution(Array.from(scripts), outlet);
                }
              }
            }
          } else {
            console.warn("renderTemplate hook should return either component or HTML. Rendering of HTML directly into the DOM within the renderTemplate hook is deprecated.");
          }
        }
      }
      return callHookWithPromise();

      function setDataInComponent(component, data) {
        if (data) {
          if ((typeof data === "undefined" ? "undefined" : _typeof(data)) == "object" && !Array.isArray(data)) {
            component.setData(data);
          } else {
            processError.call(this, true, Error(getError(203)).stack, routeInstance);
          }
        }
      }

      function getOutlet(outlet, parent) {
        var _outlet;
        if (parent) {
          _outlet = parent.outletName ? document.querySelector(parent.outletName).querySelector(outlet) : undefined;
          if (!_outlet) {
            return getOutlet(outlet, parent.parent);
          }
        } else if (!(_outlet = document.querySelector(outlet))) {
          consoleError(428, outlet);
        }
        return _outlet;
      }

      function scriptExecution(scriptNode, elm) {
        for (var i = 0, scrLen = scriptNode.length; i < scrLen; i++) {
          var currentScript = scriptNode[i],
              parent = currentScript.parentNode,
              s = document.createElement("script");
          for (var j = 0, attrLen = currentScript.attributes.length; j < attrLen; j++) {
            s.setAttribute(currentScript.attributes[j].name, currentScript.attributes[j].value);
          }
          s.innerHTML = currentScript.innerHTML;
          parent.appendChild(s);
          parent.removeChild(currentScript);
        }
      }
    };

    run.removeTemplate = function (arr) {
      if (!this.routeCleared) {
        this.routeCleared = true;
        if (prevTrans && arr) {
          templateDelete(arr);
        }
        delete this.runLoop.templateToRemove;
        Lyte.removeFromCache();
      }
    };

    function params(index, t) {
      t = t || trans;
      return { queryParams: t.routeInstances[index].__lp.queryParams,
        dynamicParam: t.routeInstances[index].__lp.dynamicParam };
    }

    function addToHistory(obj) {
      var type = obj.replace ? "replaceState" : "pushState",
          url = obj.url ? config.history ? _delimit(shiftBaseURL(obj.url, true)) : '#' + _delimit(obj.url) : undefined;
      obj.title = obj.title || document.title;
      /* support for windows, undefined is appended to url */
      if (url) {
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
        meta: {
          matched: obj.matched,
          index: obj.replace && history.state && history.state.meta ? history.state.meta.index : initialLoad ? history.length - 1 : history.length
        },
        data: obj.data
      };
    }

    function getHistoryObj(obj) {
      /* parses history state to history object. */
      if (!LR.history) {
        historyRegistration();
      }
      LR.history.fromHistory = obj.fromHistory ? (LR.history.index = obj.state.meta.index) < history.length - 1 ? 'back' : 'forward' : false;
      allowHistoryChange = true;
      LR.history.state = history.state ? history.state.data : {};
      LR.history.initial = initialLoad;
      return LR.history;
    }

    this.configureDefaults = function (options) {
      options = options || {};
      config.history = options.history == "html5" ? true : false;
      config.baseURL = options.baseURL;
      config.deferInit = options.deferInit || false;
      config.queryParamOptions = {
        sticky: options.queryParamOptions && options.queryParamOptions.hasOwnProperty('sticky') ? options.queryParamOptions.sticky : true
      };
      this.__lp = {
        version: "2.0.0",
        config: config,
        getDefinition: function getDefinition(arr, def) {
          if (arr == "*") {
            return definitions;
          } else {
            def = def || definitions;
            def = _getObj(arr, def);
            return def && def.__lp || undefined;
          }
        }
      };
    };

    this.configureRoutes = function (map) {
      if (!this.__lp) {
        this.configureDefaults();
      }
      config.routes = typeof map == "function" ? parseRouteMapping.call(this, map) : map;
      if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
      } else {
        window.addEventListener('DOMContentLoaded', function () {
          init();
        });
      }
      function init() {
        /* move this code outside.*/
        if (!config.deferInit && LR.init) {
          LR.init();
          delete LR.init;
        }
      }
    };

    this.init = function (r) {
      window.onpopstate = function (onChangeEvent) {
        if (fromHistoryGo) {
          fromHistoryGo = false;
          return;
        }
        var url;
        if (config.history) {
          url = getLocation();
          if (trans && trans.url == url) {
            return;
          }
        } else {
          var newURL = onChangeEvent && onChangeEvent.newURL || dloc.hash;
          url = checkForEmptyPath(newURL.replace(/.*#/, ''));
        }
        historyObj = { fromHistory: true };
        if (onChangeEvent && history.state) {
          historyObj.data = history.state;
        }
        dispatch(url);
      };

      if (config.history) {
        if (getLocation()) {
          window.onpopstate();
        }
      } else {
        historyObj = { fromHistory: true };
        dispatch(getLocation());
      }
      linkToRegistration();
      return this;
    };

    this.beforeRouteTransition = this.afterRouteTransition = function () {};

    function setRouteDef(dir, value) {
      var cache = definitions,
          dirLen = dir.length - 1;
      dir.forEach(function (key, i) {
        if (dirLen === i) {
          if (cache[key]) {
            cache[key].__lp = value;
          } else {
            cache[key] = { __lp: value };
          }
        } else if (!cache[key]) {
          cache[key] = {};
        }
        cache = cache[key];
      });
    }

    function linkToRegistration() {
      var LinkTo = function (_HTMLElement) {
        _inherits(LinkTo, _HTMLElement);

        function LinkTo() {
          _classCallCheck(this, LinkTo);

          return _possibleConstructorReturn(this, (LinkTo.__proto__ || Object.getPrototypeOf(LinkTo)).apply(this, arguments));
        }

        _createClass(LinkTo, [{
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(attr, oldValue, newValue) {
            if (this.hasAttribute("lyte-rendered") && this._linkCreated) {
              var firstChild = this.children[0];
              //If attr is ltProp
              if (attr === "lt-prop") {
                this.handleLtProp();
                if (!this.hasAttribute("lt-prop-custom")) {
                  this.setCustomAttributes(firstChild, true);
                }
                if (!this.pendingCallback) {
                  this.pendingCallback = true;
                  setTimeout(function () {
                    this.pendingCallback = false;
                    this.getMatchedObject();
                  }.bind(this), 0);
                }
                if (firstChild.tagName === "A") {
                  this.constructHref(firstChild);
                }
              }
              //if it is a route transition attribute
              else if (/^(lt-prop-route|lt-prop-fragment|lt-prop-dp|lt-prop-qp)$/.test(attr)) {
                  this.getMatchedObject();
                  if (firstChild.tagName === "A") {
                    this.constructHref(firstChild, attr, oldValue, newValue);
                  }
                }
                //for rest of the attributes
                else if (!this.hasAttribute('lt-prop-custom')) {
                    firstChild.setAttribute(attr.substring(8), newValue);
                  }
            }
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            this.ltProp = this.ltProp || {};
            if (this.hasAttribute("lyte-rendered")) {
              this._linkCreated = true;
              this.getMatchedObject();
              return;
            }
            this.handleLtProp();
            var isCustom = this.hasAttribute("lt-prop-custom") || this.ltProp.custom,
                linkTag = void 0;
            if (isCustom) {
              //To set the matched object. 
              this.getMatchedObject();
              if (this.children[0].tagName === "A") {
                //update only href.
                this.constructHref(this.children[0]);
              }
            } else {
              linkTag = document.createElement("a");
              var length = this.childNodes.length;
              for (var i = 0; i < length; i++) {
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
            if (LyteComponent) {
              this._linkToEventId = LyteComponent.addLyteEventListener(this, "click", function (event) {
                linkToEventListener(event, this);
              }, this);
            } else {
              this.addEventListener("click", linkToEventListener);
            }
            //linkToEventListener(this);
            this._linkCreated = true;
          }
        }, {
          key: "modifyLinkToTagsInRoute",
          value: function modifyLinkToTagsInRoute(remove) {
            var def = definitions;
            var routes = remove && remove != true ? remove : this.matched.route;
            if (!routes) {
              consoleError(498, "route", "link-to");
              return;
            }
            routes = dotSerperator(routes);
            routes.forEach(function (r) {
              def = _getObj(r, def);
              if (!def || !def.__lp) {
                Error(getError(422, this.matched.target));
                return false;
              }
              var definition = def.__lp.__lp;
              if (remove) {
                definition.linkTags.splice(definition.linkTags.indexOf(this), 1);
              } else {
                definition.linkTags.push(this);
              }
            }.bind(this));
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            if (this._linkToEventId && !LyteComponent.ignoreDisconnect) {
              this.modifyLinkToTagsInRoute(true);
              LyteComponent.removeLyteEventListener(this, this._linkToEventId);
            }
          }
        }, {
          key: "handleLtProp",
          value: function handleLtProp() {
            var ltProp = this.getAttribute("lt-prop");
            if (ltProp) {
              try {
                var jsonObj = JSON.parse(ltProp);
                this.ltProp = jsonObj;
              } catch (e) {
                console.warn("Error while parsing ltProp in link-to");
              }
            }
          }
        }, {
          key: "setCustomAttributes",
          value: function setCustomAttributes(linkTag, onlyLtProp) {
            for (var key in this.ltProp) {
              if (/^(id|class|style|target)$/.test(key)) {
                linkTag.setAttribute(key, this.ltProp[key]);
              }
            }
            if (!onlyLtProp) {
              var attrs = this.attributes;
              for (var i = 0; i < attrs.length; i++) {
                var attrName = attrs[i].nodeName;
                if (attrName !== "lt-prop" && /^(lt-prop-id|lt-prop-class|lt-prop-style|lt-prop-target)$/.test(attrName)) {
                  linkTag.setAttribute(attrName.substring(8), attrs[i].nodeValue);
                }
              }
            }
          }
        }, {
          key: "constructHref",
          value: function constructHref(linkTag, attr, oldValue, newValue) {
            var href = void 0;
            if (href = LR.getURL(this.matched)) {
              linkTag.setAttribute("href", href);
              if (attr) {
                if (attr == "lt-prop-route") {
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
        }], [{
          key: "observedAttributes",
          get: function get() {
            return ['lt-prop-route', 'lt-prop-dp', 'lt-prop-fragment', 'lt-prop-qp', 'lt-prop', 'lt-prop-class', 'lt-prop-id', 'lt-prop-rel', 'lt-prop-title', 'lt-prop-style', 'lt-prop-target'];
          }
        }]);

        return LinkTo;
      }(HTMLElement);

      LinkTo.prototype.getMatchedObject = function (reset) {
        var matched = reset ? {} : this.matched ? this.matched : {};
        matched.route = this.getAttribute("lt-prop-route") || this.ltProp.route;
        matched.fragment = this.getAttribute("lt-prop-fragment");
        var dynamicParams = this.getAttribute("lt-prop-dp") || this.ltProp.dp || [],
            queryParams = this.getAttribute("lt-prop-qp") || this.ltProp.qp || {};
        if (!(dynamicParams instanceof Array)) {
          try {
            matched.dynamicParams = JSON.parse(dynamicParams) || [];
          } catch (e) {
            consoleError(498, "dynamicParams", "link-to");
            matched.dynamicParams = [];
            return;
          }
        } else {
          matched.dynamicParams = [];
        }
        if (!(queryParams instanceof Object)) {
          try {
            matched.queryParams = JSON.parse(queryParams);
          } catch (e) {
            consoleError(498, "queryParams", "link-to");
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
      if (event.button == 2 || event.defaultPrevented) {
        return;
      }
      var targetElem = linkTo || event.currentTarget;
      if (targetElem.children[0].tagName === "A" && (event.ctrlKey == true || event.metaKey == true || event.which == 2 || targetElem.children[0].hasAttribute("target") && targetElem.children[0].getAttribute("target") !== "_self")) {
        return;
      }
      event.preventDefault();
      var currentTransition = LR.getRouteInstance().transition,
          transitionInstance;
      if (currentTransition && LR.checkIfSameRoute(targetElem.matched, currentTransition.info) && targetElem.hasAttribute("lt-prop-refresh-route")) {
        transitionInstance = LR.getRouteInstance(targetElem.getAttribute("lt-prop-refresh-route")).refresh();
      } else {
        transitionInstance = LR.transitionTo(targetElem.matched);
      }
      var transObj = {};
      if (targetElem.getAttribute("lt-prop-trans")) {
        try {
          transObj = JSON.parse(targetElem.getAttribute("lt-prop-trans"));
        } catch (e) {
          consoleError(498, "lt-prop-trans", "link-to");
        }
      }

      var transitionData = targetElem.getAttribute("lt-prop-td");
      transitionData = transitionData || transObj.data;
      if (transitionData) {
        if (typeof transitionData === "string") {
          try {
            transitionData = JSON.parse(transitionData);
          } catch (e) {
            consoleError(498, "lt-prop-td", "link-to");
          }
        }
        transObj.data = transitionData;
      }
      for (var key in transObj) {
        transitionInstance[key] = transObj[key];
      }
    }

    this.checkIfSameRoute = function (transInfo1, transInfo2) {
      if (transInfo1.route == transInfo2.route && transInfo1.dynamicParams.length === transInfo1.dynamicParams.length && _compareObj(transInfo1.queryParams, transInfo2.queryParams)) {
        if (transInfo1.dynamicParams.length) {
          for (var i = 0; i <= transInfo1.dynamicParams.length; i++) {
            return transInfo1.dynamicParams[i] == transInfo2.dynamicParams[i];
          }
        }
        return true;
      }
      return false;
    };

    this.addRoutes = function (map) {
      console.warn("addRoutes function will be deprecated from next version");
      Object.assign(config.routes, parseRouteMapping.call(routeParser, map));
    };

    function dotSerperator(str) {
      return str.split('.').filter(function (s) {
        return s != "";
      });
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
        route: function route(routeName, obj, nestedFn) {
          if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object") {
            if (!obj.path) {
              obj.path = _delimit(routeName);
            }
            if (_presence(obj.path, "?")) {
              var split = obj.path.split('?');
              obj.defQP = Router.frameQueryParams(split[1]);
              obj.path = split[0];
            } else if (obj.queryParams) {
              obj.defQP = obj.queryParams;
              delete obj.queryParams;
            }
          } else {
            if (typeof obj == "function") {
              nestedFn = obj;
            }
            obj = { path: _delimit(routeName) };
          }
          if (obj.path == '/') {
            mapObj = _getObj(pathStringArr, routeHash)[obj.path] = { __lp: {} };
            pathStringArr.push('/');
          } else {
            var trimedPath = obj.path;
            mapObj = _getObj(pathStringArr, routeHash)[obj.path] = { __lp: {} };
            if (dynamicRouteCheck(trimedPath) || wildcardRouteCheck(trimedPath)) {
              _splitPath(trimedPath).every(function (seg, index, arr) {
                if (dynamicRouteCheck(seg)) {
                  obj.dynamicKey = mapObj.__lp.dynamicKey = seg.replace(":", "");
                  obj.dynamicIndex = mapObj.__lp.dynamicIndex = index;
                  return false;
                } else if (wildcardRouteCheck(seg)) {
                  obj.dynamicKey = mapObj.__lp.dynamicKey = seg.replace("*", "");
                  obj.dynamicIndex = mapObj.__lp.dynamicIndex = index;
                  obj.wildcard = mapObj.__lp.wildcard = true;
                  obj.sufix = mapObj.__lp.sufix = [];
                  for (var indx = index + 1; indx < arr.length; indx++) {
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
          routeStringArr.forEach(function (r, index) {
            if (index + 1 != routeStringArr.length) {
              routes = routes[r];
            }
          });
          routes[routeName] = { __lp: obj };
          if (nestedFn) {
            nestedFn.call(this, {});
          }
          routeStringArr.pop();
          pathStringArr.pop();
        }
      };
      map.call(routeParser, {});
      Lyte.time('parseRouteMapping');
      return routesObj;
    }

    this.replaceWith = function () {
      var args = normalizeTransitionParams.apply(this, arguments);
      if (args) {
        args.replace = true;
        return routeTransition(args);
      }
    };

    this.transitionTo = function () {
      var matched;
      if (matched = normalizeTransitionParams.apply(this, arguments)) {
        return routeTransition(matched);
      }
    };

    this.getURL = function () {
      var url, matched;
      if (matched = normalizeTransitionParams.apply(this, arguments)) {
        url = constructURLFromRoute(matched);
      }
      return config.history ? shiftBaseURL(url, true) : '#' + url;
    };

    this.getRoute = function (url) {
      var matched = traverse(shiftBaseURL(url), true);
      if (matched) {
        matched.dynamicParams = matched.dynamicParams.filter(_arrayClean);
        matched.route = matched.route.join('.');
      }
      return matched;
    };

    function routeTransition(matched) {
      if (matched) {
        if ((typeof matched === "undefined" ? "undefined" : _typeof(matched)) == "object") {
          var url;
          newTransInfo = { replace: matched.replace, title: trans ? trans.title : document.title, fromHistory: false };
          url = dispatchTransition(matched);
          Lyte.log('Transitioning to ' + matched.route.join('.') + ' ' + url, logger);
        } else {
          consoleError(498, JSON.stringify(matched));
        }
        return trans.routeTrans;
      } else {
        consoleError(499);
      }
    }

    function getLocation() {
      if (config.history) {
        var path = checkForEmptyPath(dloc.pathname + dloc.search + (dloc.hash || ""));
        path = shiftBaseURL(path);
        return _delimit(path);
      } else {
        return _delimit(checkForEmptyPath(dloc.hash.replace(/^(#\/|#|\/)/, '')));
      }
    }

    function checkForEmptyPath(path) {
      if (!path) {
        addToHistory({
          replace: true,
          state: getHistoryState({
            replace: true,
            data: history.state && history.state.data || undefined
          }),
          url: path = '/'
        });
      }
      return path;
    }

    function shiftBaseURL(path, append) {
      var baseURL = config.baseURL;
      if (baseURL && path) {
        baseURL = _delimit(config.baseURL);
        if (path.indexOf(baseURL) == 0 && !append) {
          return path.replace(baseURL, '');
        } else if (append && path.indexOf(baseURL) == -1) {
          return baseURL + path;
        }
      }
      return path;
    }

    function constructURLFromRoute(matched) {
      if (matched) {
        if (matched.route && !Array.isArray(matched.route)) {
          matched.route = dotSerperator(matched.route);
        }
        var sameRoute = trans ? true : false,
            refreshModel = false,
            qp,
            def = definitions,
            routeObj = config.routes,
            url = '';
        matched.route.forEach(function (route, index) {
          if (sameRoute && trans && trans.matched.route[index] != route) {
            sameRoute = false;
          }
          var _route = matched.route.slice(0, index + 1);
          routeObj = _getObj(route, routeObj);
          def = _getObj(route, def);
          if (!routeObj && !routeObj.__lp) {
            consoleError(422, _route.join('.'));
            return false;
          }
          var path = routeObj.__lp.path;
          if (!def || !def.__lp) {
            if (defaultQP = routeObj.__lp.defQP) {
              for (var key in defaultQP) {
                if (matched.queryParams && !matched.queryParams.hasOwnProperty(key)) {
                  matched.queryParams[key] = defaultQP[key];
                }
              }
            }
          } else if (def.__lp.queryParams) {
            var defaultQP = routeObj.__lp.defQP,
                queryParamsDef = def.__lp.__lp.queryParamsDef;
            for (var key in queryParamsDef) {
              if (!matched.queryParams.hasOwnProperty(key)) {
                if (sameRoute && queryParamsDef[key].sticky) {
                  matched.queryParams[key] = def.__lp.__lp.queryParams[key];
                } else if (defaultQP && defaultQP.hasOwnProperty(key)) {
                  matched.queryParams[key] = defaultQP[key];
                }
              }
              if (!refreshModel && queryParamsDef[key].refreshModel) {
                matched.refreshModel = true;
              }
            }
          }
          if (routeObj.__lp.dynamicKey) {
            var dynamicPathSplit = _splitPath(path);
            if (!matched.dynamicParams || matched.dynamicParams[index] == undefined) {
              consoleError(499, route);
              return false;
            } else {
              dynamicPathSplit[routeObj.__lp.dynamicIndex] = encodeURI(matched.dynamicParams[index]);
              url += _delimit(dynamicPathSplit.join('/'));
            }
          } else {
            url += _delimit(path);
          }
        }.bind(this));
        url = url[url.length - 1] == '/' && url.length != 1 ? url.slice(0, -1) : url;
        qp = Object.keys(matched.queryParams).filter(function (key) {
          return matched.queryParams[key] == undefined ? false : key;
        });
        if (matched.queryParams && qp.length) {
          url += '?';
          qp.forEach(function (key, index) {
            url += key + '=' + encodeURIComponent(matched.queryParams[key]) + (index < qp.length - 1 ? '&' : '');
          });
        }
        if (config.history && matched.fragment) {
          url = url + "#" + matched.fragment;
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
        get: function get() {
          return history.state.data;
        },
        set: function set(data) {
          if (allowHistoryChange) {
            allowHistoryChange = false;
          } else {
            console.warn('setting on data will not be pushed to history. If needed, use `Lyte.Router.history.replaceState`.');
          }
          return data;
        }
      });

      History.prototype.replaceState = function () {
        stateChange.apply(Array.from(arguments).push(true));
      };

      History.prototype.pushState = function () {
        stateChange.apply(Array.from(arguments));
      };

      function stateChange(data, title, url, replace) {
        addToHistory({
          state: {
            meta: replace ? history.state.meta : history.state.meta + 1,
            data: data
          },
          title: title,
          url: url
        });
      }
    }

    function dispatch(path, processed) {
      Lyte.time('RouteTransition');
      if (trans && (trans.routeTrans.state && trans.routeTrans.state == 102 || prevTrans && trans != prevTrans)) {
        clearTimeout(invokeRunLoop);
        trans.abort({ state: 409, internalAbort: true });
      }
      processed = processed || (!initialLoad && history.state && history.state.meta && history.state.meta.matched ? setParamsInDef(history.state.meta.matched) : traverse(path));
      if (processed && processed.matched.route.length) {
        processed.prevTrans = processed.prevTrans || prevTrans;
        invoke(path, processed);
        invokeRunLoop = setTimeout(function () {
          Lyte.time('constructRunLoop');
          processed.previous = true;
          trans.runLoop = constructRunLoop(processedDispatch = processed);
          if (newTransInfo && trans.routeTrans.data) {
            newTransInfo.data = trans.routeTrans.data;
          }
          trans.running = true;
          trans.run();
          Lyte.time('constructRunLoop');
        }, 0);
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
        if (!currentRoute.queryParams && !currentRoute.__lp.dynamicParam) {
          return true;
        }
        if (currentRoute.__lp.dynamicParam && prevMatched.dynamicParams[index] != matched.dynamicParams[index]) {
          return false;
        } else if (currentRoute.queryParams) {
          currentRoute.queryParams.every(function (key) {
            if (same && currentRoute.__lp.queryParamsDef[key].refreshModel && (matched.queryParams || prevMatched.queryParams) && matched.queryParams[key] != prevMatched.queryParams[key]) {
              return same = false;
            } else {
              return true;
            }
          });
        }
        return same;
      }

      if (prevTrans) {
        var prevMatched = prevTrans.matched;
        matched.route.forEach(function (route, index) {
          if (similar && route == prevMatched.route[index]) {
            currentRoute = currentRoutes ? currentRoutes[index] : LR.__lp.getDefinition(route.slice(0, index));
            if (like && compareRoute(index)) {
              if (prevTrans.routeInstances[index].__lp.rendered) {
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
            if (templateToRemove == undefined && prevTrans.routeInstances[index] && prevTrans.routeInstances[index].__lp.rendered) {
              templateToRemove = index;
            }
            unRendered.push(route);
          }
        });
        if (prevMatched.route.length > matched.route.length) {
          var index = matched.route.length;
          if (templateToRemove == undefined && prevTrans.routeInstances[index].__lp.rendered) {
            templateToRemove = index;
          }
        }
      } else {
        unRendered = unRendered.concat(matched.route);
      }
      return {
        rendered: rendered,
        unRendered: unRendered,
        common: common,
        templateToRemove: templateToRemove
      };
    }

    function constructRunLoop(processed) {
      var transComparison = processed.transComparison || getTransitionDiffernce(prevTrans, processed.matched, processed.currentRoutes),
          runLoop = [],
          forceFetch = {
        beforeModel: [],
        model: [],
        afterModel: []
      },
          req = [],
          b4Exit = [],
          willTransit = [],
          didTransit = [];

      if (processed.previous) {
        var b4RouteTrans = [{ hook: 'beforeRouteTransition' }];
        if (prevTrans) {
          for (var i = prevTrans.matched.route.length - 1; i >= 0; i--) {
            if (prevTrans.matched.route[i] && prevTrans.matched.route[i] != trans.matched.route[i]) {
              b4Exit.push({ hook: "beforeExit", index: i });
            }
            willTransit.push({ hook: "willTransition", index: i });
          }
          return { previous: willTransit.concat(b4Exit.concat(b4RouteTrans)), current: [], forceFetch: [] };
        }
        return { previous: b4RouteTrans, current: [], forceFetch: [] };
      }
      if (transComparison.rendered && transComparison.rendered.length) {
        transComparison.rendered.forEach(function (hook, index) {
          trans.routeInstances[index].__lp.rendered = true;
          runLoop.push({ hook: "redirect", index: index });
          didTransit.push({ hook: "didTransition", index: trans.matched.route.length - index - 1 });
        });
      }
      if (transComparison.unRendered && transComparison.unRendered.length) {
        transComparison.unRendered.forEach(function (hook, index) {
          index = transComparison.rendered.length + index;
          if (transComparison.executed && transComparison.executed.index == index) {
            if (transComparison.executed.hook == "getResources") {
              req.push({ hook: "getDependencies", index: index });
            }
          } else {
            req.push({ hook: "getResources", index: index });
            req.push({ hook: "getDependencies", index: index });
          }
          var routeInstance = trans.routeInstances[index];
          if (typeof routeInstance.forceFetch == "function" ? callHookWithoutPromise.call(this, routeInstance.forceFetch, routeInstance, "forceFetch", params(index)) : routeInstance.forceFetch) {
            ["beforeModel", "model", "afterModel"].forEach(function (h) {
              forceFetch[h].push({ hook: h, index: index });
            });
            processed.currentRoutes[index]._fetchStatus = "pending";
            ["redirect", "renderTemplate", "afterRender"].forEach(function (h) {
              runLoop.push({ hook: h, index: index });
            });
          } else {
            var resume = false;
            basicHooks.forEach(function (h) {
              if (transComparison.executed && transComparison.executed.index == index) {
                if (transComparison.executed.hook == h || resume) {
                  if (h == "redirect") {
                    runLoop.push({ hook: h, index: index });
                  }
                  if (!resume) {
                    resume = true;
                  } else {
                    runLoop.push({ hook: h, index: index });
                  }
                }
              } else {
                runLoop.push({ hook: h, index: index });
              }
            });
          }
          didTransit.push({ hook: "didTransition", index: trans.matched.route.length - index - 1 });
        });
      }

      runLoop = {
        previous: [],
        current: req.concat(runLoop).concat(didTransit),
        forceFetch: forceFetch
      };
      runLoop.templateToRemove = prevTrans && prevTrans.runLoop.templateToRemove ? prevTrans.runLoop.templateToRemove : [];
      if (transComparison.templateToRemove != undefined) {
        runLoop.templateToRemove.push({ index: transComparison.templateToRemove, routeInstances: prevTrans.routeInstances });
      }
      return runLoop;
    }

    function invoke(path, processed) {
      LR.__lp.trans = trans = new Transition(processed);
      trans.url = path;
      trans.runLoop = { previous: [], current: [], forceFetch: [] };
      trans.routeTrans = limitTransition(trans);
      trans.routeInstances = Router.initRoute(processed);
      if (historyObj) {
        newTransInfo = historyObj;
        trans.routeTrans.data = history.state ? history.state.data : {};
        historyObj.replace = true;
        historyObj = undefined;
      } else if (trans.routeTrans.data) {
        LR.history.replaceState(trans.routeTrans.data);
      }
    }

    function _getObj(arr, obj) {
      if (!obj) {
        consoleError(getError(498));
        return;
      } else if (!arr) {
        return obj;
      } else if (!Array.isArray(arr) && typeof arr == 'string') {
        arr = dotSerperator(arr);
      }
      arr.every(function (key) {
        if (obj && obj[key]) {
          obj = obj[key];
          return true;
        }
        return obj = false;
      });
      return obj;
    }

    function abortRunningPromises(trans) {
      if (trans.runningPromise) {
        trans.runningPromise.reject('aborted');
      }
      if (trans.forcedRunningPromise) {
        trans.forcedRunningPromise.reject('aborted');
      }
    }

    function Transition(processed) {
      this.matched = processed.matched;
      this.target = processed.matched.target;
      this.timeouteFns = [];
      this.info = {
        route: processed.matched.target,
        queryParams: processed.matched.queryParams,
        dynamicParams: processed.matched.dynamicParams.filter(_arrayClean)
      };
      if (processed.matched.fragment) {
        this.info.fragment = processed.matched.fragment;
      }
      this.currentRoutes = processed.currentRoutes;
      this.aborted = this.paused = false;
      this.abort = function (obj) {
        if (!this.aborted) {
          abortRunningPromises(this);
          this.timeouteFns.forEach(function (callback) {
            clearTimeout(callback);
          });
          this.aborted = true;
          if (!obj) {
            obj = { state: 308 };
          }
          Lyte.log('Transition aborted.', logger);
          if (!obj.internalAbort) {
            delete this.runLoop.templateToRemove;
            if (prevTrans.url != getLocation() && this.routeTrans.state == 201) {
              fromHistoryGo = true;
              if (history.state && history.state.meta && history.state.meta.index != undefined && history.state.meta.index < history.length) {
                history.go(1);
              } else {
                history.go(-1);
              }
            }
          }
          transitionCompleted(obj);
        }
      }.bind(this);
      this.pause = function () {
        if (!this.paused) {
          Lyte.log('Transition paused.', logger);
          abortRunningPromises(this);
          this.routeTrans.state = 307;
          this.paused = trans.currentPromise || true;
          this.resume = this.routeTrans.resume = function (t) {
            t = t || this;
            delete t.routeTrans.resume;
            delete t.resume;
            Lyte.log('Transition resumed.', logger);
            if (t.paused) {
              if (t.paused != true) {
                var state = t.paused.state;
                if (t.runLoop[state][0] && t.runLoop[state][0].hook == t.paused.hook && t.runLoop[state][0].index == t.paused.index) {
                  removeHook(t.runLoop[state], t.paused.hook, t.paused.index);
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
      Lyte.injectResources(currentRoute.__lp[reqType], function () {
        //callback after every file request
      }, function (successFiles, errorFiles) {
        currentRoute.__lp[reqType + 'Loaded'] = true;
        if (!errorFiles.length) {
          if (trans.pending && trans.pending[reqType] != undefined && trans.pending[reqType] == index) {
            trans.run();
          }
        } else {
          if (!self.aborted) {
            if (!self.paused) {
              self.pause();
            }
            run.onError.call(self, index, { state: 424, error: currentRoute.__lp[errorType] = errorFiles, hook: hook });
          }
        }
      });
    }

    var requirements = {
      get: function get(def, type) {
        return def.__lp[type + 'Loaded'] != false;
      }
    };

    function templateDelete(arr) {
      arr.forEach(function (obj) {
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
      return _presence(stoppableHooks, hook);
    }

    function callHookWithPromise(callback, instance) {
      if (callback) {
        var args = arguments,
            resp,
            hook = trans.currentPromise.hook,
            stopTrans = errorStoppableHook(hook),
            self = this;
        return Promise.resolve(new Promise(function (resolve, reject) {
          try {
            var result = callback.apply(instance, Array.from(args).slice(2));
            if (stopTrans && result) {
              result = Lyte.resolvePromises(result);
            }
            resp = Promise.resolve(result);
          } catch (err) {
            processError.call(self, stopTrans, err, instance);
            return;
          }
          resp.then(function (data) {
            resolve(data);
          }, function (err) {
            consoleError(err);
            if (hook == "model") {
              instance.currentModel = err;
            }
            processError.call(self, stopTrans, err, instance);
          });
        }));
      } else {
        return Promise.resolve();
      }
    }

    function callHookWithoutPromise(callback, instance, hook) {
      if (callback) {
        var stopTrans = errorStoppableHook(hook);
        try {
          return callback.apply(instance, Array.from(arguments).slice(3));
        } catch (err) {
          processError.call(this, stopTrans, err, instance);
          return;
        }
      }
    }

    function callAction(hook, index, args) {
      var action;
      if (this.routeInstances[index].actions && (action = this.routeInstances[index].actions[hook])) {
        try {
          if (action.apply(this.routeInstances[index], args) == false) {
            return false;
          }
        } catch (e) {
          consoleError(e);
          return false;
        }
      }
    }

    function processError(stopTrans, err, instance) {
      if (trans.currentPromise) {
        var hook = trans.currentPromise.hook,
            index = trans.currentPromise.index;
        trans.pause();
        consoleError(err);
        if (!stopTrans) {
          consoleError(420, hook, instance.routeName);
          if (_presence(["willTransition", "didTransition", "beforeExit"], hook)) {
            trans.resume();
          } else {
            trans.abort({ state: 4, internalAbort: true });
          }
        } else {
          run.onError.call(this, index, { state: 420, error: err, hook: hook });
        }
      }
    }

    Transition.prototype.run = function () {
      processRunLoop.call(this);
      document.title = this.title = this.routeInstances[this.routeInstances.length - 1].title || document.title;

      function runLoopPromise(fn, fnName, loop, success, failure) {
        success = success || function () {};
        failure = failure || function (error) {
          if (error != 'aborted') {
            consoleError(error);
          }
        };
        new Promise(function (resolve, reject) {
          if (fnName == "nestedForcedPromises") {
            this.forcedRunningPromise = { resolve: resolve, reject: reject };
            fn.call(this, this.runLoop.forceFetch, resolve);
          } else {
            this.runningPromise = { resolve: resolve, reject: reject };
            fn.call(this, this.runLoop, loop, resolve);
          }
        }.bind(this)).then(success, failure);
      }

      function processRunLoop() {
        this.pending = {};
        runLoopPromise.call(this, nestedPromises, "nestedPromises", 'previous', function () {
          if (!trans.beforeLoadCalled) {
            run.onBeforeLoad();
          }
          runLoopPromise.call(this, nestedPromises, "nestedPromises", 'current');
        }.bind(this));
      }

      function nestedForcedPromises(forcedLoop, resolve, promise) {
        if (forcedLoop && forcedLoop.beforeModel.length || forcedLoop.model.length || forcedLoop.afterModel.length) {
          promise = promise || forcedLoop.beforeModel[0];
          var self = this,
              currentRoute = this.currentRoutes[promise.index],
              routeInstance = this.routeInstances[promise.index];
          promise.state = "forced";
          trans.currentPromise = promise;
          if (promise.hook == "beforeModel" && !requirements.get(routeInstance, 'dependencies')) {
            this.pending.dependencies = promise.index;
            return;
          }
          logCallbacks(promise);
          run[promise.hook].call(this, promise.hook, promise.index).then(function (data) {
            switch (promise.hook) {
              case "model":
                this.routeInstances[promise.index].currentModel = data;
                break;
              case "afterModel":
                currentRoute._fetchStatus = "completed";
                if (this.pending.forceFetch != undefined && this.pending.forceFetch == promise.index) {
                  this.run();
                }
                break;
            }
            if (this.forcedRunningPromise.resolve == resolve && promise.hook != "afterModel") {
              getObjWithIndex(forcedLoop[promise.hook], promise.index, true);
              nestedForcedPromises.call(self, forcedLoop, resolve, getObjWithIndex(forcedLoop[promise.hook == "beforeModel" ? "model" : "afterModel"], promise.index));
            }
          }.bind(this));
          if (forcedLoop.beforeModel.length > 1) {
            getObjWithIndex(forcedLoop[promise.hook], promise.index, true);
            nestedForcedPromises.call(this, forcedLoop, resolve);
          }
        }

        function getObjWithIndex(arr, index, isDelete) {
          for (var i = 0; i < arr.length; i++) {
            var prom = arr[i];
            if (prom.index == index) {
              if (isDelete) {
                arr.splice(i, 1);
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
        if (promise.hook == "beforeRouteTransition") {
          Lyte.log(hook, logger, 'MediumOrchid');
          return;
        }
        var route = promise.state == "previous" ? prevTrans.currentRoutes[index] : trans.currentRoutes[index];
        Lyte.log(hook + ' of route ' + route.routeName, logger, 'MediumOrchid');
      }

      function nestedPromises(loop, state, resolve) {
        var runLoop = loop[state];
        if (runLoop && runLoop.length) {
          var promise = runLoop[0],
              currentRoute = this.currentRoutes[promise.index];
          if (!this.aborted && !this.paused) {
            if (promise.hook == "beforeModel" && !requirements.get(currentRoute, "dependencies")) {
              this.pending.dependencies = promise.index;
              return;
            } else if (promise.hook == "renderTemplate" && !requirements.get(currentRoute, "resources")) {
              this.pending.resources = promise.index;
              return;
            } else if (promise.hook == "redirect" && currentRoute.forceFetch && currentRoute._fetchStatus == "pending") {
              if (!this.forceFetchRunning) {
                runLoopPromise.call(this, nestedForcedPromises, "nestedForcedPromises");
                this.forceFetchRunning = true;
              }
              this.pending.forceFetch = promise.index;
              return;
            } else {
              promise.state = state;
              trans.currentPromise = promise;
              logCallbacks(promise);
              Lyte.time(promise.hook + promise.index);
              run[promise.hook].call(this, promise.hook, promise.index).then(function (data) {
                Lyte.time(promise.hook + promise.index);
                if (promise.hook == "model") {
                  this.routeInstances[promise.index].currentModel = data;
                }
                if (this.runningPromise.resolve == resolve) {
                  removeHook(loop[state], promise.hook, promise.index);
                  nestedPromises.call(this, loop, state, resolve);
                }
              }.bind(this));
            }
          }
        } else if (resolve) {
          resolve();
        }
      }
    };

    function removeHook(loop, hook, index) {
      for (var i = 0; i < loop.length; i++) {
        var obj = loop[i];
        if (obj.hook == hook) {
          if (index != undefined) {
            if (index == obj.index) {
              loop.splice(i, 1);
              break;
            }
          } else {
            loop.splice(i, 1);
            i--;
          }
        }
      }
    }

    Router.frameQueryParams = function (url) {
      if (url && _presence(url, "=")) {
        var qp = {},
            params = _presence(url, "?") ? url.split("?")[1] : url;
        params = _presence(params, "&") ? params.split(/&/g) : [params];
        params.forEach(function (param) {
          var split = param.split('=');
          qp[split[0]] = split[1] ? decodeURIComponent(split[1]) : split[1];
        });
        return qp;
      }
      return;
    };

    Router.frameDynamicParams = function (url, matched) {
      if (url) {
        var _pop = function _pop(path) {
          path.forEach(function () {
            urlSplit.shift();
          });
        };

        var routesObj = config.routes,
            dynamicParam,
            framedDP = [],
            urlSplit = _splitPath(url.split('?')[0]);
        matched.route.forEach(function (r, i, arr) {
          routesObj = _getObj([r], routesObj);
          if (routesObj.__lp.wildcard) {
            if (routesObj.__lp.sufix.length) {
              var dp = urlSplit.slice(0, urlSplit.indexOf(routesObj.__lp.sufix[0]));
              framedDP.push(decodeURI(dp.join('/')));
              _pop(dp.concat(routesObj.__lp.sufix));
            } else {
              framedDP.push(decodeURI(urlSplit.join('/')));
            }
            return;
          } else if (routesObj.__lp.dynamicKey) {
            dynamicParam = urlSplit[routesObj.__lp.dynamicIndex];
            _pop(_splitPath(routesObj.__lp.path));
            framedDP.push(decodeURI(dynamicParam));
          } else {
            _pop(_splitPath(routesObj.__lp.path));
            framedDP.push(undefined);
          }
        });
        return framedDP;
      }
    };

    function _presence(str, char) {
      return str.indexOf(char) != -1 ? true : false;
    }

    function transitionCompleted(obj) {
      if (trans.running) {
        trans.running = false;
        if (trans.routeTrans.state && trans.routeTrans.state != 201) {
          LR.afterRouteTransition(trans.routeTrans);
          trans.routeTrans.state = obj.state;
        }
        if (initialLoad || trans.routeTrans.state == 200) {
          LR.__lp.prevTrans = prevTrans = trans;
          Lyte.time('RouteTransition');
          Lyte.log('Transition completed.', logger);
          if (config.history && trans.info.fragment) {
            var elem;
            if ((elem = document.getElementById(trans.routeTrans.info.fragment)) && elem.scrollIntoView) {
              elem.scrollIntoView();
            }
          }
        } else if (obj.internalAbort || visibleTrans == trans) {
          LR.__lp.prevTrans = prevTrans = trans;
        } else {
          LR.__lp.trans = trans = prevTrans;
        }
        if (initialLoad) {
          initialLoad = false;
        }
      }
    }

    function _delimit(seg) {
      return seg[0] == "/" ? seg : "/" + seg;
    }

    function _splitPath(path) {
      return path.match(/[^/?]+/g) || [];
    }

    function validateURL(url) {
      url = url.replace(/\/\//g, '/');
      url = url.replace(/\/\?/g, '?');
      return url;
    }

    function getError(code, arr) {
      arr = Array.isArray(arr) ? arr : Array.from(arguments).slice(1);
      var errors = {
        400: "url '" + arr[0] + "' is not defined in router.",
        422: "There is no route definition for the route " + arr[0] + ".",
        498: "Invalid argument " + arr[0] + (arr[1] ? " provided in link-to." : "."),
        499: arr[0] ? "Dynamic params for the route " + arr[0] + " is not provided." : "Transition tried without arguments.",
        420: "Error on " + arr[0] + " of route " + arr[1] + ".",
        428: "There is no outlet named " + arr[0] + ".",
        203: "Data provided for component is not valid."
      };
      return 'LRE ' + code + ': ' + errors[code];
    }

    function consoleError() {
      Lyte.error(arguments[0].stack || arguments.length == 1 ? arguments[0] : getError.apply(this, arguments));
    }

    function traverse(path, get) {
      if (!path) {
        consoleError(400, '');
        return;
      }
      var selectedPaths = [],
          fragment;
      if (config.history) {
        var fragSplit = path.split('#');
        if (fragSplit[1]) {
          fragment = fragSplit[1];
          path = fragSplit[0];
        }
      }
      var pathSplit = path.split('?');
      path = decodeURI(pathSplit[0]);
      path = decodeURI(pathSplit[0]);
      var params = pathSplit[1],
          pathSplitArr = _splitPath(path);
      if (path == '/') {
        if (_getObj(['/'], routeHash)) {
          selectedPaths.push([path]);
        } else {
          consoleError(400, path);
          return;
        }
      } else {
        var checkArrayMatch = function checkArrayMatch(arr1, arr2, l, pathObj, matchedPath) {
          if (!(pathObj.__lp.wildcard || pathObj.__lp.dynamicKey)) {
            var prevObj;
            if (prevObj = _getObj(matchedPath, routeHash).__lp) {
              if (prevObj.wildcard) {
                var pathArr = arr2.slice(l);
                if (!(l += pathArr.indexOf(arr1[0]))) {
                  return false;
                }
              }
            }
          }
          for (var i = 0; i < arr1.length; i++, l++) {
            if (arr1[i] != arr2[l] && !dynamicRouteCheck(arr1[i])) {
              if (wildcardRouteCheck(arr1[i])) {
                if (pathObj.__lp.sufix.length) {
                  l = arr2.indexOf(pathObj.__lp.sufix[0]) - 1;
                }
              } else if (arr1[l] == '/') {
                l--;
              } else {
                return false;
              }
            }
          }
          return l;
        };

        var findPossibleMatch = function findPossibleMatch(mapObj) {
          for (var mapPath in mapObj) {
            if (!exactMatch) {
              var pathObj = mapObj[mapPath],
                  innerLevel;
              if (mapPath != "__lp") {
                var mapPathSplit = _splitPath(mapPath);
                if (mapPathSplit) {
                  if ((innerLevel = checkArrayMatch(mapPathSplit, pathSplitArr, pathLevel, pathObj, matchedPath)) !== false) {
                    pathArrLevel.push(innerLevel);
                    pathLevel = pathArrLevel[pathArrLevel.length - 1];
                    if (pathSplitArr.length == pathLevel) {
                      var path = Array.from(matchedPath.concat(mapPath));
                      if (pathObj["/"]) {
                        path = path.concat('/');
                      }
                      selectedPaths.push(path);
                      if (pathObj.__lp.wildcard || pathObj.__lp.dynamicKey) {
                        pathArrLevel.pop();
                        pathLevel = pathArrLevel[pathArrLevel.length - 1];
                      } else {
                        exactMatch = path;
                        return;
                      }
                    } else {
                      var innerRoutes = Object.keys(pathObj);
                      matchedPath.push(mapPath);
                      if (pathSplitArr[pathLevel]) {
                        if (pathObj.__lp.wildcard && !pathObj.__lp.sufix.length && innerRoutes.length == 1) {
                          var wildcard = Array.from(matchedPath);
                          if (pathObj["/"]) {
                            wildcard = wildcard.concat('/');
                          }
                          selectedPaths.push(wildcard);
                        } else if (innerRoutes.length > 1) {
                          findPossibleMatch(pathObj);
                        }
                      }
                      matchedPath.pop();
                      pathArrLevel.pop();
                      pathLevel = pathArrLevel[pathArrLevel.length - 1];
                    }
                  }
                }
              }
            }
          }
        };

        var pathLevel = 0,
            pathArrLevel = [0],
            exactMatch,
            matchedPath = [];
        matchedPath.dynamicParams = [];
        findPossibleMatch(routeHash);
      }
      if (exactMatch) {
        return pathProcessor(get, exactMatch, path, params);
      } else if (selectedPaths.length == 1) {
        return pathProcessor(get, selectedPaths[0], path, params);
      } else if (selectedPaths.length) {
        var refine = function refine(arr1) {
          arr1 = Array.from(arr1);
          var staticPath = 0;
          if (arr1[0] == "/") {
            staticPath++;
            arr1.shift();
          }
          var counter = -1;
          arr1.forEach(function (seg, i) {
            _splitPath(seg).forEach(function (innerSeg, j) {
              counter++;
              if (innerSeg == pathSplitArr[counter]) {
                staticPath++;
              }
            });
          });
          return staticPath;
        };

        var staticSegmentsInMatch = [],
            wildcardRoute,
            maxStaticSeg;
        for (var i = 0; i < selectedPaths.length; i++) {
          if (selectedPaths[i].length == 1) {
            wildcardRoute = selectedPaths[i];
          }
          staticSegmentsInMatch.push(refine(selectedPaths[i]));
        }
        if (maxStaticSeg = Math.max.apply(Math, staticSegmentsInMatch)) {
          return pathProcessor(get, selectedPaths[staticSegmentsInMatch.indexOf(maxStaticSeg)], path, params);
        } else if (wildcardRoute) {
          return pathProcessor(get, wildcardRoute, path, params);
        } else {
          consoleError(400, path);
        }
      } else {
        consoleError(400, path);
      }

      function pathProcessor(get, selectedPaths, path, params) {
        var newURL,
            newMatched,
            matched = {
          route: _getObj(selectedPaths, routeHash).__lp.route,
          queryParams: params ? Router.frameQueryParams(params) : {}
        };
        if (config.history) {
          matched.fragment = fragment;
        }
        matched.dynamicParams = Router.frameDynamicParams(path, matched);
        if (get) {
          return matched;
        }
        var transInfo = setParamsInDef(matched);
        if (transInfo != false) {
          newMatched = Lyte.deepCopyObject(transInfo.matched);
          newURL = constructURLFromRoute(newMatched);
          if (!_compareObj(newMatched.queryParams, matched.queryParams)) {
            historyObj = addToHistory({ replace: true, data: window.history.state, url: newURL, fromHistory: true });
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
        matched.route.every(function (r, i) {
          matched.target = matched.target ? matched.target + '.' + r : r;
          routesObj = _getObj([r], routesObj);
          def = _getObj([r], def);
          if (!def || !def.__lp) {
            throw Error(getError(422, matched.target));
          }
          r = dotSerperator(matched.target);
          var obj = def.__lp;
          matched._routes.push(r);
          if (obj.queryParams) {
            obj.__lp.queryParams = {};
            obj.queryParams.forEach(function (key) {
              obj.__lp.queryParams[key] = matched.queryParams[key];
            });
          }
          obj.__lp.dynamicParam = matched.dynamicParams[i];
          var linkTags = def.__lp.__lp.linkTags;
          if (linkTags.length) {
            linkTags.forEach(function (tag) {
              if (tag.firstChild.tagName === "A") {
                tag.firstChild.setAttribute("href", LR.getURL(tag.getMatchedObject(true)));
              }
            });
          }
          return currentRoutes.push(obj);
        });
      } catch (e) {
        consoleError(e);
        return false;
      }
      return { currentRoutes: currentRoutes, matched: matched };
    }

    this.registerRoute = function (dir, fns, options) {
      if (options && options.mixins) {
        if (!Array.isArray(options.mixins)) {
          options.mixins = [options.mixins];
        }
        options.mixins.forEach(function (mixin) {
          if (Lyte.Mixin.exists(mixin)) {
            var regMixin = Lyte.registeredMixins[mixin];
            if (regMixin) {
              for (var key in regMixin) {
                if (key == "actions") {
                  for (var action in regMixin.actions) {
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
        objPath: dir.replace(/\//g, '.'),
        linkTags: []
      };
      if (fns.queryParams) {
        fns.__lp.queryParamsDef = {};
        fns.queryParams.forEach(function (qp, i) {
          if (typeof qp == "string") {
            fns.__lp.queryParamsDef[qp] = {
              sticky: config.queryParamOptions.sticky,
              refreshModel: true
            };
          } else {
            for (var key in qp) {
              fns.__lp.queryParamsDef[key] = {
                sticky: qp[key].hasOwnProperty('sticky') ? qp[key].sticky : config.queryParamOptions.sticky,
                refreshModel: qp[key].hasOwnProperty('refreshModel') ? qp[key].refreshModel : true
              };
            }
            fns.queryParams[i] = key;
          }
        });
      }
      dir = dotSerperator(dir);
      var len = dir.length - 1;
      fns.routeName = dir[len];
      setRouteDef(dir, fns);
    };

    var transPredefined = ['runLoop', 'paused', 'currentRoutes', 'routeInstances', 'aborted', 'currentPromise', 'run', 'pending', 'matched', 'timeouteFns'];

    function limitTransition(int) {
      var routeTrans = new transition(int);
      routeTrans.state = 201;
      function transition(int) {

        for (var prop in int) {
          if (transPredefined.indexOf(prop) == -1) {
            if (prop == 'info') {
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
      return _presence(route, ":") ? true : false;
    }

    function wildcardRouteCheck(route) {
      return _presence(route, "*") ? true : false;
    }

    function _compareObj(obj1, obj2) {
      var obj1keys = Object.keys(obj1),
          obj2keys = Object.keys(obj2);
      if (obj1keys.length != obj2keys.length) {
        return false;
      } else {
        for (var key in obj1) {
          if (obj1[key] != obj2[key]) {
            return false;
          }
        }
        return true;
      }
    }

    this.getRouteInstance = function (routeName) {
      if (LR && trans && trans.routeInstances) {
        if (routeName == "*") {
          return trans.routeInstances;
        } else {
          routeName = routeName || trans.target;
          var match;
          trans.routeInstances.every(function (inst, index) {
            inst = trans.routeInstances[trans.routeInstances.length - 1 - index];
            if (inst.__lp.objPath == routeName) {
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
      if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object") {
        if (obj.route) {
          return normalizeMatchedObj(obj);
        }
      } else {
        var params = {
          queryParams: {},
          dynamicParams: []
        };
        Array.from(arguments).forEach(function (arg, index) {
          if (Array.isArray(arg)) {
            consoleError(498, JSON.stringify(arg));
            return;
          } else {
            if (index == 0) {
              params.route = arg;
            } else if ((typeof arg === "undefined" ? "undefined" : _typeof(arg)) == "object") {
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
      if (obj.route) {
        var matched = {
          route: dotSerperator(obj.route),
          queryParams: obj.queryParams || {},
          dynamicParams: [],
          fragment: obj.fragment,
          target: "",
          _routes: []
        };
        var dynamicParams = obj.dynamicParams ? Array.from(obj.dynamicParams) : [];
        try {
          matched.route.forEach(function (route, index) {
            matched.target = matched.target ? matched.target + '.' + route : route;
            var r = dotSerperator(matched.target);
            matched._routes.push(r);
            var routesObj = _getObj(matched.route.slice(0, index + 1), config.routes);
            if (routesObj) {
              matched.dynamicParams.push(routesObj.__lp.dynamicKey ? dynamicParams.shift() : undefined);
            } else {
              throw Error(getError(400, matched.target));
            }
          });
        } catch (e) {
          consoleError(e);
          return false;
        }
        return matched;
      }
    }

    var routePredefined = ["getResources", "getDependencies", "beforeModel", "model", "afterModel", "redirect", "renderTemplate", "afterRender", "beforeExit"];

    Router.initRoute = function (processed) {
      var routeObj,
          matched = processed.matched,
          len = matched.route.length,
          routeInstances = [];

      Route = function Route(fns, index, prevInstance) {
        if (prevInstance) {
          for (var key in prevInstance) {
            if (key == "__lp") {
              this.__lp = {};
              for (var key in fns.__lp) {
                if (key != "rendered") {
                  this.__lp[key] = fns.__lp[key];
                }
              }
            } else {
              this[key] = prevInstance[key];
            }
          }
          if (this.component) {
            this.component._route = this;
          }
        } else {
          for (var key in fns) {
            if (!_presence(routePredefined, key)) {
              this[key] = fns[key];
            }
          }
        }
        this.parent = routeInstances[index - 1];
        this.transition = trans.routeTrans;
        this.replaceWith = LR.replaceWith;
        this.transitionTo = LR.transitionTo;
        this.removeFromCache = function (arr) {
          Lyte.removeFromCache.assign(arr);
          return;
        };
        this.refresh = function (obj) {
          var processed = { currentRoutes: trans.currentRoutes, matched: trans.matched },
              refreshFrom = dotSerperator(this.__lp.objPath).length - 1,
              route = Array.from(matched.route);
          processed.transComparison = {
            unRendered: route.splice(refreshFrom),
            rendered: route
          };
          if (obj && obj.refreshTemplate) {
            for (var i = refreshFrom; i < matched.route.length; i++) {
              delete trans.routeInstances[i].component;
            }
          }
          newTransInfo = { replace: true, data: trans.data, fromHistory: false };
          dispatch(undefined, processed);
          return trans.routeTrans;
        };
        this.setTitle = function (title) {
          document.title = this.title = title;
        };
        this.getQueryParams = function () {
          return this.__lp.queryParams || {};
        };
        this.getDynamicParam = function () {
          return this.__lp.dynamicParam;
        };
        this.getRouteInstance = function (routeName) {
          return LR.getRouteInstance(routeName);
        };
        this.setDynamicParam = function (value) {
          if (this.__lp.dynamicParam && this.__lp.dynamicParam != value) {
            var dynamicParams = Array.from(trans.matched.dynamicParams);
            dynamicParams.splice(this.__lp.objPath.split(".").length - 1, 1, value);
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
        this.setQueryParams = function (key, value, refresh) {
          var obj = {};
          if ((typeof key === "undefined" ? "undefined" : _typeof(key)) == "object") {
            for (var i in key) {
              obj[i] = key[i];
            }
            refresh = value;
          } else {
            obj[key] = value;
          }
          var matched = {
            route: Array.from(trans.matched.route),
            dynamicParams: Array.from(trans.matched.dynamicParams),
            queryParams: Object.assign({}, trans.matched.queryParams, obj)
          };
          if (!_compareObj(trans.matched.queryParams, matched.queryParams)) {
            var url = constructURLFromRoute(matched),
                processed = setParamsInDef(matched);
            if (refresh == false || !matched.refreshModel) {
              processed.transComparison = {
                rendered: matched.route,
                unRendered: []
              };
            }
            newTransInfo = {
              data: trans.data,
              url: url,
              fromHistory: false
            };
            dispatch(url, processed);
          }
          return trans.routeTrans;
        };
        if (this.init) {
          this.init();
        }
        if (typeof LyteComponent !== "undefined") {
          this.throwEvent = LyteComponent.throwEvent;
        }
      };

      var refMatch = processed.prevTrans,
          similarRoute = true;

      for (var i = 0; i < len; i++) {
        routeObj = LR.__lp.getDefinition(trans.matched._routes[i]);
        if (!routeObj) {
          return false;
        }
        if (refMatch && similarRoute && refMatch.matched && refMatch.matched.route[i] == matched.route[i]) {
          routeInstances.push(new Route(routeObj, i, refMatch.routeInstances[i]));
        } else {
          routeInstances[i] = new Route(routeObj, i);
          similarRoute = false;
        }
      }
      return routeInstances;
    };

    function dispatchTransition(newMatch) {
      var url = newTransInfo.url = constructURLFromRoute(newMatch),
          processed = setParamsInDef(newMatch);
      dispatch(url, decideTransition(processed));
      return url;
    }

    var allHooks = ["getResources", "getDependencies", "beforeModel", "model", "afterModel", "redirect", "renderTemplate", "afterRender"];

    function decideTransition(processed) {
      if (prevTrans && trans.running) {
        var transComparison = getTransitionDiffernce(trans, processed.matched, processed.currentRoutes);
        if (trans.currentPromise) {
          var hook = trans.currentPromise.hook;
          if (trans.routeTrans.state == 102 && trans.currentPromise.state == "current" && hook != "didTransition") {
            trans.abort({ state: 308, internalAbort: true });
            var transitioningRoute = allHooks.indexOf(trans.currentPromise.hook) <= 5 ? trans.currentPromise.index : trans.currentPromise.index + 1;
            if (transComparison.common.length - 1 <= transitioningRoute) {
              var visibleTransComparison = getTransitionDiffernce(visibleTrans, processed.matched, processed.currentRoutes);
              if (transComparison.common.length < visibleTransComparison.common.length) {
                if (trans.runLoop.templateToRemove.length) {
                  trans.runLoop.templateToRemove.pop();
                }
                processed.prevTrans = visibleTrans;
                transComparison = visibleTransComparison;
              } else if (trans.currentPromise.index <= transComparison.common.length - 1) {
                transComparison.executed = trans.currentPromise;
              }
            }
          }
        }
        processed.transComparison = transComparison;
      } else {
        trans.abort({ state: 308, internalAbort: true });
      }
      return processed;
    }
    return this;
  };
  window.$LR = Lyte.Router = new lyteRouter();
})(window);