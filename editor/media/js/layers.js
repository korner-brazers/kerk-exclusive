editLayers: function(callback,a,g){
    
    a = checkObject(a,true);
    
    var boxSort,opLeft,opRight;
    
    function addNewLayer(n){
        if(!n){ 
            var i = a.push({
                name: 'Слой',
                destract: 1,
                watchOfCursor: 0,
                watchSmooth: 0,
                anchorX: 0.5,
                anchorY: 0.5,
                offsetX: 0,
                offsetY: 0,
                paddingX: 0,
                paddingY: 0,
                maxAngle: 3.14,
                animations: '',
                tracer: '',
                shellPoint: '',
                weaponSlot: 0,
                weaponDefault: ''
            })
            
            var n = a[i-1];
        }
        
        var li;
        
        var bn = methods.opValI('btn',{name:n.name,value: 'Ξ'},boxSort,function(){
            opRight.empty();
            $('li',boxSort).removeClass('active');
            bn.parents('li').addClass('active');
            
            methods.opValI('input',{name:'Название',obj:n,value:'name'},opRight,function(v){
                li.find('span').text(v);
            });
            
            methods.opValI('checkbox',{name:'Разрушаемый',obj:n,value:'destract'},opRight);
            methods.opValI('checkbox',{name:'Следить за курсором',obj:n,value:'watchOfCursor'},opRight);
            methods.opValI('number',{name:'Сгладить движение',obj:n,value:'watchSmooth',min: 0,step: 0.004,fix: 3},opRight);
            methods.opValI('number',{name:'Максимальный угол',obj:n,value:'maxAngle',min: 0,step: 0.004,fix: 3,min:0,max: 3.14},opRight);
            methods.opValI('animations',{name:'Анимации',obj:n,value:'animations'},opRight);
            methods.opValI('tracer',{name:'Трейсер',obj:n,value:'tracer'},opRight);
            methods.opValI('shellPoint',{name:'Точки',obj:n,value:'shellPoint'},opRight);
            methods.opValI('name',{name:'Сдвинуть слой'},opRight);
            methods.opValI('number',{name:'По оси X',obj:n,value:'offsetX',step: 1},opRight);
            methods.opValI('number',{name:'По оси Y',obj:n,value:'offsetY',step: 1},opRight);
            methods.opValI('name',{name:'Якорь'},opRight);
            methods.opValI('number',{name:'По оси X',obj:n,value:'anchorX',step: 0.01,fix:3,min:0,max:1},opRight);
            methods.opValI('number',{name:'По оси Y',obj:n,value:'anchorY',step: 0.01,fix:3,min:0,max:1},opRight);
            methods.opValI('name',{name:'Внутренний отступ'},opRight);
            methods.opValI('number',{name:'По оси X',obj:n,value:'paddingX',step: 1},opRight);
            methods.opValI('number',{name:'По оси Y',obj:n,value:'paddingY',step: 1},opRight);
            methods.opValI('name',{name:'Оружие'},opRight);
            methods.opValI('selectMenu',{name:'Слот оружия',obj:n,value:'weaponSlot',menu: ['нет','слот 1','слот 2','слот 3']},opRight);
            methods.opValI('weapon',{name:'Оружие по дефолту',obj:n,value:'weaponDefault'},opRight);
            
            $.sl('update_scroll');
        });
        
        li = bn.parents('li').attr({id:a.indexOf( n )})
        
        methods.opValI('joinBtn',{value:'удалить'},bn,function(){
            a.splice( a.indexOf( n ), 1 );
            initLayers();
        })
    }
    
    function initLayers(){
        boxSort.empty();
        opRight.empty();
        
        for(var i = 0; i < a.length; i++){
            addNewLayer(a[i]);
        }
        
        $.sl('update_scroll');
    }
    
    $.sl('window',{
            name:'editLayers'+g.obj.id,
            title:'Слои: '+g.obj.name,
            data:methods.stpl('twoCollum',{name:'Layers',id: g.obj.id}),
            bg:0,
            drag:1,
            w:800,
            h: 400,
            autoclose: false,
            btn: {
                'Просмотр': function(){
                    methods.layerPpenPrew(a);
                }
            }
        },function(wn){
            if(wn == 'close') return callback(a);
            
            opLeft  = $('.opLeftLayers'+g.obj.id);
            opRight = $('.opRightLayers'+g.obj.id);
            
            boxSort = $('<ul class="boxSort'+g.obj.id+' list_style objProperties"></ul>').appendTo('.columLeftLayers'+g.obj.id)
            
            methods.opValI('btn',{name:'Новый слой',value: 'добавить'},opLeft,function(){
                addNewLayer();
                $.sl('update_scroll');
            });
            
            initLayers();
            
            boxSort.sortable({
                distance: 15,
                stop: function( event, ui ) {
                    var sortArray = [];
                    
                    $.each($('li',boxSort),function(){
                        var id = $(this).attr('id');
                        sortArray.push(a[id]);
                    })
                    
                    a = sortArray;
                    
                    initLayers()
                }
            });
    })
},
layerPpenPrew: function(ob){
    var name = 'LayerPlay'+hash('vb');
    
    var cns,layer,cw,ch,anim,x = 0,y = 0,spritesAnim = [];
    
    function updateCNS(){
        cw = $('#'+name).width();
        ch = $('#'+name).height();
        
        cns.setWidth(cw);
        cns.setHeight(ch);
        
        $.sl('update_scroll');
    }
    
    function addNewSprite(a){
        
        var sprite = new Kinetic.Sprite({
            x: cw/2,
            y: ch/2,
            image: new Image(),
            animation: 'an',
            animations: {an:[{x:0,y:0,width: 10,height:10}]},
            rotation: 0,
            frameRate: 1
        });
        
        sprite.linkObject = a;
        spritesAnim.push(sprite);
        
        layer.add(sprite);
        
        var animate = LoadObj.animations[a.animations];
        
        if(animate && animate.stend.sprite && LoadObj.sprite[animate.stend.sprite]){
            var spriteObj = LoadObj.sprite[animate.stend.sprite];
            
            sprite.setAttrs({
                frameRate: spriteObj.frameRate,
                animations: {an:methods.createSpriteAnimation(spriteObj,0,0)},
            })
            
            sprite.width = spriteObj.width / spriteObj.repeatX;
            sprite.height = spriteObj.height / spriteObj.repeatY;
            
            loadImg(spriteObj.img,false,function(imageObj,w,h){
                sprite.setImage(imageObj)
                sprite.start();
            })
        }
    }
    
    
    $.sl('window',{
            name:'winLayerPlay'+hash('vb'),
            title:'Просмотр',
            bg:0,
            drag:1,
            size:1,
            data:'<div class="win_h_size" id="'+name+'"></div>',
            w:500,
            h: 400,
            autoclose: false
        },function(wn){
            if(wn == 'fullsize' || wn == 'backsize') updateCNS();
            
            if(wn == 'close') anim.stop(),spritesAnim = [],cns.destroy();
            if(wn !== 'none') return;
            
            cns = new Kinetic.Stage({
                container: name,
            });
            
            updateCNS();
            
            layer = new Kinetic.Layer();
            
            var circle = new Kinetic.Circle({
                x: cw/2,
                y: ch/2,
                radius: 2,
                fill: 'red',
            });
            
            layer.add(circle);
            cns.add(layer);
            
            for(var i in ob) addNewSprite(ob[i]);
            
            anim = new Kinetic.Animation(function(frame){
                delta = frame.timeDiff / 1000;
                
                var scale = x < cw/2 ? -1 : 1;
                
                for(var i in spritesAnim){
                    var sprite = spritesAnim[i];
                        sprite.setAttrs({
                            position: [cw/2 + (scale == 1 ? sprite.linkObject.offsetX : -sprite.linkObject.offsetX),ch/2 + sprite.linkObject.offsetY],
                            offset: [sprite.width * sprite.linkObject.anchorX,sprite.height * sprite.linkObject.anchorY],
                            scale: {x:scale,y:1}
                        })
                    
                    var rotation = sprite.linkObject.watchOfCursor ? ToMaxAngle(0,ToAngle(cw/2,ch/2,x,y) - (scale == 1 ? 0 : Math.PI),sprite.linkObject.maxAngle): 0;
                        rotation = rotation && sprite.linkObject.watchSmooth ? calculateAngle(sprite.getRotation(),rotation,sprite.linkObject.watchSmooth) : rotation;
                        
                        sprite.setRotation(rotation)
                }
            }, layer);
            
            anim.start();
            
            $('#'+name).unbind().on('mousemove',function(e){
                x  = e.offsetX;
                y  = e.offsetY;
            })
    })
},