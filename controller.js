const AWS = require("aws-sdk");
const admin = require('firebase-admin');

// database endpoint
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

// use of dynamodb for database
const dynamodb = new AWS.DynamoDB();

// get the webpage with coupon button
function webpage(req, res) {
    res.sendFile('/test.html', {root: __dirname })
}

// function for getting user info from database
function getUser(params) {
    return new Promise((resolve,reject) => {
        dynamodb.getItem(params, (err, data) => {
            if (err) {
                reject(err)
            } 
            else {
                console.log(data);
                resolve(data)
            }         
          });
    })
}

// function for inserting items into database
function insert(params_insert) {
    return new Promise((resolve,reject) => {
        dynamodb.putItem(params_insert, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// function for getting table info
function get(params_table) {
    return new Promise((resolve,reject) => {
        dynamodb.scan(params_table, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

async function getCouponTable(req,res) { 
    try {
        const getTable= await get({
            // parameters for getting table info
            TableName: 'CouponLocalDB'
        });
        console.log(getTable);
        res.send(getTable);
    } catch (err) {
        console.log('error from getting table',err, err.stack);
        throw err;
    }
}

// extract and insert user info from coupon button 
async function extractUserInfo(req, res) {
    
    var token = req.body.idToken;
    var couponID = req.body.couponid;
    var couponCODE = req.body.couponcode;
    // to get a data without including its time
    var dateTIME = new Date().toISOString().substr(0,10);

    // verifying and decoding id token 
    var decodedToken = await admin.auth().verifyIdToken(token);
    var userID = decodedToken.user_id + ".";

    // concatenate user id and coupon id for storing it in database as Partition key
    var userID_couponID = userID.concat(couponID);
    

    try {
        const getUserInfo = await getUser({
            // parameters for inserting user info to database
            Key: {
             "user_id_coupon_id": {
               S: userID_couponID
              },
             "coupon_id": {
               S: couponID
              }
            }, 
            TableName: "CouponLocalDB"
        });
        console.log(getUserInfo, userID_couponID, couponID);
        console.log('get info success');

        // {} if not found
        // { Item: {...} } if found
       
        if ( getUserInfo.Item === undefined ){
            const insertUserInfo = await insert({
                // parameters for inserting user info
                Item: {
                    'user_id_coupon_id': { S: userID_couponID /* abc213 */ },
                    'coupon_id': { S: couponID },
                    'dateTime': { S: dateTIME /* 2019-06-27 */ },
                    'coupon_code': { S: couponCODE }
                },
                TableName: 'CouponLocalDB',
            });
            console.log(insertUserInfo);
            res.sendFile('/thank.html', {root: __dirname });
            console.log('item inserted success');
        } else {
            res.sendFile('/claimed.html', {root: __dirname });
            console.log('item exists');
        }
    } catch (err) {
        console.log('error from getting info',err, err.stack);
        throw err;
    }
}

module.exports = {
    webpage,
    extractUserInfo,
    getCouponTable
};
