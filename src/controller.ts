const AWS = require("aws-sdk");
const admin = require('firebase-admin');

AWS.config.update({ // database endpoint
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const dynamodb = new AWS.DynamoDB(); // use of dynamodb for database

function webpage(req, res) { // get the webpage with coupon button
    res.sendfile('./webpages/test.html');
}

function getUser(params) { // function for getting user info from database
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

function insert(params_insert) { // function for inserting items into database
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

function get(params_table) { // function for getting table info
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

async function getCouponTable(req,res) { // getting table called CouponLocalDB 
    try {
        let getTable: any = await get({
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

async function extractUserInfo(req, res) { // extract and insert user info from coupon button 
    
    let token: string = req.body.idToken;
    let couponID: string = req.body.couponid;
    let couponCODE: string = req.body.couponcode;
    let dateTIME: string = new Date().toISOString().substr(0,10); // to get a date without including its time

    let decodedToken = await admin.auth().verifyIdToken(token); // verifying and decoding id token
    let userID: string = decodedToken.user_id + ".";
    let userID_couponID: string = userID.concat(couponID); // concatenate user id and coupon id for storing it in database as Partition key

    try {
        let getUserInfo: any = await getUser({
            // parameters for inserting user info to database
            Key: {
             "user_id_coupon_id": { // hash key 
               S: userID_couponID
              },
             "coupon_id": { // range key
               S: couponID
              }
            }, 
            TableName: "CouponLocalDB"
        });
        console.log(getUserInfo, userID_couponID, couponID);
        console.log('get info success');

        // {} if not found
        // { Item: {...} } if found

        if ( getUserInfo.Item === undefined ){ // if user info is undefined, then insert it to database 
            let insertUserInfo: any = await insert({
                // parameters for inserting user info
                Item: {
                    'user_id_coupon_id': { S: userID_couponID /* abc213 */ },
                    'coupon_id': { S: couponID /*123456*/ },
                    'dateTime': { S: dateTIME /* 2019-06-27 */ },
                    'coupon_code': { S: couponCODE }
                },
                TableName: 'CouponLocalDB',
            });
            console.log(insertUserInfo);
            res.sendfile('./webpages/thank.html');
            console.log('item inserted success');
        } else {
            res.sendfile('./webpages/claimed.html');
            console.log('item exists');
        }
    } catch (err) {
        console.log('error from getting/inserting user info into database',err, err.stack);
        throw err;
    }
}

module.exports = {
    webpage,
    extractUserInfo,
    getCouponTable
};