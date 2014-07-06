selectSoundPack: function(callback){
    var ob;
    
    methods.defaultWindow({
        title: 'Звуки',
        limit: 8,
        name: 'soundPack',
        list: function(i,s){
            return methods.stpl('playList',s);
        },
        wContetn: function(a){
            return methods.stpl('twoCollum',a);
        },
        wTitle: 'Звуки',
        wW: 800,
        playItem: function(i,a){
            methods.playSoundPack(a);
        },
        wBtn: {
            '►':function(){
                methods.playSoundPack(ob);
            }
        },
        extend: {
            name: 'Звуки',
            sounds: [],
            selectOnce: 0
        },
        edit: function(a){
            ob = a;
        },
        select: function(i,a){
            callback && callback(i,a);
        },
        wReady: function(a){
            methods.optionSoundPack(a,a.agrs);
        }
    })
},
optionSoundPack: function(a,ob){
    var opLeft  = $('.opLeft'+a.name+a.id);
    var opRight = $('.opRight'+a.name+a.id);
    var boxSort;
    
    function addNewLayer(n){
        if(!n){
            n = {
                name: 'Звук',
                sound: '',
                distance: 400,
                volume: 0,
                rand: 0,
                once: 0,
                blur: 0
            };
            
            ob.sounds.push(n);
        }
        
        var li;
        
        var bn = methods.opValI('btn',{name:n.name,value: 'Ξ'},boxSort,function(){
            opRight.empty();
            $('li',boxSort).removeClass('active');
            bn.parents('li').addClass('active');
            
            methods.opValI('input',{name:'Название',obj:n,value:'name'},opRight,function(v){
                li.find('span').text(v);
            });
            
            methods.opValI('sound',{name:'Аудио',obj:n,value:'sound'},opRight);
            methods.opValI('number',{name:'Дистанция',obj:n,value:'distance',step: 1,min: 0,fix: 1},opRight);
            
            methods.opValI('tween',{
                name:'Звук',
                obj:n,
                value:'volume',
                tw_time: {value: 1,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,max: 1,step: 0.01,fix: 3},
            },opRight);
            
            methods.opValI('name',{name:'Дополнительно'},opRight);
            methods.opValI('checkbox',{name:'Разброс',obj:n,value:'rand'},opRight);
            methods.opValI('checkbox',{name:'Один раз',obj:n,value:'once'},opRight);
            methods.opValI('checkbox',{name:'Дальний звук',obj:n,value:'blur'},opRight);
            methods.opValI('checkbox',{name:'Повторить',obj:n,value:'loop'},opRight);
            
            $.sl('update_scroll');
        });
        
        
        li = bn.parents('li').attr({id:ob.sounds.indexOf( n )})
        
        methods.opValI('joinBtn',{value:'►'},bn,function(){
            methods.playSoundPack(ob,n)
        })
        methods.opValI('joinBtn',{value:'удалить'},bn,function(){
            ob.sounds.splice( ob.sounds.indexOf( n ), 1 );
            initLayers();
        })
    }
    
    function initLayers(){
        boxSort.empty();
        opRight.empty();
        
        for(var i in ob.sounds) addNewLayer(ob.sounds[i]);
        
        $.sl('update_scroll');
    }
            
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},opLeft);
    methods.opValI('checkbox',{name:'Выбрать один',obj:ob,value:'selectOnce'},opLeft);
    methods.opValI('btn',{name:'Новый звук',value: 'добавить'},opLeft,function(){
        addNewLayer();
        $.sl('update_scroll');
    });
        
    methods.opValI('name',{name:'Звуки'},opLeft);

    boxSort = $('<ul class="boxSort list_style objProperties"></ul>').appendTo('.columLeft'+a.name+a.id)
    
    initLayers()
},
editSoundPackID: function(id){
    methods.editByID('soundPack',id,function(obj){
        var ob;
        
        methods.editorWindow({
            id: id,
            name: 'soundPack',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('twoCollum',a);
            },
            wTitle: 'Звуки',
            wBtn: {
                '►':function(){
                    methods.playSoundPack(ob);
                }
            },
            wW: 800,
            wReady: function(a){
                methods.optionSoundPack(a,obj)
                ob = obj;
            }
        })
    })
},

playSoundPackID: function(id){
    methods.editByID('soundPack',id,function(obj){
        methods.playSoundPack(obj);
    })
},

playSoundPack: function(ob,iPlay){
    function playElemSound(a){
        if(!dataCache.sounds) dataCache.sounds = {};
        
        var audio,tween = new TweenFn(a.volume);
        
    	if(!dataCache.sounds[a.sound]){
            audio = new Audio;
            audio.src = a.sound;
            audio.load();
            
            audio.addEventListener('ended', function(){
                clearInterval(audio.timer);
            })
                
            dataCache.sounds[a.sound] = audio;
        }
        else audio = dataCache.sounds[a.sound];
        
        clearInterval(audio.timer);
        
        audio.timer = setInterval(function(){
            audio.volume = tween.lerp(audio.currentTime*1000);
        },1000/60);
        
        audio.pause();
        audio.duration > 0 && (audio.currentTime = 0.0);
        audio.play();
    }
    
    if(iPlay) playElemSound(iPlay);
    else{
        if(ob.selectOnce) playElemSound(ob.sounds[random(0,ob.sounds.length)]);
        else{
            $.each(ob.sounds,function(i,a){
                var rand = random(0,2);
                
                if(a.rand && !rand) return;
                
                playElemSound(a);
            })
        }
    }
},