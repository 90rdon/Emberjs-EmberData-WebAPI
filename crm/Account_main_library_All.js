// This script creates a function called RetrieveValueFromDatabase used to extract values from a linked entity
//Generic data layer that accesses a CRM web service

RetrieveValueFromDatabase = function (entityName, entityId, fieldNameToReturn, IsNameNotValueReturn) {
    // clean up the id
    //var entityId = entityId.replace("}", "").replace("{", "");
    
    // Define URL to CRM API service
    var serverUrl = "/mscrmservices/2007/crmservice.asmx";
    
    // Set up XMLHTTP request
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    
    xmlhttp.open("POST", serverUrl, false);
    
    // Define the retrieve message
    // Change organization_name in the <OrganizationName> node to a valid value from your system
    // Change the value of the <id> node to a valid contact id from your system
    // NOTE: Using the Xrm.Page.context.getAuthenticationHeader() function provided by Microsoft Dynamics CRM will properly configure the <CrmAuthenticationToken> for you, including
    //  automatically providing the organization name.We show the full <CrmAuthenticationToken> nodes here so you can see what it looks like.

    var message = "<?xml version='1.0' encoding='utf-8'?>"+
          "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>"+
          Xrm.Page.context.getAuthenticationHeader() +
          "<soap:Body>"+
          "<Retrieve xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>"+
          "<entityName>" + entityName + "</entityName>"+
          "<id>" + entityId + "</id>"+
          "<columnSet xmlns:q1='http://schemas.microsoft.com/crm/2006/Query' xsi:type='q1:ColumnSet'>"+
          "<q1:Attributes>"+
          "<q1:Attribute>" + fieldNameToReturn + "</q1:Attribute>"+
          "</q1:Attributes>"+
          "</columnSet>"+
          "</Retrieve>"+
          "</soap:Body>"+
          "</soap:Envelope>";

    // Specify correct SOAP action in the header
    xmlhttp.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/Retrieve");
    xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlhttp.setRequestHeader("Content-Length", message.length);
    
    // Submit to the CRM API web service and receive a response
    xmlhttp.send(message);
    
    // Get the response returned from the request.
    var doc = xmlhttp.responseXML;

    // Return the fullname node
    var returnNode = doc.selectSingleNode("//q1:" + fieldNameToReturn);
    if (returnNode != null) {
        if (IsNameNotValueReturn) {
            if (returnNode.attributes.getNamedItem("name") != null) {
                return returnNode.attributes.getNamedItem("name").text
            } else {
                return returnNode.text;
            }
        } else {
            return returnNode.text;
        }
    } else {
        return '';
    }
}

// ==================================================

function toggleSectionDisplayState(sectionName, sectionIsVisible) {
    //Hide or Show Sections 
    var tabs = Xrm.Page.ui.tabs.get();
    for (var i in tabs) {
        var tab = tabs[i];
        tab.sections.forEach(function (section, index) {
            if (section.getName() == sectionName) {
                section.setVisible(sectionIsVisible);
            }
        });
    }
}

// ==================================================

