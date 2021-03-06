/**
 * Created by TT on 2016-11-25.
 */
var FCM = require('fcm').FCM;
const apiKey = 'AIzaSyCdgBXBkjegfQ9yynJEAKEmQBcR5QeE1V0';
var fcm = new FCM(apiKey);
const async = require('async');
const forEach = require('async-foreach').forEach;

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

    db.collection('users').findOne({'arduino_id': id}, (err, docs)=> {
        if (err) {
            callback(err);
            return;
        }

        var tokens = docs['token'];
        if (tokens.indexOf(token) != -1) {
            console.log('이미 있는 사용자');
            callback(null, {'msg': 'user'});
            return
        }

        db.collection('users').updateOne({'arduino_id': id}, {$push: {'token': token}}, (err)=> {
            if (err) {
                callback(err);
                return;
            }

            callback(null, {'msg': 'success'});
        });
    });
};

Android.sendMessage = (id, latency, heart, callback)=> {

    db.collection('users').findOne({'arduino_id': id}, (err, docs)=> {

        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        var tokens = docs['token'];
        var meanLatency = (docs['zone'][1] + docs['zone'][2] + docs['zone'][3]) / 4;

        if (docs['zone'][1] == '0' || docs['zone'][2] == '0' || docs['zone'][3] == '0') {
            callback(null, {msg: 'not'});
            return;
        }
        console.log('mean : ', meanLatency);
        console.log('latency', latency);

        forEach(tokens, function (item) {
            var done = this.async();

            if (meanLatency + 20 < latency || heart < 80 || heart > 160) {

                var message = {
                    registration_id: item, // required
                };

                console.log(message);

                fcm.send(message, function (err, messageId) {
                    if (err) {
                        console.log("Something has gone wrong!");
                        callback(err);
                    } else {
                        console.log("Sent with message ID: ", messageId);
                        done();
                    }
                });
            } else {
                callback(null, 'safe~~');
            }
        }, ()=> {
            callback(null, {'msg': 'success'});
        });
    });
};

module.exports = Android;