<?php

class ActivityAggregator 
{
  private $connectors = [];
  
  public function registerConnector($connector) {
    array_push($connectors,$connector);
  }
  
  public function getActivity() {
    printf("Aggregating connector activity");
    $results = [];
    foreach ($connectors as $connector) {
      array_merge($results, $connector());
    }
    
    return json_encode($results);  
  } 
}


$activityAggregator = new ActivityAggregator();


?>