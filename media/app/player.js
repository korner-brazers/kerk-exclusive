kerk.player = function(a){
    kerk.add(this);
    
    this.ai         = a.ai;
    this.unitid     = a.unitid;
    this.myPlayer   = this.unitid == unitid ? 1 : 0;
    this.object     = kerk.createNullObject();
    this.object.userData.unitid = a.unitid;
    this.position   = {};
    this.collision  = {};
    this.gameObject = LoadObj.objects[a.player_id];
    this.dead       = false;
    this.team       = a.team;
    this.life       = 100;
    this.weaponsStore = a.weaponsStore;
    this.sound        = {};
    this.timerLanding = 0;
    
    if(this.gameObject){
        
        this.object.position.x = a.position.x;
        this.object.position.y = a.position.y;
        
        this.position.x = a.position.x;
        this.position.y = a.position.y;
        
        this.layer = new kerk.layer({
            object: this.object,
            layers: this.gameObject.layers,
            weapons: a.weapons
        })
        
        this.jumpTween = new TweenFn(this.gameObject.jump);
        this.jump      = false;
        
        /** Простые иконки **/
        
        this.ico_dead = kerk.addObject(PIXI.Sprite.fromImage('/images/def/dead_ico.png'),'other');
        this.ico_dead.anchor.x = this.ico_dead.anchor.y = 0.5;
        
        this.ico_myTeam = kerk.addObject(PIXI.Sprite.fromImage('/images/def/u_ico_blue.png'),'other');
        this.ico_myTeam.anchor.x = this.ico_myTeam.anchor.y = 0.5;
        
        this.ico_otTeam = kerk.addObject(PIXI.Sprite.fromImage('/images/def/u_ico_red.png'),'other');
        this.ico_otTeam.anchor.x = this.ico_otTeam.anchor.y = 0.5;
        
        /** Звуки **/
        
        this.sound.move = new kerk.sound({
            src: this.gameObject.soundMove,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            loop: 1,
            timerToStop: 300,
            position: this.object.position
        })
        
        this.sound.jump = new kerk.sound({
            src: this.gameObject.soundJump,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            position: this.object.position
        })
        
        this.sound.landing = new kerk.sound({
            src: this.gameObject.soundLanding,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            position: this.object.position
        })
        
        this.nameText = kerk.addObject(new PIXI.Text(a.name || 'unknown', {font:"9px Arial", fill:"white"}),'other');
    }
    else console.warn('No find object in data');
}
kerk.player.prototype = {
    destroy: function(){
        if(this.layer) this.layer.destroy();
        kerk.removeObject(this.nameText);
        kerk.removeObject(this.ico_dead);
        kerk.removeObject(this.ico_myTeam);
        kerk.removeObject(this.ico_otTeam);
        kerk.remove(this);
    },
    setController: function(controller){
        kerk.setController(this.unitid,controller)
    },
    setPosition: function(position){
        this.position.x = position.x;
        this.position.y = position.y;
    },
    setInfo: function(a){
        this.life = Math.round((a.life / this.gameObject.health)*100);
    },
    die: function(){
        this.dead = this.object.userData.dead = true;
    },
    showIcon: function(){
        this.ico_myTeam.visible = this.ico_otTeam.visible = this.ico_dead.visible = 0;
        
        var display = kerk.isVisible(this.object.position.x,this.object.position.y - this.gameObject.boxCollisionHeight - 20,20,20);
        
        this.ico_myTeam.position.x = display.position.x;
        this.ico_myTeam.position.y = display.position.y;
        
        this.ico_otTeam.position.x = display.position.x;
        this.ico_otTeam.position.y = display.position.y;
        
        this.ico_dead.position.x = display.position.x;
        this.ico_dead.position.y = display.position.y;
        
        this.nameText.position.x = this.object.position.x-Math.round(this.nameText.width/2);
        this.nameText.position.y = this.object.position.y - this.gameObject.boxCollisionHeight - 10;
        
        if(!this.myPlayer && !this.dead){
            var myPlayer = kerk.players[unitid];
            
            if(myPlayer){
                if(this.team == myPlayer.team && dataCache.statusRoom.mode > 0) this.ico_myTeam.visible = 1;
                else this.ico_otTeam.visible = 1;
            }
        }
        else if(this.dead) this.ico_dead.visible = 1;
    },
    collisionObject: function(){
        this.collision.bottom = kerk.collisionZone('wall',this.position.x,this.position.y);
        this.collision.top    = kerk.collisionZone('wall',this.position.x,this.position.y - this.gameObject.boxCollisionHeight);
        this.collision.left   = kerk.collisionZone('wall',this.position.x - (this.gameObject.boxCollisionWidth/2),this.position.y-(this.gameObject.boxCollisionHeight/2));
        this.collision.right  = kerk.collisionZone('wall',this.position.x + (this.gameObject.boxCollisionWidth/2),this.position.y-(this.gameObject.boxCollisionHeight/2));
    },
    update: function(){
        var controller = kerk.getController(this.unitid);
        
        if(this.gameObject && this.dead) controller.shot = 0;
        
        if(this.gameObject){
            
            this.collisionObject();
            
            kerk.collisionMap(this.position);
            
            if(!this.collision.bottom) this.position.y += LoadObj.settings.main.gravitation;
            
            if(!this.dead){
                if(controller.moveUp && this.collision.bottom && !this.jump){
                    this.jump = true;
                    this.jumpTween.reset();
                    this.sound.jump.play();
                }
                else if(this.jumpTween.totalTime > this.jumpTween.timer && this.jump && !this.collision.bottom){
                    var jumpImpulse = this.jumpTween.delta();
                    
                    if(!this.collision.top || this.collision.top.platform) this.position.y -= jumpImpulse*delta;
                }
                else if(this.collision.bottom){
                    this.jump = false;
                }
                
                var speed = this.gameObject.speed * focusDelta;
                
                if(controller.moveLeft && (!this.collision.left || this.collision.left.platform))   this.position.x -= speed;
                if(controller.moveRight && (!this.collision.right || this.collision.right.platform)) this.position.x += speed;
                
                if(this.collision.left && !this.collision.left.platform)  this.position.x += speed;
                if(this.collision.right && !this.collision.right.platform) this.position.x -= speed;
            }
            
            this.object.position.x = smooth(this.object.position.x,this.position.x,9);
            this.object.position.y = smooth(this.object.position.y,this.position.y-LoadObj.settings.main.gravitation,9);
            
            if(this.layer){
                var reverse = this.position.x > controller.sight.x ? 1 : 0;
                
                if(!this.dead){
                    if(this.jump && this.jumpTween.timer > 100)  this.layer.setAnimate('jump');
                    else if(controller.moveBottom)               this.layer.setAnimate('moveBottom');
                    else if(controller.moveLeft)                 this.layer.setAnimate(reverse ? 'moveRight': 'moveLeft');
                    else if(controller.moveRight)                this.layer.setAnimate(reverse ? 'moveLeft': 'moveRight');
                    else                                         this.layer.setAnimate('stend');
                }
                else this.layer.setAnimate('dead');
            }
            
            if((controller.moveLeft || controller.moveRight) && this.collision.bottom && !this.dead) this.sound.move.resetTimer().play();
            else this.sound.move.stop();
            
            if(this.collision.bottom){
                this.position.y -= LoadObj.settings.main.gravitation;
                
                if(this.timerLanding > 400) this.sound.landing.play();
                this.timerLanding = 0;
            }
            else this.timerLanding += 1000*delta;
        }
        
        this.showIcon();
    }
}