<!DOCTYPE HTML>
<html>
<head>
<title><?=$title?></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script src="//<?=$iohost?>:<?=$game['nodePort']?>/socket.io/socket.io.js"></script>
<?if($_GET['api_id']){?><script type="text/javascript" src="//vk.com/js/api/xd_connection.js?2"></script><?}?>
<script type="text/javascript" src="/plugins/js/jquery.js"></script>
<script type="text/javascript" src="/media/jquery.easing.min.js"></script>
<script type="text/javascript" src="/media/scroll/jquery.mousewheel.min.js"></script>
<script type="text/javascript" src="/media/scroll/jquery.mCustomScrollbar.min.js"></script>

<script src="/media/pixi/pixi.dev.js"></script>
<script src="/media/pixi/layers.js"></script>

<script src="/media/js/libs/stats.min.js"></script>
<script src="/media/js/Keyboard.js"></script>
<script src="/media/js/Clock.js"></script>

<script type="text/javascript" src="/media/BigScreen.js"></script>
<script type="text/javascript" src="/media/font.js<?=$rcache?>"></script>
<script type="text/javascript" src="/media/particles.js<?=$rcache?>"></script>

<script src="/media/app/app.js<?=$rcache?>"></script>
<script src="/media/app/loading.js<?=$rcache?>"></script>
<script src="/media/app/player.js<?=$rcache?>"></script>
<script src="/media/app/layer.js<?=$rcache?>"></script>
<script src="/media/app/animations.js<?=$rcache?>"></script>
<script src="/media/app/sprite.js<?=$rcache?>"></script>
<script src="/media/app/weapon.js<?=$rcache?>"></script>
<script src="/media/app/shell.js<?=$rcache?>"></script>
<script src="/media/app/bullet.js<?=$rcache?>"></script>
<script src="/media/app/graphics.js<?=$rcache?>"></script>
<script src="/media/app/ui.js<?=$rcache?>"></script>
<script src="/media/app/tracer.js<?=$rcache?>"></script>
<script src="/media/app/fx.js<?=$rcache?>"></script>
<script src="/media/app/sound.js<?=$rcache?>"></script>
<script src="/media/app/soundPack.js<?=$rcache?>"></script>
<script src="/media/app/mp.js<?=$rcache?>"></script>

<link rel="stylesheet" href="/plugins/css/tools.css" type="text/css" />
<link rel="stylesheet" href="/media/menu.css<?=$rcache?>" type="text/css" />
<link rel="stylesheet" href="/media/scroll/jquery.mCustomScrollbar.css" type="text/css" />

<script>
/** Наши данные **/
var unitid     = <?=$game['viewer_id']?>; //so.io id
var viewer_id  = <?=$game['viewer_id']?>; //vk viewer_id
var user_id    = <?=$game['user_id']?>;   //db user id
var Profile    = <?=$game['user']?>;
var LoadMap    = {};
var LoadObj    = <?=$game['obj']?>;
var auth_key   = '<?=$game['auth_key']?>';
var uhash      = '<?=$game['uhash']?>';
var LoadAllMap = <?=$game['maps']?>;
var localOn    = <?=$_GET['api_id'] ? 0 : 1?>;
var money      = <?=$game['money']?>;
var bonus      = <?=$game['bonus']?>;
var bonusMoney = <?=$game['bonusMoney']?>;
var precent    = <?=$game['precent']?>;

/** Основные настройки **/
var settings = {
    content: 'Pixi',
    screen: [LoadObj.settings.main.screenWidth,LoadObj.settings.main.screenHeight]
}

/** 
 * Не трогать чуваки пальцами,
 * даже не дышать и не думать,
 * эта важная хрень! 
**/
 
var dataCache = {
    imagesLoadMenu: {},
    statusRoom: {},
    messages: [],
    console: [],
    myInfo: {},
    testPing: 0,
    screen: [
        [LoadObj.settings.main.screenWidth,LoadObj.settings.main.screenHeight],
        [1024,768],
        [1280,1024],
        [1366,768],
        [1400,1050],
        [1600,1080],
        [1680,1050],
        [1920,1080]
    ],
    settings: $.extend({
        screen: 0,
        move: 'W',
        left: 'A',
        right: 'D',
        weapons: '1,2,3',
        selectWeapons: [LoadObj.settings.main.weaponDefault],
        chat: 'enter',
        fx: 1,
        tracer: 1,
		sound: 1
    },Profile.settings)
};

