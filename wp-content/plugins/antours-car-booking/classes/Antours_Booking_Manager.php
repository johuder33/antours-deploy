<?php

class Antours_Booking_Manager {
    private $db = null;
    private $domain_translation = null;
    private $prefix = "antours_";
    private $tableRegion = "region";
    private $tableProvince = "province";
    private $tableCommune = "commune";
    private $tableServices = "services";
    private $tableServiceByCommune = "service_by_commune";
    private $tablePrice = "price";
    private $tableOrder = "order";

    function __construct($databaseManager, $domain) {
        $this->db = $databaseManager;
        $this->prefix = $this->db->prefix.$this->prefix;
        $this->domain_translation = $domain;
    }

    public function getRegions($actived = 1) {
        $db = $this->db;
        $prefix = $this->prefix;
        $table = $prefix.$this->tableRegion;

        $results = $db->get_results("SELECT id_region, name, ordinal_name FROM {$table} WHERE actived = {$actived};");

        return $results;
    }

    public function getProvincesByRegionID($id_region) {
        if (!isset($id_region) || empty($id_region)) {
            return new WP_Error(400, __('Missing region id', $this->domain_translation));
        }

        if (!is_int($id_region)) {
            return new WP_Error(400, __('Is not int region id', $this->domain_translation));
        }

        $db = $this->db;
        $prefix = $this->prefix;
        $table = $prefix.$this->tableProvince;
        
        $results = $db->get_results("SELECT id_province, name FROM {$table} WHERE id_region = {$id_region} AND actived = 1;");

        return $results;
    }

    public function getCommunesByProvinceID($id_province) {
        if (!isset($id_province) || empty($id_province)) {
            return new WP_Error(400, __('Missing province id', $this->domain_translation));
        }

        if (!is_int($id_province)) {
            return new WP_Error(400, __('Is not int province id', $this->domain_translation));
        }

        $db = $this->db;
        $prefix = $this->prefix;
        $table = $prefix.$this->tableCommune;
        
        $results = $db->get_results("SELECT id_commune, name FROM {$table} WHERE id_province = {$id_province} AND actived = 1;");

        return $results;
    }
}