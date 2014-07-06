kerk.layer = function(a){
    kerk.add(this);
    
    this.obj    = a.object;
    this.unitid = this.obj.userData.unitid;
    this.layers = [];
    this.active = true;
    this.points = [];
    this.parentLayer = this.obj.userData.layer || {};
    
    for(var i = 0; i < a.layers.length; i++){
        this.layers.push(new kerk.animations(this.obj,a.layers[i].animations,a.layers[i]));
        
        this.layers[i].object.userData.layer  = a.layers[i];
        this.layers[i].object.userData.unitid = this.unitid;
        this.layers[i].object.userData.deadVector   = {
            position: new Vector({x:0,y:0}),
            velocity: new Vector({x:0,y:0})
        }
        
        var shellPoint = LoadObj.shellPoint[a.layers[i].shellPoint];
        
        if(shellPoint){
            for(var b = 0; b < shellPoint.points.length; b++){
                this.points.push(shellPoint.points[b]);
                this.points[this.points.length-1].object = this.layers[i].object;
            }
        }
        
        if(a.layers[i].tracer){
            this.layers[i].object.userData.tracer = new kerk.tracer({
                id:a.layers[i].tracer,
                unitid:this.unitid,
                position: this.layers[i].object.position
            });
        } 
        
        var slotWep = a.layers[i].weaponSlot-1;
        
        if(a.layers[i].weaponSlot > 0 && a.weapons[slotWep]) this.layers[i].object.userData.weapon = new kerk.weapon(this.layers[i].object,a.weapons[slotWep],slotWep);
    }
}
kerk.layer.prototype = {
    setAnimate: function(name){
        for(var i = 0; i < this.layers.length; i++) this.layers[i].setAnimate(name);
    },
    setActive: function(a){
        this.active = a;
        
        for(var i = 0; i < this.layers.length; i++) this.layers[i].setActive(a);
    },
    update: function(){
        if(this.active){
            var controller = kerk.getController(this.unitid);
            
            var scale = this.obj.position.x > controller.sight.x && !this.obj.userData.dead ? -1 : 1;
            
            for(var i = 0; i < this.layers.length; i++){
                var obj = this.layers[i].object,
                    usd = obj.userData,
                    lar = obj.userData.layer;
                
                
                if(this.obj.userData.dead && lar.destract){
                    if(!usd.deadVector.angle){
                        usd.deadVector.angle = Math.random() * 10 - 5;
                        usd.deadVector.friction = 5;
                        usd.deadVector.rotation = Math.random() * 0.5 - 0.25;
                    }
                    
                    usd.deadVector.velocity.add({x:0,y:LoadObj.settings.main.gravitation*0.01});
                    usd.deadVector.position.add(usd.deadVector.velocity.clone().offset(usd.deadVector.friction,usd.deadVector.angle));
                    
                    /**
                     * Нуно чет придумать, потом как то если мозги варят компот
                    var detect = kerk.detectCollisionRadius(usd.dead.position,'wall',20);
                    
                    if(detect.detectRight) usd.dead.velocity.subtract({x:usd.dead.friction,y:0});
                    if(detect.detectLeft) usd.dead.velocity.add({x:usd.dead.friction,y:0});
                    if(detect.detectBottom){
                        usd.dead.velocity.add({x:0,y:-LoadObj.settings.main.gravitation});
                        //usd.dead.velocity.y = usd.dead.friction;
                        usd.dead.position.add({x:0,y:-LoadObj.settings.main.gravitation})
                    } 
                    if(detect.detectTop) usd.dead.velocity.add({x:0,y:usd.dead.friction});
                    
                    if(detect.detectRight || detect.detectLeft || detect.detectBottom || detect.detectTop){
                        usd.dead.friction = usd.dead.friction < 0 ? 0 : usd.dead.friction-0.3;
                    }
                    */
                    
                    obj.position.x = usd.deadVector.position.x;
                    obj.position.y = usd.deadVector.position.y;
                    obj.rotation  += usd.deadVector.rotation;
                    
                }
                else{
                    var rotation = lar.watchOfCursor ? ToMaxAngle(this.obj.rotation,ToAngleObject(obj,controller.sight) - (scale == 1 ? 0 : Math.PI),lar.maxAngle) : this.obj.rotation;
                    
                    var paddingX = lar.offsetX + (this.parentLayer.paddingX || 0);
                    var paddingY = lar.offsetY + (this.parentLayer.paddingY || 0);

                    var offset = OffsetPointObject(this.obj,scale == 1 ? paddingX : -paddingX,paddingY);
                    
                    obj.position.x = offset.x;
                    obj.position.y = offset.y;
                    obj.scale.x    = scale;
                    
                    usd.deadVector.position.x = offset.x;
                    usd.deadVector.position.y = offset.y;
                    
                    obj.rotation = lar.watchSmooth ? calculateAngle(obj.rotation,rotation,lar.watchSmooth) : rotation;
                }
                
                if(obj.userData.weapon){
                    if(obj.userData.weapon.slot == controller.selectWeapon) obj.userData.weapon.setActive(1);
                    else obj.userData.weapon.setActive(0);
                }
            }
        }
    },
    destroy: function(){
        for(var i in this.layers){
            var layer = this.layers[i];
            
            if(layer.object.userData.tracer) layer.object.userData.tracer.destroy()
            if(layer.object.userData.weapon) layer.object.userData.weapon.destroy()
            
            layer.destroy()
        } 
        
        kerk.remove(this);
    }
}