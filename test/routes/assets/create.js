'use strict';

module.exports = {
  name: 'Create an asset',
  synopsis: 'Create a new AdBank asset.',
  hidden: true,
  parameters: [
    {
      name: 'name',
      required: true,
      location: 'body',
      type: 'string',
      description: 'The name of the new asset to appear in the meta data of ' +
        'the asset.'
    },
    {
      name: 'path',
      location: 'body',
      type: 'string',
      description: 'The path of the new asset.'
    }
  ],
  action: function(req, res, next) {

  }
};


