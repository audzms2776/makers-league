/**
 * Created by TT on 2016-11-25.
 */

const net = require('net');
const request = require('request');
const crypto = require('crypto');
var clientList = [];

const server = net.createServer(socket=> {
    console.log('Socket Clicnet connect From', socket.remoteAddress);
    socket.write('서버가 보낸 메세지 \n');
    registerArduino(socket.remoteAddress);

    clientList.push(socket);

    socket.on('data', data=> {
        console.log('>>' + data);

        var strArr = data.split('//');
        strArr.forEach((item, idx)=> {
            console.log(item);
        });
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

function registerArduino(id) {

    var options = {
        method: 'GET',
        url: 'http://localhost:3000/arduino/register',
        qs: {'id': id},
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

function setZone(id, call, latency, mode) {
    var options = {
        method: 'GET',
        url: 'http://localhost:3000/arduino/zone',
        qs: {id: id, call: call, latency: latency, mode: mode},
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

server.on('close', ()=> {
    console.log('Server Close Event');
});

server.listen(3003);