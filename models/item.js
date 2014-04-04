var Model = function(app) {
    console.log('Item model loaded...');
    app.all('*', function(req, res) {
        res.send('Item model');
    });
}

module.exports = Model;