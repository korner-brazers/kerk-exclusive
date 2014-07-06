kerk.shell = function(point,id){
    kerk.add(this);
    
    this.point  = point;
    
    this.id = id;
    this.active    = true;
    this.exists    = false;
    this.bullet    = LoadObj.bullet[id];
    this.unitid    = point.object.userData.unitid;
    this.object    = point.object;
    this.weapon_id = point.object.userData.weapon_id;
    this.timer     = this.stop = 0;
    this.sound     = {};
    
    this.bulletUpdate = {
		speed: 0,
        delay: 0,
        stepDeviation: 0,
        stepDistance: 0,
        maxDistance: 0
    };
    
    if(this.bullet){
        this.exists = true;
        
        this.sound.shot = new kerk.sound({
            src: this.bullet.soundShot,
            id: this.unitid,
            radius: this.bullet.soundDistance
        })
        
        this.sound.blur = new kerk.sound({
            src: this.bullet.soundShotBlur,
            id: this.unitid,
            radius: this.bullet.soundDistance,
            radiusBlur: this.bullet.soundBlurDistance
        })
        
        this.sound.loop = new kerk.sound({
            src: this.bullet.soundShotLoop,
            id: this.unitid,
            loop: 1,
            position: this.object.position,
            radius: this.bullet.soundDistance,
        })
        
        this.sound.loopBlur = new kerk.sound({
            src: this.bullet.soundShotBlurLoop,
            id: this.unitid,
            loop: 1,
            position: this.object.position,
            radius: this.bullet.soundDistance,
            radiusBlur: this.bullet.soundBlurDistance
        })
        
        this.sound.end = new kerk.sound({
            src: this.bullet.soundShotLoopEnd,
            id: this.unitid,
            radius: this.bullet.soundDistance,
            position: this.object.position,
        })
        
        this.sound.endBlur = new kerk.sound({
            src: this.bullet.soundShotBlurLoopEnd,
            id: this.unitid,
            radius: this.bullet.soundDistance,
            radiusBlur: this.bullet.soundBlurDistance,
            position: this.object.position,
        })
        
        var scope = this;
        
        /** Прокачка пушки **/
        
        kerk.getAppgrade({
            unitid: this.unitid,
            weapon_id: this.weapon_id,
            call: function(addon){
                scope.bulletUpdate.delay         += addon.delay;
                scope.bulletUpdate.stepDeviation += addon.stepDeviation;
                scope.bulletUpdate.stepDistance  += addon.stepDistance;
                scope.bulletUpdate.maxDistance   += addon.maxDistance;
                scope.bulletUpdate.speed         += addon.speed;
            }
        })
    } 
    else console.log('No find shell in data');
    
}
kerk.shell.prototype = {
    addCallback: function(call){
        this.callback = call;
    },
    setActive: function(a){
        this.active = a;
    },
    update: function(){
        if(this.exists){
            this.timer += 1000*delta;
            
            if(this.active && this.timer > this.bullet.delay + this.bulletUpdate.delay){
                
                var coller    = kerk.getController(this.unitid);
                var reverse   = this.object.position.x > coller.sight.x ? 1 : 0;
                
                var paddingX = this.point.offsetX + this.object.userData.layer.paddingX;
                var paddingY = this.point.offsetY + this.object.userData.layer.paddingY;
                
                var pointShot = OffsetPointObject(this.object,reverse ? -this.point.offsetX : this.point.offsetX,this.point.offsetY)
                
                new kerk.bullet({
                    pointStart: pointShot,
                    pointEnd: coller.sight,
                    bullet: this.bullet,
                    bulletUpdate: this.bulletUpdate,
                    unitid: this.unitid,
                    weapon_id: this.weapon_id
                })
                
                this.sound.shot.setPosition(pointShot).play(true);
                this.sound.blur.setPosition(pointShot).play(true);
                
                
                new kerk.fx({
                    id: this.bullet.shotFx,
                    position: pointShot,
                    angle: ToAngleObject(pointShot,coller.sight),
                    unitid: this.unitid,
                })
                
                this.callback && this.callback();
                
                this.timer = 0;
                this.stop  = 1;
            }
            
            if(this.stop && this.timer < this.bullet.soundMinTime){
                this.sound.loop.play();
                this.sound.loopBlur.play();
            }
            else if(this.stop && !this.active){
                this.sound.loop.stop().reset();
                this.sound.loopBlur.stop().reset();
                this.sound.end.play(true);
                this.sound.endBlur.play();
                this.stop = false;
            } 
        }
    },
    destroy: function(){
        for(var i in this.sound) this.sound[i].destroy();
        
        kerk.remove(this);
    }
}