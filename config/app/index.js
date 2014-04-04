var _ = require('lodash'),
    config = require('./default'),
    localConfigFile = process.env['CORE_CONFIG'];

if (localConfigFile) {
    try {
        config = _.merge(config, require(localConfigFile));
    } catch(e) {
        console.log('CORE_CONFIG points to unexisting file ', localConfigFile, 'ignoring...');
    }
}

module.exports = config;