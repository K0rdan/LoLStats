var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){

});

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    console.log("New client conencted");
})

server.listen(8080);