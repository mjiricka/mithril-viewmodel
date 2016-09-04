var assert = require('assert')
var m = require('mithril')
var viewmodel = require('../mithril-viewmodel')

describe('Viewmodel', function () {
  it('should return given default values', function () {
    var vm = viewmodel({
      num: 10,
      str: 'hello'
    })
    var model = {}

    assert(vm(model).num === 10)
    assert(vm(model).str === 'hello')
  })

  it('should return given default values even for m.prop', function () {
    var vm = viewmodel({
      num: m.prop(10),
      str: 'hello'
    })
    var model = {}

    assert(vm(model).num() === 10)
    assert(vm(model).str === 'hello')
  })

  it('modifications of viewmodel should be preserved', function () {
    var vm = viewmodel({str: 'hello'})
    var model = {}
    vm(model).str = 'bye'

    assert(vm(model).str === 'bye')
  })

  it('model should be untouched', function () {
    var vm = viewmodel({})
    var model = {test: 42}

    vm(model)

    assert(model.test === 42)
  })

  it('two viewmodels should not interfere', function () {
    var vm = viewmodel({
      str: 'hello'
    })

    var model1 = {}
    var model2 = {}

    vm(model1).str = 'bye'

    assert(vm(model1).str === 'bye')
    assert(vm(model2).str === 'hello')
  })

  it('modifications should be preserved for m.prop', function () {
    var vm = viewmodel({
      str: m.prop('hello')
    })
    var model = {}

    vm(model).str('bye')
    assert(vm(model).str() === 'bye')
  })

  it('private property cannot be modified', function () {
    var vm = viewmodel({test: 42})

    var model = {}
    vm(model)

    model.__viewmodel__ = {}

    assert(vm(model).test === 42)
  })

  it('private property cannot be enumerated', function () {
    var vm = viewmodel({test: 42})

    var model = {test2: 43}
    vm(model)

    var props = []
    for (p in model) {
      props.push(p)
    }

    assert(props.length === 1 && props[0] === 'test2')
  })

  it('makes a deep copy for objects', function () {
    var vm = viewmodel({
      test: 42,
      test2: {
        test3: 'hello'
      }
    })

    var model1 = {}
    var model2 = {}

    vm(model1).test2.test3 = 'bye'

    assert(vm(model1).test2.test3 === 'bye')
    assert(vm(model2).test2.test3 === 'hello')
  })

  it('makes a deep copy for arrays', function () {
    var vm = viewmodel({
      test: 42,
      test2: ['hey', 'hello']
    })

    var model1 = {}
    var model2 = {}

    vm(model1).test2[1] = 'bye'

    assert(vm(model1).test2[1] === 'bye')
    assert(vm(model2).test2[1] === 'hello')
  })

  it('date can be wrapped inside m.prop', function () {
    var now = new Date()

    var vm = viewmodel({
      time: m.prop(now)
    })

    assert(vm({}).time() === now)
  })

  it('one model can have more viewmodel instances', function () {
    var vm1 = viewmodel({test: 1})
    var vm2 = viewmodel({test: 2})

    var model = {}
    vm1(model)
    vm2(model)

    assert(vm1(model).test === 1)
    assert(vm2(model).test === 2)
  })

  it('can be hacked with auto-incremented key for new models', function () {
    var keyCounter = 0
    var vm = viewmodel({
      key: function () { return keyCounter++ }
    })

    var model1 = {}
    var model2 = {}

    assert(vm(model1).key() === 0)
    assert(vm(model2).key() === 1)

    assert(vm(model1).key() === 0)
  })

  it('throws error when user does not pass object', function () {
    var error = false

    try {
      viewmodel()
      error = true
    } catch (ex) { }

    assert(error === false)
  })

  it('throws error when user does not pass object as model', function () {
    var error = false
    var vm = viewmodel({})

    try {
      vm()
      error = true
    } catch (ex) { }

    assert(error === false)
  })

  it('name of a private property can be configured', function () {
    var vm = viewmodel({}, 'secret')

    var model = {}
    vm(model)

    assert(model.secret !== undefined)
  })

  it('private property pattern can be configured', function () {
    // Counter is not tested, it would be difficult.
    viewmodel.propName = 'secret_0'
    var vm = viewmodel({})

    var model = {}
    vm(model)

    assert(model.secret_0 !== undefined)
  })
})

