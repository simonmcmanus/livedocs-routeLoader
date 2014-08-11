'use strict';

var should = require('should');
var deepValidate = require('deepvalidate');

describe('Routeloader :', function () {

  describe('Given an initialised routeLoader pointing at the local routes directory', function() {
    var router;
    before(function(done) {
      var config = {
        routesFolder : './test/routes'
      };
      router  = require('../loader')(config, function () {
        done();
      });
    });

    it('should return a router', function () {
      should(router).exist;
    });

    it('should have a property _scope', function () {
      router.should.have.property('_scope');
      router._scope.should.be.an.Object;
    });

    it('It should load the spec provided', function() {
      var routesSpec = require('./routesSpec.json');
      //console.log(JSON.stringify(generatedSpec.spec, null, 4));
      //test that big black box
      deepValidate('', routesSpec,  router._scope.spec,
        function(obj, obj1, key, failure) {
          should(failure).equal(false);
        }
      );
    });

    describe('getEndpoints', function() {
      describe('Given a route of undefined', function() {
        var undefinedVal;

        before(function () {
          undefinedVal =  router._scope.getEndpoint(undefined);
        });

        it('Should return `/`', function() {
          undefinedVal.should.equal('/');
        });
      });

      describe('given a route of null', function() {
        var nullVal;
        before(function () {
          nullVal =  router._scope.getEndpoint(null);
        });

        it('should return `/`', function() {
          nullVal.should.equal('/');
        });
      });

      describe('Given a long route starting with a trailing slash', function() {

        var test1;
        before(function () {
          test1 =  router._scope.getEndpoint('/a/gopher/is/born');
        });
        it('Should still get the first value correctly', function() {
          test1.should.equal('a');
        });
      });
    });

    describe('getUrl', function() {
      describe('given a url that starts with a /', function() {
        var startSlash = '/anything', test1;
        before(function () {
          test1 = router._scope.getUrl({url: startSlash}, '');
        });

        it('should only use method.url', function() {
          test1.should.equal(startSlash);
        });
      });

      describe('given a url that start with `:id`', function() {
        var relative = '/a',
          url = ':id', test2;
        before(function  () {
          test2 = router._scope.getUrl({url: url}, relative);
        });

        it('should add `:id` to the end of the relative path', function() {
          test2.should.equal(relative + '/' + url);
        });
      });

      describe('given no url', function() {
        var relative = '/aunty/pauline', test3;
        before(function () {
          test3 = router._scope.getUrl({}, relative);
        });

        it('should just use the relative url', function() {
          test3.should.equal(relative);
        });
      });
    });
  });
});
