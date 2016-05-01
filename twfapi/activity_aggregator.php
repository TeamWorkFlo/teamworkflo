<?php

include_once './activity_processors/github_activity_processor.php';
include_once './activity_processors/Slack/slackActivityConnector.php';
include_once './activity_processors/google/googleDriveActivityConnector.php';

function getActivity() {
  
  
  $json = file_get_contents(__DIR__ . '/activity_processors/github/4-30-235.json');
		return json_decode($json, true); 
  
    
  $results = [];
  $slackConnector = new SlackActivityConnector();
  $slactivity = $slackConnector->getActivity();
  $results = array_merge($results, $slactivity);
  
  $results = array_merge($results, getGithubActivity());
  
  $googleDriveConnector = new GoogleDriveActivityConnector();
  $gdactivity = $googleDriveConnector->getActivity();
  $results = array_merge($results, $gdactivity);

  return $results;  
} 

?>