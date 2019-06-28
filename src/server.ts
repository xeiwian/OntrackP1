const express = require ('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./ontrackp1-firebase-adminsdk-6otas-f17899be56.json');
const controller = require('./controller');
export {};

admin.initializeApp({ // setting up firebase admin sdk
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://ontrackp1.firebaseio.com"
});

const app = express(); // setup app instances 

app.use(bodyParser.urlencoded({ extended: true })); // to process URL in encoded form on its own

app.get("/", controller.webpage);
app.post("/", controller.extractUserInfo);
app.get("/db", controller.getCouponTable);

const port = 3000; // port number

app.listen(port, () => { // listening to port 3000
    console.log("We are live on port " + port);
})

// run this line in another terminal to start up local dynamodb server
// java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar -sharedDb