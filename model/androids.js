/**
 * Created by TT on 2016-11-25.
 */
var FCM = require('fcm').FCM;
const apiKey = 'API Key';
var fcm = new FCM(apiKey);

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/papat';
const ObjectID = require('mongodb').ObjectID;
var db;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }

    // console.log('MongoDB 연결 성공');
    db = database;
});

function Android() {

}

Android.saveAndroid = (token, id, callback)=> {
    db.collection('users').updateOne({'arduino_id': id}, {'token': {$push: token}}, (err)=> {
        if (err) {
            console.log('error');
            return;
        }

        callback(null, {'msg': 'success'});
    });
};

Android.sendMessage = (token, callback)=> {
    var message = {
        registration_id: token, // required
        collapse_key: 'Collapse key',
        data1: 'this is data1 war !',
        data2: 'this is data2 war !'
    };

    fcm.send(message, function (err, messageId) {
        if (err) {
            console.log("Something has gone wrong!");
            callback(err);
        } else {
            console.log("Sent with message ID: ", messageId);
            callback(null, {'msg': 'success'});
        }
    });
};

module.exports = Android;