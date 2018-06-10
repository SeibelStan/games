<?php

$gid = $_POST['gid'];
$gtype = $_POST['gtype'];

$game = "games/$gtype-$gid.json";

$defBoard = file_get_contents("samples/$gtype.json");

switch($_POST['action']) {

    case 'getstate': {
        if(!file_get_contents($game)) {
            fopen($game, "w");
            chmod($game, 0777);
            file_put_contents($game, $defBoard);
        }
        echo file_get_contents($game);

        break;
    }

    case 'move': {
        $params = $_POST['params'];

        $board = json_decode(file_get_contents($game));
        foreach($board->units as $unit) {
            if($unit->id == $params['id']) {
                $unit->x = $params['x'];
                $unit->y = $params['y'];

                if($gtype == 'faraon') {
                    $unit->r = $params['r'];
                }
            }
        }
        $board->lastmove = $params['id'];
        file_put_contents($game, json_encode($board));
        echo file_get_contents($game);

        break;
    }

}
