'use strict';


module.exports = {
  name: 'Auth.',
  synopsis: 'Used to test authorization, returns ok if authorized.',
  url: '',
  hidden: true,
  parameters: [],
  action: function(req, res) {
    res.send('ok');
  }
};
