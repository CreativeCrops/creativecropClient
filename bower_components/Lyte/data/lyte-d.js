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
//$Id$
var $Record = function $Record(){
	Object.assign(this, {isModified : false, isNew : false, isDeleted : false, isError : false, events : [], validatedOnCreate : true, error : {}});
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
//								return true;
								result.push(key);
                            }
							else if(type === "hasMany"){
								for(var k=0;k<records.length;k++){
									if(records[k] && records[k].$ && records[k].$.isModified){
//										return true;
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
		}
	});
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
			else if(this.isModified){
				this.rollBackAttributes(this.getDirtyAttributes());
			}
			else if(this.isNew){
				store.$.rollBackNew(model, this.record, pK);
			}
            else if(this.isError){
                store.$.clearRecordError(this);
            }
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
		value:function value(customData){
			this.deleteRecord();
			return this.save(customData,"destroyRecord");
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
		value : function value(actionName,customData){
			var model = this.model, actions = model.actions, action = (actions) ? actions[actionName] : undefined;
			if(action){
				return store.adapter.$.handleAction(actionName, model, this.record,customData);
			}
			return Promise.reject({code : "ERR18", message : Lyte.errorCodes.ERR18, data : actionName});
 		}
	},
	save: {
		enumerable : false,
		value : function value(customData,destroy){
			var model = this.model, record = this.record, dirty = this.isDirty();
            if(this.isDeleted){
				if(!this.isNew){
					return store.adapter.$.del(model._name, record, true,destroy,customData);
				}
				store.adapter.$.handleResponse(undefined, record, record, undefined, undefined, model);
			}
			else if(this.isNew){
				var fields = model.fieldList, err = new error1();
				for(var field in fields){
					var val = record[field], fieldKeys = fields[field];
					if(!this.validatedOnCreate){
						if(val == null || val == undefined || val == "" || val.length == 0){
							if(fieldKeys.mandatory){
                                store.$.setError(err,field,{code : "ERR02", message : Lyte.errorCodes.ERR02});
								//err[field] = {code : "ERR02", message : Lyte.errorCodes.ERR02};
							}
						}
						else{
							for(var property in fieldKeys){
								var resp = store.$.checkProperty(property, record[field], field, fieldKeys[property]);
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
				if(Object.keys(err).length > 0){
					return Promise.reject(err);
				}
				return store.adapter.$.create(model._name, record, true ,customData);
			}
			else if(this.isModified || (dirty && dirty.length) ){
				var data = {};
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
				return store.adapter.$.put(model._name, data, record, true, customData);
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
        value: function(){
            return Object.assign({},store.$.toJSON(this.model._name,this.record,true));
        }
    }
});

/* Model Object Constructor 
*/
var Model = function Model(name,fields){
	Object.assign(this, {_name : name, _primaryKey : "id", fieldList : {id : {type : "string", primaryKey : true}}, relations : {}, _properties : {}, data : [], dirty : [], _deleted : [],
		events : {}});
	var obs = [];
	for(var key in fields){
		var field = fields[key];
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
					if(!this.didLoad){
						this.didLoad = [];
					}
					this.didLoad.push(field.value);	
				}
                else if(props[i] === "add" || props[i] === "change"){
					this.on(props[i],field.value);
				}
			}
			if(key == "didLoad"){
				if(!this.didLoad){
					this.didLoad = [];
				}
				this.didLoad.push(field.value);
			}
		}
		else if(key == "didLoad"){
			if(!this.didLoad){
				this.didLoad = [];
			}
			this.didLoad.push(field);
		}
		else if(Object.keys(field).length){
			if(field.primaryKey){
				delete this.fieldList.id;
				this._primaryKey = key;
			}
			this.fieldList[key] = fields[key];				
		}
		if(field.type === "relation"){
			field.relKey = key;
			if(!this.relations[field.relatedTo]){
				this.relations[field.relatedTo] = [];
			}
			this.relations[field.relatedTo].push(this.fieldList[key]);
		}
	}
	if(typeof LyteComponent != "undefined"){
		LyteComponent.establishObserverBindings(obs,true,this._properties);
	}
//	for(var key in observers){
//		this.fieldList[key].observers = observers[key];
//	}
	Object.defineProperties(this.data, {
		model : {
			enumerable : false,
			value : this
		}, 
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
	Object.defineProperty(this,"extends", {
		enumerable: false,
		value: store.$.extendModel
	})
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
        setError:function(err,attr,codeObj){
            if(err.$.hasOwnProperty("error")){
                if(typeof LyteComponent != "undefined"){
                    LyteComponent.set(err.$.error,attr,codeObj);
                }else{
                    err.$.error[attr] = codeObj;                    
                }
            }
            else{
                console.error("Cannot set the error ",err," for ", attr);
            }
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
		extendAdapter:function(parent){
                var res;
				if(parent && typeof parent === "string"){
					res = store.adapter[parent];
                    if(!res){
                         if(!store.adapter.__toAddSuper){
                             store.adapter.__toAddSuper = {};
                         }
                         if(!store.adapter.__toAddSuper.hasOwnProperty(parent)){
                            store.adapter.__toAddSuper[parent] = [];   
                         }
                         store.adapter.__toAddSuper[parent].push(this.__name);
                    }
                }	
                if(res && res.isAdapter && !this.$super){
					this.$super = res;
				}
				return this;
//				store.registerAdapter(name,opts,this);
		},
		extendSerializer:function(parent){
                var res;
				if(parent && typeof parent === "string"){
					res = store.serializer[parent];
                    if(!res){
                         if(!store.serializer.__toAddSuper){
                             store.serializer.__toAddSuper = {};
                         }
                         if(!store.serializer.__toAddSuper.hasOwnProperty(parent)){
                            store.serializer.__toAddSuper[parent] = [];   
                         }
                         store.serializer.__toAddSuper[parent].push(this.__name);
                    }
				}
				if(res && res.isSerializer && !this.$super){
					this.$super = res;
				}
				return this;
//				store.registerSerializer(name,opts,this);
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
        //Will expect a arguments to be
        //modelName, POST/PATCH/DELETE, data(either object/array)
        dataFromSocket:function(modelName, type, data){
            var model = store.modelFor(modelName),pK = model._primaryKey,rec;
            if(!Array.isArray(data)){
                data = [data];
            }
            if(type === "POST"){
                for(var i=0;i<data.length;i++){
                    rec = undefined;
                    if(data){
                        rec = store.$.newRecord(modelName,data[i]);
                        rec.$.isNew = false;
                        store.$.deleteFromArray(model.dirty, rec[pK]);
                    }
                }
            }else if(type === "PATCH"){
                for(var i=0;i<data.length;i++){
                    rec = undefined;
                    if(data){
                        rec = store.peekRecord(modelName,data[i][pK]);
                        if(!rec.$.isModified){
                            delete data[i][pK];
                            for(var key in data[i]){
                                LyteComponent.set(rec,key,data[i][key],true);
                            }
                            rec.$.isModified = false;                            
                        }
                    }
                }
                
            }else if(type === "DELETE"){
                for(var i=0;i<data.length;i++){
                    rec = undefined;
                    if(data){
                        rec = store.peekRecord(modelName,data[i][pK]);
                        if(!rec.$.isModified){
                            store.unloadRecord(modelName,data[i][pK]);                            
                        }
                    }
                }
            }
        },
		setData:function(self,attr,value){
			var toEmit = {emit : false, attr : []};
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
			}
			return self.record;
		},
		setValue:function(self,attr,value, toEmit){
			var model = self.model;
			if(attr != model._primaryKey){
				var field = model.fieldList[attr], record = self.record;
				if(!field){
					if(typeof LyteComponent != "undefined"){
                                                        LyteComponent.set(record,attr,value,true);
                                        }
                                        else{
                                                        record[attr] = value;
                                        }
					toEmit.emit = true;
					toEmit.attr.push(attr);
				}
				else if((value == undefined || value == null || value == "") && field.mandatory){
					store.$.setRecordError(self, attr, "ERR02");
				}
				else if(field.relType){
					var rel ={}, oldVal;
					this.getRelations(model, field.relKey, store.modelFor(field.relatedTo), rel);
					if(record[attr] && field.relType == "hasMany"){
						oldVal = record[attr].slice(0);
						this.toDemolishLink(model, record, rel.forward);
						record[attr].splice(0, record[attr].length);
					}
					else if(record[attr] && field.relType == "belongsTo"){
						oldVal = this.createCopy(record[attr]);
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
					var bModel = store.modelFor(field.relatedTo), bPk = bModel._primaryKey, bPkType = bModel.fieldList[bPk].type, err = [];
					for(var i=0; i<value.length; i++){
						if(value[i] == undefined){
							continue;
						}
						var relRecord = value[i];
						if(typeof value[i] == bPkType){
							relRecord = store.peekRecord((value[i]._type) ? value[i]._type : field.relatedTo, value[i]);
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
								relRecord = this.newRecord((value[i]._type ? value[i]._type : field.relatedTo), value[i]);
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
					if(value != record[attr]){
						if(value != undefined){
							for(var property in field){
								var resp = this.checkProperty(property, value, attr, field[property]);
								if(resp != true){
									store.$.setRecordError(self, attr, resp, value);
									return;
								}
							}
						}
						var attribute = record.$._attributes[attr];
						if( !record.$._attributes.hasOwnProperty(attr) && value != undefined){
							record.$._attributes[attr] = this.createCopy(record[attr]);
						}
						else if((typeof value == "object" && store.adapter.$.compareObjects(attribute, value)) || (attribute == value)){
							delete record.$._attributes[attr];
						}
                        if(typeof LyteComponent != "undefined"){
							LyteComponent.set(record,attr,value,true);
						}
						else{
							record[attr] = value;
						}
						toEmit.emit = true;
						toEmit.attr.push(attr);
						store.$.clearRecordError(self, attr);
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
                this.removeKeys((polymorphic)?(Lyte.isRecord(record)?record.$.model.fieldList:fieldList):fieldList,record);
			}
		},
		add:function(value,type){
			var record= this.record, model = record.$.model, attr = this.key, field = model.fieldList[attr], rel = {};
			store.$.getRelations(model, field.relKey, store.modelFor(field.relatedTo), rel);
			if(!Array.isArray(value)){
				value = [value];
			}
			var pK = store.modelFor(rel.forward.relatedTo)._primaryKey, err = [], arr = [];
			for(var i=0; i<value.length; i++){
				var rec = value[i];
				if(typeof rec == "object" && !Lyte.isRecord(rec)){
					rec = store.$.newRecord((rec._type) ? rec._type : type ? type : field.relatedTo, rec);
				}
				else if(store.modelFor(rel.forward.relatedTo).fieldList[pK].type.toLowerCase() == typeof rec){
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
			}
			if(err.length > 0){
				store.$.setRecordError(record.$, attr, err);
			}
			else{
				store.$.clearRecordError(record.$, attr);
			}
			return record;
		},
		remove:function(key,type){
			var record = this.record, model = record.$.model, attr =  this.key, field = model.fieldList[attr], rel = {};
			store.$.getRelations(model, field.relKey, store.modelFor(field.relatedTo), rel);
			if(!Array.isArray(key)){
				key = [key];
			}
			var pK = store.modelFor(rel.forward.relatedTo)._primaryKey, err = [], relatedRecord, arr = [], indices = [];
			for(var i=0; i<key.length; i++){
				if(store.modelFor(rel.forward.relatedTo).fieldList[pK].type.toLowerCase() == typeof key[i]){
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
					record.$._attributes[attr].push({_type : "removed", records : arr, indices : indices});
				}
				else{
					record.$.isModified = false;
					delete record.$._attributes[attr];
					if(!record.$.isNew){
						store.$.deleteFromArray(model.dirty, record[model._primaryKey]);															
					}
				}
				store.$.emit("change", record, [attr]);
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
				Object.defineProperties(arr,{
					model:{
						enumerable:false,
						value:this.model
					},
					filterBy:{
						enumerable:false,
						value:this.filterBy
					},
					sortBy : {
						enumerable : false,
						value : this.sortBy
					},
					mapBy : {
						enumerable : false,
						value : store.$.mapBy
					}
				});
			}
			return arr;
		},
		removeSelfCircularReference : function(modelName,obj,expose){
			var model = store.modelFor(modelName), fieldList = model.fieldList;
			for(var key in obj){
				var field = fieldList[key];
				if(obj[key] && field && field.type == "relation"){
					var bModel = store.modelFor(field.relatedTo);
					if(bModel == undefined){
						continue;
					}
					var relKey = field.relKey, rel = {};
					this.getRelations(model, relKey, bModel, rel);
					var serialize = field.opts ? field.opts.serialize : undefined, val = obj[relKey], pK = model._primaryKey, pkVal = obj[pK];
					if(expose || serialize == "id"){
						if(Array.isArray(val)){
							 obj[relKey] = val.map(function(value, i){
								 return value[pK];
							 });
						}
						else if(val && Lyte.isRecord(val)){
							 obj[relKey] = val[bModel._primaryKey];
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
		removeBackwardRel:function(val,rel,pK,pkVal){
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
		toJSON : function(modelName,obj,expose){
			var copyObj;
			if(Array.isArray(obj)){
				var arr = [];
				for(var i=0; i<obj.length; i++){
					copyObj = this.deepCopyObject(obj[i]);
					this.removeSelfCircularReference(modelName, copyObj, expose);
					arr.push(copyObj);
				}
				return arr;
			}
			else if(typeof obj === "object" || Lyte.isRecord(obj)){
				copyObj = this.deepCopyObject(obj);
				this.removeSelfCircularReference(modelName,copyObj,expose);
			}
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
						var rec = this.deepCopyObject(data[i]);
						arr.push(rec);
					}
					return arr;
				}
			}
			else if(data && ( Lyte.isRecord(data) || typeof data == "object")){
				return this.deepCopyObject(data);
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
			return arr.some(function(val,key){
				return val === value;
			});
		},
		checkAndAddToArray : function(arr,value){
			if(!this.checkPresenceInArray(arr,value)){
				arr.push(value);
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
				//errorObj[pK] = {code : "ERR16", data : record[pK], message : Lyte.errorCodes.ERR16};
			}
			for(var field in fields){
				var fieldKeys = fields[field];
				if(fieldKeys.relType == "hasMany"){
					record[field] = [];
				}
				var val = opts[field];         
				if(val == undefined || val == "" || val == null){
					if(fieldKeys.hasOwnProperty("default")){
						record[field] = fieldKeys.default;
					}
					if(fieldKeys.mandatory && !withoutValidation){
                        store.$.setError(errorObj,field,{code : "ERR02", message : Lyte.errorCodes.ERR02});
						//errorObj[field] = {code : "ERR02", message : Lyte.errorCodes.ERR02};
					}
                    if(fieldKeys.pattern && !withoutValidation){
                        if(!(new RegExp(fieldKeys.pattern).test(val))){
                            store.$.setError(errorObj,field,{code : "ERR08", message : Lyte.errorCodes.ERR08,expected:fieldKeys.pattern});
                        }
                    }
				}
				else if(fieldKeys.type != "relation" && !withoutValidation){
					for(var property in fieldKeys){
						var resp = this.checkProperty(property, val, field, fieldKeys[property], opts);
						if(resp != true){
                            store.$.setError(errorObj,field,resp);
							//errorObj[field] = resp;
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
                            //errorObj[fieldKeys.relKey] = {code : resp, data : relation, message : Lyte.errorCodes[resp]};
							continue;
						}
						var bModel = store.modelFor(fieldKeys.relatedTo), bPkType = bModel.fieldList[bModel._primaryKey].type;
						if(!Array.isArray(optsRelVal)){
							optsRelVal = [optsRelVal];
						}
						else if(relation[i].relType == "belongsTo"){
							store.$.setError(errorObj,fieldKeys.relKey,{code : "ERR21", data : optsRelVal, message : Lyte.errorCodes.ERR21});
                            //errorObj[fieldKeys.relKey] = {code : "ERR21", data : optsRelVal, message : Lyte.errorCodes.ERR21};
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
                                //errorObj[fieldKeys.relKey].push({code : "ERR15", data : optsRelVal[j], message : Lyte.errorCodes.ERR15, error : Object.assign({}, relRecord)});
								continue;
							}
							if(relRecord && relRecord.$ && !relRecord.$.isError){
								resp = this.establishLink(rel.forward, rel.backward, record, relRecord);
								if(resp != true){
                                    store.$.setError(errorObj,fieldKeys.relKey,{code : resp, data : optsRelVal[j], message : Lyte.errorCodes[resp]});
									//errorObj[fieldKeys.relKey].push({code : resp, data : optsRelVal[j], message : Lyte.errorCodes[resp]});
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
								Object.defineProperties(record[fieldkey], {
                                    model:{
                                        enumerable:false,
                                        value: store.modelFor(relation[i].relatedTo)  
                                    },
									record : {
										enumerable : false,
										writable : true,
										value : record
									},
									key : {
										enumerable : false,
										value : fieldkey
									},
									filterBy : {
										enumerable : false,
										value : this.filterBy
									},
									add : {
										enumerable : false,
										value : this.add
									},
									remove : {
										enumerable : false,
										value : this.remove
									},
									sortBy : {
										enumerable : false,
										value : this.sortBy
									},
									mapBy : {
										enumerable : false,
										value : this.mapBy
									}
								});
							}
						}
					}
				}
			}
			if(errorObj && errorObj.$ && Object.keys(errorObj.$.error).length > 0){
				return errorObj;
			}
			record.$.isNew = true;
			if(typeof Lyte.arrayUtils != "undefined"){
//				LyteComponent.arrayFunctions(model.data, "push", record);
				Lyte.arrayUtils(model.data, "push", record);
			}
			else{
				model.data.push(record);
			}
			this.checkAndAddToArray(model.dirty, record[model._primaryKey]);
			model.emit("add",[record]);
            store.emit("add",[model._name,record]);
			if(withoutValidation){
				record.$.validatedOnCreate = false;
			}
			return record;
		},
		insertIntoStore:function(model,data){
			var ret;
			if(Array.isArray(data)){
				ret = [];
				for(var i=0; i<data.length; i++){
					ret[i] = this.insertIntoStore(model, data[i]);
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
				if(data._type){
					currentModel = (model.extendedBy[data._type]) ? store.modelFor(data._type) : undefined;
				}
				if(Lyte.isRecord(data))
				{
					return undefined;
				}
				if(!this.isDuplicateRecord(currentModel.data, data, currentModel._primaryKey)){
					ret = this.validateAndPush(currentModel,new Record(currentModel._name,data));
				}
				else{
					ret = this.validateAndMerge(currentModel,data);
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
				if(typeof Lyte.arrayUtils != "undefined"){
//					deleted = LyteComponent.arrayFunctions(data, "remove", index);
					deleted = Lyte.arrayUtils(data, "removeAt",index,1);
				}
				else{
					deleted = data.splice(index, 1);
				}
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
            if(!data.hasOwnProperty(model._primaryKey)){
                return new error1(model._primaryKey, {code : "ERR23", data : data, message : Lyte.errorCodes.ERR23});
            }
			data = this.validateJSON(model, data);
			if(!data.$.isError){
				if(model.didLoad){
					var callBack = model.didLoad;
					for(var i=0;i<callBack.length;i++){
						callBack[i].apply(data);				
					}
				}
				if(this.isDuplicateRecord(model.data, data, model._primaryKey)){
					this.mergeData(store.peekRecord(model._name,data[model._primaryKey]),data);
				}
				else{
					if(typeof Lyte.arrayUtils != "undefined"){
//						LyteComponent.arrayFunctions(model.data, "push", data);	
						Lyte.arrayUtils(model.data, "push", data);
					}
					else{
						model.data.push(data);
					}
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
                console.error("No such record to merge, ",data);
                return;
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
                            if(!res){
                                return 0;
                            }
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
		checkProperty:function(property,dataVal,key,fieldVal, record){
			switch(property){
			case "type" : 
				if(Lyte.Transform.hasOwnProperty(fieldVal)){
					if(Array.isArray(dataVal)){
						if(Lyte.Transform[fieldVal].extends != "array"){
							return {code : "ERR03", message : Lyte.errorCodes.ERR03, expected : fieldVal};
						}
					}
					else if(Lyte.Transform[fieldVal].extends != (typeof dataVal)){
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
							var resp = this.checkProperty(property, dataVal[i], i, fieldVal[property]);
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
							var resp = this.checkProperty(property, dataVal[key], key, fieldVal[property]);
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
		},
		validateJSON:function(model,data,keys,toValidate){
            var validate = (toValidate) ? toValidate.toValidate : undefined;
            var fields = (validate && Object.keys(validate).length) ? validate : model.fieldList;
			for(var key in fields){
				if(keys && keys.indexOf(key) == -1){
					continue;
				}
				if(fields[key].type == "relation" && data[key]){
                    var partialAdd = (toValidate && toValidate.toPartialAdd) ? toValidate.toPartialAdd[key] : undefined;
					var resp = this.handleRelation(key, model, fields[key], data, partialAdd);
					if(resp != true){
						return new error1(key, {code : resp, data : data, message : Lyte.errorCodes[resp]});
					}
					if(fields[key].relType == "hasMany" && !data[key].add){
						Object.defineProperties(data[key],{
							record:{
								enumerable:false,
								value:data
							},
							model:{
								enumerable:false,
								value:model
							},
							key:{
								enumerable:false,
								value:key
							},
							filterBy:{
								enumerable:false,
								value:this.filterBy
							},
							add : {
								enumerable : false,
								value : this.add
							},
							sortBy : {
								enumerable : false,
								value : this.sortBy
							},
							mapBy : {
								enumerable : false,
								value : this.mapBy
							},
							remove : {
								enumerable : false,
								value : this.remove
							}
						});
					}
				}
				else{
					var fieldKeys = fields[key];
					if(data[key] == undefined && fieldKeys.default){
						data[key] = fieldKeys.default;
					}
					if(data[key] && Lyte.Transform.hasOwnProperty(fieldKeys.type) && Lyte.Transform[fieldKeys.type].hasOwnProperty("deserialize")){
						data[key] = Lyte.Transform[fieldKeys.type].deserialize(data[key]);
					}
				}
			}
			return data;
		},
		handleRelation:function(key,model,field,data,partialAdd){
			var rel = {};
			if (!model.rel.hasOwnProperty(key)){
				if(store.modelFor(field.relatedTo) == undefined){
					return "ERR11";
				}
				this.getRelations(model,key,store.modelFor(field.relatedTo),rel);	
				model.rel[key] = rel;
			}
			else{
				rel = model.rel[key];
			}
			return this.solveRelation(rel, model, store.modelFor(field.relatedTo), key, data, partialAdd);
		},
		getRelations:function(fModel,key,bModel,rel){
			if(bModel == undefined){
				return "ERR11";
			}
			rel.forward = fModel.fieldList[key];
			rel.backward = this.getBackwardRel(fModel,rel.forward,bModel);
			return true;
		},
		getBackwardRel:function(fModel,rel,bModel){
			var inverse, polymorphic;
			if(rel.opts){
				inverse = rel.opts.inverse;
				polymorphic = rel.opts.polymorphic;
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
				if(!backward){
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
					relatedRecord = store.peekRecord(bModel._name, val[i]);
				}
				else if(typeof val[i] == "object" && !Lyte.isRecord(val[i])){
//					if(val[i]._type){
//						relatedModel = store.modelFor(val[i]._type);
//						backward = this.getBackwardRel(fModel,forward,relatedModel);
//					}
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
					Object.defineProperties(data[fRelKey],{
						record:{
							enumerable:false,
							value:data
						},
						model:{
							enumerable:false,
							value:relModel
						},
						key:{
							enumerable:false,
							value:fRelKey
						},
						filterBy:{
							enumerable:false,
							value:this.filterBy
						},
						add:{
							enumerable:false,
							value:this.add
						},
						remove : {
							enumerable : false,
							value : this.remove
						},
						sortBy : {
							enumerable : false,
							value : this.sortBy
						},
						mapBy : {
							enumerable : false,
							value : store.$.mapBy
						}
					});
				}
				if( !this.hasDuplicateRelation(relatedRecord, data[fRelKey], (forward?store.modelFor(forward.relatedTo)._primaryKey : undefined),type) ){
					if(index != undefined){
						data[fRelKey].splice(index, 0, relatedRecord);
					}
					else if(typeof Lyte.arrayUtils != "undefined"){
//						LyteComponent.arrayFunctions(data[fRelKey], "push", relatedRecord);
						Lyte.arrayUtils(data[fRelKey], "push", relatedRecord);
					}
					else{
						data[fRelKey].push(relatedRecord);
					}
				}
			}
			if(forward == backward){
				return true;
			}
			if( !this.checkForCorrectRelation(backward, data) ){
				return "ERR14";
			}
			var bRelKey = backward.relKey;
			if(backward.relType == "belongsTo"){
				if(relatedRecord[bRelKey] != undefined  && relatedRecord[backward.relKey] !== data){
					this.toDemolishLink(relatedRecord.$.model, relatedRecord, backward);
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
					Object.defineProperties(relatedRecord[bRelKey],{
						record:{
							enumerable:false,
							value:relatedRecord
						},
						model:{
							enumerable:false,
							value:data.$.model
						},
						key:{
							enumerable:false,
							value:bRelKey
						},
						filterBy:{
							enumerable:false,
							value:this.filterBy
						},
						add : {
							enumerable : false,
							value : this.add
						},
						sortBy : {
							enumerable : false,
							value : this.sortBy
						},
						mapBy : {
							enumerable : false,
							value : this.mapBy
						},
						remove : {
							enumerable : false,
							value : this.remove
						}
					});
				}
				if( !this.hasDuplicateRelation(data, relatedRecord[bRelKey], (backward ? store.modelFor(backward.relatedTo)._primaryKey : undefined), type) ){
					if(typeof Lyte.arrayUtils != "undefined"){
//						LyteComponent.arrayFunctions(relatedRecord[bRelKey], "push", data);
						Lyte.arrayUtils(relatedRecord[bRelKey], "push", data);
					}
					else{
						relatedRecord[bRelKey].push(data);
					}
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
			if(Array.isArray(links)){
                var ind = this.getIndex(links, priKey, record[priKey],record._type);
                if(ind != -1){
                    if(typeof Lyte.arrayUtils != "undefined"){
                        Lyte.arrayUtils(relatedRecord[bRelKey],"removeAt",ind,1);
                    }
                    else{
                        relatedRecord[bRelKey].splice(ind, 1);                    
                    }                    
                }
			}
			else if(links && (typeof links == "object" || Lyte.isRecord(links)) ){
				delete relatedRecord[bRelKey];
			}
		},
		toInsertData: function(modelName, payLoad){
				var model = store.modelFor(modelName);
				var data = this.insertIntoStore(model, payLoad[modelName]);
				delete model.rel;
				return data;
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
			Object.defineProperties(newArr,{
				model:{
					enumerable:false,
					value:this.model
				},
				filterBy:{
					enumerable:false,
					value:this.filterBy
				},
				sortBy : {
					enumerable : false,
					value : this.sortBy
				},
				mapBy : {
					enumerable : false,
					value : this.mapBy
				}
			});
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
				for(var i=0; i<oldVal.length; i++){
					this.establishLink(rel.forward, rel.backward, record, oldVal[i]);
				}
			}
		},
		rollBackDelete : function(model, index){
			var deleted = model._deleted, rec = deleted.splice(index, 1)[0];
			rec.$.isDeleted = false;
			if(typeof Lyte.arrayUtils != "undefined"){
//				LyteComponent.arrayFunctions(model.data, "push", rec);
				Lyte.arrayUtils(model.data, "push", rec);
			}
			else{
				model.data.push(rec);
			}
			if(rec.$.isNew || rec.$.isModified){
				this.checkAndAddToArray(model.dirty, rec[model._primaryKey]);
			}
			store.$.clearRecordError(rec.$, model._primaryKey, "ERR17");
			model.emit("add", [rec]);
            store.emit("add", [model._name,rec]);
            
		},
		rollBackNew : function(model, record, pK){
			var index = this.getIndex(model.data, pK, record[pK]);
			if(typeof Lyte.arrayUtils != "undefined"){
//				LyteComponent.arrayFunctions(model.data, "remove", index, 1);
				Lyte.arrayUtils(model.data, "removeAt", index, 1);
			}
			else{
				model.data.splice(index, 1);
			}
			record.$.isNew = false;
			model.emit("delete", [record]);
            store.emit("delete", [model._name,record]);
			this.deleteFromArray(model.dirty, record[pK]);
		},
		emit : function(type, record, attr){
			record.$.emit(type, [record,attr]);
			record.$.model.emit(type, [record, attr]);
            store.emit(type, [record.$.model._name, record, attr]);
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
			if(typeof code == "object"){
				if(typeof LyteComponent != "undefined"){
                    LyteComponent.set($record.error,field,code);
                }else{
                    $record.error[field] = code;                    
                }
			}
			else{
                if(typeof LyteComponent != "undefined"){
                    LyteComponent.set($record.error,field,{code : code, message : Lyte.errorCodes[code]});
                }else{
				    $record.error[field] = {code : code, message : Lyte.errorCodes[code]};                    
                }
				if(value){
					if(typeof LyteComponent != "undefined"){
                        LyteComponent.set($record.error.field,"value",value);
                    }else{
                        $record.error[field].value = value;                        
                    }
                    
				}				
			}
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
			if(store.model.cachedQueries == undefined){
				store.model.cachedQueries = {};
			}
			if(store.model.cachedQueries[modelName] == undefined){
				store.model.cachedQueries[modelName] = [];
			}
			store.model.cachedQueries[modelName].push({queryParams : queryParams, data : data});
		},
		cacheRecordQuery: function(modelName, key, queryParams, data){
			if(store.model.cachedRecordQueries == undefined){
				store.model.cachedRecordQueries = {};
			}
			if(store.model.cachedRecordQueries[modelName] == undefined){
				store.model.cachedRecordQueries[modelName] = {};
			}
			if(store.model.cachedRecordQueries[modelName][key] == undefined){
				store.model.cachedRecordQueries[modelName][key] = [];
			}
			store.model.cachedRecordQueries[modelName][key].push({queryParams : queryParams, data : data});
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
    if(store.adapter.__toAddSuper && store.adapter.__toAddSuper.hasOwnProperty(name)){
        var addSuper = store.adapter.__toAddSuper[name];
        for(var i=0; i<addSuper.length; i++){
            var child = store.adapter[addSuper[i]];
            if(child.isAdapter){
                child.$super = this;
            }
        }
        delete store.adapter.__toAddSuper[name];
    }
	Object.defineProperty(this,"extends", {
		enumerable: false,
		value: store.$.extendAdapter
	});
	Object.defineProperty(this,"isAdapter", {
		value: true,
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
					if(adapter && adapter[key]){
						result = adapter[key];
					}
					else{
						switch(key){
							case "host":
								result = window.location.origin ? window.location.origin : window.location.protocol+"//"+window.location.host;
								break;
							case "namespace":
								result = "";
								break;
							default:
								result = undefined;	
						}
						break;
					}
				}
			}
			return result;
		},
		getNamespace:function(adapter){
			var namespace = adapter ? adapter.namespace : undefined;
			while(namespace == undefined){
				if(adapter && adapter.$super){
					adapter = adapter.$super;
					namespace = adapter ? adapter.namespace : undefined;					
				}
				else{
					adapter = store.adapter.application;
					namespace = (adapter && adapter.namespace) ? adapter.namespace : "";
				}
			}
			return namespace;
		},
		getHost : function(adapter){
			var host = adapter ? adapter.host : undefined;
			while(host == undefined){
				if(adapter && adapter.$super){
					adapter = adapter.$super;
					host = adapter ? adapter.host : undefined;
				}
				else{
					adapter = store.adapter.application;
					host = (adapter && adapter.host) ? adapter.host : window.location.origin ? window.location.origin : window.location.protocol+"//"+window.location.host;
				}
			}
			return host;
		},
		buildURL : function(type,method,modelName,key, snapshot, queryParams,actionName,customData){
			var adapter = store.adapter[modelName], host = this.getHost(adapter), url = "";
			if(host != undefined){
				url+=host;
				if(host[host.length-1] != "/"){
					url+="/";					
				}
			}
			var namespace = this.getNamespace(adapter);
			if(namespace != "" && namespace[namespace.length-1] != "/"){
				url+=namespace+"/";
			}
			else{
				url+=namespace;
			}
			url+=modelName;
			if(key){
				url+="/"+key;
			}
			if(type == "action"){
				url+="/"+this.getActionNamespace(adapter);
				var actions = store.modelFor(modelName).actions, action = actions[actionName].endPoint?actions[actionName].endPoint:actionName;
				url+="/"+action;
			}
            if(!queryParams){
				queryParams = {};
			}
			var scope =  this.getCallBackScope(modelName, "headersForRequest"), args, ret = {method : (method)? method : ""};
			if(scope){
				args = this.constructArgs(type, queryParams,customData);
				ret.headers = this.callBack(scope, args);
			}
			scope = this.getCallBackScope(modelName, "buildURL");
			if(scope){
				args = this.constructArgs(modelName, type, queryParams, snapshot, url,actionName,customData);
				url = this.callBack(scope, args);
			}
			scope = this.getCallBackScope(modelName, "methodForRequest");
			if(scope){
				args = this.constructArgs(method, type, queryParams,customData);
				ret.method = this.callBack(scope, args);
			}
            if(!ret.data && Object.keys(queryParams).length){
				url+="?";
				var index = 0;
				for(var key in queryParams){
					if(index != 0){
						url+="&";
					}
					url+=key+"="+queryParams[key];
					index++;
				}
			}
            if(adapter && adapter.withCredentials == true){
                ret.withCredentials = true;
            }
			ret.url = url;
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
			if(store.modelFor(modelName)){
				if(type == "findAll" && queryParams && store.model.cachedQueries && store.model.cachedQueries[modelName]){
					var cachedQueries = store.model.cachedQueries[modelName], sendData;
					for(var i=0; i<cachedQueries.length; i++){
						var params = cachedQueries[i].queryParams;
						if(this.compareObjects(params, queryParams)){
							sendData = [cachedQueries[i].data, "cache"];
							break;
						}
					}
					if(sendData){
						return new Promise(function(resolve, reject){
							resolve(sendData);
						});
					}
				}
				else if(type == "findRecord" && queryParams && store.model.cachedRecordQueries && store.model.cachedRecordQueries[modelName] && store.model.cachedRecordQueries[modelName][key]){
					var cachedQueries = store.model.cachedRecordQueries[modelName][key], sendData;
					for(var i=0; i<cachedQueries.length; i++){
						var params = cachedQueries[i].queryParams;
						if(this.compareObjects(params, queryParams)){
							sendData = [cachedQueries[i].data, "cache"];
							break;
						}
					}
					if(sendData){
						return new Promise(function(resolve, reject){
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
								resolve([toRet, "cache"], "success", undefined, true);
							});
						}
					}
				}
				var urlObj = this.buildURL(type, "GET", modelName, key, undefined, queryParams,undefined,customData), self = this;
				return new Promise(function(resolve, reject){
					var processRequest = self.getFromAdapter(store.adapter[modelName],"processRequest"),payLoad, sendXHR = true;
					if(processRequest){
						sendXHR = false;
						var returnPromise = self.callGeneric(type,modelName);
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
					if(sendXHR){
						var xhr = new XMLHttpRequest();
						xhr.open("GET", urlObj.url, true);
						for(var key in urlObj.headers){
							xhr.setRequestHeader(key, urlObj.headers[key]);
						}
                        xhr.withCredentials = (urlObj.withCredentials)?true:false;
						xhr.send(urlObj.data);
						xhr.onreadystatechange = function(){
							if(xhr.readyState == 4){
								if(xhr.status.toString()[0] == "2" || xhr.status.toString()[0] == "3"){
									var resp = xhr.responseText;
                                    resp = (resp == "" ? JSON.parse("{}") : JSON.parse(resp));
                                    if(store.adapter && store.adapter[modelName]){
                                        var scope =  self.getCallBackScope(modelName, "parseResponse"), args;
                                        if(scope){
                                            args = self.constructArgs(type, modelName, xhr, resp);
                                            resp = self.callBack(scope, args);
                                        }

                                    }
									payLoad = self.getResponse(resp,modelName,type,key,urlObj,xhr);
									resolve([payLoad, xhr.statusText, xhr]);
								}
								else{
                                    var scope =  self.getCallBackScope(modelName, "parseResponse"), args;
                                    if(scope){
                                        args = self.constructArgs(type, modelName, xhr);
                                        resp = self.callBack(scope, args);
                                    }
									reject(xhr);
								}
							}
						}
					}
				});
			}
			return Promise.reject({code : "ERR19", message : Lyte.errorCodes.ERR19, data:modelName});
		},
        getResponse:function(resp,modelName,type,key,urlObj,xhr){
//            if(resp == ""){
//                resp = "{}";
//            }
//            try{
//                resp = JSON.parse(resp);
//            }
//            catch(e){
//                //do nothin
//            }
            resp = store.serializer.$.normalizeResponse(modelName, type, resp, key, xhr ? xhr.status : xhr, urlObj.headers);
            var scope = store.serializer.$.getCallBackScope(modelName, "extractMeta");
            var payLoad = resp,args;
            if(typeof payLoad != "object"){
                payLoad = JSON.parse(payLoad);
            }
            if(scope){
                args = this.constructArgs(payLoad,modelName,type);
                payLoad.meta = this.callBack(scope, args);
            }
            if(payLoad){
                scope = store.serializer.$.getCallBackScope(modelName, "deserializeKey");
                if(scope){
                    var keys = Object.keys(payLoad), index = 0;
                    if(keys.length == 2 && keys[0] == "meta"){
                        index = 1;
                    }
                    args = this.constructArgs(modelName,type);
                    var deserializeKey = this.callBack(scope, args), rec = payLoad[keys[index]];
                    delete payLoad[keys[index]];
                    payLoad[deserializeKey] = rec;
                }
//					store.serializer.$.buildJSON(modelName, type, payLoad, key, xhr.status, urlObj.headers);
                store.serializer.$.normalize(modelName, type, payLoad, key, xhr ? xhr.status : xhr, urlObj.headers);
            }
            return payLoad;
		},
		put : function(modelName, data, record, isSingleRecord,customData){
			var type=(isSingleRecord)?"updateRecord":"update", urlObj = this.buildURL(type, "PATCH", modelName, isSingleRecord ? data[store.modelFor(modelName)._primaryKey] : undefined, data,undefined,undefined,customData);
             var updatedData = store.$.toJSON(modelName, data);
            store.$.removeNotDefinedKeys(store.modelFor(modelName), updatedData);
			this.sendingData(modelName, updatedData, urlObj,type,customData);
			return this.handleRequest(urlObj, modelName, record, type);
		},
		del : function(modelName, data, isSingleRecord,destroy, customData){
			var pk = store.modelFor(modelName)._primaryKey;
			var type = destroy || "deleteRecord", urlObj = this.buildURL(type, "DELETE", modelName, isSingleRecord ? data[pk] : undefined, data,undefined,undefined,customData);
			var ids = {};
			if(!isSingleRecord){
				ids = data.map(function(val){
					return val[pk];
				});				
			}
			this.sendingData(modelName, (isSingleRecord) ?  (data ? data[pk] : undefined) : ids, urlObj,type,customData);
			return this.handleRequest(urlObj, modelName, data, type);
		},
		create : function(modelName, data, isSingleRecord, customData){
			var changedData = store.$.toJSON(modelName, data);
			store.$.removeNotDefinedKeys(store.modelFor(modelName), changedData);
			var type= isSingleRecord ? "createRecord": "create", urlObj = this.buildURL(type, "POST", modelName, undefined, data,undefined,undefined,customData);
			this.sendingData(modelName, changedData, urlObj,type,customData);
			return this.handleRequest(urlObj, modelName, data, type);
		},
		sendingData:function(modelName,data,urlObj,type,customData){
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
				var args = this.constructArgs(type,payload,data,customData);
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
		handleAction:function(actionName,model,record,customData){
			var pkVal;
			if(record && Lyte.isRecord(record)){
				pkVal = record.$.get(model._primaryKey);				
			}
			var method = "action";
			var urlObj = this.buildURL(method, "POST", model._name, pkVal, record, undefined, actionName,customData);
			var scope = store.serializer.$.getCallBackScope(model._name, "serialize");
			if(scope){
				var args = this.constructArgs(actionName,undefined,record,customData);
				urlObj.data = this.callBack(scope, args);
			}
			return this.handleRequest(urlObj, model._name, undefined, method);
		},
		handleRequest:function(urlObj,modelName,data,type){
			if(urlObj.data && (typeof urlObj.data == "object" || Lyte.isRecord(urlObj.data) || Array.isArray(urlObj.data)) && !(urlObj.data instanceof FormData)){
				urlObj.data = JSON.stringify(urlObj.data);
			}
			var self = this;
			return new Promise(function(resolve, reject){
				var processRequest = self.getFromAdapter(store.adapter[modelName],"processRequest"),sendXHR = true;
				if(processRequest){
					sendXHR = false;
					var returnPromise = self.callGeneric(type,modelName,urlObj.data,data),response;
					if(returnPromise instanceof Promise){						
						returnPromise.then(function(resp){
                            resp = (resp == "" ? JSON.parse("{}") : JSON.parse(resp));
							response = self.genericResponse(resp,modelName,type,data,urlObj);
							resolve(response);
						},function(message){
							reject(message);
						});
					}
					else{
						sendXHR = true;
					}
				}
				if(sendXHR){
					var xhr = new XMLHttpRequest();
					xhr.open(urlObj.method, urlObj.url, true);
					for(var key in urlObj.headers){
						xhr.setRequestHeader(key, urlObj.headers[key]);
					}
                    xhr.withCredentials = (urlObj.withCredentials)?true:false;
					xhr.send(urlObj.data);
					xhr.onreadystatechange = function(){
						if(xhr.readyState == 4){
							if(xhr.status.toString()[0] == "2" || xhr.status.toString()[0] == "3"){
								var resp = xhr.responseText,response;
                                resp = (resp == "" ? JSON.parse("{}") : JSON.parse(resp));
                                if(store.adapter && store.adapter[modelName]){
                                    var scope =  self.getCallBackScope(modelName, "parseResponse"), args;
                                    if(scope){
                                        args = self.constructArgs(type, modelName, xhr, resp);
                                        resp = self.callBack(scope, args);
                                    }

                                }
								response = self.genericResponse(resp,modelName,type,data,urlObj,xhr)
								resolve(response);
							}
							else{
                                var scope =  self.getCallBackScope(modelName, "parseResponse"), args;
                                if(scope){
                                    args = self.constructArgs(type, modelName, xhr);
                                    resp = self.callBack(scope, args);
                                }
								reject(xhr);
							}
						}
					}
				}
			});
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
//			if(resp == ""){
//				resp = "{}";
//			}
//			var response = JSON.parse(resp);
            var response = resp;
            var scope,args;
			scope = store.serializer.$.getCallBackScope(modelName, "extractMeta");
			if(scope){
				args = this.constructArgs(response,modelName,type);
				response.meta = this.callBack(scope, args);
			}
			if(response){
				response = store.serializer.$.buildJSON(modelName, type, response, Lyte.isRecord(data) ? data[store.modelFor(modelName)._primaryKey] :undefined ,xhr ? xhr.status : xhr, urlObj.headers);
                var scope = store.serializer.$.getCallBackScope(modelName, "deserializeKey");
				if(scope){
					var keys = Object.keys(response), index = 0;
					if(keys.length == 2 && keys[0] == "meta"){
						index = 1;
					}
					var args = this.constructArgs(modelName,type), deserializeKey = this.callBack(scope, args), rec = response[keys[index]];
					delete response[keys[index]];
					response[deserializeKey] = rec;
				}
			}
			if(type != "action"){
				this.handleResponse(urlObj, data, response[modelName], xhr ? xhr.statusText : xhr, xhr, store.modelFor(modelName));
			}
			return response;
		},
        checkResponse:function(data,model,response,pK){
            if(data.$.isNew){
            	if(data.hasOwnProperty(pK) && response.hasOwnProperty(pK)){
            		if(typeof LyteComponent != "undefined"){
            			LyteComponent.set(data,pK,response[pK],true);
            		}
            		else{
            			data[pK] = response[pK];
            		}
            	}
                store.$.validateAndMerge(model, response);						
                data.$.isNew = false;
            }
            if(data.$.isModified){
                data.$.isModified = false;
                data.$._attributes = {};
                if(!data.$.isDeleted && response){
                    store.$.validateAndMerge(model, response);						
                }
            }
            if(model.dirty.length){
                store.$.deleteFromArray(model.dirty, data[pK]);
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
				  this.checkResponse(data[i],model,Array.isArray(response) ? response[i] : response,pK);	
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
		compareObjects : function(obj1, obj2){
            if(!(obj1 instanceof Object) || !(obj2 instanceof Object)){
                return false;
            }
			if(Object.keys(obj1).length != Object.keys(obj2).length){
				return false;
			}
			for(var key in obj1){
				var val1 = obj1[key], val2 = obj2[key];
				if(val2 == undefined || val1 != val2){
					return false;
				}
			}
			return true;
		},
        /*Returns the specified action namespace of a model
        params - adapter
        return - namespace
        */
		getActionNamespace : function(adapter){
			var namespace = adapter ? adapter.actionNamespace : undefined;
			while(namespace == undefined){
				if(adapter && adapter.$super){
					adapter = adapter.$super;
					namespace = adapter ? adapter.actionNamespace : undefined;					
				}
				else{
					adapter = store.adapter.application;
					namespace = (adapter && adapter.actionNamespace) ? adapter.actionNamespace : "action";
				}
			}
			return namespace;
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
    
    if(store.serializer.__toAddSuper && store.serializer.__toAddSuper.hasOwnProperty(name)){
        var addSuper = store.serializer.__toAddSuper[name];
        for(var i=0; i<addSuper.length; i++){
            var child = store.serializer[addSuper[i]];
            if(child.isSerializer){
                child.$super = this;
            }
        }
        delete store.serializer.__toAddSuper[name];
    }
	Object.defineProperty(this,"extends", {
		enumerable: false,
		value: store.$.extendSerializer
	});
	Object.defineProperty(this,"isSerializer", {
		value: true,
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
        buildJSON:function(modelName,type,payLoad,id, status, headers){
            var scope = this.getCallBackScope(modelName, "normalizeResponse");
            var realData = payLoad;
            if(scope){
                var args = store.adapter.$.constructArgs(modelName, type, realData, id, status, headers);
                realData = store.adapter.$.callBack(scope, args);
            }
            var changed = false;
            if(/^(findRecord|findAll)$/.test(type) || realData[modelName]){
                realData = realData[modelName];
                changed = true;
            }
            scope = this.getCallBackScope(modelName, "normalize");
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
                return payLoad;
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
	pushPayload:{
		enumerable:false,
		value:function value(modelName,data,deserialize){
			var model = store.modelFor(modelName);
            var result = data;
			if(deserialize){
                data = store.serializer.$.buildJSON(modelName,"pushPayload",data);
                var scope = store.serializer.$.getCallBackScope(modelName, "deserializeKey");
                if(scope){
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
  			data = store.$.insertIntoStore(model, result);
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
			var extend,actions;
			if(options && typeof options == "object"){
				extend = (options.extends) ? options.extends : undefined;
				actions = (options.actions) ? options.actions : undefined;
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
			return store.model[name];
		}
	},
    // unregisterModel:{
    //   enumerable:false,
    //   value:function(name){
    //      var model = store.modelFor(name);
    //      if(model.data.length){
    //          store.unloadAll(name);
    //      }
    //      delete store.model[name];  
    //   }
    // },
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
				if(cacheData === false){
                    if(cacheQuery && Object.keys(queryParams).length > 0){
						store.$.cacheQuery(modelName, queryParams, data);
					}
					return data;
				}
				if(data && !data.save){
					if(!fromCache){
						var rawData = Object.assign({}, data);
						var records = store.$.toInsertData(modelName, data);
                        data[modelName] = records;
						if(data.meta && records){
							Object.defineProperty(data[modelName], "$", {
								enumerable : false,
								value : {meta : data.meta}
							});
						}
						if(cacheQuery && Object.keys(queryParams).length > 0){
                            store.$.cacheQuery(modelName, queryParams, data);								
						}						
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
				if(cacheData === false){
                    if(arguments[0][1] != "cache" && cacheQuery && Object.keys(queryParams).length > 0){
						store.$.cacheRecordQuery(modelName, key, queryParams, data);
					}
					return data;
				}
				if(data){
					if(!fromCache){
						var rawData = Object.assign({}, data);
						if(!Lyte.isRecord(data)){
							var record = store.$.toInsertData(modelName, data);
							data[modelName] = record;
							if(data.meta){
								record.$.meta = data.meta;
							}
						}
						if(arguments[0][1] != "cache" && cacheQuery && Object.keys(queryParams).length > 0){
                            store.$.cacheRecordQuery(modelName, key, queryParams, data);
                        }						
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
				console.error("No model found for ",modelName);
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
				console.error("No model found for ",modelName);
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
			if(data){
				this.$.removeFromStore(model, data[model._primaryKey], true);
			}
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
		value:function value(modelName,actionName,customData){
			var model = store.modelFor(modelName);
			var actions = model.actions, action = (actions)?model.actions[actionName]:undefined;
			if(action){
				return store.adapter.$.handleAction(actionName,model,store.peekAll(modelName),customData).then(function(data){
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
		value : function value(modelName, recordObject, customData){
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
				return store.adapter.$.create(modelName, created, false, customData);
			}
			return Promise.resolve();
		}
	},
	update : {
		enumerable : false,
		value : function value(modelName,customData){
			var model = this.modelFor(modelName);
			if(model == undefined){
				return Promise.reject({code : "ERR19", message : Lyte.errorCodes.ERR19, data : modelName});
			}
			var changed = [], recordsChanged = [], pK = model._primaryKey;
			for(var i=0; i<model.dirty.length; i++){
				var rec = store.peekRecord(modelName, model.dirty[i]);
				if(rec && rec.$.isModified && !rec.$.isNew){
					var attr = rec.$._attributes, obj = {};
					for(var key in attr){
						obj[key] = rec.$.get(key);
					}
					obj[pK] = rec.$.get(pK);
					changed.push(obj);
					recordsChanged.push(rec);
				}
			}
			if(changed.length){
				return store.adapter.$.put(modelName, changed, recordsChanged,false, customData);
			}
			return Promise.resolve();
		}
	},
	delete : {
		enumerable : false,
		value : function value(modelName, key, customData){
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
				return store.adapter.$.del(modelName, deleted,undefined,"delete",customData).then(function(resp){
					return resp;
				}, function(e){
					return Promise.reject(e);
				});
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
				if(this.adapter.$.compareObjects(cachedQueries[i].queryParams, queryParams)){
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