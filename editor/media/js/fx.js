selectFX: function(callback){
    var ob;
    
    methods.defaultWindow({
        title: 'Эффекты',
        limit: 20,
        name: 'fx',
        list: function(i,s){
            return methods.stpl('playList',s);
        },
        wContetn: function(a){
            return methods.stpl('twoCollum',a);
        },
        wTitle: 'Эффект',
        wW: 800,
        playItem: function(i,a){
            methods.showFX(a);
        },
        wBtn: {
            '►':function(){
                methods.showFX(ob);
            }
        },
        extend: {
            name: 'Эффект',
            particles: [],
            soundPack: '',
            camForce: 0,
            camRadius: 0
        },
        edit: function(a){
            ob = a;
        },
        select: function(i,a){
            callback && callback(i,a);
        },
        wReady: function(a){
            methods.optionFX(a,a.agrs);
        }
    })
},
optionFX: function(a,ob){
    var opLeft  = $('.opLeft'+a.name+a.id);
    var opRight = $('.opRight'+a.name+a.id);
    var boxSort;
    
    
    function addNewLayer(n){
        if(!n){
            n = {
                name: 'Слой',
                img: '',
                emiterLife: 5000,
                anchorX: 0.5,
                anchorY: 0.5,
                particleLifeOfDead: 0,
                mass: 0,
                maxParticles: 0,
                lens: 0,
                nextMs: 0,
                xVariance: 0,
                yVariance: 0,
                generate: 0,
                speed: 0,
                direction: 0,
                life: 0,
                opacity: 0,
                scale: 0,
                rotation: 0,
            };
            
            ob.particles.push(n);
        }
        
        var li;
        
        var bn = methods.opValI('btn',{name:n.name,value: 'Ξ'},boxSort,function(){
            opRight.empty();
            $('li',boxSort).removeClass('active');
            bn.parents('li').addClass('active');
            
            methods.opValI('input',{name:'Название',obj:n,value:'name'},opRight,function(v){
                li.find('span').text(v);
            });
            
            methods.opValI('images',{name:'Частица',obj:n,value:'img'},opRight);
            methods.opValI('name',{name:'Якорь'},opRight);
            methods.opValI('number',{name:'По оси X',obj:n,value:'anchorX',step: 0.01,fix:3,min:0,max:1},opRight);
            methods.opValI('number',{name:'По оси Y',obj:n,value:'anchorY',step: 0.01,fix:3,min:0,max:1},opRight);
            methods.opValI('checkbox',{name:'Объектив',obj:n,value:'lens'},opRight);
            
            methods.opValI('name',{name:'Разброс'},opRight);
            
            methods.opValI('tween',{
                name:'Ширина',
                obj:n,
                value:'xVariance',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,step: 1,fix:1},
            },opRight);
            
            methods.opValI('tween',{
                name:'Высота',
                obj:n,
                value:'yVariance',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,step: 1,fix: 1},
            },opRight);
            
            methods.opValI('name',{name:'Жизнь'},opRight);
            methods.opValI('number',{name:'Жизнь эмиттера (ms)',obj:n,value:'emiterLife',min: 0, step: 1,fix: 1},opRight);
            methods.opValI('number',{name:'Жизнь после смерти',obj:n,value:'particleLifeOfDead',min: 0, step: 1,fix: 1},opRight);
            methods.opValI('number',{name:'Масса',obj:n,value:'mass', step: 0.5,fix: 2},opRight);
            
            methods.opValI('name',{name:'Частицы'},opRight);
            methods.opValI('number',{name:'Максимум частиц',obj:n,value:'maxParticles',min: 0, step: 1,fix: 1},opRight);
			methods.opValI('number',{name:'Каждые (ms)',obj:n,value:'nextMs',min: 0, step: 1,fix: 1},opRight);
            methods.opValI('tween',{
                name:'Генерировать',
                obj:n,
                value:'generate',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,step: 1,fix: 1},
            },opRight);
            
            methods.opValI('tween',{
                name:'Скорость',
                obj:n,
                value:'speed',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,step: 0.01,fix: 3},
            },opRight);
            
            methods.opValI('tween',{
                name:'Направление',
                obj:n,
                value:'direction',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,step: 1,fix: 1},
            },opRight);
            
            methods.opValI('tween',{
                name:'Жизнь частиц',
                obj:n,
                value:'life',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,step: 1,fix: 1},
            },opRight);
        
            methods.opValI('tween',{
                name:'Прозрачность',
                obj:n,
                value:'opacity',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,fixed: 1},
            },opRight);
            
            /*
            methods.opValI('tween',{
                name:'Высота',
                obj:n,
                value:'height',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,step: 0.1,fix: 1},
            },opRight);
            */
            
            methods.opValI('tween',{
                name:'Размер',
                obj:n,
                value:'scale',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,step: 0.1,fix: 1},
            },opRight);
            
            methods.opValI('tween',{
                name:'Врашение',
                obj:n,
                value:'rotation',
                tw_time: {value: 3,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,max: 3.14,step: 0.02,fix: 2},
            },opRight);
            
            
            $.sl('update_scroll');
        });
        
        
        li = bn.parents('li').attr({id:ob.particles.indexOf( n )})
        
        methods.opValI('joinBtn',{value:'►'},bn,function(){
            methods.showFX(ob,n)
        })
        methods.opValI('joinBtn',{value:'удалить'},bn,function(){
            ob.particles.splice( ob.particles.indexOf( n ), 1 );
            initLayers();
        })
    }
    
    function initLayers(){
        boxSort.empty();
        opRight.empty();
        
        for(var i = 0; i < ob.particles.length; i++) addNewLayer(ob.particles[i]);
        
        $.sl('update_scroll');
    }
            
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},opLeft);
    methods.opValI('soundPack',{name:'Звуки',obj:ob,value:'soundPack'},opLeft);
    methods.opValI('name',{name:'Сила на камеру'},opLeft);
    methods.opValI('number',{name:'Сила',obj:ob,value:'camForce',step: 5,fix:1,min:0},opLeft);
    methods.opValI('number',{name:'Радиус',obj:ob,value:'camRadius',step: 5,fix:1,min:0},opLeft);
    methods.opValI('btn',{name:'Новый слой',value: 'добавить'},opLeft,function(){
        addNewLayer();
        $.sl('update_scroll');
    });
        
    methods.opValI('name',{name:'Слои'},opLeft);
    
    
    boxSort = $('<ul class="boxSort list_style objProperties"></ul>').appendTo('.columLeft'+a.name+a.id)
    
    boxSort.sortable({
        stop: function( event, ui ) {
            var sortArray = [];
            
            $.each($('li',boxSort),function(){
                var id = $(this).attr('id');
                sortArray.push(ob.particles[id]);
            })
            
            ob.particles = sortArray;
            
            initLayers()
        }
    });
        
    initLayers()
},
editFX: function(id){
    methods.editByID('fx',id,function(obj){
        var ob;
        
        methods.editorWindow({
            id: id,
            name: 'fx',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('twoCollum',a);
            },
            wTitle: 'Эффект',
            wBtn: {
                '►':function(){
                    methods.showFX(ob);
                }
            },
            wW: 800,
            wReady: function(a){
                methods.optionFX(a,obj)
                ob = obj;
            }
        })
    })
},

