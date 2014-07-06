selectShellPoint: function(callback){
    methods.defaultWindow({
        title: 'Точки',
        limit: 5,
        name: 'shellPoint',
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
            methods.optionPoint(a,a.agrs);
        }
    })
},
optionPoint: function(a,ob){
    var opLeft  = $('.opLeft'+a.name+a.id).empty();
    var opRight = $('.columRight'+a.name+a.id);
        opRight.find('.overview').empty().append('<div id="shellCns'+a.id+'"></div>');
    
    var cns = new Kinetic.Stage({
        container: 'shellCns'+a.id,
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
        
    var setPoint = function(point,n,lL,lR){
        var arp = OffsetPoint(cw/2,ch/2,0,n.offsetX,n.offsetY);
        
        point.setAttrs(arp);
        
        var epl = [arp.x + 140 * Math.cos(-n.radiusReview+n.viewingAngle),arp.y + 140 * Math.sin(-n.radiusReview+n.viewingAngle)],
            epr = [arp.x + 140 * Math.cos(n.radiusReview+n.viewingAngle),arp.y + 140 * Math.sin(n.radiusReview+n.viewingAngle)];
            
        lL.setPoints([arp.x,arp.y,epl[0],epl[1]]);
        lR.setPoints([arp.x,arp.y,epr[0],epr[1]]);
        
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
        
        var lL = new Kinetic.Line({
            points: [cw/2, ch/2, cw/2 + 140, ch/2],
            stroke: '#FF9101',
            strokeWidth: 1,
        });
        
        var lR = lL.clone();
                    
        pointGroup.add(point),pointGroup.add(lL),pointGroup.add(lR),layer.draw();
        
        setPoint(point,s,lL,lR);
        
        methods.opValI('name',{name:'Точка'},op);
        
        methods.opValI('number',{name:'Сдвинуть по оси X',obj:s,value:'offsetX',step:0.6,fix:1},op,function(v){
            setPoint(point,s,lL,lR);
        });
        
        methods.opValI('number',{name:'Сдвинуть по оси Y',obj:s,value:'offsetY',step:0.6,fix:1},op,function(v){
            setPoint(point,s,lL,lR);
        });
        
        methods.opValI('number',{name:'Радиус обзора',obj:s,value:'radiusReview',step:.02,fix:2,min: 0,max: Math.PI},op,function(v){
            setPoint(point,s,lL,lR);
        });
        
        methods.opValI('number',{name:'Угол обзора',obj:s,value:'viewingAngle',step:.02,fix:2},op,function(v){
            setPoint(point,s,lL,lR);
        });
        
        methods.opValI('btn',{name:'',value:'Удалить'},op,function(){
            ob.points.splice(ob.points.indexOf(s), 1);
            $box.remove();
            point.remove(pointGroup);
            lL.remove(pointGroup);
            lR.remove(pointGroup);
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
            radiusReview: 0,
            viewingAngle: 0
        })
        
        addPoint(ob.points[ob.points.length-1]);
        
        $.sl('update_scroll');
    });
    
    setSpritePreviw(ob.spritePreview);
    
    $.each(ob.points,function(i,s){
        addPoint(s);
    })
    
    $.sl('update_scroll');
},
editShellPointID: function(id){
    methods.editByID('shellPoint',id,function(obj){
        methods.editorWindow({
            id: id,
            name: 'shellPoint',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('twoCollum',a);
            },
            wTitle: 'Точка',
            wW: 800,
            wReady: function(a){
                methods.optionPoint(a,obj);
            }
        })
    })
},

