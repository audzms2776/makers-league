/**
 * Created by TT on 2016-11-25.
 */
const express = require('express');
const router = express.Router();
const Arduino = require('../model/arduinoes');

router.route('/arduino/register').get(registerArduino);
router.route('/arduino/zone').get(setZone);

function registerArduino(req, res) {

    var id = req.query['id'];
    Arduino.registerAduino(id, (err, result)=> {
        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.send(result);
    });
}

function setZone(req, res) {
    var id = req.query['id'];
    var call = req.query['call'];
    var latency = req.query['latency'];
    var mode = req.query['mode'];

    Arduino.saveZone(id, call, latency, mode, (err, result)=> {
        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.send(result);
    });
}

module.exports = router;