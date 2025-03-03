<?php
function fetchLEBasedonSGR() {
    $searchString = $_REQUEST['searchString'];
    if ($searchString != '') {
        $OcQuery = "SELECT \"CODSPM\" as id, \"NAMESPM\" as name 
                    FROM \"TSPMDBE\" t 
                    INNER JOIN \"TFOLLOWDBE\" f ON f.\"CODFLW\" = t.\"CODRISKDPT\"
                    WHERE \"CODSPM1\" = '".$searchString."' AND t.\"FLAG\" = 'Y' AND \"CODLEVEL\" = 'LE'
                    ORDER BY \"CODSPM\" ASC"; /* SCOPE IN ('BK', 'HF', 'SOV') */
        $OcResult = pg_query($OcQuery);
        $OcResultRow = pg_fetch_all($OcResult);
        echo json_encode($OcResultRow);
    }
}

function fetchLEBasedonLE() {
    $searchString = $_REQUEST['searchString'];
    if ($searchString != '') {
        $OcQuery = "SELECT \"CODSPM1\" as id, \"NAMESPM\" as name 
                    from \"TCDTFILEDBE\" t INNER JOIN \"TSPMDBE\" t2 on t.\"CODSPM1\" = t2.\"CODSPM\"
                    WHERE t.\"CODLEVEL\" = 'LE' and t.\"FLAG\" = 'Y' AND t.\"CODSPM\" = '".$searchString."'";
        
        $OcResult = pg_query($OcQuery);
        $OcResultRow = pg_fetch_all($OcResult);
        echo json_encode($OcResultRow);
    }
}
}
?>
