selectWeapons: function(callback){
    methods.defaultWindow({
        title: 'Арсенал',
        limit: 3,
        name: 'weapons',
        list: function(i,s){
            return methods.stpl('simple',s);
        },
        wContetn: function(a){
            return methods.stpl('twoCollum',a);
            return methods.stpl('oneCollum',a);
        },
        wTitle: 'Арсенал',
        extend: {
            name: 'Арсенал',
            descr: '',
            img: '',
            imgDislocation: '',
            imgStore: '',
            bullet: '',
            ammo: 100,
            magazine: 50,
            timerReload: 1200,
            layers: [],
            price: 0,
            premium: 0,
            store: {},
            soundReload: ''
        },
        select: function(i,a){
            callback && callback(i,a)
        },
        wReady: function(a){
            methods.optionWeapons(a,a.agrs);
        }
    })
},
optionWeapons: function(a,ob){
    var opLeft  = $('.opLeft'+a.name+a.id);
    var opRight = $('.opRight'+a.name+a.id);
    
    methods.opValI('name',{name:'Основное'},opLeft);
    methods.opValI('layers',{name:'Cлои',obj:ob,value:'layers'},opLeft);
    methods.opValI('weaponStore',{name:'Прокачка',obj:ob,value:'store'},opLeft);
    methods.opValI('bullet',{name:'Снаряд',obj:ob,value:'bullet'},opLeft);
    methods.opValI('number',{name:'Боеприпасы',obj:ob,value:'ammo',step:1,fix:1,min:0},opLeft);
    methods.opValI('number',{name:'Магазин',obj:ob,value:'magazine',step:1,fix:1,min:0},opLeft);
    methods.opValI('number',{name:'Время перезарядки',obj:ob,value:'timerReload',step:1,fix:1,min:0},opLeft);
    methods.opValI('sound',{name:'Звук перезарядки',obj:a.agrs,value:'soundReload'},opLeft);
    
    methods.opValI('name',{name:'Информация'},opRight);
    methods.opValI('input',{name:'ID',value:a.id},opRight);
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},opRight);
    methods.opValI('textarea',{name:'Описание',obj:ob,value:'descr'},opRight);
    methods.opValI('name',{name:'Изображения'},opRight);
    methods.opValI('images',{name:'В дислокации',obj:ob,value:'imgDislocation'},opRight);
    methods.opValI('images',{name:'В магазине',obj:ob,value:'imgStore'},opRight);
    methods.opValI('number',{name:'Цена',obj:ob,value:'price',step: 1,fix: 1},opRight);
    methods.opValI('checkbox',{name:'Премиум',obj:ob,value:'premium'},opRight);
    $.sl('update_scroll');
},
editWeaponsID: function(id){
    methods.editByID('weapons',id,function(obj){
        methods.editorWindow({
            id: id,
            name: 'weapons',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('twoCollum',a);
                return methods.stpl('oneCollum',a);
            },
            wTitle: 'Арсенал',
            wReady: function(a){
                methods.optionWeapons(a,obj)
            }
        })
    })
},
weaponStore: function(callback,a,g){
    a = checkObject(a);
    
    var boxSort,opLeft,opRight;
    
    function addNewLayer(id){
        var n = a[id];
        
        if(!n){
            id= hash('_w');
            
            a[id] = {
                name: 'Свойство',
                ammo: 0,
                descr: '',
                imgStore: '',
                price: 0,
                magazine: 0,
                timerReload: 0,
                delay: 0,
                stepDeviation: 0,
                stepDistance: 0,
                maxDistance: 0,
                speed: 0
            }
            
            n = a[id];
        }
        
        var bn = methods.opValI('btn',{name:n.name,value: 'Ξ'},boxSort,function(){
            opRight.empty();
            
            methods.opValI('input',{name:'Название',obj:n,value:'name'},opRight,function(v){
                li.find('span').text(v);
            });
            
            methods.opValI('textarea',{name:'Описание',obj:n,value:'descr'},opRight);
            methods.opValI('images',{name:'Изображение в магазине.',obj:n,value:'imgStore'},opRight);
            methods.opValI('number',{name:'Цена',obj:n,value:'price',step: 1,fix: 1},opRight);
            
            methods.opValI('name',{name:'Прокачка'},opRight);
            methods.opValI('number',{name:'Боеприпасы +',obj:n,value:'ammo',step: 1,fix: 1},opRight);
            methods.opValI('number',{name:'Магазин +',obj:n,value:'magazine',step: 1,fix: 1},opRight);
            methods.opValI('number',{name:'Время перезарядки +',obj:n,value:'timerReload',step: 1,fix: 1},opRight);
            methods.opValI('number',{name:'Задержка (ms) +',obj:n,value:'delay',step: 1,fix: 1},opRight);
            
            methods.opValI('number',{name:'Степень отклонения +',obj:n,value:'stepDeviation',step:0.01,fix:4},opRight);
            methods.opValI('number',{name:'Степень дистанции +',obj:n,value:'stepDistance',step:0.001,fix:4},opRight);
            methods.opValI('number',{name:'Мак-ная дистанция +',obj:n,value:'maxDistance',step: 1,fix: 1},opRight);
            
            methods.opValI('number',{name:'Скорость +',obj:n,value:'speed',step: 5,fix: 1},opRight);
            
            $.sl('update_scroll');
        });
        
        
        methods.opValI('joinBtn',{value:'удалить'},bn,function(){
            delete a[id];
            initLayers();
        })
    }
    
    function initLayers(){
        boxSort.empty();
        opRight.empty();
        
        for(var i in a) addNewLayer(i);
        
        $.sl('update_scroll');
    }
    
    $.sl('window',{
        name:'weaponsStore'+g.obj.id,
        title:'Прокачка: '+g.obj.name,
        data:methods.stpl('twoCollum',{name:'wpStore',id: g.obj.id}),
        bg:0,
        drag:1,
        w:800,
        h: 400,
        autoclose: false
    },function(wn){
        if(wn == 'close') return callback(a);
        
        opLeft  = $('.opLeftwpStore'+g.obj.id);
        opRight = $('.opRightwpStore'+g.obj.id);
        
        boxSort = $('<ul class="boxSort'+g.obj.id+' list_style objProperties"></ul>').appendTo('.columLeftwpStore'+g.obj.id)
        
        methods.opValI('btn',{name:'Новое свойство',value: 'добавить'},opLeft,function(){
            addNewLayer();
            $.sl('update_scroll');
        });
        
        initLayers();
    })
},