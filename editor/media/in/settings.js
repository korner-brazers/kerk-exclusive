loadSettings: function(a){
    dataCache.settings = $.extend(true,{
        tags: {
            none: 'Без',
            object: 'Игрок'
        },
        main: {
            app_id: '',
            api_secret: '',
            screenWidth: 800,
            screenHeight: 500,
            menuOnGame: '',
            soundClick: '',
            soundHover: '',
            soundMenu: '',
            gravitation: 0,
            weaponDefault: '',
            playerDefault: '',
            gameSoundvolume: 0
        },
        server: {
            localOn: 1,
            local: {
                port: 8000,
                dbname: 'game',
                dbuser: 'root',
                dbpassword: '',
                dbhost: 'localhost'
            },
            node: {
                port: 8000,
                dbname: 'game',
                dbuser: 'root',
                dbpassword: '',
                dbhost: 'localhost'
            }
        }
    },a)
},
settingsMainBox: function(){
    methods.editorWindow({
        name: 'settingsMainBox',
        wTitle: 'Настройка игры',
        wContetn: function(a){
            return methods.stpl('oneCollum',a)
        },
        agrs:{
            name:''
        },
        wNoSave: function(){
            methods.saveSettings();
        },
        wW: 500,
        wReady: function(a){
            var box  = $('.op'+a.name+a.id);
            
            methods.opValI('name',{name: 'Настройка приложения'},box);
            methods.opValI('input',{name: 'ID приложения',obj: dataCache.settings.main,value: 'app_id'},box);
            methods.opValI('input',{name: 'Секретный ключ',obj: dataCache.settings.main,value: 'api_secret'},box);
            methods.opValI('number',{name: 'Ширина экрана',obj: dataCache.settings.main,value: 'screenWidth',step:1,fix:1,min: 800},box);
            methods.opValI('number',{name: 'Высота экрана',obj: dataCache.settings.main,value: 'screenHeight',step:1,fix:1,min: 500},box);
            
            methods.opValI('name',{name: 'Меню'},box);
            methods.opValI('btn',{name: 'Карта в меню',value: dataCache.settings.main.menuOnGame ? loadAllMaps[dataCache.settings.main.menuOnGame].name : 'Выбрать'},box,function(btn){
                var arr = [],
                    inx = [],
                    sel = 0;
                    
                $.each(loadAllMaps,function(i,a){
                    if(a.useInMenu){
                        arr.push(a.name);
                        inx.push(i);
                        if(i == dataCache.settings.main.menuOnGame) sel = inx.length-1;
                    }
                })
                
                $(btn).sl('scroll_menu',{
                    menu: arr
                },sel,function(i){
                    dataCache.settings.main.menuOnGame = inx[i];
                    $(btn).text(arr[i]);
                });
            });
            methods.opValI('sound',{name: 'Звук клика',obj: dataCache.settings.main,value: 'soundClick'},box);
            methods.opValI('sound',{name: 'Звук наведения',obj: dataCache.settings.main,value: 'soundHover'},box);
            methods.opValI('sound',{name: 'Звук меню',obj: dataCache.settings.main,value: 'soundMenu'},box);
            
            methods.opValI('name',{name: 'Игра'},box);
            methods.opValI('number',{name: 'Гравитация',obj: dataCache.settings.main,value: 'gravitation',step:0.1,fix: 2},box);
            methods.opValI('weapon',{name: 'Оружие по дефолту',obj: dataCache.settings.main,value: 'weaponDefault'},box);
            methods.opValI('player',{name: 'Игрок по дефолту',obj: dataCache.settings.main,value: 'playerDefault'},box);
            
            methods.opValI('tween',{
                name:'Звук',
                obj:dataCache.settings.main,
                value:'gameSoundvolume',
                tw_time: {value: 1,min: 0,step: 0.1,fix: 2,},
                tw_value: {value: 1,min: 0,max: 1,step: 0.01,fix: 3},
            },box);
            
            $.sl('update_scroll');
        }
    })
},
settingsServerBox: function(){
    methods.editorWindow({
        name: 'settingsServerBox',
        wTitle: 'Настройка сервера',
        wContetn: function(a){
            return methods.stpl('oneCollum',a)
        },
        agrs:{
            name:''
        },
        wW: 500,
        wReady: function(a){
            var box  = $('.op'+a.name+a.id);
            
            methods.opValI('name',{name: 'Основное'},box);
            methods.opValI('checkbox',{name: 'Локальные настройки',obj: dataCache.settings.server,value: 'localOn'},box);
            
            methods.opValI('name',{name: 'Основной Сервер'},box);
            methods.opValI('input',{name: 'Node Порт',obj: dataCache.settings.server.node,value: 'port'},box);
            methods.opValI('input',{name: 'База данных',obj: dataCache.settings.server.node,value: 'dbname'},box);
            methods.opValI('input',{name: 'Имя пользователя',obj: dataCache.settings.server.node,value: 'dbuser'},box);
            methods.opValI('input',{name: 'Пароль от базы',obj: dataCache.settings.server.node,value: 'dbpassword'},box);
            methods.opValI('input',{name: 'Хост',obj: dataCache.settings.server.node,value: 'dbhost'},box);
            methods.opValI('input',{name: 'Порт хоста',obj: dataCache.settings.server.node,value: 'dbport'},box);
            
            methods.opValI('name',{name: 'Локальный сервер'},box);
            methods.opValI('input',{name: 'Node Порт',obj: dataCache.settings.server.local,value: 'port'},box);
            methods.opValI('input',{name: 'База данных',obj: dataCache.settings.server.local,value: 'dbname'},box);
            methods.opValI('input',{name: 'Имя пользователя',obj: dataCache.settings.server.local,value: 'dbuser'},box);
            methods.opValI('input',{name: 'Пароль от базы',obj: dataCache.settings.server.local,value: 'dbpassword'},box);
            methods.opValI('input',{name: 'Хост',obj: dataCache.settings.server.local,value: 'dbhost'},box);
            methods.opValI('input',{name: 'Порт хоста',obj: dataCache.settings.server.local,value: 'dbport'},box);
            
            $.sl('update_scroll');
        },
        wNoSave: function(){
            methods.saveSettings();
        }
    })
},
settingsTagBox: function(){
    var a = {name:'settings',id:'TagBox'};
    
    if($('#settingsTagBox').length) return;
    
    $.sl('window',{
        name: 'settingsTagBox',
        title: 'Теги',
        w: 400,
        h: 300,
        data: methods.stpl('oneCollum',a),
        bg: 0,
        drag: 1,
        btn: {
            'Сохранить': function(){
                methods.saveSettings();
            }
        },
        autoclose: false
    },function(wn){
        if(wn == 'close') return;
        
        var box  = $('.op'+a.name+a.id);
        
        function addBoxTag(id){
            methods.opValI('btn',{name: dataCache.settings.tags[id] + ' ('+id+')',value: 'удалить'},box,function(bn,li){
                if(id == 'none' || id == 'object') $.sl('info','Этот тег нельзя удалить');
                else{
                    delete dataCache.settings.tags[id];
                    li.remove();
                    $.sl('update_scroll');
                }
            });
        }
        
        methods.opValI('btn',{name: 'Новый тег',value: 'добавить'},box,function(){
            
            $(this).sl('_promt',{
                w: 300,
                h: 60,
                btn: {
                    'Добавить':function(wn,form,result){
                        if(form[0].value == '' || form[1].value == '') $.sl('info','Поля не должны быть пустыми');
                        else{
                            var id = form[1].value;
                            dataCache.settings.tags[id] = form[0].value;
                            addBoxTag(id);
                            $.sl('window',{name:wn,status:'close'});
                        }
                    }
                },
                input: [
                    {name:'name',value:'',max:15,holder: 'Краткое название'},
                    {name:'name',value:'',regex: '[^a-z]',max:15,holder: 'Латинскими'},
                ],
                bg: false,
                drag: 1,
                autoclose: false
            })

        })
        
        for(var i in dataCache.settings.tags) addBoxTag(i);
        
        $.sl('update_scroll');
    })
},

