<?php

function create_price_schema($prefix, $dbprefix, $collate, $tablename) {
    $tableName = $prefix.$dbprefix.$tablename;

    $sql = "CREATE TABLE IF NOT EXISTS {$tableName} (
        id_price int(11) NOT NULL AUTO_INCREMENT,
        id_service int(11) NOT NULL,
        id_commune int(11) NOT NULL,
        actived TINYINT(1) DEFAULT 1,
        PRIMARY KEY (id_price)
    ) COLLATE {$collate}";

    return array(
        'sql' => $sql
    );
}