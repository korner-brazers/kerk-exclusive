//require('look').start(3131);
/*
require('nodetime').profile({
    accountKey: '59aa0a3b8e3adc286fce8ff5683685993b0fbb7f', 
    appName: 'Node.js Application'
  });
  */
/**
 * Самое главное это гаш ключик
 * Должен быть такойже как и в access.php
 */

var accessKey = 'fgs56h9d';

/** А дальше загрузка **/

var io      = require('socket.io'),
    mysql   = require('mysql'),
    fs      = require('fs'),
    LoadObj = {},
    LoadAllMap,
    delta   = 0;
    
var db, Сanvas, app, settings, serv;

/**
 * Да чуваки, я знаю, хреново сделано
 * ну блин я не могу все знать, да потом переделаю а пока сойдет))
 */

/** FUNCTIONS **/

function getIData(base){
    var img = new Canvas.Image;
        img.src = base;

    
    var canvas = new Canvas(img.width, img.height),
        ctx    = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
    return ctx;
}

function readFileJson(file,fn,error){
    fs.readFile( __dirname +'/data/'+accessKey+'_'+file+'.data.json', function(err, data){
        if(err) error && error();
        else{
            data = data ? data : '[]';
        
            fn && fn(JSON.parse(data.toString()));
        }
    });
}

function readObjects(file){
    readFileJson(file,function(data){
        LoadObj[file] = data;
    });
}

/**
 * TWEEN FUNCTION
 * Просчет по кривой 
 */

function TweenFn(object){
    this.object  = object ? object : {};
    this.origval = this.object.values ? this.object.values : [{time:0,value:0},{time:300,value:1}];
    this.object.variance = this.object.variance || 0;
    this.values  = []
    this.timer   = 0;
    this.totalTime = (this.object.time || 1) * 1000;
    this.timeDiff  = 1;
    
    for(var i in this.origval){
        this.values[i] = {
            time: this.origval[i].time,
            value: this.random(this.origval[i].value), 
        }
    }
}
TweenFn.prototype.setTimeDiff = function(time){
    this.timeDiff = this.totalTime / time;
}
TweenFn.prototype.correctTime = function(i){
    return this.values[i].time / this.timeDiff;
}
TweenFn.prototype.random = function(value){
    var variance = Math.random() * (-this.object.variance - this.object.variance) + this.object.variance;
    var ammout   = value * variance;
    
    return value + ammout;
}
TweenFn.prototype.updateVariance = function(timeDelta){
    for(var i in this.origval) this.values[i].value = this.random(this.origval[i].value);
    
    return this.addDelta(timeDelta);
}
TweenFn.prototype.variance = function(timeDelta){
    return this.random(this.addDelta(timeDelta));
}
TweenFn.prototype.getValue = function(t){
    var i = 0;
	var n = this.values.length;
    
	while(i < n && t > this.correctTime(i)) i++;
    
    if (this.object.repeat && i == n && t > this.correctTime(n-1)) this.timer = 0;
    
	if (i == 0) return this.values[0].value;
	if (i == n)	return this.values[n-1].value;
    
	var poin = (t - this.correctTime(i-1)) / (this.correctTime(i) - this.correctTime(i-1));
	
    return this.values[i-1].value + poin * (this.values[i].value - this.values[i-1].value);
}
TweenFn.prototype.addDelta = function(timeDelta){
    return this.getValue(this.timer += 1000*timeDelta);
}
TweenFn.prototype.delta = function(){
    return this.getValue(this.timer += 1000*delta);
}
TweenFn.prototype.lerp = function(time){
    this.timer = time;
	return this.getValue(time);
}
TweenFn.prototype.reset = function(){
	this.timer = 0;
    return this;
}

/** Подключаем обьекты **/

readObjects('objects')
readObjects('weapons')
readObjects('bullet')

readFileJson('maps',function(data){
    LoadAllMap = data;
    
    /** Загружаем зоны**/
    game.loadZone();
});

var game = function(){
    this.maps     = {};
    this.total    = 0;
    this.oldTime  = new Date().getTime();
    
    /** Зоны **/
    this.DataRGB    = {};
    this.dataBase   = {};
    this.zoneColors = {};
}

