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

// function for query database
function query(params) {
    return new Promise((resolve,reject) => {
        dynamodb.query(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });
    })
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
    // parameters for getting table info
    var params_table = {
        TableName: 'CouponLocalDB',
    };  

    try {
        const getTable= await get(params_table);
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
    var dateTIME = new Date().toISOString().substr(0,10);

    // verifying and decoding id token 
    const decodedToken = await admin.auth().verifyIdToken(token);
    var userID = decodedToken.user_id + ".";

    // concatenate user id and coupon id for storing it in database as Partition key
    var userID_couponID = userID.concat(couponID);

    // parameters for inserting user info to database


  

    // parameters for querying user info in database
    var params = {
        ReturnConsumedCapacity: "TOTAL",
        ExpressionAttributeValues: {
            ":v1": {
              S: userID_couponID
            }
           }, 
            KeyConditionExpression: "user_id_coupon_id = :v1", 
            // ProjectionExpression: "dateTime", 
            TableName: 'CouponLocalDB'
    };

    // try {
    //     const queryResult = await query(params);
    //     console.log(queryResult);

    // } catch (err) {
    //     console.log('error from query',err, err.stack);
    //     throw err;
    // }

    
    try {
        const getUserInfo = await getUser({
            Key: {
             "user_id_coupon_id": {
               S: userID_couponID
              }, 
             "dateTime": {
               S: dateTIME
              }
            }, 
            TableName: "CouponLocalDB"
        });
        console.log(getUserInfo,userID_couponID ,dateTIME);
        console.log('get info success');

        // {} if not found
        // { Item: {...} } if found
       
        if ( getUserInfo.Item === undefined ){
            const insertResult = await insert( {
                Item: {
                    'user_id_coupon_id': { S: userID_couponID /* abc213 */ },
                    'dateTime': { S: dateTIME /* 2019-06-27 */ },
                    'coupon_id': { S: couponID },
                    'coupon_code': { S: couponCODE }
                },
                TableName: 'CouponLocalDB',
               
            });
            console.log(insertResult);
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

        // try {
        //     const getUserInfo = await getUser(params);
        //     const insertResult = await insert(params_insert);

        //     console.log(getUserInfo);
        //     console.log('get info success');

        //     if ( getUserInfo.userID_couponID !== insertResult.userID_couponID ){
        //         res.sendFile('/thank.html', {root: __dirname });
        //         console.log('item inserted success');
        //         // res.sendFile('/claimed.html', {root: __dirname });
        //         // console.log('item exists');
        //     } else {
        //         // res.sendFile('/thank.html', {root: __dirname });
        //         // console.log('item inserted success');
        //         res.sendFile('/claimed.html', {root: __dirname });
        //         console.log('item exists');
        //     }
        // } catch (err) {
        //     console.log('error from getting info',err, err.stack);
        //     throw err;
        // }

    // try {
    //     const insertResult = await insert(params_insert);
    //     console.log(insertResult);
    //     console.log('item inserted success');
    //     res.sendFile('/thank.html', {root: __dirname });
    // } catch (err) {
    //     console.log('error from getting info',err, err.stack);
    //     throw err;
    // }

    // try {
    //     const getUserInfo = await getUser(params);
    //     console.log('get info success');

    //     if (userID_couponID !== null){
    //         res.sendFile('/claimed.html', {root: __dirname });
    //         console.log('item exists');
    //     }
    // } catch (err) {
    //     console.log('error from getting info',err, err.stack);
    //     throw err;
    // }

    // try {
    //     // if (userID_couponID == null) {
    //     const insertResult = await insert(params_insert);
    //     if (userID_couponID == null) {
    //         console.log(insertResult);
    //     } else {
    //         console.log('item exists');
    //     }
    //     res.send('post ok')
    // } catch (err) {
    //     console.log('error from insert',err, err.stack);
    //     res.send('post failure')
    // }

}

module.exports = {
    webpage,
    extractUserInfo,
    getCouponTable
};
