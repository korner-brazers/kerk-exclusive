mp.on("connect", function(){
    dataCache.connectServer = true;
    mp.emit('user_id',user_id);
});

mp.on("disconnect", function(){
    if(dataCache.initGame) menu.toggleGame('mainMenu');
    dataCache.connectServer = false;
});

mp.on('confirmJoin',function(a){
    menu.startGame(a);
})

mp.on("selListMaps", function(j){
    menu.serverListMaps(j);
});

mp.on("unitid", function(id){
    unitid = id;
    kerk.updateMyController();
});

mp.on("chat", function(a){
    dataCache.messages.push({type:'info',unitid:a.unitid,info:a.info});
});

mp.on("joinPlayer", function(name){
    dataCache.messages.push({type:'info',info:'['+name+'] Присоединился к игре'});
});

mp.on('capturePoint',function(a){
    if(a.unitid == unitid) dataCache.messages.push({type:'score',info:a.score});
})

mp.on('addPlayer',function(a){
    kerk.addPlayer(a);
    
    if(a.unitid == unitid) menu.readyDislocation();
});

/****///UPDATE PLAYERS POSITION///****/

var statusTic = 0;

mp.on('updatePlayers',function(a){
    if(dataCache.initGame){
        for(var i in a.players){
            var player = a.players[i];
            
            if(player.ingame && kerk.players[i]){
                if(i !== unitid){
                    kerk.players[i].setPosition(player.position);
                    kerk.players[i].setController(player.controller);
                }
                else dataCache.testPing = player.testPing;
                
                if(player.dead) kerk.players[i].die();
                
                kerk.players[i].setInfo(player);
            }
        }
        
        /** вдруг чел так долго думал что на сервере его уже удалили)) **/
        if(!a.players[unitid]) menu.stopGame();
    }
    
    dataCache.statusRoom = a;
    
    /***DELAY 500ms***/
    
    if(statusTic > 17){
        menu.show_Score(a);
        
        statusTic = 0;
    } 
    else statusTic += 1;
})

mp.on('gameStatus',function(a){
    for(var i in a.players){
        if(a.players[i].ingame) kerk.addPlayer(a.players[i]);
    }
    
    dataCache.point = a.point;
})

mp.on("deadPlayer", function(a){
    if(kerk.players[a.unitid]) kerk.players[a.unitid].die();
    
    if(!a.ai) dataCache.messages.push({type:'dead',info:a.whoName+' ['+a.than+'] '+(a.deadName || 'unknown')});
    
    if(a.whom == unitid) dataCache.messages.push({type:'score',info:a.score});
    
    if(a.unitid == unitid) setTimeout(function(){
        menu.show_Dislocation();
    },3000);
});

mp.on("removePlayer", function(a){
    dataCache.messages.push({type:'info',info:'['+a.name+'] Покинул игру'});
    kerk.removePlayer(a.unitid);
});

mp.on("endGame", function(a){
    dataCache.show_EndGame = 1;
    console.log('endGame')
    //menu.endGame(a);
});

mp.on('error',function(a){
    dataCache.console.push(a);
})