<?
function scan($dir,$p){
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

$glAllScan = [];

function for_scan($result,$dir){
    global $glAllScan;
    
    foreach($result['file'] as $name=>$path){
        $glAllScan[] = str_replace($dir,'',$path).'/'.$name;
    }
    foreach($result['dir'] as $name=>$path){
        for_scan(scan($path.'/'.$name,true),$dir);
    }
}

function allFileScan($dir){
    global $glAllScan;
    
    $glAllScan = [];
    
    for_scan(scan($dir,true),$dir);
    
    return $glAllScan;
}

function del_dir($path){
    if(@file_exists($path) && is_dir($path)){
		$dirHandle = @opendir($path);
		while (false !== ($file = @readdir($dirHandle))){
			if ($file!='.' && $file!='..'){
				$tmpPath = $path.'/'.$file;
				
				if (is_dir($tmpPath)) $this->del_dir($tmpPath);
	  			else @unlink($tmpPath);
			}
		}
		@closedir($dirHandle);
		
        if(@rmdir($path)) return true;
        else return false;
	}
	else return false;
}

function cropImg($path,$x,$y,$w,$h){
    
    $image = imagecreatefromjpeg($path); 
    
    $width  = imagesx($image);
    $height = imagesy($image);
            
    $thumb = imagecreatetruecolor($w, $h);
    
    imagecopyresampled($thumb,$image,0,0,$x, $y,$w, $h,$width, $height);
    
    imagejpeg($thumb,$resultName,100);
    
    imagedestroy($thumb);
    
    return $altResultName;
}
?>