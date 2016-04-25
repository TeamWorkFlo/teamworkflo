<?php
/*
	Sample code for pulling text from slack
	Currently only pulls one time, with a single message (for legibility in PhpFiddle; may not be a concern longterm); a single pull can grab up to 1000 posts
	Results come back in JSON files; will need to store them somehow (Firebase?)
	
	Our general chat has well over a thousand messages; we will need to do multiple requests and store results somehow
	Things that need doing still
		-Collect all changes here as part of Slack Connector
*/


/*
	Connector for Slack Activity
*/
class SlackActivityConnector{
	/*
	variables for any html request
	*/
	//public $urlBase = "https://slack.com/api/"; //this will always be used for api calls
	//public $apiCommand = "channels.history"; //change as necessary
	//public $userToken = "xoxp-29306991603-36823942725-36963802992-bc0a966b80"; //user token for OAuth purposes; the one here is a test key, which I think should last for our project's purposes, but could expire at some point. If we cared enough to go further, we'd need a real licensed key here'

	/*
	variables for this specific command
	*/
	//public $channelID = "C0V9109MZ"; //this is the id for our 'general' chat room; not sure where we get it, the web api test program pulled it for me
	//$latestTimestamp = "1461331518.000134"; //last timestamp checked for messages; need to determine current timestamp somehow; will be needed for additional calls past the first
	//$oldestTimestamp = "0"; //earliest timestamp checked for messages; can always be 0 (start of time)
	//$inclusiveBounds = "1"; //a 1 means it will include messages at the latest timestamp, a 0 means it will not
	//public $msgCount = "1000"; //a single pull can get 1 to 1000 messages; handle accordingly
	//public $unreadMessages = "0"; //if 1 lists how many messages in this frame are unread; not something I think we need
	//public $prettyFormatting = "1"; //determines how output is returned; if 1, shows more of json hierarchy, if 0, dumps result in kinda messily

	function __construct(){
	}
	/*

*/
public function addMessagesToArray($messageObjects, &$destinationArray){
	$numMessages = count($messageObjects);
	for ($j = 0; $j < $numMessages; $j++){
		array_push($destinationArray, $messageObjects[$j]);
	}
	//var_dump($destinationArray);
}
	/*
public function getChatlog ($base, $command, $token, $channel, $latest, $oldest, $inclusive, $count, $unread, $pretty){


	//html POST request code (from here: http://stackoverflow.com/questions/5647461/how-do-i-send-a-post-request-with-php)

	$url = "";
	if ($latest != "-1"){
	$url .= $base . $command . "?token=" . $token . "&channel=" . $channel . "&latest=" . $latest . "&oldest=" . $oldest . "&inclusive=" . $inclusive . "&count=" . $count . "&unreads=" . $unread . "&pretty=" . $pretty;
	}
	else{
	$url .= $base . $command . "?token=" . $token . "&channel=" . $channel . "&oldest=" . $oldest . "&inclusive=" . $inclusive . "&count=" . $count . "&unreads=" . $unread . "&pretty=" . $pretty;
	}
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
	if ($result === FALSE) 

	//var_dump($result);
	//var_dump(json_decode($result));
	return $result;
}
*/

	
	public function getChatLog($latest, $oldest, $inclusive, $count){
		//html POST request code (from here: http://stackoverflow.com/questions/5647461/how-do-i-send-a-post-request-with-php)
	$url = "";
	if ($latest != "-1"){
	$url .= "https://slack.com/api/channels.history?token=xoxp-29306991603-36823942725-36963802992-bc0a966b80&channel=C0V9109MZ&latest=" . $latest . "&oldest=" . $oldest . "&inclusive=" . $inclusive . "&count=" . $count . "&unreads=0&pretty=1";
	}
	else{
	$url .= "https://slack.com/api/channels.history?token=xoxp-29306991603-36823942725-36963802992-bc0a966b80&channel=C0V9109MZ&oldest=" . $oldest . "&inclusive=" . $inclusive . "&count=" . $count . "&unreads=0&pretty=1";
	}
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
		if ($result === FALSE) { /* handle error */}

		//var_dump($result);
	//var_dump($result);
	//var_dump(json_decode($result));
	return $result;
	}
	
	public function getFullChatLog(&$log){
	//$result = json_decode(getChatlog($base, $command, $token, $channel, "-1", $oldest, $inclusive, $count, $unread, $pretty),true);
	$result = json_decode($this->getChatLog("-1", "0", "1", "1000"),true);

$i = 0;
	//while($i < 5){
while($result['has_more'] == 1){
	$this->addMessagesToArray($result["messages"], $log);
	//var_dump($firstResult["messages"]);
	//echo "just dumped\n";
		$lastMessageIndex = count($result["messages"])-1;
	//echo "updated index\n";
		$earliestTimestamp = $result["messages"][$lastMessageIndex]["ts"];
	//echo "updated Timestamp";
	$result = json_decode($this->getChatLog($earliestTimestamp, "0", "1", "1000"),true);
	//var_dump($result["messages"]);
	//$result = json_decode(getChatlog($base, $command, $token, $channel, $earliestTimestamp, $oldest, "0", $count, $unread, $pretty),true);
	//echo "updated firstResult";
	//var_dump($firstResult);
		$i++;
	if ($result['has_more'] == 1){
		//echo ".";
	}
	else{
		//echo "-";
	}
		//$lastMessageIndex = count($firstResult["messages"])-1;
		//echo $lastMessageIndex;
		//$earliestTimestamp = $firstResult["messages"][(count($firstResult["messages"])-1)]["ts"];
}
$this->addMessagesToArray($result["messages"], $log);

		//var_dump($log);
//var_dump($messageHistory);
	//var_dump(json_encode($log));
}

/*
	Get chat log entries from within a certain time window. Will call until all messages from window have been pulled.
*/

