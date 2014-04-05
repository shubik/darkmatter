var ModelFactory = require('../darkmatter/model_factory'),
    options = {
        name: 'item',
        itemtype: 'item',
        description: 'Model of anything...',
        idAttribute: '_id',
        apiPath: 'item/',
        schema: {},
        mixins: [],
        hooks: [],
        classMethods: {},
        instanceMethods: {},
        store: null,
        permissions: {},
        roles: {}
    },
    Model = ModelFactory(options);

module.exports = Model;