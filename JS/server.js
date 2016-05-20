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

var queue = initQueue();
var server = http.createServer();
var clients = [];
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    console.log(' - New connection from ' + socket.request.connection.remoteAddress);

    var _LOLApi = new LOLApi();
    var pausedTasks = [];

    // Save the client
    clients.push(socket.id);

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
    socket.on('pauseQueue', function(){
        if(queue.length() > 0){
            queue.pause();

            // Inverted loop to not affect the index (i) when we splice the array.
            for(var i=queue.length()-1; i >= 0; i--){
                if(queue.tasks[i].data.user == socket){
                    pausedTasks.push({"matchId" : queue.tasks[i].data.match});// Add the task into the pausedTasks array
                    queue.tasks.splice(i, 1);
                }
            }

            queue.resume();
            socket.emit('message', 'Tasks paused');
        }
        else
            socket.emit('message', 'Queue empty');
    });
    socket.on('resumeQueue', function(){
        if(pausedTasks.length > 0){
            if(queue.idle()){
                queue = initQueue();
            }

            // Inverted loop to not affect the index (i) when we splice the array.
            for(var i=pausedTasks.length-1; i >= 0; i--){
                _LOLApi.getMatchDetails(queue, pausedTasks[i], socket);
                pausedTasks.splice(i, 1);
            }

            socket.emit('message', 'Tasks resumed');
        }
        else
            socket.emit('message', 'Queue Empty');
    });
    socket.on('error', function(err){
       console.log("[ERROR] - " + err);
    });
});

server.listen(PORT);
server.on('error', function(err){
    console.log("[ERROR] - " + err);
});
console.log("The LOLStats server is now listening on " + os.hostname() + ":" + PORT);


///////
function initQueue(){
    var lastQuery = 0;
    var q = async.queue(function(params, callback){
        try{
            console.log("Simulate HTTP GET for : ",params.req);

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
    q.drain = function(){
        console.log("Queue is empty");
        initQueue();
    };

    return q;
}
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