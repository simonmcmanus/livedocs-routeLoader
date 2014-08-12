/**
 * Compare two objects, for structure, and types of the values.
 * @param  {String} name     Name, usually the name of the objects you are comparing.
 * @param  {Object} obj      The first object
 * @param  {Object} obj1     The second object
 * @param  {Function} iterator A function to be called on each comparison.
 * @return {Boolean}          Do the two objects have the same structure and types?
 */
var validate = module.exports = function(name, obj, obj1, iterator) {
  var _iterator = function(failure, key, obj, obj1) {
    if(iterator) {
        iterator(obj, obj1, key, failure, name);
    }
  }
  var success = true; // if not true should store the failure reason.
  for (var item in obj) {
    var failure = false; // stores the failure for the current iteration.
    if (typeof obj[item] === 'object') {
      if (obj[item] instanceof Array) {

        // we got an array, lets iterate over it.
        var c = obj[item].length;
        while (c--) {
          var type = typeof obj[item][c];
          if(type === 'object') {
            if (!validate(name + '.' + item + '[' + c + ']',
                obj[item][c], obj1[item][c], iterator)
              ) {
              success = false;
            }
          }
        }
      } else {
        // plain old object. validate can handle.
        if (!validate(name + '.' + item, obj[item], obj1[item], iterator)) {
          success = false;
        }
      }
    } else {
      if (typeof obj1[item] ===  'undefined') {
        success = false;
        failure  = 'Expected object key `' + item + '` to exist. (' + name + ')';
      }
      else if ((typeof obj1[item]) !== (typeof obj[item])) {
        // then confirm the values are of the same type
        success = false;
        failure = 'Fail, expected item:' + item + '  of type ' +
          (typeof  obj[item]) + ' to equal ' + (typeof obj1[item]) + '(' + name + ')'
      }
      _iterator(failure, item, obj, obj1);
    }
  }
  return success;
}
