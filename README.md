# Mithril viewmodel

Implementation of viewmodel library for Javascript MVC framework [Mithril](http://mithril.js.org/), that is based on article on Mithril's official blog [Mapping view models](http://lhorie.github.io/mithril-blog/mapping-view-models.html).

Unlike an implementation that is proposed by author of the article, this module does not store mapping from model to viewmodel in a map, but it adds "secret" unwrittable read-only property to each model. Moreover it support nested viewmodel defaults and also it does not enforce m.prop for all its fields.

Here is an example of usage:
    
    var viewmodel = require('mithril-viewmodel.js')

    // Here is defined a viewmodel with its default values.
    var vm = viewmodel({
        prop1: 42,
        propObj: { // Properties can be nested.
            prop2: 'hello',
            prop3: m.prop('') // Function m.prop can be used.
        },
        propArr: [1, 2, 3] // Array can be also used.
    })

    var model = {a: 3}

    // Get a viewmodel for the model.
    console.log(vm(model).propObj.prop2) // Prints "hello".

    // Assign values to the viewmodel.
    vm(model).propObj.prop3('initialized')
    console.log(vm(model).propObj.prop3()) // Prints "initialized".

For more examples, see tests please.

Some additional notes:
 * Viewmodel must be always object.
 * In viewmodel defaults object, all properties that are functions (means all objects `obj` such as `typeof obj === 'function'`) must be instances of `m.prop`!
 * It for example means one cannot use `Date` type. But one can use `m.prop(new Date())`. (And access is as `vm(model).dateProp()`.)
 * Hack: but you can define something like: `viewmodel({key: () => keyCounter++})` to automatically assign key attributes! (And again, access them as `m.prop` property, e.g. `vm(obj).key()`.)
 * There is no check for circular dependencies in viewmodel defaults.
 * You can define more viewmodels for one model!
 * Name of a "secret" property can be configured! (Both globally as `viewmodel.propName = 'pattern_%`, where **%** is a placeholder or locally as `viewmodel({}, 'secret_prop_name')`.)

