"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./ontrackp1-firebase-adminsdk-6otas-f17899be56.json');
const controller = require('./controller');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const app = express(); // setup app instances 
app.use(bodyParser.urlencoded({ extended: true })); // to process URL in encoded form on its own
app.get("/", controller.webpage);
app.post("/", controller.extractUserInfo);
app.get("/db", controller.getCouponTable);
const port = 3000; // port number
app.listen(port, () => {
    console.log("We are live on port " + port);
});
// run this line in another terminal to start up local dynamodb server
// java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar -sharedDb
//# sourceMappingURL=server.js.map