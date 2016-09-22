;(function (root, factory) {  // eslint-disable-line
  // Making module available as AMS, CommonJS and for browser.
  /* eslint-disable no-undef */
  if (typeof define === 'function' && define.amd) {
    define(['mithril'], function (m) {
      return (function () { return factory(m) })
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('mithril'))
  } else {
    root['mithril-viewmodel'] = factory(root.m)
  }
  /* eslint-enable no-undef */
}(this, function(m) {
  'use strict'
  // Start of module definition.

  function mithrilDeepCopy (obj) {
    var result = Array.isArray(obj) ? [] : {}

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var prop = obj[key]

        switch (typeof prop) {
        case 'function':
          // All functions should be m.prop instances.
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


  // Each viewmodel has its own number to prevent collisions in case user
  // uses two viewmodels for one model.
  var viewmodelCounter = 0

  // Main viewmodel function.
  function viewmodel (vmDefaults, propName) {
    propName = propName || viewmodel.propName.replace('%', viewmodelCounter++)

    if (typeof vmDefaults !== 'object') {
      throw Error('Viewmodel defaults object must be a JS object.')
    }

    var f = function (model) {
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
          writable: false,
          configurable: true
        })
      }

      return viewmodelObj
    }

    f.destroy = function (model) {
      delete model[propName]
    }

    return f
  }

  // Pattern for property name, % is a placeholder.
  viewmodel.propName = '__viewmodel_%__'


  return viewmodel
}));  // eslint-disable-line


//;(function () {

//})();

