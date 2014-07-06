/*Выбор изображений*/

selectImg:function(i,fn){
	$.sl('load',incUrl+'selectImg&i='+LastSelectIF,{mode:'hide',dataType:'json'},function(j){
		var li = '';
		
		$.each(j,function(o,s){
			var sp = s[1].split('/');
			
			li += '<li title="'+s[1]+'" class="'+s[0]+'"><img class="ld" /><div class="inf"><span>'+sp[sp.length-1]+'</span></div></li>';
		})
		
		$.sl('window',{title:'Изображения',status: 'data',bg:0,drag:1,size:1,name:'selImg',data:'<ul class="imgSelect t_ul">'+li+'</ul>',w:700,h:500},function(wn){
		    
		    if(wn == 'close') return;
            
			$.each(j,function(o,s){
				var img = $('.imgSelect li:eq('+o+')');
				
                if(s[0] == 'file'){
    				img.on('click',function(){
    					fn && fn(s[1]);
    					$.sl('window',{name:'selImg',status:'close'});
    				});
    				
    				var imageObj = new Image();
    					imageObj.onload = function(){
    						$('img',img).attr({src:s[1]}).removeClass('ld').css({
    							marginTop: imageObj.height > 110 ? 0 : 110 / 2 - (imageObj.height / 2)
    						})
    					};
    					imageObj.src = s[1];
                }
                else{
                    img.on('click',function(){
                        LastSelectIF = s[1];
                        methods.selectImg(s[1],fn);
                    })
                }
			})
		})
	})
},