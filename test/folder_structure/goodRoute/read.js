
exports.name = 'AdStream Bacons';

exports.read = {
  name: 'Get a Bacon',
  synopsis: 'mmm bacon.',
  url: '/:id',
  parameters: [{
    name: 'id',
    required: 'Y',
    default: '',
    type: 'int',
    description: 'The ID of the bacon you wish to GET.'
  }],
  middleware: [],
  action: function() {}
};
