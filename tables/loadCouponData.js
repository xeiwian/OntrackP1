const AWS = require("aws-sdk");
const fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing fake coupon data into DynamoDB. Please wait.");
// const coupon = JSON.parse(fs.readFileSync('couponTableitem.json', 'utf8'));
// coupon.forEach(function(coupon) {
//   console.log(coupon)
const params = {
        TableName: "CouponDBLocal",
        Item: {            
    "userID_couponID": {"N": 112},
    "DateTime": {"N": 14062019192}
    // "userID": {"N": "1"},
    // "couponID": {"N": "12"},
    // "couponCode": {"S": "ABCD34"}
        }
    };
docClient.put(params, function(err, data) {
       if (err) {
           console.error(err)
        //    console.error("Unable to add coupon data",  ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:");
       }
    });
// });