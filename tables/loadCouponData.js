const AWS = require("aws-sdk");
const fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing Fake coupon data into DynamoDB. Please wait.");
const coupon = JSON.parse(fs.readFileSync('couponTableitem.json', 'utf8'));
coupon.forEach(function(coupon) {
console.log(coupon)
const params = {
        TableName: "CouponDBLocal",
        Item: {            
            "userID_couponID": coupon.userID_couponID,
            "DateTime": coupon.DateTime,
            "userID": coupon.userID,
            "couponID": coupon.couponID,
            "couponCode": coupon.couponCode
        }
    };
docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add coupon data",  ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:");
       }
    });
});