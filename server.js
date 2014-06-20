var express = require('express'),
    morgan = require('morgan'),
    browserify = require('browserify-middleware'),
    sass = require('node-sass'),
    app = express(),
    port = process.env.PORT || 4000,
    package = require('./package.json'),
    config = {};

try {
  config = require('./config.json');
} catch (e) {
  console.warn("Application configuration not present: config.json");
}

console.log("Using config: ", JSON.stringify(config));

// use jade template engine
app.engine('jade', require('jade').__express);

app.set('view engine', 'jade');
app.set('views', process.cwd() + '/templates/views');

// build app.js using browserify
app.get('/app.js', browserify('./lib/ui/index.js'));

// compile sass files
app.use(sass.middleware({
  src:process.cwd() + '/templates/sass',
  debug:true,
  response:true
}));

// serve app html
app.get('/', function(req, res) {
  config.build = 'dev';
  config.version = package.version;
  res.render('app', config);
});


// serve static assets
app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log("Running console on port %d", port);