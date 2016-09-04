var m = require('mithril');


function mithrilDeepCopy(obj) {
    var result = {};

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var prop = obj[key];

            switch (typeof prop) {
            case 'function':
                // All function should be m.prop instances.
                result[key] = m.prop(prop());
                break;
            case 'object':
                result[key] = mithrilDeepCopy(prop);
                break;
            default:
                // Simply copy the value.
                result[key] = prop;
            }
        }
    }

    return result;
}

var viewmodelFuncObj;
var viewmodelCounter = 0;

function viewmodel (model, propName) {
    propName = propName || viewmodelFuncObj.propName.replace('%', viewmodelCounter++);

    return function (obj) {
        var viewmodelObj = obj[propName];

        if (viewmodelObj === undefined) {
            // Create a new viewmodel.
            viewmodelObj = mithrilDeepCopy(model);

            // Assign it.
            Object.defineProperty(obj, propName, {
                value: viewmodelObj,
                enumerable: false,
                writable: false
            });
        }

        return viewmodelObj;
    };
};

viewmodelFuncObj = viewmodel;
viewmodel.propName = '__viewmodel_%__';


module.exports = viewmodel;