/** Часики и клава **/
var keyboard   = new THREEx.KeyboardState();
var clock      = new Clock();

/** Коннектимся к серверу **/
var mp = io.connect("//<?=$iohost?>", {
    port: <?=$game['nodePort']?>, 
    transports: ["websocket"],
    secure: localOn ? false : true,
    reconnect: true,
    'reconnection delay': 500,
    'max reconnection attempts': 40
});
</script>

</head>

<body class="t_body t_over" style="background: #000;">
    <div class="conteiner t_p_r" id="Game" style="width: 800px; margin: 0 auto; height: 500px;">
        <!--<img src="/images/game/distore_1.jpg" id="bgMenu" class="t_p_a t_width t_height t_top t_left" style="display: none;" />-->
        <div id="Pixi" class="t_p_a t_left t_top" style="display: none;"></div>
        <div id="GameIfs" class="t_p_a t_left t_top" style="display: none;"></div>
        
        <div id="MenuBlocks" class="t_p_a t_left t_top" style="z-index: 200;">
            <!--////BLOCKS START////-->
            
            <div id="m_main" class="block">
                <div class="retive">
                    <div class="t_p_r">
                        <img src="/images/game/logo.png" class="t_p_a t_left t_top" style="margin-left: 6px;" />
                    </div>
                    <ul class="t_ul mainMenu">
                        <li alt="профиль" class="mm" onclick="menu.show_Profile()"></li>
                        <li alt="настройки" class="mm" onclick="menu.show_Settings()"></li>
                        <li alt="магазин" class="mm" style="padding-left: 8px;" onclick="menu.show_Store()"></li>
                        <li alt="мультиплеер" class="mm" onclick="menu.show_Server()" style="padding-left: 8px;"></li>
                        <li alt="рассказать" class="mm" onclick="VK.api('wall.post', {attachments : 'photo139290680_314750060,http://vk.com/dedmath'});" style="padding-left: 8px;"></li>
                    </ul>
                </div>
                
            </div>
            
            <div id="m_gameMenu" class="block">
                <img src="/images/game/menu_shadow.png" class="t_p_a t_left t_top t_width t_height" />
                <div class="t_p_a t_left t_width t_top t_height">
                    <div class="retive">
                        <ul class="t_ul mainMenu">
                            <li alt="продолжить" class="mm" onclick="menu.toggleGame('game');"></li>
                            <li alt="полный экран" class="mm" onclick="menu.fullscreen()"></li>
                            <li alt="настройки" class="mm" onclick="menu.show_Settings()"></li>
                            <li alt="покинуть" class="mm" onclick="menu.stopGame()"></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div id="m_server" class="block">
                <div class="retive">
                    <div class="t_left">
                        <div alt="мультиплеер" size="0.6" class="tis"></div>
                        <div alt="комнаты" size="0.44" class="tis"></div>
                        <div class="t_clear" style="padding-top: 30px;"></div>
                        
                        <div class="lineBlock">
                            <div class="lc lf"><div alt="карты" size="0.42" class="tis pd"></div></div>
                            <div class="lc rf"><div alt="игроков" size="0.42" class="tis pd"></div></div>
                            <div class="t_clear lij"><b class="lh"></b><b class="rh"></b></div>
                        </div>
                        
                        <div class="scroll serverList" id="ScrollSR" style="height: 315px;">
                            <div id="servListMaps">
                                
                            </div>
                        </div>
                        
                        <div class="backBtn tis cl t_left" alt="назад" size="0.5" onclick="menu.show_Main()"></div>
                        <div class="t_left servConnectShow">Подключение к серверу</div>
                    </div>
                </div>
                
                <div class="serverCreate">
                    <div class="t_p_20">
                        <div class="t_left t_center t_width_50 tis servCreateBtn t_point cl" alt="создать" size="0.5"></div>
                        <div class="t_left t_center t_width_50 tis t_point" alt="фильтр" size="0.5"></div>
                        <div class="sep t_clear t_p_5"></div>
                        
                        <div class="servImg cl">
                            <img src="/images/game/test_servr_img.png" />
                        </div>
                        <div class="servMapName">
                            <div class="tis" alt="albacer670b" size="0.5"></div>
                        </div>
                        <div class="sep t_clear t_p_5" style="margin-bottom: 18px;"></div>
                        
                        <div class="t_clearfix sest">
                            <div class="t_left tis" alt="игроков" size="0.5" style="margin-top: 5px;"></div>
                            <div class="t_right dic t_point servMaxPlayers cl"><div>16</div></div>
                        </div>
                        <div class="t_clearfix sest">
                            <div class="t_left tis" alt="режим игры" size="0.5" style="margin-top: 5px;"></div>
                            <div class="t_right dic t_point servMode cl"><div>TD</div></div>
                        </div>
                        <div class="t_clearfix sest">
                            <div class="t_left tis" alt="время игры" size="0.5" style="margin-top: 5px;"></div>
                            <div class="t_right dic t_point servTime cl"><div>4</div></div>
                        </div>
                        <div class="sep" style="margin-top: 18px;"></div>
                        <div class="input" style="margin-top: 18px;">
                            <input type="text" class="servName" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="m_dislocation" class="block">
                <img src="/images/game/menu_shadow.png" class="t_p_a t_left t_top t_width t_height" />
                <div class="dslBgSc t_p_a t_left t_top t_width t_height">
                    <div class="retive">
                        <div class="tis" alt="позиция" size="0.6"></div>
                        <div style="width: 210px;">
                            <div id="dslScroll" style="height: 180px; margin-left: -5px;">
                                <ul id="dslPointList" class="t_ul"></ul>
                            </div>
                            
                            <div class="sep" style="margin: 17px -15px 10px 3px;"></div>
                            
                            <div class="tis" alt="оружие" size="0.6"></div>
                            
                            <div id="dsWeaponsScroll" style="height: 100px;">
                                <div id="dslWeapons">
                                </div>
                            </div>
                            
                            <div class="sep" style="margin: 20px -15px 10px 3px;"></div>
                            
                            <h3 class="btnBig" id="dslDeploy" style="margin-left: 3px;">ДИСЛОКАЦИЯ</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="m_store" class="block">
                <div class="retive">
                    <div class="t_left clearfix" style="width: 260px;">
                        <div class="t_left">
                            <div class="tis" alt="магазин" size="0.6"></div>
                            <div class="tis" alt="оружие" size="0.45"></div>
                        </div>
                        <div class="t_right" id="storeManey"></div>
                        <div class="t_clear"></div>
                        <div class="sep" style="margin-top: 25px;"></div>
                        <div style="height: 330px; margin: 8px -20px 0px 0px;" class="t_over" id="storeLeftScroll">
                            <ul id="scLeftData" class="t_ul storeBlock">
                                
                            </ul>
                        </div>
                        <div class="sep" style="margin-top: 8px;"></div>
                        <div class="backBtn tis cl" alt="назад" size="0.5" onclick="menu.show_Main()"></div>
                    </div>
                    
                    <div id="storeRightCollum" class="t_left" style="width: 400px; margin-left: 35px;">
                        <div class="tis t_left" alt="gpt 56" size="0.9" id="storeName"></div>
                        <div class="t_left dic t_point" id="storeBuyWeaponBtn" style="margin: 3px 0 0 10px;"><div>Купить: <b class="price"></b></div></div>
                        <div class="t_clear"></div>
                        
                        <div style="margin-top: 30px; height: 130px">
                            <ul id="weaponAddonLines" class="t_ul"></ul>
                        </div>
                        <div class="sep"></div>
                        <div id="storeRightScroll" style="height: 203px; margin-top: 8px;">
                            <ul id="scRightData" class="t_ul"></ul>
                        </div>
                        <div class="sep" style="margin-top: 8px;"></div>
                    </div>
                </div>
            </div>
            
            <div id="m_settings" class="block">
                <div class="menuGrid grid">
                    <div class="t_p_20">
                        <div class="tis" alt="настройки" size="0.6"></div>
                        <div class="tis" alt="основные" size="0.45"></div>
                        <div class="sep" style="margin-top: 40px;"></div>
                        <div style="width: 340px; height: 300px; margin-top: 8px;" id="scrollSettingsBlock">
                            <ul class="t_ul settingList" id="scrollSettingsData"></ul>
                        </div>
                        <div class="sep"></div>
                        <div class="backBtn tis cl" alt="назад" size="0.5" id="userSettingsBtn" style="margin-top: 30px;"></div>
                    </div>
                </div>
            </div>
            
            <div id="m_profile" class="block">
                <div class="retive" style="height: 500px;">
                    
                    <div class="t_p_r" style="height: inherit;">
                        <div class="menuGrid grid" style="margin: -20px 0 -20px -40px;">
                            <div class="t_p_20">
                                <div id="profileName" class="t_left"></div>
                                <div id="profileMoney" class="t_right"></div>
                                <div class="t_clear"></div>
                                <div class="tis" alt="профиль" size="0.45"></div>
                                <div class="sep" style="margin-top: 40px;"></div>
                                <div style="width: 250px; height: 295px; margin-top: 8px;" id="scrollPrrofileBlock">
                                    <ul class="t_ul settingList" id="scrollProfileData">
                                    </ul>
                                </div>
                                <div class="sep"></div>
                                <div class="backBtn tis cl" alt="назад" size="0.5" onclick="menu.show_Main()" style="margin-top: 30px;"></div>
                            </div>
                        </div>
                        <div style="padding: 79px 0 0 300px;">
                            <div class="sep"></div>
                            <div style="height: 287px; margin-top: 8px;">
                                <table class="s_table" id="profileRatting"></table>
                            </div>
                            <div class="sep" style="margin-top: 8px;"></div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
            
            <div id="m_score" class="block shadow">
                <div class="retive">
                    <div style="height: 55px;">
                        <div class="tis t_center teamVictory hide endGameInfo" alt="победа" size="1"></div>
                        <div class="tis t_center teamDefeat hide endGameInfo" alt="поражение" size="1"></div>
                    </div>
                    <div class="t_clear"></div>
                    <div id="score_team" class="t_clearfix hide">
                        <div class="teamSelect"></div>
                        <div class="t_left" style="margin-right: 29px; width: 345px">
                            <img src="/images/game/ru_ico.png" class="t_left" style="margin-top: -5px;" />
                            <div class="btnGlow t_block t_right" id="ru_total_score"><span class="scoreSpan">0</span></div>
                            <div class="t_clear"></div>
                            <div class="gtp">
                                <div class="pad" id="ru_score" style="height: 270px;">
                                    <table class="s_table"><tr><th>Имя</th><th style="width: 40px">K</th><th style="width: 40px">D</th><th style="width: 70px">Очки</th><th style="width: 30px"></th></tr></table>
                                </div>
                            </div>
                            <div class="sep"></div>
                        </div>
                        
                        <div class="t_left" style="width: 345px">
                            <img src="/images/game/us_ico.png" class="t_left" style="margin-top: -5px;" />
                            <div class="btnGlow t_block t_right" id="us_total_score"><span class="scoreSpan">0</span></div>
                            <div class="t_clear"></div>
                            <div class="gtp">
                                <div class="pad" id="us_score" style="height: 270px;">
                                    <table class="s_table"><tr><th>Имя</th><th style="width: 40px">K</th><th style="width: 40px">D</th><th style="width: 70px">Очки</th><th style="width: 30px"></th></tr></table>
                                </div>
                            </div>
                            <div class="sep"></div>
                        </div>
                    </div>
                    <div id="score_one">
                        <div class="gtp" style="margin: 0 100px;">
                            <div class="pad" id="all_score" style="height: 307px;">
                                <table class="s_table"><tr><th>Имя</th><th style="width: 40px">K</th><th style="width: 40px">D</th><th style="width: 70px">Очки</th><th style="width: 30px"></th></tr></table>
                            </div>
                            <div class="sep"></div>
                        </div>
                    </div>
                    
                    <div class="teamSelect hide">
                        <h3 class="btnBig" id="get_ru_team">Выбрать</h3>
                        <h3 class="btnBig" id="get_us_team" style="margin-left: 291px;">Выбрать</h3>
                    </div>
                    <div class="t_center timeNextRound hide endGameInfo" style="padding-top: 25px;">
                        <div class="dic" style="display: inline-block;"><div style="font-size: 15px;" class="timerNext">20</div></div>
                    </div>
                </div>
            </div>
            <!--////BLOCKS END////-->
        </div>
        
        <div id="fullscreen" class="t_p_a iconsGame" onclick="menu.fullscreen()"></div>
        <div id="menuIcon" class="t_p_a iconsGame" onclick=""></div>
        <div class="t_p_a LoadingGameIcon"></div>
        <div class="copyr loadingMenuProgress"></div>
        <div class="menuLoad loadingMenuProgress"></div>
        <div class="loadingGameProgress"></div>
        <div id="fps" class="t_p_a t_top t_left t_p_10" style="opacity: 0.4;"></div>
        
        <div class="eMassBg t_p_a t_width t_height t_left t_top"></div>
        <div class="eMass">
            <div class="retive">
                <div class="border"></div>
                <div class="content">
                    <div class="panel"></div>
                    <div class="data">
                        <div class="ico t_left"></div>
                        <div class="html t_over"></div>
                    </div>
                </div>
                <div class="close cl"></div>
            </div>
        </div>
        
        <div id="consoleLog" class="t_p_a t_left t_top t_width">
            <div class="consoleLogScroll">
                <div class="consoleLogData"></div>
            </div>
        </div>
        
        <ul class="t_p_a t_ul deadInfo showOnlyInGame"></ul>
        <ul class="t_p_a t_ul gameInfo showOnlyInGame"></ul>
        
    </div>
