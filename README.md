#install

```
npm install livedocs-route-loader
```


#To use:

See the folder structure in place in the test directory:

```
var loader = require('../loader')('./test/routes');
var server = restify.createServer();
loader.load(server);

```



