'use strict';

var fs = require('fs');
var path = require('path');
var validator = require('livedocs-middleware');

/**
 * Given a folder load those files into a livedocs spec.
 * @param  {String}   routesFolder Path to the folder to parse.
 * @param  {Object}   Verb Mapping associate filename with http methods.
 * @param  {Function} callback     When all folders have been passed.
 * @return {Object}                The scope object
 */
module.exports = function(routesFolder, verbMapping, logger, callback) {
  var scope = {
    spec: false // will be false untill finished  loading.
  };
  var keyedEndpoints = {};
  var folderCount = 0;  // not particularly happy about this. needed to track
                        // when the spec has finished loading.
  var keyedMeta = {}; // o
  function init() {
    scope.parseFolder(path.join(process.cwd(), routesFolder));
  }



  // in situations where certain filename will always map to a particular
  // http method
  scope.verbMapping = verbMapping || {};

  /**
   * Given /endpoint/a/b/c returns just the endpoint
   * @param  {String} relativeRoute The relative path of the route file.
   * @return {String}               Just the first part of the file path.
   */
  scope.getEndpoint = function(relativeRoute) {
    if(!relativeRoute) {
      return '/';
    }
    return relativeRoute.split('/')[1];
  };

  /**
   * Called when an index.js file is found in a routes folder.
   * Add the data to the
   * @param  {Object} meta          contents of the index.js export object.
   * @param  {String} relativeRoute Route relative to where parseFolder was
   *                                 first called.
   */
  scope.handleMeta = function(meta, relativeRoute) {
    var endpoint = scope.getEndpoint(relativeRoute);
    // should only take the highest level index
    if (!keyedMeta[endpoint] && relativeRoute.split('/').length === 2) {
      keyedMeta[endpoint] = meta;
    }
  };

  /**
   * Given a method object and a relative url, work out the url that the
   * endpoint should be served from.
   * @param  {Object} method        The method object from the livedocs spec
   * @param  {String} relativeRoute The relative path
   * @return {String}               The url the route should be served from.
   */
  scope.getUrl = function(method, relativeRoute) {
    if (method.url && method.url.slice(0, 1) === '/') {
      return method.url;
    } else if(method.url) {
      return relativeRoute + '/' + method.url;
    } else {
      return relativeRoute;
    }
  };

  scope.handleMethod = function(method, relativeRoute) {
    method.url = scope.getUrl(method, relativeRoute);
    if(!keyedEndpoints[scope.getEndpoint(method.url)]) {
      keyedEndpoints[scope.getEndpoint(method.url)] = [];
    }
    keyedEndpoints[scope.getEndpoint(method.url)].push(method);
  };


  /**
   * When a file is found, require and dispatch to the appropriate function.
   * @param  {String} file          the filename
   * @param  {String} dir           The full path to the directory.
   * @param  {String} relativeRoute Relative to where parseFolder started.
   */
  scope.handleFile = function(file, dir, relativeRoute) {
    var fullPath = path.join(dir, file);
    if(file.slice(0, 1) === '.') return;
    var data = require(fullPath);
    if (file === 'index') {
      scope.handleMeta(data, relativeRoute);
    } else if (scope.verbMapping[file]) {
      data.method = scope.verbMapping[file].toUpperCase();
      scope.handleMethod(data, relativeRoute);
    } else if (data.method) { // no verb mapping but method specified
      scope.handleMethod(data, relativeRoute);
    }
  };

  /**
   * Recursively parse a folder
   * @param  {String} dir           The directory you wish to parse
   * @param  {String} relativeRoute Relative to its starting point.
   */
  scope.parseFolder = function(dir, relativeRoute) {
    folderCount = folderCount + 1;
    relativeRoute = relativeRoute || '';
    var files = fs.readdirSync(dir);
    for(var i = 0; files.length > i; i++) {
      var file = path.basename(files[i], '.js'); // get without ext
      if (fs.statSync(dir + '/' + files[i]).isDirectory()) {
        var fullPath = relativeRoute + '/' + files[i];
        scope.parseFolder(path.join(dir, files[i]), fullPath);
      } else {
        scope.handleFile(file, dir, relativeRoute);
      }
    }
    folderCount = folderCount - 1;

    if(folderCount === 0) {
      scope.makeSpec(keyedEndpoints, keyedMeta);
    }
  };

  /**
   * Turns the internal spec into the public spec for use with livedocs
   * @param  {Object} endpoints keyed array obj - see keyedEndpoints
   * @param  {Object} meta     meta keyed array obj - see keyedMeta
   */
  scope.makeSpec = function(endpoints, meta) {
    var combined = [];
    for(var end in endpoints) {
      if(!meta[end]) {
        meta[end] = {};
      }
      meta[end].methods = endpoints[end];
      combined.push(meta[end]);
    }
    scope.spec = {
      server: '',
      title: '',
      prefix: '/api/v1',
      endpoints: combined
    };
    return callback && callback(null, scope);
  };

  /**
   * Used to load your routes into Restify or Express
   * @param  {Object} server  Restify server/app object, should work with
   *                           express
   */
  scope.load = function(server) {
    if(!scope.spec)  {
      return console.log('Spec is not available, The factory method provides' +
        ' a callback');
    }

    var logRoute = function(req, res, next) {
      logger('Route is: ', req.spec.name, req.spec.url);
      next();
    };

    var setSpec = function(method, req, res, next) {
      req.spec = method;
      next();
    };

    var ends = scope.spec.endpoints;
    for(var a = 0; a < ends.length; a++ ) {
      var endpoint = ends[a];

      for(var b = 0; b < endpoint.methods.length; b++) {
        var method = endpoint.methods[b];
        var counter =  method.middleware.length;
        while(counter --) {

        }
        var route = scope.spec.prefix + method.url;
        var middleware = method.middleware || [];
        // make spec available on the request and do validation.
        middleware.unshift(setSpec.bind(null, method), logRoute, validator);
        server[method.method.toLowerCase()](route, middleware, method.action);
        logger && logger(method.method, route, '  ✓');
      }
    }
  };

  init();
  return scope;

};
