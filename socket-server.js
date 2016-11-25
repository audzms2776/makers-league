/**
 * Created by TT on 2016-11-25.
 */

const net = require('net');

var clientList = [];

const server = net.createServer(socket=> {
    console.log('Socket Clicnet connect From', socket.remoteAddress);
    socket.write('서버가 보낸 메세지 \n');

    clientList.push(socket);

    socket.on('data', data=> {
        console.log('>>' + data);

        clientList.forEach(client => {
            client.write(data);
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

server.on('close', ()=> {
    console.log('Server Close Event');
});

server.listen(3003);