var gameRoom = function(a){
    this.room_id = a.room_id,
    this.name    = a.name ? a.name.replace(/<\/?[^>]+>/gi, '') : '',
    this.map_id  = a.map_id,
    this.premium = a.premium,
    
    this.time     = new Date().getTime(), //time start room
    this.timeNow  = new Date().getTime(), //time now 
    this.timeGame = a.time,               //time in minutes
    this.timeEnd  = a.time * 1000 * 60,   //time milisec to end game
    this.nextAi   = this.time,
    this.deadTime = this.time,
    
    this.timerMp = 0,
    this.active  = 1,
    this.newgame = 0,
    this.players = {},
    this.total   = 0,
    this.totalAi = 0,
    this.lastTotal = 0,
    this.c       = 0,
    this.tic_1   = 0,
    this.tic_2   = 0,
    this.score_1 = 0,
    this.score_2 = 0,
    this.point   = {},
    this.maxPlayers = a.maxPlayers,
    this.mode    = a.mode;
    
    this.pointInit();
}

var player = function(a){
    this.ai       = a.ai;
    this.unitid   = a.unitid;
    this.user_id  = a.user_id;
    this.weaponsStore = a.weaponsStore;
    this.active   = 1;
    this.time     = new Date().getTime(),
    this.timeStart= this.time,
    this.room_id  = a.room_id;
    this.map_id   = a.map_id;
    this.ingame   = 0;
    this.kill     = 0;
    this.die      = 0;
    this.score    = 0;
    this.name     = a.name || 'unknown';
    this.position = {x:0,y:0};
    this.team     = a.team || 0;
    this.dead     = 0;
    this.testPing = 0;
    this.ping     = 0;
    this.collision  = {};
    this.controller = {
        moveUp: 0,
        moveLeft: 0,
        moveRight: 0,
        moveBottom: 0,
        tab: 0,
        jump: 0,
        shot: 0,
        sight: {
            x: 0,
            y: 0,
        },
        mouse: {
            x: 0,
            y: 0
        },
        screen: [800,500],
        selectWeapon: 0
    }
    
    this.gameObject = {};
    
    this.aiControll = {
        viewDistance: 500, //дистанция видемости
        minDistance: 50,   
        minToChange: 100,
        distance: 500,    // на сколько приблизется, менятеся
        nextActionTime: 0
    }
}

