editTween: function(callback,a,b){
    
    if($('tweenGraph'+b.hash).length) return;
    
    a = checkObject(a);
    
    var html = [
        '<div class="tween">',
            '<div class="t_right graph" id="tweenGraph'+b.hash+'"></div>',
            '<div class="t_right lineLeft"></div>',
            '<div class="t_right lineBottom"></div>',
        '</div>',
        '<div class="t_clear"></div>',
        '<ul class="opTweenList list_style objProperties"></ul>'
    ].join(''),stage,width,height,tweenInfo;
    
    function ifRightClick(e){
        var rightclick;
        var e = window.event;
        if (e.which) rightclick = (e.which == 3);
        else if (e.button) rightclick = (e.button == 2);
        
        return rightclick;
    }
    
    $.sl('window',{
        name:'tween',
        title:'Кривая',
        status: 'data',
        data: html,
        bg:0,
        drag:1,
        w:440,
        h: 420,
        autoclose: false
    },function(wn){
        if(wn == 'close') {
            a.values = [];
            
            for(var i = 0; i < a.graph.length; i++){
                a.values.push({
                    time: parseFloat(((a.graph[i].x/width) * a.time * 1000).toFixed(2)),
                    value: parseFloat((((height-a.graph[i].y)/height) * a.value).toFixed(2))
                })
            }
            
            stage.destroy();
            tweenInfo.remove();
            
            return callback(a);
        }
        
        var box       = $('.opTweenList');
        tweenInfo = $([
            '<div class="tweenInfo">',
                'T: <span class="time"></span><br />',
                'V: <span class="value"></span>',
            '</div>',
        ].join('')).appendTo('body');
        
        var timeInfo  = $('.time',tweenInfo);
        var valueInfo = $('.value',tweenInfo);
        var conteiner = $('#tweenGraph'+b.hash);
        var mouse     = {x:0,y:0};
        var drag      = false;
        var addPoints = [];
        
        width  = conteiner.width();
        height = conteiner.height();
        
        a = $.extend({
            graph: [
                {
                    start: 1,
                    x: 0,
                    y: height
                },
                {
                    end: 1,
                    x: width,
                    y: 0
                }
            ],
            values: [],
            time: b.tw_time.value,
            value: b.tw_value.value,
            variance: 0
        },a)
        
        stage  = new Kinetic.Stage({
            width: width,
            height: height,
            container: 'tweenGraph'+b.hash
        });
        
        var layer = new Kinetic.Layer();
        
        var circle = new Kinetic.Circle({
            radius: 8,
            fill: '#ff5400',
            draggable: true
        });
        
        var point = new Kinetic.Rect({
            width: 7,
            height: 7,
            fill: '#ff5400',
            draggable: true,
            rotation: (Math.PI/2)/2,
            offset: [4,4]
        });
        
        var line = new Kinetic.Spline({
            points: a.graph,
            stroke: '#9d3f11',
            lineCap: 'sqare',
            tension: 0.3
        });
        
        var addPoint = function(ops){
            var inx = a.graph.indexOf(ops);
            var poi = ops.start || ops.end ? circle.clone() : point.clone();
                poi.setX(ops.x);
                poi.setY(ops.y);
                
                poi.on('dragmove', function(e){
                    var leftPoint  = a.graph[inx-1];
                    var rightPoint = a.graph[inx+1];
                    var leftX      = leftPoint ? leftPoint.x : 0;
                    var rightX     = rightPoint ? rightPoint.x : width;
                    var posX       = poi.getPosition().x;
                    var posY       = poi.getPosition().y;
                    var positionX  = ops.start ? 0 : ops.end ? width : posX >= rightX ? rightX : posX <= leftX ? leftX : posX;
                    var positionY  = posY < 0 ? 0 : posY > height ? height : posY;
                    
                    poi.setX(positionX);
                    poi.setY(positionY);
                    
        			ops.x = positionX;
                    ops.y = positionY;
        			
                    line.setPoints(a.graph);
        		});
                
                poi.on('mousedown', function(e){
                    if(ifRightClick(e)){
                        removeArray(a.graph,ops);
                        generateLine(a.graph);
                    }
                })
            
            layer.add(poi);
            addPoints.push(poi);
        }
        
        var generateLine = function(points){
            line.setPoints(points);
            
            for(var i = 0; i < addPoints.length; i++) addPoints[i].destroy();
            
            addPoints = [];
            
            for(var i = 0; i < points.length; i++) addPoint(points[i]);
            
            layer.draw();
        }
        
        layer.add(line);
        stage.add(layer);
        
        conteiner.on('mousemove',function(e){
            mouse.x = e.offsetX;
            mouse.y = e.offsetY;
            drag = true;
            
            tweenInfo.css({
                top: e.pageY,
                left: e.pageX + 15
            })
            
            timeInfo.text(((mouse.x/width) * a.time).toFixed(2))
            valueInfo.text((((height-mouse.y)/height) * a.value).toFixed(2))
        })
        
        conteiner.on('mousedown',function(e){
            e.preventDefault();
            drag = false;
        })
        
        conteiner.on('mouseover',function(){
            tweenInfo.show()
        }).on('mouseout',function(){
            tweenInfo.hide()
        })
        
        conteiner.on('contextmenu',function(e){
             e.preventDefault();
        })
        
        conteiner.on('mouseup',function(e){
            if(!drag && !ifRightClick(e)){
                var inx = 0;
                
                for(var i = 0; i < a.graph.length; i++){
                    if(!inx && a.graph[i].x > mouse.x) inx = i;
                }
                
                a.graph.splice(inx, 0,{
                    x: mouse.x,
                    y: mouse.y
                });
                
                generateLine(a.graph);
            }
        })
        
        generateLine(a.graph);
        
        methods.opValI('number',{name:'Время (сек.)',obj:a,value:'time',step:b.tw_time.step,fix:b.tw_time.fix,min:b.tw_time.min,max:b.tw_max,fixed: b.tw_time.fixed},box);
        
        methods.opValI('number',{name:'Значение',obj:a,value:'value',step:b.tw_time.step,fix:b.tw_time.fix,min:b.tw_time.min,max:b.tw_max,fixed: b.tw_value.fixed},box);
        
        methods.opValI('number',{name:'Вариация',obj:a,value:'variance',step:0.01,fix:2,min:0,max:1},box);
        
        methods.opValI('checkbox',{name:'Повторить',obj:a,value:'repeat'},box);
        
        $.sl('update_scroll');
    })
},