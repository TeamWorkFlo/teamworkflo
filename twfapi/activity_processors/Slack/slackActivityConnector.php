<?php
/*
	Activity Connector for Slack Chat Logs.
*/

/*
	Connector for Slack Activity
*/
class SlackActivityConnector{

	function __construct(){
	}
	
	
	/*
		Push messages from messageObjects into a reference accessed array destinationArray
	*/
	private function addMessagesToArray($messageObjects, &$destinationArray){
		$numMessages = count($messageObjects);
		for ($j = 0; $j < $numMessages; $j++){
			array_push($destinationArray, $messageObjects[$j]);
		}
	}

	/*
		Submit an HTML Post request for a subsection of the Slack chat history
	*/
	private function getChatLog($latest, $oldest, $inclusive, $count){
		//html POST request code (from here: http://stackoverflow.com/questions/5647461/how-do-i-send-a-post-request-with-php)
		$url = "";
		$token = file_get_contents(__DIR__ . "/slacktoken.txt");
		if ($latest != "-1"){	//user has entered a request with a "latest" timestamp
			$url .= "https://slack.com/api/channels.history?token=" . $token . "&channel=C0V9109MZ&latest=" . $latest . "&oldest=" . $oldest . "&inclusive=" . $inclusive . "&count=" . $count . "&unreads=0&pretty=1";
		}
		else{	//user has entered a requsest without a "latest" timestamp
			$url .= "https://slack.com/api/channels.history?token=" . $token . "&channel=C0V9109MZ&oldest=" . $oldest . "&inclusive=" . $inclusive . "&count=" . $count . "&unreads=0&pretty=1";
		}
	
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

		return $result;
	}
	
	/*
		Get entire chat log and store by reference in array "log"
	*/
	private function getFullChatLog(&$log){
		$result = json_decode($this->getChatLog("-1", "0", "1", "1000"),true);

		while($result['has_more'] == 1){
			$this->addMessagesToArray($result["messages"], $log);
			$lastMessageIndex = count($result["messages"])-1;
			$earliestTimestamp = $result["messages"][$lastMessageIndex]["ts"];
			$result = json_decode($this->getChatLog($earliestTimestamp, "0", "1", "1000"),true);
	
		}
		$this->addMessagesToArray($result["messages"], $log);
	}

	/*
		Get chat log entries from within a certain time window. Will call until all messages from window have been pulled.
	*/
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

	/*
		Reduce Message contents down to Activity Data
	*/
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
		$activityJSON = $this->reduceMessages($activityList);
		return $activityJSON;
	}	
	
	/*
		Returns a JSON with activity data between the two timestamps
	*/
	public function getActivityWindow($latest,$oldest){
		$activityList = array();
		$this->getChatLogWindow($latest, $oldest, $activityList);
		$activityJSON = $this->reduceMessages($activityList);
		return $activityJSON;
	}
	
}

//$sl = new SlackActivityConnector();

//var_dump($sl->getActivity());
//var_dump($sl->getActivityWindow("-1","0"));

?>
