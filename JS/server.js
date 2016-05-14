// INCLUDES {
    // MODULES
    var os = require('os');
    var http = require('http');
    var https = require('https');
    var fs = require('fs')
    var async = require('async');

    // CUSTOM FILES
    var LOLApi = require('./LOLApi.js');
// }

const PORT = 8080;

var lastQuery = 0;
var queue = async.queue(function(params, callback){
    //console.log("Simulate HTTP GET for : ",params.req);

    if(lastQuery == 0){
        https.get(params.req, function(data){
            var content = '';

            data.on('data', function(chunk){
                content += chunk;
            });
            data.on('end', function(){
                callback(params.res, content);
            });
        });
        lastQuery = Date.now();
    }
    else{
        if( (Date.now() - lastQuery) < LOLApi.queryRateLimit() ){
            while((Date.now() - lastQuery) < LOLApi.queryRateLimit());
            https.get(params.req, function(data){
                var content = '';

                data.on('data', function(chunk){
                    content += chunk;
                });
                data.on('end', function(){
                    callback(params.res, content);
                });
            });
            lastQuery = Date.now();
        }
    }
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
        socket.emit('message', 'getMatchesDetails');
        matchList.forEach(function(match){
            obj.getMatchDetails(queue, match, socket);
        }, this);
    });
});

server.listen(PORT);
console.log("The LOLStats server is now listening on " + os.hostname() + ":" + PORT);