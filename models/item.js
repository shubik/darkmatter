var ModelFactory = require('../darkmatter/model_factory'),
    CommentMixin = require('../mixins/comment'),
    options,
    Model;

options = {
    name: 'item',
    itemtype: 'item',
    description: 'Model of anything...',
    idAttribute: '_id',
    apiPath: 'item/',
    schema: {},
    mixins: [
        CommentMixin
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