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

Lyte = {};
Lyte.version = "1.0.6";
Lyte.registeredMixins = {};
Lyte.Mixin = {};
Lyte.debug = false;
Lyte.performance = false;
Lyte.toBeRegistered = [];
var consoleTime = [];

Lyte.Mixin.register = function (name, mixin) {
  Lyte.registeredMixins[name] = mixin;
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

Lyte.injectResources = function (files, every, completed) {
  if (files) {
    files = Array.isArray(files) ? files : [files];
    var filesLoaded = -files.length;
    files.forEach(function (file) {
      var tag,
          fileSplit = file.split('.'),
          type = fileSplit[fileSplit.length - 1],
          tags = { js: 'script', css: 'link' };
      tag = document.createElement(tags[type]);
      if (fileSplit.length == 1) {
        console.error('Type of file is not specified in injectResources.');
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
        filesLoaded++;
        if (every) {
          every.call(this, event);
        }
        if (completed && filesLoaded == 0) {
          completed();
        }
      };
      document.head.appendChild(tag);
    });
  }
};

Lyte.checkProperty = function (property, dataVal, key, fieldVal, record) {
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
      } else if (Array.isArray(dataVal)) {
        if (fieldVal != "array") {
          return { code: "ERR03", message: Lyte.errorCodes.ERR03, expected: fieldVal };
        }
      } else if (fieldVal != (typeof dataVal === "undefined" ? "undefined" : _typeof(dataVal))) {
        return { code: "ERR03", message: Lyte.errorCodes.ERR03, expected: fieldVal };
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
      if (dataVal.length > fieldVal) {
        return { code: "ERR06", message: Lyte.errorCodes.ERR06, expected: fieldVal };
      }
      break;
    case "minLength":
    case "minItems":
      if (dataVal.length < fieldVal) {
        return { code: "ERR07", message: Lyte.errorCodes.ERR07, expected: fieldVal };
      }
      break;
    case "pattern":
      if (typeof dataVal == "string" && !new RegExp(fieldVal).test(dataVal)) {
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
      } else if (dataVal != fieldVal) {
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
  if (opts == undefined) {
    opts = {};
  }
  if (this.types.indexOf(type) == -1 && !Lyte.Transform.hasOwnProperty(type)) {
    throw new Error("Not a valid field type - " + type);
  }
  opts.type = type;
  return opts;
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
  email: /([A-Za-z0-9._%\-'+/]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,22})$|[\s]+/,
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
  for (var defKey in definition) {
    isError = Lyte.checkProperty(defKey, value, key, definition[defKey], object);
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
  ERR20: "Key not specified", ERR21: "'belongsTo' relationship expects a single object/id", ERR22: "Type not specified for polymorphic relation", ERR23: "Primary Key value not present", ERR24: "Error while relating record"
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
    console.error("Second parameter to LyteComponent.addGlobalEventListener() must be a function");
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
    console.error("listener unique id not specified");
    return;
  }
  var globalId = id.split("-");
  var s = this.registeredGlobalEvents[globalId[0]];
  if (!s || !s.listeners[globalId[1]]) {
    console.error("No such listener registered");
    return;
  }
  s.listeners[globalId[1]] = null;
};

Lyte.deepCopyObject = function (obj) {
  var current,
      copies = [{ source: obj, target: Object.create(Object.getPrototypeOf(obj)) }],
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
      descriptor.value = Array.isArray(nextSource) ? [] : Object.create(Object.getPrototypeOf(nextSource));
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
  if (Array.isArray(promises)) {
    return promiseArray(promises);
  } else if ((typeof promises === "undefined" ? "undefined" : _typeof(promises)) == "object") {
    return promiseHash(promises);
  }

  function promiseHash(promiseObj) {
    var actPromKeys = [],
        promises = [],
        promiseKeys = Object.keys(promiseObj);
    promiseKeys.forEach(function (key) {
      actPromKeys.push(key);
      promises.push(promiseObj[key]);
    });
    if (!promises.length) {
      return promiseObj;
    } else {
      var obj = {},
          promise = new Promise(function (resolve, reject) {
        Promise.all(promises).then(function (data) {
          data.forEach(function (dataVal, index) {
            obj[actPromKeys[index]] = dataVal;
          });
          resolve(obj);
        }, function (err) {
          reject(err);
          console.error(err);
        });
      });
      return promise;
    }
  }

  function promiseArray(promiseArray) {
    var array = [];
    var promise = new Promise(function (resolve, reject) {
      Promise.all(promiseArray).then(function (data) {
        promiseArray.forEach(function (key, index) {
          array[index] = data[index];
        });
        resolve(array);
      }, function (err) {
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
}'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Lyte.Router = {
  definitions: {}
};
(function _router(window) {
  window._router = _router;
  var newTransInfo,
      LR = Lyte.Router,
      dloc = document.location,
      trans,
      prevTrans,
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
    get: function get(arr) {
      var routeObj = LR.definitions;
      arr.forEach(function (key) {
        routeObj = routeObj[key];
      });
      return routeObj && routeObj.$ || undefined;
    },
    set: function set(dir, value) {
      var cache = LR.definitions,
          dirLen = dir.length - 1;
      dir.forEach(function (key, i) {
        if (dirLen === i) {
          if (cache[key]) {
            cache[key].$ = value;
          } else {
            cache[key] = { $: value };
          }
        } else if (!cache[key]) {
          cache[key] = {};
        }
        cache = cache[key];
      });
    }
  },
      listener = {
    history: false,

    init: function init(fn, history) {
      var self = this;
      this.history = history;
      if (!listeners) {
        listeners = [];
      }

      function onchange(onChangeEvent) {
        listeners.forEach(function (listener) {
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

    addToHistory: function addToHistory(obj) {
      var url;
      obj.fromHistory = obj.fromHistory == undefined ? false : obj.fromHistory;
      if (obj.url) {
        url = instance.history ? _delimit(shiftBaseURL(obj.url, true)) : '#' + _delimit(obj.url);
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
    this.baseURL = configurations.baseURL;
    this.deferInit = configurations.deferInit || false;
    return this;
  };

  LR.configureDefaults = function (options) {
    configurations = options || {};
  };

  LR.removeFromCache = function (arr) {
    arr = arr == "*" ? Object.keys(availableTags) : Array.isArray(arr) ? arr : [arr];
    removeFromCache = removeFromCache.concat(arr);
    return;
  };

  LR.beforeRouteTransition = LR.afterRouteTransition = function () {};

  LR.configureRoutes = function (map) {
    instance = this.instance = new Router(typeof map == "function" ? parseRouteMapping.call(this, map) : map);
    window.addEventListener('DOMContentLoaded', function () {
      /* move this code outside.*/
      if (!instance.deferInit && LR.init) {
        LR.init();
        LR.init = undefined;
      }
    });
  };

  LR.init = function () {
    instance.init();
    linkToRegistration();
  };

  function linkToRegistration() {
    var LinkTo = function (_HTMLElement) {
      _inherits(LinkTo, _HTMLElement);

      function LinkTo() {
        _classCallCheck(this, LinkTo);

        return _possibleConstructorReturn(this, (LinkTo.__proto__ || Object.getPrototypeOf(LinkTo)).apply(this, arguments));
      }

      _createClass(LinkTo, [{
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(attr, oldValue, newValue) {
          if (this.hasAttribute("lyte-rendered") && this._linkCreated) {
            var firstChild = this.children[0];
            //If attr is ltProp
            if (attr === "lt-prop") {
              this.handleLtProp();
              if (!this.hasAttribute("lt-prop-custom")) {
                this.setCustomAttributes(firstChild, true);
              }
              this.getMatchedObject();
              if (firstChild.tagName === "A") {
                this.constructHref(firstChild);
              }
            }
            //if it is a route transition attribute
            else if (/^(lt-prop-route|lt-prop-dp|lt-prop-qp)$/.test(attr)) {
                this.getMatchedObject();
                if (firstChild.tagName === "A") {
                  this.constructHref(firstChild);
                }
              }
              //for rest of the attributes
              else if (!this.hasAttribute('lt-prop-custom')) {
                  firstChild.setAttribute(attr.substring(8), newValue);
                }
          }
        }
      }, {
        key: 'connectedCallback',
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
          this._linkCreated = true;
        }
      }, {
        key: 'handleLtProp',
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
        key: 'setCustomAttributes',
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
        key: 'constructHref',
        value: function constructHref(linkTag) {
          var matched = void 0;
          if (matched = normalizeMatchedObj(this.matched)) {
            var href = constructURLFromRoute(matched);
            href = instance.history ? shiftBaseURL(href, true) : "#" + href;
            linkTag.setAttribute("href", href);
          }
        }
      }, {
        key: 'getMatchedObject',
        value: function getMatchedObject() {
          var matched = this.matched || {};
          matched.route = this.getAttribute("lt-prop-route") || this.ltProp.route;
          var dynamicParams = this.getAttribute("lt-prop-dp") || this.ltProp.dp || [],
              queryParams = this.getAttribute("lt-prop-qp") || this.ltProp.qp || {};
          if (!(dynamicParams instanceof Array)) {
            try {
              matched.dynamicParams = JSON.parse(dynamicParams) || [];
            } catch (e) {
              console.error("Error while parsing dynamicParams in link-to.");
              matched.dynamicParams = [];
            }
          } else {
            matched.dynamicParams = [];
          }
          if (!(queryParams instanceof Object)) {
            try {
              matched.queryParams = JSON.parse(queryParams);
            } catch (e) {
              console.error("Error while parsing queryParams in link-to.");
              matched.queryParams = {};
            }
          } else {
            matched.queryParams = {};
          }
          this.matched = matched;
        }
      }], [{
        key: 'observedAttributes',
        get: function get() {
          return ['lt-prop-route', 'lt-prop-dp', 'lt-prop-qp', 'lt-prop', 'lt-prop-class', 'lt-prop-id', 'lt-prop-rel', 'lt-prop-title', 'lt-prop-style', 'lt-prop-target'];
        }
      }]);

      return LinkTo;
    }(HTMLElement);

    customElements.define('link-to', LinkTo);
  }

  document.addEventListener("click", function (event) {
    if (event.button == 2) {
      return;
    }
    var targetElem = event.target || event.srcElement;
    while (targetElem) {
      if (targetElem.nodeName === "LINK-TO") {
        break;
      } else {
        targetElem = targetElem.parentNode;
      }
    }
    if (targetElem) {
      if (targetElem.children[0].tagName === "A" && (event.ctrlKey == true || event.metaKey == true || event.which == 2 || targetElem.children[0].hasAttribute("target") && targetElem.children[0].getAttribute("target") !== "_self")) {
        return;
      }
      event.preventDefault();
      var currentTransition = Lyte.Router.getRouteInstance().transition,
          transitionInstance;
      if (currentTransition && LR.checkIfSameRoute(targetElem.matched, currentTransition.info) && targetElem.hasAttribute("lt-prop-refresh-route")) {
        transitionInstance = LR.getRouteInstance(targetElem.getAttribute("lt-prop-refresh-route")).refresh();
      } else {
        transitionInstance = LR.transitionTo(targetElem.matched);
      }
      var transObj = {};
      if (targetElem.getAttribute("lt-prop-trans")) {
        try {
          transObj = JSON.parse("lt-prop-trans");
        } catch (e) {}
      }

      transitionData = targetElem.getAttribute("lt-prop-td");
      transitionData = transitionData || transObj.data;
      if (transitionData) {
        if (typeof transitionData === "string") {
          try {
            transitionData = JSON.parse(transitionData);
          } catch (e) {}
        }
        transObj.data = transitionData;
      }
      for (var key in transObj) {
        transitionInstance[key] = transObj[key];
      }
    }
  }, true);

  LR.checkIfSameRoute = function (transInfo1, transInfo2) {
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

  LR.addRoutes = function (map) {
    Object.assign(this.instance.routes, parseRouteMapping.call(this, map));
  };

  function parseRouteMapping(map) {
    Lyte.time('parseRouteMapping');
    var routesObj = {},
        mapObj = {},
        pathStringArr = [],
        routeStringArr = [],
        pathString;
    this.route = function route(routeName, obj, nestedFn) {
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == "object") {
        if (!obj.path) {
          obj.path = _delimit(routeName);
        };
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
        mapObj = _getObj(pathStringArr, routeHash)[obj.path] = { $: {} };
        pathStringArr.push('/');
      } else {
        var trimedPath = obj.path;
        mapObj = _getObj(pathStringArr, routeHash)[obj.path] = { $: {} };
        if (dynamicRouteCheck(trimedPath) || wildcardRouteCheck(trimedPath)) {
          _splitPath(trimedPath).every(function (seg, index, arr) {
            if (dynamicRouteCheck(seg)) {
              obj.dynamicKey = mapObj.$.dynamicKey = seg.replace(":", "");
              obj.dynamicIndex = mapObj.$.dynamicIndex = index;
              return false;
            } else if (wildcardRouteCheck(seg)) {
              obj.dynamicKey = mapObj.$.dynamicKey = seg.replace("*", "");
              obj.dynamicIndex = mapObj.$.dynamicIndex = index;
              obj.wildcard = mapObj.$.wildcard = true;
              obj.sufix = mapObj.$.sufix = [];
              for (var indx = index + 1; indx < arr.length; indx++) {
                mapObj.$.sufix.push(arr[indx]);
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
      routeStringArr.forEach(function (r, index) {
        if (index + 1 != routeStringArr.length) {
          routes = routes[r];
        }
      });
      routes[routeName] = { $: obj };
      if (nestedFn) {
        nestedFn.call(this, {});
      }
      routeStringArr.pop();
      pathStringArr.pop();
    };
    map.call(this, {});
    Lyte.time('parseRouteMapping');
    return routesObj;
  };

  LR.replaceWith = function () {
    var args = normalizeTransitionParams.apply(this, arguments);
    if (args) {
      args.replace = true;
      return routeTransition(args);
    }
  };

  LR.transitionTo = function () {
    var matched;
    if (matched = normalizeTransitionParams.apply(this, arguments)) {
      return routeTransition(matched);
    }
  };

  LR.getURL = function () {
    var url, matched;
    if (matched = normalizeTransitionParams.apply(this, arguments)) {
      url = constructURLFromRoute(matched);
    }
    return instance.history ? shiftBaseURL(url, true) : url;
  };

  LR.getRoute = function (url) {
    var matched = traverse(shiftBaseURL(url), true);
    if (matched) {
      matched.dynamicParams = matched.dynamicParams.filter(function (e) {
        return e !== undefined;
      });
      matched.route = matched.route.join('.');
    }
    return matched;
  };

  function routeTransition(matched) {
    if (matched) {
      decidedTrans = redirectIndex = undefined;
      var url, title;
      if ((typeof matched === 'undefined' ? 'undefined' : _typeof(matched)) == "object") {
        if (trans) {
          title = trans.title;
          var fromRedirect = trans.runLoop && trans.runLoop.current && trans.runLoop.current[0] && trans.runLoop.current[0].hook == "redirect";
          if (fromRedirect) {
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
      newTransInfo = { type: matched.replace ? "replaceState" : "pushState", url: url, title: title, fromHistory: false };
      Lyte.log('Transitioning to ' + url, logger);
      if (!fromRedirect) {
        var processed;
        if (processed = setParamsInDef(matched)) {
          dispatch(url, processed);
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
    this.handler = function (onChangeEvent) {
      var url;
      if (self.history) {
        url = LR.getLocation();
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

    listener.init(this.handler, this.history);
    if (this.history) {
      if (LR.getLocation()) {
        this.handler();
      }
    } else {
      historyObj = { fromHistory: true };
      dispatch(LR.getLocation());
    }
    return this;
  };

  LR.getLocation = function () {
    if (instance.history) {
      var path = checkForEmptyPath(dloc.pathname + dloc.search);
      path = shiftBaseURL(path);
      return _delimit(path);
    } else {
      return _delimit(checkForEmptyPath(dloc.hash.replace(/^(#\/|#|\/)/, '')));
    }
  };

  function checkForEmptyPath(path) {
    if (!path) {
      listener.addToHistory({ type: "replaceState", title: document.title, url: path = '/' });
    }
    return path;
  }

  function shiftBaseURL(path, append) {
    var baseURL = instance.baseURL;
    if (baseURL && path) {
      baseURL = _delimit(instance.baseURL);
      if (path.indexOf(baseURL) == 0 && !append) {
        return path.replace(baseURL, '');
      } else if (append && path.indexOf(baseURL) == -1) {
        return baseURL + path;
      }
    }
    return path;
  };

  function constructURLFromRoute(matched) {
    if (matched) {
      if (matched.route && !Array.isArray(matched.route)) {
        matched.route = matched.route.split('.');
      }
      var qp,
          url = '';
      matched.route.forEach(function (route, index) {
        var queryParams,
            _route = matched.route.slice(0, index + 1),
            routeObj = _getObj(_route, instance.routes);
        if (!routeObj) {
          console.error('There is no url mapped for the route "' + _route.join('.') + '".');
          return false;
        }
        var path = routeObj.$.path;
        if (queryParams = routeObj.$.defQP) {
          for (var key in queryParams) {
            if (matched.queryParams && !matched.queryParams.hasOwnProperty(key)) {
              matched.queryParams[key] = queryParams[key];
            }
          };
        }
        if (routeObj.$.dynamicKey) {
          var dynamicPathSplit = _splitPath(path);
          if (!matched.dynamicParams || !matched.dynamicParams[index]) {
            console.error('Dynamic params for the route ' + route + ' is not defined.');
            return false;
          } else {
            dynamicPathSplit[routeObj.$.dynamicIndex] = encodeURI(matched.dynamicParams[index]);
            url += _delimit(dynamicPathSplit.join('/'));
          }
        } else {
          url += _delimit(path);
        }
      });
      url = url[url.length - 1] == '/' && url.length != 1 ? url.slice(0, -1) : url;
      qp = Object.keys(matched.queryParams).filter(function (key) {
        return matched.queryParams[key] != undefined ? key : false;
      });
      if (matched.queryParams && qp.length) {
        url += '?';
        qp.forEach(function (key, index) {
          url += key + '=' + encodeURIComponent(matched.queryParams[key]) + (index < qp.length - 1 ? '&' : '');
        });
      }
      return validateURL(url);
    }
  };

  function dispatch(path, processed) {
    Lyte.time('RouteTransition');
    if (trans && (trans.running || prevTrans && trans != prevTrans)) {
      trans.abort();
    }
    LR.error = false;
    if (!processed) {
      processed = traverse(path);
    }
    if (processed && processed.matched.route.length) {
      Lyte.time('constructRunLoop');
      invoke(processed);
      Lyte.time('constructRunLoop');
      processed.prevTrans = prevTrans;
      trans.runLoop = constructRunLoop(processed);
      setTimeout(function () {
        if (newTransInfo && trans.routeTrans.data) {
          newTransInfo.data = trans.routeTrans.data;
        }
        trans.run();
      }, 0);
    }
    return;
  };

  function constructRunLoop(processed) {
    var basicHooks = ["beforeModel", "model", "afterModel", "redirect", "renderTemplate", "afterRender"],
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
        prevCurrentRoutes,
        prevCurrentRoute;

    if (refreshRouteFrom) {
      refreshRouteFrom = refreshRouteFrom.split('.');
      refreshRouteFrom.pop();
    }

    function pushBasicHooks(route, index) {
      if (!fromRedirect) {
        var routeCheck = prevTrans && prevTrans.currentRoutes && prevTrans.currentRoutes[index] && prevTrans.currentRoutes[index].routeName == route.routeName && (!refreshRouteFrom || refreshRouteFrom[index] == route.routeName);
        if (routeCheck && redirectIndex != undefined && index >= redirectIndex) {
          runLoop.push({ hook: "redirect", index: index });
          if (index == redirectIndex) {
            ["renderTemplate", "afterRender"].forEach(function (hook) {
              var obj = {};
              obj.hook = hook;
              obj.index = index;
              runLoop.push(obj);
            });
          }
        } else {
          req.push({ hook: "getResources", index: index });
          req.push({ hook: "getDependencies", index: index });
          basicHooks.forEach(function (hook) {
            var obj = {};
            obj.hook = hook;
            obj.index = index;
            if (route.forceFetch && !_presence(["redirect", "renderTemplate", "afterRender"], hook)) {
              forceFetch.push(obj);
              if (hook == "afterModel") {
                route._fetchStatus = "pending";
              }
            } else {
              runLoop.push(obj);
            }
          });
        }
      }
    }

    currentRoutes.forEach(function (currentRoute, index) {
      if (prevTrans) {
        prevCurrentRoutes = prevTrans.currentRoutes;
        prevCurrentRoute = prevCurrentRoutes[index];
        if (prevCurrentRoute && similar && prevCurrentRoute.routeName == currentRoute.routeName && prevTrans.routeInstances[index]._rendered && (!refreshRouteFrom || refreshRouteFrom[index] == currentRoute.routeName)) {
          var routeDiff = function routeDiff() {
            pushBasicHooks(currentRoute, index);
            similar = false;
          };

          var pushRedirect = function pushRedirect() {
            if (!fromRedirect) {
              trans.routeInstances[index]._rendered = true;
              runLoop.push({ hook: "redirect", index: index });
            }
          };

          if ((currentRoute._queryParams || currentRoute._dynamicParams) && !processed.ignore) {
            if (currentRoute._queryParams) {
              currentRoute.queryParams.forEach(function (key) {
                if ((matched.queryParams || prevTrans.matched.queryParams) && matched.queryParams[key] != prevTrans.matched.queryParams[key] && similar) {
                  routeDiff();
                }
              });
            }
            if (currentRoute._dynamicParams) {
              if (matched.dynamicParams[index] != prevTrans.matched.dynamicParams[index] && similar) {
                routeDiff();
              }
            };
            if (similar) {
              pushRedirect();
            }
          } else {
            pushRedirect();
          }
        } else {
          similar = false;
          pushBasicHooks(currentRoute, index);
          if (prevCurrentRoute) {
            if (!sameTrans || prevCurrentRoute.routeName != currentRoute.routeName) {
              sameTrans = false;
              leavingRoutes.push(prevCurrentRoute);
              if (toRemove && prevTrans.routeInstances[index]._rendered) {
                templateToRemove = index;
                toRemove = false;
                if (fromRedirect) {
                  return index;
                }
              } else if (fromRedirect) {
                return index;
              }
            }
          }
        }
        if (matchedLen == index + 1) {
          if (prevTrans.matched.route.length > matchedLen) {
            if (toRemove && prevTrans.routeInstances[index + 1]._rendered) {
              templateToRemove = templateToRemove == undefined ? index + 1 : templateToRemove;
            }
            leavingRoutes = leavingRoutes.concat(prevCurrentRoutes.slice(index + 1));
          }
        }
      } else {
        pushBasicHooks(currentRoute, index);
      }
      var revIndex = currentRoutes.length - index - 1;
      didTransit.push({ hook: "didTransition", index: revIndex });
    });
    if (fromRedirect) {
      return templateToRemove;
    }
    if (prevTrans) {
      if (processed.decidedTrans) {
        leavingRoutes = instance.prevTransition.currentRoutes.slice(instance.prevTransition.leavingRoutesIndex + 1);
      }
      var len = instance.prevTransition.currentRoutes.length;
      instance.prevTransition.currentRoutes.forEach(function (r, i) {
        willTransit.push({ hook: "willTransition", index: len - i - 1, route: r });
      });
      leavingRoutes.forEach(function (r, i) {
        var revIndex = len - i - 1;
        b4Exit.push({ hook: "beforeExit", index: revIndex });
      });
    }

    runLoop = { previous: willTransit.concat(b4Exit), current: req.concat(runLoop).concat(didTransit), forceFetch: forceFetch };
    runLoop.current.removeTemplate = prevTrans && prevTrans.runLoop && prevTrans.runLoop.current && prevTrans.runLoop.current.removeTemplate;
    if (templateToRemove != undefined) {
      runLoop.current.removeTemplate = runLoop.current.removeTemplate || [];
      runLoop.current.removeTemplate.push({ index: templateToRemove, routeInstances: prevTrans.routeInstances });
    }
    return runLoop;
  }

  function invoke(processed) {
    instance.transition = trans = new Transition(processed);
    trans.routeTrans = limitTransition(trans);
    trans.routeInstances = Router.initRoute(processed.matched);
    if (historyObj) {
      trans.routeTrans.data = historyObj.data;
      LR.beforeRouteTransition(prevTrans && prevTrans.routeTrans || undefined, trans.routeTrans, historyObj);
      trans.running = true;
      historyObj.data = trans.routeTrans.data;
      historyObj.type = "replaceState";
      listener.addToHistory(historyObj);
      historyObj = undefined;
    } else if (trans.routeTrans.data) {
      listener.addToHistory({ type: "replaceState", data: trans.routeTrans.data });
    }
  };

  function _getObj(arr, obj) {
    arr.every(function (key) {
      if (obj && obj[key]) {
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
      route: processed.matched.target,
      queryParams: processed.matched.queryParams,
      dynamicParams: processed.matched.dynamicParams.filter(_arrayClean)
    };
    this.currentRoutes = processed.currentRoutes;
    this.aborted = this.paused = false;
    this.abort = function () {
      if (!this.aborted) {
        if (this.runningPromise) {
          this.runningPromise.reject('aborted');
        }
        if (this.constructor.name == "transition") {
          delete this.runLoop.current.removeTemplate;
        }
        this.aborted = true;

        transitionCompleted(this.currentPromise && this.currentPromise.hook == "willTransition");
      }
    }.bind(this);
    this.pause = function () {
      this.paused = trans.currentPromise;
      this.resume = this.routeTrans.resume = function (t) {
        t = t || this;
        if (t.runningPromise) {
          t.runningPromise.reject('aborted');
        }
        delete t.routeTrans.resume;
        delete t.resume;
        var state = trans.paused.state;
        if (t.runLoop[state][0].hook == trans.paused.hook && t.runLoop[state][0].index == trans.paused.index) {
          t.runLoop[state].splice(0, 1);
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
    return new Promise(function (resolve) {
      processRequirements(currentRoute[req], resolve);
    }).then(function () {
      currentRoute[req + 'Loaded'] = true;
      if (!currentRoute[errorType] || !currentRoute[errorType].length) {
        if (trans.pending && trans.pending[req] != undefined && trans.pending[req] == index) {
          trans.run();
        }
      } else {
        if (!trans.aborted) {
          if (!trans.paused) {
            trans.pause();
          }
          callOnError(hook, index, currentRoute[errorType]);
        }
      }
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
            requestFile(file, availableTags[file], function () {
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
          reqFiles[file].$.push({ type: req, index: index, resolve: resolve });
        } else {
          reqFiles[file] = { $: [{ type: req, index: index }] };
          if (cached && cached.event.type != "error") {
            if (removeFromCache.indexOf(file) != -1) {
              removeFromCache.splice(removeFromCache.indexOf(file), 1);
            }
            fileLoaded.call(cached.tag, cached.event, true);
            resolve();
          } else {
            Lyte.injectResources([file], fileLoaded, resolve);
          }
        }
      }

      function fileLoaded(event, cached) {
        var file = this.getAttribute('src') || this.getAttribute('href');
        if (!cached) {
          if (availableTags[file]) {
            availableTags[file].tag.remove();
          }
          this.onerror = this.onload = undefined;
          availableTags[file] = { tag: this, event: { type: event.type } };
        }
        requirements.set(file, event, cached);
      }
    }
  }

  var requirements = {
    get: function get(def, type) {
      return def[type + 'Loaded'] != false;
    },
    set: function set(file, event) {
      if (reqFiles[file]) {
        var respDetails = reqFiles[file].$;
        respDetails.forEach(function (resp) {
          var def = trans.currentRoutes[resp.index];
          if (resp.resolve) {
            resp.resolve();
          }
          if (event.type == "error") {
            var type = getRequirementsErrorType(resp.type);
            def[type] ? def[type].push(event) : def[type] = [event];
          }
        });
        delete reqFiles[file];
      }
    }
  };

  var getRequirementsErrorType = function getRequirementsErrorType(type) {
    return type == "_dependencies" ? "_errorDependencies" : "_errorResources";
  };

  function templateDelete(arr) {
    arr.forEach(function (obj) {
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

  Transition.prototype.run = function () {
    var run = {},
        action,
        boundParams = params.bind(this);

    function params(index, model) {
      return { queryParams: this.currentRoutes[index]._queryParams,
        dynamicParam: this.currentRoutes[index]._dynamicParams };
    };

    run.getResources = run.getDependencies = function (hook, index) {
      var req = { getDependencies: "_dependencies", getResources: "_resources" },
          currentRoute = this.currentRoutes[index],
          callback = currentRoute[hook],
          routeInstance = this.routeInstances[index],
          require = callAction(callback, routeInstance, boundParams(index));
      currentRoute[req[hook] + 'Loaded'] = callback ? false : true;
      if (callback && !this.aborted && !this.paused) {
        currentRoute[req[hook]] = require;
        getRequirements({ inst: routeInstance, currentRoute: currentRoute, req: req[hook], index: index });
      }

      return callHook();
    };

    run.beforeModel = run.model = run.afterModel = function (hook, index) {
      return callHook(this.currentRoutes[index][hook], this.routeInstances[index], boundParams(index));
    };

    run.afterModel = function (hook, index) {
      var routeInstance = this.routeInstances[index];
      return callHook(this.currentRoutes[index][hook], routeInstance, routeInstance.currentModel, boundParams(index));
    };

    callOnError = run.onError = function (hook, index, error) {
      var routeInstance = trans.routeInstances[index],
          resp;
      console.error('Error on ' + hook + ' of route ' + routeInstance.routeName);
      for (var action, i = trans.currentPromise.index; 0 <= i; i--) {
        if (trans.currentRoutes[i].actions && (action = trans.currentRoutes[i].actions.onError)) {
          if (action.call(trans.routeInstances[i], error, trans.routeTrans, boundParams(index), hook) == false) {
            i = -1;
          }
        }
      }
      if (trans.paused) {
        trans.abort();
      }
    };

    function callAction(callback, instance) {
      if (callback) {
        var hook = trans.currentPromise.hook,
            stopTrans = _presence(["getResources", "getDependencies"], hook);
        try {
          return callback.apply(instance, Array.from(arguments).slice(2));
        } catch (err) {
          processError(stopTrans, err, instance);
          return;
        }
      }
    }

    function processError(stopTrans, err, instance) {
      if (trans.currentPromise) {
        var hook = trans.currentPromise.hook,
            index = trans.currentPromise.index,
            state = trans.currentPromise.state;
        trans.pause();
        console.error(err);
        if (!stopTrans) {
          console.error('Error on ' + hook + ' of route ' + instance.routeName);
          if (_presence(["willTransition", "didTransition", "beforeExit"], hook)) {
            trans.resume();
          } else {
            trans.abort();
          }
        } else {
          callOnError(hook, index, err);
        }
      }
    }

    function callHook(callback, instance) {
      if (callback) {
        var args = arguments,
            resp,
            hook = trans.currentPromise.hook,
            stopTrans = _presence(["beforeModel", "model", "afterModel"], hook);
        return Promise.resolve(new Promise(function (resolve, reject) {
          try {
            resp = Promise.resolve(callback.apply(instance, Array.from(args).slice(2)));
          } catch (err) {
            processError(stopTrans, err, instance);
            return;
          }
          resp.then(function (data) {
            resolve(data);
          }, function (err) {
            console.error(err);
            if (hook == "model") {
              instance.currentModel = err;
            }
            processError(stopTrans, err, instance);
          });
        }));
      } else {
        return Promise.resolve();
      }
    }

    run.redirect = function (hook, index) {
      var routeInstance = this.routeInstances[index];
      return callHook(this.currentRoutes[index][hook], routeInstance, routeInstance.currentModel, boundParams(index));
    };

    run.afterRender = function (hook, index) {
      var routeInstance = this.routeInstances[index];
      routeInstance._rendered = true;
      return callHook(this.currentRoutes[index][hook], routeInstance, routeInstance.currentModel, boundParams(index), routeInstance.component);
    };

    run.willTransition = function (hook, index) {
      var prevCurrentRoute = prevTrans.currentRoutes[index];
      if (prevCurrentRoute.actions && (action = prevCurrentRoute.actions[hook]) && callAction(action, prevTrans.routeInstances[index], trans.routeTrans) == false) {
        removeHooks("previous", hook);
      }
      return callHook();
    };

    run.didTransition = function (hook, index) {
      var toCall;
      if (this.currentRoutes[index].actions && (action = this.currentRoutes[index].actions[hook]) && callAction(action, this.routeInstances[index], boundParams(index)) == false) {
        toCall = true;
        removeHooks("current", hook);
      }
      if (toCall || !index) {
        run.removeTemplate(trans.runLoop.current.removeTemplate);
        transitionCompleted();
      }
      return callHook();
    };

    run.beforeExit = function (hook, index) {
      var prevTransRouteInstance = prevTrans.routeInstances[index],
          callback = prevTrans.currentRoutes[index][hook];
      return callHook(callback, prevTransRouteInstance, prevTransRouteInstance.currentModel, params.call(prevTrans, index));
    };

    run.renderTemplate = function (hook, index) {
      var currentRoute = this.currentRoutes[index],
          routeInstance = this.routeInstances[index];
      if (trans.runLoop.current.removeTemplate && this.currentRoutes.length == index + 1) {
        run.removeTemplate(trans.runLoop.current.removeTemplate);
      }
      if (this.currentRoutes[index][hook]) {
        var renderTemplate = callAction(currentRoute[hook], routeInstance, routeInstance.currentModel, params.apply(this, [index]));
        if (renderTemplate && trans.runLoop.current.removeTemplate) {
          run.removeTemplate(trans.runLoop.current.removeTemplate);
        }
        if (renderTemplate && renderTemplate.outlet) {
          routeInstance.outletName = renderTemplate.outlet;
          var data = routeInstance.currentModel,
              outlet,
              parentOutlet;
          if (outlet = getOutlet(renderTemplate.outlet, routeInstance.parent)) {
            if (renderTemplate.component) {
              var component;
              if (routeInstance.component && routeInstance.outlet == outlet && outlet.contains(routeInstance.component)) {
                component = routeInstance.component;
                component._route = routeInstance;
                routeInstance.outlet = outlet;
                routeInstance.component = component;
                setDataInComponent(component, data);
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
        }
      }
      return callHook();

      function setDataInComponent(component, data) {
        if (data) {
          if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == "object" && !Array.isArray(data)) {
            component.setData(data);
          } else {
            processError(true, new Error('Data provided for component is not valid.').stack, routeInstance);
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
          console.error('There is no outlet named ' + outlet + '.');
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
      if (prevTrans && arr) {
        templateDelete(arr);
      }
      delete trans.runLoop.current.removeTemplate;
      if (removeFromCache.length) {
        removeFromCache.forEach(function (file) {
          if (availableTags[file]) {
            availableTags[file].tag.remove();
            delete availableTags[file];
          }
        });
        removeFromCache = [];
      }
      return callHook();
    };

    processRunLoop.call(this);
    document.title = this.title = this.routeInstances[this.routeInstances.length - 1].title || document.title;

    function processRunLoop() {
      this.pending = {};
      new Promise(function (resolve, reject) {
        this.runningPromise = { resolve: resolve, reject: reject };
        nestedPromises.call(this, this.runLoop, 'previous', resolve);
      }.bind(this)).then(function () {
        if (newTransInfo) {
          LR.beforeRouteTransition(decidedTrans && decidedTrans.routeTrans || prevTrans && prevTrans.routeTrans || undefined, trans.routeTrans, newTransInfo);
          trans.running = true;
          newTransInfo.data = trans.routeTrans.data;
          listener.addToHistory(newTransInfo);
          newTransInfo = undefined;
        } else if (trans.routeTrans.data) {
          listener.addToHistory({ data: trans.routeTrans.data, type: "replaceState" });
        }
        nestedPromises.call(this, this.runLoop, 'current');
      }.bind(this), function (error) {
        if (error != 'aborted') {
          console.error(error);
          console.log('Promise is rejected');
        }
      });
    }

    function removeHooks(type, hook) {
      var index;
      for (var i = 0; i < trans.runLoop[type].length; i++) {
        var obj = trans.runLoop[type][i];
        if (obj.hook == hook) {
          trans.runLoop[type].splice(i, 1);
          i--;
        }
      }
    }

    function nestedForcedPromises(forcedLoop, resolve) {
      if (forcedLoop && forcedLoop.length) {
        var promise = forcedLoop[0],
            currentRoute = this.currentRoutes[promise.index],
            routeInstance = this.routeInstances[promise.index];
        promise.state = "forced";
        trans.currentPromise = promise;
        if (promise.hook == "beforeModel" && !requirements.get(routeInstance, '_dependencies')) {
          this.pending._dependencies = promise.index;
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
                trans.run();
                // delete this.pending.forceFetch;
                // nestedPromises.call(this,this.runLoop,'current');
              }
              break;
          }
          forcedLoop.splice(0, 1);
          nestedForcedPromises.call(this, forcedLoop);
        }.bind(this));
      }
    }

    function logCallbacks(promise) {
      var hook = promise.hook,
          index = promise.index;
      var route = promise.state == "previous" ? prevTrans.currentRoutes[index] : trans.currentRoutes[index];
      Lyte.log(hook + ' of route ' + route.routeName, logger, 'MediumOrchid');
    }

    function nestedPromises(loop, state, resolve) {
      var runLoop = loop[state];
      if (runLoop && runLoop.length) {
        var promise = runLoop[0],
            currentRoute = this.currentRoutes[promise.index],
            routeInstance = this.routeInstances[promise.index];
        if (!this.aborted && !this.paused) {
          if (promise.hook == "beforeModel" && !requirements.get(currentRoute, "_dependencies")) {
            this.pending._dependencies = promise.index;
            return;
          } else if (promise.hook == "renderTemplate" && !requirements.get(currentRoute, "_resources")) {
            this.pending._resources = promise.index;
            return;
          } else if (promise.hook == "redirect" && currentRoute.forceFetch && currentRoute._fetchStatus == "pending") {
            if (!this.forceFetchRunning) {
              nestedForcedPromises.call(this, this.runLoop.forceFetch);
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
              runLoop.splice(0, 1);
              nestedPromises.call(this, loop, state, resolve);
            }.bind(this));
          }
        }
      } else if (resolve) {
        resolve();
      }
    }
  };

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

      var routesObj = instance.routes,
          dynamicParam,
          framedDP = [],
          urlSplit = _splitPath(url.split('?')[0]);
      matched.route.forEach(function (r, i, arr) {
        routesObj = _getObj([r], routesObj);
        if (routesObj.$.wildcard) {
          if (routesObj.$.sufix.length) {
            var dp = urlSplit.slice(0, urlSplit.indexOf(routesObj.$.sufix[0]));
            framedDP.push(decodeURI(dp.join('/')));
            _pop(dp.concat(routesObj.$.sufix));
          } else {
            framedDP.push(decodeURI(urlSplit.join('/')));
          }
          return;
        } else if (routesObj.$.dynamicKey) {
          dynamicParam = urlSplit[routesObj.$.dynamicIndex];
          _pop(_splitPath(routesObj.$.path));
          framedDP.push(decodeURI(dynamicParam));
        } else {
          _pop(_splitPath(routesObj.$.path));
          framedDP.push(undefined);
        }
      });
      return framedDP;
    }
  };

  function _presence(str, char) {
    return str.indexOf(char) != -1 ? true : false;
  }

  function transitionCompleted(reverseTrans) {
    if (trans.running) {
      Lyte.time('RouteTransition');
      reqFiles = {};
      trans.running = false;
      LR.afterRouteTransition(trans.routeTrans);
      window.$lr = LR.getRouteInstance();
      Lyte.log('Transition completed.', logger);
    }
    if (reverseTrans) {
      instance.prevTransition = instance.transition = trans = prevTrans;
    } else {
      instance.prevTransition = instance.transition = prevTrans = trans;
    }
  }

  function _arrayClean(r) {
    return r != undefined;
  }

  function _arrayUniquePush(arr, value) {
    if (!_presence(arr, value)) {
      arr.push(value);
      return true;
    }
    return false;
  }

  function _objContains(obj, key) {
    var exist = false;
    for (var k in obj) {
      if (k == key) {
        exist = true;
        break;
      }
    }
    return exist;
  }

  function _delimit(seg) {
    return seg[0] == "/" ? seg : "/" + seg;
  }

  function _splitPath(path) {
    return path.match(/[^/?]+/g) || [];
  }

  function validateURL(url) {
    // url = url.replace(/\/$/, '')
    url = url.replace(/\/\//g, '/');
    url = url.replace(/\/\?/g, '?');
    return url;
  }

  function traverse(path, get) {
    if (!path) {
      console.error('path is not valid');
      return;
    }
    var url = path,
        selectedPaths = [],
        pathSplit = path.split('?'),
        path = decodeURI(pathSplit[0]),
        params = pathSplit[1],
        pathSplitArr = _splitPath(path);
    if (path == '/') {
      if (_getObj(['/'], routeHash)) {
        selectedPaths.push([path]);
      } else {
        console.error("url '" + path + "' is not defined in router");
        return;
      }
    } else {
      var checkArrayMatch = function checkArrayMatch(arr1, arr2, l, pathObj, matchedPath) {
        if (!(pathObj.$.wildcard || pathObj.$.dynamicKey)) {
          var prevObj;
          if (prevObj = _getObj(matchedPath, routeHash).$) {
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
              if (pathObj.$.sufix.length) {
                l = arr2.indexOf(pathObj.$.sufix[0]) - 1;
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
            if (mapPath != "$") {
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
                    if (pathObj.$.wildcard) {
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
                      if (pathObj.$.wildcard && !pathObj.$.sufix.length && innerRoutes.length == 1) {
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
        console.error("url '" + path + "' is not defined in router");
      }
    } else {
      console.error("url '" + path + "' is not defined in router");
    }

    function pathProcessor(get, selectedPaths, path, params) {
      var newURL,
          newMatched,
          matched = {};
      matched.route = _getObj(selectedPaths, routeHash).$.route;
      matched.queryParams = params ? Router.frameQueryParams(params) : {}, matched.dynamicParams = Router.frameDynamicParams(path, matched);
      if (get) {
        return matched;
      }
      var transInfo = setParamsInDef(matched);
      if (LR.error) {
        return false;
      }
      newMatched = Lyte.deepCopyObject(transInfo.matched);
      newURL = constructURLFromRoute(newMatched);
      if (!_compareObj(newMatched.queryParams, matched.queryParams)) {
        historyObj = listener.addToHistory({ type: "replaceState", data: window.history.state, title: document.title, url: newURL, fromHistory: true });
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
    matched.route.every(function (r, i) {
      matched.target = matched.target ? matched.target + '.' + r : r;
      routesObj = _getObj([r], routesObj);
      routeDef = _getObj([r], routeDef);
      if (!routeDef || !routeDef.$) {
        console.error('There is no route object for the route "' + matched.target + '"');
        LR.error = true;
        return false;
      }
      r = matched.target.split('.');
      matched._routes.push(r);
      var obj = routeDef.$;
      if (obj.queryParams) {
        obj._queryParams = {};
        obj.queryParams.forEach(function (key) {
          obj._queryParams[key] = matched.queryParams[key] != undefined ? matched.queryParams[key] : routesObj.defQP && routesObj.defQP[key] ? routesObj.defQP[key] : undefined;
        });
      }
      obj._dynamicParams = matched.dynamicParams[i];
      return currentRoutes.push(obj);
    });
    if (LR.error) {
      return false;
    }
    return { currentRoutes: currentRoutes, matched: matched };
  };

  LR.registerRoute = function (dir, fns, options) {
    if (options && options.mixins) {
      if (!Array.isArray(options.mixins)) {
        options.mixins = [options.mixins];
      }
      options.mixins.forEach(function (mixin) {
        var regMixin = Lyte.registeredMixins[mixin];
        if (regMixin) {
          for (var key in regMixin) {
            fns[key] = regMixin[key];
          }
        }
      });
    }
    fns._objPath = dir.replace(/\//g, '.');
    var dir = dir.split('.'),
        len = dir.length - 1;
    fns.routeName = dir[len];
    routeDef.set(dir, fns);
  };

  function limitTransition(int) {
    var routeTrans = new transition(int);
    function transition(int) {
      var predefined = ['runLoop', 'paused', 'currentRoutes', 'routeInstances', 'aborted', 'currentPromise', 'run', 'pending'];
      for (var prop in int) {
        if (predefined.indexOf(prop) == -1) {
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

  LR.getRouteInstance = function (routeName) {
    if (this.instance && trans && trans.routeInstances) {
      if (routeName == "*") {
        return trans.routeInstances;
      } else {
        routeName = routeName || trans.target;
        var match;
        trans.routeInstances.every(function (instance, index) {
          instance = trans.routeInstances[trans.routeInstances.length - 1 - index];
          if (instance._objPath == routeName) {
            match = instance;
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
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == "object") {
      if (obj.route) {
        return normalizeMatchedObj(obj);
      }
    } else {
      var params = {};
      params.queryParams = {};
      params.dynamicParams = [];
      Array.from(arguments).forEach(function (arg, index) {
        if (Array.isArray(arg)) {
          console.error(JSON.stringify(arg) + ' is not a valid argument.');
        } else {
          if (index == 0) {
            params.route = arg;
          } else if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) == "object") {
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
      var matched = {};
      matched.route = obj.route.split('.');
      matched.queryParams = obj.queryParams || {};
      matched.dynamicParams = [];
      matched.target = "";
      matched._routes = [];
      var dynamicParams = obj.dynamicParams ? Array.from(obj.dynamicParams) : [];
      try {
        matched.route.forEach(function (route, index) {
          matched.target = matched.target ? matched.target + '.' + route : route;
          var r = matched.target.split('.');
          var routesObj = _getObj(matched.route.slice(0, index + 1), instance.routes);
          matched._routes.push(r);
          if (routesObj) {
            matched.dynamicParams.push(routesObj.$.dynamicKey ? dynamicParams.shift() : undefined);
          } else {
            throw 'There is no url mapped for the route "' + matched.target + '".';
          }
        });
      } catch (e) {
        console.error(e);
        return false;
      }
      return matched;
    }
  }

  Router.initRoute = function (matched) {
    var routeObj,
        len = matched.route.length,
        routeInstances = [],
        predefined = ["getResources", "getDependencies", "beforeModel", "model", "afterModel", "redirect", "renderTemplate", "afterRender", "beforeExit"];

    Route = function Route(fns, index, prevInstance) {
      if (prevInstance) {
        for (var key in prevInstance) {
          if (_presence(["_queryParams", "_dynamicParams", "_rendered"], key)) {
            this[key] = fns[key];
          } else {
            this[key] = prevInstance[key];
          }
        }
        if (this.component) {
          this.component._route = this;
        }
      } else {
        for (var key in fns) {
          if (!_presence(predefined, key)) {
            this[key] = fns[key];
          }
        };
      }
      this.parent = routeInstances[index - 1];
      this.transition = trans.routeTrans;
      this.replaceWith = LR.replaceWith;
      this.transitionTo = LR.transitionTo;
      this.refresh = function () {
        trans.abort();
        var processed = { currentRoutes: trans.currentRoutes, matched: trans.matched, refreshRouteFrom: this._objPath };
        newTransInfo = { type: "replaceState", data: trans.data, title: document.title, fromHistory: false };
        dispatch(undefined, processed);
        return trans.routeTrans;
      };
      this.setTitle = function (title) {
        document.title = this.title = title;
      };
      this.getQueryParams = function () {
        return this._queryParams;
      };
      this.getDynamicParam = function () {
        return this._dynamicParams;
      };
      this.getRouteInstance = function (routeName) {
        return LR.getRouteInstance(routeName);
      };
      this.setQueryParams = function (key, value, refresh) {
        var obj = {},
            matched = {};
        if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) == "object") {
          for (var i in key) {
            obj[i] = key[i];
          }
          refresh = value;
        } else {
          obj[key] = value;
        }
        matched.route = Array.from(trans.matched.route);
        matched.dynamicParams = Array.from(trans.matched.dynamicParams);
        matched.queryParams = Object.assign({}, trans.matched.queryParams, obj);
        if (!_compareObj(trans.matched.queryParams, matched.queryParams)) {
          var url = constructURLFromRoute(matched),
              processed = setParamsInDef(matched);
          processed.ignore = refresh == false;
          newTransInfo = { type: "pushState", data: trans.data, url: url, title: document.title, fromHistory: false };
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

    var refMatch = decidedTrans || prevTrans,
        similarRoute = true;

    for (var i = 0; i < len; i++) {
      routeObj = routeDef.get(trans.matched._routes[i]);
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

  function commonRouteCheck(matched, prev) {
    var j = prev.route.length;
    matched.route.every(function (r, i) {
      if (r == prev.route[i]) {
        return true;
      } else {
        j = i - 1;
        return false;
      }
    });
    return j;
  }

  function decideTransition(processed) {
    if (prevTrans) {
      processed.validateTransition = true;
      processed.prevTrans = trans;
      removeIndex = constructRunLoop(processed);
      delete processed.validateTransition;
      if (removeIndex == undefined || removeIndex >= redirectIndex) {
        var currentTransCommonRoute = commonRouteCheck(processed.matched, trans.matched),
            prevTransCommonRoute = commonRouteCheck(processed.matched, prevTrans.matched);
        if (currentTransCommonRoute < prevTransCommonRoute) {
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
    dispatch(url, processed);
    return url;
  }
})(window);