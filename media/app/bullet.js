kerk.bullet = function(option,id){
    kerk.add(this);
    
    this.option    = option;
    this.unitid    = option.unitid;
    this.weapon_id = option.weapon_id;
    this.bullet    = this.option.bullet;
    this.bulletUpdate = this.option.bulletUpdate;
    this.sprite    = new kerk.sprite(this.bullet.shell);
    
    this.shell     = {
        speed: 0,
        tween_speed: new TweenFn(this.bullet.speed),
        angle: ToAngleObject(this.option.pointStart,this.option.pointEnd),
        distance: ToPointObject(this.option.pointStart,this.option.pointEnd),
        opacity: 1
    }
    
    
    this.position      = new Vector({x:this.option.pointStart.x,y:this.option.pointStart.y});
    this.direcPosition = this.position.clone();
    this.velocity      = new Vector({x:0,y:0});
    
    var addAngle = random(0,this.bullet.stepDeviation+this.bulletUpdate.stepDeviation,1) * ((this.shell.distance*0.001) * this.bullet.stepDistance+this.bulletUpdate.stepDistance);

    
    this.shell.angle += random(0,10) > 5 ? addAngle : -addAngle;
    
    this.spriteObject = kerk.createSprite({img:this.bullet.shell});
    
    this.tracer       = new kerk.tracer({
		id:this.bullet.tracer,
		unitid:this.unitid,
		position: this.spriteObject.position
	});
	
    
    this.spriteObject.position.x = this.position.x;
    this.spriteObject.position.y = this.position.y;
    
    this.spriteObject.rotation = this.shell.angle;
}
kerk.bullet.prototype = {
    destroyBullet: function(){
        kerk.removeObject(this.spriteObject);
        this.tracer.setDead();
        this.sprite.destroy();
        this.destroy();
    },
    beforeDestroy: function(isPlayer,wall){
        var checkGround = kerk.collisionZone('ground',this.spriteObject.position.x,this.spriteObject.position.y);
        
        var coll = this.bullet.collisionFx;
        
        if(coll){
            var fx = checkGround && coll[checkGround.tag] ? coll[checkGround.tag] : (wall && coll[wall.tag] ? coll[wall.tag] : coll.none);
            
            new kerk.fx({
                id: isPlayer ? coll.object: fx,
                position: this.spriteObject.position,
                angle: this.shell.angle - Math.PI
            })
            
        }
        
        /** О, когось зацепыло ! **/

        if(this.detectRadiusObjects){
            mp.emit('detectDestruction',{
                position: this.spriteObject.position,
                unitid: this.unitid,
                weapon: this.weapon_id,
                ai: kerk.players[this.unitid].ai
            })
        }
        
        this.destroyBullet()
    },
    isAiShell: function(player){
        /** Уже вполне этого игрока может и не быть **/
        if(kerk.players[this.unitid]){
            return kerk.players[this.unitid].ai && !player.ai && player.unitid == unitid ? unitid : false;
        }
    },
    detectCollision: function(i,player){
        if(i == this.unitid || player.dead) return;
        
        var boxTo2 = this.bullet.boxCollision/2;
        
        var detect = intersectRect({
                left: this.spriteObject.position.x - boxTo2,
                top: this.spriteObject.position.y - boxTo2,
                right: this.spriteObject.position.x + boxTo2,
                bottom: this.spriteObject.position.y + boxTo2,
            },
            {
                left: player.position.x - (player.gameObject.boxCollisionWidth/2),
                top: player.position.y - player.gameObject.boxCollisionHeight,
                right:  player.position.x + (player.gameObject.boxCollisionWidth/2),
                bottom: player.position.y
            })
        
        var ai = this.isAiShell(player);
        
        if(detect && (this.unitid == unitid || ai)){
            mp.emit('hitObject',{
                position: this.spriteObject.position,
                unitid: ai || i,
                weapon: this.weapon_id,
                ai: ai
            })
        }
        
        if(detect) this.beforeDestroy(true);
    },
    update: function(){
        /** Скорость **/
        this.shell.speed = this.shell.tween_speed.addDelta(delta)+this.bulletUpdate.speed;
        
        /** Гравитация и масса **/
        this.velocity.add({x:0,y:(LoadObj.settings.main.gravitation*this.bullet.mass) * delta});
                        
        /** Позиция **/
        this.position.add(this.velocity.clone().offset(this.shell.speed * delta,this.shell.angle));
        
        /** Устанавливаем направление **/
        this.direcPosition.x = smooth(this.direcPosition.x,this.position.x,5);
        this.direcPosition.y = smooth(this.direcPosition.y,this.position.y,5);
        
        /** Устанавливаем позицию **/
        this.spriteObject.position.x = this.position.x;
        this.spriteObject.position.y = this.position.y;
        this.spriteObject.rotation   = ToAngleObject(this.direcPosition,this.position)
        
        this.detectRadiusObjects = false;
        
        /** Если в кого попали **/
        for(var i in kerk.players){
            this.detectCollision(i,kerk.players[i]);
            
            if(ToPointObject(this.spriteObject.position,kerk.players[i].position) < this.bullet.radiusDestruction) this.detectRadiusObjects = true;
        }
        
        var distance = ToPointObject(this.option.pointStart,this.spriteObject);
        
        if(distance > this.bullet.maxDistance + this.bulletUpdate.maxDistance){
            this.shell.opacity -= .05;
            this.spriteObject.alpha = this.shell.opacity;
            
            if(this.shell.opacity < 0) return this.beforeDestroy();
        }
        
        /** Для игры вид сверху, потом доделаем **/
        //if(distance > this.shell.distance) this.beforeDestroy();
        
        this.collision();
    },
    collision: function(){
        var check = kerk.collisionZone('wall',this.spriteObject.position.x,this.spriteObject.position.y);
        
        if(check) this.beforeDestroy(false,check);
    },
    destroy: function(){
        kerk.remove(this);
    }
}