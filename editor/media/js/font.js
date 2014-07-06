selectFont: function(callback){
    var ob;
    
    methods.defaultWindow({
        title: 'Шрифты',
        limit: 3,
        name: 'font',
        list: function(i,s){
            return methods.stpl('simple',s);
        },
        wContetn: function(a){
            return methods.stpl('twoCollum',a);
        },
        wTitle: 'Шрифт',
        wW: 800,
        extend: {
            name: 'Font',
            chars: [],
            img: '',
            charWidth: 20,
            charHeight: 20,
            imgWidth: 100,
            imgHeight: 40,
            space: 0
        },
        edit: function(a){
            ob = a;
        },
        select: function(i,a){
            callback && callback(i,a);
        },
        wReady: function(a){
            methods.optionFont(a,a.agrs);
        }
    })
},
optionFont: function(a,ob){
    var opLeft  = $('.opLeft'+a.name+a.id);
    var opRight = $('.opRight'+a.name+a.id);
    var boxSort = $('<ul class="boxSort list_style objProperties"></ul>').appendTo('.columLeft'+a.name+a.id)
    
    
    
    var box = $('.columRight'+a.name+a.id+' .overview').empty();
    
    var charsBlock = $('<div class="win_h_size t_p_r" style="overflow: auto; height: 368px" id="cnsFont"><img class="charsImg"><div class="sharsSims"></div></div>').appendTo(box);
    
    var charsSims = $('.sharsSims',charsBlock);
    
    
    var generate = function(clear){
        charsSims.empty();
        
        var w = 0;
        var h = 0;
        var hGrid = Math.round(ob.imgHeight / ob.charHeight);
        
        if(clear){
            ob.chars = [];
        
            function widthGrid(){
                while(w < ob.imgWidth){
                    addChar(w,h);
                    w += ob.charWidth;
                }
            }
            
            for(var i = 0; i < hGrid; i++){
                h = Math.round(ob.charHeight * i);
                w = 0;
                
                widthGrid();
            }
        }
        
        visChars();
    }
    
    var addChar = function(w,h){
        ob.chars.push({
            y: h,
            x: w,
            w: ob.charWidth,
            h: ob.charHeight,
            s: 0
        })
    }
    var visChars = function(){
        charsSims.empty();
        
        for(var i = 0; i < ob.chars.length; i++){
            var ch = ob.chars[i];
            
            charsSims.append('<div id="'+i+'" style="left: '+ch.x+'px; top: '+ch.y+'px; width: '+ch.w+'px; height: '+ch.h+'px"><i>'+(ch.s || '')+'</i></div>')
            
        }
        
        var bl = $('div',charsSims);
        
        bl.on('click',function(){
            bl.removeClass('active');
            $(this).addClass('active');
            selectChar($(this).attr('id'));
        })
    }
    
    var updateElemBox = function(i){
        var a = ob.chars[i];
        
        $('[id = '+i+']',charsSims).css({
            top: a.y,
            left: a.x,
            width: a.w,
            height: a.h
        })
        
        $('[id = '+i+'] i',charsSims).text(a.s);
    }
    
    var selectChar = function(i){
        var op = boxSort.empty(),
            el = ob.chars[i];
        
        methods.opValI('number',{name:'Ширина',obj:el,value:'w',step:1,fix:1,min:0},op,function(){
            updateElemBox(i);
        }); 
        
        methods.opValI('number',{name:'Высота',obj:el,value:'h',step:1,fix:1,min:0},op,function(){
            updateElemBox(i);
        });
        
        methods.opValI('number',{name:'Позиция X',obj:el,value:'x',step:1,fix:1,min:0},op,function(){
            updateElemBox(i);
        }); 
        
        methods.opValI('number',{name:'Позиция Y',obj:el,value:'y',step:1,fix:1,min:0},op,function(){
            updateElemBox(i);
        });
        
        methods.opValI('input',{name:'Символ',obj:el,value:'s',max:1,focus:1},op,function(){
            updateElemBox(i);
        });
        
        $.sl('update_scroll');
    }
    
    methods.opValI('input',{name:'Имя',obj:ob,value:'name'},opLeft);
    
    methods.opValI('images',{name:'Изображение',obj:ob,value:'img'},opLeft,function(src){
        $('.charsImg',charsBlock).attr('src',src);
    });
    
    methods.opValI('number',{name:'Ширина картинки',obj:ob,value:'imgWidth',step:1,fix:1,min:0},opLeft,function(v){
        ob.imgWidth = v;
    }); 
    
    methods.opValI('number',{name:'Высота картинки',obj:ob,value:'imgHeight',step:1,fix:1,min:0},opLeft,function(v){
        ob.imgHeight = v;
    });
    
    methods.opValI('number',{name:'Ширина символа',obj:ob,value:'charWidth',step:1,fix:1,min:0},opLeft,function(v){
        ob.charWidth = v;
    }); 
    
    methods.opValI('number',{name:'Высота символа',obj:ob,value:'charHeight',step:1,fix:1,min:0},opLeft,function(v){
        ob.charHeight = v;
    });
    
    methods.opValI('number',{name:'Пробел',obj:ob,value:'space',step:0.01,fix:2},opLeft);
    
    methods.opValI('btn',{name:'Символы',value:'генерировать'},opLeft,function(v){
        generate(true);
    });
    
    methods.opValI('btn',{name:'Символ',value:'Добавить'},opLeft,function(v){        
        addChar(0,0)
        visChars();
        selectChar(ob.chars.length-1);
    });
    
    $('.charsImg',charsBlock).attr('src',ob.img);
    
    generate();
    
    $.sl('update_scroll');
},
editFont: function(id){
    methods.editByID('font',id,function(obj){
        var ob;
        
        methods.editorWindow({
            id: id,
            name: 'font',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('twoCollum',a);
            },
            wTitle: 'Шрифт',
            wBtn: {
                '►':function(){
                    methods.showFont(ob);
                }
            },
            wW: 800,
            wReady: function(a){
                methods.optionFont(a,obj)
                ob = obj;
            }
        })
    })
},