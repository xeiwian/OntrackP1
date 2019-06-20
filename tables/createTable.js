const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const dynamodb = new AWS.DynamoDB();

const params = {
    TableName : "CouponDBLocal",
    KeySchema: [       
        { AttributeName: "userID_couponID", KeyType: "HASH"},  // Partition key
        { AttributeName: "DateTime", KeyType: "RANGE" }  // Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "userID_couponID", AttributeType: "N" },
        { AttributeName: "DateTime", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

// java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar -sharedDb