function Form_onload()
{
//GLOBAL FUNCTION: Format US Phone Number
FormatUSPhone = function(phoneField) {
    /*  Description: This method will auto-format basic 7 and 10 digit US phone numbers, 
    while leaving any extensions. It will also translate any letters in the input to its 
    equivalent phone digit. Example: (773) 555-1212  */

    var oField = document.getElementById(phoneField);

    // Verify that the field provided is valid
    if (typeof (oField) != "undefined" && oField != null) {
        if (oField.DataValue != null) {
            // Remove any special characters
            var sTmp = oField.DataValue.replace(/[^0-9,A-Z,a-z]/g, "");

            // Translate any letters to the equivilant phone number, if method is included
            try {
                if (sTmp.length <= 10) {
                    sTmp = TranslateMask(sTmp);
                }
                else {
                    sTmp = TranslateMask(sTmp.substr(0, 10)) + sTmp.substr(10, sTmp.length);
                }
            }
            catch (e) {
            }

            // If the number is a length we expect and support, format the translated number
            switch (sTmp.length) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 8:
                case 9:
                    break;
                case 7:
                    oField.DataValue = sTmp.substr(0, 3) + "-" + sTmp.substr(3, 4);
                    break;
                case 10:
                    oField.DataValue = "(" + sTmp.substr(0, 3) + ") " + sTmp.substr(3, 3) + "-" + sTmp.substr(6, 4);
                    break;
                default:
                    oField.DataValue = "(" + sTmp.substr(0, 3) + ") " + sTmp.substr(3, 3) + "-" + sTmp.substr(6, 4) + " " + sTmp.substr(10, sTmp.length);
                    break;
            }
        }
    }

    /// <summary>
    /// TranslateMask() will step through each character of an 
    /// input string and pass that character to the 
    /// TranslatePhoneLetter() helper method
    /// </summary>
    /// <param name="s">Input string to translate</param>
    function TranslateMask(s) {
        var ret = "";

        //loop through each char, and pass it to the translation method
        for (var i = 0; i < s.length; i++) {
            ret += TranslatePhoneLetter(s.charAt(i))
        }

        return ret;
    }

    /// <summary>
    /// TranslatePhoneLetter() takes a character and returns the 
    /// equivalent phone number digit if it is alphanumeric
    /// </summary>
    /// <param name="s">Character to translate</param>
    function TranslatePhoneLetter(s) {
        var sTmp = s.toUpperCase();
        var ret = s;

        switch (sTmp) {
            case "A":
            case "B":
            case "C":
                ret = 2;
                break;
            case "D":
            case "E":
            case "F":
                ret = 3;
                break;
            case "G":
            case "H":
            case "I":
                ret = 4;
                break;
            case "J":
            case "K":
            case "L":
                ret = 5;
                break;
            case "M":
            case "N":
            case "O":
                ret = 6;
                break;
            case "P":
            case "Q":
            case "R":
            case "S":
                ret = 7;
                break;
            case "T":
            case "U":
            case "V":
                ret = 8;
                break;
            case "W":
            case "X":
            case "Y":
            case "Z":
                ret = 9;
                break;
            default:
                ret = s;
                break;
        }

        return ret;
    }
}

//MailTo Link for emailaddress1 based on double-click
var emailAddress1 = crmForm.all.emailaddress1;
if (emailAddress1 != null) {
    emailAddress1.ondblclick = function() {
        var email = emailAddress1.DataValue;

        if ((email != null) && (email.length > 0)) {
            window.navigate("mailto:" + email);
        }
    }
    emailAddress1.FireOnChange();
}
}

// ========================================================

function telephone1_onchange()
{
FormatUSPhone("telephone1");
}

// ========================================================

function telephone2_onchange()
{
FormatUSPhone("telephone2");
}

// ========================================================

function fax_onchange()
{
FormatUSPhone("fax");
}

// ========================================================

function emailaddress1_onchange()
{
// Set style of cursor and text based containing data or null
var emailAddress1 = event.srcElement;

if (emailAddress1.DataValue != null) {
    emailAddress1.style.cursor = "hand"
    emailAddress1.style.color = "#0000FF";
    emailAddress1.style.textDecoration = "underline";
}
else {
    emailAddress1.style.cursor = "text";
    emailAddress1.style.color = "#000000";
    emailAddress1.style.textDecoration = "none";
}
}

// ========================================================

function new_commercialaverageclaimsperyear_onchange()
{
// It is assumed this function is no longer required or being used
/*
var claim = crmForm.all.new_commercialaverageclaimsperyear;
var bal = crmForm.all.new_commercialaveragebalance;
var rate = crmForm.all.new_ratingcode;

if (claim.DataValue !=null)
{
if (bal.DataValue != null)
{
var rev = claim.DataValue * bal.DataValue /12 ;
if (rev >= 50000)
{ rate.DataValue = 1; }
else if (rev < 50000 && rev >= 10000)
{ rate.DataValue = 2; }
else if (rev < 10000 && rev >= 2500)
{ rate.DataValue = 3; }
else if (rev < 2500)
{ rate.DataValue = 4; }
crmForm.all.new_commercialannualrevenue.DataValue = rev;
rate.ForceSubmit = true;
}
}
*/
}

