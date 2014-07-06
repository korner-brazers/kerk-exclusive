createArea:function(arr,id,n,zone){
	var area = new Kinetic.Polygon({
		points: arr.points,
		id:id,
		fill: '#'+arr.color,
		opacity: 0.17,
		name: 'p_wall_'+zone
	});
	   
	area.on('mouseup',function(){
		if(!dragBg[8]) methods.toolsOptionArea(zone,id);
	})
    
    if(n){
        if(zone == 'wall') methods.flZoneWallUpdate();
        else methods.flZoneGroundUpdate();
    }
	
	zoneLayers[zone].add(area);
	
	graphicsLayer.draw();
	
	for(i=0;i<arr.points.length;i++){
		methods.createAreaPoint([arr.points[i][0],arr.points[i][1]],i,id,zone,zone);
	}
},
toolsOptionArea: function(zone,id){
    var box = methods.panelShowOrHide(true),
        obj = openMapLoad[zone][id];
    
    var area = graphicsStage.get('#'+id)[0];
    
    methods.flSetActive(id);
    
    if(selectObjWork) return selectObjWork(id,obj.name);
    
    methods.opValI('tagSelect',{name:'Тег',obj:obj,value:'tag'},box)
    methods.opValI('number',{name:'Высота',obj:obj,value:'height',step:1,fix:1,min:0},box);
    methods.opValI('checkbox',{name:'Платформа',obj:obj,value:'platform'},box);
    
	methods.opValI('btn',{name:'',value:'Удалить'},box,function(){
		
		for(i=0;i < obj.points.length;i++){
			
			var point = zoneLayers[zone].get('#'+id+'_point_'+i)[0];
			
            if(point) point.destroy();
		}
        
        area.destroy();
		graphicsLayer.draw();
		
		openMapLoad[zone] = remove_index_arr(openMapLoad[zone],id,true);
		methods.panelShowOrHide()
        
        if(zone == 'wall') methods.flZoneWallUpdate();
        else methods.flZoneGroundUpdate();
	});
},