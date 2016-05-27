// CONSTANTS {
const KEY = '84437920-ce89-4491-97bd-df592330ab93';
const QUERY_RATE_LIMIT = 500/600 * 1000; // 500 queries per 10min (600s) in ms
const QUERY_TIMEOUT = 60000; // 60s
// }

class LOLApi{
    constructor(){
        // PROPERTIES {
            this.Location  = "euw";
            this.SummonerID = 0;
            this.baseUri = "https://" + this.Location + ".api.pvp.net/api/lol/" + this.Location;
            this.matchUri = this.baseUri + "/v2.2/match/";
            this.MatchHistoryUri = this.baseUri + "/v2.2/matchhistory/";
            this.SummonerUri = this.baseUri + "/v1.4/summoner/by-name/";
            
            // client info
            this.socket = null;
            this.queue = null;
            this.currentMatch = null;
        // }
    }

    // METHODS {        
        // getMatchDetails : Add into the queue the match passed through parameter.
        // params :
        //      queue : Async's queue to manage all the HTTP request.
        //      match : ID of the match we want details.
        //      socket: the connection used by the client.
        getMatchDetails(queue, match, socket) {
            this.socket = socket;
            this.queue = queue;
            this.currentMatch = match;

            queue.push({req: this.matchUri + match + "?api_key=" + KEY,user: socket,match: match,ctx: this},this.matchDetails);
        };
        
        // matchDetails : return the info about a match processed by the queue.
        // params :
        //      err : Error object
        //      json: JSON object containing the result of the HTTP request proceed by the queue.
        matchDetails(err, json){
            var me = this.data.ctx;
            var matchPlayerId = null, result = {};

            if(err != null){
                console.log("[LOLAPI][ERROR] - getMatchDetails - (Obj) err - Params { matchId : '" + me.currentMatch + "' }, Message :'" + err + "'");
                me.getMatchDetails(me.queue, me.currentMatch, me.socket); // Requeue the game
            }
            else {
                if(typeof json.participantIdentities != "undefined")
                {
                    json.participantIdentities.forEach(function(item, i){
                        if(item.player.summonerId == me.SummonerID)
                            matchPlayerId = item.participantId;
                    });
                    json.participants.forEach(function(item, i){
                        if(item.participantId == matchPlayerId){
                            result["win"] = item.stats.winner;
                            result["champion"] = item.championId;
                            result["role"] = item.timeline.role;
                            result["lane"] = item.timeline.lane;
                        }
                    });

                    me.socket.emit('LOLApi_MatchDetails',result);
                }
                else {
                    console.log("[LOLAPI][ERROR] - getMatchDetails - (Obj) err - Params { matchId : '" + me.currentMatch + "' }, Message :'particpantsIdentities undefined'");
                    me.getMatchDetails(me.queue, me.currentMatch, me.socket); // Requeue the game.
                }
            }
        };

    
        static queryRateLimit() { return QUERY_RATE_LIMIT; }

        // GETTERS / SETTERS
        get getSummonerID(){ return this.SummonerID; }
        set setSummonerID(sumID){ this.SummonerID = sumID; }
    // }
}

module.exports = LOLApi;