	//public function getChatLogInTimeWindow($base, $command, $token, $channel, $latest, $oldest, $inclusive, $count, $unread, $pretty, &$log){
public function getChatLogInTimeWindow($latest, $oldest, &$log){
	
	$result = json_decode($this->getChatlog($latest, $oldest, "1", "1000"),true);

	$lastMessageIndex = count($result["messages"])-1;
	
	if ((floatval($result["messages"][$lastMessageIndex]["ts"]) > floatval($oldest)) && ($oldest != 0)){
		
	
	
	$i = 0;
	//while($i < 5){
		while(($lastMessageIndex != -1) && (floatval($result["messages"][$lastMessageIndex]["ts"]) > floatval($oldest))){
			//while(($lastMessageIndex != -1) && (floatval($result["messages"][$lastMessageIndex]["ts"]) > floatval($oldest)){
			$this->addMessagesToArray($result["messages"], $log);
			//var_dump($firstResult["messages"]);
			//echo "just dumped\n";
			//$lastMessageIndex = count($result["messages"])-1;
			//echo $lastMessageIndex;
			//echo "updated index\n";
			$earliestTimestamp = $result["messages"][$lastMessageIndex]["ts"];
			//echo " earliestTimestamp:";
			//echo $earliestTimestamp;
			//echo " ";
			//echo "updated Timestamp";
			//$result = json_decode(getChatlog($base, $command, $token, $channel, $earliestTimestamp, $oldest, "1", $count, $unread, $pretty),true);
			$result = json_decode($this->getChatlog($earliestTimestamp, $oldest, "1", "1000"),true);
			if (count($result["messages"]) != 0){
				$lastMessageIndex = count($result["messages"])-1;
				echo $lastMessageIndex;
				echo " ";
				//echo "updated firstResult";
				//var_dump($firstResult);
				$i++;
				echo floatval($result["messages"][$lastMessageIndex]["ts"]);
				echo " ";
				echo floatval($oldest);
				echo " * ";
			
				if(floatval($result["messages"][$lastMessageIndex]["ts"]) > floatval($oldest)){
				//if (($result["messages"][$lastMessageIndex]["ts"] != $oldest)){
					echo ".";
				}
				else{
					echo "-";
				}
			}
			else{
				$lastMessageIndex = -1;
			}
			
			//$lastMessageIndex = count($firstResult["messages"])-1;
			//echo $lastMessageIndex;
			//$earliestTimestamp = $firstResult["messages"][(count($firstResult["messages"])-1)]["ts"];
			
			
		}
	}
	$this->addMessagesToArray($result["messages"], $log);

	//var_dump($log);
	//var_dump(json_encode($log));
}

/*
	Convert Slack UserIDs to Actual Names
*/

public function convertUserIDToName($userID){
	switch($userID){
		case "U0VA9MRSA":
			return "Cullen Brown";
		case "U0VAJUU5R":
			return "Eric Gonzalez";
		case "U0V94P2DR":
			return "Jorge Herrera";
		case "U0VBU9NN9":
			return "Aqib Bhat";
	}
}

public function editDownMessages($startingLog){
	$numMessages = count($startingLog);
	$editedMessages = array();
	
	for ($i = 0; $i < $numMessages; $i++){
		$newMessage = array();
		$newMessage["name"] = convertUserIDToName($startingLog[$i]["user"]);
		$newMessage["source"] = "Slack";
		$newMessage["timestamp"] = floatval($startingLog[$i]["ts"]);
		array_push($editedMessages, $newMessage);
		unset($newMessage);
	}
	return $editedMessages;
}
	
}

$sl = new SlackActivityConnector();

$ts =  "1461465086.000825";

$messageHistory = array();

//var_dump($sl->getChatLog("-1", "0", "1", "1000"));
//var_dump($sl->getFullChatLog("0","1","1000", $messageHistory));
//$sl->getFullChatLog($messageHistory);
$sl->getChatLogInTimeWindow($ts, "0", $messageHistory);

var_dump($messageHistory);

//$sl->getFullChatLog($urlBase, $apiCommand, $userToken, $channelID, $oldestTimestamp, $inclusiveBounds, $msgCount, $unreadMessages, $prettyFormatting, $messageHistory);

//getChatLogInTimeWindow($urlBase, $apiCommand, $userToken, $channelID, $ts, $latestTimestamp, $inclusiveBounds, "100", $unreadMessages, $prettyFormatting, $messageHistory);

//$resultantJSON = json_encode($messageHistory);

//var_dump($messageHistory);
//var_dump($resultantJSON);
//var_dump(editDownMessages($messageHistory));
	//var_dump(json_encode(editDownMessages($messageHistory)));

?>