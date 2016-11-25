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
};

Arduinoes.saveZone = (id, call, latency, mode, callback)=> {

    var obj = {[call]: latency};

    db.collection('users').updateOne({'arduino_id': id}, {[mode]: {$set: obj}}, (err)=> {
        if (err) {
            console.log(err);
            res.send({'msg': 'fail'});
            return;
        }

        res.send({'msg': 'success'});
    });
};

Arduinoes.saveDanger = (id, call, latency)=> {

    var obj = {[call]: latency};

    db.collection('users').updateOne({'arduino_id': id}, {'danger': {$set: obj}}, (err)=> {
        if (err) {
            console.log(err);
            res.send({'msg': 'fail'});
            return;
        }

        res.send({'msg': 'success'});
    });
};

module.exports = Arduinoes;