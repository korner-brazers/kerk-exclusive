/* Различные точки */
createMark: function(arr,id){
	var cor = methods.getStageCursor();
	var obj = $.extend({
		name: '',
		altName: '',
		debark: 0,
		x: cor.x,
		y: cor.y,
        markName: '',
        parentLayer: activeLayer
	},arr);
	
    if(!arr){
        id                    = hash('_img');
		openMapLoad.point     = checkObject(openMapLoad.point);
		openMapLoad.point[id] = obj;
	}
	
	var img = new Kinetic.Image({
		image: new Image(),
		x: obj.x,
		y: obj.y,
		draggable: true,
        id: id
	});
	
    var drag = false;
    
	img.on('dragstart', function(e){
		dragBg[0] = false;
	})
	img.on('dragmove', function(e){
	    openMapLoad.point[id].x = obj.x = Math.round(img.getPosition().x);
		openMapLoad.point[id].y = obj.y = Math.round(img.getPosition().y);
        drag = true;
	});
	
    img.on('mousedown',function(){
        if(dragBg[8]) img.setDraggable(false);
    })
    
	img.on('mouseup',function(){
	    if(!drag && !dragBg[8]) methods.toolsOptionPoint(id);
        img.setDraggable(true);
        drag = false;
	})
	
	methods.objectAddToLayer(img,obj.parentLayer);
    
    if(!arr) methods.flPointUpdate()
    
    loadImg('/editor/media/img/en/ico.png','',function(imageObj,w,h){
		img.setAttrs({
            image: imageObj,
            width: w,
			height: h,
			offset:[Math.round(w/2),Math.round(h/2)],
        })
        
        graphicsLayer.draw();
	})
},
toolsOptionPoint: function(id){
    var op  = methods.panelShowOrHide(true),
        obj = openMapLoad.point[id];
    
    var img = graphicsStage.get('#'+id)[0];
    
    methods.flSetActive(id);
    
    if(selectObjWork) return selectObjWork(id,obj.name);
	
    methods.opValI('input',{name:'ID',value:id},op);
    methods.opValI('input',{name:'Название',obj:obj,value:'name'},op);
    
    methods.showSelectLayerTool({
        obj: obj,
        elem: img,
        box: op,
        id: id,
        name: 'point'
    },function(){
        methods.flPointUpdate();
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
    
	methods.opValI('input',{name:'Символ',obj:obj,value:'altName'},op);
    methods.opValI('input',{name:'MP название',obj:obj,value:'markName'},op);
	
	methods.opValI('checkbox',{name:'Точка высадки',obj:obj,value:'debark'},op);
	methods.opValI('checkbox',{name:'База RU',obj:obj,value:'base_ru'},op);
	methods.opValI('checkbox',{name:'База US',obj:obj,value:'base_us'},op);
	methods.opValI('checkbox',{name:'Захват точки',obj:obj,value:'capture'},op);
	
	methods.opValI('btn',{name:'',value:'Удалить'},op,function(){
        img.destroy();
		graphicsLayer.draw();
		
        openMapLoad.point = remove_index_arr(openMapLoad.point,id,true);
		
		methods.panelShowOrHide()
	});
	
	$.sl('update_scroll');
},