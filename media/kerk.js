/**
 * Kerk JavaScript Framework v1.1.4
 * Copyright (C) 2013, by Korner Brazers
 * http://vk.com/korner_brazers
 * This code is copyrighted
 */

/**3d vars**/   
var renderer,scene,container,delta,stats,layers;
    
var kerk = new function() {
    
    /**data vars**/
    
    this.objects = [];
    this.players = {};
    this.option  = {};
    
    /**init vars**/
    
	scene = new PIXI.Stage(colorToHex('EFEFEF'));
	
	renderer = PIXI.autoDetectRenderer(settings.screen[0], settings.screen[1],null,false);
    
    container = document.getElementById(settings.content);
    
    container.appendChild(renderer.view);
    
    layers = new PIXI.Layers("ground", "graphics" , "fx" ,"display", "ui");
    
    addObject(layers)
 
    
    /**Mouse move**/
    
    var domObject  = $('#'+settings.content);
    var controller = app.getController(unitid);
    
    domObject.on('mousemove',function(e){
        controller.mouse.x = e.offsetX;
        controller.mouse.y = e.offsetY;
        controller.mouse.move = 1;
    }).on('mousedown',function(e){
        controller.shot = 1;
        e.preventDefault();
    }).on('mouseup',function(){
        controller.shot = 0;
    })

    
    // STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
    
    
    /***METHODS***/
    
    this.start = function(option){
        
        kerk.option = option;
        
        LoadMap = LoadAllMap[option.map_id];
        
        /**loading**/
        
        kerk.loading({
            done: function(){
                kerk.create();
                kerk.option.load && kerk.option.load();
                dataCache.initGame = 1;
                
                animate();
            }
        });
    }
    
    this.render = function(){
        renderer.render(scene);
    }
    
    this.update = function(){
        delta = clock.getDelta();
        stats.update();
        app.update();
        this.game();
    }
    
    this.create = function(){
        domObject.show();
        
        new app.graphics();
        
        this.createZone();
        //$.each(LoadAllMap[kerk.option.map_id].objects,function(i,o){
		    //kerk.createObject(i);
		//})
    }
    
    this.destroy = function(){
        for(var i = 0; i < this.objects.length; i++) scene.remove(this.objects[i]);
        for(var i = 0; i < this.light.length; i++) scene.remove(this.light[i]);
        
        this.objects = [];
        this.players = {};
        
        dataCache.initGame = 0;
        
        domObject.hide();
    }

    this.loading = function(op){
        var op = $.extend({
            step: 0,
        },op),a,i = 0,m;
        
        op.step++;
        
        if(!dataCache.loadingAssets) dataCache.loadingAssets = [];
        
        switch (op.step){ 
            
            /*
            case 1: 
                /***LOADING DEFAULT IMAGES***/
                /*
                a = restore_in_a(Images);
                
                stepLoad(a,function(i,next){
                    op.progress(op.step,i,a.length);
                    loadImg(Images[a[i]],false,function(imgObj,w,h){
                        next && next();
                    })
                },function(){
                    kerk.loading(op);
                })
                
        	break;
            */
            
            case 1: 
                /***PARSE ALL IMAGES***/
                
                if(LoadMap.bgUrls){
                    for(var i = 0; i < LoadMap.bgUrls.length; i++) dataCache.loadingAssets.push(LoadMap.bgUrls[i][0]);
                }
                
                for(var i in LoadObj.sprite){
                    for(var s = LoadObj.sprite[i].frames.length;s--;) dataCache.loadingAssets.push(LoadObj.sprite[i].frames[s]);
                } 
                
                if(LoadMap.object3D){
                    for(var i in LoadMap.object3D){
                        var map = LoadMap.object3D[i],
                            obj = LoadObj.object3D[map.object];
                        
                        if(obj){
                            for(var f = 0; f < obj.frames.length; f++)  dataCache.loadingAssets.push(obj.frames[f].img);
                        }
                    }
                }
                
                for(var i in LoadMap.graphics) dataCache.loadingAssets.push(LoadMap.graphics[i].src);
                
                kerk.loading(op);
        	break;
            
            case 2:
                var loader = new PIXI.AssetLoader(dataCache.loadingAssets);
                
                loader.onProgress = function(){
                    console.log('loader',loader.loadCount)
                }
                
                loader.onComplete = function(){
                    kerk.loading(op);
                }
                
                loader.load()
            break;

            
            default: op.done && op.done();
        }
    }
     
    this.createZone = function(){
        dataCache.zoneColors  = {
            ground: {},
            wall: {}
        };
        dataCache.zoneImgData = {};
        
        console.log(LoadMap.groundGenerate,LoadMap.wallGenerate)
        
        dataCache.zoneImgData.ground = convertImgToData(converBaseToImage(LoadMap.groundGenerate))
        dataCache.zoneImgData.wall   = convertImgToData(converBaseToImage(LoadMap.wallGenerate))
        
        console.log(dataCache.zoneImgData)
        
        this.createColorsZone('ground');
        this.createColorsZone('wall');
    }
    
    this.createColorsZone = function(zone){
        if(LoadMap[zone]){
            $.each(LoadMap[zone],function(i,o){
                if(o.points.length > 2) dataCache.zoneColors[zone]['color'+hexGrb(o.color)] = i;
            })
        }
    }
    
    this.imageColor = function(x,y,img){
        var offset = (Math.round(x) - 1 + (Math.round(y) - 1) * LoadMap.w) * 4,
            rgba   = img.data[offset]+img.data[offset+1]+img.data[offset+2];
            
            return rgba;
    }
    
    this.collisionZone = function(zone,x,y){
        var zone  = dataCache.zoneImgData[zone],
            color = dataCache.zoneColors[zone],
            rgba  = this.imageColor(x,y,zone);
            
            if(color['color'+rgba]) return LoadMap[zone][color['color'+rgba]];
    }

    this.resizeScreen = function(){
        
    }
    
    this.game = function(){
        var coller = app.getController(unitid);
        var player = this.players[unitid];
        
        if(player){
            coller.moveUp = keyboard.pressed('w') ? 1 : 0;
            coller.moveLeft = keyboard.pressed('a') ? 1 : 0;
            coller.moveRight = keyboard.pressed('d') ? 1 : 0;
            coller.moveBottom = keyboard.pressed('s') ? 1 : 0;
            coller.jump = keyboard.pressed('space') ? 1 : 0;
            coller.screen = settings.screen;
            
            app.setController(unitid,coller);
            
            if(dataCache.inGame) kerk.showPoint(player.object.position.x,player.object.position.y,1);
        }
        
        coller.mouse.move = 0;
    }
    
    this.showPoint = function(x,y,smo){
        var coller = app.getController(unitid);
        
        x = -x + (settings.screen[0] / 2);
        y = -y + (settings.screen[1] / 2);
        
        if(smo){
            x = smooth(coller.offsetMouse.x,x,smo);
            y = smooth(coller.offsetMouse.y,y,smo);
        }
        
        x = x > 0 ? 0 : x - settings.screen[0] < -LoadMap.w ? -LoadMap.w + settings.screen[0] : x;
        y = y > 0 ? 0 : y - settings.screen[1] < -LoadMap.h ? -LoadMap.h + settings.screen[1] : y;
        
        layers.position.x = x;
        layers.position.y = y;
        
        coller.offsetMouse = {x:x,y:y};
    }
    
    this.cursor = function(coller){
        //return {x:coller.mouse.x - coller.offsetMouse.x,y: coller.mouse.y - coller.offsetMouse.y};
        //удалить
    }
    
    this.addPlayer = function(a){
        kerk.removePlayer(a.id);
        
        kerk.players[a.id] = new app.player(a);
    }
    
    this.removePlayer = function(id){
        if(kerk.players[id]){
            kerk.players[id].destroy();
            delete kerk.players[id];
        }
    }
}

/****KERK ANIMATE****/

function animate(){
    if(dataCache.initGame) requestAnimationFrame(animate);
    kerk.render();
    kerk.update();
}