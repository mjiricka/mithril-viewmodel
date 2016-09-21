var m = require('mithril')

function mithrilDeepCopy (obj) {
  var result = Array.isArray(obj) ? [] : {}

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var prop = obj[key]

      switch (typeof prop) {
        case 'function':
          // All function should be m.prop instances.
          result[key] = m.prop(prop())
          break
        case 'object':
          result[key] = mithrilDeepCopy(prop)
          break
        default:
          // Simply copy the value.
          result[key] = prop
      }
    }
  }

  return result
}

var viewmodelFuncObj
var viewmodelCounter = 0

function viewmodel (vmDefaults, propName) {
  propName = propName || viewmodelFuncObj.propName.replace('%', viewmodelCounter++)

  if (typeof vmDefaults !== 'object') {
    throw Error('Viewmodel defaults object must be a JS object.')
  }

  return function (model) {
    if (typeof model !== 'object') {
      throw Error('Model must be a JS object.')
    }

    var viewmodelObj = model[propName]

    if (viewmodelObj === undefined) {
      // Create a new viewmodel.
      viewmodelObj = mithrilDeepCopy(vmDefaults)

      // Assign it.
      Object.defineProperty(model, propName, {
        value: viewmodelObj,
        enumerable: false,
        writable: false
      })
    }

    return viewmodelObj
  }
};

viewmodelFuncObj = viewmodel
viewmodel.propName = '__viewmodel_%__'

module.exports = viewmodel

