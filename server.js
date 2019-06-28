"use strict";
exports.__esModule = true;
var express = require('express');
var bodyParser = require('body-parser');
var admin = require('firebase-admin');
var serviceAccount = require('./ontrackp1-firebase-adminsdk-6otas-f17899be56.json');
var controller = require('./controller');
// setting up firebase admin sdk
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// setup app instances 
var app = express();
app.use(bodyParser.json());
// // to process URL in encoded form on its own
app.use(bodyParser.urlencoded({ extended: true }));
// get the webpage with button
app.get("/", controller.webpage);
app.post("/", controller.extractUserInfo);
app.get("/db", controller.getCouponTable);
// port number
var port = 3000;
// listening to port 3000
app.listen(port, function () {
    console.log("We are live on port " + port);
});
// java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar -sharedDb
