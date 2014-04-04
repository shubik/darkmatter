var config = require('../config/app'),

    App = function(app) {

        /* --- Register models from the list --- */

        config.app.models.forEach(function(modelName) {
            app.namespace(modelName, function() {
                require('../models/' + modelName)(app);
            });
        });
    };

module.exports = App;