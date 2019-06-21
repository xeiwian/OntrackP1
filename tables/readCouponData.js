const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
    endpoint: 'http://localhost:8000',
    region: 'us-west-2'
});

const params = {
    TableName: 'CouponDBLocal',
    Key:{
        'userID_couponID': { N: '112' },
        'DateTime': { N: '14062019192' }
    }
};

dynamodb.getItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
