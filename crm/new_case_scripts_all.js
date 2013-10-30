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

function ClearServiceSubType()
{
// This script will clear the Service Sub-type field every time the Service Type lookup changes
Xrm.Page.getAttribute("new_servicesubtype").setValue(null);
}

// ==================================================

function GetClientNumber()
{
var lookupvalue = Xrm.Page.getAttribute("customerid").getValue()[0].id;
//alert('The lookup value is '+lookupvalue);
var extract = RetrieveValueFromDatabase("account", lookupvalue, "accountnumber", true);
//alert('The extract is '+extract);
Xrm.Page.getAttribute("new_clientnumber").setValue(extract);
Xrm.Page.getAttribute("new_clientnumber").setSubmitMode("always");  //Force Submit since read-only field
}

// ==================================================

function SetTitle()
{

var xServiceType;
var xServiceSubType;
var xClientName;
var xClientNumber;
var xClientLegalName; 
var xTitle;

if (Xrm.Page.getAttribute("new_servicetype").getValue() != null) {
  if (Xrm.Page.getAttribute("new_servicetype").getValue()[0]  != null) {
    if (Xrm.Page.getAttribute("new_servicetype").getValue()[0].id != null) {
       var xLookupvalue = Xrm.Page.getAttribute("new_servicetype").getValue()[0].id;
       //alert('The lookup value is '+xLookupvalue);
       xServiceType = RetrieveValueFromDatabase("new_servicetype", xLookupvalue, "new_service_type", true);
       //alert('The extract is '+xServiceType);
    }
  }
}

if (Xrm.Page.getAttribute("new_servicesubtype").getValue() != null) {
  if (Xrm.Page.getAttribute("new_servicesubtype").getValue()[0]  != null) {
    if (Xrm.Page.getAttribute("new_servicesubtype").getValue()[0].id != null) {
       var xLookupvalue2 = Xrm.Page.getAttribute("new_servicesubtype").getValue()[0].id;
       //alert('The lookup value is '+xLookupvalue2);
       xServiceSubType = RetrieveValueFromDatabase("new_servicesubtype", xLookupvalue2, "new_service_sub_type", true);
       //alert('The extract is '+xServiceSubType);
    }
  }
}

if (Xrm.Page.getAttribute("customerid").getValue() != null) {
  if (Xrm.Page.getAttribute("customerid").getValue()[0]  != null) {
    if (Xrm.Page.getAttribute("customerid").getValue()[0].id != null) {
       var xLookupvalue3 = Xrm.Page.getAttribute("customerid").getValue()[0].id;
       //alert('The client id is '+xLookupvalue3);
       xClientNumber = RetrieveValueFromDatabase("account", xLookupvalue3, "accountnumber", true);
       //alert('The client number is '+xClientNumber);
       xClientName = Xrm.Page.getAttribute("customerid").getValue()[0].name;
       //alert('The client name is '+xClientName);

       //In addition to the title, also grab and populate the Client Legal Name field
       xClientLegalName = RetrieveValueFromDatabase("account", xLookupvalue3, "new_companylegalname", true);
       //alert('The client legal name is '+xClientLegalName);
       Xrm.Page.getAttribute("new_clientlegalname").setValue(xClientLegalName);
       Xrm.Page.getAttribute("new_clientlegalname").setSubmitMode("always");  //Force Submit since read-only field
    }
  }
}

xTitle = xServiceType + " | " + xServiceSubType + " | " + xClientName + " | " + xClientNumber;
//alert("The title is "+xTitle);
Xrm.Page.getAttribute("title").setValue(xTitle);
}

// ==================================================

