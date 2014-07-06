/*Загрузка количество карт*/

saveMap: function(call){
    if(openMap && loadAllMaps[openMap]){
        $.sl('load',incUrl+'saveAll&mapid='+openMap,{data:{
            json:JSON.stringify(openMapLoad),
            jsonSettings:JSON.stringify(dataCache.settings)
        }},function(j){
            call && call(j);
        });
    }
    else{
        methods.saveSettings();
    } 
},
saveSettings: function(){
    $.sl('load',incUrl+'saveSettings',{data:{
        jsonSettings:JSON.stringify(dataCache.settings)
    }});
},
mapLauhGame: function(){
    var authKey = '';
    
    methods.selectObject(function(oid){
        methods.selectWeapons(function(wid){
            window.open('/index.php?viewer_id=489276382&auth_key='+authKey+'&map='+openMap+'&unitid='+oid+'&weapon='+wid,'_blank')
        })
    })
    
    $.sl('load',incUrl+'getAuthKey',{dataType:'json'},function(j){
        authKey = j.md5;
    })
},

iniMaps: function(){
	$.sl('load',incUrl+'showI&i=maps',{dataType: 'json'},function(j){
		if(j.error) $.sl('info',j.error);
        else{
    		loadAllMaps = j;
    		
            $.sl('load',incUrl+'getObjects',{dataType: 'json'},function(j){
                LoadObj  = j.objects;
                
                methods.loadSettings(j.settings)
                
                if(openMap){
        		    openMapLoad = loadAllMaps[openMap];
                    
                    openMapLoad = $.extend({
                		maxPlayers: 4,
                        layers: {
                            'bg':{
                                name: 'Фон',
                                visible: 1
                            },
                            'players':{
                                name: 'Игроки',
                                visible: 1
                            }
                        }
                	},openMapLoad);
        
        			methods.buldMap(openMap);
        		}
                
                methods.flUpdate();
            });
        }
	})
},

/*Новая карта*/

newMap:function(){
	$.sl('_promt',{input:['name'],btn:{'Создать':function(wn,i){
		var op = {
			name: i[0].value,
			h: 1000,
			w: 1000,
			maxPlayers: 4,
			layers: {
				'bg':{
					name: 'Фон',
					visible: 1
				},
				'players':{
					name: 'Игроки',
					visible: 1
				}
			}
		}
		
        if(useDemo && methods.count(loadAllMaps) >= 1) $.sl('info','Достигнут лимит карт');
        else{
    		$.sl('load',incUrl+'saveI&i=maps',{data:{json:JSON.stringify(op)},dataType:'json'},function(j){
    			window.location = 'editor.php?openMap='+j.id;
    		})
        }
	}}})
},

/*Настройка карты*/

optionMap:function(){
    var op = methods.panelShowOrHide(true);
    
    loadAllMaps[openMap] = openMapLoad;
	
	methods.opValI('input',{name:'Название',obj:openMapLoad,value:'name'},op);
	methods.opValI('number',{name:'Ширина',obj:openMapLoad,value:'w',id:'mW',min: 100,fix: 1,step:10},op,function(val){
		mapZone.setSize(val,openMapLoad.h);
		graphicsLayer.draw();
	});
	methods.opValI('number',{name:'Высота',obj:openMapLoad,value:'h',id:'mH',min: 100,fix: 1,step: 10},op,function(val){
		mapZone.setSize(openMapLoad.w,val);
		graphicsLayer.draw();
	});
    
    methods.opValI('name',{name:'Игра'},op);
    methods.opValI('images',{name:'Картинка',obj:openMapLoad,value: 'preview'},op);
    methods.opValI('number',{name:'Игроков',obj:openMapLoad,value: 'maxPlayers',max: 30,min: 4,step: 1,fix: 0},op);
    methods.opValI('checkbox',{name:'Премиум',obj:openMapLoad,value:'premium'},op);
    methods.opValI('checkbox',{name:'В меню',obj:openMapLoad,value:'useInMenu'},op);
    methods.opValI('checkbox',{name:'Мультиплеер',obj:openMapLoad,value:'multiplayer'},op);
	
    methods.opValI('name',{name:'Ветер'},op);
    methods.opValI('number',{name:'Сила ветра',obj:openMapLoad,value:'windForce',step:0.001,fix:4},op);
    methods.opValI('number',{name:'Направление',obj:openMapLoad,value:'windDirection',step:0.03,fix:4},op,function(val){
        methods.windDirection(val);
    });
    
    methods.opValI('soundPack',{name:'Музыка',obj:openMapLoad,value:'music'},op);
	
	$.sl('update_scroll');
},

/*Загрузка карты*/

resetMap: function(){
    graphicsLayer.removeChildren()
    methods.buldMap();
},

