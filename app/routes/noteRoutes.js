var AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
    endpoint: 'http://localhost:8000',
    region: 'us-west-2'
});

module.exports = function(app, db) {
    app.post('/testing', (req, res) => {
        console.log(req.body)
        res.send('hey')
    });

    app.get('/coupon'), (req, res) => {
        const params = {
            TableName: 'CouponDBLocal',
            Key:{
                'userID_couponID': { N: '112' },
                'DateTime': { N: '14062019192' }
            }
        };
        
        dynamodb.getItem(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log("i dont have anything to get for u" + data);           // successful response
        })
    }
};


