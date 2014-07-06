/* Звуки */

createSound: function(arr,id){
	var cor = methods.getStageCursor();
	var obj = $.extend({
		name: '',
		src: '/editor/media/img/en/ico-04.png',
		sound: '',
		distance: 300,
		volume: 100,
        active: 1,
		x: cor.x,
		y: cor.y,
        parentLayer: activeLayer
	},arr);
	
    if(!arr){
        id                    = hash('_img');
		openMapLoad.sound     = checkObject(openMapLoad.sound);
		openMapLoad.sound[id] = obj;
	}
	
    var img = new Kinetic.Group({
        x: obj.x,
		y: obj.y,
        draggable: true,
        id: id,
    });
    
	var dis = new Kinetic.Circle({
		x: 0,
		y: 0,
		radius: obj.distance,
		fill: '#ff8400',
		opacity: 0.2,
        visible: 0,
        id: 'sound_area'+id
	});
	
    img.add(dis);
	
    var drag = false;
    
	img.on('dragstart', function(e){
		dragBg[0] = false;
	})
	img.on('dragmove', function(e){
	    openMapLoad.sound[id].x = obj.x = Math.round(img.getPosition().x);
		openMapLoad.sound[id].y = obj.y = Math.round(img.getPosition().y);
        drag = true;
	});
	
    img.on('mousedown',function(){
        if(dragBg[8]) img.setDraggable(false);
    })
    
	img.on('mouseup',function(){
	    if(!drag && !dragBg[8]) methods.toolsOptionSound(id)
        img.setDraggable(true);
        drag = false;
	})
	
	methods.objectAddToLayer(img,obj.parentLayer);
    
    if(!arr) methods.flSoundUpdate()
    
    loadImg(obj.src,'',function(imageObj,w,h){
        var image = new Kinetic.Image({
    		image: imageObj,
    		x: 0,
    		y: 0,
    		width: w,
    		height: h,
    		offset:[Math.round(w/2),Math.round(h/2)],
    	});
        
        image.on('mouseover',function(){
    		dis.show();
    		graphicsLayer.draw();
    	});
    	image.on('mouseout',function(){
    		dis.hide();
    		graphicsLayer.draw();
    	})
        
        img.add(image);
		graphicsLayer.draw();
	})
},
toolsOptionSound: function(id){
    var op  = methods.panelShowOrHide(true),
        obj = openMapLoad.sound[id];
    
    var img = graphicsStage.get('#'+id)[0];
    var dis = img.get('#sound_area'+id)[0];
    
    methods.flSetActive(id);
    
    if(selectObjWork) return selectObjWork(id,obj.name);
	
    methods.opValI('input',{name:'Название',obj:obj,value:'name'},op);
	methods.opValI('sound',{obj:obj,value:'sound'},op);
	
    methods.showSelectLayerTool({
        obj: obj,
        elem: img,
        box: op,
        id: id,
        name: 'sound'
    },function(){
        methods.flSoundUpdate();
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
    
	methods.opValI('number',{name:'Дистанция',obj:obj,value:'distance',step:1},op,function(val){
		dis.setRadius(val);
		graphicsLayer.draw();
	});
	
	methods.opValI('number',{name:'Звук',obj:obj,value:'volume',step:0.01,min: 0,fix: 3,max: 1},op);
    methods.opValI('checkbox',{name:'Активный',obj:obj,value:'active'},op);
	
	methods.opValI('btn',{name:'',value:'Удалить'},op,function(){
        img.destroy();
		graphicsLayer.draw();
		
        openMapLoad.sound = remove_index_arr(openMapLoad.sound,id,true);
		
		methods.panelShowOrHide()
        methods.flSoundUpdate()
	});
	
	$.sl('update_scroll');
},