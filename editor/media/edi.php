<?
header("Content-type: application/x-javascript");
?>
(function($){
    var buld_info    = $('#infoRm'),
        buld_cur     = [0,0],
        dragBg       = [false,0,0,0,0,0,0],
        loadAllMaps  = {},
        openMapLoad  = {},
        dragElem     = false,
        visual_bg    = '#buld .visual_bg_conteiner',
        ofvisual     = {},
        workScene    = false,
        LoadMap      = {},
        layers       = {
            'newElement':$('#newElement'),
            'graphics':$('#graphics')
        },
        ui = {
            scale: 1,
            zoomFactor: 1.1,
            origin: {
                x: 0,
                y: 0
            }
        },
        graphicsGroup = null,
        layersGroup   = {},
        activeLayer   = false,
        LastSelectIF  = '',
        LastSelectAF  = '',
        selectObjWork = false,
        useDemo       = false;
    
    var allData = {
        map: {},
        mapImg: {},
        graphics: {},
        mark: {},
        sprite: {},
        unit: {},
        vehicle: {},
        weapons: {},
        fx: {},
        tracers: {},
        bullet: {},
        def: {},
        almrk: {},
        shadow: {}
    };
    
    var preData = {
        shadow: {}
    };
    
    function WHElem(el){
        var cns = el ? $(el).show() : $(visual_bg),
            w   = cns.width(),
            h   = cns.height();
        return [w,h];
    }
    
    var sizeCns = WHElem();
    
    /**
     * Layers Canvas
     */
    
    var zoneLayers = {
        ground: null,
        wall: null,
    }
    
    var mapZone;
    
    var graphicsStage = new Kinetic.Stage({container: 'graphics'}); 
    var graphicsLayer = new Kinetic.Layer();
    var zoneGenerate  = new Kinetic.Layer();
    
    zoneLayers.ground = new Kinetic.Group({ visible: 0 }); 
    zoneLayers.wall   = new Kinetic.Group({ visible: 0 });
    
    graphicsStage.add(graphicsLayer);
    graphicsStage.add(zoneGenerate);
    
                
    /**
     * Show Line Cursor
     */
     
    var newElementStage = new Kinetic.Stage({container: 'newElement'});        
    var newElementLayer = new Kinetic.Layer();
                
    var XLine = new Kinetic.Line({
        points: [0, sizeCns[1]/2, sizeCns[0], sizeCns[1]/2],
        stroke: 'rgba(255,255,255,0.2)',
        strokeWidth: 1,
    });
    
    var YLine = new Kinetic.Line({
        points: [sizeCns[0]/2, 0, sizeCns[0]/2, sizeCns[1]],
        stroke: 'rgba(255,255,255,0.2)',
        strokeWidth: 1,
    });
    
    var newElementPoint = new Kinetic.Circle({
        x: sizeCns[0]/2,
        y: sizeCns[1]/2,
        radius: 15,
        fill: 'rgba(255,255,255,0.2)'
    });
                
    newElementLayer.add(XLine);
    newElementLayer.add(YLine);
    newElementLayer.add(newElementPoint);
    newElementStage.add(newElementLayer);
                    
    var newElementAnim = new Kinetic.Animation(function(frame) {
        cor = methods.cor();
        newElementPoint.setPosition(cor.x,cor.y);
        XLine.setPoints([0, cor.y, newElementStage.getWidth(), cor.y]);
        YLine.setPoints([cor.x, 0, cor.x, newElementStage.getHeight()]);
    }, newElementLayer);
    
    var methods = {
        init : function() {
            
            /**
             * ContextMenu
             */
            
            $('#buld').on('mousedown',function(e){
                if( e.button == 2 ) { 
                    newElementAnim.stop();
                    layers.newElement.hide();
                } 
            }).on('contextmenu',function(){
                return false;
            });
            
            /**
             * Init Scroll Size
             */
            
            var jsThis = $(visual_bg).get(0);
            
            if (jsThis.addEventListener){
                jsThis.addEventListener('DOMMouseScroll', methods.scroll, false);
                jsThis.addEventListener('mousewheel', methods.scroll, false);
            }
            else if (jsThis.attachEvent) {
                jsThis.attachEvent('onmousewheel', methods.scroll);
            }
            
            /**
             * Drag objs and background
             */
            
            $(document).on('keydown',function(e){
                if(e.keyCode == 32){
                    $(visual_bg).css({cursor:'move'})
                    dragBg[8] = true;
                } 
            }).on('keyup',function(e){
                if(e.keyCode == 32){
                    $(visual_bg).css({cursor:'default'})
                    dragBg[8] = false;
                } 
            })
            
            $(visual_bg).on('mousedown',function(e){
                if(dragBg[8]){
                    dragBg[0]    = true;
                    dragBg[1]    = e.pageX/ui.scale; 
                    dragBg[2]    = e.pageY/ui.scale;
                    dragBg[5]    = graphicsStage.getOffset().x;
                    dragBg[6]    = graphicsStage.getOffset().y;
                }
            }).on('mousemove',function(e){
                
                if(!dragBg[0]) return;
                
                dragBg[3] = dragBg[1] - e.pageX/ui.scale;
                dragBg[4] = dragBg[2] - e.pageY/ui.scale;
                
                var x = Math.round(dragBg[5] + dragBg[3]),
                    y = Math.round(dragBg[6] + dragBg[4]);
                    
                
                if(Math.abs(dragBg[3]) > 1 || Math.abs(dragBg[4]) > 1) dragElem = true;
                
                dragBg[9] = true;
                
                ui.origin.x = x;
                ui.origin.y = y;
            
                graphicsStage.setOffset(x,y)
                graphicsStage.draw();
                
            }).on('mouseup',function(){
                dragBg[0] = false;
            })
            
            /**
             * Cursor move body
             */
             
            $('#buld').on('mousemove',function(e){
                buld_cur = [e.pageX,e.pageY];
            });
            
            $.sl('resize',['.buld_bottom','.top_panel'],'.resizeWin',function(h,ah){
                //$('.win_h_size_shell').height(ah);
                
                var size = WHElem();
                
                $('.rightToolBox').height(size[1]-10); //10 высота сепаратора
                
                newElementStage.setHeight(size[1]);
                newElementStage.setWidth(size[0]);
                
                graphicsStage.setHeight(size[1]);
                graphicsStage.setWidth(size[0]);
            })
            
            ofvisual = $(visual_bg).offset();
               
            methods.iniMaps();
            
        },
        
        /**
         * Дополнительные функции
         */
        showLayer: function(val,name){
            if(name) zoneLayers[name].setVisible(val);
            else graphicsLayer.setVisible(val);
            
            graphicsLayer.draw();
        },
        info: function(i){
            buld_info.text(i);
            methods.prjChange();
        },
        prjChange: function(s){
            s ? $('.visual_bg_conteiner').removeClass('change') : $('.visual_bg_conteiner').addClass('change');
        },
        cor: function(){
            var x = buld_cur[0] - ofvisual.left,
                y = buld_cur[1] - ofvisual.top;
                
            return {x:x,y:y};
        },
        panelShowOrHide: function(show){
            var panel = $('#panel');
            
            if(show){
                if(!dragBg[8]){
                    $('.objectProperty',panel).empty().sortable('destroy')
                    panel.addClass('active');
                }
            } 
            else panel.removeClass('active');
            
            return $('.objectProperty',panel).empty().sortable('destroy')
        },
        objectAddToLayer: function(object,layer){
            if(layersGroup[layer]) layersGroup[layer].add(object);
        },
        ditachToNewLayer: function(object,layer){
            if(object.parent) object.remove(object.parent)
            if(layersGroup[layer]) layersGroup[layer].add(object);
        },
        removeObjectByID: function(id){
            var object = graphicsStage.get('#'+id)[0];
            
            if(object){
                object.destroy();
                graphicsLayer.draw();
            }
        },
        showSelectLayerTool: function(a,call){
            var layersName = {};
            
            $.each(openMapLoad.layers,function(i,b){
                layersName[i] = b.name;
            })
            
            methods.opValI('selectMenuObject',{name:'Слой',obj:a.obj,value:'parentLayer',menu:layersName},a.box,function(i){
        		methods.ditachToNewLayer(a.elem,a.obj.parentLayer);
                graphicsLayer.draw();
                
                var newSort = {};
                
                $.each(openMapLoad[a.name],function(i,c){
                    if(i !== a.id) newSort[i] = c;
                })
                
                newSort[a.id] = a.obj;
                openMapLoad[a.name] = newSort;
                
                call && call();
        	});
        },
        getStageCursor: function(){
            var cor = methods.cor();
            
            return {
                x: Math.round(cor.x - graphicsStage.getX()) / ui.scale + graphicsStage.getOffset().x,
                y: Math.round(cor.y - graphicsStage.getY()) / ui.scale + graphicsStage.getOffset().y
            };
        },
        generateBg: function(){
            $.sl('install',incUrl+'generate&i=maps&id='+openMap,{bg:loadAllMaps[openMap].bg},function(j){
                console.log(j)
                if(j.er) $.sl('info',j.er);
                else{
                    loadAllMaps[openMap].bgUrls = j;
                    methods.saveMap();
                }
            })
        },
        windDirection: function(val){
            $('.compass .direction').css({
                "transform": 'rotate('+(val * (180/Math.PI))+'deg)',
                "-ms-transform": 'rotate('+(val * (180/Math.PI))+'deg)',
                "-webkit-transform": 'rotate('+(val * (180/Math.PI))+'deg)'
            })
        },
        generateZone: function(callback){
            var Stage = new Kinetic.Stage({
                container: 'graphics',
                width: openMapLoad.w,
                height: openMapLoad.h
            }); 
            
            var Layer = new Kinetic.Layer();
            
                Stage.add(Layer);
            
            var arr = openMapLoad.wall;
        
            if(arr){
                $.each(arr,function(i,o){
                    if(o.points.length < 2) return;
                    
                    var area = new Kinetic.Polygon({
                        points: o.points,
                        fill: '#'+o.color,
                    });
                    
                    Layer.add(area);
                })
            }
            
            Layer.draw();
            
            var wallGenerate = Layer.toDataURL("image/png")
            
            Layer.removeChildren();
            
            arr = openMapLoad.ground;
        
            if(arr){
                $.each(arr,function(i,o){
                    if(o.points.length < 2) return;
                    
                    var area = new Kinetic.Polygon({
                        points: o.points,
                        fill: '#'+o.color,
                    });
                    
                    Layer.add(area);
                })
            }
            
            Layer.draw();
            
            var groundGenerate = Layer.toDataURL("image/png")

            Stage.destroy();
            
            $.sl('install',incUrl+'saveZone&id='+openMap,{wallGenerate:wallGenerate,groundGenerate:groundGenerate},function(j){
                if(j.er) $.sl('info',j.er);
                else{
                    callback && callback();
                }
            })
        },
        scroll: function(evt,iDelta){
            if(evt) evt.preventDefault();
           
            if(!iDelta){
                var evt = evt || window.event;
                var iDelta = evt.wheelDelta ? evt.wheelDelta/120 : -evt.detail/3;
            }
            
            var cor = methods.cor();
            var mx = cor.x,
                my = cor.y,
                wheel = iDelta / 120;
                
            var zoom = (ui.zoomFactor - (iDelta < 0 ? 0.2 : 0));
            var newscale = ui.scale * zoom;
            
            ui.origin.x = Math.round(mx / ui.scale + ui.origin.x - mx / newscale);
            ui.origin.y = Math.round(my / ui.scale + ui.origin.y - my / newscale);
            
            graphicsStage.setOffset(ui.origin.x, ui.origin.y);
            graphicsStage.setScale(newscale);
            graphicsStage.draw();
            
            ui.scale *= zoom;
            
            methods.info(Math.round(ui.scale*100)+'%');
        },
        setScale: function(sc){
            if(!sc){
                graphicsStage.setScale(1);
                graphicsStage.draw();
                ui.scale = 1;
                methods.info('100%');
            } 
            else methods.scroll(null,sc);
        },
        selectObjects: function(op,fn){
            op.value = checkObject(op.value);
            
            var pushObj = function(o,s,n){
                if(n && o in op.value) return;
                
                var $box = $('<li class="t_clear" id="obg_'+o+'"><div class="nameAudio l" style="width: 80%">'+(s || 'Неизвестно')+'</div><div class="sl_btn t_right del">X</div></li>').appendTo('.audObjects');
                
                $('.del',$box).on('click',function(){
                    $box.remove();
                    delete op.value[o];
                    $.sl('update_scroll');
                    fn && fn(op.value);
                })
            }
            
    		selectObjWork = function(id,name){
    		    pushObj(id,name,1);
  		        op.value[id] = name;
                fn && fn(op.value);
                $.sl('update_scroll');
    		}
            
    		$.sl('window',{name:'selObj',title:'Выбор обьектов',bg:0,drag:1,data:'<ul class="audioSelect audObjects list_style objProperties"></ul>',w:440,h:280},function(wc){
    			if(wc == 'close') selectObjWork = false;
    			else{
					$.each(op.value,function(o,s){
            			pushObj(o,s);
            		})
    			}
    		})
        },
        
        stpl: function(n,a){
            if(n == 'withImg') return [
                '<li id="i_'+a.id+'" class="clearfix">',
                    '<div class="img"><img src="'+(a.img || '/editor/media/img/noimage.png')+'" />',
                    '</div>',
                    '<div class="t_right">',
                        '<div class="sl_btn edit">Ξ</div>',
                        '<div class="t_clear"></div>',
                        '<div class="sl_btn delete">✖</div>',
                    '</div>',
                    '<div class="t_over" style="padding-top: 5px">',
                        '<h3>'+a.name+'</h3>',
                        '<p>'+a.descr+'</p>',
                    '</div>',
                '</li>'].join('');
            else if(n == 'simple') return [
                '<li id="'+a.id+'" class="t_clear clearfix simple">',
                    '<div class="t_right">',
                        '<div class="sl_btn edit" style="margin: 2px 0 0 5px">Ξ</div>',
                        '<div class="sl_btn delete" style="margin: 2px 0 0 5px">✖</div>',
                    '</div>',
                    '<div class="nameAudio l t_bold t_over sel">'+a.name+'</div>',
                '</li>'].join('')
            else if(n == 'playList') return [
                '<li id="'+a.id+'" class="t_clear clearfix simple">',
                    '<div class="sl_btn t_left play" style="margin: 2px 5px 0 0">►</div>',
                    '<div class="t_right">',
                        '<div class="sl_btn edit" style="margin: 2px 0 0 5px">Ξ</div>',
                        '<div class="sl_btn delete" style="margin: 2px 0 0 5px">✖</div>',
                    '</div>',
                    '<div class="nameAudio l t_bold t_over sel">'+a.name+'</div>',
                '</li>'].join('')
            else if(n == 'twoCollum') return [
                '<div class=" t_left win_h_size scrollbarInit" style="width: 50%">',
                    '<div class="columLeft'+a.name+a.id+'">',
                        '<ul class="opLeft'+a.name+a.id+' list_style objProperties"></ul>',
                    '</div>',
                '</div>',
                '<div class="columRight'+a.name+a.id+' t_right win_h_size scrollbarInit" style="width: 50%">',
                    '<div class="columRight'+a.name+a.id+'">',
                        '<ul class="opRight'+a.name+a.id+' list_style objProperties"></ul>',
                    '</div>',
                '</div>'].join('')
            else if(n == 'oneCollum') return [
                '<div class="colum'+a.name+a.id+'">',
                    '<ul class="op'+a.name+a.id+' list_style objProperties"></ul>',
                '</div>'].join('')
            else return '';
        },
        
        editorWindow: function(a){
            $.sl('window',{name:'edit'+a.name+a.id,title:a.wTitle+': '+a.agrs.name,data:a.wContetn(a),bg:0,drag:1,w:a.wW || 700,h: a.wH || 400,autoclose: false,btn:$.extend({
                'Сохранить':function(){
                    if(a.wNoSave) a.wNoSave(a);
                    else methods.saveValue(a.name,a.id,a.agrs);
                }
            },a.wBtn)},function(wn){
                if(wn == 'close') return;
                
                a.wReady && a.wReady(a);
            })
        },
        
        editByID: function(name,id,callback){
            $.sl('load',incUrl+'showI&i='+name,{mode:'hide',dataType:'json'},function(j){
                LoadObj[name] = j;
                if(typeof callback == 'function') callback(j[id],id);
                else if(typeof callback == 'string') methods[callback](j[id],id);
            })
        },
        
        saveValue: function(name,id,json,callback){
            var origJson = json;
            
            if(typeof json == 'object') json = JSON.stringify(json);
            
            if(!LoadObj[name]) LoadObj[name] = {};
            
            LoadObj[name][id] = origJson;
            
            $.sl('load',incUrl+'saveI&i='+name+'&id='+id,{data:{json:json}},function(j){
                callback && callback(j)
            });
        },
        
        count: function(a){
            var c = 0;
            for(var i in a) c++;
            return c;
        },
        
        defaultWindow: function(a){
            var editItem = function(b,id){
                if(!id && useDemo && methods.count(LoadObj[a.name]) >= a.limit) $.sl('info','Достигнут лимит объектов!')
                else{
                    a.id   = id ? id : hash('_a');
                    
                    a.agrs = $.extend(a.agrs,a.extend,b);
                    a.agrs.id = a.id;
                    
                    a.edit && a.edit(a.agrs);
                    
                    methods.editorWindow(a);
                }
            }
            
            methods.selecterWindow({
                name: a.name,
                title: a.title,
                limit: a.limit,
                list: function(i,s){
                    return a.list ? a.list(i,s) : methods.stpl('withImg',s);
                },
                clickItem: function(i,s,f){
                    a.select && a.select(i,s);
                    f();
                },
                editItem: function(i){
                    methods.editByID(a.name,i,function(j){
                        editItem(j,i);
                    })
                },
                addBtn: function(){
                    editItem()
                },
                playItem: function(i,b){
                    a.playItem && a.playItem(i,b);
                }
            })
        },
        
        selecterWindow: function(a){
            $.sl('load',incUrl+'showI&i='+a.name,{mode:'hide',dataType:'json'},function(j){
                if(j.error) $.sl('info',j.error);
                else{
                    LoadObj[a.name] = j;
                    
                    var name = hash(a.name);
                    
                    function addBox(i,b,ap){
                        var $box = $(a.list(i,b));
                        
                        if(ap) $('.'+a.name+'List').prepend($box);
                        else $('.'+a.name+'List').append($box);
                        
                        $(a.clickSelector || '.img,.sel',$box).click(function(){
                            if(a.clickItem){
                                a.clickItem(i,b,function(){
                                    $.sl('window',{name:a.name,status:'close'});
                                })
                            }
                        })
                        
                        $(a.playSelector || '.play',$box).click(function(){
                            if(a.playItem){
                                a.playItem(i,b,function(){
                                    $.sl('window',{name:a.name,status:'close'});
                                })
                            }
                        })
                        
                        $(a.deleteSelector || '.delete',$box).click(function(){
                            $(this).sl('_del_confirm',incUrl+'delI&i='+a.name+'&id='+i,{error:true},function(){
                                $(this).closest(a.tagItem || 'li').remove();
                                $.sl('update_scroll');
                            });
                        })
                        
                        $(a.editSelector || '.edit',$box).click(function(){
                            if(a.editItem){
                                a.editItem(i,b,function(){
                                    $.sl('window',{name:a.name,status:'close'});
                                })
                            }
                        })
                        
                        $box.on('contextmenu',function(e){
                            e.preventDefault();
                            
                            var menu = {};
                            
                            if(a.clickItem){
                                menu['Выбрать'] = function(){
                                        a.clickItem(i,b,function(){
                                        $.sl('window',{name:a.name,status:'close'});
                                    })
                                }
                            }
                            
                            if(a.playItem){
                                menu['Просмотреть'] = function(){
                                    a.playItem(i,b,function(){
                                        $.sl('window',{name:a.name,status:'close'});
                                    })
                                }
                            }
                            
                            if(a.editItem){
                                menu['Редактировать'] = function(){
                                    a.editItem(i,b,function(){
                                        $.sl('window',{name:a.name,status:'close'});
                                    })
                                }
                            }
                            
                            menu['Клонировать'] = function(){
                                if(useDemo && methods.count(LoadObj[a.name]) >= a.limit) $.sl('info','Достигнут лимит объектов!')
                                else{
                                    var copy = JSON.stringify(LoadObj[a.name][i]);
                                        copy = JSON.parse(copy),
                                        id   = hash('_a');
                                        
                                    methods.saveValue(a.name,id,copy,function(){
                                        addBox(id,copy,true);
                                        
                                        $.sl('update_scroll');
                                    });
                                }
                            }
                            
                            menu['Удалить'] = function(){
                                $(this).sl('_del_confirm',incUrl+'delI&i='+a.name+'&id='+i,{error:true},function(){
                                    $(this).closest(a.tagItem || 'li').remove();
                                });
                            }
                            
                            $(this).sl('menu',menu,{
                                parent: 'body',
                                width: 120,
                                offset: 10,
                                position: 'cursor' // or cursor
                            })
                        })
                    
                        a.item && a.item($box);
                    }
                    
                    $.sl('window',{name:a.name,title:a.title,status:'data',bg:0,drag:1,data:'<ul class="'+a.name+'List itemsSelect list_style t_ul"></ul>',w:400,h:300,btn:{
                        'Добавить':function(){
                            a.addBtn && a.addBtn();
                        }
                    }},function(wn){
                        if(wn == 'close') return;
                        
                        
                        $.each(j,function(i,b){
                            if(a.list) addBox(i,b);
                        })
                        
                        $.sl('update_scroll');
                    })
                }
            })
        },

        /*Курсор на карте*/
        
        newElement:function(i,end,fn){
            if(end){
                if(i == 1) methods.createGraphics();
                else if(i == 3) methods.createMark();
                else if(i == 4) methods.createSound();
                else if(i == 9) methods.createEmiter();
                else if(i == 10) methods.createObject3D();
                else if(i == 11) methods.createAi();
                
            }
            else{
                layers.newElement.show();
                newElementAnim.start();
                newElementPoint.off('click');
                newElementPoint.on('mousedown',function(){
                    dragElem = false;
                })
                newElementPoint.on('click', function(){
                    if(dragElem) return;
                    
                    if(fn) fn();
                    else{
                        newElementAnim.stop();
                        methods.newElement(i,1);
                        layers.newElement.hide();
                    }
                    
                });
            }
        },
        
        /*==================*/
        /* Загрузка скриптов*/
        /*==================*/
        
        <?
        //in load
        include __DIR__.'/in/opValI.js';
        include __DIR__.'/in/map.js';
        include __DIR__.'/in/fileManager.js';
        include __DIR__.'/in/settings.js';
        include __DIR__.'/in/img.js';
        include __DIR__.'/in/audio.js';
        include __DIR__.'/in/n_area.js';
        include __DIR__.'/in/area.js';
        include __DIR__.'/in/graphics.js';
        include __DIR__.'/in/object3D.js';
        include __DIR__.'/in/mark.js';
        include __DIR__.'/in/sound.js';
        include __DIR__.'/in/emiter.js';
        include __DIR__.'/in/ai.js';
        
        //js load
        include __DIR__.'/js/sprite.js';
        include __DIR__.'/js/objects.js';
        include __DIR__.'/js/layers.js';
        include __DIR__.'/js/animations.js';
        include __DIR__.'/js/fx.js';
        include __DIR__.'/js/object3D.js';
        include __DIR__.'/js/font.js';
        include __DIR__.'/js/bullet.js';
        include __DIR__.'/js/tracers.js';
        include __DIR__.'/js/weapons.js';
        include __DIR__.'/js/shellPoint.js';
        include __DIR__.'/js/tracerPoint.js';
        include __DIR__.'/js/sound.js';
        include __DIR__.'/js/tween.js';
        ?>
        
        createOther: function(){
            $.sl('big_select','Элементы карты',{
                menu:[
                    ['Звук','Звуковые эффекты на карте'],
                    ['Линзы','Источники света эметируюшие линзы']
                ]
            },function(i){
                methods.newElement(i+4);
            })
        }
    };
    
    $.fn.buld = function( method ) {
    
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          return methods.init.apply( this );
        }   
    
    };
    
    $.buld = function( method ) {
    
        if ( methods[method] ) {
          return methods[ method ].apply( false,Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( false, arguments );
        } else {
          return methods.init();
        }   
    
    };
    
})(jQuery);

function areaTypeSet(i,id){
    $.buld('areaTypeSet',i,id);
}