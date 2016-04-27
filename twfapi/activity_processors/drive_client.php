<?php
require __DIR__ . '/../../vendor/autoload.php';
	

define('APPLICATION_NAME', 'Drive API Quickstart');
define('CREDENTIALS_PATH', '~/.credentials/drive-php-quickstart.json');
define('CLIENT_SECRET_PATH', __DIR__ . '/../../vendor/google/client_secret.json');
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-php-quickstart.json
define('SCOPES', implode(' ', array(
  Google_Service_Drive::DRIVE_FILE, Google_Service_Drive::DRIVE_READONLY)
));

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
    printf("the credentials path is finding: %s", $credentialsPath);

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
