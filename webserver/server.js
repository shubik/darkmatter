var config = require('../config/app'),
    port   = process.argv[2] || 8080;

process.title = config.app.run['proc-prefix'] + port;

require('express-namespace');

var _                 = require('lodash'),
    fs                = require('fs'),
    packageJSON       = require('../package.json'),
    express           = require('express'),
    http              = require('http'),
    https             = require('https'),
    APIResponse       = require('./lib/api_response'),
    APIBaseURL        = '/api/' + packageJSON.apiversion + '/',
    httpsOptions      = {
        key                : fs.readFileSync(config.webserver.HTTPS.keyFile),
        cert               : fs.readFileSync(config.webserver.HTTPS.certFile),
        ca                 : [fs.readFileSync(config.webserver.HTTPS.caFile)],
        passphrase         : config.webserver.HTTPS.passphrase,
        requestCert        : true,
        rejectUnauthorized : false
    },
    metaInfo = {
        'name'       : packageJSON.name,
        'version'    : packageJSON.version,
        'apiversion' : packageJSON.apiversion,
        'secure'     : config.webserver.secure,
        'port'       : port
    },
    app = express(),
    server = config.webserver.secure ? https.createServer(httpsOptions, app) : http.createServer(app);

server.listen(port);


/* Configuration */

app.configure(function() {
    app.use(express.json({ strict: false })); // turn off strict to accept "strings" as body
    app.use(app.router);

    app.use(function(req, res, next){
        res.status(404).send('404 Not Found');
        res.status(500).send('500 Internal Server Error');
    });
});


/* Global filters */

app.all('*', require('./filters/allowcrossdomain'));


/* Server meta info */

app.all(APIBaseURL, function(req, res) {
   res.json(APIResponse.ok(metaInfo));
});


/* Configuring API endpoints */

app.namespace(APIBaseURL, function() {

    /*

     Adds namespace e.g. /api/<version>/

    */

    /* context filters */

    // app.all('*', require('./filters/context-holder').filter);
    // app.all('*', require('./filters/logging').contextAcessLogFilter);
    // app.all('*', require('./filters/auth').authFilter);

    /* --- Main library --- */

    require('../darkmatter')(app);
});

/* Catch unexpected exceptions */
process.on('uncaughtException', function (err) {
    console.log('uncaughtException:', err);
});