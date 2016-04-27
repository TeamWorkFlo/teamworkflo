<?php

include_once './activity_processors/github_activity_processor.php';

function getActivity() {
  $results = [];
  $gitActivity = getGithubActivity();
  array_merge($results, $gitActivity);
  
  return $results;  
} 


?>