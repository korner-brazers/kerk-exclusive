createGraphics: function(arr,id){
    var cor = methods.getStageCursor();
	var obj = $.extend({
		name: '',
		angle: 0,
		src: '/editor/media/img/en/ico-03.png',
		x: cor.x,
		y: cor.y,
        anchorX: 0.5,
        anchorY: 0.5,
		opacity: 1,
        visible: 1,
        scale: 1,
        floor: 0,
        parentLayer: activeLayer
	},arr);
	
	if(!arr){
        id                       = hash('_img');
		openMapLoad.graphics     = checkObject(openMapLoad.graphics);
		openMapLoad.graphics[id] = obj;
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
		openMapLoad.graphics[id].x = obj.x = Math.round(img.getPosition().x);
		openMapLoad.graphics[id].y = obj.y = Math.round(img.getPosition().y);
        drag = true;
	});
	
    img.on('mousedown',function(){
        if(dragBg[8]) img.setDraggable(false);
    })
    
	img.on('mouseup',function(){
		if(!drag && !dragBg[8]) methods.optionGraphics(id);
        img.setDraggable(true);
        drag = false;
	})

    methods.objectAddToLayer(img,obj.parentLayer);
    
    if(!arr) methods.flGraphicsUpdate()
	
    loadImg(obj.src,'',function(imageObj,w,h){
        img.setAttrs({
            image: imageObj,
            width: w,
			height: h,
			offset:[Math.round(w*obj.anchorX),Math.round(h*obj.anchorY)],
        })
        
        graphicsLayer.draw();
	})
},
optionGraphics: function(id){
    var op  = methods.panelShowOrHide(true),
        obj = openMapLoad.graphics[id];
    
    var img = graphicsStage.get('#'+id)[0];
    
    methods.flSetActive(id);
    
    if(selectObjWork) return selectObjWork(id,obj.name);

	methods.opValI('input',{name:'Название',obj:obj,value:'name'},op);
	
	methods.opValI('images',{name:'Изображение',obj:obj,value:'src'},op,function(src){
		loadImg(src,'/editor/media/img/en/ico-03.png',function(imageObj,w,h){
 
			img.setAttrs({
				image: imageObj,
				height: h,
				width: w,
				x: obj.x,
				y: obj.y,
                rotation: obj.angle,
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
        name: 'graphics'
    },function(){
        methods.flGraphicsUpdate();
        methods.flSetActive(id);
    })
    
    //methods.opValI('selectMenuObject',{name:'Наложение',obj:obj,value:'blend',menu:{normal:'normal',add:'add'}},op)
    
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
    
	methods.opValI('number',{name:'Развернуть',obj:obj,value:'angle',step:0.01, fix: 3},op,function(val){
		img.setRotation(val);
		graphicsLayer.draw();
	});
	
	methods.opValI('number',{name:'Прозрачность',obj:obj,value:'opacity',step:0.05,max: 1,min: 0},op,function(val){
		img.setOpacity(val);
		graphicsLayer.draw();
	});
    
    methods.opValI('number',{name:'Размер',obj:obj,value:'scale',step:0.01},op,function(val){
		img.setScale(val,val);
		graphicsLayer.draw();
	});
    
    methods.opValI('number',{name:'Высота',obj:obj,value:'floor',step:1,fix: 0},op);
    
    methods.opValI('checkbox',{name:'Объектив',obj:obj,value:'lens'},op);
    methods.opValI('checkbox',{name:'Видимый',obj:obj,value:'visible'},op);
    
	methods.opValI('btn',{name:'',value:'Удалить'},op,function(){
        img.destroy();
		graphicsLayer.draw();
		
		openMapLoad.graphics = remove_index_arr(openMapLoad.graphics,id,true);
		
		methods.panelShowOrHide()
	});
    
    $.sl('update_scroll');
},