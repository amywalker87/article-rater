<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$data = $_POST['data'];
if(isset($data)){
	$data = json_decode($data);

	foreach($data as $articleId => $articleRating){
		$rating = new Rating();
		$rating->articleId = $articleId;
		$rating->rating = $articleRating;
		submitRating($rating);
	}
	echo returnResponse('Ratings submitted');
}
else{
	echo returnResponse('Error',500);
}

class Rating{
	public $articleId;
	public $rating;
}

function submitRating($rating){
	// This would send the rating of the article to a database
	// You can add up the rating for each article ID and the one with the lowest score is the most popular
	return true;
}

function returnResponse($message = null, $code = 200){
	http_response_code($code);
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