'use strict';

var should = require('should');
var deepValidate = require('deepValidate');

  var generatedSpec;
  var loader = require('../loader')('./test/routes');


describe('Given an initialised routeLoader pointing at the local routes directory', function() {

  before(function(done) {

    var verbMapping = {
      create: 'post',
      file: 'get',
      read: 'get',
      update: 'put',
      del: 'del',
      edit: 'get', // get the form to edit.
      list: 'get',
      search: 'get', // get the search form.
      download: 'get' // get info to allow a file download.
    };

    require('../loader')('./test/routes', verbMapping, null, function(error, data) {
      generatedSpec = data;
      done();
    });
  });

  it('It should load the spec provided', function() {
    var routesSpec = require('./routesSpec.json');
    //console.log(JSON.stringify(generatedSpec.spec, null, 4));
    //test that big black box
    JSON.stringify(generatedSpec.spec).should.equal(JSON.stringify(routesSpec))
  })

  describe('getEndpoints', function() {
    describe('Given a route of undefined', function() {
      var undefinedVal =  loader.getEndpoint(undefined);
      it('Should return `/`', function() {
        undefinedVal.should.equal('/');
      });
    });

    describe('given a route of null', function() {
      var nullVal =  loader.getEndpoint(null);
      it('should return `/`', function() {
        nullVal.should.equal('/');
      });
    });

    describe('Given a long route starting with a trailing slash', function() {
      var test1 =  loader.getEndpoint('/a/gopher/is/born');
      it('Should still get the first value correctly', function() {
        test1.should.equal('a');
      });
    });
  });



  describe('getUrl', function() {
    describe('given a url that starts with a /', function() {
      var startSlash = '/anything';
      var test1 = loader.getUrl({url: startSlash}, '')
      it('should only use method.url', function() {
        test1.should.equal(startSlash);
      });
    });

    describe('given a url that start with `:id`', function() {
      var relative = '/a';
      var url = ':id';
      var test2 = loader.getUrl({url: url}, relative);
      it('should add `:id` to the end of the relative path', function() {
        test2.should.equal(relative + '/' + url);
      })
    })

    describe('given no url', function() {
      var relative = '/aunty/pauline';
      var test3 = loader.getUrl({}, relative)
      it('should just use the relative url', function() {
        test3.should.equal(relative);
      });
    })
  });
});
