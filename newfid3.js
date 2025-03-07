function fetchLegalEntityBasedonID() {
    // Get and process the search string
    $searchString = isset($_REQUEST['searchString']) ? strtoupper(trim($_REQUEST['searchString'])) : '';
    
    // Debug log
    error_log("fetchLegalEntityBasedonID called with searchString: " . $searchString);
    
    if ($searchString != '') {
        // Use the query that you confirmed works
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
        
        // Log the query for debugging
        error_log("Executing query: " . $ocQuery);
        
        // Execute query
        $ocResult = pg_query($ocQuery);
        
        if ($ocResult) {
            // Get all results
            $ocResultRow = pg_fetch_all($ocResult);
            
            // Log result count
            $resultCount = is_array($ocResultRow) ? count($ocResultRow) : 0;
            error_log("Query returned " . $resultCount . " results");
            
            // Convert to JSON
            $jsonResult = json_encode($ocResultRow ? $ocResultRow : []);
            
            // Log JSON length
            error_log("JSON result length: " . strlen($jsonResult));
            
            // Return JSON result
            echo $jsonResult;
        } else {
            // Log error
            $error = pg_last_error();
            error_log("Database query error: " . $error);
            
            // Return error
            echo json_encode(["error" => "Query failed", "message" => $error]);
        }
    } else {
        // Log empty search string
        error_log("Empty search string provided");
        
        // Return empty result
        echo json_encode([]);
    }
    
    // Log completion
    error_log("fetchLegalEntityBasedonID completed");
}
