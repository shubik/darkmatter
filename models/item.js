var ModelFactory = require('../darkmatter/model_factory'),

    testMixin = function() {
        // mixin constructor
    },

    options,
    Model;

testMixin.registerAPIEndpoints = function(app) {
    var mixinName = 'test';

    /*

     iterate through all mixins and register API endpoints
     add endpoints for URL with item ID, e.g.

     /:id/<mixin name>/                -- returns mixin info, list of actions
     /:id/<mixin name>/<mixin action>

    */

    app.get('/:id/' + mixinName, function(req, res) {
        var model = Model();
        console.log('test model', model);
        res.send('test mixin...');
        /*

         mixin work and update its snapshot, save
         model.mixins[mixinName].applyAction('get', req)

        */
    });
}

testMixin.initialize = function(modelData) {

}




options = {
    name: 'item',
    itemtype: 'item',
    description: 'Model of anything...',
    idAttribute: '_id',
    apiPath: 'item/',
    schema: {},
    mixins: [
        testMixin
    ],
    hooks: [],
    classMethods: {},
    instanceMethods: {},
    store: null,
    permissions: {},
    roles: {},
    enableAPImodel: true,
    enableAPImixins: true
};

Model = ModelFactory(options);

module.exports = Model;