showFXID: function(id){
    methods.editByID('fx',id,function(obj){
        methods.showFX(obj);
    })
},

showFX: function(ob,iPlay){
    var name = 'fxPlay'+ob.id;
    
    if($('#'+name).length) return;
    
    var cns,layer,cw,ch,anim,allParticles = [],cw,ch,x = 0,y = 0;
    
    function updateCNS(){
        cw = $('#'+name).width();
        ch = $('#'+name).height();
        
        cns.setWidth(cw);
        cns.setHeight(ch);
        
        $.sl('update_scroll');
    }
    
    function addParticles(a){
        var imgObject;
        
        loadImg(a.img,null,function(image){
            imgObject = image;
        })
        
        var particles = new Particles({
                options: a,
                x: x,
                y: y
            });
            
            particles.onNew = function(particle){
                if(imgObject){
                    particle.obj = new Kinetic.Image({
                        x: particle.position.x,
                        y: particle.position.y,
                        image: imgObject,
                        opacity: particle.opacity,
                        scale: {x:particle.scale,y:particle.scale},
                        rotation: particle.rotation,
                        offset: [imgObject.width*a.anchorX,imgObject.height*a.anchorY]
                    });
                }
                else{
                    particle.obj = new Kinetic.Circle({
                        x: particle.position.x,
                        y: particle.position.y,
                        radius: 3,
                        opacity: particle.opacity,
                        scale: {x:particle.scale,y:particle.scale},
                        rotation: particle.rotation,
                        fill: 'red',
                    });
                }
                
                layer.add(particle.obj);
            }
            particles.onDraw = function(particle){
                particle.obj.setPosition(particle.position.x,particle.position.y);
                particle.obj.setOpacity(particle.opacity);
                particle.obj.setScale({x:particle.scale,y:particle.scale});
                particle.obj.setRotation(particle.rotation);
            }
            particles.onDie = function(particle){
                particle.obj.destroy();
            }
            particles.onDead = function(){
                removeArray(allParticles,particles);
            }
            
            allParticles.push(particles);
    }
    
    function clickNewParticle(){
        if(iPlay !== undefined) addParticles(iPlay);
        else{
            for(var i in ob.particles) addParticles(ob.particles[i]);
        }
    }
    
    $.sl('window',{name:'winPlayFx'+ob.id,title:'FX',bg:0,drag:1,size:1,data:'<div class="win_h_size" id="'+name+'"></div>',w:600,h: 400,autoclose: false},function(wn){
        if(wn == 'fullsize' || wn == 'backsize') updateCNS();
        
        if(wn == 'close') anim.stop(),cns.destroy(),allParticles = [];
        if(wn !== 'none') return;
        
        cns = new Kinetic.Stage({
            container: name,
        });
        
        updateCNS();
        
        layer = new Kinetic.Layer();
        
        cns.add(layer);
        
        anim = new Kinetic.Animation(function(frame){
            for(var i in allParticles) allParticles[i].update(frame.timeDiff / 1000);
        }, layer);
        
        anim.start();
        
        $('#'+name).unbind().on('mousemove',function(e){
                x  = e.offsetX;
                y  = e.offsetY;
        }).on('mousedown',function(e){
            e.preventDefault();
            clickNewParticle();
        })
    })
},