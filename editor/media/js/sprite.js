selectSprite: function(callback){
    var ob;
    
    methods.defaultWindow({
        title: 'Спрайты',
        limit: 30,
        name: 'sprite',
        list: function(i,s){
            return methods.stpl('playList',s);
        },
        wContetn: function(a){
            return methods.stpl('oneCollum',a);
        },
        wTitle: 'Cпрайт',
        wW: 400,
        wH: 300,
        wBtn: {
            '►':function(){
                methods.playSprite(ob);
            }
        },
        playItem: function(i,a){
            methods.playSprite(a);
        },
        extend: {
            name: 'Спрайт',
            repeatX: 10,
            repeatY: 1,
            frameRate: 25,
            loop: 0,
            width: 0,  //для инфы
            height: 0, //для инфы
            img: ''
        },
        edit: function(a){
            ob = a;
        },
        select: function(i,a){
            callback && callback(i,a);
        },
        wReady: function(a){
            methods.optionSprite(a,a.agrs);
        }
    })
},
optionSprite: function(a,ob){
    var box  = $('.op'+a.name+a.id);
            
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},box);
    methods.opValI('images',{name:'Изображение',obj:ob,value:'img'},box,function(src){
        if(src){
            loadImg(src,false,function(imageObj,w,h){
                ob.width  = w;
                ob.height = h;
            })
        }
    });
    methods.opValI('number',{name:'Колонок в ширину',obj:ob,value:'repeatX',step:1,fix:0,min:1},box);
    methods.opValI('number',{name:'Колонок в высоту',obj:ob,value:'repeatY',step:1,fix:0,min:1},box);
    methods.opValI('number',{name:'Скорость',obj:ob,value:'frameRate',step:1,fix:0,min:1},box);
    methods.opValI('checkbox',{name:'Повторить',obj:ob,value:'loop'},box);
    
    $.sl('update_scroll');
},
editSpriteID: function(id){
    methods.editByID('sprite',id,function(obj){
        var ob;
        
        methods.editorWindow({
            id: id,
            name: 'sprite',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('oneCollum',a);
            },
            wBtn: {
            '►':function(){
                    methods.playSprite(ob);
                }
            },
            wTitle: 'Cпрайт',
            wW: 400,
            wH: 300,
            wReady: function(a){
                methods.optionSprite(a,obj)
                ob = obj;
            }
        })
    })
},

playSpriteID: function(id){
    methods.editByID('sprite',id,function(obj){
        methods.playSprite(obj);
    })
},

playSprite: function(ob){
    loadImg(ob.img,false,function(imageObj,w,h){
        
        var offWidth = w/ob.repeatX, offHeight = h/ob.repeatY;
        var winWidth = offWidth, winHeight = offHeight, id = hash();
        
            winWidth  = winWidth < 100 ? 100 : winWidth;
            winHeight = winHeight < 100 ? 100 : winHeight;
        
        var cns,la,anim;
        
        $.sl('window',{name:'playSprite'+id,data:'<div id="spritePlay'+id+'"></div>',title:'►',bg: false,w: winWidth,h: winHeight+32},function(wn){
            
            if(wn !== 'close'){
                cns = new Kinetic.Stage({
                    container: 'spritePlay'+id,
                    width: winWidth,
                    height: winHeight
                });
                
                la = new Kinetic.Layer();
                
                anim = new Kinetic.Sprite({
                    x: (winWidth - offWidth) / 2,
                    y: (winHeight - offHeight) / 2,
                    image: imageObj,
                    animation: 'an',
                    animations: {an:methods.createSpriteAnimation(ob,offWidth,offHeight)},
                    frameRate: ob.frameRate
                });
                
                la.add(anim),cns.add(la),anim.start();
            }
            else{
                anim.stop(),anim.remove(la),cns.destroy();
            }
        })
    
    })
},
createSpriteAnimation: function(obSprite,offWidth,offHeight){
    var cl = obSprite.repeatX * obSprite.repeatY;
    var an = [];
    
    for(var i = 0; i < cl; i++){
        an.push({
            x: (i % obSprite.repeatX) * (offWidth || obSprite.width/obSprite.repeatX),
            y: Math.floor( i / obSprite.repeatX ) * (offHeight || obSprite.height/obSprite.repeatY),
            width: obSprite.width/obSprite.repeatX,
            height: obSprite.height/obSprite.repeatY
        })
    }
    
    return an;
},
getSpriteOnce: function(id,callback){
    var ob = LoadObj.sprite[id];
    
    if(!ob) ob = {
        repeatX: 1,
        repeatY: 1,
        frameRate: 1
    }
    
    loadImg(ob.img,false,function(imageObj,w,h){
        var offWidth = w/ob.repeatX, offHeight = h/ob.repeatY;
        
        var frame = [{
            x: (0 % ob.repeatX) * offWidth,
            y: Math.floor( 0 / ob.repeatX ) * offHeight,
            width: w/ob.repeatX,
            height: h/ob.repeatY
        }];
        
        var sprite = new Kinetic.Sprite({
            x: 0,
            y: 0,
            image: imageObj,
            animation: 'an',
            animations: {an:frame},
            frameRate: ob.frameRate,
            offset: [frame[0].width/2,frame[0].height/2]
        });
        
        callback && callback(sprite);
    })
},