function fetchLegalEntityBasedonID() {
    // Retrieve the search string (LE code)
    $searchString = $_REQUEST['searchString'];
    
    if ($searchString != "") {
        // First, get the SGR code associated with the LE
        $sgrCodeQry = "SELECT \"CODSPM1\" FROM \"TSPMDBE\" 
                       WHERE \"CODSPM\" = '".$searchString."' 
                       AND \"CODLEVEL\" = 'LE'";
        $sgrCodeQryRlt = pg_query($sgrCodeQry);
        $sgrCodeQryData = pg_fetch_row($sgrCodeQryRlt);
        $sgrCode = $sgrCodeQryData[0];

        // Comprehensive query to fetch mapped SGR codes and related information
        $ocQuery = "SELECT DISTINCT 
            c.\"CODSPM\" AS sgr_code,
            s.\"NAMESPM\" AS sgr_name,
            l.\"CODSPM\" AS le_code,
            sl.\"NAMESPM\" AS le_name,
            c.\"CODFILE\" AS file_code,
            CASE 
                WHEN CDT.\"CODSTATUS\" = 24 AND RIA.\"CODSTATUS\" <> 22 THEN 'Y'
                ELSE 'N'
            END AS status_24,
            CASE 
                WHEN RIA.\"CODSTATUS\" = 22 THEN 'Y'
                ELSE 'N'
            END AS status_22
        FROM 
            \"TRIADBE\" t
        INNER JOIN 
            \"TCDTFILEDBE\" c ON t.\"CODFILE\" = c.\"CODFILE\"
        INNER JOIN 
            \"TLINERIADBE\" l ON l.\"CODRIA\" = t.\"CODRIA\"
        INNER JOIN 
            \"TSPMDBE\" s ON s.\"CODSPM\" = c.\"CODSPM\" AND s.\"CODLEVEL\" = 'SGR'
        INNER JOIN 
            \"TSPMDBE\" sl ON sl.\"CODSPM\" = l.\"CODSPM\" AND sl.\"CODLEVEL\" = 'LE'
        LEFT JOIN 
            \"TCDTFILEDBE\" CDT ON CDT.\"CODFILE\" = t.\"CODFILE\"
        LEFT JOIN 
            \"".ARCH_TRIADBE."\" RIA ON RIA.\"CODFILE\" = t.\"CODFILE\"
        WHERE 
            l.\"CODSPM\" = '".$searchString."'
            AND sl.\"FLAG\" = 'Y'
            AND s.\"FLAG\" = 'Y'
            AND t.\"FLAG\" = 'Y'
            AND c.\"FLAG\" = 'Y'
            AND l.\"FLAG\" = 'Y'
            AND RIA.\"CODTYPE\" = 'EXT'";

        $ocResult = pg_query($ocQuery);
        $ocResultRow = pg_fetch_all($ocResult);
        
        echo json_encode($ocResultRow);
    } else {
        echo json_encode([]);
    }
}
