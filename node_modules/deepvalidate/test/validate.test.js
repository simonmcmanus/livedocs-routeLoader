var validate = require('../index.js');
var should = require('should');
var sinon = require('sinon');


// todo test fail handler
// call fail hanlder in iterator..

describe('When the deep validate function is included', function() {
  it('is should return a function', function() {
    (typeof validate).should.equal('function');
  })

  describe('given two objects containging only strings', function() {
    var obj1;
    var obj2;
    beforeEach(function(done) {
      obj1 = {
        'key': 'value'
      }
      obj2 = {
        'key': 'value'
      }
      done();
    })


    describe(' that contain the same string key values pairs', function() {
      it(' should return true', function() {
        var out =
        should(validate('name', obj1, obj2)).equal(true);
      });
    });

    describe(' that contain  string key values pairs of differnt case',
      function() {
        var obj2 = {
          'Key': 'value'
        }
        it('should return false', function() {
          var out =
          should(validate('name', obj1, obj2)).equal(false);
        })
      }
    );

    describe('that contain the same keys but different values', function() {

      before(function() {
        obj2.key = 'something else';
      })

      it(' should return true', function() {
        should(validate('name', obj1, obj2, function(reason) {
        })).equal(true);
      })
    });

    // describe('that contain the same value but are of different types', function() {
    //   before(function() {
    //     obj1.key = 1;
    //     obj2.key = '1';
    //   })
    //   it('should return false as it checks types', function() {
    //     should(validate('name', obj1, obj2)).equal(false);
    //   })
    // });

  });


  describe('Given an object containing the same nested object', function() {
    beforeEach(function(done) {
      obj1 = {
        key: {
          harry: 'beagle'
        }
      }
      obj2 = {
        key: {
          harry: 'beagle'
        }
      }
      done();
    });

    it('should return true', function() {
      should(validate('name', obj1, obj2)).equal(true);
    });
  });

  describe('when a nested object key is changed to be uppercase', function() {
    before(function(done) {
      obj1 = {
        key: {
          harry: 'beagle'
        }
      }
      obj2 = {
        key: {
          Harry: 'beagle'
        }
      }
      done();
    });

    it('should fail', function() {
      should(validate('name', obj1, obj2)).equal(false);
    });
  });

  describe('Given two objects', function() {
    beforeEach(function() {
      var ob1 = {
        beagles: [
          {
            'key': 'value'
          },
          {
            'key1': 'value1'
          }
        ]
      }
      var ob2 = {
        beagles: [
          {
            'key': 'value'
          },
          {
            'key1': 'value1'
          }
        ]
      }
    });
    describe('which contain the same array of object', function() {
      it('should return true', function() {
        should(validate('name', obj1, obj1)).equal(true)
      });
    });

    describe('which contain the same array of object but with a different key', function() {
      it('should return true', function() {
        before(function() {
          delete  obj2.beagles[1].key1;
          obj2.beagles[1].Ley1 = 'bogs';
        });
        should(validate('name', obj1, obj2)).equal(false)
      });
    })
  });

  describe('Given two objects containing three keys each', function() {
    var obj1;
    var obj2;
    var iterator;
    before(function(done) {
      obj1 = {
        'key': 'value',
        'key1': 'value',
        'key2': 'value'
      }
      obj2 = {
        'key': 'value',
        'key1': 'value',
        'key2': 'value'
      }

      iterator = sinon.spy();
      validate('name', obj1, obj2, iterator);
      done();
    })
    describe('when called', function() {
      it('it should call the iterator 3 times.', function() {
        should(iterator.callCount).equal(3);
      });
    });
  });


  describe('Given two objects containing three keys each (one of which should fail.)', function() {
    var obj1;
    var obj2;
    var iterator;
    before(function(done) {
      obj1 = {
        'key': 'value',
        'key1': 'value',
        'asdkey2': 'value'
      }
      obj2 = {
        'key': 'value',
        'key1': 'value',
        'key2': 'value'
      }

      iterator = sinon.spy();
      validate('name', obj1, obj2, iterator);
      done();
    })
    describe('when called', function() {
      it('it should call the iterator 3 times.', function() {
        should(iterator.callCount).equal(3);
      });
    });
  });


  describe('given an iterator function', function() {

    describe('Given two objects containing one key value fail which fails', function(done) {
      var obj1;
      var obj2;
      before(function(done) {
        obj1 = {
          'key': 'value'
        }
        obj2 = {
          'asdkey2': 'value'
        }

        iterator = sinon.spy();

        validate('name', obj1, obj2, iterator);
        done();
      })
      describe('when called', function() {
        it('should pass the iterator the reasons for failure.', function() {
          should(iterator.calledWith(obj1, obj2, 'key', 'Expected object key `key` to exist.', 'name')).equal(true);
        });
      });
    });


    describe('given two objects containing nested objects.', function() {

      var obj1;
      var obj2;
      var iterator;

      before(function(done) {

        obj1 = {
          key: {
            bacon: {
              'cat': 'tiger'
            }
          }
        };
        obj2 = {
          key: {
            bacon: {
              'cat': 'tiger'
            }
          }
        };
        iterator = sinon.spy();
        validate('starting', obj1, obj2, iterator);
        done();
      });

      describe('when validate is called', function() {
        it('iterator should get called once as only one key/value pair is compared', function() {
          should(iterator.callCount).equal(1);
        });
        it('should pass in the object path of the keys on failure and success', function() {
          should(iterator.calledWith(obj1.key.bacon, obj2.key.bacon, 'cat', false, 'starting.key.bacon')).equal(true);
        });
      });
    });

    describe('given two objects containing an array of objects.', function() {

      var obj1;
      var obj2;
      var iterator;

      before(function(done) {

        obj1 = {
          key: [
            {
              dog: 'beagle'
            }
          ]
        };
        obj2 = {
          key: [
            {
              dog: 'beagle'
            }
          ]
        };

        iterator = sinon.spy();
        validate('starting', obj1, obj2, iterator);
        done();
      });

      describe('when validate is called', function() {
        it('iterator should get called once as there is one key/value comparisons', function() {
          should(iterator.callCount).equal(1);
        });
        it('should pass in the object path of the keys on failure and success.', function() {
          should(iterator.calledWithExactly(obj1.key[0], obj2.key[0], 'dog', false, 'starting.key[0]')).equal(true);
        });
      });
    });
  });
});
