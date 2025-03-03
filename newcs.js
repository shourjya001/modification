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
                    } 
                    else if (stype == 'le') {
                        // When an LE is selected, fetch related SGR codes
                        if (searchType != 'fetchLEBasedonLE') {
                            commonsearch('fetchLEBasedonLE', resultData[0]['id'], searchParam, 'sgr', 0);
                        }
                        
                        if (document.getElementById("selectsgr_code").value != '' && 
                            document.getElementById("selectle_code").value != '') {
                            checkForCreditFiles(document.getElementById("selectsgr_code").value, 
                                              document.getElementById("selectle_code").value);
                        }
                        else if (document.getElementById("txtsgr_code").value != '') {
                            commonsearch('fetchLegalEntityBasedonID', 
                                document.getElementById("txtsgr_code").value, searchParam, 'le', 1);
                        }
                    }
                } 
                else {
                    if (check == 0) {
                        alert("No Matching Results Found...! or You are not authorized to see this SGR/LE, please contact the Banking Administrator.");
                    }
                    
                    if (stype == 'le') {
                        if (check == 1) {
                            document.getElementById("codria_span").innerHTML = '';
                            alert("No references are available for this LE.");
                        } else {
                            emptydropdown(stype);
                        }
                    } else if (stype == 'sgr') {
                        var rtype = 'le';
                        emptydropdown(stype);
                        emptydropdown(rtype);
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
