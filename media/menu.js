/**
 * Главное меню игры
 * Автор Korner Brazers
 * http://vk.com/korner_brazers
 */

var menu = new function() {
    
    this.sounds = {};
    this.inFullScreen;
    
    this.start = function(){
        $('.loadingMenuProgress').show();
        
        $('.mm').on('mouseenter',function(){
            menu.playSound(LoadObj.settings.main.soundHover,0.2);
        })
        
        $('.cl').on('mousedown',function(){
            menu.playSound(LoadObj.settings.main.soundClick,0.2);
        })
        
        /**ESC чуваки и меню в игре**/
        $(document).on('keydown',function(e){
            if((e.keyCode == 27 || e.which == 27) && dataCache.initGame && !dataCache.inGameMenu) menu.show_GameMenu();
            if(e.keyCode == 192) menu.consoleLogShowHide()
        })
        
        menu.loading(0);
    }
    
    /** Загрузка меню **/
    
    this.loading = function(step){
        var a,i = 0,m;
        
        step++;
        
        switch (step){
            case 1:
                /** Грузим шрифты **/
                font.loading(function(){
                    menu.loading(step);
                })
            break; 
            case 2:
                /**Грузим все картинки**/
                a = restore_in_a(dataCache.imagesLoadMenu);
                
                stepLoad(a,function(i,next){
                    loadImg(dataCache.imagesLoadMenu[a[i]],false,function(imgObj,w,h){
                        dataCache.imagesLoadMenu[a[i]] = imgObj;
                        next && next();
                    })
                },function(){
                    menu.loading(step);
                })
                
        	break;
        
        	default: setTimeout(function(){
        	   menu.ready();
        	},1000)
        }
    }
    
    /****READY LOADING****/
    /** После загрузки показываем меню **/
    
    this.ready = function(){
        menu.toggleGame('mainMenu');
        
        $('.loadingMenuProgress').hide();
        $('.iconsGame').show();
        
        /**Ищем все шрифты в dom и создание их**/
        $.each($('.tis'),function(){
            $(this).html(font.create('fontMicraSimple',$(this).attr('alt'),$(this).attr('size')));
        })
        
    }
    
    this.readyMenu = function(){
        /** Показываем шан бонус **/
        menu.profileBonusMoney();
    }
    
    /****CONSOLE****/
    /** Показываем ошибки с сервера **/
    
    this.consoleLogShowHide = function(){
        var cnl = $('#consoleLog'),
            cnd = $('.consoleLogData',cnl).empty();
        
        if(cnl.is(':visible')) cnl.hide();
        else{
            
            for(var i in dataCache.console){
                $('<p>'+dataCache.console[i]+'</p>').appendTo(cnd);
            }
            
            cnl.show();
            
            menu.updateScroll('.consoleLogScroll');
        }
    }
    
    /****SHOW CONTENT****/
    /** Показываем контенты в меню **/
    
    this.show = function(n,s){
        var a = s || {};
        var el = $('#MenuBlocks'),cl = 'active',ac = $('.block.'+cl,el),se = $('#m_'+n,el);
            
        if(se.hasClass(cl)) a.callback && a.callback();
        else{
            if(n) menu.playSound(LoadObj.settings.main.soundMenu,1,0,1);
            
            ac.hide().removeClass(cl);
            
            if(a.black) se.addClass('black');
            else se.removeClass('black');
            
            se.show().addClass(cl);
            
            if(n) $('.showOnlyInGame').hide();
            else $('.showOnlyInGame').show();
            
            a.callback && a.callback();
        }
    }
    
    this.visible = function(n){
        if($('#m_'+n).hasClass('active')) return true;
    }
    
    /****SWITH GAME****/
    /** Переключатель меню и игры **/
    
    this.toggleGame = function(n){
        var bg   = $('#bgMenu').hide(),
            load = $('.loadingGameProgress');
        
        /** Показываем загрузку контента **/
        if(n == 'load'){
            kerk.destroyGame();
            bg.hide();
            menu.show();
            menu.toggleCursor();
            load.show();
        }
        /** Переключение на второстепенное меню **/
        else if(n == 'menu'){
            menu.toggleCursor(1);
            dataCache.inGame = 0;
            load.hide();
        }
        /** Переключаем на игру **/
        else if(n == 'game'){
            if(dataCache.show_Score) menu.show('score');
            else if(dataCache.show_Dislocation) menu.show_Dislocation();
            else if(dataCache.initGame){
                dataCache.inGame = 1;
                menu.toggleCursor(0);
                menu.show();
            }
            
            dataCache.inGameMenu = dataCache.show_userMenu = 0;
        }
        /** Переключаем на основное меню **/
        else if(n == 'mainMenu'){
            dataCache.inGameMenu = dataCache.inGame = dataCache.show_userMenu = 0;
            
            if(LoadObj.settings.main.useMenuGame && LoadAllMap[LoadObj.settings.main.menuOnGame]){
                menu.toggleGame('load');
                kerk.startGame({
                    map_id: LoadObj.settings.main.menuOnGame,
                    load: function(){
                        menu.show_Main();
                        dataCache.inGameMenu = 1;
                        menu.toggleCursor(1);
                        load.hide();
                        menu.readyMenu();
                    }
                })
            }
            else{
                kerk.destroyGame();
                menu.show_Main();
                
                menu.toggleCursor(1);
                bg.show();
            }
        }
    }
    
    /****TOGGLE CURSOR****/
    /** Показываем или прячем курсор **/
    
    this.toggleCursor = function(n){
        $('body').css({cursor:n ? 'default' : 'none'});
    }
    
    this.updateProfile = function(){
        menu.serverLoadData('profile',{},function(j){
            if(!j.error){
                Profile = j;
                menu.updateMoney();
            } 
        },true)
    }
    
    /****PURSHARE****/
    /** Когда покупаем что-та **/
    
    this.serverPurchase = function(a){
        menu.serverLoadData('store',a.data,function(j){
            if(j.error){
                if(j.error == 'noMathMoney') a.error(j)
                else menu.eMass({html:j.error});
            }
            else if(a.call){
                Profile = j;
                a.call(j);
            } 
        },true)
    }
    
    this.getPurchase = function(item,a,callback){
        if(item == 'weapon' && LoadObj.weapons[a.id]){
            if(Profile.weapons[a.id]) return menu.eMass({html:'Ошибка данных, оружие уже куплено!'});
            else{
                menu.serverPurchase({
                    data: {
                        id: a.id,
                        name: item
                    },
                    error: function(){
                        menu.getPurchase('money');
                    },
                    call: function(j){
                        callback && callback(j);
                    }
                })
            }
        }
        else if(item == 'weaponAddon' && LoadObj.weapons[a.weapon] && LoadObj.weapons[a.weapon].store[a.id]){
            if(Profile.weapons[a.weapon] && Profile.weapons[a.weapon][a.id]) return menu.eMass({html:'Ошибка данных, оружие уже куплено!'});
            else{
                menu.serverPurchase({
                    data: {
                        weapon: a.weapon,
                        id: a.id,
                        name: item
                    },
                    error: function(){
                        menu.getPurchase('money');
                    },
                    call: function(j){
                        callback && callback(j);
                    }
                })
            }
        }
        else if(item == 'money'){
            var content    = $('.eMass .html').empty();
            var countMoney = 0;
            var amount     = discount = 0;
            
            var $box =  $([
                '<ul class="t_ul money">',
                '</ul>'
            ].join('')).appendTo(content);
            
            function addToBox(price,vote){
                if(countMoney == 0) amount   = parseInt(price);
                else                discount = parseInt(price)-(parseInt(vote)*amount);
                
                var $li = $([
                    '<li class="t_clearfix">',
                        '<img src="/images/game/money/',price,'.png" />',
                        (countMoney > 0 ? '<h1>Скидка '+Math.round(discount)+'$</h1>' : ''),
                        '<div class="dic buy">Купить</div>',
                        '<div class="vote">',
                            '<div class="t_left amount">',vote,'</div>',
                            '<div class="t_over">за<br />голосов</div>',
                        '</div>',
                        '<div class="t_clear"></div>',
                        '<div class="sep"></div>',
                    '</li>'
                ].join('')).appendTo($box);
                
                $('.buy',$li).on('click',function(){
                    VK.callMethod('showOrderBox', {
                        type: 'item',
                        item: 'money.'+price
                    });
                    
                    dataCache.purchase = {
                        name: 'money'
                    };
                })
                
                countMoney++;
            }
            
            for(var i in money) addToBox(i,money[i]);
            
            menu.eMass({
                noError: true,
                width: 600
            });
        }
        else{
            return menu.eMass({html:'Недоступное значение, ошибка данных!'});
        }
    }
    
    this.purchaseSomething = function(){
        if(dataCache.purchase.name == 'money'){
            
        }
        
        menu.updateProfile();
    }
    
    this.purchaseError = function(a){
        menu.eMass({html:'Ошибка при оплате, код ошибки ('+a+')'});
    }
    
    /****TOOLS****/
    /** Дополнительные инструменты **/
    
    this.updateScroll = function(n,p,m){
        /** Да потому что через жопу сделали, а кто знал, приходится вправлять им в жопу)) **/
        setTimeout(function(){
            var sc = $(n);
            if(sc.hasClass('mCustomScrollbar')){
                sc.mCustomScrollbar("update")
                p && sc.mCustomScrollbar("scrollTo",p)
            }
            else sc.mCustomScrollbar({
                scrollInertia: 200
            });
            
            !$('.mCS_no_scrollbar',sc).length && !m ? sc.css({marginRight:'-20px'}) : sc.css({marginRight:0});
        },100)
    }
    
    this.fullscreen = function(){
        if(BigScreen.enabled) BigScreen.toggle();
    }
    
    this.resizeScrren = function(out){
        var w = screen.availWidth,
            h = screen.availHeight,
            s = out ? dataCache.screen[0] : dataCache.screen[dataCache.settings.screen],
            fw = s[0] > w ? w : s[0],
            fh = s[1] > h ? h : s[1],
            p  = {width: fw,height: fh};
            
        if(out || menu.inFullScreen){
            
            settings.screen[0] = fw;
            settings.screen[1] = fh;
            
            $('#MenuBlocks .block, #Game').css(p);
            
            $('#MenuBlocks .block .retive').css({
                padding: Math.round((fh-440)/2)+'px '+Math.round((fw-720)/2)+'px'
            })
            
            kerk.resizeScreen(out)
        }
    }
    
    /** Связь с сервером **/
    
    this.serverString = function(s){
        return '/index.php?auth_key='+auth_key+'&user_id='+user_id+'&viewer_id='+viewer_id+'&uhash='+uhash+'&do='+s;
    }
    
    this.serverLoadData = function(ac,data,fn,error){
        $.post(menu.serverString(ac),{data:data||0},function(j){
            if(!error && menu.serverCheckError(j)) return;
            
            fn && fn(j);
        },'json');
    }
    
    this.serverCheckError = function(j){
        if(j.error) return menu.error(j.error);
    }
    
    /** Включаем музон в меню, там шелчки клики и тд **/
    
    this.playSound = function(name,vol,loop,volrand){
        if(!menu.sounds[name]){
            menu.sounds[name] = new Audio;
            menu.sounds[name].src = name;
            menu.sounds[name].load();
            
            menu.sounds[name].addEventListener('ended', function(){
                this.pause();
            })
        }
        
        menu.sounds[name].pause();
        menu.sounds[name].duration > 0.025 && (menu.sounds[name].currentTime = 0.0);
        menu.sounds[name].volume = volrand ? random(0.2,1,1): vol || 1;
        menu.sounds[name].loop = loop || false;
        menu.sounds[name].play();
    }
    
    this.stopSound = function(name){
        if(menu.sounds[name]) menu.sounds[name].pause();
    }
    
    /** Вывод сообшения **/
    
    this.eMass = function(a){
        var box    = $('.eMass').show(),
            cont   = $('.content',box),
            bg     = $('.eMassBg').show(),
            data   = $('.data',box).css({width: a.width || 260}),
            html   = $('.html',box),
            close  = $('.close',box),
            ico    = $('.ico',box).hide(),
            menuBl = a.noHide ? $('#MenuBlocks') : $('#MenuBlocks').hide(),
            width  = data.width(),
            height = 0;
        
        if(a.html) html.html(a.html);
        if(!a.noError) ico.show();
        
        height = a.height ? a.height : data.height()+19;
        
        if(a.black) cont.addClass('black');
        else cont.removeClass('black');
        
        box.css({
            width: width,
            height: height,
            marginLeft: -width/2,
            marginTop: -height/2
        })
        
        this.playSound(settings.menuSoundShow,1,0,1);
        
        close.unbind('click').on('click',function(){
            box.hide();
            bg.hide();
            menuBl.show();
        })
    }
    
    this.eMassHide = function(){
        $('.eMass,.eMassBg').hide()
        $('#MenuBlocks').show()
    }
    
    /****END TOOLS****/
    
    /****START CUSTOM MENU****/
    /** Блоки основного меню **/
    
    this.show_Main = function(){
        menu.show('main');
        
        $.each($('.mainMenu li'),function(){
            $(this).html(font.create('fontMicra',$(this).attr('alt'),0.9));
        })
    }
    
    /** Мультиплеер **/
    
    this.show_Server = function(){
        var servMaxPlayers  = $('.servMaxPlayers'),
            servImg         = $('.servImg'),
            servMapName     = $('.servMapName'),
            servMode        = $('.servMode'),
            servTime        = $('.servTime'),
            servName        = $('.servName'),
            servCreateBtn   = $('.servCreateBtn');
        
        var countMap = [], cj = 0,
            mygame = {
                name: 'Server',
                mode: 0,
                maxPlayers: 0,
                time: 4
            };
        
        $.each(LoadAllMap,function(i,a){
            if(a.multiplayer) countMap[countMap.length] = i;
        });
        
        var setMap = function(i){
            $('img',servImg).attr({src: LoadAllMap[countMap[i]].preview});
            
            servMapName.html(font.create('fontMicraSimple',LoadAllMap[countMap[i]].name.toLowerCase(),0.5));
            
            mygame.maxPlayers = mygame.maxPlayers > LoadAllMap[countMap[i]].maxPlayers ? LoadAllMap[countMap[i]].maxPlayers : 4;
            
            $('div',servMaxPlayers).text(mygame.maxPlayers);
            
            mygame.map_id = countMap[i];
        }
        
        servImg.unbind('click').on('click',function(){
            setMap(cj = ++cj >= countMap.length ? 0 : cj);
        })
        
        setMap(0);
        
        servMaxPlayers.unbind('click').on('click',function(){
            mygame.maxPlayers = mygame.maxPlayers+4 > LoadAllMap[countMap[cj]].maxPlayers ? 4 : mygame.maxPlayers+4;
            $('div',this).text(mygame.maxPlayers);
        })
        
        servMode.unbind('click').on('click',function(){
            $('div',this).text(menu.getModeGame(mygame.mode = ++mygame.mode > 2 ? 0 : mygame.mode));
        })
        
        servTime.unbind('click').on('click',function(){
            mygame.time = mygame.time+4 > 24 ? 4 : mygame.time+4;
            $('div',this).text(mygame.time);
        })
        
        $('div',servMode).text(menu.getModeGame(0));
        
        servName.unbind().on('keyup',function(){
            mygame.name = $(this).val().substr(0,20).replace(/<\/?[^>]+>/gi, '');
            
            $(this).val(mygame.name);
        })
        
        servCreateBtn.unbind('click').on('click',function(){
            if(!dataCache.connectServer) return menu.eMass({html:'Не подключены к серверу!<br />Разрыв подключения к серверу, подождите минуту или обновите страницу'});

            mygame.user_id = user_id;
            
            servCreateBtn.unbind('click');
            mp.emit('createGame',mygame);
        })
        
        menu.show('server',{callback:function(){
            servName.focus();
            mp.emit('gelListMaps');
        }});
        
        menu.updateScroll('#ScrollSR');
    }
    
    /** Показываем список комнат **/
    
    this.serverListMaps = function(j){
        var box = $('#servListMaps').empty(),
            servConnect = $('.servConnectShow');
        
        dataCache.connectServer ? servConnect.hide() : servConnect.show();
        
        $.each(j,function(i,a){
            if(a.total >= a.maxPlayers) return;
            
            var time = timeEnd(a.timeNow,a.time + a.timeEnd);
            
            $([
                '<div class="lineBlock hover">',
                    '<div class="lc lf">',
                        '<div class="pd">',
                            '<h3 class="glow">'+(a.name || 'unknown')+'</h3>',
                            '<ul class="t_ul">',
                                '<li class="glow">'+LoadAllMap[a.map_id].name+'</li>',
                                '<li class="glow">'+menu.getModeGame(a.mode)+'</li>',
                            '</ul>',
                        '</div>',
                    '</div>',
                    '<div class="lc rf">',
                        '<div class="pd">',
                            '<b class="glow players">'+a.lastTotal+'/'+a.maxPlayers+'</b>',
                            '<span class="glow endTime">'+(time[0]+':'+time[1]+':'+time[2])+'</span>',
                        '</div>',
                    '</div>',
                    
                    '<div class="t_clear lij"><b class="lh"></b><b class="rh"></b></div>',
                '</div>'
            ].join('')).appendTo(box).on('click',function(){
                mp.emit('join',{
                    room_id: a.room_id,
                    name: 'player',
                    user_id: user_id
                });
            })
        })
        
        menu.updateScroll('#ScrollSR');
        
        clearTimeout(menu.timeServerMaps);
        
        menu.timeServerMaps = setTimeout(function(){
            if($('#m_server').hasClass('active')) mp.emit('gelListMaps');
        },3000);
    }
    
    this.getModeGame = function(i){
        var mode = [
            'TD',
            'TDM',
            'CAP'
        ]
        
        return mode[i] ? mode[i] : 'NONE';
    }
    
    /** Меню в игре **/
    
    this.show_GameMenu = function(){
        menu.toggleGame('menu')
        menu.show('gameMenu')
        dataCache.show_userMenu = 1;
    }
    
    /** Выбор команды **/
    
    this.show_SelectTeam = function(){
        dataCache.show_SelectTeam = true;
        
        function selectTeam(selectTeam){
            var count = [0,0],team = 0;
                
            for(var i in dataCache.statusRoom.players){
                if(i !== unitid){
                    var player = dataCache.statusRoom.players[i];
                    
                    if(player.team > 1) count[1]++;
                    else count[0]++;
                }
            }
            
            if(count[0] >= dataCache.statusRoom.maxPlayers) team = 2;
            else if(count[1] >= dataCache.statusRoom.maxPlayers) team = 1;
            else team = selectTeam;
            
            mp.emit('selectTeam',team,function(){
                if(dataCache.initGame) menu.show_Dislocation();
                
                dataCache.show_SelectTeam = false;
                
                $('.teamSelect').hide();
            })
        }
        
        $('.teamSelect').show();
        
        $('#get_ru_team').unbind().on('click',function(){
            selectTeam(1);
        });
        
        $('#get_us_team').unbind().on('click',function(){
            selectTeam(2);
        })
    }
    
    /** Список точек в игре **/
    
    this.dislocationList = function(dsList,a){
        if(!dataCache.dislocation) dataCache.dislocation = {
            id: a.id,
            position: {x: a.x,y: a.y}
        };
        
        $([
            '<li class="'+(dataCache.dislocation.id == a.id ? 'active' : '')+'"><h3>'+a.markName+'</h3><span>X:'+Math.round(a.x)+' Y:'+Math.round(a.y)+'</span></li>'
        ].join('')).appendTo(dsList).on('click',function(){
            $('li',dsList).removeClass('active');
            
            $(this).addClass('active');
            
            dataCache.dislocation = {
                id: a.id,
                position: {x: a.x,y: a.y}
            }
        })
    }
    
    /** Выбор оружия в дислокации **/
    
    this.showSelectWeapon = function(){
        var bWeapons   = $('#dslWeapons').empty();
        var countAdded = 0;
        
        function addToBox(i,id,pweapon){
            $('<div class="dsSelectWeapon">'+pweapon.name+'</div>').appendTo(bWeapons).on('click',function(){
                dataCache.settings.selectWeapons[i] = id;
                menu.showSelectWeapon();
            })
            
            countAdded++;
        }
        
        function selectWeapon(i){
            var select = dataCache.settings.selectWeapons[i],
                weapon = LoadObj.weapons[select];
                
            var $html = $([
                '<div class="wblc t_claerfix">',
                    '<div class="img hic t_left">',
                        '<div class="image">'+(weapon ? '<img src="'+weapon.imgDislocation+'" />' : '')+'</div>',
                    '</div>',
                    '<div class="t_over">',
                        '<h3 class="glow name">'+(weapon ? weapon.name : '')+'</h3>',
                        '<span class="glow select">Выбрать</span>',
                    '</div>',
                    
                '</div>'
            ].join('')).appendTo(bWeapons);
            
            $('.select',$html).on('click',function(){
                countAdded   = 0; //чистим счетчик
                bWeapons.empty(); //чистим контейнер
                
                /** Проверяем доступность шаровой пушки **/
                var weaponDefault = LoadObj.weapons[LoadObj.settings.main.weaponDefault],
                    findInSelect  = dataCache.settings.selectWeapons.indexOf(LoadObj.settings.main.weaponDefault),
                    inProfile = Profile.weapons[LoadObj.settings.main.weaponDefault];
                
                /** Если есть по дефолту и нет в моих выбранных то добавим шаровую пушку **/
                if(weaponDefault && findInSelect < 0 && !inProfile) addToBox(i,LoadObj.settings.main.weaponDefault,weaponDefault);
                
                /** Смотрим что у нас в профиле за пушки **/
                for(var w in Profile.weapons){
                    if(LoadObj.weapons[w] && dataCache.settings.selectWeapons.indexOf(w) < 0) addToBox(i,w,LoadObj.weapons[w])
                }
                
                /** Если нечего выбирать то показываем заново **/
                if(!countAdded) menu.showSelectWeapon();
                else menu.updateScroll('#dsWeaponsScroll','top');
            })
        }
        
        for(var i = 0; i < 3; i++) selectWeapon(i);
        
        menu.updateScroll('#dsWeaponsScroll','top');
    }
    
    /** Дислокация **/
    
    this.show_Dislocation = function(){
        if(menu.visible('dislocation') || !dataCache.startGame) return;
        
        var bDeploy  = $('#dslDeploy');
            
        bDeploy.unbind('click').on('click',function(){
            
            mp.emit('addPlayer',{
                user_id: user_id,
                player_id: LoadObj.settings.main.playerDefault,
                weapons: dataCache.settings.selectWeapons,
                point: dataCache.dislocation.id,
                controller: kerk.myController()
            })
            
        })

        menu.toggleGame('menu');
        menu.show('dislocation');
        menu.showSelectWeapon();
        
        dataCache.show_Dislocation = true;
    }
    
    /** Готов к высадки и показываем игру **/
    
    this.readyDislocation = function(){
        dataCache.show_Dislocation = false;
        menu.toggleGame('game');
    }
    
    /** Сортировка по очкам **/
    
    this.sortByScore = function(arr){
        var sor = [],res = {};
        
        for(var id in arr) sor.push([id, arr[id].score]);
        
        sor.sort(function(a, b){
            return a[1] - b[1];
        });
        
        sor.reverse();
        
        for(var i = 0; i < sor.length; i++) res[sor[i][0]] = arr[sor[i][0]];
        
        return res;
    }
    
    /** Показываем кто круче в игре **/
    
    this.show_Score = function(a){
        var coller = kerk.myController();
        
        /** если пользователь включил меню то не че не делаем **/
        if(dataCache.show_userMenu) return;
        
        /** если не нажат TAB и нет выбора команды и сервер не обьявил о новом раунде то **/
        if(!coller.tab && !dataCache.show_SelectTeam && !a.newgame){
            /** если конец раунда то **/
            if(dataCache.show_EndGame){
                /** прячим все лишнее **/
                $('.endGameInfo,.teamSelect').hide();
                
                /** уничтожаем игрока что-бы не мишал камере **/
                kerk.destroyMyPlayer();
                
                /** обратно показываем высодку человека на луну))) **/
                menu.show_Dislocation();
                
                /** отключаем индекатор **/
                dataCache.show_EndGame = 0;
            }
            /** если мы выводим результат матча то **/
            else if(dataCache.show_Score){
                /** правим баг когда идет проверка показывать ли нам снова результат в toggleGame('game') **/
                dataCache.show_Score = 0;
                
                /** переключаем на игру **/
                menu.toggleGame('game');
            } 
        }
        else{
            /** выводим результат **/
            
            menu.toggleGame('menu');
            
            var box1 = $('#ru_score'),
                box2 = $('#us_score'),
                box3 = $('#all_score'),
                th   = '<tr><th>Имя</th><th style="width: 40px">K</th><th style="width: 40px">D</th><th style="width: 70px">Очки</th><th style="width: 30px">PING</th><th style="width: 30px"></th></tr>',
                rBox = $('.s_table',box1).html(th),
                uBox = $('.s_table',box2).html(th),
                aBox = $('.s_table',box3).html(th);
            
            players = menu.sortByScore(a.players);
            
            for(var i in players){
                var data = players[i];
                
                if((i == unitid && !data.ingame) || data.ai) continue;
                
                $('<tr class="t_point '+(i == unitid ? 'active' : '')+'"><td><div>'+data.name+'</div></td><td><div>'+fixDigit(data.kill || 0)+'</div></td><td><div>'+fixDigit(data.die || 0)+'</div></td><td><div>'+fixDigit(data.score || 0)+'</div></td><td><div>'+(data.ping || 0)+'</div></td><td><div><img src="/images/def/'+(data.ingame ? data.dead ? 'isc' : 'isc-03' : 'isc-02')+'.png" style="height: 8px" /></div></td></tr>').appendTo(a.mode > 0 ? (data.team > 1 ? uBox : rBox) : aBox);
            }
            
            $('#score_team,#score_one').hide();
            
            if(a.mode !== 0){
                $('#score_team').show();
                
                menu.show('score');
                menu.updateScroll(box1,'top',1);
                menu.updateScroll(box2,'top',1);
            }
            else{
                $('#score_one').show();
                
                menu.show('score');
                menu.updateScroll(box3,'top',1);
            }
            
            $('#ru_total_score span').text(a.tic_1);
            $('#us_total_score span').text(a.tic_2);
            
            var teamVin    = a.tic_1 > a.tic_2 ? 1 : 2;
            var playerTeam = a.players[unitid].team;
            
            if(a.newgame && !dataCache.show_SelectTeam){
                $('.endGameInfo').hide();
                $('.timeNextRound').show();
                
                if(a.mode > 0){
                    if(playerTeam == teamVin) $('.teamVictory').show();
                    else $('.teamDefeat').show();
                }
                
                $('.timerNext').text(leadZero(Math.round((15000 - (a.timeNow - a.time))/1000),2))
            }
            
            dataCache.show_Score = 1;
        }
        
        if(dataCache.show_Dislocation){
            var dsList = $('#dslPointList').empty();
            var playerTeam = a.players[unitid].team;
            
            for(var i in a.point){
                var point = LoadMap.point[i];
                
                if(point){
                    point.id = i;
                    
                    if(a.mode == 2){
                        point.base_ru && playerTeam == 1 && menu.dislocationList(dsList,point);
                        point.base_us && playerTeam == 2 && menu.dislocationList(dsList,point);
                        
                        a.point[i].team == playerTeam && menu.dislocationList(dsList,point);
                    }
                    else if(point.debark) menu.dislocationList(dsList,point);
                }
            }
            
            menu.updateScroll('#dslScroll');
        }
    }
    
    /** Наш прикрасный магазинчек **/
    
    this.weaponStatusUp = function(id,is_addon){
        var weapon   = LoadObj.weapons[id];
        var isBullet = LoadObj.bullet[weapon.bullet];
        var box    = $('#weaponAddonLines').empty();
        var max    = {
            ammo: 100,
            magazine: 0,
            timerReload: 0,
            delay: 0,
            stepDeviation: 0,
            stepDistance: 0,
            maxDistance: 0
        };
        
        function addLine(name,type,val,reverse){
            var adde = is_addon ? is_addon[type] : 0;
            var wi   = Math.abs(adde/max[type])*100;
            var wid  = reverse ? 100-(val/max[type])*100 : (val/max[type])*100;
            
            $('<li><span>'+name+'</span><div class="val">'+fixLead(val+adde)+'</div><div class="blcx"><div class="white" style="width: '+wid+'%"></div><div class="admn '+(adde > 0 ? 'green' : 'red')+'" style="width: '+wi+'%; left:'+wid+'%; margin-left: '+(adde > 0 ? 0 : -wi)+'%"></div></div></li>').appendTo(box);
        }
        
        function getStoreVal(store,isview){
            var addo = {
                ammo: 0,
                magazine: 0,
                timerReload: 0,
                delay: 0,
                stepDeviation: 0,
                stepDistance: 0,
                maxDistance: 0
            };
            
            $.each(store,function(i,a){
                if(isview && !Profile.weapons[id]) return;
                if(isview && Profile.weapons[id] && !Profile.weapons[id][i]) return;

                addo.ammo = addo.ammo + a.ammo;
                addo.magazine = addo.magazine + a.magazine;
                addo.timerReload = addo.timerReload + a.timerReload;
                addo.delay = addo.delay + a.delay;
                addo.stepDeviation = addo.stepDeviation + a.stepDeviation;
                addo.stepDistance = addo.stepDistance + a.stepDistance;
                addo.maxDistance = addo.maxDistance + a.maxDistance;
                
            })
            
            return addo;
        }
        
        $.each(LoadObj.weapons,function(i,a){
            if(a.store && a.bullet){
                var bullet = LoadObj.bullet[a.bullet];
                var addsto = getStoreVal(a.store);
                
                max.ammo = Math.max(max.ammo,a.ammo + addsto.ammo,a.ammo);
                max.magazine = Math.max(max.magazine,a.magazine + addsto.magazine,a.magazine);
                max.timerReload = Math.max(max.timerReload,a.timerReload + addsto.timerReload,a.timerReload);
                max.delay = Math.max(max.delay,bullet.delay + addsto.delay,bullet.delay);
                max.stepDeviation = Math.max(max.stepDeviation,bullet.stepDeviation + addsto.stepDeviation,bullet.stepDeviation);
                max.stepDistance = Math.max(max.stepDistance,bullet.stepDistance + addsto.stepDistance,bullet.stepDistance);
                max.maxDistance = Math.max(max.maxDistance,bullet.maxDistance + addsto.maxDistance,bullet.maxDistance);
                
            }
        })
        
        var addsto = getStoreVal(weapon.store,true);
        
        
        addLine('Боеприпасы','ammo',weapon.ammo+addsto.ammo);
        addLine('Магазин','magazine',weapon.magazine+addsto.magazine);
        addLine('Перезарядка','timerReload',weapon.timerReload+addsto.timerReload);
        addLine('Стрельба','delay',isBullet.delay+addsto.delay,true);
        addLine('Вибрация','stepDeviation',isBullet.stepDeviation+addsto.stepDeviation);
        addLine('Отклонения','stepDistance',isBullet.stepDistance+addsto.stepDistance);
        addLine('Дистанция','maxDistance',isBullet.maxDistance+addsto.maxDistance);
    }
    
    this.showBuyConfirm = function(call){
        var content = $('.eMass .html').empty();
        
        var $box = $([
            '<div style="text-align: center;">',
                'Вы действительно хотите купить?',
            '</div>',
            '<div style="text-align: center; padding-top: 10px">',
                '<div class="dic t_point btn" id="confirm" style="display: inline-block; padding: 5px 10px 6px 10px; margin: 0 10px">Купить</div>',
                '<div class="hic t_point btn" id="cencel" style="display: inline-block; padding: 5px 10px 6px 10px; margin: 0 10px">Нет</div>',
            '</div>'
        ].join('')).appendTo(content);
        
        menu.eMass({
            width: 220,
            height: 87,
            noError: true
        })
        
        $('#confirm',$box).on('click',function(){
            call && call();
            menu.eMassHide();
        })
        
        $('#cencel',$box).on('click',function(){
            menu.eMassHide();
        })
    }
    
    this.updateMoney = function(){
        $('#storeManey').html(font.create('fontMicraSimple','$'+fixDigit(Math.round(Profile.money)),0.9));
    }
    
    this.fixPrice = function(price){
        return Math.round(price - price / 100 * precent);
    }
    
    this.show_Store = function(){
        var list   = $('#scLeftData').empty(),
            option = $('#scRightData').empty(),
            collum = $('#storeRightCollum').hide();
        
        menu.updateMoney();
        
        $.each(LoadObj.weapons,function(i,a){
            $([
                '<li>',
                    '<div class="topPanel">',
                        '<div class="name">',a.name.substr(0,6),'</div>',
                        '<div class="price">$',fixDigit(menu.fixPrice(a.price)),'</div>',
                    '</div>',
                    '<div class="image"><img src="',a.imgStore,'" /></div>',
                    '<div class="status ',(Profile.weapons[i] ? 'active' : ''),'"></div>',
                    '<div class="storeBorder"></div>',
                '</li>',
            ].join('')).appendTo(list).on('click',function(){
                collum.show();
                option.empty();
                
                var scope = this;
                var btn   = $('#storeBuyWeaponBtn');
                
                $('#storeName').html(font.create('fontMicraSimple',a.name.toLowerCase(),0.9));
                
                
                if(Profile.weapons[i]) btn.hide()
                else{
                    btn.show().unbind('click').on('click',function(){
                        menu.showBuyConfirm(function(){
                            menu.getPurchase('weapon',{id:i},function(){
                                $('.status',scope).addClass('active');
                                btn.unbind('click').hide();
                                menu.updateMoney()
                            });
                        })
                    }).find('.price').text('$'+fixDigit(menu.fixPrice(a.price)));
                }
                
                menu.weaponStatusUp(i);
                
                if(a.store){
                    $.each(a.store,function(b,c){
                        var $box = $([
                            '<li>',
                                '<div class="storeValue t_left">',
                                    '<div class="topPanel">',
                                        '<div class="name">$',fixDigit(menu.fixPrice(c.price)),'</div>',
                                    '</div>',
                                    '<div class="image"><img src="',c.imgStore,'" /></div>',
                                    '<div class="status"></div>',
                                    '<div class="storeBorder"></div>',
                                '</div>',
                            '</li>',
                        ].join('')).appendTo(option);
                        
                        if(Profile.weapons[i] && Profile.weapons[i][b]){
                            $('.status',$box).addClass('active');
                        }
                        else{
                            $('.storeValue',$box).on('click',function(){
                                if(!Profile.weapons[i]) menu.eMass({html:'Модификация недоступно до тех пор пока не будет приобретено основное оружие'});
                                else{
                                    menu.showBuyConfirm(function(){
                                        menu.getPurchase('weaponAddon',{weapon:i,id:b},function(){
                                            $('.status',$box).addClass('active');
                                            $('.storeValue',$box).unbind('click');
                                            menu.updateMoney();
                                            $box.unbind();
                                            menu.weaponStatusUp(i);
                                        });
                                    })
                                }
                                
                            })
                            
                            $box.on('mouseover',function(){
                                menu.weaponStatusUp(i,c);
                            }).on('mouseout',function(){
                                menu.weaponStatusUp(i);
                            })
                        }
                        
                    })
                    
                    menu.updateScroll('#storeRightScroll');
                }
            })
        })
        
        $('li',list).eq(0).click();
        
        menu.show('store');
        menu.updateScroll('#storeLeftScroll','top');
    }
    
    /** Наши настройки **/
    
    this.show_Settings = function(){
        var box = $('#scrollSettingsData').empty();
        
        var addSimple = function(name,option,call){
            $('<li class="t_clearfix"><b>'+name+'</b><div class="t_right dic t_point cl"><div>'+option+'</div></div></li>').appendTo(box).find('.cl div').on('click',function(){
                call && call($(this)); 
            });
        };
        
        var YesNo = function(value){
            return value ? 'да' : 'нет';
        }
        
        addSimple('Максимальное разрешение экрана',dataCache.screen[dataCache.settings.screen][0]+'x'+dataCache.screen[dataCache.settings.screen][1],function(btn){
            dataCache.settings.screen = ++dataCache.settings.screen >= dataCache.screen.length ? 0 : dataCache.settings.screen;
            btn.text(dataCache.screen[dataCache.settings.screen][0]+'x'+dataCache.screen[dataCache.settings.screen][1])
            menu.resizeScrren();
        })
        
        addSimple('Прыжок',dataCache.settings.move)
        addSimple('Движение влево',dataCache.settings.left)
        addSimple('Движение вправо',dataCache.settings.right)
        addSimple('Сменить оружие',dataCache.settings.weapons)
        addSimple('Написать в чате',dataCache.settings.chat)
        
        addSimple('Показывать эффекты',YesNo(dataCache.settings.fx),function(btn){
            dataCache.settings.fx = dataCache.settings.fx ? 0 : 1;
            btn.text(YesNo(dataCache.settings.fx));
        })
                
        addSimple('Показывать трейсеры',YesNo(dataCache.settings.tracer),function(btn){
            dataCache.settings.tracer = dataCache.settings.tracer ? 0 : 1;
            btn.text(YesNo(dataCache.settings.tracer));
        })
		
		addSimple('Музыка',YesNo(dataCache.settings.sound),function(btn){
            dataCache.settings.sound = dataCache.settings.sound ? 0 : 1;
            btn.text(YesNo(dataCache.settings.sound));
        })
        
        $('#userSettingsBtn').unbind('click').on('click',function(){
            menu.serverLoadData('saveSettings',JSON.stringify(dataCache.settings));
            if(dataCache.show_userMenu) menu.show('gameMenu');
            else menu.show_Main();
        })
        
        menu.show('settings')
        menu.updateScroll('#scrollSettingsBlock');
    }
    
    /** Рейтинг в профиле **/
    
    this.getProfileRatting = function(){
        menu.serverLoadData('rating',{},function(j){
            var box = $('#profileRatting').empty();
        
            $([
                '<tr>',
                    '<th style="width: 50px;">Место</th>',
                    '<th>Имя</th>',
                    '<th style="width: 70px;">Убийств</th>',
                    '<th style="width: 70px;">Смертей</th>',
                '</tr>',
            ].join('')).appendTo(box);
            
            for(var i in j){
                var row = j[i];
                
                $([
                    '<tr'+(row.id == user_id ? ' class="active"' : '')+'>',
                        '<td><div>'+row.num_row+'</div></td>',
                        '<td><div>'+(row.nikname || 'unknown')+'</div></td>',
                        '<td><div>'+row.kill+'</div></td>',
                        '<td><div>'+row.die+'</div></td>',
                    '</tr>',
                ].join('')).appendTo(box);
            }
        },true)
    }
    
    /** Изменения ника **/
    
    this.show_Nikname = function(){
        var content = $('.eMass .html').empty();
        
        var $box = $([
            '<div class="input t_left">',
                '<input type="text" class="inputNikname">',
            '</div>',
            '<div class="dic t_left t_point btn" id="btnNikReg" style="margin-left: 10px;padding: 5px 10px 6px 10px;">Изменить</div>',
            '<div class="t_clear"></div>',
            '<div class="clearfix" id="errorNik" style="height: 22px; line-height: 30px"></div>'
        ].join('')).appendTo(content);
        
        menu.eMass({
            width: 262,
            height: 76,
            noError: true
        })
        
        var input = $('.inputNikname',$box);
        var name  = Profile.nikname;
        
        input.val(name).focus().on('keyup',function(){
            name = $(this).val();
            name = name.replace(/[^a-zA_Z0-9\-\_\s]/g,'');
            
            $(this).val(name);
        })
        
        $('#btnNikReg').on('click',function(){
            menu.serverLoadData('nikname',name,function(j){
                if(j.error) $('#errorNik').text(j.error);
                else {
                    Profile.nikname = name;
                    
                    menu.eMassHide();
                    menu.show_Profile();
                }
            },1)
        })
    }
    
    /** Наши бонусы **/
    
    this.profileBonusMoney = function(){
        if(bonus){
            var thisBonus = bonus-1;
            var nextBonus = thisBonus+1 >= bonusMoney.length ? 0 : thisBonus+1;
            
            var $html = $([
                '<h1 class="t_center">Ежедневный бонус</h1>',
                '<p class="t_center">Заходите каждый день и ваша награда будет расти. Не прерывайте цепочку, чтобы получить максимум денег</p>',
                '<div class="bonusBlock" id="bonusBlock"></div>'
            ].join(' '));
            
            
            menu.eMass({
                html: $html,
                height: 250,
                noHide: true,
                width: 462,
                noError: true,
                black: true
            })
            
            var block = $('#bonusBlock');
            
            function addBlock(text,number,b){
                var bl = $([
                    '<div class="bonus '+b+'">',
                        '<div class="text"></div>',
                        '<div class="number"></div>',
                    '</div>'
                ].join(' ')).appendTo(block);
                
                $('.text',bl).html(font.create('fontMicra',text,0.4))
                $('.number',bl).html(font.create('fontMicra',number.toString(),1))
            }
            
            addBlock('день',bonus,'bl');
            addBlock('вы получаете',bonusMoney[thisBonus]+'$','bc');
            addBlock('а завтра',bonusMoney[nextBonus]+'$','br');
			
			bonus = 0;
        }
    }
    
    /** Показываем наш профиль **/
    
    this.show_Profile = function(){
    
        var box = $('#scrollProfileData').empty();
        
        var addBox = function(name,option){
            return $('<li class="t_clearfix"><b>'+name+'</b><div class="t_right dic t_point cl"><div>'+option+'</div></div></li>').appendTo(box);
        }
        
        var timeInGame = timeEnd(0,0,Profile.inGameTime);
        
        var nikname = addBox('Имя '+Profile.nikname,'изменить');
        
        nikname.on('click',function(){
            menu.show_Nikname();
        })
        
        addBox('Заработано очков',fixDigit(Profile.score));
        addBox('Всего убийств',fixDigit(Profile.kill));
        addBox('Погиб в бою',fixDigit(Profile.die));
        addBox('В игре провел',timeInGame[0]+':'+timeInGame[1]+':'+timeInGame[2]);
        addBox('Заработано всего','$'+fixDigit(Math.round(Profile.earnedMoney)));        
        
        $('#profileName').html(font.create('fontMicraSimple',Profile.nikname ? Profile.nikname.toLowerCase() : 'unknown',0.6));
        $('#profileMoney').html(font.create('fontMicraSimple','$'+fixDigit(Math.round(Profile.money)),0.6));
        
        menu.show('profile')
        menu.updateScroll('#scrollProfileBlock');
    
        menu.getProfileRatting();
    }
    
    /** Запускам нашу игру **/
    
    this.startGame = function(a){
        menu.toggleGame('load');
        
        dataCache.statusRoom = a.room;
        
        kerk.startGame({
            map_id: a.room.map_id,
            load: function(){
                menu.toggleGame('game');
                
                dataCache.startGame = 1;
                
                /** Show dislocation **/
                if(a.room.mode > 0) menu.show_SelectTeam();
                else menu.show_Dislocation();
                
                /** Buld game info **/
                mp.emit('gameStatus');
                
                /** Start set my position **/
                new kerk.mp();
            }
        })
    }
    
    /** Выходим из игры **/
    
    this.stopGame = function(){
        mp.emit('outgame',function(){
            menu.toggleGame('mainMenu');
            menu.serverLoadData('saveSettings',JSON.stringify(dataCache.settings));
            menu.updateProfile();
            dataCache.startGame = 0;
        });
    }
}