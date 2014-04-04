var Model = function(app) {
    console.log('User model loaded...');
    app.all('*', function(req, res) {
        res.send('User model');
    });
}

module.exports = Model;