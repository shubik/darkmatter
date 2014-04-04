var Model = function(app) {
    console.log('Attribute model loaded...');
    app.all('*', function(req, res) {
        res.send('Attribute model');
    });
}

module.exports = Model;