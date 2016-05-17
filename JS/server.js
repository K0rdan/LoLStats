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
    console.log("Simulate HTTP GET for : ",params.req);

    try{
        if(lastQuery == 0){
            executeRequest(params, callback);
            lastQuery = Date.now();
        }
        else{
            if( (Date.now() - lastQuery) < LOLApi.queryRateLimit() ){
                while((Date.now() - lastQuery) < LOLApi.queryRateLimit());

                executeRequest(params, callback);
                lastQuery = Date.now();
            }
        }
    }
    catch(e) {
        console.log("[Error] - ",e);
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
server.on('error', function(err){
    console.log("[Error] - " + err);
});
console.log("The LOLStats server is now listening on " + os.hostname() + ":" + PORT);


///////
function executeRequest(req, params, callback){
    var options = {
        hostname: params.req,
        port: 443,
        method: 'GET'
    };


    var req = null;
    req = https.get(params.req, function(data){
        data.setEncoding('utf8');
        var content = '';

        data.on('data', function(chunk){
            content += chunk;
            clearTimeout(timeout);
            timeout = setTimeout(fn, 10000);
        }).on('end', function(){
            clearTimeout(timeout);
            callback(params.res, content);
        });
    });

    if(req != null) {
        var timeout_wrapper = function(req) {
            return function() {
                console.log("[Error] - request timeout, trying to abort... ", req);
                req.abort();
            };
        };
        var fn = timeout_wrapper(req);
        var timeout = setTimeout(fn, 10000);

        req.on('error', function(error){
            console.log("[Error] - request error : ",error.message);
        });
        req.setTimeout(10000, function(){
            console.log("[Error] - request timeout.");
        });
    }
}