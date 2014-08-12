'use strict';

var validate = require('../validate');
var should = require('should');
var sinon = require('sinon');

var req = {
  params: { // as passed in by the user

  },
  spec: {  // as provided by the spec.
    parameters: []
  }
};

var number = {
  name: 'numericValue',
  type: 'number',
  required: true
};

var list = {
  name: 'aList',
  type: 'string',
  options: {
    'option1': 'Options 1',
    'option2': 'Options 2',
  }
};

describe('Validate', function() {
  var next;

  describe('given a required field in the spec, when that field is not present', function() {
    var isPresent;
    before(function() {
      req.spec.parameters = [number];
      next = sinon.spy();
      validate(req, null, next);
    });

    it('should call the callback with an error stating that a required fields is missing', function() {
      should(next.args[0][0].body.code).equal('BadRequestError');
      isPresent = (next.args[0][0].body.message.indexOf('`numericValue` is a required field.')  > -1);
      should(isPresent).equal(true);
    });
  });
  describe('When a required parameter is provided', function() {
    before(function() {
      req.spec.parameters = [number];
      req.params.numericValue = '2';
      next = sinon.spy();
      validate(req, null, next);
    });

    it('it should not error when the param is provided', function() {
      should(next.args[0]).eql([]);
    });
  });

  describe('When a numeric value is requried and a  string provided', function() {

    before(function() {

      req.spec.parameters = [number];
      req.params.numericValue = 'notanumber';
      next = sinon.spy();
      validate(req, null, next);
    });

    it('should fail when a non numeric value is provided', function() {
      should(next.args[0][0].body.code).equal('BadRequestError');
      should(next.args[0][0].body.message).equal('Expected number in field `numericValue` but got value: `notanumber`.');
    });
  });

  describe('When a numeric value is required and provided', function() {

    before(function() {
      req.spec.parameters = [number];
      req.params.numericValue = '2';
      next = sinon.spy();
      validate(req, null, next)
    });

    it('should not fail', function() {
      should(next.args[0]).eql([]);
    });
  });

  describe('When an option array is provided', function() {
    describe('when the value exists in the array', function() {
      before(function() {
        req.spec.parameters = [list];
        req.params.aList = 'option1';
        next = sinon.spy();
        validate(req, null, next);
      });

      it('should not error', function() {
        should(next.args[0]).eql([]);
      });
    });


    describe('if the value does not exist in the array', function() {

      before(function() {
        req.spec.parameters = [list];
        req.params.aList = 'option3';
        next = sinon.spy();
        validate(req, null, next);
      });


      it('should return a unexpected value error.', function() {
        should(next.args[0][0].body.code).equal('BadRequestError');
        should(next.args[0][0].body.message).equal('Invalid value (option3) entered in field: `aList`. Available options are: option1, option2');
      });
    });
  });



  describe('when a param is marked as required but with location of path', function () {

      before(function() {
        req.spec.parameters = [{
          name: 'id',
          location: 'path',
          required: true
        }];
        next = sinon.spy();
        validate(req, null, next);
      });

    it('should not reject the request for not having a id param', function () {
      should(next.args[0][0]).equal(undefined);
    });
  });
});



// describe('when not data given but the field is not required.', function () {

// });


// describe('should reject when no body is present', function() {

// });

// describe('when no body is provided', function () {
//   it('should reject the request', function (done) {

//   });
// });

// describe('when an empty body is provided', function () {
//   it('should reject the request with friendly error message', function (done) {

//   });
// });


// todo - test multiple test condisions - eg required and not a number.


