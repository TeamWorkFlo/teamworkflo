	<?php
	header("Content-Type; application/json");
	//$path = $_SERVER['DOCUMENT_ROOT'];
	//include($_SERVER['DOCUMENT_ROOT']."teamworkflo/twfapi/functions.php");
	include_once 'functions.php';
<<<<<<< HEAD
	include_once './activity_processors/github_activity_processor.php';
=======
>>>>>>> 5419cfde5fe308c75ce4a5083e07f360bb9763da


	if (!empty($_GET['method'])) {

		$method = $_GET['method'];

		if ($method=='tasks') {
<<<<<<< HEAD
			deliver_response(200, "Task found", "test");

		}else if($method=='activities'){
			deliver_response(200, "Activities found", getCommitsFromBranch("master"));
=======
			deliver_response(200, "Task found", get_tasks());

		}else if($method=='activities'){
			deliver_response(200, "Activities found", get_activities());
>>>>>>> 5419cfde5fe308c75ce4a5083e07f360bb9763da

		}else{
			deliver_response(400, "invalid request", NULL);
		}

	}
	else
	{
		deliver_response(400, "invalid request", NULL);
	}



	function deliver_response($status, $status_message, $data) {
		$response['status'] = $status;
		$response['$status_message'] = $status_message;
		$response['data'] = $data;

		$json_response = json_encode($response);
		echo $json_response;
	}






	?>
