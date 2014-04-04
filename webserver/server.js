var config = require('../config/lib/index'),
    port   = process.argv[2] || 8080;

process.title = config.app.run['proc-prefix'] + port;

require('express-namespace');

var _                 = require('lodash'),
    fs                = require('fs'),
    packageJson       = require('../package.json'),
    express           = require('express'),
    http              = require('http'),
    https             = require('https'),
    APIResponse       = require('./lib/api_response'),
    APIBaseURL        = '/api/' + packageJson.apiversion + '/',
    httpsOptions      = {
        key                : fs.readFileSync(config.webserver.HTTPS.keyFile),
        cert               : fs.readFileSync(config.webserver.HTTPS.certFile),
        ca                 : [fs.readFileSync(config.webserver.HTTPS.caFile)],
        passphrase         : config.webserver.HTTPS.passphrase,
        requestCert        : true,
        rejectUnauthorized : false
    },
    metaInfo = {
        'name'       : packageJson.name,
        'version'    : packageJson.version,
        'apiversion' : packageJson.apiversion
    },
    app = express(),
    server = config.webserver.secure ? https.createServer(httpsOptions, app) : http.createServer(app);

server.listen(port);


/* Configuration */

app.configure(function() {
    app.use(express.json({ strict:false })); // turn off strict to accept "strings" as body
    app.use(app.router);

    app.use(function(req, res, next){
        res.status(404).json('404 Not Found');
        res.status(500).json('500 Internal Server Error');
    });
});


/* Global filters */

app.all('*', require('./filters/allowcrossdomain'));


/* Server meta info */

console.log('APIBaseURL', APIBaseURL);

app.all(APIBaseURL, function(req, res) {
   res.json(APIResponse.ok(metaInfo));
});


/* Configuring REST endpoints */

app.namespace(APIBaseURL + ':cid', function() {

    /* context filters */
    // app.all('*', require('./filters/context-holder').filter);
    // app.all('*', require('./filters/logging').contextAcessLogFilter);
    // app.all('*', require('./filters/auth').authFilter);

    /* import endpoints */
    // require('./rest/auth')(app);
    // require('./rest/cdns')(app);
    // require('./rest/company')(app);
    // require('./rest/devices')(app);
    // require('./rest/pairs')(app);
    // require('./rest/presets')(app);
    // require('./rest/archive')(app);
    // require('./rest/sputniks')(app);
    // require('./rest/users')(app);
});

/* Catch unexpected exceptions */
process.on('uncaughtException', function (err) {
    console.log('uncaughtException:', err);
});