game.prototype = {
    create: function(a){
        var id = new Date().getTime()+'_map';
        
        if(LoadAllMap[a.map_id]){
            a.room_id    = id;
            a.premium    = LoadAllMap[a.map_id].premium;
            a.mode       = a.mode > 2 ? 2 : a.mode < 0 ? 0 : a.mode;
            a.maxPlayers = a.maxPlayers > LoadAllMap[a.map_id].maxPlayers ? LoadAllMap[a.map_id].maxPlayers : a.maxPlayers < 4 ? 4 : a.maxPlayers;
            a.time       = a.time < 4 ? 4 : a.time > 24 ? 24 : a.time;
            
            this.maps[id] = new gameRoom(a);
            
            return this.maps[id];
        }
    },
    addPlayer: function(a){
        this.maps[a.room_id].players[a.unitid] = new player(a);
        
        return this.maps[a.room_id].players[a.unitid];
    },
    getPlayer: function(a){
        return this.maps[a.room_id].players[a.unitid];
    },
    getPlayers: function(room_id){
        return this.maps[room_id].players;
    },
    getPoints: function(room_id){
        return this.maps[room_id].point;
    },
    maxTime: function(timeLast,maxTime){
        if(this.oldTime - timeLast >= maxTime) return this.oldTime;
    },
    collisionMap: function(room_id,position){
        var maxWidth  = LoadAllMap[this.maps[room_id].map_id].w;
        var maxHeight = LoadAllMap[this.maps[room_id].map_id].h;
        
        position.x = position.x < 0 ? 0 : position.x > maxWidth ? maxWidth : position.x;
        position.y = position.y < 0 ? 0 : position.y > maxHeight ? maxHeight : position.y;
    },
    update: function(){
        this.total = 0;
        var newTime = new Date().getTime();

        delta        = 0.001 * ( newTime - this.oldTime );
        this.oldTime = newTime;
        
        for(var i in this.maps) {
            var mp = this.maps[i];
            
            if(mp.active) mp.update(),this.total += 1;
            else this.destroy(i);
        }
    },
    destroy: function(room_id){
        delete this.maps[room_id];
    },
    outGame: function(a){
        app.sockets.to(a.room_id).emit('outPlayer',a.unitid);
        
        if(this.maps[a.room_id] && this.maps[a.room_id].players[a.unitid]){
            if(!this.maps[a.room_id].newgame) this.maps[a.room_id].players[a.unitid].saveScore();
            this.maps[a.room_id].destroyPlayer(a.unitid);
        }
        
    },
    getListMaps: function(){
        return this.maps;
    },
    collisionZone: function(room_id,name,x,y){
        
        var map_id = this.maps[room_id].map_id;
        
        if(this.DataRGB[map_id] && this.DataRGB[map_id][name]){
            try{
                return this.DataRGB[map_id][name].getImageData(Math.round(x),Math.round(y),1,1).data[0];
            }
            catch(e){
                console.error("Error: " + e + "."+e.stack);
            }
        }
        
    },
    zoneBase: function(id){
        /** Пустой бейсик 100px на 100px если вдруг не сгенерирована карта **/
        var base = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABZUlEQVR4Xu3TQREAAAiEQK9/aWvsAxMw4O06ysAommCuINgTFKQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LQQL8oTPAGUY76lBAAAAAElFTkSuQmCC';
        
        this.dataBase[id] = {
            wallGenerate: base,
            groundGenerate: base,
        }
        
        var scope = this;
        
        fs.readFile( __dirname +'/data/map/zone/'+id+'.base', function(err, data){
            if(!err){
                data = data ? data : '[]';
                
                scope.dataBase[id] = JSON.parse(data.toString());
                
                try{
                    scope.DataRGB[id] = {
                        wall: getIData(scope.dataBase[id].wallGenerate),
                        ground: getIData(scope.dataBase[id].groundGenerate)
                    }

                }
                catch(e){
                    console.error('   warn  - Не удалось сгенерировать зоны, модуль (canvas) не установлен')
                    console.error("Error: " + e + "."+e.stack);
                }
            }
        });
    },
    loadZone: function(){
        /** Загрузка зон **/
        for(var i in LoadAllMap) this.zoneBase(i);
    },
    randomObjectSelect: function(object){
        var items = [];
        
        for(var i in object) items.push(i);
        
        return items[Math.floor(Math.random()*items.length)];
    }
}

gameRoom.prototype = {
    //** Capture Point Init **/
    
    pointInit: function(){
        var point = LoadAllMap[this.map_id].point;
        
        for(var i in point){
            var po = point[i];
            
            this.point[i] = {
                position: {
                    x: po.x,
                    y: po.y
                },
                capture: 0,
                isCapture: po.capture,
                team: 0
            }
        }
    },
    
    //** Check end game and restart game **/
    
    endGame: function(){
        if(!this.newgame && (this.timeNow - this.time >= /*50000*/this.timeEnd)){
            this.newgame = 1;
            this.time    = this.timeNow;
            this.saveResult();
            app.sockets.to(this.room_id).emit('endGame',this.score_1 > this.score_2 ? 1 : 2);
        }
        
        if(this.newgame && this.timeNow - this.time >= 15000){
            this.newgame = 0;
            this.clear();
        }
    },
    update: function(id){
        this.endGame();
        
        this.timeNow = new Date().getTime();
        
        /****SET EMIT UPDATE PLAYERS POSITION****/
        
        if(this.timerMp > 1){
            var getPlayer = {};
            
            for(var i in this.players){
                var player = this.players[i];
                
                getPlayer[i] = {
                    ai: player.ai,
                    unitid: player.unitid,
                    user_id: player.user_id,
                    weaponsStore: player.weaponsStore,
                    
                    ping: player.ping,
                    testPing: player.testPing,
                    life: player.life,
                    ingame: player.ingame,
                    kill: player.kill,
                    die: player.die,
                    score: player.score,
                    name: player.name,
                    position: player.position,
                    team: player.team,
                    dead: player.dead,
                    controller: player.controller
                }
            }
            
            
            app.sockets.to(this.room_id).emit('updatePlayers',{
                players: getPlayer,
                name: this.name,
                newgame: this.newgame,
                tic_1: this.tic_1,
                tic_2: this.tic_2,
                score_1: this.score_1,
                score_2: this.score_2,
                point: this.point,
                mode: this.mode,
                time: this.time,
                timeNow: this.timeNow,
                timeGame: this.timeGame,
                timeEnd: this.timeEnd,
                map_id: this.map_id,
                room_id: this.room_id
            });
            
            this.timerMp = 0;
        }
        else this.timerMp++;
        
        for(var i in this.players){
            if(this.players[i].active){
                if(!this.players[i].ai) this.total++;
                else this.totalAi++;
                
                this.players[i].update();
            } 
            else this.destroyPlayer(i);
        }
        
        this.lastTotal = this.total;
        
        if(this.total == 0 && this.timeNow - this.time > 60000) this.active = 0;
        else{
            if(this.total+this.totalAi < this.maxPlayers && this.timeNow - this.nextAi > 5000){
                this.nextAi = this.timeNow;
                
                var id = new Date().getTime()+'_ai',
                    weaponsStore = {};
                
                for(var w in LoadObj.weapons) weaponsStore[w] = 1;
                
                game.addPlayer({
                    unitid: id,
                    room_id: this.room_id,
                    ai: true,
                    weaponsStore: weaponsStore,
                });
            }
        }
        
        this.total = this.totalAi = 0;
    },
    
    //** Destroy Player **/
    
    destroyPlayer: function(unitid){
        var player = this.players[unitid];
        
        if(player.capture){
            this.point[player.capture].capture = 0;
            
            app.sockets.to(this.room_id).emit('stopCapturePoint',{
                id: player.capture,
                unitid: unitid
            });
        } 
        
        delete this.players[unitid];
    },
    
    //** Clear map status **/
    
    clear: function(){
        this.tic_1 = 0,
        this.tic_2 = 0,
        this.score_1 = 0,
        this.score_2 = 0,
        this.point   = {};
        
        for(var i in this.players) this.players[i].clearScore();
        
        this.pointInit();
    },
    
    //** Save result players **/
    
    saveResult: function(){
        for(var i in this.players) this.players[i].saveScore();
    }
}

