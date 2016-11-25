/**
 * Created by TT on 2016-11-25.
 */
const express = require('express');
const router = express.Router();
const Android = require('../model/androids');

router.route('/android/save').get(registerAndroid);
router.route('/android/messaging').get(sendFCM);

function registerAndroid(req, res) {
    var token = req.query['token'];
    var id = req.query['id'];

    console.log(token);

    Android.saveAndroid(token, id, (err, result)=> {
        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.send(result);
    });
}

function sendFCM(req, res) {
    var target = ids[req.query['target']];
    console.log(target);

    Android.sendMessage(target, (err, result)=> {
        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.send(result);
    });
}

module.exports = router;