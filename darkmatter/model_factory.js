var _            = require('lodash'),
    deferred     = require('deferred'),
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
    ModelFactory,
    copy;

copy = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

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

    ModelConstructor = function(modelId, options) {
        var self = this;

        options = options || {};
        modelId = modelId || null;

        /* --- Check if model can be used from reusable pool - or create new one --- */

        if (!(this instanceof ModelConstructor)) {

            var availableInstance = _.filter(reusablePool[modelName], function(inst) {
                    return !inst._inUse;
                }),
                inst;

            if (availableInstance.length > 0) {

                console.log('ModelConstructor reuse instance');

                inst = availableInstance.pop();
                inst._initializeModel(modelId, options);
            } else {

                console.log('ModelConstructor create new instance');

                inst = new ModelConstructor(modelId, options);
                reusablePool[modelName].push(inst);
            }

            return inst;
        }

        this._cid = _.uniqueId(modelName + '_');

        console.log('ModelConstructor creating new instance...', this._cid);

        /* --- Make sure schema item keys do not clash with this model methods and properties --- */

        _.each(this._schema, function(item, attr) {
            if (self[attr] || self.__proto__[attr]) {
                throw new Error('ModelConstructor(): schema item clashes with model method or property: ' + attr);
            }
        });

        /* --- Prepare schema --- */

        delete this._schema.id;

        /* --- Define setters and getters for model attributes--- */

        _.each(this._schema, function(item, attr) {
            self.__defineSetter__(attr, function(val) {
                self._attributes[attr] = val;
            });

            self.__defineGetter__(attr, function() {
                return self._attributes[attr];
            });
        });

        /* --- Define getter and setter for model id --- */

        this.__defineSetter__('id', function() {
            console.log('[ModelConstructor] You should not change model id', modelName);
            console.trace();
        });

        this.__defineGetter__('id', function() {
            return (self._modelId).toString();
        });

        /* --- Setup model internal attributes to defaults --- */

        this._resetModel();

        /* --- Initialize this model --- */

        this._initializeModel(modelId, options);

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

                /*

                 Adds namespace, e.g. /api/v1.0/<model name>

                */


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

            var self = this;

            app.namespace(modelName, function() {
                _.each(modelMixins, function(mixin) {

                    // should we create a mixin instance and bind Model to it?

                    mixin.registerAPIEndpoints ? mixin.registerAPIEndpoints(app, self) : 0;
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

            console.log('_resetModel() to defaults');

            var self = this;
                // modelData = {
                //     id: this.id,
                //     name: this._name
                // };

            this._modelId = null;
            this._inUse   = false;
            this._isNew   = null;

            this._loading = deferred();
            this._ready = this._loading.promise;

            this._allowed = {};
            this._attributes = {};
            this._attributesBefore = copy(this._attributes);
            this._attributesChanged = [];
            this._mixinSnapshots = {};

            /* --- Instance "public" attributes and methods --- */

            this.ready = this._ready;

            /* --- Initialize mixins with model data --- */

            // this._mixinClasses.forEach(function(mixin) {
            //     // self._mixinSnapshots[mixin.name] = mixin.initialize(modelData);
            //     // add this mixin's callbacks to lifecycle events
            // });
        },

        _initializeModel: function(modelId, options) {

            console.log('_initializeModel()', modelId, options);

            this._inUse   = true;
            this._modelId = modelId;
            this._options = options;
            this._modelId === null ? this._new() : this._load();
            this._cachePermissions();
        },

        _cachePermissions: function() {

            console.log('_cachePermissions()');

            /*

             do it when model is loaded
             map roles, run permission functions for each role
             cache

            */

            this._loading.resolve(this); // do this when permissions are cached
        },

        _validate: function() {
            console.log('_validate()');
            // do this before save; return true / false
        },

        _registerMixin: function(mixin) {
            console.log('_registerMixin()');
        },

        _new: function() {

            console.log('_new()');

            this.id = null;
            this._isNew = true;
            this._interactions = {};

            this._attributes = _.reduce(this._schema, function(memo, val, key) {
                memo[key] = val.default;
                return memo;
            }, {});
        },

        _load: function() {
            this._isNew = false;

            console.log('_load()', this.id);

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
            this._resetModel();
        }

    }, modelInstanceMethods);

    return ModelConstructor;

}

module.exports = ModelFactory;