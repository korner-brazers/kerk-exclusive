/*Выбор audio*/

selectAudio:function(fn){
	$.sl('load',incUrl+'selectAudio&i='+LastSelectAF,{mode:'hide',dataType:'json'},function(j){
		var li = '';
		
		var spc = function(s){
			var sx = s.split('/'),
				st = '';
			
			for(var i = 0; i < sx.length; i++){
				if(sx[i] !== '') st += ':'+'<span class="plf">'+'<span style="color: #ff6c00">'+sx[i].substr(0,1)+'</span>'+sx[i].substr(1)+'</span>';
			}
			
			return st;
		}
		
		$.each(j,function(o,s){
		    if(s[0] == 'file') li += '<li class="t_clear"><div class="nameAudio l" style="width: 80%">'+spc(s[1])+'</div><div class="sl_btn t_right play">></div></li>';
            else li += '<li class="t_clear"><div class="nameAudio l" style="width: 80%">'+spc(s[1] || 'Назад')+'</div></li>';
			
		})
		
		$.sl('window',{name:'selAudio',status: 'data',bg:0,drag:1,size:1,data:'<ul class="audioSelect audList list_style objProperties">'+li+'</ul>',w:700,h:450},function(wc){
			if(wc == 'close') return soundManager.stopAll();
			else{
				$.each(j,function(o,s){
					var aud = $('.audList li:eq('+o+')');
                    
                    if(s[0] == 'file'){
        				$('.nameAudio',aud).click(function(){
    						fn && fn(s[1]);
    						
    						$.sl('window',{name:'selAudio',status:'close'});
    					})
    					
    					$('.play',aud).click(function(){
    						
    						soundManager.createSound({
    							id: 'audio_'+s[1],
    							url: s[1]
    						});
    						
    						$(this).closest('.audList').find('.play').not(this).removeClass('on').html('>');
    						
    						soundManager.stopAll();
    						
    						if($(this).hasClass('on')) soundManager.pause('audio_'+s[1]),$(this).html('>');
    						else soundManager.play('audio_'+s[1]),$(this).html('ll');
    						
    						$(this).toggleClass('on')
    					})
                    }
                    else{
                        aud.on('click',function(){
                            LastSelectAF = s[1];
                            methods.selectAudio(fn);
                        })
                    }
				})
			}
		})
	})
},