// ========================================================

function new_commercialaveragebalance_onchange()
{
// It is assumed this function is no longer required or being used
//crmForm.all.new_commercialaverageclaimsperyear.FireOnChange();
}

// ========================================================

function new_consumernumberofunits_onchange()
{
// It is assumed this function is no longer required or being used
}

// ========================================================

function new_consumerqualitynumberofunits_onchange()
{
// It is assumed this function is no longer required or being used
/*
var annacct = crmForm.all.new_consumerannualofaccounts;
var mon = crmForm.all.new_consumermonthlyofaccounts;
var numofunit = crmForm.all.new_consumerqualitynumberofunits;
var rating = crmForm.all.new_ratingcode;

if (numofunit.DataValue != null)
{
annacct.DataValue =numofunit.DataValue * 0.08;
mon.DataValue = numofunit.DataValue * 0.08/12;

if (numofunit.DataValue > 20000) 
{  rating.DataValue = 1; }
else if (numofunit.DataValue <= 20000 && numofunit.DataValue > 5000)
{ rating.DataValue = 2; }
else if (numofunit.DataValue <= 5000 && numofunit.DataValue > 1500)
{ rating.DataValue = 3; }
else if (numofunit.DataValue <= 1500)
{ rating.DataValue = 4; }
else { rating.DataValue = 5;}

rating.ForceSubmit = true;
mon.ForceSubmit = true;
annacct.ForceSubmit=true;
}
*/
}
  
// ========================================================

