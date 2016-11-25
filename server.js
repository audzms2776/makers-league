/**
 * Created by TT on 2016-11-25.
 */
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const logger = require('morgan');
app.use(logger('dev'));
app.use(express.static('.'));
app.use(express.static('./public'));

const aduinoRouter = require('./router/arduinoRouter');
const androidRouter = require('./router/androidRouter');

app.use(aduinoRouter);
app.use(androidRouter);

app.listen(3000, ()=> {
    console.log('server 3000 start');
});