buldMap:function(){
    mapZone = new Kinetic.Rect({
        x: -1,
        y: -1,
        width: openMapLoad.w,
        height: openMapLoad.h,
        stroke: '#6DA6CE',
        strokeWidth: 1
    });
    
    graphicsLayer.add(mapZone);
    
    methods.windDirection(openMapLoad.windDirection);
    
    graphicsGroup = new Kinetic.Group();
    
    graphicsLayer.add(graphicsGroup);
    
    $.each(openMapLoad.layers,function(i,a){
        if(!activeLayer) activeLayer = i;

		layersGroup[i] = new Kinetic.Group({
            visible: a.visible
		});
        
        graphicsGroup.add(layersGroup[i])
	})
    
    if(openMapLoad.graphics){
		$.each(openMapLoad.graphics,function(i,o){
			methods.createGraphics(o,i);
		})
	}
    
    if(openMapLoad.emiter){
		$.each(openMapLoad.emiter,function(i,o){
			methods.createEmiter(o,i);
		})
	}
    
    if(openMapLoad.ai){
		$.each(openMapLoad.ai,function(i,o){
			methods.createAi(o,i);
		})
	}
    
    if(openMapLoad.object3D){
		$.each(openMapLoad.object3D,function(i,o){
            var imgPrew;

            if(LoadObj.object3D[o.object]){
                var a   = restore_in_a(LoadObj.object3D[o.object].frames);
                imgPrew = LoadObj.object3D[o.object].frames[a[0]].img;
            } 
            
            methods.createObject3D(o,i,imgPrew);
		})
	}
    
    if(openMapLoad.sound){
		$.each(openMapLoad.sound,function(i,o){
			methods.createSound(o,i);
		})
	}
    
    if(openMapLoad.point){
		$.each(openMapLoad.point,function(i,o){
			methods.createMark(o,i);
		})
	}
    
    if(openMapLoad.wall){
		$.each(openMapLoad.wall,function(i,o){
			if(o.points.length < 2){
				delete openMapLoad.wall[i]; return;
			}
			methods.createArea(o,i,0,'wall');
		})
	}
    
    if(openMapLoad.ground){
		$.each(openMapLoad.ground,function(i,o){
			if(o.points.length < 2){
				delete openMapLoad.ground[i]; return;
			}
			methods.createArea(o,i,0,'ground');
		})
	}
	
    graphicsLayer.add(zoneLayers.ground);
    graphicsLayer.add(zoneLayers.wall);
        
	graphicsLayer.draw();
},
visibleObjects: function(){
    var lays = methods.panelShowOrHide(true);
            
    methods.opValI('checkbox',{name:'Графика',value:graphicsLayer.getVisible()},lays,function(i){
        methods.showLayer(i);
    });
    
    methods.opValI('checkbox',{name:'Зоны',value:zoneLayers['ground'].getVisible()},lays,function(i){
        methods.showLayer(i,'ground');
    });
    
    methods.opValI('checkbox',{name:'Стены',value:zoneLayers['wall'].getVisible()},lays,function(i){
        methods.showLayer(i,'wall');
    });
    
    $.sl('update_scroll');
},
showLayers: function(){
    if(openMap){
        var op = methods.panelShowOrHide(true);
        
        $.each(openMapLoad.layers,function(i,a){
            var box = $([
                '<li id="'+i+'" class="layersList ',(activeLayer == i ? 'active' : ''),'">',
                    '<div class="visible '+(a.visible ? 'active' : '')+'"></div>',
                    '<div class="tools" style="'+(i=='players' ? 'display: none' : '')+'">',
                        '<div class="edit"></div>',
                        '<div class="del"></div>',
                    '</div>',
                    '<div class="name">'+a.name+'</div>',
                ,'</li>'
            ].join('')).appendTo(op)
            
            $('.name',box).on('click',function(){
                activeLayer = i;
                methods.flSetActive(i);
                $('li',op).removeClass('active');
                $(this).parent().addClass('active');
            })
            
            $('.visible',box).on('click',function(){
                a.visible = a.visible ? 0 : 1;
                layersGroup[i].setVisible(a.visible)
                if(a.visible) $(this).addClass('active');
                else $(this).removeClass('active');
                graphicsLayer.draw();
            })
            
            $('.del',box).on('click',function(){
                $.sl('_confirm','Вы действительно хотите выполнить действие?',{h:80,error:true,bg:false},function(wn){
                    layersGroup[i].remove()
                    delete openMapLoad.layers[i];
                    delete layersGroup[i];
                    box.remove();
                    methods.resetMap();
                });
            })
            
            $('.edit',box).on('click',function(){
                var name = $('.name',box);
                
                $(this).sl('_promt',{
                    w: 400, // ширина окна
                    h: 60,  // высота окна
                    btn: {
                        'Сохранить':function(wn,form,result){
                            a.name = form[0].value;
                            name.text(a.name)
                        }
                    },
                    input: [
                        {name:'name',value:a.name,holder: ''},
                    ],
                    bg: false
                })
            })
        })
        
        op.sortable({
            distance: 10,
            stop: function( event, ui ) {
                
                var sortArray = {};
                var sortLayer = {};
                
                $.each($('li',op),function(){
                    var id = $(this).attr('id');
                    
                    sortArray[id] = openMapLoad.layers[id];
                    
                    layersGroup[id].remove(graphicsGroup)
                    
                    sortLayer[id] = layersGroup[id];
                })
                
                openMapLoad.layers = sortArray;
                
                layersGroup = sortLayer;
                
                for(var i in layersGroup){
                    graphicsGroup.add(layersGroup[i])
                }
                
                graphicsLayer.draw();
                
                methods.flLayersUpdate();
            }
        });
        
        $.sl('update_scroll');
    }
},
newLayerMap: function(){
    var id = hash('lar');
    
    openMapLoad.layers[id] = {
        name: 'Слой',
        visible: 1
    }
    activeLayer = id;
    
    layersGroup[id] = new Kinetic.Group();
    
    graphicsGroup.add(layersGroup[id]);
    
    methods.showLayers();
    methods.flLayersUpdate();
},