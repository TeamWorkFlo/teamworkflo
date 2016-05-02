<?php
require __DIR__ . '/../../../vendor/autoload.php';

define('APPLICATION_NAME', 'Drive API Quickstart');
define('CREDENTIALS_PATH', '~/.credentials/drive-php-quickstart.json');
define('CLIENT_SECRET_PATH', __DIR__ . '/client_secret.json');
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-php-quickstart.json
define('SCOPES', implode(' ', array(
  //Google_Service_Drive::DRIVE_METADATA_READONLY)
  Google_Service_Drive::DRIVE_READONLY)
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

/* 1. First we will get the list of all the files and their corresponding ids
   2. Next, for each file, we will ge the list of its rivisions
   3. Now we will iterate over the list of revisions to get the lastModifyingUser's name and timestamp in seconds */
$optParamsForFilesList = array(
  'orderBy' => "modifiedTime",
  'fields' => "files(id, name)"
);
$optParamsForRevisionsList = array(
  'fields' => "revisions(lastModifyingUser, modifiedTime)"
);
$allFiles = $service->files->listFiles($optParamsForFilesList);

$activities_array = array();
foreach ($allFiles as $file) {
  try {
    $Allrevisions = $service->revisions->listRevisions($file->id, $optParamsForRevisionsList);
    foreach ($Allrevisions as $revision) {
      $actor = $revision->lastModifyingUser->displayName;
      switch ($actor) {
        case "HCC Outfitters":
          # Skip
          break;
        
        default:
          $activity_array = array();
          if (strpos($actor, 'JorgeIv') !== false) {
            $activity_array['actor'] = "Jorge Herrera";
          } else {
            $activity_array['actor'] = $actor;
          }
            $activity_array['timestamp'] = strtotime($revision->modifiedTime);
            $activity_array['source'] = 'googledrive';
            array_push($activities_array, $activity_array);
          break;
      }
    }
  } catch (Google_Exception $e) {
    print "An error occurred: (" . $e->getCode() . ") " . $e->getMessage() . "\n";
  }
}
printf("\n");
printf("Result: %s", json_encode($activities_array));
printf("\n");
