selectTracerPoints: function(callback){
    methods.defaultWindow({
        title: 'Точки',
        name: 'tracerPoints',
        list: function(i,s){
            return methods.stpl('simple',s);
        },
        wContetn: function(a){
            return methods.stpl('twoCollum',a);
        },
        wTitle: 'Точка',
        wW: 800,
        extend: {
            name: 'Точка',
            points: []
        },
        select: function(i,a){
            callback && callback(i,a);
        },
        wReady: function(a){
            methods.optionTracerPoint(a,a.agrs);
        }
    })
},
optionTracerPoint: function(a,ob){
    var opLeft  = $('.opLeft'+a.name+a.id).empty();
    var opRight = $('.columRight'+a.name+a.id);
        opRight.find('.overview').empty().append('<div id="tracerCns'+a.id+'"></div>');
    
    var cns = new Kinetic.Stage({
        container: 'tracerCns'+a.id,
        width: opRight.width(),
        height: opRight.height()-5,
    });
    
    var cw = cns.getWidth();
    var ch = cns.getHeight();
    
    var spiteGroup = new Kinetic.Group({
        x: cw / 2,
        y: ch / 2,
    });
    
    var layer = new Kinetic.Layer();
    
    var grAll = new Kinetic.Group({
        draggable: true
    });
    
    var pointGroup = new Kinetic.Group();
    
    var pointCenter = new Kinetic.Circle({
        x: cw / 2,
        y: ch / 2,
        radius: 2,
        fill: 'red',
    });
    
    var spriteInitPreview;
    
    pointGroup.add(pointCenter);
    grAll.add(spiteGroup);
    grAll.add(pointGroup);
    layer.add(grAll);
    cns.add(layer);
    
    //*Set Point Position*//
        
    var setPoint = function(point,n){
        var arp = OffsetPoint(cw/2,ch/2,0,n.offsetX,n.offsetY);
        
        point.setAttrs(arp);
        
        layer.draw();
    }

    //*Add Point Function*//
    
    var setSpritePreviw = function(id){
        if(spriteInitPreview) spriteInitPreview.destroy();
        
        methods.getSpriteOnce(id,function(sprite){
            spriteInitPreview = sprite;
            spiteGroup.add(spriteInitPreview);
            layer.draw();
        })
    }
        
    var addPoint = function(s){
        var $box = $('<li class="clearfix"><ul class="opPoint list_style objProperties"></ul></li>').appendTo(opLeft),
            op   = $('.opPoint',$box);
        
        var point = new Kinetic.Circle({
            x: cw/2,
            y: ch/2,
            radius: 2,
            fill: '#45A3BD',
        });
               
        pointGroup.add(point),layer.draw();
        
        setPoint(point,s);
        
        methods.opValI('name',{name:'Точка'},op);
        
        methods.opValI('number',{name:'Сдвинуть по оси X',obj:s,value:'offsetX',step:0.6,fix:1},op,function(v){
            setPoint(point,s);
        });
        
        methods.opValI('number',{name:'Сдвинуть по оси Y',obj:s,value:'offsetY',step:0.6,fix:1},op,function(v){
            setPoint(point,s);
        });
        
        methods.opValI('tags',{name:'Трейсер',obj:s,value:'tracer'},op,function(a){
            methods.opValI('tracer',{name:a.fullName,obj:a.obj,value:a.value},a.box);
        })
        
        methods.opValI('btn',{name:'',value:'Удалить'},op,function(){
            ob.points.splice(ob.points.indexOf(s), 1);
            $box.remove();
            point.destroy();
            layer.draw();
            $.sl('update_scroll');
        });
    }
    
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},opLeft);
    methods.opValI('sprite',{name:'Спрайт для просмотра',obj:ob,value:'spritePreview'},opLeft,function(id){
        setSpritePreviw(id);
    });
    
    methods.opValI('btn',{name:'Новая точка',value:'добавить'},opLeft,function(){
        ob.points.push({
            offsetX: 0,
            offsetY: 0,
            tracer: {}
        })
        
        addPoint(ob.points[ob.points.length-1]);
        
        $.sl('update_scroll');
    });
    
    if(ob.spritePreview) setSpritePreviw(ob.spritePreview);
    
    $.each(ob.points,function(i,s){
        addPoint(s);
    })
    
    $.sl('update_scroll');
},
editTracerPointsID: function(id){
    methods.editByID('tracerPoints',id,function(obj){
        methods.editorWindow({
            id: id,
            name: 'tracerPoints',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('twoCollum',a);
            },
            wTitle: 'Точка',
            wW: 800,
            wReady: function(a){
                methods.optionTracerPoint(a,obj);
            }
        })
    })
},