function CaseOnLoad()
{
// Force the customer to be an Account only
crmForm.all.customerid.setAttribute("lookuptypes", "1");  // This legacy command works in CRM 2011 (for now)
//  Xrm.Page.getAttribute("customerid").setAttribute("lookuptypes", "1");
// The Xrm command above does not work in CRM 2011, new solution required when replacing functional crmForm command

var  formType= Xrm.Page.ui.getFormType();
if (formType == 1)
{
   //Pre-populate the default Title field
   Xrm.Page.getAttribute("title").setValue("<The title will be automatically set as you lookup Client, Service Type and Service Sub-type>");
   //Pre-populate the Follow Up Date field
   Xrm.Page.getAttribute("followupby").setValue(new Date());
}

var  formType= Xrm.Page.ui.getFormType();
if (formType == 2)  // Update form
{
//Extract the "Important Information for all Cases" field from the Company form
if (Xrm.Page.getAttribute("customerid").getValue() != null) {
  if (Xrm.Page.getAttribute("customerid").getValue()[0]  != null) {
    if (Xrm.Page.getAttribute("customerid").getValue()[0].id != null) {
       var xLookupvalue = Xrm.Page.getAttribute("customerid").getValue()[0].id;
       xImportantInfo = RetrieveValueFromDatabase("account", xLookupvalue, "new_importantinformationforallcases", true);
       //alert('The extract is '+xImportantInfo);
       Xrm.Page.getAttribute("new_importantinformationforallcases").setValue(xImportantInfo);
       Xrm.Page.getAttribute("new_importantinformationforallcases").setSubmitMode("always");  //Force Submit since read-only field
     }
   }
}
}

// Pop-up alert if the "Important Information for all Cases" field contains data
var alert_text = Xrm.Page.getAttribute("new_importantinformationforallcases").getValue();
if (alert_text != null) 
{
alert (alert_text);
}

}

// ==================================================

function SetClientImageViewer()
{
if (Xrm.Page.getAttribute("new_clientnumber").getValue() != null)
{
var URLstring = "http://hwiimages.hunterwarfield.com/default.aspx?client=" + Xrm.Page.getAttribute("new_clientnumber").getValue();
Xrm.Page.getAttribute("new_clientimageviewer").setValue(URLstring);
}
else
{
Xrm.Page.getAttribute("new_clientimageviewer").setValue(null);
}
}

// ==================================================

function SetDebtorImageViewer()
{
var DebtorType = null;
if (Xrm.Page.getAttribute("new_debtor").getValue() != null)
{
if (Xrm.Page.getAttribute("new_debtortype").getValue() != null)
   {
   DebtorType = Xrm.Page.getAttribute("new_debtortype").getSelectedOption().text;
   }
var URLstring = "http://hwiimages.hunterwarfield.com/default.aspx?debtor=" + 
Xrm.Page.getAttribute("new_debtor").getValue() + "&type=" + DebtorType;
Xrm.Page.getAttribute("new_debtorimageviewer").setValue(URLstring);
}
else
{
Xrm.Page.getAttribute("new_debtorimageviewer").setValue(null);
}
}

// ==================================================

