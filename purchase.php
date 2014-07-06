<?php
header("Content-Type: application/json; encoding=utf-8");

/**
 * Ключ доступа и деньги
 */
 
include dirname(__FILE__).'/access.php';

/**
 * Load data file
 */
 
function loadDataFile($name){
    global $accessKey;
    return unserialize(file_get_contents(dirname(__FILE__).'/data/'.$accessKey.'_'.$name.'.data'));
}

/**
 * Params
 */
 
$settings   = loadDataFile('settings');
$server     = $settings['server']['localOn'] ? $settings['server']['local'] : $settings['server']['node'];
$siteName   = $_SERVER["HTTP_HOST"];
$input      = $_POST;
$secret_key = $settings['main']['api_secret'];
$str        = '';
$sig        = $input['sig'];


/**
 * Check secret key
 */
 
unset($input['sig']);
ksort($input);

foreach($input as $k => $v) $str .= $k.'='.$v;

if($sig != md5($str.$secret_key)) {
    $response['error'] = array(
        'error_code' => 10,
        'error_msg' => 'Несовпадение вычисленной и переданной подписи запроса.',
        'critical' => true
    );
}
else{
    
    $item      = $input['item'];               //item
    $itemEx    = explode('.',$item);           //explode item
    $itemName  = $itemEx[0];                   //item name
    $itemParam = array_slice($itemEx,1);       //item params (itemName.param.param....)
    $order_id  = intval($input['order_id']);
    $user_id   = intval($input['user_id']);    //vk user id
    $noFind    = true;                        //check if find object
    
    if($input['notification_type'] == 'get_item' || $input['notification_type'] == 'get_item_test'){
        if($itemName == 'money' && $money[$itemParam[0]]){
            $noFind = false;
            
            $response['response'] = array(
                'item' => $item,
                'title' => 'Деньги',
                //'photo_url' => 'http://'.$siteName.'/images/game/money/'.$itemParam[0].'.png',
                'price' => $money[$itemParam[0]]
            );
        }
        
        if($noFind){
            $response['error'] = array(
                'error_code' => 237,
                'item'=>$item,
                'error_msg' => 'Обьект не найден в базе',
                'critical' => true
            ); 
        }
    }
    elseif($input['notification_type'] == 'order_status_change' || $input['notification_type'] == 'order_status_change_test'){
        if($input['status'] == 'chargeable'){
            
            include dirname(__FILE__).'/media/db_class.php';
                
            $db = new db();
            
            $db->conf = [
                'user'=>$server['dbuser'],
                'pass'=>$server['dbpassword'],
                'dbname'=>$server['dbname'],
                'ip'=>$server['dbhost'].($server['dbport'] ? ':'.$server['dbport'] : '')
            ];
            
            $db->connect();
            
            $user   = $db->get_row($db->select('users','uid='.$user_id));
            $unitid = $user['id'];
            
            if($itemName == 'money' && $user && $money[$itemParam[0]]){
                $noFind = false;
                
                $db->update('users',['money'=>intval($user['money'])+intval($itemParam[0])],'id='.$unitid);
                
                $response['response'] = array(
                    'order_id' => $order_id,
                    'app_order_id' => $item,
                );
            }
            
            if($noFind){
                $response['error'] = array(
                    'error_code' => 546,
                    'item'=>$item,
                    'error_msg' => 'Ошибка данных',
                    'critical' => true
                ); 
            }
        }
        else{
            $response['error'] = array(
                'error_code' => 100,
                'error_msg' => 'Передано непонятно что вместо chargeable.',
                'critical' => true
            ); 
        }
    }
}

echo json_encode($response);
?> 