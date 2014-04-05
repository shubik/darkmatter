var ModelFactory = require('../darkmatter/model_factory'),

    testMixin = function() {
        // mixin constructor
    },

    options,
    Model;

testMixin.registerAPIEndpoints = function(app) {

    /*

     iterate through all mixins and register API endpoints
     add endpoints for URL with item ID, e.g.

     /:id/<mixin name>/                -- returns mixin info, list of actions
     /:id/<mixin name>/<mixin action>

    */

    app.get('/:id/test', function(req, res) {
        res.send('test mixin...')
    });
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