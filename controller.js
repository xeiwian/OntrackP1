var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var AWS = require("aws-sdk");
var admin = require('firebase-admin');
// database endpoint
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
// use of dynamodb for database
var dynamodb = new AWS.DynamoDB();
// get the webpage with coupon button
function webpage(req, res) {
    res.sendFile('/test.html', { root: __dirname });
}
// function for getting user info from database
function getUser(params) {
    return new Promise(function (resolve, reject) {
        dynamodb.getItem(params, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                console.log(data);
                resolve(data);
            }
        });
    });
}
// function for inserting items into database
function insert(params_insert) {
    return new Promise(function (resolve, reject) {
        dynamodb.putItem(params_insert, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
// function for getting table info
function get(params_table) {
    return new Promise(function (resolve, reject) {
        dynamodb.scan(params_table, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
// getting table called CouponLocalDB 
function getCouponTable(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var getTable, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, get({
                            // parameters for getting table info
                            TableName: 'CouponLocalDB'
                        })];
                case 1:
                    getTable = _a.sent();
                    console.log(getTable);
                    res.send(getTable);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log('error from getting table', err_1, err_1.stack);
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function extractUserInfo(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var token, couponID, couponCODE, dateTIME, decodedToken, userID, userID_couponID, getUserInfo, insertUserInfo, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = req.body.idToken;
                    couponID = req.body.couponid;
                    couponCODE = req.body.couponcode;
                    dateTIME = new Date().toISOString().substr(0, 10);
                    return [4 /*yield*/, admin.auth().verifyIdToken(token)];
                case 1:
                    decodedToken = _a.sent();
                    userID = decodedToken.user_id + ".";
                    userID_couponID = userID.concat(couponID);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, getUser({
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
                        })];
                case 3:
                    getUserInfo = _a.sent();
                    console.log(getUserInfo, userID_couponID, couponID);
                    console.log('get info success');
                    if (!(getUserInfo.Item === undefined)) return [3 /*break*/, 5];
                    return [4 /*yield*/, insert({
                            // parameters for inserting user info
                            Item: {
                                'user_id_coupon_id': { S: userID_couponID /* abc213 */ },
                                'coupon_id': { S: couponID },
                                'dateTime': { S: dateTIME /* 2019-06-27 */ },
                                'coupon_code': { S: couponCODE }
                            },
                            TableName: 'CouponLocalDB'
                        })];
                case 4:
                    insertUserInfo = _a.sent();
                    console.log(insertUserInfo);
                    res.sendFile('/thank.html', { root: __dirname });
                    console.log('item inserted success');
                    return [3 /*break*/, 6];
                case 5:
                    res.sendFile('/claimed.html', { root: __dirname });
                    console.log('item exists');
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    console.log('error from getting info', err_2, err_2.stack);
                    throw err_2;
                case 8: return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    webpage: webpage,
    extractUserInfo: extractUserInfo,
    getCouponTable: getCouponTable
};
