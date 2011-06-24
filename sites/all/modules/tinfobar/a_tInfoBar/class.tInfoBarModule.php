<?php if (!defined('APPLICATION')) exit();

/**
 * The tInfoBar main class where all the interaction is held
 * It is a dynamic class, which means that you can add a method at any time to it by the ->add() method
 *		so it can be extended indefinitely and at any point in time
 * To add an attribute to it, just do it directly: new tInfoBarModule()->newAttribute = 'test';
 */
class tInfoBarModule extends Gdn_Module {
   
   public $vars = array();
   
   public function __construct(&$Sender = '') {
		parent::__construct($Sender);
   }
   
   /**
    * Takes a php array and returns the JSON equivalent.
    * It checks if the array passes is associative. If it is not, it calls toJSArray() instead
    * @param $arr the array
    * @return the JSON object
   **/
   public function toJSON( $arr ){
   	if( !$arr ) return;
   	if( !$this->isAssociative( $arr ) )  return $this->toJSArray( $arr );
   	
   	$h = '';
   	foreach( $arr as $k => $v ) {
   		$k = is_numeric( $k ) ? $k : "'$k'";
   		if( is_array( $v ) )
   				$h .= ", $k:" . ( $this->isAssociative( $v ) ? $this->toJSON( $v ) : $this->toJSArray( $v ) );
   			else
   				$h .= ", $k: ".( is_numeric( $v ) ? $v : "'$v'" );
   	}
   	
   	$h = '{' . substr($h, 2) . '}';
   	return $h;
   }
   
   /**
    * Converts a php array to a javascript array regardless if it is associative or not.
    * Recommended to use toJSON() instead
    * @param $arr the array
    * @return the javascript array
   **/
   public function toJSArray( $arr ){
   	if( !$arr ) return;
   	
   	$h = '';
   	foreach( $arr as $v ) {
   		if( is_array( $v ) )
   				$h .= ", " . ( $this->isAssociative( $v ) ? $this->toJSON( $v ) : $this->toJSArray( $v ) );
   			else
   				$h .= ", ".( is_numeric( $v ) ? $v : "'$v'" );
   	}
   	
   	$h = '[' . substr($h, 2) . ']';
   	return $h;
   }
   
   /**
    * Checks if an array is associative or not
    * @param $arr the array
    * @param return true if it is
   **/
   private function isAssociative( $arr ){ return array_keys($arr) !== range(0, count($arr) - 1); }
   
   /**
    * The __call() method is automatically called whenever a call to a method is made.
    * It check whether the method/attribute exists and calls it
    * @param $name the name of the method to be called
    * @param $args the arguments array
    * @return the call to the function
   **/
   public function __call($name, $args){
   	if(!isset($this->vars[$name])){
   		echo "<br />Warning: call to unknown method/attribute <b>$name</b> in tInfoBarModule";
   		return false;
   	}
		return call_user_func_array($this->vars[$name], $args);
   }
   
   /**
    * Adds a new method to the class
    * @param $name
    * @param $value
    * @return $this
   **/
   public function add($name, $value){
   	$this->vars[$name] = $value;
   	
   	return $this;
   }
   
}


?>
