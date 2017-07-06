<?php

ini_set('display_errors', 1);

include('connect.php');

$action = $_REQUEST['action'];

switch($action) {

	case 'newgame': {
		$gid = md5(uniqid());
		$state = '{
			"lastmove": "",
			"units": [
				{"id": "rs", "type": "sphinx", "color": "red", "x": 0, "y": 0, "r": 0},
				{"id": "rf", "type": "faraon", "color": "red", "x": 5, "y": 0, "r": 0},
				{"id": "ra0", "type": "anubis", "color": "red", "x": 4, "y": 0, "r": 0},
				{"id": "ra1", "type": "anubis", "color": "red", "x": 6, "y": 0, "r": 0},
				{"id": "rs0", "type": "scarab", "color": "red", "x": 4, "y": 3, "r": 0},
				{"id": "rs1", "type": "scarab", "color": "red", "x": 5, "y": 3, "r": 1},
				{"id": "rp0", "type": "pyramid", "color": "red", "x": 7, "y": 0, "r": 3},
				{"id": "rp1", "type": "pyramid", "color": "red", "x": 0, "y": 3, "r": 2},
				{"id": "rp2", "type": "pyramid", "color": "red", "x": 0, "y": 4, "r": 3},
				{"id": "rp3", "type": "pyramid", "color": "red", "x": 7, "y": 3, "r": 3},
				{"id": "rp4", "type": "pyramid", "color": "red", "x": 7, "y": 4, "r": 2},
				{"id": "rp5", "type": "pyramid", "color": "red", "x": 2, "y": 1, "r": 0},
				{"id": "rp6", "type": "pyramid", "color": "red", "x": 6, "y": 5, "r": 3},
				{"id": "ss", "type": "sphinx", "color": "silver", "x": 9, "y": 7, "r": 2},
				{"id": "sf", "type": "faraon", "color": "silver", "x": 4, "y": 7, "r": 2},
				{"id": "sa0", "type": "anubis", "color": "silver", "x": 3, "y": 7, "r": 2},
				{"id": "sa1", "type": "anubis", "color": "silver", "x": 5, "y": 7, "r": 2},
				{"id": "ss0", "type": "scarab", "color": "silver", "x": 4, "y": 4, "r": 1},
				{"id": "ss1", "type": "scarab", "color": "silver", "x": 5, "y": 4, "r": 0},
				{"id": "sp0", "type": "pyramid", "color": "silver", "x": 2, "y": 7, "r": 1},
				{"id": "sp1", "type": "pyramid", "color": "silver", "x": 9, "y": 3, "r": 1},
				{"id": "sp2", "type": "pyramid", "color": "silver", "x": 9, "y": 4, "r": 0},
				{"id": "sp3", "type": "pyramid", "color": "silver", "x": 2, "y": 3, "r": 0},
				{"id": "sp4", "type": "pyramid", "color": "silver", "x": 2, "y": 4, "r": 1},
				{"id": "sp5", "type": "pyramid", "color": "silver", "x": 3, "y": 2, "r": 1},
				{"id": "sp6", "type": "pyramid", "color": "silver", "x": 7, "y": 6, "r": 2}
			]
		}';

		$db->query("insert into games (gid, state) values('$gid', '$state')");
		header('Location: index.html?gid=' . $gid);
		break;
	}

	case 'move': {
		$gid = $_REQUEST['gid'];
		$id = $_REQUEST['params']['id'];
		$x = $_REQUEST['params']['x'];
		$y = $_REQUEST['params']['y'];
		$r = $_REQUEST['params']['r'];
		$result = $db->query("select * from games where gid = '$gid'");

		while($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$state = json_decode($row['state']);
		}

		$state->lastmove = $id;
		foreach($state->units as $unit) {
			if($unit->id == $id) {
				$unit->x = $x;
				$unit->y = $y;
				$unit->r = $r;
			}
		}

		$jstate = json_encode($state);
		$db->query("update games set state = '$jstate' where gid = '$gid'");
		echo json_encode($state);
		break;
	}

	case 'getstate': {
		$gid = $_REQUEST['gid'];
		$result = $db->query("select * from games where gid = '$gid'");
		while($row = $result->fetch_array(MYSQLI_ASSOC)) {
			echo $row['state'];
		}
		break;
	}

}