settingsTags: function(obj,op,callback){
    var $box = $('<li><span class="l">'+op.name+'</span><div class="r"><div class="sl_btn select">Ξ</div></div></li>').appendTo(obj);
    var a   = {name:'settingsTags',id:'Select'};
    var sel = $('.select',$box);
    var val = checkObject(op.obj[op.value]);
    
    sel.on('click',function(){
        $.sl('window',{
            name:'settingsTagsSelect',
            title: op.name,
            w: 400,
            h: 300,
            data: methods.stpl('oneCollum',a),
            drag: 1,
            bg: 0,
        },function(wn){
            if(wn == 'close') op.obj[op.value] = val;
            else{
                var boxIn  = $('.op'+a.name+a.id);
                
                function addBoxTag(id){
                    methods.opValI('btn',{name: dataCache.settings.tags[id],value: 'удалить'},box,function(bn,li){
                        delete dataCache.settings.tags[id];
                        li.remove();
                        $.sl('update_scroll');
                    });
                }
            
                for(var i in dataCache.settings.tags) callback && callback({
                    box: boxIn,
                    obj: val,
                    name: i,
                    value: i,
                    descr: dataCache.settings.tags[i],
                    fullName: dataCache.settings.tags[i] + ' ('+i+')'
                });
                
                $.sl('update_scroll');
            }
        })
    });
},
settingsTagSelect: function(obj,op,callback){
    var val  = op.obj[op.value];
    if(!dataCache.settings.tags[val]) op.obj[op.value] = 'none';
    var name = dataCache.settings.tags[val] ? dataCache.settings.tags[val] : dataCache.settings.tags.none;
    var $box = $('<li><span class="l">'+op.name+'</span><div class="r"><div class="sl_btn select">'+name+'</div></div></li>').appendTo(obj);
    var a   = {name:'settingsTags',id:'Select'};
    var sel = $('.select',$box);
    
    sel.on('click',function(){
        var menu = [],names = [],n = c = 0; //да чуваки, кастели, да сглупил в билиотеки, да не опытный был, да с кем не бывает, но че делать нуно выкручиватся а писать заново не охото :)
        
        for(var i in dataCache.settings.tags){
            if(i == val) c = n;
            menu.push(dataCache.settings.tags[i]);
            names.push(i);
            n++;
        }
        
        $(this).sl('scroll_menu',{
            menu:menu
        },c,function(b){
            sel.text(menu[b]);
            val = names[b];
            op.obj[op.value] = val;
        });
    });
},