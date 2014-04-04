module.exports = function(req, res, next) {
    req._context = {};
    next();
};