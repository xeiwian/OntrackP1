const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({
    endpoint: 'http://localhost:8000',
    region: 'us-west-2'
});

const params = {
    Item: {
        'userID_couponID': { N: '112' },
        'DateTime': { N: '14062019192' },
        'userID': { N: '1' },
        'couponID': { N: '12' },
        'couponCode': { S: 'ABC123' },
    },
    TableName: 'CouponDBLocal',
    ReturnConsumedCapacity: "TOTAL",
};

dynamodb.putItem(params, (err, data) => {
    if (err) {
        console.error(err, err.stack);
    } else {
        console.log(data);
    }
})
