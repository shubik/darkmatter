var _            = require('lodash'),
    Events       = require('events').EventEmitter,
    // Datatypes    = require('./datatypes'),
    // Hooks        = require('./hooks'),
    // Indexes      = require('./indexes'),
    // Roles        = require('./roles'),
    // Validators   = require('./validators'),
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
        modelIdAttribute     = options.idAttribute || '_id',
        modelSchema          = options.schema || {},
        modelMixins          = options.mixins || [],
        modelHooks           = options.hooks || [],
        modelClassMethods    = options.classMethods || {},
        modelInstanceMethods = options.instanceMethods || {},
        modelStore           = options.store || null,
        modelPermissions     = options.permissions || {},
        modelRoles           = options.roles || {},
        modelEnableAPI       = options.enableAPImodel || true,
        modelEnableMixinsAPI = options.enableAPImixins || true,
        ModelConstructor;

    reusablePool[modelName] = reusablePool[modelName] || [];

    ModelConstructor = function(query, options) {
        var self = this;

        query   = query || {};
        options = options || {};

        /* --- Check if model can be used from reisable pool - or create new one --- */

        if (!(this instanceof ModelConstructor)) {
            var availableInstance = _.filter(reusablePool[modelName], function(inst) {
                    return !inst._inUse;
                }),
                inst;

            if (availableInstance.length) {
                inst = availableInstance.pop();
                inst._initializeModel(query, options);
            } else {
                inst = new ModelConstructor(query, options);
                reusablePool[modelName].push(inst);
            }

            return inst;
        }

        /* --- Add events API --- */

        this._events = new Events;
        _.extend(this, this._events.__proto__);
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

        this._resetModel();

        /* --- Initialize this model --- */

        this._initializeModel(query, options);

        return this;
    }

    /* --- Add class (static) methods and properties --- */

    _.extend(ModelConstructor, {

        /* --- Private properties --- */

        _name        : modelName,
        _schema      : modelSchema,
        _idAttribute : modelIdAttribute,
        _store       : modelStore,
        _description : modelDescription,

        /* --- Class / collection / static methods --- */

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
        },

        registerRESTEndpoints: function(app) {
            if (!modelEnableAPI) return;

            app.namespace(modelName, function() {

                /* --- List items --- */

                app.get('/', function(req, res) {
                    res.send('list ' + modelName);
                });

                /* --- Read item --- */

                app.get('/:id', function(req, res) {
                    var id = req.params.id;
                    res.send('get ' + modelName + ' ' + id);
                });

                /* --- Add new item --- */

                app.post('/', function(req, res) {
                    res.send('add ' + modelName);
                });

                /* --- Update item --- */

                app.put('/:id', function(req, res) {
                    var id = req.params.id;
                    res.send('update ' + modelName + ' ' + id);
                });

                /* --- Destroy item --- */

                app.delete('/:id', function(req, res) {
                    var id = req.params.id;
                    res.send('delete ' + modelName + ' ' + id);
                });

            });
        },

        registerMixinAPIEndpoints: function(app) {
            if (!modelEnableMixinsAPI) return;

            app.namespace(modelName, function() {
                _.each(modelMixins, function(mixin) {
                    mixin.registerAPIEndpoints ? mixin.registerAPIEndpoints(app) : 0;
                });
            });
        }

    }, modelClassMethods);

    /* --- Add instance methods and properties --- */

    _.extend(ModelConstructor.prototype, {

        /* --- Private properties --- */

        _name         : modelName,
        _schema       : modelSchema,
        _idAttribute  : modelIdAttribute,
        _store        : modelStore,
        _description  : modelDescription,
        _mixinClasses : modelMixins,
        _permissions  : modelPermissions,
        _roles        : modelRoles,

        /* --- Private methods --- */

        _resetModel: function() {
            var self = this,
                modelData = {
                    id: this.id,
                    name: this._name,
                    events: this._events
                };

            this._inUse = false;
            this._isNew = null;
            // this._mixins = {};

            this._loading = deferred();
            this._ready = this._loading.promise;

            this._allowed = {};
            this._attributes = {};
            this._attributesBefore = {};
            this._attributesChanged = [];

            /* --- Instance "public" attributes and methods --- */

            this.id = null;
            this.ready = this._ready;

            /* --- Reset event listeners --- */

            this.removeAllListeners();

            /* --- Initialize mixins with model data --- */

            this._mixinClasses.forEach(function(mixin) {
                mixin.initialize && mixin.initialize(modelData);
            });
        },

        _initializeModel: function(query, options) {
            this._inuse = true;
            _.keys(query).length === 0 ? this._new() : this._load(query, options);
            this._cachePermissions();
        },

        _cachePermissions: function() {
            /*

             do it when model is loaded
             map roles, run permission functions for each role
             cache

            */

            this._loading.resolve(this); // do this when permissions are cached
        },

        _validate: function() {
            // do this before save; return true / false
        },

        _registerMixin: function(mixin) {

        },

        _new: function() {
            this.id = null;
            this._isNew = true;
            this._mixinSnapshots = {};
            this._interactions = {};

            this._attributes = _.reduce(this._schema, function(memo, val, key) {
                memo[key] = val.default;
                return memo;
            }, {});
        },

        _load: function(query, options) {
            this._isNew = false;

            // load model from store
            // load interactions
            // load mixins snapshots
        },

        /* --- Public methods --- */

        get: function(attr) {

        },

        set: function(attr, value) {

        },

        save: function() {
            /*

             check what attributes have changed
             validate

            */
        },

        destroy: function() {

        },

        toJSON: function() {

        },

        release: function() {
            this._reset_model();
        }

    }, modelInstanceMethods);

    return ModelConstructor;

}

module.exports = ModelFactory;