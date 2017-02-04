var AlexaAppServer = require('alexa-app-server');
var server = new AlexaAppServer({ port: 80, debug: false });
server.start();
server.express.use('/test', function(req, res) { res.send("OK"); });

require('alexa-app-server').start({

  // In order to start the server from a working directory other than
  // where your server.js file, you need to provide Node the full path
  // to your server's root directory. The easiest way is to use __dirname
  server_root: __dirname,

  // A directory containing static content to serve as the document root.
  // This directory is relative to the script using alexa-app-server, not
  // relative to the module directory.
  public_html: "public_html",

  // A directory containing Alexa Apps. This directory should contain one
  // or more subdirectories. Each subdirectory is a stand-alone Alexa App
  // built with the alexa-app framework. These directories are each
  // processed during server startup and hooked into the server.
  app_dir: "apps",

  // The prefix to use for all Alexa Apps. For example, you may want all
  // your Alexa endpoints to be accessed under the "/api/" path off the
  // root of your web server.
  app_root: "/alexa/",

  // The directory containing server-side processing modules (see below).
  server_dir: "server",

  // Enables http support, default is true.
  httpEnabled: true,

  // The port the server should bind to. Defaults to 8080.
  port: 8080,

  // The host address in which the server should bind to. If not specified,
  // this argument will be ignored. Default is 'undefined'.
  host: 'localhost',

  // By default, GET requests to Alexa App endpoints will show the debugger
  // UI. This can be disabled. The 'verify' and 'debug' options cannot be used
  // together.
  debug: true,

  // By default, some information is logged with console.log(), which can be disabled.
  log: true,

  // This will insert alexa-verifier-middleware and add verification for Alexa requests
  // as required by the Alexa certification process. Default is 'false'.
  verify: false,

  // The pre() method is called after the express server has been instantiated, but
  // before any Alexa Apps have been loaded. It is passed the AlexaAppServer object itself.
  pre: function(appServer) { },

  // The post() method is called after the server has started and the start() method
  // is ready to exit. It's passed the AlexaAppServer object itself.
  post: function(appServer) { },

  // Like pre(), but this function is fired on every request, but before the
  // application itself gets called. You can use this to load up user details before
  // every request, for example, and insert it into the json request itself for
  // the application to use.
  // If it returns a falsy value, the request json is not changed.
  // If it returns a non-falsy value, the request json is replaced with what was returned.
  // If it returns a Promise, request processing pauses until the Promise resolves.
  // The value passed on by the promise (if any) replaces the request json.
  preRequest: function(json, request, response) { },

  // Like post(), but this function is fired after every request. It has a final
  // opportunity to modify the JSON response before it is returned back to the
  // Alexa service.
  // If it returns a falsy value, the response json is not changed.
  // If it returns a non-falsy value, the response json is replaced with what was returned.
  // If it returns a Promise, response processing pauses until the Promise resolves.
  // The value passed on by the promise (if any) replaces the response json.
  postRequest : function(json, request, response) { },

  // Enables https support. Note httpsPort, privateKey, and certificate are required.
  httpsEnabled: true,

  // The https port the server will bind to. Required for httpsEnabled support.
  httpsPort: 443,

  // Specifies the private key filename. This file must reside in the sslcert folder under the
  // root of the project.
  privateKey: 'private-key.pem',

  // The certificate filename. This file must reside in the sslcert folder under the root of the
  // project.
  certificate: 'cert.cer',

  // The certificate chain bundle filename. This is an optional file that must reside in the
  // sslcert folder under the root of the project.
  chain: 'cert.ca_bundle',

  // An optional passphrase used to validate certificate and key files. For best practice, don't
  // put the password directly in your source code, especially if it's going to be on GitHub, and
  // instead, load it from process.env or a file included in the .gitignore list.
  passphrase: 'passphrase'

});

module.exports = function(express, alexaAppServerObject) {
  express.use('/login', function(req, res) {
    res.send("imagine this is a dynamic server-side login action");
  });
};