player.prototype = {
    ToPoint: function(x,y,x2,y2){
        return Math.sqrt(Math.pow(x-x2,2) + Math.pow(y-y2,2))
    },
    ToAngle: function(x,y,x2,y2){
        return Math.atan2(y2 - y,x2 - x);
    },
    OffsetPoint: function(x,y,a,offsetX,offsetY){
        return {
            x: x + Math.cos(a)*offsetX - Math.sin(a)*offsetY,
            y: y + Math.sin(a)*offsetX + Math.cos(a)*offsetY
        };
    },
    smooth: function(a,b,s){
        return a + ((b - a) * (s*delta));
    },
    calculateAngle: function(ang,cor,vec){
        var cof = ang - cor,
            ger = 0;
    
        if(cof > Math.PI)  cof -= 2 * Math.PI;
        if(cof <- Math.PI) cof += 2 * Math.PI;
        
        if(cof > vec) ger=+vec;
        else if(cof <- vec) ger=-vec;
        else ger = ang - cor;
        
        return ang - ger; 
    },
    getMapID: function(){
        return game.maps[this.room_id].map_id;
    },
    collisionObject: function(){
        this.collision.bottom = game.collisionZone(this.room_id,'wall',this.position.x,this.position.y);
        this.collision.top    = game.collisionZone(this.room_id,'wall',this.position.x,this.position.y - this.gameObject.boxCollisionHeight);
        this.collision.left   = game.collisionZone(this.room_id,'wall',this.position.x - (this.gameObject.boxCollisionWidth/2),this.position.y-(this.gameObject.boxCollisionHeight/2));
        this.collision.right  = game.collisionZone(this.room_id,'wall',this.position.x + (this.gameObject.boxCollisionWidth/2),this.position.y-(this.gameObject.boxCollisionHeight/2));
    },
    getAiControll: function(){
        var maps = LoadAllMap[this.getMapID()];
        
        if(maps.ai){
            for(var i in maps.ai){
                var rec = maps.ai[i];
                
                var detect = this.intersectRect({
                    left: this.position.x - (this.gameObject.boxCollisionWidth/2),
                    top: this.position.y - this.gameObject.boxCollisionHeight,
                    right:  this.position.x + (this.gameObject.boxCollisionWidth/2),
                    bottom: this.position.y
                },
                {
                    left: rec.x - rec.w/2,
                    top: rec.y - rec.h/2,
                    right: rec.x + rec.w/2,
                    bottom: rec.y + rec.h/2,
                })
                
                if(detect){
                    return rec;
                    break;
                }
            }
        }
    },
    update: function(){
        
        /** Дислокация AI **/
        if(this.ai && ((this.dead && game.maxTime(this.deadTime,3000)) || !this.ingame)){
            this.dislocation({
                point: game.randomObjectSelect(LoadAllMap[this.getMapID()].point),
                weapons: [game.randomObjectSelect(LoadObj.weapons)],
                player_id: settings.main.playerDefault
            });
            
            app.sockets.to(this.room_id).emit('addPlayer',this);
        }
        
        if(!this.ingame && new Date().getTime() - this.time > 240000) this.active = 0;
        
        this.collisionObject();
        
        var gravitation = settings.main.gravitation;
            
        if(!this.collision.bottom) this.position.y += gravitation; // на время теста пока отключим гравитацию
        
        if(this.ingame){
            
            /** Если это наш AI **/
            if(this.ai){
                
                /**Проверка а не много ли у нас ботов **/
                
                var room = game.maps[this.room_id];
                
                if(room.lastTotal+room.totalAi > room.maxPlayers){
                    app.sockets.to(this.room_id).emit('removePlayer', {unitid:this.unitid,name:this.name});
                    
                    game.outGame({
                        unitid: this.unitid,
                        room_id: this.room_id
                    });
                }
                
                var findPlayers  = game.maps[this.room_id].players;
                var minDistance  = this.aiControll.viewDistance,
                    targetPl     = false;
                
                for(var i in findPlayers){
                    var player = findPlayers[i];
                    
                    if(!player.ai && !player.dead && player.ingame){
                        var distance = this.ToPoint(this.position.x,this.position.y,player.position.x,player.position.y);
                            
                        if(distance < minDistance){
                            minDistance = distance;
                            targetPl    = player;
                        }
                    }
                }
                
                /** Если засекли цель **/
                if(targetPl){
                    var toPlayer = Math.abs(targetPl.position.x - this.position.x);
                    
                    /** Если мы на позиции то меняем на новою **/
                    if(toPlayer+10 > this.aiControll.distance && toPlayer-10 < this.aiControll.distance){
                        this.aiControll.distance = Math.floor(Math.random() * this.aiControll.viewDistance);
                        this.aiControll.distance = this.aiControll.distance < this.aiControll.minToChange ? this.aiControll.minToChange : this.aiControll.distance;
                    } 
                    
                    if(toPlayer > this.aiControll.minDistance){
                        this.direction = targetPl.position.x > this.position.x ? 2 : 1;
                        this.direction = this.direction == 2 && toPlayer > this.aiControll.distance ? 2 : toPlayer > this.aiControll.distance ? 1 : 0;
                    }
                    else this.direction = 0;
                    
                    this.controller.sight.x = this.smooth(this.controller.sight.x,targetPl.position.x,3);
                    this.controller.sight.y = this.smooth(this.controller.sight.y,targetPl.position.y-(targetPl.gameObject.boxCollisionHeight/2),3);
                    
                    this.controller.shot = 1;
                }
                else if(!this.direction) this.direction = Math.round(Math.random() * 1) + 1;
                else{
                    var checkTime = game.maxTime(this.aiControll.nextActionTime,3000);
                    
                    if(checkTime){
                        this.aiControll.nextActionTime = checkTime;
                        
                        var changeDirection = Math.round(Math.random() * 1);
                        
                        this.direction = changeDirection ? (this.direction == 2 ? 1 : 2) : this.direction;
                    }
                    
                    this.controller.sight.x = this.smooth(this.controller.sight.x,this.direction == 2 ? this.position.x + 100 : this.position.x - 100,3);
                    this.controller.sight.y = this.smooth(this.controller.sight.y,this.position.y-(this.gameObject.boxCollisionHeight/2),3);
                    
                    this.controller.shot = 0;
                }
                
                this.controller.moveRight = this.controller.moveLeft = this.controller.moveUp = 0;
                
                /** Детектор на движение и прыжки **/
                var detectControll = this.getAiControll();
                
                if(detectControll){
                    this.direction = detectControll.playerMoveLeft ? 1 : detectControll.playerMoveRight ? 2 : this.direction;
                    
                    if(detectControll.playerJump) this.controller.moveUp = 1;
                }
                
                if(this.direction){
                    if(this.direction == 2) this.controller.moveRight = 1;
                    else this.controller.moveLeft = 1;
                }
            }
            
            if(this.dead || game.maps[this.room_id].newgame) this.controller.moveUp = this.controller.moveLeft = this.controller.moveRight = this.controller.shot = 0;
            
            if(this.controller.moveUp && this.collision.bottom && !this.jump){
                this.jump = true;
                this.jumpTween.reset();
            }
            else if(this.jumpTween.totalTime > this.jumpTween.timer && this.jump && !this.collision.bottom){
                var jumpImpulse = this.jumpTween.delta();
                
                if(!this.collision.top) this.position.y -= jumpImpulse*delta;
            }
            else if(this.collision.bottom){
                this.jump = false;
            }
            
            var speed = this.gameObject.speed * delta;
            
            if(this.controller.moveLeft && !this.collision.left)   this.position.x -= speed;
            if(this.controller.moveRight && !this.collision.right) this.position.x += speed;
            
            this.capturePoint();

            this.life += this.life >= this.maxLife ? 0 : this.maxLife*0.0006;
        }
        
        if(this.collision.left)  this.position.x += speed;
        if(this.collision.right) this.position.x -= speed;
        
        if(this.collision.bottom) this.position.y -= gravitation; 
        
        game.collisionMap(this.room_id,this.position);
        
    },
    capturePoint: function(){
        if(game.maps[this.room_id].mode == 2){
            var point = game.maps[this.room_id].point;
            
            for(var i in point){
                if(!point[i].isCapture) continue;
                
                var po  = point[i],
                    dis = this.ToPoint(po.position.x,po.position.y,this.position.x,this.position.y);
                
                if(po.team !== this.team && !po.capture && dis <= 150){
                    po.capture = this.unitid,this.capture = i,this.captureTime = new Date().getTime();
                } 
                
                if(po.capture == this.unitid){
                    if(dis > 150){
                        this.captureTime = this.capture = po.capture = 0;
                    }
                }
                
                if(po.capture == this.unitid && new Date().getTime() - this.captureTime > 8000){
                    if(dis <= 150){
                        
                        app.sockets.to(this.room_id).emit('capturePoint',{
                            id: i,
                            unitid: this.unitid,
                            team: this.team,
                            score: 1000
                        });
                        
                        this.addScore(1000);
                        po.team = this.team;
                    } 
    
                    this.captureTime = this.capture = po.capture = 0;
                }
            }
        }
    },
    addScore: function(s){
        this.score += s;
        
        if(this.team > 1){
            game.maps[this.room_id].score_2 += s;
            game.maps[this.room_id].tic_2   += 1;
        } 
        else{
            game.maps[this.room_id].score_1 += s;
            game.maps[this.room_id].tic_1   += 1;
        } 
    },
    ToPointDetect: function(x,y,w,h,dotX,dotY){
        if(dotX > x && dotX < x+w && dotY > y && dotY < y+h) return true;
    },
    intersectRect: function(r1, r2){
        return !(r2.left > r1.right || 
               r2.right < r1.left || 
               r2.top > r1.bottom ||
               r2.bottom < r1.top);
    },
    detectDestruction: function(a){
        for(var i in game.maps[this.room_id].players){
            a.destruction = i;
            this.hitObject(a);
        }
    },
    hitObject: function(a){
        var player = game.getPlayer({
            unitid: a.destruction || a.unitid,
            room_id: this.room_id
        });
        
        var mode = game.maps[this.room_id].mode;
        
        var weapon = LoadObj.weapons[a.weapon],
            bullet = LoadObj.bullet[weapon.bullet];
        
        
        if(player && bullet){
            if(player.dead || (mode > 0 && !a.ai && this.team == player.team) || (a.ai && player.ai)) return;
            
            var detect;
            
            if(a.destruction){
                var distance = this.ToPoint(a.position.x,a.position.y,player.position.x,player.position.y);
                
                if(distance < bullet.radiusDestruction) detect = true;
            }
            else{
                var boxTo2 = bullet.boxCollision/2;
            
                detect = this.intersectRect({
                    left: a.position.x - boxTo2,
                    top: a.position.y - boxTo2,
                    right: a.position.x + boxTo2,
                    bottom: a.position.y + boxTo2,
                },
                {
                    left: player.position.x - (player.gameObject.boxCollisionWidth/2),
                    top: player.position.y - player.gameObject.boxCollisionHeight,
                    right:  player.position.x + (player.gameObject.boxCollisionWidth/2),
                    bottom: player.position.y
                })
            }
            
        
            if(detect){
                player.life -= bullet.stepDegree;
                player.life  = player.life <= 0 ? 0 : player.life;
                
                if(player.life <= 0){
                    player.dead = true;
                    player.deadTime = new Date().getTime();
                    
                    app.sockets.to(this.room_id).emit('deadPlayer',{
                        unitid: a.destruction || a.unitid,
                        deadName: player.name,
                        whoName: this.name,
                        whom: this.unitid,
                        than: weapon.name,
                        score: 100,
                        ai: a.ai
                    });
                    
                    if(!a.ai){
                        this.addScore(100);
                        this.kill  += 1;
                    }
                    
                    player.die += 1;
                }
            }
        }
    },
    saveScore: function(){
        if(this.ai) return;
        
        /** Наши деньжата **/
        var money = this.kill * 0.1;
        /** Считаем время в игре **/
        var timeInGame = new Date().getTime() - this.timeStart;
        /** Обновляем счетчик **/
        this.timeStart = new Date().getTime();
        
        db.query('UPDATE users SET `score` = `score`+'+this.score+',`kill` = `kill`+'+this.kill+',`die` = `die`+'+this.die+',`money` = `money`+'+money+',`earnedMoney` = `earnedMoney`+'+money+',`inGameTime` = `inGameTime`+'+timeInGame+' WHERE id='+this.user_id);
    },
    clearScore: function(){
        this.kill    = 0;
        this.die     = 0;
        this.score   = 0;
    },
    dislocation: function(a,callback){
        var confirm = false,
            map     = LoadAllMap[this.getMapID()];
        
        this.time       = new Date().getTime();
        
        if(map.point[a.point]){
            this.position = {
                x: map.point[a.point].x,
                y: map.point[a.point].y
            };
            
            confirm = true;
        }
        
        /** убедимся что нам не суют левые пушки **/
        var checkWeapons = [];
        
        for(var i in a.weapons){
            var id = a.weapons[i];
            
            if(LoadObj.weapons[id] && (this.weaponsStore[id] || settings.main.weaponDefault == id)) checkWeapons.push(id);
        }
        
        this.weapons    = checkWeapons;
        
        this.player_id  = a.player_id;
        this.gameObject = LoadObj.objects[a.player_id];
        
        this.life       = this.gameObject.health;
        this.maxLife    = this.gameObject.health;
        this.dead       = 0;
        
        this.jumpTween = new TweenFn(this.gameObject.jump);
        this.jump      = false;
        
        if(confirm && callback) callback();
        
        if(confirm) this.ingame = 1;
    }
}

