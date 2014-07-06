createObject3D: function(arr,id,imgPrew){
	var cor = methods.getStageCursor();
	var obj = $.extend({
		name: '',
		angle: 0,
		x: cor.x,
		y: cor.y,
        anchorX: 0.5,
        anchorY: 0.5,
		opacity: 1,
        scale: 1,
        height: 0,
        parentLayer: activeLayer
	},arr),newID = hash('_3D');
	
    if(!arr){
        id                       = hash('_img');
		openMapLoad.object3D     = checkObject(openMapLoad.object3D);
		openMapLoad.object3D[id] = obj;
	}
    
	var img = new Kinetic.Image({
		image: new Image(),
		x: obj.x,
		y: obj.y,
		rotation: obj.angle,
        scale: {x: obj.scale,y: obj.scale},
		draggable: true,
        id: id
	});
	
    var drag = false;
    
	img.on('dragstart', function(e){
	    dragBg[0] = false;
	})
    
	img.on('dragmove', function(e){
		openMapLoad.object3D[id].x = obj.x = Math.round(img.getPosition().x);
		openMapLoad.object3D[id].y = obj.y = Math.round(img.getPosition().y);
        drag = true;
	});
	
    img.on('mousedown',function(){
        if(dragBg[8]) img.setDraggable(false);
    })
	img.on('mouseup',function(){
		if(!drag && !dragBg[8]) methods.toolsOptionObject3D(id);
        img.setDraggable(true);
        drag = false;
	})
	
	methods.objectAddToLayer(img,obj.parentLayer);
    
    if(!arr) methods.flObject3DUpdate();
        
    loadImg(imgPrew,'/editor/media/img/en/ico-05.png',function(imageObj,w,h){
		img.setAttrs({
            image: imageObj,
            width: w,
			height: h,
			offset:[Math.round(w*obj.anchorX),Math.round(h*obj.anchorY)],
        })
        
        graphicsLayer.draw();
	})
},
toolsOptionObject3D:function(id){
    var op  = methods.panelShowOrHide(true),
        obj = openMapLoad.object3D[id];
    
    var img = graphicsStage.get('#'+id)[0];
    
    methods.flSetActive(id);
	
    if(selectObjWork) return selectObjWork(id,oparr.name);

	methods.opValI('input',{name:'Название',obj:obj,value:'name'},op);
	
	methods.opValI('object3D',{name:'Объект',obj:obj,value:'object'},op,function(i,a){
        if(a){
		    var b = restore_in_a(a.frames);
            var frameImg = a.frames[b[0]].img;
        }
        else var frameImg = '/editor/media/img/en/ico-05.png';
        
		loadImg(frameImg,'/editor/media/img/en/ico-05.png',function(imageObj,w,h){
			img.setAttrs({
				image: imageObj,
				height: h,
				width: w,
				x: obj.x,
				y: obj.y,
				offset: [Math.round(w*obj.anchorX),Math.round(h*obj.anchorY)]
			})
			
			graphicsLayer.draw();
		})
	});
    
    methods.showSelectLayerTool({
        obj: obj,
        elem: img,
        box: op,
        id: id,
        name: 'object3D'
    },function(){
        methods.flObject3DUpdate();
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
	
	methods.opValI('number',{name:'Угол паворота',obj:obj,value:'angle',step:0.01,fix: 3},op,function(val){
		img.setRotation(val);
		graphicsLayer.draw();
	});
	
	methods.opValI('number',{name:'Прозрачность',obj:obj,value:'opacity',step:0.05,max: 1,min: 0},op,function(val){
		img.setOpacity(val);
		graphicsLayer.draw();
	});
    
    methods.opValI('number',{name:'Размер',obj:obj,value:'scale',step:0.05,min: 0},op,function(val){
		img.setScale({x:val,y:val});
		graphicsLayer.draw();
	});
    
	methods.opValI('btn',{name:'',value:'Удалить'},op,function(){
        img.destroy();
		graphicsLayer.draw();
		
        openMapLoad.object3D = remove_index_arr(openMapLoad.object3D,id,true);
        
        methods.panelShowOrHide()
	});
	
	$.sl('update_scroll');
},