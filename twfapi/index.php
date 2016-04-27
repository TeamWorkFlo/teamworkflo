	<?php
	header("Content-Type; application/json");
	//$path = $_SERVER['DOCUMENT_ROOT'];
	//include($_SERVER['DOCUMENT_ROOT']."teamworkflo/twfapi/functions.php");

	include_once './activity_aggregator.php';
	include_once './activity_processors/github_activity_processor.php';
	include_once './activity_processors/drive_client.php';


	if (!empty($_GET['method'])) {

		$method = $_GET['method'];

		if ($method=='tasks') {
			deliver_response(200, "Tasks found", getWorklog());

		}else if($method=='activities'){			
			deliver_response(200, "Activities found", $activityAggregator->getActivity());

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