function Client_onchange()
{
//This script makes makes some fields required if the Company Type = Client
//It also hides the client number field if not a client record
if (Xrm.Page.getAttribute("customertypecode").getValue() == 3) // This value is for Client
{
Xrm.Page.getAttribute('new_clientlevel').setRequiredLevel('required');
Xrm.Page.getAttribute('new_salesuser').setRequiredLevel('required');
Xrm.Page.getAttribute('new_serviceuser').setRequiredLevel('required');
Xrm.Page.getAttribute('new_developmentuser').setRequiredLevel('required');
Xrm.Page.getAttribute('primarycontactid').setRequiredLevel('required');
Xrm.Page.getAttribute('new_businessunit').setRequiredLevel('required');
Xrm.Page.getAttribute('new_clientid').setRequiredLevel('required');  // Commission Rate Code
Xrm.Page.getAttribute('address1_line1').setRequiredLevel('required'); // Invoice Address
Xrm.Page.getAttribute('address1_city').setRequiredLevel('required'); // Invoice Address
Xrm.Page.getAttribute('address1_stateorprovince').setRequiredLevel('required'); // Invoice Address
Xrm.Page.getAttribute('address1_postalcode').setRequiredLevel('required'); // Invoice Address
Xrm.Page.getAttribute('address2_stateorprovince').setRequiredLevel('required'); // Statement Address
//Xrm.Page.getAttribute('new_interestactive').setRequiredLevel('required');
//Xrm.Page.getAttribute('new_creditreporting').setRequiredLevel('required'); // Enable this soon
//Xrm.Page.getAttribute('new_elimfee').setRequiredLevel('required');
Xrm.Page.getAttribute('new_desk').setRequiredLevel('required');
Xrm.Page.getAttribute('new_remittancecode').setRequiredLevel('required');
Xrm.Page.getAttribute('new_setupdate').setRequiredLevel('required');
Xrm.Page.getAttribute('new_cubscompanybusinessclass').setRequiredLevel('required');

Xrm.Page.ui.controls.get("accountnumber").setVisible(true); // Show the Client Number
toggleSectionDisplayState("userrole_section", true);  // Show the User Roles
toggleSectionDisplayState("contactrole_section", true); // Show the Contact Roles
}

else
{
Xrm.Page.getAttribute('new_clientlevel').setRequiredLevel('none');
Xrm.Page.getAttribute('new_salesuser').setRequiredLevel('none');
Xrm.Page.getAttribute('new_serviceuser').setRequiredLevel('none');
Xrm.Page.getAttribute('new_developmentuser').setRequiredLevel('none');
Xrm.Page.getAttribute('primarycontactid').setRequiredLevel('none');
Xrm.Page.getAttribute('new_businessunit').setRequiredLevel('none');
Xrm.Page.getAttribute('new_clientid').setRequiredLevel('none');  // Commission Rate Code
Xrm.Page.getAttribute('address1_line1').setRequiredLevel('none'); // Invoice Address
Xrm.Page.getAttribute('address1_city').setRequiredLevel('none'); // Invoice Address
Xrm.Page.getAttribute('address1_stateorprovince').setRequiredLevel('none'); // Invoice Address
Xrm.Page.getAttribute('address1_postalcode').setRequiredLevel('none'); // Invoice Address
Xrm.Page.getAttribute('address2_stateorprovince').setRequiredLevel('none'); // Statement Address
//Xrm.Page.getAttribute('new_interestactive').setRequiredLevel('none');
// Xrm.Page.getAttribute('new_creditreporting').setRequiredLevel('none'); // Enable this soon
//Xrm.Page.getAttribute('new_elimfee').setRequiredLevel('none');
Xrm.Page.getAttribute('new_desk').setRequiredLevel('none');
Xrm.Page.getAttribute('new_remittancecode').setRequiredLevel('none');
Xrm.Page.getAttribute('new_setupdate').setRequiredLevel('none');
Xrm.Page.getAttribute('new_cubscompanybusinessclass').setRequiredLevel('none');

Xrm.Page.ui.controls.get("accountnumber").setVisible(false); // Hide the Client Number
toggleSectionDisplayState("userrole_section", false );  // Hide the User Roles
toggleSectionDisplayState("contactrole_section", false);  // Hide the Contact Roles
}
}

// ==================================================

function GetPrimaryContactFields()
//Get multiple fields from the associated Contact form
{
if (Xrm.Page.getAttribute("primarycontactid").getValue() != null)
{
var lookupvalue = Xrm.Page.getAttribute("primarycontactid").getValue()[0].id;
//alert(lookupvalue);

var extract = RetrieveValueFromDatabase("contact", lookupvalue, "emailaddress1", true);
Xrm.Page.getAttribute("new_primarycontactemail").setValue(extract);
Xrm.Page.getAttribute("new_primarycontactemail").setSubmitMode("always");  //Force Submit since read-only field

//This alert does not work and needs to account for fax as alternative
//if (extract == null && Xrm.Page.getAttribute("customertypecode").getValue() == 3) // This value is for Client
//{
//alert('The email address is missing for this Primary Contact!');
//}

var extract2= RetrieveValueFromDatabase("contact", lookupvalue, "telephone1", true);
Xrm.Page.getAttribute("new_primarycontactphone").setValue(extract2);
Xrm.Page.getAttribute("new_primarycontactphone").setSubmitMode("always");  //Force Submit since read-only field

var extract3= RetrieveValueFromDatabase("contact", lookupvalue, "fax", true);
Xrm.Page.getAttribute("new_primarycontactfax").setValue(extract3);
Xrm.Page.getAttribute("new_primarycontactfax").setSubmitMode("always");  //Force Submit since read-only field
}
}

// ===================================================
// Activity Summary Code, done by Guillermo Cardona

