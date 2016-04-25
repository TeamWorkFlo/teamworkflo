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

	function __construct(){
	}
	
	private function addMessagesToArray($messageObjects, &$destinationArray){
		$numMessages = count($messageObjects);
		for ($j = 0; $j < $numMessages; $j++){
			array_push($destinationArray, $messageObjects[$j]);
		}
	}

	private function getChatLog($latest, $oldest, $inclusive, $count){
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
	
	private function getFullChatLog(&$log){
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
private function getChatLogWindow($latest, $oldest, &$log){
	
	$result = json_decode($this->getChatlog($latest, $oldest, "1", "1000"),true);

	$lastMessageIndex = count($result["messages"])-1;

	while ((floatval($result["messages"][$lastMessageIndex]["ts"]) > floatval($oldest)) && $result["has_more"] == 1){
		$this->addMessagesToArray($result["messages"], $log);
		$earliestTimestamp = $result["messages"][$lastMessageIndex]["ts"];
		
		$result = json_decode($this->getChatlog($earliestTimestamp, $oldest, "1", "1000"),true);
		$lastMessageIndex = count($result["messages"])-1;
	}
	$this->addMessagesToArray($result["messages"], $log);
	
	$i = 0;

}

/*
	Convert Slack UserIDs to Actual Names
*/

	private function convertUserIDToName($userID){
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

	private function reduceMessages($startingLog){
		$numMessages = count($startingLog);
		$editedMessages = array();
	
		for ($i = 0; $i < $numMessages; $i++){
			$newMessage = array();
			$newMessage["actor"] = $this->convertUserIDToName($startingLog[$i]["user"]);
			$newMessage["source"] = "Slack";
			$newMessage["timestamp"] = floatval($startingLog[$i]["ts"]);
			array_push($editedMessages, $newMessage);
			unset($newMessage);
		}
		return $editedMessages;
	}
	/*
		Returns a JSON with activity data for the full chat history
	*/
	public function getActivity(){
		$activityList = array();
		
		$this->getFullChatLog($activityList);
	
		$activityJSON = json_encode($this->reduceMessages($activityList));
		
		return $activityJSON;
	}	
	
	/*
		Returns a JSON with activity data between the two timestamps
	*/
	public function getActivityWindow($latest,$oldest){
		$activityList = array();
		
		$this->getChatLogWindow($latest, $oldest, $activityList);
	
		echo(count($activityList));
		
		$activityJSON = json_encode($this->reduceMessages($activityList));
		
		return $activityJSON;
	}
	
}

$sl = new SlackActivityConnector();

$ts =  "1461465086.000825";

//$messageHistory = array();

//var_dump($sl->getChatLog("-1", "0", "1", "1000"));
//var_dump($sl->getFullChatLog("0","1","1000", $messageHistory));
//$sl->getFullChatLog($messageHistory);
//$sl->getChatLogInTimeWindow($ts, "0", $messageHistory);

//var_dump($messageHistory);

//var_dump($sl->getActivity());
var_dump($sl->getActivityWindow("-1","0"));


?>