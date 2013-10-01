//==========================================================
// CRM Validate User Security Roles using JavaScript/REST 
//==========================================================
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
                    var returned = window.JSON.parse(this.responseText).d;
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
                        errorText = window.JSON.parse(this.responseText).error.message.value;
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

function SetDebtorIframe() {
    var canEditDebtor = false;
    var clientId = Xrm.Page.getAttribute("accountnumber").getValue();
    var feePercentage = Xrm.Page.getAttribute("new_cancellationfeeperc").getValue();
    var userId = Xrm.Page.context.getUserId();
    var url, iframe;

    Security.UserInRole.checkUserInRole(
        ["Can Edit Debtor"],
        function () {
            console.log("valid"); // The user is in one of the specifed roles.
            canEditDebtor = true;
            url = "https://crmtitaniuminterface.hunterwarfield.com/#/" + clientId + "/?userId=" + userId + "&canEditDebtor=true&feePercentage=" + feePercentage;
            iframe = Xrm.Page.ui.controls.get("IFRAME_Debtors").setSrc(url);
        },
        function () {
            console.log("invalid"); // The user is not in one of the specifed roles.
            url = "https://crmtitaniuminterface.hunterwarfield.com/#/" + clientId + "/?userId=" + userId + "&canEditDebtor=false&feePercentage=" + feePercentage;
            iframe = Xrm.Page.ui.controls.get("IFRAME_Debtors").setSrc(url);
        }
    )
}