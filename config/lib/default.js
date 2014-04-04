var baseDir = __dirname + '/..';

module.exports = {

    /* --- Application --- */

    'app' : {
        'run' : {
            'exec_mode' : 'fork',
            'pidfile'   : 'app.pid',
            'instances' : 1
        }
    },

    /* --- Paths --- */

    'paths' : {
        'pids' : baseDir + '/share/pids/'
    },

    /* --- Web server --- */

    'webserver' : {

        'title'  : 'Dark matter',
        'server' : 'HTTP',

        /* --- HTTP --- */

        'http' : {
            'port' : 8000
        },

        /* --- HTTPS, SSL - do not use! Strip at load balancer --- */

        'https' : {
            'port'       : 8000,
            'certfile'   : baseDir + '/ssl/cassl.crt',
            'keyfile'    : baseDir + '/ssl/app.key',
            'cafile'     : baseDir + '/ssl/cabundle.pem',
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