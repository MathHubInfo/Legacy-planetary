<?

define( "TNTBASE_USERNAME", 'planetarybroker' );
define( "TNTBASE_PASSWORD", 'n3pt4n3' );

doRequest( $_REQUEST['cd'], $_REQUEST['name'] );

function doRequest( $cd, $name ){
  if( !isset($cd) || !isset($name) ){
    jsonOutput( array( '_error' => 'Not enough parameters' ) );
  } else {
    $url = "https://tnt.kwarc.info/tntbase/stc/restful/jobad/basic?action=expandDefinition&cd=$cd&symbol=$name";
    jsonOutput( array( 'result' => getResult( $url, '', 'get', '' ) ) );
  }
}


function getResult( $Url, $Data, $Method, $Header) {
    if ($Method == 'post') {
        $res = do_post($Url, $Data, $Header);
        return "<span xmlns:m=\"http://www.w3.org/1998/Math/MathML\">" . trim($res) . "</span>";
    } else if ($Method == 'get') {
        $res = do_get($Url, $Header);
        return "<span xmlns:m=\"http://www.w3.org/1998/Math/MathML\">" . trim($res) . "</span>";
    }
}

/**
 * A function to do a POST request to a certain $host with the $data
 * @param string $host the URL of the backend
 * @param string $data the POST data formatted as a string
 */
function do_post($host, $data) {
    $session = curl_init($host);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERPWD, TNTBASE_USERNAME . ":" . TNTBASE_PASSWORD);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    curl_setopt($session, CURLOPT_POST, true);
    curl_setopt($session, CURLOPT_POSTFIELDS, $data);
    curl_setopt($session, CURLOPT_HEADER, false);
    curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($session);
    curl_close($session);
    return $response;
}

function do_get($host, $header = '') {
    $ch = curl_init();
    if( $header )
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: ' . $header));
    curl_setopt($ch, CURLOPT_URL, $host);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, TNTBASE_USERNAME . ":" . TNTBASE_PASSWORD);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    $output = curl_exec($ch);
    curl_close($ch);
    $output = str_replace('<?xml version="1.0" encoding="UTF-8"?>', '', $output);
    return $output;
}

function jsonOutput( $data ) {
	if( !headers_sent() ) {
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');
	}

	exit( json_encode( $data ) );
}

?>
