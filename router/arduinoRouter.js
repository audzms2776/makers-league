/**
 * Created by TT on 2016-11-25.
 */
const express = require('express');
const router = express.Router();
const app = express();
const Arduino = require('../model/aduinoes');

router.route('arduino/register').get(registerAudino);
router.route('arduino/zone').get(setZone);

function registerAudino(req, res) {

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