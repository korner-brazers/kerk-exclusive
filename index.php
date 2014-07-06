<?php
@error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( 'display_errors', true );
@ini_set ( 'html_errors', false );
@ini_set ( 'error_reporting', E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( "short_open_tag", 1 );

$do  = preg_replace("'[^a-z]'si",'',$_GET['do']);
$do  = $do == '' ? 'getIndex' : $do;

define('DIR',dirname(__FILE__));
define('DATA',DIR.'/data');

include DIR.'/access.php';
include DIR.'/media/db_class.php';

class game extends db{
    var $viewer_id  = 0;
    var $auth_key   = 0;
    var $app_id     = '';
    var $api_secret = '';
    
    function __call($m,$a){
        return [];
    }
    function game(){
        global $money,$accessKey,$bonusMoney;
        
        $this->viewer_id = $_GET['viewer_id'];
        $this->user_id   = $_GET['user_id'];
        $this->uhash     = $_GET['uhash'];
        $this->auth_key  = $_GET['auth_key'];
        $this->data      = $_POST['data'];
        $this->accessKey = $accessKey;
        $this->money     = $money;
        $this->bonusMoney = $bonusMoney;
        $this->dataJson  = json_decode($this->data,true);
        $this->settings  = $this->getData('settings');
        $this->server    = $this->settings['server']['localOn'] ? $this->settings['server']['local'] : $this->settings['server']['node'];
        
        $this->app_id     = $this->settings['main']['app_id'];
        $this->api_secret = $this->settings['main']['api_secret'];
        
        $this->conf = [
            'user'=>$this->server['dbuser'],
            'pass'=>$this->server['dbpassword'],
            'dbname'=>$this->server['dbname'],
            'ip'=>$this->server['dbhost'].($this->server['dbport'] ? ':'.$this->server['dbport'] : '')
        ];
        
        $this->connect();
    }
    private function getAllFile($dir,$p = true){
        if(is_dir($dir)){
            $handle = @opendir( $dir );
            
        	while ( false !== ($file = @readdir( $handle )) ) {
                
        		if( @is_dir( $dir.'/'.$file ) and ($file != "." and $file != "..") ) {
        			  
                    $c_files['dir'][$file] = $p ? $dir : $file;
        			
        		}elseif($file != "." and $file != ".."){
        		    $c_files['file'][$file] = $p ? $dir : $file;
        		}
        	}
           @closedir($handle);
       }
       
       if(count($c_files['dir']) == 0)  $c_files['dir']  = array();
       if(count($c_files['file']) == 0) $c_files['file'] = array();
       
       return $c_files;
    }
    private function getObj(){
        $data = [];
        
        $files = $this->getAllFile(DATA,false);
        
        foreach($files['file'] as $a){
            if(strpos($a,'.json') || strpos($a,$this->accessKey) === false) continue;
            
            $name = str_replace('.data','',$a);
            $name = str_replace($this->accessKey.'_','',$name);
            
            if($name !== 'maps') $data[$name] = $this->getData($name);
        }
        
        /** Удаляем данные о сервере чтоб не светить **/
        unset($data['settings']['server']);
        
        return $data;
    }
    private function getFile($p){
        return unserialize(file_get_contents($p));
    }
    private function getData($name){
        return $this->getFile(DIR.'/data/'.$this->accessKey.'_'.$name.'.data');
    }
    function getMaps($id = false){
        $maps = $this->getData('maps');
        
        return $id ? $maps[$id] : $maps;
    }
    private function createUser(){
        $this->alterTableAdd('users',[
            'uid'=>['INT',11,0],
            'nikname'=>['VARCHAR',100],
            'score'=>['DECIMAL',30,0],
            'die'=>['DECIMAL',20,0],
            'kill'=>['DECIMAL',20,0],
            'msg'=>['TEXT NOT NULL',false],
            'premium'=>['DECIMAL',1,0],
            'settings'=>['TEXT NOT NULL',false],
            'weapons'=>['TEXT NOT NULL',false],
            'money'=>['DECIMAL',20],
            'earnedMoney'=>['DECIMAL',20],
            'inGameTime'=>['DECIMAL',10,0],
            'bonusDay'=>['DECIMAL',10,0],
            'bonus'=>['DECIMAL',2,0],
        ]);

        $user = $this->get_row($this->like('users','uid',$this->viewer_id,1));
        
        if($user) return $this->decodeUserJson($user);
        else{
            $this->insert('users',[
                'uid'=>$this->viewer_id,
                'msg'=>'[]',
                'money'=>100,
                'bonusDay'=>time()
            ]);
            
            $user = $this->select('users',$this->insert_id());
            
            return $this->decodeUserJson($user);
        }
    }
    private function checkUser(){
        $user = $this->select('users',$this->user_id);
        
        if($user && $this->checkKey() && md5($this->user_id.'_'.$this->api_secret.'_'.$this->auth_key) == $this->uhash) return $this->decodeUserJson($user);
    }
    private function decodeUserJson($user){
        $user['msg']       = json_decode($user['msg'],true);
        $user['settings']  = json_decode($user['settings'],true);
        $user['weapons']   = json_decode($user['weapons'],true);
        
        if(!is_array($user['msg']))      $user['msg'] = [];
        if(!is_array($user['settings'])) $user['settings'] = [];
        if(!is_array($user['weapons']))  $user['weapons'] = [];
        
        $user['premium']   = intval($user['premium']);
        
        return $user;
    }
    private function checkKey(){
        if(md5($this->app_id."_".$this->viewer_id."_".$this->api_secret) == $this->auth_key) return true;
    }
    private function getBonus($user){
        $bunusDay = date('d',$user['bonusDay']);
        $thisDay  = date('d',time());
        $expirDay = round((time() - $user['bonusDay'])/60/60/24);
        
        if($bunusDay !== $thisDay && $expirDay < 2){
            $bonus = $user['bonus']+1;
            
            $bonus = $bonus > count($this->bonusMoney) ? 1 : $bonus;
            
            $this->update('users',[
                'bonus'=>$bonus,
                'bonusDay'=>time(),
                'money'=>$user['money']+$this->bonusMoney[$bonus-1],
            ],$user['id']);
            
            return $bonus;
        }
        else if($expirDay > 1){
            $this->update('users',[
                'bonus'=>'1',
                'bonusDay'=>time()
            ],$user['id']);
            
            return 1;
        }
        else return 0;
    }
    function getIndex(){
        global $money,$precent;
        
        if(!$this->checkKey()) include DIR.'/error.php';
        else{
            $user   = $this->createUser();
            $rcache = '?'.rand();
            $iohost = $_GET['api_id'] ? str_replace("www.",'',parse_url($_SERVER["HTTP_HOST"], PHP_URL_HOST)) : 'localhost';
            $game   = [];
            
            $game['maps']       = json_encode($this->getMaps());
            $game['viewer_id']  = intval($this->viewer_id);
            $game['user']       = json_encode($user);
            $game['user_id']    = intval($user['id']);
            $game['obj']        = json_encode($this->getObj());
            $game['uhash']      = md5($user['id'].'_'.$this->api_secret.'_'.$this->auth_key);
            $game['auth_key']   = $this->auth_key;
            $game['nodePort']   = $this->server['port'];
            $game['money']      = json_encode($money);
            $game['bonus']      = $this->getBonus($user);
            $game['bonusMoney'] = json_encode($this->bonusMoney);
            $game['precent']    = $precent;
            
            include DIR.'/game.php';
        }
        
        return ' ';
    }
    function saveSettings(){
        $user = $this->checkUser();
        
        if(!$user) return $this->getError(397);
        
        $setting = json_decode($this->data,true);
        $setting = is_array($setting) ? $setting : [];
        $setting['selectWeapons'] = is_array($setting['selectWeapons']) ? $setting['selectWeapons'] : [];
        $setting['selectWeapons'] = array_slice($setting['selectWeapons'], 0, 3);
        
        $arr = [
            'screen'=> intval($setting['screen']),
            'use3D'=> intval($setting['use3D']),
            'fx'=> intval($setting['fx']),
            'tracer'=> intval($setting['tracer']),
            'selectWeapons'=> $setting['selectWeapons'],
			'sound'=>intval($setting['sound'])
        ];
        
        $this->update('users',['settings'=>json_encode($arr)],$user['id']);
        
        return $setting;
    }
    private function getError($n){
        return ['error'=>$n];
    }
    function profile(){
        $user = $this->checkUser();
        
        if(!$user) return $this->getError(397);
        
        return $user;
    }
    function fixPrice($price){
        global $precent;
        
        return round($price/100*$precent);
    }
    function store(){
        $user = $this->checkUser();
        
        if(!$user) return $this->getError(397);
        
        if($this->data['name'] == 'weapon'){
            $weapons = $this->getData('weapons');
            $weapon  = $weapons[$this->data['id']];
            
            if(!$weapon) return $this->getError(138);
            else{
                if($user['money'] < $this->fixPrice($weapon['price']) && $this->fixPrice($weapon['price']) !== 0) return $this->getError('noMathMoney');
                else{
                    $user['weapons'][$this->data['id']] = [];
                    $user['money'] = intval($user['money'])-$this->fixPrice(intval($weapon['price']));
                    
                    
                    $this->update('users',[
                        'money'=>$user['money'],
                        'weapons'=>json_encode($user['weapons'])
                    ],$user['id']);
                    
                    return $user;
                }
            }
        }
        else if($this->data['name'] == 'weaponAddon'){
            $weapons = $this->getData('weapons');
            $weapon  = $weapons[$this->data['weapon']];
            $addon   = $weapon['store'][$this->data['id']];
            
            
            if(!$addon || $user['weapons'][$this->data['weapon']][$this->data['id']]) return $this->getError(879);
            else{
                if($user['money'] < $this->fixPrice($addon['price'])) return $this->getError('noMathMoney');
                else{
                    $user['weapons'][$this->data['weapon']][$this->data['id']] = 1;
                    $user['money'] = intval($user['money'])-$this->fixPrice(intval($addon['price']));
                    
                    $this->update('users',[
                        'money'=>$user['money'],
                        'weapons'=>json_encode($user['weapons'])
                    ],$user['id']);
                    
                    return $user;
                }
            }
        }
        else return $this->getError(309);
    }
    private function addMsg(&$a,$t,$m){
        $a['msg'][md5(rand(999,999999))] = [$t,$m];
    }
    function readMsg(){
        $ids  = is_array($this->data) ? $this->data : [];
        $user = $this->checkUser();
        
        if(!$user) return $this->getError(397);
        
        foreach($ids as $i=>$m) unset($user['msg'][$m]);
        
        $this->update('users',['msg'=>json_encode($user['msg'])],$user['id']);
        
        return $user['msg'];
    }
    private function ToArray($a){
        $b = [];
        foreach($a as $i=>$m) $b[] = $i;
        return $b;
    }
    function rating(){
        $user = $this->checkUser();
        
        $count = $this->count('users','score >= '.$user['score']);
        
        $sql = '
			SELECT @rank := @rank + 1 As num_row,x.* FROM 
               (select * from users  where score <'.$user['score'].' order by score DESC limit 3) as x, (SELECT @rank := '.$count.') as rnk
            union
            SELECT @rankx := @rankx - 1 As num_row,x.* FROM 
               (select * from users  where score >='.$user['score'].' order by score limit 4) as x, (SELECT @rankx := '.$count.'+1) as rnk 
            order by num_row
        ';
        
        //$count = $this->count('users','score > '.$user['score']);
        //$count++;
        
        //$user['num_row'] = $count; 
        
        //$this->select('users',['ORDER'=>'`score` DESC,`kill` DESC','WHERE'=>'nikname != "" AND score < '.$user['score'],'LIMIT'=>7]);
        $this->query($sql);
        $rating = [];
        
        //$rating[] = $user;
        
        while($row = $this->get_row()){
            //$row['num_row'] = ++$count;
            $rating[] = $row;
        } 
        
        return $rating;
    }
    function nikname(){
        $user = $this->checkUser();
        
        if(!$user) return $this->getError(397);
        
        $name = preg_replace("'[^a-zA-Z0-9\-\_\s]'si",'',$this->data);
        
        if(!$name) return $this->getError('Имя не указано');
        elseif(strlen($name) < 3) $this->getError('Имя не может быть меньше 3х символов');
        else{
            $n = $this->count('users','nikname="'.$name.'"');
            
            if($n > 0) return $this->getError('Имя уже занято, попробуйте другое');
            else{
                if($this->error) return $this->getError('Неполадки с сервером, обратитесь позже');
                else $this->update('users',['nikname'=>$name],$user['id']);
            }
            
        }
    }
}

$gm   = new game();
$data = $gm->$do();

if(is_array($data))  echo json_encode($data);
elseif(empty($data)) echo json_encode([]);
else                 echo $data;
?>