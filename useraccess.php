<?php
if ($_POST['searchType'] === 'fetchLE') {
    fetchLEdetails();
}

function fetchLEdetails() {
    $codspm = $_REQUEST['codspm'];
    $codlevel = $_REQUEST['codlevel'];
    $codstatus = $_REQUEST['codstatus'];
    
    if ($codstatus == 25) {
        $query = "SELECT DISTINCT \"dbo\".\"TSPMDBE\".\"CODSPM\", \"dbo\".\"TSPMDBE\".\"NAMESPM\"
            FROM \"dbo\".\"TSPMDBE\", \"dbo\".\"TLINERIADBE\", \"dbo\".\"TRIADBE\", \"dbo\".\"TCDTFILEDBE\"
            WHERE \"dbo\".\"TSPMDBE\".\"CODLEVEL\" = '".$codlevel."'
            AND \"dbo\".\"TSPMDBE\".\"CODSPM\" = \"dbo\".\"TLINERIADBE\".\"CODSPM\"
            AND \"dbo\".\"TSPMDBE\".\"CODLEVEL\" = \"dbo\".\"TLINERIADBE\".\"CODLEVEL\"
            AND \"dbo\".\"TLINERIADBE\".\"FLAG\" = 'Y'
            AND \"dbo\".\"TRIADBE\".\"FLAG\" = 'Y'
            AND \"dbo\".\"TRIADBE\".\"CODTYPE\" = \"dbo\".\"TLINERIADBE\".\"CODTYPE\"
            AND \"dbo\".\"TRIADBE\".\"CODOC\" = \"dbo\".\"TLINERIADBE\".\"CODOC\"
            AND \"dbo\".\"TRIADBE\".\"CODRIA\" = \"dbo\".\"TLINERIADBE\".\"CODRIA\"
            AND ((\"dbo\".\"TRIADBE\".\"CODTYPE\" in ('EXT', 'INQ', 'UTI')
            AND \"dbo\".\"TCDTFILEDBE\".\"CODSTATUS\" = 25
            AND \"dbo\".\"TRIADBE\".\"CODSTATUS\" in (1,2,3,5,6,15,16,17,18,36))
            OR (\"dbo\".\"TRIADBE\".\"CODTYPE\" = 'EXT'
            AND \"dbo\".\"TCDTFILEDBE\".\"CODSTATUS\" = 26
            AND \"dbo\".\"TRIADBE\".\"CODSTATUS\" = 19))
            AND \"dbo\".\"TSPMDBE\".\"CODSPM\" = '".$codspm."'
            AND \"dbo\".\"TRIADBE\".\"CODFILE\" = \"dbo\".\"TCDTFILEDBE\".\"CODFILE\"
            AND \"dbo\".\"TCDTFILEDBE\".\"CODLEVEL\" = 'LE'
            AND \"dbo\".\"TSPMDBE\".\"FLAG\" = 'Y'
            ORDER BY \"dbo\".\"TSPMDBE\".\"CODSPM\"";
    } else if ($codstatus == 26) {
        $query = "SELECT DISTINCT \"dbo\".\"TSPMDBE\".\"CODSPM\", \"dbo\".\"TSPMDBE\".\"NAMESPM\" 
            FROM \"dbo\".\"TSPMDBE\", \"dbo\".\"TLINERIADBE\", \"dbo\".\"TRIADBE\", \"dbo\".\"TCDTFILEDBE\"
            WHERE \"dbo\".\"TSPMDBE\".\"CODLEVEL\" = '".$codlevel."'
            AND \"dbo\".\"TSPMDBE\".\"CODSPM\" = \"dbo\".\"TLINERIADBE\".\"CODSPM\"
            AND \"dbo\".\"TSPMDBE\".\"CODLEVEL\" = \"dbo\".\"TLINERIADBE\".\"CODLEVEL\"
            AND \"dbo\".\"TLINERIADBE\".\"FLAG\" IN ('Y', 'D')
            AND \"dbo\".\"TRIADBE\".\"FLAG\" = ''
            AND \"dbo\".\"TRIADBE\".\"CODTYPE\" = \"dbo\".\"TLINERIADBE\".\"CODTYPE\"
            AND \"dbo\".\"TRIADBE\".\"CODOC\" = \"dbo\".\"TLINERIADBE\".\"CODOC\"
            AND \"dbo\".\"TRIADBE\".\"CODRIA\" = \"dbo\".\"TLINERIADBE\".\"CODRIA\"
            AND \"dbo\".\"TRIADBE\".\"CODTYPE\" = 'EXT'
            AND \"dbo\".\"TCDTFILEDBE\".\"CODSTATUS\" = 26
            AND \"dbo\".\"TRIADBE\".\"CODSTATUS\" in (15,16,17,18,19,20,22,38)
            AND \"dbo\".\"TSPMDBE\".\"CODSPM\" = '".$codspm."'
            AND \"dbo\".\"TRIADBE\".\"CODFILE\" = \"dbo\".\"TCDTFILEDBE\".\"CODFILE\"
            AND \"dbo\".\"TCDTFILEDBE\".\"CODLEVEL\" = 'LE'
            AND \"dbo\".\"TSPMDBE\".\"FLAG\" = 'Y'
            ORDER BY \"dbo\".\"TSPMDBE\".\"CODSPM\"";
    }
    
    $result = pg_query($query);
    $resultRow = pg_fetch_all($result);
    
    if ($resultRow) {
        echo json_encode($resultRow);
    } else {
        echo "[{\"id\": \"None\"}]";
    }
}
?>
