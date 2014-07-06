<?
@error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( 'display_errors', true );
@ini_set ( 'html_errors', false );
@ini_set ( 'error_reporting', E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( "short_open_tag", 1 );

define('DIR',dirname(dirname(__FILE__)));
define('DATA',dirname(dirname(__FILE__)).'/data');
define('IMAGES',dirname(dirname(__FILE__)).'/images');
define('AUDIO',DIR.'/audio');
define('BG',DIR.'/images/bg');

include dirname(__FILE__).'/fn.php';
include DIR.'/access.php';

/** Чтобы всякие умники не сували свой нос куда не надо! **/

if($accessKey !== $_GET['key']){
    echo json_encode(['error'=>'Доступ отказан, ключ не совпадает!']);
    exit;
}

class ed{
    var $accessKey = '';
    
    function ed(){
        global $accessKey;
        
        $this->accessKey = $accessKey.'_';
    }
    function __call($n,$m){
        
    }
    
    private function getPath($i){
        return DATA.'/'.$this->accessKey.$i.'.data';
    }
    
    function selectImg(){
        $i = $_GET['i'];
        $j = [];
        
        $scan = scan(IMAGES.'/'.$i);
        
        if($i !== ''){
            $ex = explode('/',$i);
                  array_pop($ex);
                  
            $j[] = ['back',implode('/',$ex)];
        } 
        
        foreach($scan['dir'] as $a) $j[] = ['dir',$i.'/'.$a];
        foreach($scan['file'] as $a) $j[] = ['file','/images'.$i.'/'.$a];
        
        return $j;
    }
    function selectAudio(){
        $i = $_GET['i'];
        $j = [];
        
        $scan = scan(AUDIO.'/'.$i);
        
        if($i !== ''){
            $ex = explode('/',$i);
                  array_pop($ex);
                  
            $j[] = ['back',implode('/',$ex)];
        } 
        
        foreach($scan['dir'] as $a) $j[] = ['dir',$i.'/'.$a];
        foreach($scan['file'] as $a) $j[] = ['file','/audio'.$i.'/'.$a];
        
        return $j;
    }
    function showI(){
        $i = $_GET['i'];
        
        $get = unserialize(file_get_contents($this->getPath($i)));
        $arr = is_array($get) ? $get : [];
         
        return $get;
    }
    function saveI(){
        $id = $_GET['id'];
        $i  = $_GET['i'];
        $jn = $_POST['json'];
		
        $sc = $this->showI();
        
        $js = json_decode($jn,true);
        $iid = $id ? $id : md5(time());
        
        if($id) $sc[$id] = $js;
        else $sc[$iid] = $js;
        
        if($i == 'sprite') $sc[$iid]['frames'] = $this->spriteGenerate($iid,$sc[$iid]['img'],$sc[$iid]);
        
        krsort($sc);
        
        file_put_contents($this->getPath($i),serialize($sc));
        file_put_contents($this->getPath($i).'.json',json_encode($sc));
        
        return ['arr'=>$sc[$iid],'id'=>$iid];
    }
    function delI(){
        $i = trim($_GET['i']);
        $id = trim($_GET['id']);
        $j = $this->showI();
        
        unset($j[$id]);
        
        file_put_contents($this->getPath($i),serialize($j));
    }
    function saveAll(){
        $_GET['i'] = 'maps';
        $_GET['id'] = $_GET['mapid'];
        
        $this->saveI();
        
        $this->saveSettings();
    }
    function saveSettings(){
        file_put_contents($this->getPath('settings'),serialize(json_decode($_POST['jsonSettings'],true)));
        file_put_contents($this->getPath('settings').'.json',$_POST['jsonSettings']);
    }
    function scanMap($a){
        $folr = scan(BG.'/'.$a);
        
        foreach($folr['file'] as $i) $ar[] = '/images/bg/'.$a.'/'.$i;
        
        return $ar;
    }
    function mapBg(){
        $scan = scan(BG);
        $arr = [];
        
        foreach($scan['dir'] as $a){
            $folr = $this->scanMap($a);
            
            $arr['list'][] = [$a,'Найдено файлов: '.count($folr)];
            $arr['img'][] = $folr;
        }
        
        return $arr; 
    }
    function getObjects(){
        $scan = scan(DATA);
        $arr = [];
        
        foreach($scan['file'] as $a){
            if(strpos($a,'.json') || strpos($a,$this->accessKey) === false) continue;
            
            $name = str_replace('.data','',$a);
            $name = str_replace($this->accessKey,'',$name);
            
            $arr[$name] = unserialize(file_get_contents($this->getPath($name)));
        }
        
        $_GET['i'] = 'settings';
        
        $settings = $this->showI();
        
        return ['objects'=>$arr,'settings'=>$settings]; 
    }

    function spriteGenerate($id,$img,$object){
        $dir    = DATA.'/spriteCache/'.$id;
        $ex     = explode('.',$img);
        $ex     = end($ex);
        
        del_dir($dir);
        @mkdir($dir);
        
        if(is_file(DIR.$img)){
            
            if($ex == 'png') $image = imagecreatefrompng(DIR.$img); 
            else $image = imagecreatefromjpeg(DIR.$img); 
        
            $width  = imagesx($image);
            $height = imagesy($image);
            $result = [];
            
            //while and crop image
            
            $lb = round($width / $object['repeatX']);
            $hb = round($height / $object['repeatY']);
            $v  = intval($object['repeatX']);
            $b  = intval($object['repeatY']);
                            
            for($l = 0; $l < $b; $l++){
                for($i = 0; $i < $v; $i++){
                    
                    $hg = $height - ($hb * $l) < $hb ? $height - ($hb * $l) : $hb;
                    $wg = $width - ($lb * $i) < $lb ? $width - ($lb * $i) : $lb;
                                            
                    $x = $lb * $i;
                    $y = $hb * $l;
                    
                    if($x > $width || $y > $height) continue;
                    
                    $thumb = imagecreatetruecolor($wg, $hg);
                    
                    if($ex == 'png') {
            			imagealphablending( $thumb, false);
            			imagesavealpha( $thumb, true);
            		}
        
                    imagecopyresampled($thumb,$image,0,0,$x, $y,$wg, $hg,$wg, $hg);
                    
                    $nameJpg = '/data/spriteCache/'.$id.'/'.($y).'_'.($x).'.'.$ex;
                    
                    $result[] = $nameJpg;
                    
                    if($ex == 'png') imagepng($thumb,DIR.$nameJpg);
                    else imagejpeg($thumb,DIR.$nameJpg,100);
                    
                    
                    imagedestroy($thumb);
                }
            }                
            
            return $result;
        }
        else return [];
    }
    
    function saveZone(){
        file_put_contents(DATA.'/map/zone/'.$_GET['id'].'.base',json_encode($_POST));
    }
    
    function getAuthKey(){
        $_GET['i'] = 'settings';
        
        $settings = $this->showI();
        
        return ['md5'=>md5($settings['main']['app_id']."_489276382_".$settings['main']['api_secret'])];
    }
};

/** Какое действие **/
$a = $_GET['a'];

/** Запускаем класс **/
$ed = new ed();
$j  = $ed->$a();

echo is_array($j) ? json_encode($j) : json_encode([]);
?>