newArea: function(zone){
	var cor = methods.getStageCursor();
	var obj = {
		points: [],
		color: randomColor(),
        life: 1000,
        friction: 300,
        height: 100,
        emiter: {}
	},ipu,fclick,hash = new Date().getTime()+'_a';
	
	ipu       = checkObject(openMapLoad[zone]);
	ipu[hash] = obj;
	id        = hash;
				openMapLoad[zone] = ipu;
			
	methods.newElement(0,0,function(){
		
		cor = methods.getStageCursor();
		
		openMapLoad[zone][id].points.push([cor.x,cor.y]);
		
		if(!fclick){
		    methods.createArea(openMapLoad[zone][id],id,true,zone);
			
			fclick = true;
		} 
		else methods.updateAreaById(id,openMapLoad[zone][id],zone);
	});
},

updateAreaById:function(id,arr,zone){
	var p = arr.points.length - 1;
		
	var area = zoneLayers[zone].get('#'+id)[0];
		area.setPoints(arr.points);
		
	for(i=0;i<arr.points.length;i++){
		
		var point = methods.createAreaPoint([arr.points[i][0],arr.points[i][1]],i,id,zone,zone);
		
			point.setPosition(arr.points[i][0],arr.points[i][1]);
	}
	
	graphicsLayer.draw();
},

createAreaPoint:function(points,i,id,n,zone){
	var point = zoneLayers[zone].get('#'+id+'_point_'+i)[0];
	
	if(!point){
		point = new Kinetic.Circle({
			id:id+'_point_'+i,
			x: points[0],
			y: points[1],
			radius: 3,
			opacity: 0.5,
			fill: 'red',
			draggable: true,
			name: 'a_'+n
		});
		
		point.on('dragstart', function(e){
			if(dragBg[8]) point.setDraggable(false);
            else dragBg[0] = false;
		})
		point.on('dragend dragmove', function(e){
			openMapLoad[zone][id]['points'][i] = [point.getPosition().x,point.getPosition().y];
			
			var area = zoneLayers[zone].get('#'+id)[0];
				area.setPoints(openMapLoad[zone][id]['points']);
				
				graphicsLayer.draw();
		});
        point.on('mouseup',function(){
            point.setDraggable(true);
    	})
		
		zoneLayers[zone].add(point);
		
		graphicsLayer.draw();
	}
	
	return point;
},