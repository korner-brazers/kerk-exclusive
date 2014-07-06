createAi: function(arr,id){
	var cor = methods.getStageCursor();
	var obj = $.extend({
		name: '',
		x: cor.x,
		y: cor.y,
        w: 100,
        h: 100,
        anchorX: 0.5,
        anchorY: 0.5,
        playerMoveRight: 0,
        playerMoveLeft: 0,
        playerJump: 0,
        parentLayer: activeLayer
	},arr);
	
    if(!arr){
        id                 = hash('_img');
		openMapLoad.ai     = checkObject(openMapLoad.ai);
		openMapLoad.ai[id] = obj;
	}
    
	var img = new Kinetic.Rect({
        x: obj.x,
        y: obj.y,
        width: obj.w,
        height: obj.h,
        stroke: 'orange',
        strokeWidth: 1,
        offset: [Math.round(obj.w*obj.anchorX),Math.round(obj.w*obj.anchorY)],
        draggable: true,
        id: id
    });
	
    var drag = false;
    
	img.on('dragstart', function(e){
	    dragBg[0] = false;
	})
    
	img.on('dragmove', function(e){
        openMapLoad.ai[id].x = obj.x = img.getPosition().x;
		openMapLoad.ai[id].y = obj.y = img.getPosition().y;
        drag = true;
	});
	
    img.on('mousedown',function(){
        if(dragBg[8]) img.setDraggable(false);
    })
	img.on('mouseup',function(){
        if(!drag && !dragBg[8]) methods.toolsOptionAi(id);
        img.setDraggable(true);
        drag = false;
	})
	
    methods.objectAddToLayer(img,obj.parentLayer);
    
    if(!arr) methods.flAiUpdate()
    
	graphicsLayer.draw();
},
toolsOptionAi: function(id){
    var op  = methods.panelShowOrHide(true),
        obj = openMapLoad.ai[id];
    
    var img = graphicsStage.get('#'+id)[0];
    
    methods.flSetActive(id);
    
    if(selectObjWork) return selectObjWork(id,obj.name);
    
	methods.opValI('input',{name:'Название',obj:obj,value:'name'},op);
	
    methods.showSelectLayerTool({
        obj: obj,
        elem: img,
        box: op,
        id: id,
        name: 'ai'
    },function(){
        methods.flAiUpdate();
        methods.flSetActive(id);
    })
    
    methods.opValI('name',{name:'Позиция'},op);
    
    methods.opValI('number',{name:'Позиция X',obj:obj,value:'x',step:1, fix: 1},op,function(val){
		img.setX(val);
		graphicsLayer.draw();
	});
    
    methods.opValI('number',{name:'Позиция Y',obj:obj,value:'y',step:1, fix: 1},op,function(val){
		img.setY(val);
		graphicsLayer.draw();
	});
    
    methods.opValI('name',{name:'Другое'},op);
    
    methods.opValI('number',{name:'Ширина',obj:obj,value:'w',step:1,min:2,fix:1},op,function(val){
		img.setWidth(val);
        img.setOffset(val/2,obj.h/2);
		graphicsLayer.draw();
	});
    
    methods.opValI('number',{name:'Высота',obj:obj,value:'h',step:1,min:2,fix:1},op,function(val){
		img.setHeight(val);
        img.setOffset(obj.w/2,val/2);
		graphicsLayer.draw();
	});
    
    methods.opValI('name',{name:'AI'},op);
    methods.opValI('checkbox',{name:'Вправо',obj:obj,value:'playerMoveRight'},op);
    methods.opValI('checkbox',{name:'Влево',obj:obj,value:'playerMoveLeft'},op);
    methods.opValI('checkbox',{name:'Прыгать',obj:obj,value:'playerJump'},op);
    
    
	methods.opValI('btn',{name:'',value:'Удалить'},op,function(){
        img.destroy();
		graphicsLayer.draw();
		
        openMapLoad.ai = remove_index_arr(openMapLoad.ai,id,true);
		
		methods.panelShowOrHide()
	});
	
	$.sl('update_scroll');
},