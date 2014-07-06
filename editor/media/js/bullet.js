selectBullet: function(callback){
    var ob;
    
    methods.defaultWindow({
        title: 'Снаряд',
        limit: 5,
        name: 'bullet',
        list: function(i,s){
            return methods.stpl('playList',s);
        },
        wContetn: function(a){
            return methods.stpl('oneCollum',a);
        },
        wTitle: 'Снаряд',
        wW: 500,
        wBtn: {
            '►':function(){
                methods.playBullet(ob);
            }
        },
        playItem: function(i,a){
            methods.playBullet(a);
        },
        extend: {
            name: 'Снаряд',
            delay: 500,
            speed: 0,
            radiusDestruction: 40,
            stepDegree: 100,
            mass: 0,
            boxCollision: 10,
            stepDeviation: 0.14,
            stepDistance: 0.12,
            maxDistance: 800,
            maxHeight: 10,
            soundMinTime: 200,
            tracer: '',
            shotFx: '',
            shell: '',
            soundDistance: 400,
            soundBlurDistance: 1000,
            soundShellDistance: 100,
            soundShot: '',
            soundShotLoop: '',
            soundShotLoopEnd: '',
            soundDistance: '',
            soundShotBlur: '',
            soundShotBlurLoop: '',
            soundShotBlurLoopEnd: '',
            collisionFx: {}
        },
        edit: function(a){
            ob = a;
        },
        select: function(i,a){
            callback && callback(i,a);
        },
        wReady: function(a){
            methods.optionBullet(a,a.agrs);
        }
    })
},
optionBullet: function(a,ob){
    var box  = $('.op'+a.name+a.id);
            
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},box);
    methods.opValI('number',{name:'Задержка ms',obj:ob,value:'delay',step:10,fix:1,min:1},box);
    
    methods.opValI('tween',{
        name:'Скорость',
        obj:ob,
        value:'speed',
        tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
        tw_value: {value: 600,min: 0,step: 10,fix: 1},
    },box);
    
    methods.opValI('number',{name:'Радиус поражения',obj:ob,value:'radiusDestruction',step:0.5,fix:2,min:0},box);
    methods.opValI('number',{name:'Степень поражения',obj:ob,value:'stepDegree',step:1,fix:2,min:0},box);
    methods.opValI('number',{name:'Масса',obj:ob,value:'mass',step:0.001,fix:4,min:0},box);
    methods.opValI('number',{name:'Бокс коллайдер',obj:ob,value:'boxCollision',step:1,fix:1,min:10},box);
    
    methods.opValI('name',{name:'Отклонения'},box);
    methods.opValI('number',{name:'Степень отклонения',obj:ob,value:'stepDeviation',step:0.01,fix:2,min:0},box);
    methods.opValI('number',{name:'Степень дистанции',obj:ob,value:'stepDistance',step:0.001,fix:4,min:0},box);
    methods.opValI('number',{name:'Мак-ная дистанция',obj:ob,value:'maxDistance',step:1,fix:2,min:0},box);
    methods.opValI('number',{name:'Мак-ная высота',obj:ob,value:'maxHeight',step:0.001,fix:3,min:0},box);
    methods.opValI('number',{name:'Мин-ное время звука',obj:'soundMinTime',step:1,fix:0,min:0},box);
    
    methods.opValI('name',{name:'Эффекты'},box);
    methods.opValI('tracer',{name:'Трейсер',obj:ob,value:'tracer'},box);
    methods.opValI('fx',{name:'Выстрел',obj:ob,value:'shotFx'},box);
    methods.opValI('images',{name:'Снаряд',obj:ob,value:'shell'},box);
    
    methods.opValI('tags',{name:'Эффект попадания',obj:ob,value:'collisionFx'},box,function(a){
        methods.opValI('fx',{name:a.fullName,obj:a.obj,value:a.value},a.box);
    })
    
    methods.opValI('name',{name:'Звуки вблиз'},box);
    methods.opValI('sound',{name:'Выстрел',obj:ob,value:'soundShot'},box);
    methods.opValI('sound',{name:'Повтор',obj:ob,value:'soundShotLoop'},box);
    methods.opValI('sound',{name:'Повтор конец',obj:ob,value:'soundShotLoopEnd'},box);
    methods.opValI('number',{name:'Дистанция',obj:ob,value:'soundDistance',step:1,fix:2,min:0},box);
    
    methods.opValI('name',{name:'Звуки вдалеке'},box);
    methods.opValI('sound',{name:'Выстрел',obj:ob,value:'soundShotBlur'},box);
    methods.opValI('sound',{name:'Повтор',obj:ob,value:'soundShotBlurLoop'},box);
    methods.opValI('sound',{name:'Повтор конец',obj:ob,value:'soundShotBlurLoopEnd'},box);
    methods.opValI('number',{name:'Дистанция',obj:ob,value:'soundBlurDistance',step:1,fix:2,min:0},box);
    
    methods.opValI('name',{name:'Звук снаряда'},box);
    methods.opValI('sound',{name:'Снаряд',obj:ob,value:'soundShell'},box);
    methods.opValI('number',{name:'Дистанция',obj:ob,value:'soundShellDistance',step:1,fix:2,min:0},box);
    
    $.sl('update_scroll');
},
editBulletID: function(id){
    methods.editByID('bullet',id,function(obj){
        var ob;
        
        methods.editorWindow({
            id: id,
            name: 'bullet',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('oneCollum',a);
            },
            wBtn: {
            '►':function(){
                    methods.playBullet(ob);
                }
            },
            wTitle: 'Снаряд',
            wW: 500,
            wReady: function(a){
                methods.optionBullet(a,obj)
                ob = obj;
            }
        })
    })
},