function IFrameLoad_Activity_Summary() {

    var AccountId = Xrm.Page.data.entity.getId();
    var IFrame = Xrm.Page.getControl('IFRAME_ActivitySummary');
    var serverUrl = Xrm.Page.context.getServerUrl();
    var reportUrl = serverUrl + "/crmreports/viewer/viewer.aspx?action=filter&helpID=Activity%20Summary%20-%20Account.rdl&id=%7bC7E83CC7-873D-E211-8647-00155D05393D%7d";

    SetReportUrl(reportUrl, "IFRAME_ActivitySummary", AccountId);

}

function SetReportUrl(reportUrl, iFrame, AccountId) {

    if (AccountId == null) {
        Xrm.Page.getControl(iFrame).setVisible(false);
    }
    else {
        Xrm.Page.getControl(iFrame).setVisible(true);
        Xrm.Page.getControl(iFrame).setSrc(reportUrl + "&p:AccountId=" + AccountId);
    }

}

// ===================================================
// This script controls the Follow Up Date field based on the Follow Up Active y/n field

function SetFollowUpDateActive()
{
if (Xrm.Page.getAttribute("new_followupactive").getValue() == 0) // 0 = No
{
Xrm.Page.getAttribute('new_followupdate').setValue(null);
Xrm.Page.getControl('new_followupdate').setDisabled(true);
Xrm.Page.getAttribute('new_followupdate').setRequiredLevel('none');
Xrm.Page.getAttribute('new_followupdate').setSubmitMode("always"); 
}
if (Xrm.Page.getAttribute("new_followupactive").getValue() == 1) // 1 = Yes
{
Xrm.Page.getAttribute('new_followupdate').setRequiredLevel('required');
Xrm.Page.getControl('new_followupdate').setDisabled(false);
}
}


//=====================================================
// This combinations of functions find whether a user has a role assigned to them or
// not, and if they do, they get a return true.  Used to lock down client level and client
// type fields.

function SendRequest(_Filter) {
    //configure end point
    var _ResultSet = null;
    var _EndPoint = Xrm.Page.context.getServerUrl() + "/xrmservices/2011/organizationdata.svc";
    var _XMLHttpRequest = new XMLHttpRequest();
    _XMLHttpRequest.open("GET", _EndPoint + "/" + _Filter, false);
    _XMLHttpRequest.setRequestHeader("Accept", "application/json");
    _XMLHttpRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    var _Result = _XMLHttpRequest.send();
    if (_XMLHttpRequest.readyState == 4 && _XMLHttpRequest.status == 200) {
        _ResultSet = this.parent.JSON.parse(_XMLHttpRequest.responseText).d;
    }
    return _ResultSet;
}

///This function is to check user Role
function IsCurrentUserHaveRole(Role) {
    var _Role, _RoldID, _CurrentUserRoles, _CurrentUserRole;
    var _Filter = "RoleSet?$top=1&$filter=Name eq '" + Role + "'";
    var _ResultSet = SendRequest(_Filter);
    if (_ResultSet != null && _ResultSet.results.length == 1) {
        _Role = _ResultSet.results[0];
        _RoleID = _Role.RoleId;
        _CurrentUserRoles = Xrm.Page.context.getUserRoles();
        for (var i = 0; i < _CurrentUserRoles.length; i++) {
            _CurrentUserRole = _CurrentUserRoles[i];
            if (_CurrentUserRole == _RoleID) {

                return true;
            }
        }
    }

    return false;
}

function IsValidUser() {
debugger    
if (IsCurrentUserHaveRole("HW Client Admin")) {
        return true;
        
    }

    else {
        return false;
    }
}

//========================================================
// This script disables the client level and the client type fields once the client type = "Client"
// for those users that do not have the "HW Client Admin" role

function DisableClientFields()  {
     if (Xrm.Page.getAttribute("customertypecode").getValue() == 3) {
                Xrm.Page.ui.controls.get("customertypecode").setDisabled(IsValidUser);
                Xrm.Page.ui.controls.get("new_clientlevel").setDisabled(IsValidUser);
     }
}

//==========================================================
// This script disables the settlement percentage fields based on the Settlement Type field
// values.

