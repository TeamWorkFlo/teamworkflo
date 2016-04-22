<?php

// This file is generated by Composer
require_once '../../vendor/autoload.php';

$client = new \Github\Client();

//Get all the repository information (Not sure if we need it)
//$repositories = $client->api('user')->repositories('TeamWorkFlo');
//print_r($repositories);


//Get all the different branches for a given repository
$branches = $client->api('repo')->branches('TeamWorkFlo', 'teamworkflo');
print_r($branches);

//Get all commits from a particular branch in this case master.
//$commits = $client->api('repo')->commits()->all('TeamWorkFlo', 'teamworkflo', array('sha' => 'master'));
//print_r($commits);
?>