playBulletID: function(id){
    methods.editByID('bullet',id,function(obj){
        methods.playBullet(obj)
    })
},

playBullet: function(ob){
    var name = 'BulletPlay'+ob.id;
    
    if($('#'+name).length) return;
    
    var cns,layer,anim,width,height,offset = x = 100, speed = 0,bullet = [],time = time_c = new Date().getTime();
    
    $.sl('window',{name:'BulletPlayWin',data:'<div class="win_h_size" id="'+name+'"></div>',bg: 0,drag: 1,title:'►',w:760,h:300},function(wn){
        
        if(wn !== 'close'){
            var conteiner = $('#'+name);
            
            width  = conteiner.width();
            height = conteiner.height();
            
            cns = new Kinetic.Stage({
                container: name,
                width: width,
                height: height,
            });
            
            layer = new Kinetic.Layer();

            var pik1 = new Kinetic.Circle({
                x: offset,
                y: height / 2,
                radius: 3,
                fill: 'red',
            });
        
            var detect = new Kinetic.Circle({
                x: width - offset,
                y: height / 2,
                radius: ob.radiusDestruction,
                fill: 'red',
                opacity: 0.1
            });
        
            var pik2 = pik1.clone();
                pik2.setX(width-offset);
                detect.hide();
        
            layer.add(detect),layer.add(pik1),layer.add(pik2),cns.add(layer);
        
            anim = new Kinetic.Animation(function(frame) {
                delta = frame.timeDiff/1000;
                
                if(frame.lastTime - time_c > ob.delay){
                    var sn = new Kinetic.Circle({
                        x: offset,
                        y: height / 2,
                        radius: 3,
                        fill: 'red',
                    });
                    
                    var an = random(0,ob.stepDeviation,1) * ((700*0.001)*ob.stepDistance);
                    
                    bullet.push({
                        obj: sn,
                        object: ob,
                        angle: random(0,10) > 5 ? an : -an,
                        speed: 0,
                        startPosition: new Vector({x:0,y:0}),
                        position: new Vector({x:offset,y:(height/2)}),
                        velocity: new Vector({x:0,y:0}),
                        tween_speed: new TweenFn(ob.speed)
                    })
                    
                    
                    layer.add(sn);
                    
                    time_c = frame.lastTime;
                }
                
                for(var i in bullet){
                    var bu       = bullet[i];
                    var distance = ToPointObject(bu.startPosition,bu.position);
                    
                    if(distance < bu.object.maxDistance){
                        bu.speed = bu.tween_speed.addDelta(delta);
                        
                        /** Гравитация и масса **/
                        bu.velocity.add({x:0,y:(LoadObj.settings.main.gravitation * bu.object.mass)* delta});
                        
                        /** Позиция **/
                        bu.position.add(bu.velocity.clone().offset(bu.speed * delta,bu.angle));
                        
                        bu.obj.setPosition([bu.position.x,bu.position.y])
                    }
                    else{
                        bu.obj.destroy();
                        removeArray(bullet,bu);
                        detect.show();
                        
                        setTimeout(function(){
                            detect.hide();
                        },500);
                    } 
                }
            }, layer);
    
            anim.start();
        }
        else anim.stop(),cns.destroy();
    })
},