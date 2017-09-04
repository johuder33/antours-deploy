<?php

function create_order_service_schema($prefix, $dbprefix, $collate, $tablename) {
    $tableName = $prefix.$dbprefix.$tablename;

    $sql = "CREATE TABLE IF NOT EXISTS {$tableName} (
        id_order int(11) NOT NULL AUTO_INCREMENT,
        order_date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        start_from varchar(200) NULL,
        end_to varchar(200) NULL,
        is_round_trip TINYINT(1) NOT NULL,
        departure_date date NOT NULL,
        return_date date NULL,
        departure_time timestamp NOT NULL,
        return_time timestamp NULL,
        id_service int(11) NOT NULL,
        id_commune int(11) NOT NULL,
        id_province int(11) NOT NULL,
        id_region int(11) NOT NULL,
        price DECIMAL NOT NULL,
        num_passenger int(2) NOT NULL,
        main_passenger_name varchar(40) NOT NULL,
        main_passenger_lastname varchar(60) NOT NULL,
        main_passenger_rut int(11) NULL,
        main_passenger_passport int(11) NULL,
        PRIMARY KEY (id_order)
    ) COLLATE {$collate}";

    return array(
        'sql' => $sql
    );
}