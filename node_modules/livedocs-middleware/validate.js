'use strict';

/**
 *
 * Restify Middleware to validate input against the fields provided in IORest spec.
 * Currently only checks
 *               - a value is provided for required fields.
 *               - params of type number are numbers.
 *               - params exists in options array if provided
 *
 */

var restify = require('restify');

module.exports = function(req, res, next) {
  var expected = req.spec.parameters;

  var errors = [];
  var incoming = req.params;
  var c = expected.length;
  while (c--) {
    // if body is specified we need to check the body :)
    // exclude files
    // todo - what if files are required?
    if(expected[c].location === 'body' && expected[c].type !== 'file') {
      incoming = req.body;
    }

    if (!incoming[expected[c].name]) { // param provided is listed.
      if (expected[c].required) {
        if( expected[c].location === 'path' ||  // so assets/:id works
            (expected[c].location === 'body' && expected[c].name === 'body' )
          ) {
          // add better body error handling here :/
            //errors.push('`' + expected[c].name + '` Body must not be empty.');
        }else {
          if (!incoming[expected[c].name] || incoming[expected[c].name] === ''){
            // maybe its the body, in which case check incoming is not empty.
            errors.push('`' + expected[c].name + '` is a required field.');
          }
        }
        if(expected[c].location === 'body' && incoming === '') {
         errors.push('`' + expected[c].name + '` is a required field.');
        }
      }
    } else {
      if (expected[c].type === 'number') {
        if (isNaN(incoming[expected[c].name])) {
          errors.push('Expected number in field `' + expected[c].name +
            '` but got value: `' + incoming[expected[c].name] + '`.');
        }
      }

      if (expected[c].options) {
        var badItems = [];
        if(typeof incoming[expected[c].name] === 'string') {

          if (!expected[c].options[incoming[expected[c].name]]) {
            badItems.push(incoming[expected[c].name]);
          }
        }else {
          var d = incoming[expected[c].name].length;
          while(d--) {
            var incomingItem = incoming[expected[c].name][d];
            if (!expected[c].options[incomingItem]) {
              badItems.push(incomingItem);
            }
          }
        }

        if (badItems.length > 0) {
          var plural = (badItems.length > 1) ? 's' : '';
          errors.push('Invalid value' + plural + ' (' + badItems.join(', ') +
            ') entered in field: `' + expected[c].name + '`. Available options'+
            ' are: ' + Object.keys(expected[c].options).join(', ')
            );
        }
      }

    }
  }
  if (errors.length > 0) {
    return next(new restify.BadRequestError(errors.join('\n')));
  }
  next();
};

