var _            = require('lodash'),
    Events       = require('events').EventEmitter,
    Datatypes    = require('./datatypes'),
    Hooks        = require('./hooks'),
    Indexes      = require('./indexes'),
    Roles        = require('./roles'),
    Validators   = require('./validators'),
    reusablePool = {},
    CREATE       = 'c',
    READ         = 'r',
    UPDATE       = 'u',
    DESTROY      = 'd',
    ModelFactory;

ModelFactory = function(options) {

    var modelName            = options.name || 'default',
        modelItemType        = options.itemtype || 'default',
        modelDescription     = options.description || 'No description',
        modelIdAttribute     = options.idAttribute || '_id';
        modelSchema          = options.schema || {},
        modelMixins          = options.mixins || [],
        modelHooks           = options.hooks || [],
        modelClassMethods    = options.classMethods || {},
        modelInstanceMethods = options.instanceMethods || {},
        modelStore           = options.store || null,
        modelPermissions     = options.permissions || {},
        modelRoles           = _.extend({}, Roles, options.roles || {}),
        ModelConstructor;

    reusablePool[modelName] = reusablePool[modelName] || [];


    ModelConstructor = function(query, options) {

        query   = query || {};
        options = options || {};

        /* --- Check if model can be used from reisable pool --- */

        if (!(this instanceof ModelConstructor)) {

            /* --- We are in an Object Pool mode --- */

            var availableInstance = _.filter(reusablePool[model_name], function(inst) {
                    return !inst._inuse;
                }),
                inst;

            if (availableInstance.length) {
                inst = availableInstance.pop();
                inst._initialize(query, options);
            } else {
                inst = new ModelConstructor(query, options);
                reusablePool[model_name].push(inst);
            }

            return inst;
        }

        /* --- Add EventEmitter API --- */

        var self = this,
            events = new Events;

        _.extend(this, events.__proto__);
        this.setMaxListeners(0);

        /* --- Make sure schema item keys do not clash with this model methods and properties --- */

        _.each(this._schema, function(item, attr) {
            if (self[attr] || self.__proto__[attr]) {
                throw new Error('ModelConstructor(): schema item clashes with model method or property: ' + attr);
            }
        });

        /* --- Define setters and getters --- */

        _.each(this._schema, function(item, attr) {
            self.__defineSetter__(attr, function(val) {
                self._attributes[attr] = val;
            });

            self.__defineGetter__(attr, function() {
                return self._attributes[attr];
            });
        });

        /* --- Setup model internal attributes --- */

        this._reset_model();

        /* --- Initialize this model --- */

        this._initialize(query, options);

        return this;
    }

    /* --- Add class (static) methods and properties --- */

    _.extend(ModelConstructor, {

        /* --- Private properties --- */

        _name: modelName,
        _schema: modelSchema,
        _idAttribute: modelIdAttribute,
        _store: modelStore,
        _description: modelDescription,
        _mixins: modelMixins,

        /* --- Collection methods --- */

        find: function() {

        },

        count: function() {

        },

        addMany: function() {

        },

        updateMany: function() {

        },

        destroyMany: function() {

        },

        describe: function() {
            return modelDescription;
        },

        getSchema: function() {
            return modelSchema;
        },

        getAttributes: function() {

        },

        getItemType: function() {
            return modelItemType;
        }

    }, modelClassMethods);

    /* --- Add instance methods and properties --- */

    _.extend(ModelConstructor.prototype, {

        /* --- Private properties --- */

        _name: modelName,
        _schema: modelSchema,
        _idAttribute: modelIdAttribute,
        _store: modelStore,
        _description: modelDescription,
        _mixins: modelMixins,
        _permissions: modelPermissions,
        _roles: modelRoles,

        /* --- Private methods --- */

        _reset_model: function() {

        },

        _initialize: function() {

        },

        _cachePermissions: function() {

        },

        _validate: function() {

        },

        _registerMixin: function(mixin) {

        },

        _new: function() {
            this.id = null;
            this._isNew = true;
            this._mixinSnapshots = {};
            this._interactions = {};
        },

        _resetModel: function() {
            var self = this;

            this._inuse = false;
            this._isNew = null;

            this._loading = deferred();
            this._ready = this._loading.promise;

            this._allowed = {};
            this._attributes = {};
            this._attributesBefore = {};

            /* --- Instance "public" attributes --- */

            this.id = null;
            this.ready = this._loading.promise;

            /* --- Reset event listeners --- */

            this.removeAllListeners();

            /* --- Initialize mixins --- */

            this._mixins.forEach(function(mixin) {
                mixin.initialize && mixin.initialize.call(self);
            });
        },

        _load: function(query) {
            this._isNew = false;
            // load model, interactions and mixins snapshots
        },

        /* --- Public methods --- */

        get: function(attr) {

        },

        set: function(attr, value) {

        },

        save: function() {

        },

        destroy: function() {

        },

        toJSON: function() {

        }

    }, modelInstanceMethods);

    return ModelConstructor;

}

module.exports = ModelFactory;