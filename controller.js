const AWS = require("aws-sdk");
const admin = require('firebase-admin');

// database endpoint
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

// use of dynamodb for database
const dynamodb = new AWS.DynamoDB();

// get the webpage with coupon button
function webpage(req, res) {
    res.sendFile('/test.html', {root: __dirname })
}

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
        // parameters for inserting user info to database
        var params_insert = {
            Item: {
                'user_id_coupon_id': { S: userID_couponID },
                'dateTime': { S: dateTIME },
                'coupon_id': { S: couponID },
                'coupon_code': { S: couponCODE }
            },
            TableName: 'CouponLocalDB'
        };
        // parameters for querying user info in database
        var params = {
            ReturnConsumedCapacity: "TOTAL",
            ExpressionAttributeValues: {
                ":v1": {
                  S: userID_couponID
                 }
               }, 
                KeyConditionExpression: "user_id_coupon_id = :v1", 
                // ProjectionExpression: "dateTime", 
                TableName: 'CouponLocalDB'
        };
        // query for user info in database
        dynamodb.query(params, function(err, data) {
            // if user info doesn't exists, then  
            // insert user info into database
            if (userID_couponID == null) {
                dynamodb.putItem(params_insert, (err, data) => {
                    if (err) {
                        console.error(err, err.stack);
                    } else {
                        console.log(data);
                    }
                })
            } else {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
                console.log('item exists');
            }
        })
    })
    .catch((err) => { // an error occurred
        console.log(err)
    });
} 

// GET CouponLocalDB table 
function getCouponTable(req, res) {
    var params = {
        TableName: 'CouponLocalDB',
    };    
    dynamodb.scan(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
                res.send(data);
                console.log(data);
        }
    });
}

module.exports = {
    webpage,
    extractUserInfo,
    getCouponTable
};
