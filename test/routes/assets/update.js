'use strict';


module.exports = {
  name: 'Update an Asset',
  synopsis: 'Because the system has dynamic configuration, in order to ' +
    'understand the payload for this method issue an /asset/:id request to ' +
    ' see the data strcture. The meta property of the response forms the ' +
    'body of the payload.',
  url: ':id',
  parameters: [
    {
      name: 'id',
      required: true,
      location: 'query',
      type: 'string',
      description: 'The ID of the asset you wish to update.'
    }, {
      name: 'body',
      required: true,
      location: 'body',
      type: 'json',
      input: 'textarea',
      description: 'The new data for the asset you are updating.'
    }
  ],
  action: function(req, res, next) {
  }
};
