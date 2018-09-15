<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");

$article = new Article();
$article->id = isset($_GET['id']) ? $_GET['id'] : 1;
if($article->read()){
	echo returnResponse(json_encode($article->contents));
}
else {
	echo returnResponse("Error", 500);
}

class Article{
	public $id;
	public $contents;

	function read(){
		$articleFile = '../../data/article-'.$this->id.'.json';
		if(!$file = @file_get_contents($articleFile)){
			return false;
		}
		else {
			$articleJson = json_decode($file);
			$this->contents = $articleJson;
			return true;
		}
	}
}

function returnResponse($message = null, $code = 200){
	http_response_code($code);
	header('Content-Type: application/json');
	$status = array(
        200 => '200 OK',
        500 => '500 Internal Server Error'
    );
    header('Status: '.$status[$code]);
    return json_encode(array(
        'status' => $code < 300,
        'message' => $message
    ));
}