/** START GAME **/

var game = new game();

setInterval(function(){
    game.update();
},1000/60);

/** START SOCKET **/

function handler (req, res) {
    res.writeHead(200);
    res.end("Welcom to server\n");
}

readFileJson('settings',function(data){
    
    settings = data;
    
    var server = settings.server.localOn ? settings.server.local : settings.server.node;
    
    try {
        Canvas = require('canvas');
    }
    catch(e) {
        console.error('   warn  - Не удалось запусить модуль (сanvas)')
    }
    
    db = mysql.createConnection({
       database : server.dbname,
       user     : server.dbuser,
       password : server.dbpassword,
       host: server.dbhost,
       port: server.dbport || false
    });
    
    
    if(settings.server.localOn) app = io.listen(parseInt(server.port));
    else{
        var options = {
            key: fs.readFileSync('/etc/nginx/ssl/game_sl-cms_com.rsa'),
            cert: fs.readFileSync('/etc/nginx/ssl/game_sl-cms_com.crt'),
            ca: fs.readFileSync('/etc/nginx/ssl/game_sl-cms_com.crt')
        };
    
        var serv = require('https').createServer(options, handler);
            app  = io.listen(serv);
        
        serv.listen(parseInt(server.port));
    }


    app.configure(function(){
    	app.set("transports", ["websocket"]);
    	app.set("log level", 2);
    });
    
    app.sockets.on('connection', function(so){
        var room_id = 0;
        var unitid  = so.store.id;
        var player  = {};
        
        so.emit('unitid',unitid);
        
        var joinInGame = function(a){
            if(!a || !game.maps[a.room_id]) return so.emit('error','Не правильное значение');
            
            db.query('SELECT * FROM users WHERE id='+Math.round(a.user_id),function(er,data){
                if(!er){
                    var profile = data[0];
                    var name    = profile.nikname == '' ? 'unknown' : profile.nikname;
                    
                    room_id = a.room_id;
        
                    so.join(room_id);
                    
                    /** парсим JSON строки **/
                    try{
                        profile.weapons = JSON.parse(profile.weapons);
                    }
                    catch(e){
                        profile.weapons = [];
                    }
                    
                    player = game.addPlayer({
                        unitid: unitid,
                        room_id: room_id,
                        user_id: Math.floor(a.user_id),
                        name: name,
                        weaponsStore: profile.weapons
                    });
                    
                    so.broadcast.to(room_id).emit('joinPlayer',player.name);

                    so.emit('confirmJoin',{
                        room_id: room_id,
                        room: game.maps[room_id]
                    });
                    
                }
                else so.emit('error','Игрок не найден в базе');
            });
        }
        
        
        so.on('join', function(a){
            joinInGame(a);
        })
        
        so.on('addPlayer',function(a){
            try {
                a.unitid = unitid;
                player.dislocation(a,function(){
                    app.sockets.to(room_id).emit('addPlayer',player);
                });
            }
            catch(e) {
                so.emit('error',"Error: " + e + "."+e.stack);
            }
        })
        
        so.on('gelListMaps',function(){
            so.emit('selListMaps',game.getListMaps());
        })
        
        so.on('message',function(json){
            try {
                var a = JSON.parse(json);
                
                player.controller = a.controller;
                player.position   = a.position;
                player.testPing   = a.testPing;
                player.ping       = a.ping;
            }    
            catch(e) {
                so.emit('error',"Error: " + e + "."+e.stack);
            }
        })
        
        so.on('selectTeam',function(team,call){
            try {
                player.team = team > 2 ? 2 : team < 1 ? 1 : team;
                call();
            }
            catch(e) {
                so.emit('error',"Error: " + e + "."+e.stack);
            }
        })
        
        so.on('gameStatus',function(){
            try {
                so.emit('gameStatus',{
                    players: game.getPlayers(room_id),
                    point  : game.getPoints(room_id),
                })
            }
            catch(e) {
                so.emit('error',"Error: " + e + "."+e.stack);
            }
        })
        
        so.on('createGame',function(a){
            try {
                var map = game.create(a);
                
                joinInGame({
                    room_id: map.room_id,
                    name: a.name,
                    user_id: a.user_id,
                    weapons: a.weapons
                })
            }
            catch(e) {
                so.emit('error',"Error: " + e + "."+e.stack);
            }
        })
        
    
        so.on('chat', function (info){
            if(game.maps[room_id] && info && typeof info == 'string') so.broadcast.to(room_id).emit('chat',{
                unitid: unitid,
                info: info.replace(/<\/?[^>]+>/gi, '')
            });
        })
        
        so.on('hitObject',function(a){
            try{
                player.hitObject(a);
            }
            catch(e){
                so.emit('error',"Error: " + e + "."+e.stack);
            }
        })
        
        so.on('detectDestruction',function(a){
            try{
                player.detectDestruction(a);
            }
            catch(e){
                so.emit('error',"Error: " + e + "."+e.stack);
            }
        })
        
        so.on('disconnect', function (){
            so.leave(room_id);
            
            if(room_id) so.broadcast.to(room_id).emit('removePlayer', {unitid:unitid,name:player.name});
            
            game.outGame({
                unitid: unitid,
                room_id: room_id
            });
            
            room_id = 0;
        })
        
        so.on('outgame', function (confirm){
            so.leave(room_id);
            
            if(room_id) so.broadcast.to(room_id).emit('removePlayer', {unitid:unitid,name:player.name});
            
            game.outGame({
                unitid: unitid,
                room_id: room_id
            });
            
            room_id = 0;
            
            if(confirm) confirm();
        })
    })
});