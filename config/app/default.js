var baseDir = __dirname + '/../..';

module.exports = {

    /* --- Application --- */

    'app' : {
        'run' : {
            'exec_mode'   : 'fork',
            'pidfile'     : 'app.pid',
            'proc-prefix' : require('../../package.json').name + '-',
            'instances'   : 1
        },

        'models' : [
            'item'
        ]
    },

    /* --- Paths --- */

    'paths' : {
        'pids' : baseDir + '/share/pids/'
    },

    /* --- Web server --- */

    'webserver' : {

        'title'  : 'Dark matter',
        'secure' : false,

        /* --- HTTP --- */

        'HTTP' : {
            'port' : 8000
        },

        /* --- HTTPS, SSL - do not use! Strip at load balancer --- */

        'HTTPS' : {
            'port'       : 8000,
            'certFile'   : baseDir + '/ssl/cassl.crt',
            'keyFile'    : baseDir + '/ssl/app.key',
            'caFile'     : baseDir + '/ssl/cabundle.pem',
            'passphrase' : 'T4$82UgaPE8PeYe#azed@ut7eFraWEfE'
        }
    },

    /* --- Logging --- */

    'logging' : {
        'level'  : 'DEBUG',
        'logger' : console
    },

    /* --- MongoDB --- */

    'mongodb' : {
        'host'   : 'localhost',
        'port'   : 27017,
        'opts'   : {},
        'prefix' : 'app_',
        'log'    : 'log'
    },

    /* --- Redis --- */

    'redis' : {
        'host'    : 'localhost',
        'port'    : 6379,
        'options' : {}
    },

    /* --- AWS --- */

    'aws' : {

    }
}