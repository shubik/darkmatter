var Model = function(app) {
    console.log('Thing model loaded...');
    app.all('*', function(req, res) {
        res.send('Thing model');
    });
}

module.exports = Model;