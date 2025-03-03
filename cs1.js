function commonsearch(searchType, searchString, searchParam, stype, check) {
    $.ajax({
        type: 'POST',
        url: "dbe_cfl_user_accessTransferSave.php",
        data: {"searchType": searchType, "searchString": searchString},
        dataType: "json",
        success: function(resultData) {
            if (resultData != false) {
                if (check == 0) populateSearchOptions(stype, resultData);
                
                if (stype == 'sgr') {
                    commonsearch('fetchLEBasedonSGR', resultData[0]['id'], searchParam, 'le', 0);
                } 
                else if (stype == 'le') {
                    // When an LE is selected, fetch the related SGR codes
                    commonsearch('fetchSGRBasedonLE', resultData[0]['id'], searchParam, 'sgr', 0);
                    
                    if ($("#selectsgr_code option:selected").val() != '' && 
                        $("#selectle_code option:selected").val() != '') {
                        checkForCreditFiles($("#selectsgr_code option:selected").val(), 
                                           $("#selectle_code option:selected").val());
                    }
                }
                
                $('#loading_wrap').fadeOut('slow');
            } 
            else {
                if (check == 0) {
                    alert("No Matching Results Found...! or You are not authorized to see this SGR/LE, please contact the Banking Administrator.");
                    $('#loading_wrap').fadeOut('slow');
                }
                
                if (stype == 'le') {
                    if (check == 1) {
                        $("#codria_span").html('');
                        alert("No references are available for this LE..!");
                    } else {
                        emptydropdown(stype);
                    }
                } else if (stype == 'sgr') {
                    var rtype = 'le';
                    emptydropdown(stype);
                    emptydropdown(rtype);
                }
            }
        }
    });
}
