'use strict';

var validate = require('../validate');
var should = require('should');
var sinon = require('sinon');

var req = {
  params: { // as passed in by the user

  },
  spec: {  // as provided by the spec.
    parameters: [{
      name: 'color',
      options: {
        red: 'Red',
        blue: 'Blue'
      }
    }]
  }
};


describe('given a request with multiple items select from checkboxes', function () {
  var out;
  var next;
  before(function() {
    next = sinon.spy();
    req.params.color = 'red';
    validate(req, null, next);
  });
  describe('as all of them are listed in the spec', function () {
    it('should not produce any errors', function () {
      should(next.args[0][0]).equal(undefined);
    });
  });

});

describe('given a request with multiple items select from checkboxes', function () {
  var out;
  var next;
  before(function() {
    next = sinon.spy();
    req.params.color = ['red', 'blue'];
    validate(req, null, next);
  });
  describe('as all of them are listed in the spec', function () {
    it('should not produce any errors', function () {
      should(next.args[0][0]).equal(undefined);
    });
  });

});

describe('given a request with a single incorrect value', function () {
  var out;
  var next;
  before(function() {
    next = sinon.spy();
    req.params.color = 'pink';
    validate(req, null, next);
  });
  it('should produce an error', function () {
    should(next.args[0][0].body.code).equal('BadRequestError');
  });
  it('should produce a friendly error string', function () {
    should(next.args[0][0].message).equal('Invalid value (pink) entered in field: `color`. Available options are: red, blue');
  });
});

describe('given a request with a multiple incorrect values', function () {
  var out;
  var next;
  before(function() {
    next = sinon.spy();
    req.params.color = ['pink', 'purple'];
    validate(req, null, next);
  });
  it('should produce an error', function () {
    should(next.args[0][0].body.code).equal('BadRequestError');
  });
  it('should produce a friendly error string', function () {
    should(next.args[0][0].message).equal('Invalid values (purple, pink) entered in field: `color`. Available options are: red, blue');
  });
});


describe('given a request with a one good and one incorrect value', function () {
  var out;
  var next;
  before(function() {
    next = sinon.spy();
    req.params.color = ['pink', 'red'];
    validate(req, null, next);
  });
  it('should produce an error', function () {
    should(next.args[0][0].body.code).equal('BadRequestError');
  });
  it('should produce a friendly error string', function () {
    should(next.args[0][0].message).equal('Invalid value (pink) entered in field: `color`. Available options are: red, blue');
  });
});

