/**
 * Created by TT on 2016-11-25.
 */
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const net = require('net');
const request = require('request');
var clientList = [];

const server = net.createServer(socket=> {
    console.log('Socket Clicnet connect From', socket.remoteAddress);
    socket.write('서버가 보낸 메세지 \n');
    registerArduino(socket.remoteAddress);

    clientList.push(socket);

    socket.on('data', data=> {
        var resData = data.toString();
        console.log(resData);

        var order = resData.split('@')[0];
        var orders = resData.split('@')[1].split('&');
        console.log(order);
        console.log(orders);

        var values = [];

        orders.forEach((item, idx)=> {
            values.push(item.split('=')[1].replace('\n\n', ''));
            console.log(item.split('=')[1]);
        });

        if (order == 'area') {
            setZone(socket.remoteAddress, values[0], values[1]);
        } else if (order == 'message') {
            io.emit('heart', values[1]);
            sendMessage(socket.remoteAddress, values[0], values[1]);
        }
    });

    socket.on('end', ()=> {
        console.log('Client disconneced');
    });

    socket.on('close', ()=> {
        console.log('Socket Close Event');
    });

    socket.on('error', error=> {
        console.log('Socket Error ', error);
    });
});

server.on('listening', ()=> {
    console.log('Server is listening @', server.address().port);
});

io.on('connection', function (socket) {

    console.log('a user connected');
    io.emit('user inter', '입장했습니다.');

    socket.on('heart', function (msg) {
        console.log('heart: ' + msg);
        io.emit('heart', msg);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

function registerArduino(id, latency, heart) {

    var options = {
        method: 'GET',
        url: 'http://localhost:3000/arduino/register',
        qs: {'id': id, 'latency': latency, 'heart': heart},
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

function setZone(id, call, latency) {
    var options = {
        method: 'GET',
        url: 'http://localhost:3000/arduino/zone',
        qs: {id: id, call: call, latency: parseInt(latency)},
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

function sendMessage(id, latency, heart) {
    var options = {
        method: 'GET',
        url: 'http://localhost:3000/android/messaging',
        qs: {id: id, 'latency': latency, 'heart': heart},
    };

    console.log('message', id);

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

server.on('close', ()=> {
    console.log('Server Close Event');
});

server.listen(3003);

http.listen(3004, function () {
    console.log('listening on *:3004');
});