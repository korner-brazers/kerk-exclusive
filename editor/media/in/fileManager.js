flUpdate: function(){
    var box = $('#fileManager').empty();
    
    var listName = {
        'Maps':{
            name: 'Карты',
            ready: function(){
                methods.flMapsUpdate()
            },
            addNew: function(){
                methods.newMap();
            }
        },
        'Layers':{
            name: 'Слои',
            ready: function(){
                methods.flLayersUpdate()
            },
            addNew: function(){
                methods.newLayerMap();
            }
        },
        'Graphics':{
            name: 'Графика',
            ready: function(){
                methods.flGraphicsUpdate()
            }
        },
        'Emiter':{
            name: 'Частицы',
            ready: function(){
                methods.flEmiterUpdate()
            }
        },
        'Object3D':{
            name: 'Объекты',
            ready: function(){
                methods.flObject3DUpdate()
            }
        },
        'Sound':{
            name: 'Звуки',
            ready: function(){
                methods.flSoundUpdate()
            }
        },
        'Point':{
            name: 'Точки',
            ready: function(){
                methods.flPointUpdate()
            }
        },
        'Ai':{
            name: 'AI Команды',
            ready: function(){
                methods.flAiUpdate()
            }
        },
        'Wall':{
            name: 'Стены',
            ready: function(){
                methods.flZoneWallUpdate()
            }
        },
        'Ground':{
            name: 'Зоны',
            ready: function(){
                methods.flZoneGroundUpdate()
            }
        }
    }
    
    $.each(listName,function(i,a){
        var item = $([
            '<div class="box" id="fl'+i+'">',
                '<div class="name">'+a.name+'</div>',
                '<ul class="t_ul content"></ul>',
            '</div>',
        ].join('')).appendTo(box);
        
        if(a.addNew){
            $('<div class="addNew"></div>').appendTo($('.name',item)).on('click',function(){
                a.addNew();
            })
        }
        
        a.ready();
    })
    
    $.sl('update_scroll');
},
flAddBox: function(a){
    var box = $('<li class="'+a.type+'" id="'+a.id+'"><div class="nameItem">'+a.name+'</div></li>').appendTo(a.content);
    
    $('.nameItem',box).on('click',function(){
        a.edit && a.edit();
    })
    
    if(a.del){
        $('<del></del>').prependTo(box).on('click',function(){
            var score = $(this).parent();
            
            a.del(function(){
                score.remove();
                $.sl('update_scroll');
            })
        })
    }
},
flSetActive: function(id){
    $('#fileManager li').removeClass('active');
    $('#fileManager li#'+id).addClass('active');
},
flMapsUpdate: function(scrollUpdate){
    var box = $('#flMaps .content').empty();
    
    $.each(loadAllMaps,function(i,a){
        methods.flAddBox({
            id: i,
            content: box,
            type: 'maps',
            name: a.name || 'Карта...',
            del: function(call){
                $.sl('_confirm',{
    				h: 70,
    				btn: {
    					'Да':function(wn){
    						$.sl('load',incUrl+'delI&i=maps&id='+i,function(){
    							call();
    							
    							if(openMap == i){
    								window.location = 'editor.php';
    							}
    						})
    					},
    				},
    				info: 'Вы действительно хотите выполнить действие?',
    				title: 'Подтвердить',
    				error: 1
    			});
            },
            edit: function(){
                window.location = 'editor.php?openMap='+i;
            }
        })
    })
    
    if(!scrollUpdate) $.sl('update_scroll');
    
},
flGraphicsUpdate: function(scrollUpdate){
    var box = $('#flGraphics .content').empty();
    
    if(openMap && openMapLoad.graphics){
        $.each(openMapLoad.graphics,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'image',
                name: a.name || 'Image...',
                del: function(call){
                    openMapLoad.graphics = remove_index_arr(openMapLoad.graphics,i,true);
                    methods.removeObjectByID(i);
                    call();
                },
                edit: function(){
                    methods.optionGraphics(i)
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},
flObject3DUpdate: function(scrollUpdate){
    var box = $('#flObject3D .content').empty();
    
    if(openMap && openMapLoad.object3D){
        $.each(openMapLoad.object3D,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'object3D',
                name: a.name || 'Object 3D...',
                del: function(call){
                    openMapLoad.object3D = remove_index_arr(openMapLoad.object3D,i,true);
                    methods.removeObjectByID(i);
                    call();
                },
                edit: function(){
                    methods.toolsOptionObject3D(i)
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},
flEmiterUpdate: function(scrollUpdate){
    var box = $('#flEmiter .content').empty();
    
    if(openMap && openMapLoad.emiter){
        $.each(openMapLoad.emiter,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'emiter',
                name: a.name || 'Particles...',
                del: function(call){
                    openMapLoad.emiter = remove_index_arr(openMapLoad.emiter,i,true);
                    methods.removeObjectByID(i);
                    call();
                },
                edit: function(){
                    methods.toolsOptionEmiter(i)
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},
flAiUpdate: function(scrollUpdate){
    var box = $('#flAi .content').empty();
    
    if(openMap && openMapLoad.ai){
        $.each(openMapLoad.ai,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'ai',
                name: a.name || 'Ai Comand...',
                del: function(call){
                    openMapLoad.ai = remove_index_arr(openMapLoad.ai,i,true);
                    methods.removeObjectByID(i);
                    call();
                },
                edit: function(){
                    methods.toolsOptionAi(i)
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},
flSoundUpdate: function(scrollUpdate){
    var box = $('#flSound .content').empty();
    
    if(openMap && openMapLoad.sound){
        $.each(openMapLoad.sound,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'sound',
                name: a.name || 'Sound...',
                del: function(call){
                    openMapLoad.sound = remove_index_arr(openMapLoad.sound,i,true);
                    methods.removeObjectByID(i);
                    call();
                },
                edit: function(){
                    methods.toolsOptionSound(i)
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},
flPointUpdate: function(scrollUpdate){
    var box = $('#flPoint .content').empty();
    
    if(openMap && openMapLoad.point){
        $.each(openMapLoad.point,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'point',
                name: a.name || 'Point...',
                del: function(call){
                    openMapLoad.point = remove_index_arr(openMapLoad.point,i,true);
                    methods.removeObjectByID(i);
                    call();
                },
                edit: function(){
                    methods.toolsOptionPoint(i)
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},
flZoneWallUpdate: function(scrollUpdate){
    var box = $('#flWall .content').empty();
    
    if(openMap && openMapLoad.wall){
        $.each(openMapLoad.wall,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'wall',
                name: a.name || 'Wall...',
                del: function(call){
                    openMapLoad.wall = remove_index_arr(openMapLoad.wall,i,true);
                    methods.removeObjectByID(i);
                    call();
                },
                edit: function(){
                    methods.toolsOptionArea('wall',i)
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},
flZoneGroundUpdate: function(scrollUpdate){
    var box = $('#flGround .content').empty();
    
    if(openMap && openMapLoad.ground){
        $.each(openMapLoad.ground,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'ground',
                name: a.name || 'Ground...',
                del: function(call){
                    openMapLoad.ground = remove_index_arr(openMapLoad.ground,i,true);
                    methods.removeObjectByID(i);
                    call();
                },
                edit: function(){
                    methods.toolsOptionArea('ground',i)
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},
flLayersUpdate: function(scrollUpdate){
    var box = $('#flLayers .content').empty();
    
    if(openMap && openMapLoad.layers){
        $.each(openMapLoad.layers,function(i,a){
            methods.flAddBox({
                id: i,
                content: box,
                type: 'layer',
                name: a.name || 'Layer...',
                edit: function(){
                    activeLayer = i;
                    methods.flSetActive(i);
                    methods.showLayers()
                }
            })
        })
        
        if(!scrollUpdate) $.sl('update_scroll');
    }
},