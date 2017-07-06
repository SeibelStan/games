<?php

$db = new mysqli('localhost', 'root', 'xxx');
$db->select_db('faraon');
$db->query("SET NAMES utf8");