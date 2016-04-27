<?php
require __DIR__ . '/../../vendor/autoload.php';
	

/**
 * Parses the worklog file and returns the data vehicle for tasks
 * @return string the JSON string with all the task entries.
 */
function getWorklog() {  
  $csv = file_get_contents(__DIR__ . "/google/worklog.csv");  
  
  $array = array_map("str_getcsv", explode("\n", $csv));
  
  // Column names are TaskID; Actor; component:feature:task; Description; Status; Milestone;
        //   Importance; StartTime; CompletionTime; EstimatedTimeRequired;
       
  date_default_timezone_set('America/Chicago');
  $complete = array();
  foreach (array_slice($array, 1, count($array)-1) as $row) {
    
    $startDate = $row[8];
    $endDate = $row[9];
    $startDate = empty($startDate) ? 0 : strtotime($startDate);
    $endDate = empty($endDate) ? 0 : strtotime($endDate);
    
    $task = array('id' => $row[0],
                  'actor' => $row[1],
                  'component' => $row[2],
                  'feature' => $row[3],
                  'name' => $row[4],
                  'description' => $row[5],
                  'milestone' => $row[6],
                  'importance' => $row[7],
                  'startDate' => $startDate,
                  'endDate' => $endDate,
                  'estimatedTime' => $row[10]
    );
   
    array_push($complete, $task);
  }
  
  return $complete;
}
