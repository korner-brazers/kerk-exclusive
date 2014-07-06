<?
@error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( 'display_errors', true );
@ini_set ( 'html_errors', false );
@ini_set ( 'error_reporting', E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( "short_open_tag", 1 );

define('DIR',dirname(dirname(__FILE__)));
define('DATA',dirname(dirname(__FILE__)).'/data');
define('MAPS',DATA.'/maps.data');
define('ITEMS',DATA.'/items.data');
define('PLAYERS',DATA.'/players.data');
define('SCRIPT',DATA.'/script.data');
define('SPRITE',DATA.'/sprite.data');
define('VEHICLE',DATA.'/vehicle.data');
define('FX',DATA.'/fx.data');
define('BULLET',DATA.'/bullet.data');
define('BUILDING',DATA.'/building.data');
define('TRACERS',DATA.'/tracers.data');
define('TRACEROB',DATA.'/tracerOb.data');
define('WEAPONS',DATA.'/weapons.data');
define('SHADOW',DATA.'/shadow.data');
define('SOUND',DATA.'/sound.data');
define('SHELLPOINT',DATA.'/shellPoint.data');


$s = $data = [
    'sprite'=>SPRITE,
    'players'=>PLAYERS,
    'items'=>ITEMS,
    'maps'=>MAPS,
    'vehicle'=>VEHICLE,
    'fx'=>FX,
    'bullet'=>BULLET,
    'tracers'=>TRACERS,
    'weapons'=>WEAPONS,
    'shadow'=>SHADOW,
    'sound'=>SOUND,
    'building'=>BUILDING,
    'tracerOb'=>TRACEROB,
    'shellPoint'=>SHELLPOINT,
];

foreach($s as $i=>$p){
    $data[$i] = unserialize(file_get_contents($p));
}

$obj = json_encode($data);

$mapID = strip_tags($_GET['map']);

$map = unserialize(file_get_contents(MAPS));

if(isset($_GET['allmaps'])){
    include DIR.'/media/db_class.php';
    
    $row = [];
    
    $uid = intval($_GET['unitid']);
           $db->select('niknames',['WHERE'=>'uid='.$uid,'LIMIT'=>1]);
    $row = array_merge($row,$db->get_row());
    
    if($row['id'] && intval($row['time_pay'])+(60*60*24*30) > time()) $isp = 1;
    else $isp = 0;
    
    /*registration*/
    
    if(!$row['id']){
        $db->insert('niknames',['uid'=>$uid]);
        
        $row['id'] = $db->insert_id();
    } 
    
    echo 'var LoadAllMap = '.json_encode($map).'; var unitid = "'.$uid.'_un",viewer_id = '.$uid.',Profile = '.json_encode($row).',user_id = '.($row['id'] ? $row['id'] : 0).',LoadMap = {},LoadObj = '.$obj.',premium = '.$isp.',nikname'.($row['nik'] ? ' = "'.$row['nik'].'"' : '').';';
} 
elseif(isset($_GET['map'])) echo json_encode(['map'=>$map[$mapID],'obj'=>$data]);
?>