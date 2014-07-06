selectTracers: function(callback){
    var ob;
    
    methods.defaultWindow({
        title: 'Трейсеры',
        limit: 4,
        name: 'tracers',
        list: function(i,s){
            return methods.stpl('playList',s);
        },
        wContetn: function(a){
            return methods.stpl('oneCollum',a);
        },
        wTitle: 'Трейсер',
        wW: 400,
        wH: 300,
        wBtn: {
            '►':function(){
                methods.playTracer(ob);
            }
        },
        playItem: function(i,a){
            methods.playTracer(a);
        },
        extend: {
            name: 'Трейсер',
            density: 30,
            timelive: 600,
            image: '',
            stretch: 0,
            expand: 0,
            useFx: '',
            rotation: 0,
            opacity: 0,
            scale: 0,
        },
        edit: function(a){
            ob = a;
        },
        select: function(i,a){
            callback && callback(i,a);
        },
        wReady: function(a){
            methods.optionTracer(a,a.agrs);
        }
    })
},
optionTracer: function(a,ob){
    var box  = $('.op'+a.name+a.id);
            
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},box);
    methods.opValI('number',{name:'Плотность',obj:ob,value:'density',step:1,fix:2,min:2},box);
    methods.opValI('number',{name:'Время жизни (ms)',obj:ob,value:'timelive',step:1,fix:2,min:100},box);
    methods.opValI('checkbox',{name:'Растягивать',obj:ob,value:'stretch'},box);
    methods.opValI('fx',{name:'Использовать FX',obj:ob,value:'useFx'},box);
    methods.opValI('name',{name:'Другое'},box);
    methods.opValI('tween',{
        name:'Вращение',
        obj:ob,
        value:'rotation',
        tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
        tw_value: {value: Math.PI,min: 0,step: 0.01,fix: 3},
    },box);
    
    methods.opValI('tween',{
        name:'Прозрачность',
        obj:ob,
        value:'opacity',
        tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
        tw_value: {value: 1,fixed: 1},
    },box);
    
    methods.opValI('tween',{
        name:'Размер',
        obj:ob,
        value:'scale',
        tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
        tw_value: {value: 1,min: 0,step: 0.01,fix: 3},
    },box);

    
    methods.opValI('images',{name:'Изображение',obj:ob,value:'image'},box);
    
    $.sl('update_scroll');
},
editTracerID: function(id){
    methods.editByID('tracers',id,function(obj){
        var ob;
        
        methods.editorWindow({
            id: id,
            name: 'tracers',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('oneCollum',a);
            },
            wBtn: {
            '►':function(){
                    methods.playTracer(ob);
                }
            },
            wTitle: 'Трейсер',
            wW: 400,
            wH: 300,
            wReady: function(a){
                methods.optionTracer(a,obj)
                ob = obj;
            }
        })
    })
},

playTracerID: function(id){
    methods.editByID('tracers',id,function(obj){
        methods.playTracer(obj);
    })
},

playTracer: function(ob){
    var name = 'TracersPlay'+ob.id;
    
    if($('#'+name).length) return;
    
    var cns,layer,anim,width,height,offset = x = 100, speed = 0,animate = [];
    
    loadImg(ob.image,false,function(imageObj,w,h){
        
        $.sl('window',{name:'tracer'+hash(),data:'<div class="win_h_size" id="'+name+'"></div>',title:'►',drag: 1,bg: false,w: 800,h: 300},function(wn){
            
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
                
                
                var pik2 = pik1.clone();
                    pik2.setX(width-offset);
                
                var point = pik1.clone();
                
                layer.add(pik1),layer.add(pik2),layer.add(point),cns.add(layer);
                
                anim = new Kinetic.Animation(function(frame) {
                    
                    if(x < width-100){
                        speed += 0.35;
                        x += speed * 0.2;
                        
                        point.setX(x);
                        
                        if(x > offset+ob.density){
                            var randAngle = random(0,6);
                            
                            var im = new Kinetic.Image({
                                x: ob.stretch ? offset: offset,
                                y: height/2,
                                image: imageObj,
                                offset: [ob.stretch ? 0 : w/2,h/2],
                                width: ob.stretch ? ob.density : w,
                                height: h
                            });
                            
                            im.opacity_tween = new TweenFn(ob.opacity);
                            im.scale_tween = new TweenFn(ob.scale);
                            im.rotation_tween = new TweenFn(ob.rotation);
                            
                            im.opacity_tween.setTimeDiff(ob.timelive)
                            im.scale_tween.setTimeDiff(ob.timelive)
                            im.rotation_tween.setTimeDiff(ob.timelive)
                            im.stretch = ob.stretch;
                            
                            animate.push(im);
                            
                            layer.add(im);
                            
                            setTimeout(function(){
                                animate.splice( animate.indexOf( im ), 1 );
                                im.remove(layer);
                                im.destroy();
                            },ob.timelive)
                            
                            offset += ob.density+(x-offset > ob.density ? x-offset : 0);
                            offset  = x;
                        }
                    }
                    else x = offset = 100,speed = 0;
                    
                    for(var i = 0; i < animate.length; i++){
                        animate[i].setOpacity(animate[i].opacity_tween.addDelta(frame.timeDiff / 1000));
                        
                        if(!animate[i].stretch){
                            animate[i].scaleXY = animate[i].scale_tween.addDelta(frame.timeDiff / 1000)
                            animate[i].setScale(animate[i].scaleXY);
                            animate[i].setRotation(animate[i].rotation_tween.addDelta(frame.timeDiff / 1000));
                        }
                    }
                }, layer);
                
                anim.start();
            }
            else{
                anim.stop(),cns.destroy();
            }
        })
    
    })
},