<script type="text/javascript" src="/media/function.js<?=$rcache?>"></script>
<script type="text/javascript" src="/media/node.js<?=$rcache?>"></script>
<script type="text/javascript" src="/media/menu.js<?=$rcache?>"></script>

<script type="text/javascript">

/** Создаем нашу игру **/
kerk.createGame();

<?if(!$_GET['map']){?>

/** Запускаем меню **/
menu.start();
<?}

/**
 * Если передан параметр (api_id) то возможно приложение запустили из вк
 */
 
if($_GET['api_id']){
?>
var cmBlock;

VK.init(function(){
    cmBlock = new CMBlockVK;
});

VK.addCallback('onOrderSuccess', function(a) {
    menu.purchaseSomething();
});
VK.addCallback('onOrderFail', function(a){
    menu.purchaseError(a);
});

<?}
/**
 * Если передан параметр (map) то сразу запускаем игру без меню
 */

elseif($_GET['map']){
?>
/** Грузим шрифты **/

font.loading(function(){
    /** Обновляем на новый unitid **/
    unitid = unitid+'unit';
    
    /** Обновляем контроллер **/
    kerk.updateMyController();
    
    menu.resizeScrren(true);
    
    kerk.startGame({
        map_id: '<?=$_GET['map']?>',
        load: function(){
            
            //увы конфликт с node.js так как контроллер устанавливается раньше чем получаю новый unitid, пока что запускается без запущенного сервера 
            dataCache.inGame = true;
			
            var pointPosition = {
                x: settings.screen[0]/2,
                y: settings.screen[1]/2
            }
            
            $.each(LoadMap.point,function(i,a){
                pointPosition.x = a.x;
                pointPosition.y = a.y;
            })
            
            kerk.addPlayer({
                player_id:'<?=$_GET['unitid']?>',
                unitid: unitid,
                weapons: ['<?=$_GET['weapon']?>'],
                position: pointPosition
            });
            
            menu.toggleGame('game');
			$('.iconsGame').show();
        }
    })
})
<?}?>

/***///FULLSCREEN MODE///***/
/** Отслеживаем изменения экрана **/

BigScreen.onenter = function(){
    menu.inFullScreen = 1;
    menu.resizeScrren();
}

BigScreen.onexit = function(){
    menu.inFullScreen = 0;
    menu.resizeScrren(true);
}
</script>
</body>
</html>