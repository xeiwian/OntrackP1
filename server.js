const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require ('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const AWS = require("aws-sdk");
const admin = require('firebase-admin');
const serviceAccount = require('./ontrackp1-firebase-adminsdk-6otas-f17899be56.json');

// setting up firebase admin sdk
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://ontrackp1.firebaseio.com"
  });

// database endpoint
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const dynamodb = new AWS.DynamoDB();

var app = express();

const port = 3000;

app.listen(port, () => {
    console.log("We are live on port " + port);
})

app.use(logger('dev'));
app.use(bodyParser.json());
// to process URL in encoded form on its own
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// get the webpage with button
app.get('/', (req, res) => {
    console.log(req.body);
    res.sendFile('/test.html', {root: __dirname })
});

// // receive post request from webpage button
// app.post('/', (req, res) => {
//     console.log(req.body);
//     res.sendFile('/test.html', {root: __dirname })
// });

// receive post request from webpage button
app.post('/', (req, res) => {
    res.sendFile('/test.html', {root: __dirname });
    var token = req.body.idToken;
    console.log(token);
    // verifying and decoding id token 
    admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
        // LOG.info(`Successfully validated registrationToken ${token}`);
        res.send(decodedToken);
        console.log(decodedToken);
        // var userID = decodedToken.user_id;
        // console.log(userID);
    })
    .catch((err) => {
        console.log(err)
    });
});

// GET the table
app.get('/coupon', (req, res) => {
        var params = {
            TableName: 'CouponDBLocal',
            // ProjectionExpression: 'couponID, couponCode'
        };    
        dynamodb.scan(params, function (err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else {
                    res.send(data);
                    console.log(data);
              }
        });
});

// put items into table
app.post('/coupon', (req, res) => {
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
            res.send(data);
            console.log(data);
        }
    })
});

// retrieve item from table by its Partition Key and Sort Key
app.get('/coupon/112', (req, res) => {
    const params = {
        TableName: 'CouponDBLocal',
        Key:{
            'userID_couponID': { N: '112' },
            'DateTime': { N: '14062019192' }
        }
    };
    dynamodb.getItem(params, (err, data) => {
        if (err) {
            console.error(err, err.stack);
        } else {
            res.send(data);
            console.log(data);
        }
    })
});

// require('./app/routes')(app, {});

