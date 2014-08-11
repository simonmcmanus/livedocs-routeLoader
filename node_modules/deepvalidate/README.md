#Deep Validate

Given two objects, check that the data given in the first object is present in the second object.

Also checks that the types of the two values are the same.


##Usage:
```
  validate('objects', obj1, obj2, function(obj1, obj2, key, failure, name) {
    console.log(obj1[key]);
  })
```
