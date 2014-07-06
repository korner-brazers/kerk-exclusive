var delta      = 0, //обычныя дельта
    focusDelta = 0; //обновляется если вкладка браузера в фокусе

var kerk = new function(){
    this.renderer,this.scene,this.container,this.stats,this.layers;
    
    this.objects = [];
    this.players = {};
    this.controllers  = {};
    this.myColler     = {};
    this.focusTab     = 1;
    this.cameraVForce = {};
    
    
    this.fpsPrevTime = 0;
    this.fpsFrames   = 0;
    
    /** AUTO UPDATE MODULES **/
    
    this.add = function(a){
        this.objects.push(a);
    }
    
    this.remove = function(a){
        this.objects.splice(this.objects.indexOf(a), 1);
    }
    
    this.destroy = function(){
        this.getObjects(function(a){
            a.destroy();
        })
        
        this.objects = [];
        this.players = {};
        this.controllers = {};
        
        dataCache.initGame = 0;
        
        this.domObject.hide();
    }
    
    this.getObjects = function(call){
        for(var i = 0; i < this.objects.length; i++) call(this.objects[i]);
    }
    
    this.fps = function(){
        var time = Date.now();
        
        this.fpsFrames++;
        
        if ( time > this.fpsPrevTime + 1000) {
            
            $('#fps').text(Math.round( ( this.fpsFrames  * 1000 ) / ( time - this.fpsPrevTime ) ));
            
            this.fpsFrames   = 0;
            this.fpsPrevTime = time;
        }
    }
    
    this.update = function(){
        this.getObjects(function(a){
            if(a.getDestroy) a.destroy();
            else             a.update();
        })
        
        delta      = clock.getDelta();
        focusDelta = this.focusTab ? delta : 0;
        
        this.fps();
        this.game();
    }
    
    this.render = function(){
        this.renderer.render(this.scene);
    }
    
    /** OBJECTS **/
    
    this.addObject = function(object,layer){
        if(!object.userData) object.userData = {};
        
        object.userData.layerUse = layer;
        
        if(layer){
            if(this.layers[layer]) this.layers[layer].addChild(object);
            else{
                /** Указываем на другой слой так как основного нету **/
                object.userData.layerUse = 'other';
                this.layers.other.addChild(object);
            } 
        } 
        else this.scene.addChild(object);
        
        return object;
    }
    
    this.createNullObject = function(){
        var object = new PIXI.DisplayObjectContainer();
            object.userData = {};
        
        return object;
    }
    
    this.removeObject = function(object){
        if(object.userData.layerUse){
            if(this.layers[object.userData.layerUse]) this.layers[object.userData.layerUse].removeChild(object);
        } 
        else this.scene.removeChild(object);
    }

    /** STAGE GAME **/
    
    this.createGame = function(){
        
    	this.scene = new PIXI.Stage(colorToHex('000000'));
    	
    	this.renderer = PIXI.autoDetectRenderer(settings.screen[0], settings.screen[1],null,false);
        
        this.container = document.getElementById(settings.content);
        
        this.container.appendChild(this.renderer.view);
        
        this.layers = null;
        
        /**Mouse move**/
        
        this.domObject = $('#'+settings.content);
        this.myColler  = this.myController();
        this.offsetCon = $('#Game').offset();
        
        var scope = this;
        
        $(document).on('mousemove',function(e){
            scope.myColler.mouse.x = e.pageX - scope.offsetCon.left;
            scope.myColler.mouse.y = e.pageY - scope.offsetCon.top;
            
            scope.myColler.mouse.move = 1;
        }).on('mousedown',function(e){
            if(dataCache.inGame && !dataCache.statusRoom.newgame) scope.myColler.shot = 1;
            else scope.myColler.shot = 0;
            
            if(!dataCache.inGameMenu) e.preventDefault();
        }).on('mouseup',function(){
            scope.myColler.shot = 0;
        })
        
        animate();
    }
    
    this.startGame = function(option){
        this.option = option;
        LoadMap     = LoadAllMap[option.map_id];
        
        
        $('object').remove();
        
        var scope   = this;
        
        /** Немного таймера чтобы уж точно все удалилось нахрен)) **/
        setTimeout(function(){
            /** Загрузка слоев **/
            if(scope.layers) scope.scene.removeChild(scope.layers);
        
            scope.layers = new PIXI.Layers();
            
            for(var i in LoadMap.layers) scope.layers.addLayer(i);
            
            /** Создаем дополнительные слои )) **/
            scope.layers.addLayer('other'); //слой на всякий пожарный если основного нету
            scope.layers.addLayer('lens');  //слой обьектив
            
            /** Добовляем слои в сцену **/
            scope.addObject(scope.layers)
            
            /** Загрузка игры **/
            new scope.loading(function(){
                scope.createMap();
                scope.option.load && scope.option.load();
                
                dataCache.initGame = 1;
            });
        },500)
    }
    
    this.destroyGame = function(){
        this.getObjects(function(a){
            /** Придварительно говорим что нуно удалить**/
            a.getDestroy = true;
        })
        
        dataCache.initGame = dataCache.dislocation = 0;
        
        this.players = {};
    }
    
    this.destroyMyPlayer = function(){
        if(this.players[unitid]){
            this.players[unitid].destroy();
            delete this.players[unitid];
        }
    }
    this.getMyPlayer = function(){
        if(this.players[unitid]) return this.players[unitid];
        else return {};
    }
    
    this.createSprite = function(option){
        var sprite = new PIXI.Sprite.fromImage(option.img);
            sprite.anchor.x = option.anchorX || 0.5;
            sprite.anchor.y = option.anchorY || 0.5;
        
        return this.addObject(sprite,option.layer || 'players');
    }
    
    this.createMap = function(){
        this.domObject.show();
        
        /** Обновляем soundPack так как в кеше хранится все **/
        dataCache.soundPack = {};
        
        new this.graphics();
        new this.ui();
        
        this.createZone();
    }
    
    this.createZone = function(){
        dataCache.zoneColors  = {
            ground: {},
            wall: {}
        };
                
        dataCache.zoneImgData = {};
        
        var baseWall   = converBaseToImage(dataCache.zoneLoading.wallGenerate);
        var baseGround = converBaseToImage(dataCache.zoneLoading.groundGenerate);
        
        var scope = this;
        
        /** Фиксим баг для фокса и ящи, фиг его знает, так тормозит что не успевает картинку загрузить)) **/
        setTimeout(function(){
            dataCache.zoneImgData.ground = convertImgToData(baseGround)
            dataCache.zoneImgData.wall   = convertImgToData(baseWall)
            
            scope.createColorsZone('ground');
            scope.createColorsZone('wall');
        },300)
        
        
    }
    
    this.createColorsZone = function(zone){
        if(LoadMap[zone]){
            $.each(LoadMap[zone],function(i,o){
                if(o.points.length > 2) dataCache.zoneColors[zone]['#'+hexGrb(o.color)] = i;
            })
        }
    }
    
    this.imageColor = function(x,y,img){
        var offset = (Math.round(x) - 1 + (Math.round(y) - 1) * LoadMap.w) * 4,
            rgba   = img.data[offset]+img.data[offset+1]+img.data[offset+2];
            
            return rgba;
    }
    
    this.collisionZone = function(zone,x,y){
        var data  = dataCache.zoneImgData[zone],
            color = dataCache.zoneColors[zone],
            rgba  = this.imageColor(x,y,data);
            
            if(color['#'+rgba]) return LoadMap[zone][color['#'+rgba]];
    }
    
    this.collisionMap = function(position){
        var maxWidth  = LoadMap.w-10;
        var maxHeight = LoadMap.h-10;
        
        position.x = position.x < 10 ? 10 : position.x > maxWidth ? maxWidth : position.x;
        position.y = position.y < 10 ? 10 : position.y > maxHeight ? maxHeight : position.y;
    }
    
    this.detectCollisionRadius = function(position,name,radius){
        return {
            detectBottom : kerk.collisionZone(name,position.x,position.y+radius),
            detectRight  : kerk.collisionZone(name,position.x+radius,position.y),
            detectLeft   : kerk.collisionZone(name,position.x-radius,position.y),
            detectTop    : kerk.collisionZone(name,position.x,position.y-radius)
        }
    }

    this.resizeScreen = function(){
        this.offsetCon = $('#Game').offset();
        this.renderer.resize(settings.screen[0],settings.screen[1]);
        if(LoadMap.useInMenu) this.layers.scale = {x:settings.screen[0]/LoadMap.w,y:settings.screen[1]/LoadMap.h}
    }
    
    this.game = function(){
        var coller = this.myController();
        var player = this.players[unitid];
        var newgam = dataCache.statusRoom ? dataCache.statusRoom.newgame : 0;
        
        if(player){
            coller.moveUp     = (keyboard.pressed('w')||keyboard.pressed('up')) && !newgam ? 1 : 0;
            coller.moveLeft   = (keyboard.pressed('a')||keyboard.pressed('left')) && !newgam ? 1 : 0;
            coller.moveRight  = (keyboard.pressed('d')||keyboard.pressed('right')) && !newgam ? 1 : 0;
            coller.moveBottom = (keyboard.pressed('s')||keyboard.pressed('down')) && !newgam ? 1 : 0;
            coller.jump       = keyboard.pressed('space') && !newgam ? 1 : 0;
            coller.tab        = keyboard.pressed('tab') && !newgam ? 1 : 0;
            coller.getReload  = keyboard.pressed('r') && !newgam ? 1 : 0;
            coller.screen     = settings.screen;
            
            if(keyboard.pressed('1') && dataCache.settings.selectWeapons[0]) coller.selectWeapon = 0;
            if(keyboard.pressed('2') && dataCache.settings.selectWeapons[1]) coller.selectWeapon = 1;
            if(keyboard.pressed('3') && dataCache.settings.selectWeapons[2]) coller.selectWeapon = 2;
            
            
            if(dataCache.inGame) this.cameraPoint(player.object.position.x,player.object.position.y,1);
        }
        
        if(player && !dataCache.inGame && !player.dead) this.cameraPoint(player.object.position.x,player.object.position.y,2);
        else if(!dataCache.inGame && dataCache.dislocation) this.cameraPoint(dataCache.dislocation.position.x,dataCache.dislocation.position.y,2);
        
        coller.sight.x = coller.mouse.x - coller.offsetMouse.x;
        coller.sight.y = coller.mouse.y - coller.offsetMouse.y;
            
        coller.mouse.move = 0;
    }
    
    this.cameraPoint = function(x,y,smo){
        var coller = this.myController();
        
        x = -x + (settings.screen[0] / 2);
        y = -y + (settings.screen[1] / 2);
        
        if(this.cameraVForce.force > 0){
            x -= variance(this.cameraVForce.force);
            y -= variance(this.cameraVForce.force);
            
            if(this.cameraVForce.type == 'push') this.cameraVForce.force  = 0;
            else                                 this.cameraVForce.force -= 10;
        }
        
        if(smo){
            x = smooth(coller.offsetMouse.x,x,smo,true);
            y = smooth(coller.offsetMouse.y,y,smo,true);
        }
        
        x = x > 0 ? 0 : x - settings.screen[0] < -LoadMap.w ? -LoadMap.w + settings.screen[0] : x;
        y = y > 0 ? 0 : y - settings.screen[1] < -LoadMap.h ? -LoadMap.h + settings.screen[1] : y;
        
        this.layers.position.x = x;
        this.layers.position.y = y;
        
        coller.offsetMouse = {x:x,y:y};
        
    }
    
    this.cameraPosition = function(){
        var coller = this.myController();
        
        return {
            x: Math.abs(coller.offsetMouse.x)+settings.screen[0]/2,
            y: Math.abs(coller.offsetMouse.y)+settings.screen[1]/2
        }
    }
    
    this.cameraVibration = function(a){
        var cam    = this.cameraPosition();
        var toCam  = ToPointObject(a.position,cam);
        var radius = a.radius || 50;
        var force  = a.force || 20;
        
        if(toCam < radius){
            this.cameraVForce.force = force*(1 - (toCam/radius));
            this.cameraVForce.type  = a.type || 'vibrate';
        } 
    }
    
    this.addPlayer = function(a){
        this.removePlayer(a.unitid);
        this.players[a.unitid] = new kerk.player(a);
    }
    
    this.removePlayer = function(id){
        if(this.players[id]){
            this.players[id].destroy();
            delete this.players[id];
        }
    }
    
    this.getAppgrade = function(a){
        /** Прокачка **/
        if(dataCache.statusRoom.players && dataCache.statusRoom.players[a.unitid]){
            var weaponStore = dataCache.statusRoom.players[a.unitid].weaponsStore;
            var weapon      = LoadObj.weapons[a.weapon_id];
            
            if(weaponStore[a.weapon_id] && weapon){
                
                for(var addonID in weaponStore[a.weapon_id]){
                    var addon = weapon.store[addonID];
                    
                    if(addon) a.call(addon);
                }
            }
        }
    }
    
    /** CONTROLLER **/
    
    this.setController = function(id,a){
        this.controllers[id] = a;
    }
    
    this.getController = function(id){
        if(!this.controllers[id]) this.controllers[id] = this.createController();
        
        return this.controllers[id];
    }
    
    this.myController = function(){
        return this.getController(unitid);
    }
    
    this.updateMyController = function(){
        this.myColler = this.myController();
    }
    
    this.createController = function(){
        return {
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
            offsetMouse: {
                x: 0,
                y: 0
            },
            screen: settings.screen,
            selectWeapon: 0
        }
    }
    
    /** TOOLS **/
    
    this.Fx3D = function(x,y,floor,factor){
        var coller = this.myController();
        
        var op = [Math.abs(coller.offsetMouse.x)+settings.screen[0]/2,Math.abs(coller.offsetMouse.y)+settings.screen[1]/2];
        
        var far = ToPoint(op[0],op[1],x,y),
            ang = ToAngle(op[0],op[1],x,y),
            del = far*(factor || 0.02)*(floor || 0),
            off = {
                x: x + del * Math.cos(ang),
                y: y + del * Math.sin(ang)
            };
            
        return off;
    }
    
    this.isVisible = function(x,y,w,h){
        var coller = this.myController();
    
        var wf = Math.abs(coller.offsetMouse.x)+settings.screen[0]/2,
            hf = Math.abs(coller.offsetMouse.y)+settings.screen[1]/2,
            zo = settings.screen[0] / 2,
            zh = settings.screen[1] / 2,
            lw = [wf - zo,wf + zo,hf - zh,hf + zh];
            po = [0,0],
            vi = 1;
                    
            po[0] = x < lw[0]+w ? lw[0]+w : x > lw[1]-w ? lw[1]-w : x;
            po[1] = y < lw[2]+h ? lw[2]+h : y > lw[3]-h ? lw[3]-h : y;
            
            vi = x < lw[0]+w ? 0 : x > lw[1]-w ? 0 : vi;
            vi = y < lw[2]+h ? 0 : y > lw[3]-h ? 0 : vi;
            
            return {
                position: {
                    x: po[0],
                    y: po[1]
                },
                visible: vi
            };
    }
};

function animate(){
    requestAnimationFrame(animate);
    
    kerk.render();
    kerk.update();
}

/** Detecting focus of a browser window **/

function onBlur() {
	kerk.focusTab = 0;
}
function onFocus(){
	kerk.focusTab = 1;
}

if(/*@cc_on!@*/false){ // check for Internet Explorer
	document.onfocusin  = onFocus;
	document.onfocusout = onBlur;
}else{
	window.onfocus = onFocus;
	window.onblur  = onBlur;
}