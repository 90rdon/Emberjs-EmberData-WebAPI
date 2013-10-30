Security = {};
Security.UserInRole = {
    isInRole: null,
    roleIdValues: [],
    validFunction: null,
    invalidFunction: null,
    checkRoles: [],
    checkUserInRole: function (roles, validFunc, invalidFunc) {
        validFunction = validFunc;
        invalidFunction = invalidFunc;
        checkRoles = roles;
        Security.UserInRole.getAllowedSecurityRoleIds();
    },
    getAllowedSecurityRoleIds: function () {
        var filter = "";
        for (var i = 0; i < checkRoles.length; i++) {
            if (filter == "") {
                filter = "Name eq '" + checkRoles[i] + "'";
            } else {
                filter += " or Name eq '" + checkRoles[i] + "'";
            }
        }
        Security.UserInRole.querySecurityRoles("?$select=RoleId,Name&$filter=" + filter);
    },
    validateSecurityRoles: function () {
        switch (Security.UserInRole.isInRole) {
            //If the user has already been discovered in role then call validFunc
        case true:
            validFunction.apply(this, []);
            break;
        default:
            var userRoles = Xrm.Page.context.getUserRoles();
            for (var i = 0; i < userRoles.length; i++) {
                var userRole = userRoles[i];
                for (var n = 0; n < Security.UserInRole.roleIdValues.length; n++) {
                    var role = Security.UserInRole.roleIdValues[n];
                    if (userRole.toLowerCase() == role.toLowerCase()) {
                        Security.UserInRole.isInRole = true;
                        // Call function when role match found
                        validFunction.apply(this, []);
                        return true;
                    }
                }
            }
            // Call function when no match found
            invalidFunction.apply(this, []);
            break;
        }
    },
    querySecurityRoles: function (queryString) {
        var req = new XMLHttpRequest();
        var url = "";
        // Try getClientUrl first (available post Rollup 12)
        if (Xrm.Page.context.getClientUrl) {
            url = Xrm.Page.context.getClientUrl();
        } else {
            url = Xrm.Page.context.getServerUrl();
        }
        req.open("GET", url + "/XRMServices/2011/OrganizationData.svc/RoleSet" + queryString, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */ ) {
                req.onreadystatechange = null; //Addresses memory leak issue with IE.
                if (this.status == 200) {
                    var returned = JSON.parse(this.responseText).d;
                    for (var i = 0; i < returned.results.length; i++) {
                        Security.UserInRole.roleIdValues.push(returned.results[i].RoleId);
                    }
                    if (returned.__next != null) {
                        //In case more than 50 results are returned.
                        // This will occur if an organization has more than 16 business units
                        var queryOptions = returned.__next.substring((url + "/XRMServices/2011/OrganizationData.svc/RoleSet").length);
                        Security.UserInRole.querySecurityRoles(queryOptions);
                    } else {
                        //Now that the roles have been retrieved, try again.
                        Security.UserInRole.validateSecurityRoles();
                    }
                } else {
                    var errorText;
                    if (this.status == 12029) {
                        errorText = "The attempt to connect to the server failed.";
                    }
                    if (this.status == 12007) {
                        errorText = "The server name could not be resolved.";
                    }
                    try {
                        errorText = JSON.parse(this.responseText).error.message.value;
                    } catch (e) {
                        errorText = this.responseText
                    }
                }
            }
        };
        req.send();
    },
    __namespace: true
};

function LaunchDebtorAccount() {
    var url;
    var o_cnsmr_accnt_id = Xrm.Page.getAttribute("new_titaniumcnsmr_accnt_id").getValue();
    var o_crdtr_id = Xrm.Page.getAttribute("new_titaniumcrdtr_id").getValue();
    var o_cnsmr_id = Xrm.Page.getAttribute("new_titanium_cnsmr_id").getValue();
    var oFeePerc = RetrieveValueFromDatabase("account", Xrm.Page.getAttribute("customerid").getValue()[0].id, "new_cancellationfeeperc", true);
    var oParsedFeePerc = isNaN(parseFloat(oFeePerc)) ? 0 : parseFloat(oFeePerc);
    var oUserId = Xrm.Page.context.getUserId();


    if (o_cnsmr_accnt_id == null || o_crdtr_id == null || o_cnsmr_id == null) {
        alert("Some fields required for this application were not found in the database.  Please go to the client record to see the information about this debtor account.");
        return; 
    }
    else {
        Security.UserInRole.checkUserInRole(
            ["Can Edit Debtor"],
            function () {
                url = "https://crmtitaniuminterface.hunterwarfield.com/#/account/";
                url = url + o_cnsmr_accnt_id + "/debtor/";
                url = url + o_cnsmr_id + "?clientId=";
                url = url + o_crdtr_id + "&userId=";
                url = url + oUserId + "&canEditDebtor=true";
                url = url + "&feePercentage=" + oParsedFeePerc;

                window.open(url, "", "status=no,scrollbars=yes,toolbars=no,menubar=no,location=no,width=1200,height=1000");
            },
            function () {
                url = "https://crmtitaniuminterface.hunterwarfield.com/#/account/";
                url = url + o_cnsmr_accnt_id + "/debtor/";
                url = url + o_cnsmr_id + "?clientId=";
                url = url + o_crdtr_id + "&userId=";
                url = url + oUserId + "&canEditDebtor=false";
                url = url + "&feePercentage=" + oParsedFeePerc;

                window.open(url, "", "status=no,scrollbars=yes,toolbars=no,menubar=no,location=no,width=1200,height=1000");
            }
        )
    }
}