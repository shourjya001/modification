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

function fetchSGRBasedonLE() {
    $searchString = $_REQUEST['searchString'];
    if ($searchString != '') {
        // Query to find SGR codes mapped to an LE code
        $OcQuery = "SELECT t.\"CODSPM1\" as id, s.\"NAMESPM\" as name
                    FROM \"TFOLLOWDBE\" f 
                    INNER JOIN \"TSPMDBE\" t ON f.\"CODFLW\" = t.\"CODRISKDPT\"
                    INNER JOIN \"TSPMDBE\" s ON t.\"CODSPM1\" = s.\"CODSPM\"
                    WHERE t.\"CODSPM\" = '".$searchString."' AND t.\"FLAG\" = 'Y' AND t.\"CODLEVEL\" = 'LE'
                    ORDER BY t.\"CODSPM1\" ASC"; /* SCOPE IN ('BK', 'HF', 'SOV') */
        $OcResult = pg_query($OcQuery);
        $OcResultRow = pg_fetch_all($OcResult);
        echo json_encode($OcResultRow);
    }
}
?>
