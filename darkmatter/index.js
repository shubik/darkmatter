var _ = require('lodash'),
    config = require('../config/app'),

    App = function(app) {

        /* --- Register models from the list --- */

        config.app.models.forEach(function(modelName) {
            var Model = require('../models/' + modelName);
            Model.registerRESTEndpoints(app);
            Model.registerMixinAPIEndpoints(app);
        });
    };

module.exports = App;