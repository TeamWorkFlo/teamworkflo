<?php

include_once './activity_processors/github_activity_processor.php';
include_once './activity_processors/Slack/slackActivityConnector.php';

function getActivity() {
  $results = [];
  $slackConnector = new SlackActivityConnector();
  $slactivity = $slackConnector->getActivity();
  //$results = array_merge($results, getGithubActivity());
  $results = array_merge($results, $slactivity);
  
  return $results;  
} 


?>