<?php
/*
	Sample code for pulling text from slack
	Currently only pulls one time, with a single message (for legibility in PhpFiddle; may not be a concern longterm); a single pull can grab up to 1000 posts
	Results come back in JSON files; will need to store them somehow (Firebase?)
	
	Our general chat has well over a thousand messages; we will need to do multiple requests and store results somehow
	Things that need doing still
		-Multiple requests (while resulting JSON's "has more" value is still true)
		-Determine starting timestamps
		-Determine multiple channel id's (we have mostly used the general channel, so this may be negligible)
*/

/*
variables for any html request
*/
$urlBase = "https://slack.com/api/"; //this will always be used for api calls
$apiCommand = "channels.history"; //change as necessary
$userToken = "xoxp-29306991603-36823942725-36963802992-bc0a966b80"; //user token for OAuth purposes; the one here is a test key, which I think should last for our project's purposes, but could expire at some point. If we cared enough to go further, we'd need a real licensed key here'

/*
variables for this specific command
*/
$channelID = "C0V9109MZ"; //this is the id for our 'general' chat room; not sure where we get it, the web api test program pulled it for me
$latestTimestamp = "1461331518.000134"; //last timestamp checked for messages; need to determine current timestamp somehow; will be needed for additional calls past the first
$oldestTimestamp = "0"; //earliest timestamp checked for messages; can always be 0 (start of time)
$inclusiveBounds = "1"; //a 1 means it will include messages at the latest timestamp, a 0 means it will not
$msgCount = "1"; //a single pull can get 1 to 1000 messages; handle accordingly
$unreadMessages = "0"; //if 1 lists how many messages in this frame are unread; not something I think we need
$prettyFormatting = "1"; //determines how output is returned; if 1, shows more of json hierarchy, if 0, dumps result in kinda messily

function getChatlog ($base, $command, $token, $channel, $latest, $oldest, $inclusive, $count, $unread, $pretty){

	/*
	html POST request code (from here: http://stackoverflow.com/questions/5647461/how-do-i-send-a-post-request-with-php)
	*/
	$url = $base . $command . "?token=" . $token . "&channel=" . $channel . "&latest=" . $latest . "&oldest=" . $oldest . "&inclusive=" . $inclusive . "&count=" . $count . "&unreads=" . $unread . "&pretty=" . $pretty;
	//echo $url . "\n";
	$data = array();

	// use key 'http' even if you send the request to https://...
	$options = array(
    	'http' => array(
        	'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        	'method'  => 'POST',
        	'content' => http_build_query($data)
    	)	
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);
	if ($result === FALSE) { /* Handle error */ }

	//var_dump($result);
	//var_dump(json_decode($result));
	return $result;
};

var_dump(getChatlog($urlBase, $apiCommand, $userToken, $channelID, $latestTimestamp, $oldestTimestamp, $inclusiveBounds, $msgCount, $unreadMessages, $prettyFormatting));
?>