function GetRespContactFields()
//Get multiple fields from the associated Contact form
{
if (Xrm.Page.getAttribute("responsiblecontactid").getValue() != null)
{
var lookupvalue = Xrm.Page.getAttribute("responsiblecontactid").getValue()[0].id;

var extract = RetrieveValueFromDatabase("contact", lookupvalue, "jobtitle", true);
Xrm.Page.getAttribute("new_contactjobtitle").setValue(extract);
Xrm.Page.getAttribute("new_contactjobtitle").setSubmitMode("always");  //Force Submit since read-only field

var extract2= RetrieveValueFromDatabase("contact", lookupvalue, "telephone1", true);
Xrm.Page.getAttribute("new_contactphonenumber").setValue(extract2);
Xrm.Page.getAttribute("new_contactphonenumber").setSubmitMode("always");  //Force Submit since read-only field

var extract3= RetrieveValueFromDatabase("contact", lookupvalue, "emailaddress1", true);
Xrm.Page.getAttribute("new_contactemailaddres").setValue(extract3);  // The schema name is misspelled
Xrm.Page.getAttribute("new_contactemailaddres").setSubmitMode("always");  //Force Submit since read-only field

var extract4= RetrieveValueFromDatabase("contact", lookupvalue, "fax", true);
Xrm.Page.getAttribute("new_contactfax").setValue(extract4);
Xrm.Page.getAttribute("new_contactfax").setSubmitMode("always");  //Force Submit since read-only field

var PreferenceText = RetrieveValueFromDatabase("contact", lookupvalue, "preferredcontactmethodcode", true);
switch (PreferenceText)
  {
    case "Any":
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setValue(1);
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setSubmitMode("always"); 
      break;
    case "E-mail":
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setValue(2);
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setSubmitMode("always"); 
      break;
    case "Phone":
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setValue(3);
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setSubmitMode("always"); 
      break;
    case "Fax":
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setValue(4);
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setSubmitMode("always"); 
      break;
    case "Mail":
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setValue(5);
      Xrm.Page.getAttribute("new_contactcommunicationspreferencepicklist").setSubmitMode("always"); 
      break;
  }
// Do Not try to save the record at this point since the Xrm.Page.data.entity.save() command slows down using the form
}
}


//==========================================================
//This is used by the View Client images button on the ribbon - GC

function LaunchClientImage() {
          var imageurl = "http://hwiimages.hunterwarfield.com/default.aspx?client=" + Xrm.Page.getAttribute("new_clientnumber").getValue();
          window.open(imageurl, "", "status=no,scrollbars=no,toolbars=no,menubar=no,location=no,width=1000,height=800");
}


//===========================================================
//This is used to enable/disable the View Debtor Images button on the ribbon - GC

function EnableDebtorImage() {
     if (Xrm.Page.getAttribute("new_debtor").getValue() != null) {
          return true;
     }
     else {
          return false;
     }     
}


//===========================================================
//This is used by the View Debtor images button on the ribbon - GC

function LaunchDebtorImage() {

     var DebtorType = null;
     var URLstring;
     
     if (Xrm.Page.getAttribute("new_debtortype").getValue() != null) {
          DebtorType = Xrm.Page.getAttribute("new_debtortype").getSelectedOption().text;
          URLstring = "http://hwiimages.hunterwarfield.com/default.aspx?debtor=" + Xrm.Page.getAttribute("new_debtor").getValue() + "&type=" + DebtorType;
           window.open(URLstring, "", "status=no,scrollbars=no,toolbars=no,menubar=no,location=no,width=1000,height=800");
          }
     else {
          alert("Debtor Type not selected.  Please select a value, and Save the record before launching the Debtor Image Viewer.");
          Xrm.Page.ui.controls.get("new_debtortype").setFocus();
     }
}

function LaunchEmailRespContact() {
    var RespContact = Xrm.Page.getAttribute("responsiblecontactid").getValue();
    var param = {};
    param["pId"] = Xrm.Page.data.entity.getId();
    param["pType"] = "112";
    param["pName"] = Xrm.Page.getAttribute("title").getValue();
    param["partyid"] = Xrm.Page.getAttribute("responsiblecontactid").getValue()[0].id;
    param["partyname"] = Xrm.Page.getAttribute("responsiblecontactid").getValue()[0].name;
    param["partytype"] = "2";
    param["partyaddressused"] = "";
    Xrm.Utility.openEntityForm("email", null, param);
}

//==================================================================
//This is used to enable the Send Email to Resp Contact button - GC

function EnableSendEmail() {
    if(Xrm.Page.getAttribute("responsiblecontactid").getValue() != null) {
        return true;
    }
    else {
        return false;
    }
}


function EnableLaunchDebtorAccount() {
    if (Xrm.Page.getAttribute("caseorigincode").getValue() == 100000009) {
        //Comes from Titanium, so enable button
        return true;
    }
    else {
        //Not from Titanium, so disable button
        return false;
    }
}





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