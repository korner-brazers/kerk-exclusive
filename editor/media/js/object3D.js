selectObject3D: function(callback){
    var ob;
    
    methods.defaultWindow({
        title: 'Объекты',
        limit: 12,
        name: 'object3D',
        list: function(i,s){
            return methods.stpl('playList',s);
        },
        wContetn: function(a){
            return methods.stpl('twoCollum',a);
        },
        wTitle: 'Объект',
        wW: 800,
        playItem: function(i,a){
            methods.showObject3D(a);
        },
        wBtn: {
            '►':function(){
                methods.showObject3D(ob);
            }
        },
        extend: {
            name: 'Объект',
            frames: [],
            factor: 0.01,
        },
        edit: function(a){
            ob = a;
        },
        select: function(i,a){
            callback && callback(i,a);
        },
        wReady: function(a){
            methods.optionObject3D(a,a.agrs);
        }
    })
},
optionObject3D: function(a,ob){
    var opLeft  = $('.opLeft'+a.name+a.id);
    var opRight = $('.opRight'+a.name+a.id);
    var boxSort;
    
    
    function addNewLayer(n){
        if(!n){ 
            ob.frames.push({
                img: '',
                floor: 0,
                floors: 1
            })
            
            var n = ob.frames[ob.frames.length-1];
        }
        
        var li;
        
        var bn = methods.opValI('btn',{name:'Слой',value: 'Ξ'},boxSort,function(){
            opRight.empty();
            
            methods.opValI('images',{name:'Изображение',obj:n,value:'img'},opRight);
            
            methods.opValI('number',{name:'Этаж',obj:n,value:'floor',min: 0,step: 1,fix: 1},opRight);
            methods.opValI('number',{name:'Этажей',obj:n,value:'floors',min: 0,step: 1,fix: 1},opRight);
            
            $.sl('update_scroll');
        });
        
        li = bn.parents('li').attr({id:ob.frames.indexOf( n )})
        
        methods.opValI('joinBtn',{value:'удалить'},bn,function(){
            ob.frames.splice( ob.frames.indexOf( n ), 1 );
            initLayers();
        })
    }
    
    function initLayers(){
        boxSort.empty();
        opRight.empty();
        
        for(var i = 0; i < ob.frames.length; i++) addNewLayer(ob.frames[i]);
        
        $.sl('update_scroll');
    }
            
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},opLeft);
    methods.opValI('number',{name:'Фактор',obj:ob,value:'factor',step: 0.01,fix: 4},opLeft);
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
                sortArray.push(ob.frames[id]);
            })
            
            ob.frames = sortArray;
            
            initLayers()
        }
    });
        
    initLayers()
},
editObject3D: function(id){
    methods.editByID('object3D',id,function(obj){
        var ob;
        
        methods.editorWindow({
            id: id,
            name: 'object3D',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('twoCollum',a);
            },
            wTitle: 'Объект',
            wBtn: {
                '►':function(){
                    methods.showObject3D(ob);
                }
            },
            wW: 800,
            wReady: function(a){
                methods.optionObject3D(a,obj)
                ob = obj;
            }
        })
    })
},

showObject3DID: function(id){
    methods.editByID('object3D',id,function(obj){
        methods.showObject3D(obj);
    })
},

showObject3D: function(ob){
    var cns,layer,cw,ch,anim,object3D = [],loadImgFrame = [],x = 0,y = 0;
    
    function updateCNS(){
        cw = $('#cnsObject3D').width();
        ch = $('#cnsObject3D').height();
        
        cns.setWidth(cw);
        cns.setHeight(ch);
        
        $.sl('update_scroll');
    }
    
    function setObject3D(i,floor){
        var obj = new Kinetic.Image({
            image: loadImgFrame[i],
            x: cw/2,
            y: ch/2,
            offset: [Math.floor(loadImgFrame[i].width/2),Math.floor(loadImgFrame[i].height/2)]
        });
        
        obj.floor = floor;
        object3D.push(obj);
        layer.add(obj);
    }
    
    function drawObject3D(a){
        var far = Math.sqrt(Math.pow(cw/2-x,2) + Math.pow(ch/2-y,2)),
            ang = Math.atan2(y - ch/2,x - cw/2)+Math.PI,
            del = far*(ob.factor || 0.02)*a.floor,
            of  = [cw/2 + del * Math.cos(ang),ch/2 + del * Math.sin(ang)];
        
        a.setPosition(of);
    }
    
    $.sl('window',{name:'editBuilding',title:'Объект',bg:0,drag:1,size:1,data:'<div class="win_h_size" id="cnsObject3D"></div>',w:700,h: 400,autoclose: false},function(wn){
        if(wn == 'fullsize' || wn == 'backsize') updateCNS();
        
        if(wn == 'close') anim.stop(),cns.destroy();
        if(wn !== 'none') return;
        
        cns = new Kinetic.Stage({
            container: 'cnsObject3D',
        });
        
        updateCNS();
        
        layer = new Kinetic.Layer();
        
        cns.add(layer);
        
        anim = new Kinetic.Animation(function(frame) {
            for(var i = 0; i < object3D.length; i++) drawObject3D(object3D[i])
        }, layer);
        
        anim.start();
        
        $('#cnsObject3D').unbind().on('mousemove',function(e){
            var of = $(this).offset();
                x  = e.pageX - of.left;
                y  = e.pageY - of.top;
        })
        
        stepLoad(ob.frames,function(i,next){
            loadImg(ob.frames[i].img,'',function(imgObj){
                loadImgFrame[i] = imgObj;
                
                setTimeout(function(){
                    next && next();
                },10)
            })
        },function(){
            for(var i = 0; i < ob.frames.length; i++){
                for(var g = 0; g < ob.frames[i].floors; g++) setObject3D(i,ob.frames[i].floor+g);
            }
        })
    })
},