const AWS = require("aws-sdk");
const admin = require('firebase-admin');

// database endpoint
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

// use of dynamodb for database
const dynamodb = new AWS.DynamoDB();

// extract and insert user info from coupon button 
function extractUserInfo(req, res) {
    res.sendFile('/test.html', {root: __dirname });
    var token = req.body.idToken;
    var couponID = req.body.couponid;
    var couponCODE = req.body.couponcode;
    var dateTIME = (Date(Date.now())).toString();

    // verifying and decoding id token 
    admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
        var userID = decodedToken.user_id + ".";
        // concatenate user id and coupon id for storing it in database as Partition key
        var userID_couponID = userID.concat(couponID);

        var params = {
            Item: {
                'user_id_coupon_id': { S: userID_couponID },
                'dateTime': { S: dateTIME },
                'coupon_id': { S: couponID },
                'coupon_code': { S: couponCODE }
            },
            TableName: 'CouponLocalDB',
            ReturnConsumedCapacity: "TOTAL",
        };

        // insert the new user info into database if it doesn't exists, 
        // otherwise return webpage and let user know coupon is claimed
        if (userID_couponID == null) {
            dynamodb.putItem(params, (err, data) => {
                if (err) {
                    console.error(err, err.stack);
                } else {
                    console.log(data);
                }
            })
        } else {
            // res.send({message: 'Coupon is claimed.'});
            console.log('item exists');
        }
    })
    .catch((err) => {
        console.log(err)
    });
}

// GET CouponLocalDB table 
function getCouponTable(req, res) {
    var params = {
        TableName: 'CouponLocalDB',
        // ProjectionExpression: 'couponID, couponCode'
    };    
    dynamodb.scan(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
                res.send(data);
                console.log(data);
        }
    });
}

// CREATE new table 
function createCouponTable(req, res) {
    var params = {
        AttributeDefinitions: [
        {
            AttributeName: 'user_id_coupon_id',
            AttributeType: 'S'
        },
        {
            AttributeName: 'dateTime',
            AttributeType: 'S'
        }
        ],
        KeySchema: [
        {
            AttributeName: 'user_id_coupon_id',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'dateTime',
            KeyType: 'RANGE'
        }
        ],
        ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
        },
        TableName: 'CouponLocalDB',
        StreamSpecification: {
        StreamEnabled: false
        }
    };

    dynamodb.createTable(params, (err, data) => {
        if (err) {
            console.error(err, err.stack);
        } else {
            res.send(data);
            console.log(data);
        }
    })
}

module.exports = {
    extractUserInfo,
    getCouponTable,
    createCouponTable
};