function SettlementType_OnChange() {
     if (Xrm.Page.getAttribute("new_settlementtype").getValue() == 100000000) {
          
          //Enable approval perc fields and set as required
          Xrm.Page.ui.controls.get("new_settlementwoapprovalperc").setDisabled(false);
          Xrm.Page.ui.controls.get("new_settlementwithapprovalperc").setDisabled(false);
          
          Xrm.Page.getAttribute("new_settlementwoapprovalperc").setRequiredLevel('required');
          Xrm.Page.getAttribute("new_settlementwithapprovalperc").setRequiredLevel('required');
     }
     else {
          //Disable the approval perc fields and set required to none.
          Xrm.Page.ui.controls.get("new_settlementwoapprovalperc").setDisabled(true);
          Xrm.Page.ui.controls.get("new_settlementwithapprovalperc").setDisabled(true);
          
          Xrm.Page.getAttribute("new_settlementwoapprovalperc").setRequiredLevel('none');
          Xrm.Page.getAttribute("new_settlementwithapprovalperc").setRequiredLevel('none');
     }

}

//============================================================
// This script disables or enables and makes required the max number of payment amount field
// based on the max number of payments option set

function MaxNumPayments_OnChange() {
    if(Xrm.Page.getAttribute("new_maxnumberofpayments").getValue() == 100000000) {
        //Disable the Limit field and set required to none
        Xrm.Page.getAttribute("new_maxnumberofpaymentslimitamount").setValue(null);
        Xrm.Page.ui.controls.get("new_maxnumberofpaymentslimitamount").setDisabled(true);
        Xrm.Page.getAttribute("new_maxnumberofpaymentslimitamount").setRequiredLevel('none');
    }
    else {
        Xrm.Page.ui.controls.get("new_maxnumberofpaymentslimitamount").setDisabled(false);
        Xrm.Page.getAttribute("new_maxnumberofpaymentslimitamount").setRequiredLevel('required');
    }
}

//=============================================================
// This script disables or enables and makes required the max payment length limit days field 
// based on the max payment length option set.

function MaxPaymentLength_OnChange() {
    if(Xrm.Page.getAttribute("new_maxpaymentlength").getValue() == 100000000) {
        //Disable the limit to days field and set required to none
        Xrm.Page.getAttribute("new_maxpaymentlengthlimitdays").setValue(null);
        Xrm.Page.ui.controls.get("new_maxpaymentlengthlimitdays").setDisabled(true);
        Xrm.Page.getAttribute("new_maxpaymentlengthlimitdays").setRequiredLevel('none');
    }
    else {
        Xrm.Page.ui.controls.get("new_maxpaymentlengthlimitdays").setDisabled(false);
        Xrm.Page.getAttribute("new_maxpaymentlengthlimitdays").setRequiredLevel('required');
    }
}

//=============================================================
// This script disables or enables and makes required the 
// settlement start date default ahead days field based on the 
// settlement start date option set.

function SettlementStartDate_OnChange() {
    if (Xrm.Page.getAttribute("new_settlementstartdateoption").getValue() == 100000000) {
        //Disable the Settlement Start Date Ahead Days field and set required to none
        Xrm.Page.getAttribute("new_settlementstartdatedefaultaheaddays").setValue(null);
        Xrm.Page.ui.controls.get("new_settlementstartdatedefaultaheaddays").setDisabled(true);
        Xrm.Page.getAttribute("new_settlementstartdatedefaultaheaddays").setRequiredLevel('none');
    }
    else {
        Xrm.Page.ui.controls.get("new_settlementstartdatedefaultaheaddays").setDisabled(false);
        Xrm.Page.getAttribute("new_settlementstartdatedefaultaheaddays").setRequiredLevel('required');
    }
}

//==========================================================
//This is used by the View Client images button on the ribbon - GC

