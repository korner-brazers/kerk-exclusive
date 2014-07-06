<title><?=$title?></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script src="http://<?=$iohost?>:8001/socket.io/socket.io.js"></script>
<?if($_GET['api_id']){ ?><script type="text/javascript" src="http://vk.com/js/api/xd_connection.js?2"></script><?}?>
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
<script type="text/javascript" src="/media/font.js"></script>
<script type="text/javascript" src="/media/fonts.js"></script>
<script type="text/javascript" src="/media/particles.js"></script>

<script src="/media/app/app.js"></script>
<script src="/media/app/loading.js"></script>
<script src="/media/app/player.js"></script>
<script src="/media/app/layer.js"></script>
<script src="/media/app/animations.js"></script>
<script src="/media/app/sprite.js"></script>
<script src="/media/app/weapon.js"></script>
<script src="/media/app/shell.js"></script>
<script src="/media/app/bullet.js"></script>
<script src="/media/app/graphics.js"></script>
<script src="/media/app/tracer.js"></script>
<script src="/media/app/fx.js"></script>
<script src="/media/app/sound.js"></script>
<script src="/media/app/soundPack.js"></script>
<script src="/media/app/mp.js"></script>

<link rel="stylesheet" href="/plugins/css/tools.css" type="text/css" />
<link rel="stylesheet" href="/media/menu.css<?=$rcache?>" type="text/css" />
<link rel="stylesheet" href="/media/scroll/jquery.mCustomScrollbar.css" type="text/css" />

<script>
var settings = {
    content: 'Pixi',
    screen: [800,500],
    poster: '/images/game/poster.jpg',
    soundMarkCapture: '/audio/new/am/008966688-alarm-spaceship-01.ogg',
    menuSound: '/menu/bg7.ogg',
    menuSoundBtnHover: '/menu/mm.ogg',
    menuSoundBtnClick: '/menu/mm.ogg',
    menuSoundShow: '/menu/sg3.ogg',
}

var imagesLoadMenu = {
    bg:'/images/game/menu_bg.jpg',
    shadow:'/images/game/menu_shadow.png',
    shadow:'/images/game/menu_shadow.png',
    fontMenu:'/images/game/fontMenu.png',
    fontMicra:'/images/game/fontMicra.png',
};

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

var dataCache = {
    screen: [
        [800,500],
        [1024,768],
        [1280,1024],
        [1366,768],
        [1400,1050],
        [1600,1200],
        [1680,1050],
        [1920,1080]
    ],
    settings: $.extend({
        screen: 0,
        move: 'w',
        left: 'a',
        right: 'd',
        weapons: 'backspace',
        chat: 'enter',
        use3D: 1,
        fx: 1,
        shadow: 1,
        tracer: 1,
    },Profile.settings)
};

var keyboard   = new THREEx.KeyboardState();
var clock      = new Clock();

var mp = io.connect("http://<?=$iohost?>", {
    port: 8001, 
    transports: ["websocket"],
    reconnect: true,
    'reconnection delay': 500,
    'max reconnection attempts': 10
});

/***///FULLSCREEN MODE///***/

BigScreen.onenter = function(){
    menu.inFullScreen = 1;
    menu.resizeScrren();
}

BigScreen.onexit = function(){
    menu.inFullScreen = 0;
    menu.resizeScrren(true);
}

</script>

<script type="text/javascript" src="/media/function.js<?=$rcache?>"></script>
<script type="text/javascript" src="/media/node.js<?=$rcache?>"></script>
<script type="text/javascript" src="/media/ifs.js<?=$rcache?>"></script>
<script type="text/javascript" src="/media/menu.js<?=$rcache?>"></script>