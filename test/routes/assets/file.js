'use strict';


module.exports = {
  name: 'Get media',
  synopsis: 'Provides a 302 redirect to the media which should be valid for ' +
    '15  seconds.',
  url: '/media?assetId=:assetId&fileId=:fileId&accessToken=:accessToken',
  parameters: [
    {
      name: 'assetId',
      required: true,
      location: 'query',
      type: 'string',
      description: 'The ID of the asset you wish to fetch.'
    },
    {
      name: 'fileId',
      required: true,
      location: 'query',
      type: 'string',
      description: 'The ID of the file you wish to fetch, availble from the ' +
                  'asset request.'
    },
    {
      name: 'accessToken',
      hidden: true,
      location: 'query',
      type: 'string',
      description: 'The access token - available in the assets request.'
    }
  ],
  action: function(req, res, next) {

  }
};
