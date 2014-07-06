kerk.ui = function(){
    kerk.add(this);
    
    this.offset = 15;
    this.textCache = {};
    this.allMessages = [];
    this.soundTween  = new TweenFn(LoadObj.settings.main.gameSoundvolume);
    this.soundTween.setTimeDiff(100);
    
    /** Экранчик с кровякой)) **/
    this.life = kerk.addObject(PIXI.Sprite.fromImage('/images/def/ifs_blood.png'));
    this.lastLifeNumber = this.lifeTimer = 100;
    
    this.lifeSound = new kerk.sound({
        id: unitid,
        background: true,
        loop: true,
        src: LoadObj.objects[LoadObj.settings.main.playerDefault].soundLife
    })
    
    /** Контейнер для инфы об игроке **/
    this.infoBlock = kerk.addObject(kerk.createNullObject());
    
    /** Задний фон инфы **/
    this.info = PIXI.Sprite.fromImage('/images/game/game_ui_info.png');
    
    this.infoBlock.addChild(this.info);
    
    this.createText({
        name: 'magazine',
        text: '000',
        size: 1,
        space: -11,
        len: 3,
        x: 8,
        y: -2,
        conteiner: this.infoBlock
    })
    
    
    
    this.createText({
        name: 'ammo',
        text: '/000',
        size: 0.8,
        len: 4,
        x: 70,
        y: 0,
        space: -13,
        conteiner: this.infoBlock
    })
    
    this.createText({
        name: 'weaponName',
        text: '      ',
        size: 0.6,
        space: -8,
        len: 6,
        x: 8,
        y: 35,
        conteiner: this.infoBlock
    })
    
    this.createText({
        name: 'life',
        text: '100',
        size: 0.7,
        space: -11,
        len: 3,
        x: 90,
        y: 33,
        conteiner: this.infoBlock
    })
    

    /** Прицел **/
    this.sight = kerk.addObject(PIXI.Sprite.fromImage('/images/game/game_ui_sight.png'));
    this.sight.anchor.x = this.sight.anchor.y = 0.5;
    
    /** Время до окончания раунда **/
    this.timeBlock = kerk.addObject(kerk.createNullObject())
    this.time_glow = kerk.addObject(PIXI.Sprite.fromImage('/images/game/game_ui_time_glow.png'));
    this.timeBlock.addChild(this.time_glow);
    
    this.createText({
        name: 'time',
        text: '00:00',
        size: 1,
        len: 5,
        x: 44,
        y: 10,
        space: -13,
        conteiner: this.timeBlock
    })
    
    /** Чья команда круче, контейнер **/
    this.teamBlock = kerk.addObject(kerk.createNullObject());
    
    this.team = PIXI.Sprite.fromImage('/images/game/game_ui_team_select.png');
    
    this.teamBlock.addChild(this.team);
    
    this.createText({
        name: 'team_ru',
        text: 'ru 034',
        size: 0.7,
        len: 6,
        space: -7,
        x: 10,
        y: 4,
        conteiner: this.teamBlock
    })
    
    this.createText({
        name: 'team_us',
        text: 'us 034',
        size: 0.7,
        len: 6,
        space: -7,
        x: 120,
        y: 4,
        conteiner: this.teamBlock
    })
    
    /** Показываем скока я нарубал челов **/
    this.scoreBlock = kerk.addObject(kerk.createNullObject());

    this.scoreBg = PIXI.Sprite.fromImage('/images/game/game_ui_score_bg.png');
    this.scoreBlock.addChild(this.scoreBg);
    
    this.createText({
        name: 'score',
        text: '+100',
        size: 1,
        len: 6,
        space: -11,
        x: 60,
        y: 20,
        conteiner: this.scoreBlock
    })
    
    /** Титл я сдох ( **/
    this.deadBlock = kerk.addObject(kerk.createNullObject());
    this.createText({
        name: 'deadText',
        text: 'вы погибли',
        size: 1,
        space: -11,
        len: 10,
        x: 0,
        y: 0,
        conteiner: this.deadBlock
    })
    
    this.timerShowScore = 0;
    this.timerAllScore  = 200;
    this.scoreAmount    = 0;
    
    this.infoBlock.visible = this.timeBlock.visible = this.teamBlock.visible = this.scoreBlock.visible = this.sight.visible = this.life.visible = 0;
    
}
kerk.ui.prototype = {
    createText: function(a){
        var cache = {
            size: a.size,
            len: a.len,
            conteiner: a.conteiner || kerk.addObject(kerk.createNullObject()),
            chars: [],
            space: a.space || -5,
            x: a.x || 0,
            y: a.y || 0,
            sprite: [],
            textures: []
        };
        
        var widthChar = 0;
        
        this.textCache[a.name] = cache;
        
        for(var i = 0; i < a.len; i++){
            var sprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(font.create('fontMicraSimple',a.text[i],a.size))));
                sprite.position.x = widthChar+cache.x;
                sprite.position.y = cache.y;
                
            widthChar += sprite.width+cache.space;
            
            cache.sprite[i] = sprite;
            cache.chars[i]  = a.text[i];
            cache.conteiner.addChild(sprite)
        }
    },
    setText:function(name,txt){
        var cache = this.textCache[name];
        
        txt = txt.toString().toLowerCase()
        
        if(cache){
            for(var i = 0; i < cache.len; i++){
                if(cache.chars[i] !== txt[i]){
                    
                    if(cache.textures[txt[i]]) var texture = cache.textures[txt[i]];
                    else{
                        var texture = new PIXI.Texture(new PIXI.BaseTexture(font.create('fontMicraSimple',txt[i],cache.size)));
                        
                        cache.textures[txt[i]] = texture;
                    }
                    
                    cache.sprite[i].setTexture(texture);
                    cache.chars[i] = txt[i];
                }
                
            }
        }
    },
    updateTextPosition: function(){
        for(var i in this.textCache){
            var cache     = this.textCache[i],
                widthChar = 0;
            
            for(var c in cache.sprite){
                var sprite = cache.sprite[c];
                
                sprite.position.x = widthChar+cache.x;
                sprite.position.y = cache.y;
                
                widthChar += sprite.width+cache.space;
            }
        }
    },
    resetPosition: function(){
        /** И так, че мы тут делаем, подстраиваемся под наш скрин и раставляем все на смои места**/
        
        this.infoBlock.position.x = settings.screen[0] - (this.info.width + this.offset);
        this.infoBlock.position.y = settings.screen[1] - (this.info.height + this.offset);
        
        this.timeBlock.position.x = settings.screen[0]/2 - 91;
        
        this.teamBlock.position.x = settings.screen[0]/2 - 112;
        this.teamBlock.position.y = settings.screen[1]-50;
        
        this.scoreBlock.position.x = settings.screen[0]/2 - this.scoreBg.width/2;
        this.scoreBlock.position.y = settings.screen[1]-200;
        
        this.deadBlock.position.x = settings.screen[0]/2 - 110;
        this.deadBlock.position.y = 30;
        
        this.updateTextPosition();
    },
    destroyMessages: function(all){
        for(var i = 0; i < this.allMessages.length; i++){
            var message = this.allMessages[i];
            
            if(message.time++ > 200 || all){
                message.liLink.remove();
                this.allMessages.splice(i,1);
            }
        }
    },
    readMessages: function(){
        for(var i = 0; i < dataCache.messages.length; i++){
            var message = dataCache.messages[i];
            
            if(message.type == 'score'){
                this.timerShowScore = 0;
                this.scoreAmount   += parseInt(message.info);
                
                this.setText('score','+'+this.scoreAmount);
            }
            if(message.type == 'info'){
                this.allMessages.push({
                    time: 0,
                    liLink: $('<li>'+message.info+'</li>').appendTo('.gameInfo')
                })
            }
            if(message.type == 'dead'){
                this.allMessages.push({
                    time: 0,
                    liLink: $('<li>'+message.info+'</li>').appendTo('.deadInfo')
                })
            }
            
            dataCache.messages.splice(i,1);
        }
    },
    update: function(){
        var myPlayer = kerk.getMyPlayer();
        
        /** Заработаный наши очки **/
        if(this.timerShowScore++ > this.timerAllScore) this.scoreBlock.visible = this.scoreAmount = 0;
        else this.scoreBlock.visible = 1;
        
        this.scoreBlock.alpha = 1 - ((this.timerShowScore > this.timerAllScore ? this.timerAllScore : this.timerShowScore) / this.timerAllScore);
        
        /** Все остальное если ы в игре **/
        if(dataCache.inGame && !myPlayer.dead){
            var coller = kerk.myController();
            
            this.sight.position.x = coller.mouse.x;
            this.sight.position.y = coller.mouse.y;
            
            this.infoBlock.visible = this.timeBlock.visible = this.teamBlock.visible = this.sight.visible = 1;
            
            if(dataCache.statusRoom.mode > 0){
                this.setText('team_ru','ru '+leadZero(dataCache.statusRoom.tic_1,3))
                this.setText('team_us','us '+leadZero(dataCache.statusRoom.tic_2,3))
                this.teamBlock.visible = 1;
            }
            else this.teamBlock.visible = 0;
            
            var time = timeEnd(dataCache.statusRoom.timeNow,dataCache.statusRoom.time + dataCache.statusRoom.timeEnd);
            
            this.setText('time',(time[1] || '00')+':'+(time[2] || '00'));
            
            /** И опять таки, не спрашиваете почему так, dataCache это наш мостик обшения что где творится **/
            if(dataCache.weaponInfo){
                this.setText('ammo','/'+leadZero(dataCache.weaponInfo.ammo,3));
                this.setText('magazine',leadZero(dataCache.weaponInfo.magazine,3));
                this.setText('weaponName',dataCache.weaponInfo.name);
            }
            
            this.life.visible = 1;
            
            if(myPlayer.life !== undefined) {
                this.setText('life',leadZero(myPlayer.life,3));
                this.team.position.x = myPlayer.team == 1 ? 0 : 111;
                
                if(myPlayer.life < this.lastLifeNumber){
                    this.lastLifeNumber = myPlayer.life;
                    this.lifeTimer = 0;
                } 
                
                if(this.lifeTimer < 100){
                    var life  = 1 - this.lifeTimer * 0.01,
                        max   = 1 - myPlayer.life * 0.01,
                        alpha = life*max;
                        
                    this.life.alpha = alpha;
                    this.lifeSound.setMaxVolume(this.soundTween.lerp(this.lifeTimer)).play();
                }
                else{
                    this.lifeSound.stop();
                    this.life.visible = 0;
                } 
                
                this.lifeTimer++;
            }
            else this.life.visible = 0;
            
            this.resetPosition();
        }
        else{
            this.infoBlock.visible = this.timeBlock.visible = this.teamBlock.visible = this.scoreBlock.visible = this.sight.visible = 0;
            this.lifeSound.stop();
        }
        
        if(dataCache.inGame && myPlayer.dead){
            /** Нужно сбить счетчик жизни **/
            this.lastLifeNumber = this.lifeTimer =100;
            
            this.deadBlock.visible = 1;
        } 
        else this.deadBlock.visible = 0;
        
        this.life.width  = settings.screen[0];
        this.life.height = settings.screen[1];
        
        this.readMessages();
        this.destroyMessages();
    },
    destroy: function(){
        kerk.removeObject(this.life);
        kerk.removeObject(this.deadBlock);
        kerk.removeObject(this.infoBlock);
        kerk.removeObject(this.timeBlock);
        kerk.removeObject(this.teamBlock);
        kerk.removeObject(this.scoreBlock);
        kerk.removeObject(this.sight);
        this.destroyMessages(true);
        this.textCache = null;
        
        kerk.remove(this);
    }
}