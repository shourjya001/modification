function fetchLegalEntityBasedonID() {
    $searchString = strtoupper($_REQUEST['searchString']);
    if ($searchString != '') {
        $ocQuery = "SELECT DISTINCT 
            s.\"CODSPM\" AS sgr_code,
            s.\"NAMESPM\" AS sgr_name,
            l.\"CODSPM\" AS le_code,
            c.\"CODFILE\" AS file_code
        FROM 
            \"TRIADBE\" t
        INNER JOIN 
            \"TCDTFILEDBE\" c ON t.\"CODFILE\" = c.\"CODFILE\"
        INNER JOIN 
            \"TLINERIADBE\" l ON l.\"CODRIA\" = t.\"CODRIA\"
        INNER JOIN 
            \"TSPMDBE\" s ON s.\"CODSPM\" = c.\"CODSPM\" AND s.\"CODLEVEL\" = 'SGR'
        WHERE 
            l.\"CODSPM\" = '".$searchString."'
            AND s.\"FLAG\" = 'Y' 
            AND t.\"FLAG\" = 'Y' 
            AND c.\"FLAG\" = 'Y' 
            AND l.\"FLAG\" = 'Y'
        ORDER BY
            s.\"CODSPM\"";
        
        $ocResult = pg_query($ocQuery);
        if ($ocResult) {
            $ocResultRow = pg_fetch_all($ocResult);
            echo json_encode($ocResultRow ? $ocResultRow : []);
        } else {
            // Log the error
            $error = pg_last_error();
            error_log("Query failed: " . $error);
            echo json_encode([]);
        }
    } else {
        echo json_encode([]);
    }
}
