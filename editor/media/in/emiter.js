createEmiter: function(arr,id){
	var cor = methods.getStageCursor();
	var obj = $.extend({
		name: '',
		x: cor.x,
		y: cor.y,
        w: 100,
        h: 100,
        anchorX: 0.5,
        anchorY: 0.5,
        floor: 0,
        parentLayer: activeLayer
	},arr);
	
    if(!arr){
        id                     = hash('_img');
		openMapLoad.emiter     = checkObject(openMapLoad.emiter);
		openMapLoad.emiter[id] = obj;
	}
    
	var img = new Kinetic.Rect({
        x: obj.x,
        y: obj.y,
        width: obj.w,
        height: obj.h,
        stroke: 'red',
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
        openMapLoad.emiter[id].x = obj.x = img.getPosition().x;
		openMapLoad.emiter[id].y = obj.y = img.getPosition().y;
        drag = true;
	});
	
    img.on('mousedown',function(){
        if(dragBg[8]) img.setDraggable(false);
    })
	img.on('mouseup',function(){
        if(!drag && !dragBg[8]) methods.toolsOptionEmiter(id);
        img.setDraggable(true);
        drag = false;
	})
	
    methods.objectAddToLayer(img,obj.parentLayer);
    
    if(!arr) methods.flEmiterUpdate()
    
	graphicsLayer.draw();
},
toolsOptionEmiter: function(id){
    var op  = methods.panelShowOrHide(true),
        obj = openMapLoad.emiter[id];
    
    var img = graphicsStage.get('#'+id)[0];
    
    methods.flSetActive(id);
    
    if(selectObjWork) return selectObjWork(id,obj.name);
    
	methods.opValI('input',{name:'Название',obj:obj,value:'name'},op);
    methods.opValI('fx',{name:'Эффект',obj:obj,value:'fx'},op);
	
    methods.showSelectLayerTool({
        obj: obj,
        elem: img,
        box: op,
        id: id,
        name: 'emiter'
    },function(){
        methods.flEmiterUpdate();
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
    
    methods.opValI('name',{name:'Якорь'},op);
    
    methods.opValI('number',{name:'По оси X',obj:obj,value:'anchorX',step:0.01, fix: 3,min: 0,max:1},op,function(val){
		img.setOffset([Math.round(img.getWidth()*obj.anchorX),Math.round(img.getHeight()*obj.anchorY)]);
		graphicsLayer.draw();
	});
    
    methods.opValI('number',{name:'По оси Y',obj:obj,value:'anchorY',step:0.01, fix: 3,min: 0,max:1},op,function(val){
		img.setOffset([Math.round(img.getWidth()*obj.anchorX),Math.round(img.getHeight()*obj.anchorY)]);
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
    
    methods.opValI('number',{name:'Высота частиц',obj:obj,value:'floor',step:0.1,fix:1},op);
    methods.opValI('checkbox',{name:'На всю карту',obj:obj,value:'atachToCam'},op);
    
    
	methods.opValI('btn',{name:'',value:'Удалить'},op,function(){
        img.destroy();
		graphicsLayer.draw();
		
        openMapLoad.emiter = remove_index_arr(openMapLoad.emiter,id,true);
		
		methods.panelShowOrHide()
	});
	
	$.sl('update_scroll');
},