const express = require ('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./ontrackp1-firebase-adminsdk-6otas-f17899be56.json');
const controller = require('./controller');

// setting up firebase admin sdk
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://ontrackp1.firebaseio.com"
});

// setup app instances 
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
// // to process URL in encoded form on its own
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------------------------------------------------------------------------------

// get the webpage with button
app.get("/", (req, res) => { res.sendFile('/test.html', {root: __dirname }) });
app.post("/", controller.extractUserInfo);
app.get("/db", controller.getCouponTable);
app.post("/createdb", controller.createCouponTable);

const port = 3000;

// listening to port 3000
app.listen(port, () => {
    console.log("We are live on port " + port);
})



