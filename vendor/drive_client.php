<?php
require __DIR__ . '/autoload.php';

define('APPLICATION_NAME', 'Drive API Quickstart');
define('CREDENTIALS_PATH', '~/.credentials/drive-php-quickstart.json');
define('CLIENT_SECRET_PATH', __DIR__ . '/google/client_secret.json');
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-php-quickstart.json
define('SCOPES', implode(' ', array(
  Google_Service_Drive::DRIVE_FILE, Google_Service_Drive::DRIVE_READONLY)
));

if (php_sapi_name() != 'cli') {
  throw new Exception('This application must be run on the command line.');
}

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient() {
  $client = new Google_Client();
  $client->setApplicationName(APPLICATION_NAME);
  $client->setScopes(SCOPES);
  $client->setAuthConfigFile(CLIENT_SECRET_PATH);
  $client->setAccessType('offline');
  
  // Load previously authorized credentials from a file.
  $credentialsPath = expandHomeDirectory(CREDENTIALS_PATH);
  if (file_exists($credentialsPath)) {
    $accessToken = file_get_contents($credentialsPath);
  } else {
    // Request authorization from the user.
    $authUrl = $client->createAuthUrl();
    printf("Open the following link in your browser:\n%s\n", $authUrl);
    print 'Enter verification code: ';
    $authCode = trim(fgets(STDIN));

    // Exchange authorization code for an access token.
    $accessToken = $client->authenticate($authCode);

    // Store the credentials to disk.
    if(!file_exists(dirname($credentialsPath))) {
      mkdir(dirname($credentialsPath), 0700, true);
    }
    file_put_contents($credentialsPath, $accessToken);
    printf("Credentials saved to %s\n", $credentialsPath);
    
    
  }
  $client->setAccessToken($accessToken);
  
  // Refresh the token if it's expired.
  if ($client->isAccessTokenExpired()) {
    $client->refreshToken($client->getRefreshToken());
    file_put_contents($credentialsPath, $client->getAccessToken());
  }
  return $client;
}

/**
 * Expands the home directory alias '~' to the full path.
 * @param string $path the path to expand.
 * @return string the expanded path.
 */
function expandHomeDirectory($path) {
  $homeDirectory = getenv('HOME');
  if (empty($homeDirectory)) {
    $homeDirectory = getenv("HOMEDRIVE") . getenv("HOMEPATH");
  }
  return str_replace('~', realpath($homeDirectory), $path);
}

// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Drive($client);

/**
 * Parses the worklog file and returns the data vehicle for tasks
 * @return string the JSON string with all the task entries.
 */
function getWorklog() {
  $client = getClient();
  $service = new Google_Service_Drive($client);
  
  $fileId = '1UUJAbPlcJ9ODmTmRNrNEG3tkGhjTF2c4WIwCG_RbKck';
  $csv = $service->files->export($fileId, 'text/csv', array(
  'alt' => 'media' ));  
  
  $array = array_map("str_getcsv", explode("\n", $csv));
  
  // Column names are TaskID; Actor; component:feature:task; Description; Status; Milestone;
        //   Importance; StartTime; CompletionTime; EstimatedTimeRequired;
  $complete[] = array();
  foreach (array_slice($array, 1, count($array)-1) as $row) {
    printf("%s", json_encode($row));
    $components = explode(":", $row[2]);
    printf("Task Data: %s %s %s\n", $components[0], $components[1], $components[2]);
    $task = array('id' => $row[0],
                  'actor' => $row[1],
                  'component' => $components[0],
                  'feature' => $components[1],
                  'name' => $components[2],
                  'description' => $row[3],
                  'status' => $row[4],
                  'milestone' => $row[5],
                  'importance' => $row[6],
                  'startDate' => $row[7],
                  'completionDate' => $row[8],
                  'estimatedTime' => $row[9]
    );
    $json = json_encode($task);
    array_push($complete, $json);
  }
  
  return $complete;
}

$results = getWorklog();
printf("%s", $results);


// Print the names and IDs for up to 10 files.
$optParams = array(
  'pageSize' => 10,
  'fields' => "nextPageToken, files(id, name)"
);
$results = $service->files->listFiles($optParams);

if (count($results->getFiles()) == 0) {
  print "No files found.\n";
} else {
  print "Files:\n";
  foreach ($results->getFiles() as $file) {
    printf("%s (%s)\n", $file->getName(), $file->getId());
  }
}
