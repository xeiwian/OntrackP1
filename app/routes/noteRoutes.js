module.exports = function(app, db) {
    app.post('/coupon', (req, res) => {
        console.log(req.body)
        res.send('hey')
    });
};
