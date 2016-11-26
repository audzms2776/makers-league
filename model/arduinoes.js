/**
 * Created by TT on 2016-11-25.
 */
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

function Arduinoes() {

}

Arduinoes.registerAduino = (id, callback)=> {

    db.collection('users').findOne({'arduino_id': id}, (err, docs)=> {

        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        if (docs != undefined) {
            console.log(docs == undefined);
            callback(null, {'msg': '이미 있는 사용자'});
            return;
        }

        var obj = {
            "arduino_id": id,
            "token": [],
            "zone": {
                "1": 0.0,
                "2": 0.0,
                "3": 0.0,
                "4": 0.0
            },
            "danger": {
                "1": 0.0,
                "2": 0.0,
                "3": 0.0,
                "4": 0.0
            }
        };

        db.collection('users').insertOne(obj, (err)=> {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }

            console.log(obj);
            callback(null, {'msg': 'success'});
        });
    });
};

Arduinoes.saveZone = (id, call, latency, callback)=> {

    db.collection('users').findOne({'arduino_id': id}, (err, docs)=> {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        var obj = docs;
        console.log(obj['zone']);
        delete obj['_id'];
        obj['zone'][call] = parseInt(latency);

        db.collection('users').updateOne({'arduino_id': id}, {$set: obj}, (err)=> {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }

            callback(null, {'msg': 'success'});
        });
    });
};

module.exports = Arduinoes;