function LaunchClientImage() {
          var imageurl = "http://hwiimages.hunterwarfield.com/default.aspx?client=" + Xrm.Page.getAttribute("accountnumber").getValue();
          window.open(imageurl, "", "status=no,scrollbars=no,toolbars=no,menubar=no,location=no,width=1000,height=800");
}

//===========================================================
//This function calculates the Existing Annual Fee Potential = existing share of wallet X annual fee potential

function CalcFeePotential() {
    var oShare = Xrm.Page.getAttribute("new_existingshareofwallet").getValue();
    var oAnnualFee = Xrm.Page.getAttribute("new_annualfeepotential").getValue();

    if (oShare == null) { 
        oShare = 0;
    }

    if (oAnnualFee == null) {
        oAnnualFee = 0;
    }

    var oExistingFee = oShare * oAnnualFee/100;

    Xrm.Page.getAttribute("new_existingannualfeepotential").setValue(oExistingFee);
}


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
    var feePercentage = isNaN(parseFloat(Xrm.Page.getAttribute("new_cancellationfeeperc").getValue())) ? 0 : parseFloat(Xrm.Page.getAttribute("new_cancellationfeeperc").getValue());
    var userId = Xrm.Page.context.getUserId();
    var url, iframe;

    Security.UserInRole.checkUserInRole(
        ["Can Edit Debtor"],
        function () {
            canEditDebtor = true;
            url = "https://crmtitaniuminterface.hunterwarfield.com/#/" + clientId + "/?userId=" + userId + "&canEditDebtor=true&feePercentage=" + feePercentage;
            //iframe = Xrm.Page.ui.controls.get("IFRAME_Debtors").setSrc(url);
            Xrm.Page.getControl("IFRAME_Debtors").setSrc(url);
        },
        function () {
            url = "https://crmtitaniuminterface.hunterwarfield.com/#/" + clientId + "/?userId=" + userId + "&canEditDebtor=false&feePercentage=" + feePercentage;
            //iframe = Xrm.Page.ui.controls.get("IFRAME_Debtors").setSrc(url);
            Xrm.Page.getControl("IFRAME_Debtors").setSrc(url);
        }
    )
}


//===========================================================
//This function sets the default values for the Titanium fields

function SetDefaultValues(field, value) {

    var field;
    var value;
    
    switch (field)
    { 
        case "new_trustaccountid":
            var oTrust = Xrm.Page.getAttribute("new_trustaccountid").getValue();
            if (oTrust == null) {
                var TrustValue = new Array();
                TrustValue[0] = new Object();

                TrustValue[0].id = "{79E1FA31-2410-E311-8721-0050568B1DC5}";
                TrustValue[0].typename = "new_trustaccount";
                TrustValue[0].name = "GenTrust";

                Xrm.Page.getAttribute("new_trustaccountid").setValue(TrustValue);
            }
            break;
        case "new_invoicecyclecodeid":
            var oCycle = Xrm.Page.getAttribute("new_invoicecyclecodeid").getValue();
            if (oCycle == null) {
                var CycleValue = new Array();
                CycleValue[0] = new Object();

                CycleValue[0].id = "{DA8EAC93-19FB-E211-A60B-0050568B1DC5}";
                CycleValue[0].typename = "new_invoicecyclecode";
                CycleValue[0].name = "Monthly  statement cycle";

                Xrm.Page.getAttribute("new_invoicecyclecodeid").setValue(CycleValue);
            }
            break;
        case "new_invoicestyleid":
            var oStyle = Xrm.Page.getAttribute("new_invoicestyleid").getValue();
            if (oStyle == null) {
                var StyleValue = new Array();
                StyleValue[0] = new Object();

                StyleValue[0].id = "{406FAEB3-2FEB-E211-A60B-0050568B1DC5}"
                StyleValue[0].typename = "new_invoicestyle";
                StyleValue[0].name = "1 Part Invoice Style";

                Xrm.Page.getAttribute("new_invoicestyleid").setValue(StyleValue);
            }
            break;
        default:
            Xrm.Page.getAttribute(field).setValue(value);
    }
}