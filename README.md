#LiveDocs Route Loader

[![Build Status](https://travis-ci.org/simonmcmanus/livedocs-routeLoader.svg)](https://travis-ci.org/simonmcmanus/livedocs-routeLoader)

LiveDocs specs are one big json file, this module was created so that each piece of documentation can be kept in the same file and the route code it self to try and keep the two in sync.


You do not have to use this module to use LiveDocs - this Module just tries to make it easier to generate and maintain a LiveDocs spec file.




The module can be used for two purposes:

##1.. Loading Routes from a folder structure.


example:
```js
  var server = express();
  var router = require('livedocs-route-loader');

  app.use(router([options]))
```

##2.. Generate the LiveDocs spec file.

example:
```js
var server = express();
var router = require('livedocs-route-loader');
var spec = router().spec;

fs.writeFile(filename, JSON.stringify(.spec, null, 4), function(err) {
  if (err) {
    return console.log('error', err);
  }
  console.log('LiveDocs spec file saved. ', filename);
});


```


In both examples it would parses the provided folder. So given the following folder structure:


routes - assets - create.js
                - index.js
       - books
       - tokens

In the assets folder we might have a file called create.js, that file might look like:


```js
  module.exports = {
   name: 'Create an asset',
   method: 'POST',
   synopsis: 'Create a new AdBank asset. Just specify a asset name.',
   url: 'easy',
   middleware: [],
   parameters: [
     {
       name: 'name',
       required: true,
       location: 'body',
       type: 'string',
       description: 'The name of the new asset to appear in the meta data of the asset.'
     },
     {
       name: 'path',
       location: 'body',
       type: 'string',
       description: 'The path of the new asset.'
     }
   ],
   action: function(req, res, next) {

    // do stuff here.
    res.send('Asset Created');
   }
  };
```


Note that if we had verbMapping setup we wouldn't need to specify the method.

## Options

#### RoutesFolder
Relative path to the routes folder. Defaults to `./routes`

#### Logger
Logger to be used. Defaults to `console.log`

#### VerbMapping
In some situations you want to have filenames which always map to a certain http verb. In these situations you can setup verb mapping.

defaults:

```js
verbMapping : {
    create: 'post',
    file: 'get',
    read: 'get',
    update: 'put',
    del: 'delete',
    delete : 'delete',
    edit: 'put',
    list: 'get',
    search: 'get',
    download: 'get'
}
```
When you add a file called create.js into a folder, you do not need to specify the method for that route in the spec as it will automatically be added for you.

#### prefix
Url prefix for the loaded routes. Defaults to `''``


##Middleware


The LiveDocs spec format can contain middleware - you need a routeLoader to load that middleware for you. When using a route loader any functions in the middleware array will be executed before the route action function is called.



It's quite handy to be able to access the spec when within a route so the RouteLoader adds the spec to the request object:


```js
{
  action: function(req, res, next) {
    console.log(req.spec);
  }
}
```

## Index.js files


Route loader give special meaning to index.js files in a folder. Its basically a high level summary of all the routes in that directory. They just need to export a name and description properly, e.g.:


```js
  exports.name = 'Approvals';
  exports.description = 'Adbank Approvals';
```


##The URL Property:

This route loader works on the basis of the current folder structure, so if you do not specify a url for a route and its in the folders:


/assets/create.js

that will be served at:

/assets/create


If you wanted to receive an Id in the URL you could do:

:id/edit

As it does not start with a forward slash it's added to the existing folder structure so would served on:

/assets/:id/edit


You can also completely ignore the folder structure by starting the url with a forward slash, while this is not recommended it means you can put a file in the assets folder and serve from somewhere completely different.





Note:

This module is quite opinionated and could be implemented completely differently and still generate a valid LiveDocs spec.
