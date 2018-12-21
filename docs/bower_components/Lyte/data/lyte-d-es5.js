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
};//$Id$
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