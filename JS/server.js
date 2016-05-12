// INCLUDES {
    // MODULES
    var os = require('os');
    var http = require('http');
    var fs = require('fs')
    var async = require('async');

    // CUSTOM FILES
    var LOLApi = require('./LOLApi.js');
// }

const PORT = 8080;

var lastQuery = 0;
var queue = async.queue(function(url, callback){
    //console.log("Simulate HTTP GET for : ",url);
    
    if(lastQuery == 0){
        // TODO : HTTP GET
        lastQuery = Date.now();
    }
    else{
        if( (Date.now() - lastQuery) < LOLApi.queryRateLimit()){
            while((Date.now() - lastQuery) < LOLApi.queryRateLimit());
            console.log(Date.now() - lastQuery + "ms");
            // TODO : HTTP GET
            lastQuery = Date.now();
        }
    }
    callback();
});

queue.drain = function(){
    console.log("Queue is empty");
}

var server = http.createServer();
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    console.log(' - New connection from ' + socket.request.connection.remoteAddress);

    var obj = new LOLApi();

    socket.emit('message', 'connected');
    socket.on('setSummonerID', function(summonerID){
        var ID = parseInt(summonerID) || 0;
        if(ID != 0)
            obj.setSummonerID = summonerID;
        else
            socket.emit('message', '[ERROR] SummonerID invalid : ' + summonerID);
    });
    socket.on('getMatchesDetails', function(matchList){
        socket.emit('message', 'getMatchesdetails');
        matchList.forEach(function(match){
            socket.emit('message', obj.getMatchDetails(queue, match));
        }, this);
    });
});

server.listen(PORT);
console.log("The LOLStats server is now listening on " + os.hostname() + ":" + PORT);