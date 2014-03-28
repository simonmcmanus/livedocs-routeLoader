'use strict';


module.exports = {
  name: 'Get the Assets for a Collection',
  synopsis: 'Gets all the assets in a collection.',
  url: '/collections/:collectionId',
  parameters: [{
    name: 'collectionId',
    required: true,
    location: 'query',
    type: 'string',
    description: 'The ID of the collection you wish to fetch.'
  },
  {
    name: 'query',
    location: 'query',
    type: 'string',
    description: 'Lucene query to query the assets in the collection.'
  },
  {
    name: 'assetDetail',
    input: 'checkbox',
    location: 'query',
    type: 'boolean',
    description: 'Return the full asset details.'
  },
  {
    name: 'page',
    default: 1,
    location: 'query',
    type: 'number',
    description: 'The page number, In the repsonse if there are more pages of' +
      ' data available the more property will be true.'
  },
  {
    name: 'size',
    location: 'query',
    default: 10,
    type: 'number',
    description: 'The number of results to be returned in a page.'
  }
  ],
  action: function(req, res, next) {
  }
};
