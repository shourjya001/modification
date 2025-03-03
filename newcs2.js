<?php

function fetchLEBasedonLE() {
    $searchString = $_REQUEST['searchString'];
    if ($searchString != '') {
        // This query needs to be fixed to properly find SGR codes mapped to an LE code
        $OcQuery = "SELECT t2.\"CODSPM1\" as id, t2.\"NAMESPM\" as name
                   FROM \"TCDTFILEDBE\" t 
                   INNER JOIN \"TSPMDBE\" t2 ON t.\"CODSPM1\" = t2.\"CODSPM\"
                   WHERE t.\"CODLEVEL\" = 'LE' 
                   AND t.\"CODSPM\" = '".$searchString."'
                   AND t.\"FLAG\" = 'Y'
                   AND t2.\"CODLEVEL\" = 'SGR'"; /* \"SCOPE\" IN ('BK', 'HF', 'SOV') */
        
        $OcResult = pg_query($OcQuery);
        $OcResultRow = pg_fetch_all($OcResult);
        echo json_encode($OcResultRow);
    }
}
?>

<script>
function commonsearch(searchType, searchString, searchParam, stype, check) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "dbe_cfl_user_accessTransfersave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var resultData = JSON.parse(xhr.responseText);
                if (resultData && resultData.length > 0) {
                    if (check == 0) populateSearchOptions(stype, resultData);
                    
                    if (stype == 'sgr') {
                        commonsearch('fetchLEBasedonSGR', resultData[0]['id'], searchParam, 'le', 0);
                    } else if (stype == 'le') {
                        if (document.getElementById("selectsgr_code").value != '' 
                         && document.getElementById("selectle_code").value != '') {
                            checkForCreditFiles(document.getElementById("selectsgr_code").value, 
                                              document.getElementById("selectle_code").value);
                        } else if (document.getElementById("txtsgr_code").value != '') {
                            commonsearch('fetchLegalEntityBasedonID', 
                                         document.getElementById("txtsgr_code").value, searchParam, 'le', 1);
                        }
                    } else if (searchType == 'fetchLEBasedonLE') {
                        // Handle the SGR codes returned from LE search
                        populateSearchOptions('sgr', resultData);
                    }
                } else {
                    if (check == 0) {
                        // No results found
                        if (stype == 'sgr') {
                            populateSearchOptions('sgr', []);
                            emptydropdown('le');
                        } else if (stype == 'le') {
                            if (check == 1) {
                                document.getElementById("codria_span").innerHTML = '';
                                alert("No references are available for this LE.");
                            } else {
                                emptydropdown(stype);
                            }
                        }
                    }
                }
            } else {
                alert("AJAX request failed with status: " + xhr.status);
            }
            document.getElementById("loading_wrap").style.display = 'none';
        }
    };
    xhr.send("searchType=" + encodeURIComponent(searchType) + "&searchString=" + encodeURIComponent(searchString));
}
</script>
