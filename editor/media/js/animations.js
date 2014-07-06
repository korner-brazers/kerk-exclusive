aadAnimations: function(callback){
    var agrs = {name: 'Анимация'};
        agrs = methods.extendOptionAnim(agrs);
    
    methods.defaultWindow({
        title: 'Анимации',
        limit: 15,
        name: 'animations',
        list: function(i,s){
            return methods.stpl('simple',s);
        },
        wContetn: function(a){
            return methods.stpl('oneCollum',a);
        },
        wTitle: 'Анимации',
        wW: 400,
        wH: 300,
        extend: agrs,
        select: function(i,a){
            callback && callback(i,a)
        },
        wReady: function(a){
            methods.optionAnimation(a,a.agrs);
        }
    })
},
optionAnimation: function(a,ob){
    var box  = $('.op'+a.name+a.id);
    
    methods.opValI('input',{name:'Название',obj:ob,value:'name'},box);
    methods.opValI('name',{name:'Спрайты'},box);
    methods.opValI('sprite',{name:'На месте',obj:ob.stend,value:'sprite'},box);
    methods.opValI('sprite',{name:'Вперед',obj:ob.moveUp,value:'sprite'},box);
    methods.opValI('sprite',{name:'Назад',obj:ob.moveBottom,value:'sprite'},box);
    methods.opValI('sprite',{name:'Влево',obj:ob.moveLeft,value:'sprite'},box);
    methods.opValI('sprite',{name:'Вправо',obj:ob.moveRight,value:'sprite'},box);
    methods.opValI('sprite',{name:'Погиб',obj:ob.dead,value:'sprite'},box);
    methods.opValI('sprite',{name:'Прыжок',obj:ob.jump,value:'sprite'},box);
    methods.opValI('sprite',{name:'Стрельба',obj:ob.shoot,value:'sprite'},box);
    
    $.sl('update_scroll');
},
extendOptionAnim: function(ob){
    return $.extend({
        stend: {
            sprite: '',
        },
        moveUp: {
            sprite: '',
        },
        moveBottom: {
            sprite: '',
        },
        moveLeft: {
            sprite: '',
        },
        moveRight: {
            sprite: '',
        },
        dead: {
            sprite: '',
        },
        jump: {
            sprite: '',
        },
        shoot: {
            sprite: '',
        }
    },ob)
},
editAnimationID: function(id){
    methods.editByID('animations',id,function(obj){
        obj = methods.extendOptionAnim(obj);
        
        methods.editorWindow({
            id: id,
            name: 'animations',
            agrs: obj,
            wContetn: function(a){
                return methods.stpl('oneCollum',a);
            },
            wTitle: 'Анимации',
            wW: 400,
            wH: 300,
            wReady: function(a){
                methods.optionAnimation(a,obj)
            }
        })
    })
},