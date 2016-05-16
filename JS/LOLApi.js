class LOLApi{
    constructor(){
        // CONSTANTS {
            this.KEY = '84437920-ce89-4491-97bd-df592330ab93';
            var QUERY_RATE_LIMIT = 500/600 * 1000 + 100; // 500 queries per 10min (600s) in ms
            this.QUERY_TIMEOUT = 60; // 60s
        // }

        // PROPERTIES {
            this.Location  = "euw";
            this.SummonerID = 0;
            this.baseUri = "https://" + this.Location + ".api.pvp.net/api/lol/" + this.Location;
            this.MatchHistoryUri = this.baseUri + "/v2.2/matchhistory/";
            this.SummonerUri = this.baseUri + "/v1.4/summoner/by-name/";
        // }
    }

    // METHODS {
        // getMatchDeatails : return info about the match passed through parameter.
        // param :
        //      queue : Async's queue to manage all the HTTP request.
        //      match : ID of the match we want details.
        getMatchDetails(queue, match, socket) {
            var me = this;
            var response = null, result = {};
            queue.push({req: "https://euw.api.pvp.net/api/lol/euw/v2.2/match/" + match.matchId + "?api_key=84437920-ce89-4491-97bd-df592330ab93",
                        res: response}, function(err, response){
                var json = JSON.parse(response);
                var matchPlayerId = null;

                if(typeof json.participantIdentities != "undefined")
                {
                    json.participantIdentities.forEach(function(item, index){
                        if(item.player.summonerId == me.SummonerID)
                            matchPlayerId = item.participantId;
                    });
                    json.participants.forEach(function(item, index){
                        if(item.participantId == matchPlayerId){
                            result["win"] = item.stats.winner;
                            result["champion"] = item.championId;
                            result["role"] = item.timeline.role;
                            result["lane"] = item.timeline.lane;
                        }
                    });

                    socket.emit('LOLApi_MatchDetails',result);
                }
            });
        };

        static queryRateLimit() { return 500/600 * 1000; }

        // GETTERS / SETTERS
        get getSummonerID(){ return this.SummonerID; }
        set setSummonerID(sumID){ this.SummonerID = sumID; }
    // }
}

module.exports = LOLApi;