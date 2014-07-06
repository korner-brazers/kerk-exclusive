kerk.graphics = function(){
    kerk.add(this);
    
    this.graphisc = [];
    this.object3D = [];
    this.point    = [];

    if(LoadMap.graphics){
        for(var i in LoadMap.graphics){
            
            var sprite  = new PIXI.Sprite.fromImage(LoadMap.graphics[i].src);

                sprite.anchor.x = LoadMap.graphics[i].anchorX;
                sprite.anchor.y = LoadMap.graphics[i].anchorY;
                
                sprite.opacity  = LoadMap.graphics[i].opacity;
                sprite.scale    = {x: LoadMap.graphics[i].scale,y: LoadMap.graphics[i].scale};
                sprite.rotation = LoadMap.graphics[i].angle;
                        
                sprite.userData  = LoadMap.graphics[i];
        
                kerk.addObject(sprite,LoadMap.graphics[i].lens ?  'lens' : (LoadMap.graphics[i].parentLayer || 'other'));
            
            this.graphisc.push(sprite);
        }
    }
    
    if(LoadMap.object3D){
        for(var i in LoadMap.object3D){
            var map = LoadMap.object3D[i],
                obj = LoadObj.object3D[map.object];
            
            if(obj){
                for(var f = 0; f < obj.frames.length; f++){
                    for(g = 0; g < obj.frames[f].floors; g++){
                        var sprite  = new PIXI.Sprite.fromImage(obj.frames[f].img);
                    
                        sprite.anchor.x = map.anchorX;
                        sprite.anchor.y = map.anchorY;
                        
                        sprite.userData = {
                            floor: obj.frames[f].floor + g,
                            x: map.x,
                            y: map.y,
                            factor: map.factor
                        };
                        
                        sprite.opacity  = map.opacity;
                        sprite.scale    = {x:map.scale,y:map.scale};
                        sprite.rotation = map.angle;
                        
                        sprite.position.x = 60;
                        sprite.position.y = 60;
                        
                        kerk.addObject(sprite,LoadMap.object3D[i].parentLayer || 'other');
                        
                        this.object3D.push(sprite)
                    }
                }
            }
        }
    }
    
    
    if(LoadMap.point){
        for(var i in LoadMap.point){
            var obj    = LoadMap.point[i];
                
            var point = {
                area_none: this.addPoint(obj,'point_area_none.png'),
                area_my  : this.addPoint(obj,'point_area_my.png'),
                area_team: this.addPoint(obj,'point_area_team.png'),
                ico_none : this.addPoint(obj,'point_ico_none.png'),
                ico_my   : this.addPoint(obj,'point_ico_my.png'),
                ico_team : this.addPoint(obj,'point_ico_team.png'),
                sim      : this.addPoint(obj),
            }
            
            point.id = i;
            
            this.point.push(point);
        }
    }
    
    /** Загрузка полной карты, мне харила писать в app так что пишу тут)) **/
    
    if(LoadMap.emiter){
        for(var i in LoadMap.emiter){
            var emiter = LoadMap.emiter[i];
            
            new kerk.fx({
                id: emiter.fx,
                unitid: unitid,
                layer: emiter.parentLayer,
                position: {x:emiter.x,y:emiter.y},
                x: emiter.x,
                y: emiter.y,
                xVariance: emiter.w,
                yVariance: emiter.h,
                angle: emiter.angle,
                atachToCam: emiter.atachToCam
            })
        }
    }
    
    if(LoadMap.music && dataCache.settings.sound){
        new kerk.soundPack({
            id: LoadMap.music,
            unitid: unitid,
            background: true
        })
    }
    
    if(LoadMap.sound){
        for(var i in LoadMap.sound){
            var sound = LoadMap.sound[i];
            
            if(sound.active){
                var aud = new kerk.sound({
                    src: sound.sound,
                    setNew: 1,
                    id: unitid,
                    radius: sound.distance,
                    position: {
                        x: sound.x,
                        y: sound.y
                    },
                    loop: 1,
                    maxVolume: sound.volume
                })
                
                aud.play();
            }
        }
    }
}
kerk.graphics.prototype = {
    addPoint: function(obj,img){
        var point  = img ? new PIXI.Sprite.fromImage('/images/def/'+img) : new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(font.create('fontMicraSimple',obj.altName[0],0.6))));
            point.anchor.x   = img ? 0.5 : 0.3;
            point.anchor.y   = 0.5;
            point.position.x = obj.x;
            point.position.y = obj.y;
            
        var sprite = kerk.addObject(point,obj.parentLayer || 'other');
            sprite.userData.position = {
                x: obj.x,
                y: obj.y
            }
            
        return sprite;
    },
    update: function(){
        this.displayObject(this.graphisc);
        this.displayObject(this.object3D);
        
        var player     = kerk.players[unitid],
            playerTeam = player ? player.team : 0;
        
        for(var i = this.point.length; i--;){
            var point = this.point[i],
                name  = 'none';
                
                point.area_none.visible = point.area_my.visible = point.area_team.visible = point.ico_none.visible = point.ico_my.visible = point.ico_team.visible = 0;
                
                
                if(playerTeam && dataCache.statusRoom.point[point.id] && dataCache.statusRoom.point[point.id].team) name = dataCache.statusRoom.point[point.id].team == playerTeam ? 'my' : 'team';
                else           name = 'none';
                
                var subname = 'ico_'+name;
                var display = kerk.isVisible(point[subname].userData.position.x,point[subname].userData.position.y,(point[subname].width/2),(point[subname].height/2))
                
                point[subname].position.x = display.position.x;
                point[subname].position.y = display.position.y;
                
                point.sim.position.x = display.position.x;
                point.sim.position.y = display.position.y;
                
                point['area_'+name].visible = point[subname].visible = 1;
        }
    },
    displayObject: function(obj){
        for(var i = obj.length; i--;){
            var sprite  = obj[i],
                fx3D    = kerk.Fx3D(sprite.userData.x,sprite.userData.y,sprite.userData.floor,sprite.userData.factor);
                
                sprite.position.x = fx3D.x;
                sprite.position.y = fx3D.y;
                
                if(sprite.userData.lens) sprite.visible = kerk.isVisible(fx3D.x,fx3D.y,0,0).visible;
                //else sprite.visible = kerk.isVisible(fx3D.x,fx3D.y,-(sprite.width/2),-(sprite.height/2)).visible;
                
        }
    },
    destroy: function(){
        for(var i = this.graphisc.length; i--;) kerk.removeObject(this.graphisc[i]);
        for(var i = this.object3D.length; i--;) kerk.removeObject(this.object3D[i]);
        
        for(var i = this.point.length; i--;){
            var point = this.point[i];
            
            kerk.removeObject(point.area_none);
            kerk.removeObject(point.area_my);
            kerk.removeObject(point.area_team);
            
            kerk.removeObject(point.ico_none);
            kerk.removeObject(point.ico_my);
            kerk.removeObject(point.ico_team);
        }
        
        kerk.remove(this);
    }
}