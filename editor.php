<!DOCTYPE HTML>
<html>
<head>
<title>KERK Editor</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script type="text/javascript" src="/plugins/js/cufon.js"></script>
<script type="text/javascript" src="/plugins/js/corbel.font.js"></script>
<script type="text/javascript" src="/plugins/js/corbel.font.js"></script>
<script type="text/javascript" src="/plugins/js/jquery.js"></script>
<script type="text/javascript" src="/plugins/js/jquery_ui.js"></script>
<script type="text/javascript" src="/plugins/js/scroll.js"></script>
<script type="text/javascript" src="/plugins/js/scin.js"></script>
<script type="text/javascript" src="/plugins/js/sl.js"></script>
<script type="text/javascript" src="/media/kinetic.js"></script>
<script type="text/javascript" src="/media/audio/script/soundmanager2.js"></script>
<script type="text/javascript" src="/media/pixastic/pixastic.core.js"></script>
<script type="text/javascript" src="/media/pixastic/actions/coloradjust.js"></script>
<script type="text/javascript" src="/media/particles.js"></script>
<script type="text/javascript" src="/media/function.js"></script>


<link rel="stylesheet" href="/plugins/css/tools.css" type="text/css" />
<link rel="stylesheet" href="/plugins/css/form.css" type="text/css" />
<link rel="stylesheet" href="/plugins/css/scroll.css" type="text/css" />
<link rel="stylesheet" href="/plugins/css/animate.css" type="text/css" />
<link rel="stylesheet" href="/plugins/css/sl.css" type="text/css" />

<link rel="stylesheet" href="/editor/media/inc.css" type="text/css" />

<?
include dirname(__FILE__).'/access.php';
?>
<script>
var incUrl = '/editor/inc.php?key=<?=$accessKey?>&a=',
    openMap = <?=$_GET['openMap'] ? "'".$_GET['openMap']."'" : 'false'?>,
    LoadObj = {};
    
soundManager.setup({
    url: '/media/audio/swf/'
});

var delta = 0;
var dataCache = {};
</script>
</head>

<body id="wrap" class="t_body t_over" style="background: #0a0a0a; color: #838383;">



<div class="top_panel t_clearfix" style="height: 34px;">
 <ul class="t_ul globalManu sl_user_btn">
  <li>Файл
   <div>
    <span onclick="$.buld('saveMap')">Сохранить</span>
    <span onclick="$.buld('generateZone',function(){ $.buld('saveMap') })">Генерировать&nbsp;&nbsp;карту</span>
    <span onclick="$.buld('mapLauhGame')">Запустить&nbsp;&nbsp;игру</span>
   </div>
  </li>
  <li>Настройки
   <div>
    <span onclick="$.buld('settingsMainBox')">Основные</span>
    <span onclick="$.buld('settingsServerBox')">Сервер</span>
    <span onclick="$.buld('settingsTagBox')">Теги</span>
   </div>
  </li>
  <li>Вид
   <div>
    <span onclick="$.buld('setScale',1);">Увеличить</span>
    <span onclick="$.buld('setScale',-1);">Уменьшить</span>
    <span onclick="$.buld('setScale',0);">Масштаб&nbsp;100%</span>
   </div>
  </li>
 </ul>
</div>





<!--
<div style="height: 34px;" class="top_panel">
    <ul class="sl_user_btn">
        <li onclick="$.buld('mapMenu');">Меню</li>
        <li onclick="$.buld('settingsMenu');">Настройки</li>
        <li onclick="$.buld('mapViewSettings');">Вид
            
        </li>
    </ul>
</div>-->


