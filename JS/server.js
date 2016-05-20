// INCLUDES {
    // MODULES
    var os = require('os');
    var http = require('http');
    var https = require('https');
    var url = require('url');
    var fs = require('fs')
    var async = require('async');
    //var request = require('request');

    // CUSTOM FILES
    var LOLApi = require('./LOLApi.js');
// }

const PORT = 8080;

var lastQuery = 0;
var queue = async.queue(function(params, callback){
    //console.log("Simulate HTTP GET for : ",params.req);

    try{
        if(lastQuery == 0){
            executeRequest(params, callback);
            lastQuery = Date.now();
        }
        else{
            if( (Date.now() - lastQuery) < LOLApi.queryRateLimit() ){
                while((Date.now() - lastQuery) < LOLApi.queryRateLimit());
                //console.log((Date.now() - lastQuery) + "ms awaited");
                executeRequest(params, callback);
                lastQuery = Date.now();
            }
        }
    }
    catch(e) {
        console.log("[ERROR] - ",e);
    }
});
queue.drain = function(){
    console.log("Queue is empty");
}

var server = http.createServer();
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    console.log(' - New connection from ' + socket.request.connection.remoteAddress);

    var _LOLApi = new LOLApi();

    socket.emit('message', 'connected');
    socket.on('setSummonerID', function(summonerID){
        var ID = parseInt(summonerID) || 0;
        if(ID != 0)
            _LOLApi.setSummonerID = summonerID;
        else
            socket.emit('message', '[ERROR] SummonerID invalid : ' + summonerID);
    });
    socket.on('getMatchesDetails', function(matchList){
        socket.emit('message', 'getMatchesDetails');
        matchList.forEach(function(match){
            _LOLApi.getMatchDetails(queue, match, socket);
        }, this);
    });
});

server.listen(PORT);
server.on('error', function(err){
    console.log("[ERROR] - " + err);
});
console.log("The LOLStats server is now listening on " + os.hostname() + ":" + PORT);


///////
function executeRequest(params, callback){
    var jsonObj = '';
    var parsedUrl = url.parse(params.req);
    var options = {
        host: parsedUrl.host,
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var req = null;
    req = https.request(options, function(response){
        response.on('data', function(chunk){
            jsonObj += chunk;
        }).on('end', function(){
            if (response.statusCode === 204) {
                callback(null, null);
            }

            try {
                jsonObj = JSON.parse(jsonObj);
            } catch (e) {
                callback(response.statusCode);
                return;
            }

            if (jsonObj.status && jsonObj.status.message !== 200) {
                callback(jsonObj.status.status_code + ' ' + jsonObj.status.message, null);
            } else {
                callback(null, jsonObj);
            }
        }).on('error', function (error) {
            console.log("[ERROR] - executeRequest - (Obj) Response : " + error);
            callback(error, null);
        });
    }).on('error', function(error){
        console.log("[ERROR] - executeRequest - (Obj) Request : " + error);
        // callback(error); // TODO : Errors not handled in LOLApi
    });

    req.end();
}