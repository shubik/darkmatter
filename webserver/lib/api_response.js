var _ = require('lodash'),

    responseOk = function(data, paging) {
        return {
            'meta': {
                'status': 'ok',
                'error': null,
                'paging': paging
            },
            'response': data || null
        }
    },

    responseErr = function(err) {
        return {
            'meta': {
                'status': 'error',
                'error': {
                    'type' : err.type || null,
                    'message': err.message || null,
                    'cause': err.cause || null
                }
            },
            'response': null
        }
    };


module.exports = {
    ok           : responseOk,
    success      : responseOk,
    error        : responseErr,
    makeResponse : function(err, data) {
        return err ? errResponse(err) : okResponse(data);
    }
};