<div id="buld" class="t_p_r">
<table class="buld_table win_h_size t_width" minus="61" cellspacing="0" cellpadding="0">
    <tr>
        
        <td class="wi">
            <div class="tools_sep"></div>
            <ul class="tools left_tools">
                <li onclick="$.buld('selectObject')"><span><img src="/editor/media/img/to/player.png" /></span></li>
                <li onclick="$.buld('selectWeapons')" class="sepl"><span><img src="/editor/media/img/to/weapons.png" /></span></li>
                <li onclick="$.buld('selectBullet')" class="sepl"><span><img src="/editor/media/img/to/bullet.png" /></span></li>
                <li onclick="$.buld('selectTracers')" class="sepl"><span><img src="/editor/media/img/to/tracers.png" /></span></li>
                <li onclick="$.buld('selectFX')" class="sepl"><span><img src="/editor/media/img/to/particles.png" /></span></li>
                <li onclick="$.buld('selectObject3D')" class="sepl"><span><img src="/editor/media/img/to/building.png" /></span></li>
                <li onclick="$.buld('selectSprite')" class="sepl"><span><img src="/editor/media/img/to/sprite.png" /></span></li>
                <li onclick="$.buld('selectSoundPack')" class="sepl"><span><img src="/editor/media/img/to/audio.png" /></span></li>
                <li onclick="$.buld('selectFont')" class="sepl"><span><img src="/editor/media/img/to/font.png" /></span></li>
            </ul>
        </td>
        <td class="vis" style='-moz-user-select: none;-webkit-user-select: none;' onselectstart='return false;'>
            
            <div class="visual_bg_conteiner resizeWin t_over t_p_r" minus="61">
                <!--<img class="t_p_a t_left t_top t_width t_height" id="mapBg" />-->
                <div id="graphics" class="t_p_a t_left t_top t_width t_height"></div>
                <div id="newElement" class="t_p_a t_left t_top t_width t_height" style="display: none;"></div>
                <div class="t_p_a t_left t_bottom t_width t_height" id="layerColor" style="display: none;"></div>
                <div class="compass"><div class="direction"></div></div>
            </div>
            
        </td>
        <td class="wi rightToolBig" style="width: 180px;">
            <div class="tools_sep"></div>
            <div class="scrollbarInit t_over rightToolBox">
                <div id="fileManager">
                </div>
            </div>
        </td>
        <td style="width: 3px;"></td>
        <td class="wi">
            <div class="tools_sep"></div>
            <ul class="tools right_tools">
                <?if($_GET['openMap']){?>
                    <li><span onclick="$.buld('optionMap')"><img src="/editor/media/img/to/obj.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('visibleObjects')"><img src="/editor/media/img/to/eye.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('newElement',1)"><img src="/editor/media/img/to/graphics.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('showLayers')"><img src="/editor/media/img/to/nav.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('newElement',10)"><img src="/editor/media/img/to/building.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('newElement',9)"><img src="/editor/media/img/to/emiter.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('newElement',3)"><img src="/editor/media/img/to/lib.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('newElement',4)"><img src="/editor/media/img/to/gameSound.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('newElement',11)"><img src="/editor/media/img/to/ai.png" /></span></li>
                    <li class="sepl"><span onclick="$.buld('newArea','ground')"><img src="/editor/media/img/to/area.png" /></span></li>
                    
                    <li class="sepl"><span onclick="$.buld('newArea','wall')"><img src="/editor/media/img/to/wall.png" /></span></li>
                    <!--<li class="sepl"><span buldTab="8"><img src="/editor/media/img/to/shapes.png" /></span></li>-->
                <?}?>
            </ul>
            <div id="panel">
                <div class="resizeWin scrollbarInit" minus="61">
                    <div class="header">
                        <h3>Свойства</h3>
                        <div class="hide" onclick="$.buld('panelShowOrHide')"></div>
                    </div>
                    <div class="sep"></div>
                    <ul class="list_style objectProperty objProperties"></ul>
                </div>
            </div>
           
        </td>
    </tr>
</table>
<div class="buld_bottom t_clearfix">
    <div class="t_left l" id="infoRm"></div>
    <div class="t_right c">Copyright 2013 SL SYSTEM. All Rights Reserved. Design studio <a href="http://sl-cms.com" target="_blank">Qwarp</a></div>
</div>
<!--<div class="m_logo"></div>-->
</div>
<script type="text/javascript" src="/editor/media/edi.php?<?=rand()?>"></script>
<script>

$.buld();

$.sl('top_panel',{
    fun: function(){
        
    }
});


</script>

</body>
</html>