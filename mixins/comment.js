var _ = require('lodash'),

    Mixin = function() {

    };

_.extend(Mixin, {
    getName: function() {
        return 'comment';
    },

    initialize: function(modelData) {
        console.log('mixin initialize()', Mixin.getName(), modelData);
    },

    registerAPIEndpoints: function(app, Model) {

        /*

         iterate through all mixins and register API endpoints
         add endpoints for URL with item ID, e.g.

         /:id/<mixin name>/                -- returns mixin info, list of actions
         /:id/<mixin name>/<mixin action>

        */

        app.get('/:id/' + Mixin.getName(), function(req, res) {
            res.send('test mixin: ' +  Mixin.getName());

            var model = Model(req.params.id);

            model.ready(function(model) {
                //model.release();
                console.log(model, model.id);
                model.id = 0;
            });
            /*

             mixin work and update its snapshot, save
             model.mixins[Mixin.name].applyAction('get', req)

            */
        });
    }
});

module.exports = Mixin;