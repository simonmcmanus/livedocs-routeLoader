'use strict';



module.exports = {
  name: 'Get an Asset',
  synopsis: 'Get an Asset by it`s id.',
  url: ':id',
  parameters: [{
    name: 'id',
    required: true,
    type: 'string',
    location: 'query',
    description: 'The ID of the asset you wish to fetch. This request will ' +
      'return additional information if you select the options below.'
  },
  {
    name: 'rights',
    label: 'Rights',
    input: 'checkbox',
    location: 'query',
    type: 'boolean',
    description: 'Include usage rights in the response'
  },
  {
    name: 'images',
    label: 'Images',
    input: 'checkbox',
    location: 'query',
    type: 'boolean',
    description: 'Include links to images in the response'
  },
  {
    name: 'revisions',
    label: 'Revisions',
    input: 'checkbox',
    location: 'query',
    type: 'boolean',
    description: 'Include revisions in the response'
  }],
  action: function(req, res, next) {}
};
