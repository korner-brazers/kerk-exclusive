selectObject: function(callback){
    
    methods.defaultWindow({
        title: 'Объекты',
        name: 'objects',
        wContetn: function(a){
            return methods.stpl('twoCollum',a);
        },
        limit: 1,
        wTitle: 'Объект',
        extend: {
            name: 'Объект',
            layers: [],
            descr: '',
            info: '',
            img: '',
            mass: 250,
            imgShopping: '',
            imgMedium: '',
            watchSmooth: 8,
            health: 100,
            boxCollisionWidth: 20,
            boxCollisionHeight: 50,
            soundStend: '',
            soundStart: '',
            soundMove: '',
            soundJump: '',
            soundLanding: '',
            soundLife: '',
            soundDistance: 300,
        },
        select: function(i,a){
            callback && callback(i,a)
        },
        wReady: function(a){
            var opLeft  = $('.opLeft'+a.name+a.id);
            var opRight = $('.opRight'+a.name+a.id);
            
            methods.opValI('name',{name:'Основное'},opLeft);
            methods.opValI('layers',{name:'Cлои',obj:a.agrs,value:'layers'},opLeft);
            //methods.opValI('checkbox',{name:'Разворот на месте',obj:a.agrs,value:'watchOfCursor'},opLeft);
            methods.opValI('number',{name:'Сгладить движение',obj:a.agrs,value:'watchSmooth',min: 0,step: 0.5,fix: 3},opLeft);
            methods.opValI('number',{name:'Здоровье',obj:a.agrs,value:'health',step:10,fix:0,min:0},opLeft);
            
            methods.opValI('name',{name:'Бокс столкновения'},opLeft);
            methods.opValI('number',{name:'Ширина',obj:a.agrs,value:'boxCollisionWidth',step:1,fix:0,min:0},opLeft);
            methods.opValI('number',{name:'Высота',obj:a.agrs,value:'boxCollisionHeight',step:1,fix:0,min:0},opLeft);
            
            methods.opValI('name',{name:'Управление'},opLeft);
            //methods.opValI('checkbox',{name:'Машина',obj:a.agrs,value:'carMoving'},opLeft);
            methods.opValI('number',{name:'Скорость',obj:a.agrs,value:'speed',step:.01,fix:3,min:0},opLeft);
            methods.opValI('number',{name:'Масса',obj:a.agrs,value:'mass',step:10,fix:1,min:0},opLeft);
            //methods.opValI('number',{name:'Угол поворота',obj:a.agrs,value:'speedAngle',step:.001,fix:3,min:0},opLeft);
            //methods.opValI('number',{name:'Разгон',obj:a.agrs,value:'acceleration',step:.001,fix:3,min:0},opLeft);
            
            methods.opValI('name',{name:'Прыжок'},opLeft);
            methods.opValI('tween',{
                name:'Импульс',
                obj:a.agrs,
                value:'jump',
                tw_time: {value: 1.5,min: 0,step: 0.1,fix: 2},
                tw_value: {value: 30,step:1,fix:1},
            },opLeft);
            methods.opValI('number',{name:'Прыжок задержка',obj:a.agrs,value:'jumpTimer',step:1,fix:1,min:0},opLeft);
            
            methods.opValI('name',{name:'Звуки'},opLeft);
            //methods.opValI('sound',{name:'На месте',obj:a.agrs,value:'soundStend'},opLeft);
            //methods.opValI('sound',{name:'Начала движения',obj:a.agrs,value:'soundStart'},opLeft);
            methods.opValI('sound',{name:'Движение',obj:a.agrs,value:'soundMove'},opLeft);
            //methods.opValI('sound',{name:'Остановка',obj:a.agrs,value:'soundStop'},opLeft);
            //methods.opValI('sound',{name:'Столкновение',obj:a.agrs,value:'soundCollision'},opLeft);
            methods.opValI('sound',{name:'Прыжок',obj:a.agrs,value:'soundJump'},opLeft);
            methods.opValI('sound',{name:'Приземление ',obj:a.agrs,value:'soundLanding'},opLeft);
            methods.opValI('sound',{name:'Жизнь',obj:a.agrs,value:'soundLife'},opLeft);
            methods.opValI('number',{name:'Дистанция',obj:a.agrs,value:'soundDistance',step:1,fix:2,min:0},opLeft);
            
            /*
            
            methods.opValI('name',{name:'Звуки в далеке'},opLeft);
            //methods.opValI('sound',{name:'На месте',obj:a.agrs,value:'soundStendBlur'},opLeft);
            //methods.opValI('sound',{name:'Начала движения',obj:a.agrs,value:'soundStartBlur'},opLeft);
            //methods.opValI('sound',{name:'Движение',obj:a.agrs,value:'soundMoveBlur'},opLeft);
            //methods.opValI('sound',{name:'Остановка',obj:a.agrs,value:'soundStopBlur'},opLeft);
            //methods.opValI('sound',{name:'Столкновение',obj:a.agrs,value:'soundCollisionBlur'},opLeft);
            methods.opValI('number',{name:'Дистанция',obj:a.agrs,value:'soundDistanceBlur',step:1,fix:2,min:0},opLeft);
            */
            
            methods.opValI('name',{name:'Информация'},opRight);
            methods.opValI('input',{name:'ID',value:a.id},opRight);
            methods.opValI('input',{name:'Название',obj:a.agrs,value:'name'},opRight);
            methods.opValI('input',{name:'Описание',obj:a.agrs,value:'descr'},opRight);
            methods.opValI('textarea',{name:'Информция',obj:a.agrs,value:'info'},opRight);
            methods.opValI('images',{name:'Изображение',obj:a.agrs,value:'img'},opRight);
            //methods.opValI('images',{name:'Изображение покупки.',obj:a.agrs,value:'imgShopping'},opRight);
            //methods.opValI('images',{name:'Изображение ср.',obj:a.agrs,value:'imgMedium'},opRight);
            //methods.opValI('images',{name:'Изображение бол.',obj:a.agrs,value:'imgBig'},opRight);
            //methods.opValI('checkbox',{name:'Безсплатно',obj:a.agrs,value:'free'},opRight);
            //methods.opValI('checkbox',{name:'Премиум',obj:a.agrs,value:'premium'},opRight);
            
            $.sl('update_scroll');
        }
    })
    
},