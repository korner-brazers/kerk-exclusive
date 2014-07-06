/*Виды опций*/

opStpl: function(a,callback){
    
    function setName(){
        var select = a.myIco || 'Выбрать';
        var name =  LoadObj[a.name] &&  LoadObj[a.name][a.op.obj[a.op.value]] ? LoadObj[a.name][a.op.obj[a.op.value]].name : select;
        
        name = name || select;
        
        return {full: name,shot:a.myIco ? name : name.substr(0,8)}
    }
     
    if(a.simple){
        var $box = $('<li><span class="l">'+a.op.name+'</span><div class="r"><div class="sl_btn select">'+(a.myIco ? a.myIco : 'Ξ' )+'</div></div></li>');
    }
    else{
        var $box = $('<li><span class="l">'+a.op.name+'</span><div class="r"><div class="sl_btn select" title="'+setName().full+'">'+setName().shot+'</div><div class="sl_btn remove">✖</div><div class="t_left sls">'+(a.op.obj[a.op.value] ? '<div class="sl_btn play">'+(a.myIco ? a.myIco : a.edit ? 'Ξ' : '►')+'</div>' : '')+'</div></div></li>');
    }
            
    $box.appendTo(a.obj);
    
    var sel = $('.select',$box),
        play= $('.play',$box),
        remo= $('.remove',$box);
        

    sel.on('click',function(){
        var sls = $('.sls',$box);
        
        methods[a.select](function(s,o){
            sls.empty();
            
            $('<div class="sl_btn play">'+(a.myIco ? a.myIco : a.edit ? 'Ξ' : '►')+'</div>').appendTo(sls).click(function(){
                a.play && methods[a.play](s);
            });
            
            a.op.obj[a.op.value] = s;
            
            sel.html(setName().shot);
            if(!a.myIco) sel.attr('title',setName().full)
            
            callback && callback(s,o);
        },a.op.obj[a.op.value],a.op)
    });
    
    play.on('click',function(){
        a.play && methods[a.play](a.op.obj[a.op.value]);
    });
    
    remo.on('click',function(){
        $('.play',$box).remove();
        
        a.op.obj[a.op.value] = null;
        
        sel.html(setName().shot);
        if(!a.myIco) sel.attr('title',setName().full)
        
        callback && callback();
    });
},
opValI:function(i,op,obj,fn){
    if(op.obj == undefined){
        op.obj = {};
        op.obj[op.value] = op.value;
    } 
    
    switch (i){
        case 'textarea': 
            $([
                '<li>',
                    '<span class="l">'+op.name+'</span>',
                    '<div class="r">',
                        '<div class="areaProper" style="height: 100px">',
                            '<textarea class="noxcode" spellcheck="false" style="height: 100px; overflow: auto; width: 98%" name="'+op.area+'"></textarea>',
                        '</div>',
                    '</div>',
                '</li>'
            ].join('')).appendTo(obj).find('textarea').val(op.obj[op.value]).on('keyup',function(){
                op.obj[op.value] = $(this).val();
                fn && fn($(this).val());
            });
        break;
    	case 'input': 
            var $input = $([
                '<li>',
                    '<span class="l">'+op.name+'</span>',
                    '<div class="r">',
                        '<div class="areaProper">',
                            '<textarea class="noxcode" spellcheck="false" name="'+op.area+'" id="'+(op.id||'')+'"></textarea>',
                        '</div>',
                    '</div>',
                '</li>'
            ].join('')).appendTo(obj).find('textarea').val(op.obj[op.value]).on('keyup',function(){
                op.obj[op.value] = $(this).val();
	            fn && fn($(this).val());
            });
            
            if(op.focus) $input.focus();
    	break;
    
    	case 'checkbox': 
            $([
                '<li>',
                    '<span class="l">'+op.name+'</span>',
                    '<div class="r">'+$.scin('checkbox',{value:parseInt(op.obj[op.value])})+'</div>',
                '</li>'
            ].join('')).appendTo(obj).find('.sl_checkbox').on('click',function(){
                var num = parseInt($(this).find('input').val());
                op.obj[op.value] = num;
    	        fn && fn(num);
        	});
    	break;
    
    	case 'select': 
            $([
                '<li>',
                    '<span class="l">'+op.name+'</span>',
                    '<div class="r">'+$.scin('select',{val:op.val,name:op.area,value:parseInt(op.obj[op.value]),callback:function(a){
                        op.obj[op.value] = a;
                        fn && fn(a)
                    }})+'</div>',
                '</li>'
            ].join('')).appendTo(obj);
    	break;
        
        case 'images': 
        
            var $box = $([
                '<li>',
                    '<span class="l">'+op.name+'</span>',
                    '<div class="r">',
                        '<div class="t_p_r imgSelBtn">',
                            '<div class="sel">'+(op.obj[op.value] ? '<div class="imCoop" title="'+op.obj[op.value]+'"><img src="'+op.obj[op.value]+'" class="imgop" /></div>' : '<div class="sl_btn">Выбрать</div>')+'</div>',
                            '<div class="remove'+(op.obj[op.value] ? '' : ' hide')+'">✖</div>',
                        '</div>',
                    '</div>',
                '</li>'
                ].join(''));
            
            $box.appendTo(obj);
            
            var sel = $('.sel',$box),
                remo= $('.remove',$box);
                
            sel.on('click',function(){
                $.buld('selectImg',op.i,function(s){
                    sel.html('<div class="imCoop" title="'+s+'"><img src="'+s+'" class="imgop" /><input type="hidden" name="'+op.area+'" value="'+s+'" /></div>');
                    op.obj[op.value] = s;
                    fn && fn(s);
                    remo.removeClass('hide');
                    $.sl('update_scroll');
                })
            });
            
            remo.on('click',function(){
                sel.html('<div class="sl_btn">Выбрать</div>');
                remo.addClass('hide');
                op.obj[op.value] = '';
                fn && fn('');
                $.sl('update_scroll');
            })
    	break;
        
        case 'btn': 
            return $([
                '<li>',
                    '<span class="l">'+op.name+'</span>',
                    '<div class="r">',
                        '<div class="sl_btn">'+op.value+'</div>',
                    '</div>',
                '</li>'
            ].join('')).appendTo(obj).find('.sl_btn').on('click',function(){ fn && fn(this,$(this).parents('li')) })
        break;
        
        case 'joinBtn':
            $('<div class="sl_btn">'+op.value+'</div>').appendTo(obj.parent()).on('click',function(){ fn && fn(this) })
        break;
        
        case 'sound': 
            
            soundManager.stopAll();
            
            var name = op.obj[op.value] || '/Выбрать';
                name = name.split('/');
                name = name[name.length-1];
            
            var $box = $([
                '<li>',
                    '<span class="l">'+(op.name || 'Аудио')+'</span>',
                    '<div class="r">',
                        '<div class="sl_btn select" title="'+(op.obj[op.value] || '')+'">'+name+'</div>',
                        '<div class="sl_btn remove">✖</div>',
                        '<div class="t_left audio">'+(op.obj[op.value] ? '<div class="sl_btn play">►</div>' : '')+'</div>',
                    '</div>',
                '</li>'
                ].join(''));
            
            $box.appendTo(obj);
            
            var sel = $('.select',$box),
                play= $('.play',$box),
                remo= $('.remove',$box);
                
        
            sel.on('click',function(){
                var audio = $('.audio',$box);
                
                $.buld('selectAudio',function(s){
                    
                    soundManager.destroySound('audio');
                    soundManager.createSound({
                        id: 'audio',
                        url: s
                    });
                    
                    sel.attr({title:s});
                    
                    audio.empty();
                    
                    $('<div class="sl_btn play">►</div>').appendTo(audio).click(function(){
                        if($(this).hasClass('on')) soundManager.pause('audio'),$(this).html('►');
                        else soundManager.play('audio'),$(this).html('ll');
                        
                        $(this).toggleClass('on')
                    });
                    
                    op.obj[op.value] = s;
                    fn && fn(s);
                })
            });
            
            play.on('click',function(){
                soundManager.destroySound('audio');
                soundManager.createSound({
                    id: 'audio',
                    url: op.obj[op.value]
                });
                
                if($(this).hasClass('on')) soundManager.pause('audio'),$(this).html('►');
                else soundManager.play('audio'),$(this).html('ll');
                
                $(this).toggleClass('on')
            });
            
            remo.on('click',function(){
                soundManager.stopAll();
                soundManager.destroySound('audio');
                $('.play',$box).remove();
                op.obj[op.value] = '';
                fn && fn();
            });
    	break;
        
        case 'sprite':
            methods.opStpl({
                obj: obj,
                op: op,
                name: 'sprite',
                select: 'selectSprite',
                play: 'playSpriteID'
            },fn)
    	break;
        
        case 'number': 
            
            var $box = $([
                '<li>',
                    '<span class="l">'+op.name+'</span>',
                    '<div class="r">',
                        '<div class="areaProper">',
                            '<textarea class="noxcode t_left" spellcheck="false" name="'+op.area+'"></textarea>',
                            '<span class="t_right valSim">↨</span>',
                        '</div>',
                    '</div>',
                '</li>'].join(''));
            
            $box.appendTo(obj);
            
            var tofix = function(v){
                if(op.fixed !== undefined) return op.fixed;
                
                v = !parseFloat(v) ? 0 : parseFloat(v);
                var val = v.toFixed(op.fix !== undefined ? op.fix : 2);
                    val = op.min !== undefined ? (val < op.min ? op.min : val) : val;
                    val = op.max !== undefined ? (val > op.max ? op.max : val) : val;
                return parseFloat(val);
            }
            
            var area = $('textarea',$box).val(tofix(op.obj[op.value])),
                fix  = onm = 0,val = 0;
            
            area.on('keyup',function(){
                val = tofix($(this).val());
                area.val(val);
                op.obj[op.value] = val;
        	    fn && fn(val);
        	}).on('mousedown',function(e){
                fix = onm = e.pageY;
                val = area.val();
                val = !parseFloat(val) ? 0 : parseFloat(val);
                op.obj[op.value] = val;
                
                $('body').on('mousemove',function(e){
                    if(onm){
                        val += e.pageY < fix ? op.step : -op.step;
                        fix = e.pageY;
                        val = tofix(val);
                        area.val(val);
                        op.obj[op.value] = val;
                        fn && fn(val);
                    } 
                }).on('mouseup',function(){
                    onm = 0;
                    $('body').unbind('mousemove mouseup');
                }).on('mouseleave',function(){
                    onm = 0;
                    $('body').unbind('mousemove mouseup mouseleave');
                })
        	});
            
    	break;
        
        case 'name': return $('<li class="ti">'+op.name+'</li>').appendTo(obj);
    	break;
        
        case 'fx':
            methods.opStpl({
                obj: obj,
                op: op,
                name: 'fx',
                select: 'selectFX',
                play: 'showFXID'
            },fn)
    	break;
        
        case 'tracer':
            methods.opStpl({
                obj: obj,
                op: op,
                name: 'tracers',
                select: 'selectTracers',
                play: 'playTracerID'
            },fn)
    	break;
        
        case 'bullet':
            methods.opStpl({
                obj: obj,
                op: op,
                name: 'bullet',
                select: 'selectBullet',
                play: 'playBulletID'
            },fn)
    	break;
        
        case 'object':
            var $box = $('<li><span class="l">'+op.name+'</span><div class="r"><div class="sl_btn select">Выбрать</div><div class="sl_btn remove">✖</div></div></li>');
            
            $box.appendTo(obj);
            
            var sel = $('.select',$box),
                remo= $('.remove',$box);
            
            sel.on('click',function(){
                methods.selectObjects({
                    value: op.obj[op.value]
                },function(a){
                    op.obj[op.value] = a;
                    fn && fn(a);
                })
            });
            
            remo.on('click',function(){
                op.obj[op.value] = {};
                fn && fn({});
            });
    	break;
        
        case 'selectMenu':
            op.obj[op.value] = op.obj[op.value] == undefined ? 0 : op.obj[op.value];
            
            var $box = $('<li><span class="l">'+op.name+'</span><div class="r"><div class="sl_btn select">'+op.menu[op.obj[op.value]]+'</div></div></li>');
            
            $box.appendTo(obj);
            
            $('.select',$box).on('click',function(){
                var select = $(this);
                
                $(this).sl('scroll_menu',op.obj[op.value],{
                    menu:op.menu
                },function(i,a){
                    op.obj[op.value] = i;
                    select.text(a);
                    fn && fn(i)
                });
            })
    	break;
        
        case 'selectMenuObject':
            op.obj[op.value] = op.obj[op.value] == undefined ? 0 : op.obj[op.value];
            
            var list = restore_in_a(op.menu);
            var showList = restore_in_a(op.menu,true);
            var viewName = showList[list.indexOf(op.obj[op.value])];
            
            var $box = $('<li><span class="l">'+op.name+'</span><div class="r"><div class="sl_btn select">'+(viewName || 'не установлено')+'</div></div></li>');
            
            $box.appendTo(obj);
            
            $('.select',$box).on('click',function(){
                var select = $(this);
                
                $(this).sl('scroll_menu',list.indexOf(op.obj[op.value]),{
                    menu:showList
                },function(i,a){
                    op.obj[op.value] = list[i];
                    select.text(a);
                    fn && fn(list[i])
                });
            })
    	break;
        
        case 'soundPack':
            methods.opStpl({
                obj: obj,
                op: op,
                name: 'soundPack',
                select: 'selectSoundPack',
                play: 'playSoundPackID'
            },fn)
    	break;
        
        case 'shellPoint':
            methods.opStpl({
                obj: obj,
                edit: 1,
                op: op,
                name: 'shellPoint',
                select: 'selectShellPoint',
                play: 'editShellPointID'
            },fn)
    	break;
        
        case 'tracerPoint':
            methods.opStpl({
                obj: obj,
                edit: 1,
                op: op,
                name: 'tracerPoints',
                select: 'selectTracerPoints',
                play: 'editTracerPointsID'
            },fn)
    	break;
        
        case 'weapon':
            methods.opStpl({
                obj: obj,
                edit: 1,
                op: op,
                name: 'weapons',
                select: 'selectWeapons',
                play: 'editWeaponsID'
            },fn)
    	break;
        
        case 'player':
            methods.opStpl({
                obj: obj,
                edit: 1,
                op: op,
                name: 'objects',
                select: 'selectObject',
            },fn)
    	break;
        
        case 'layers':
            methods.opStpl({
                obj: obj,
                simple: 1,
                op: op,
                select: 'editLayers'
            },fn)
    	break;
        
        case 'weaponStore':
            methods.opStpl({
                obj: obj,
                simple: 1,
                op: op,
                select: 'weaponStore'
            },fn)
    	break;
        
        case 'tags':
            methods.settingsTags(obj,op,fn)
    	break;
        
        case 'tagSelect':
            methods.settingsTagSelect(obj,op,fn)
    	break;
        
        case 'tween':
            op.hash = hash();
            
            methods.opStpl({
                obj: obj,
                simple: 1,
                op: op,
                myIco: '<img src="/editor/media/img/cci.png" />',
                select: 'editTween'
            },fn)
    	break;
        
        case 'animations':
            methods.opStpl({
                obj: obj,
                edit: 1,
                op: op,
                select: 'aadAnimations',
                play: 'editAnimationID'
            },fn)
    	break;
        
        case 'object3D':
            methods.opStpl({
                obj: obj,
                op: op,
                name: 'object3D',
                select: 'selectObject3D',
                play: 'showObject3DID'
            },fn)
    	break;
        
    	default : return '';
    }
},