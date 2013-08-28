using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using System.Net;
using System.Configuration;
using System.Text;

namespace hunter_warfield.WebAPI.Helpers
{
    public class TitaniumAPIController
    {
        private string WebserviceURL;
        private StringBuilder SoapEnvelop;

        public TitaniumAPIController()
        {
            WebserviceURL = ConfigurationManager.AppSettings["TitaniumUrl"];

            SoapEnvelop = new StringBuilder();
            SoapEnvelop.Append(    "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" ");
            SoapEnvelop.AppendLine("    xmlns:v1=\"http://www.crsoftwareinc.com/xml/ns/titanium/tag/tagAssociationService/v1_0\" ");
            SoapEnvelop.AppendLine("    xmlns:v11=\"http://www.crsoftwareinc.com/xml/ns/titanium/common/v1_0\"> ");
            SoapEnvelop.AppendLine("    <soapenv:Header/>");
            SoapEnvelop.AppendLine("     <soapenv:Body>");
            SoapEnvelop.AppendLine("        <v1:assign-consumer-account-tag>");
            SoapEnvelop.AppendLine("                <v11:tag-short-name>{0}</v11:tag-short-name>");
            SoapEnvelop.AppendLine("                <v11:agency-consumer-account-id>{1}</v11:agency-consumer-account-id>");
            SoapEnvelop.AppendLine("        </v1:assign-consumer-account-tag>");
            SoapEnvelop.AppendLine("    </soapenv:Body>");
            SoapEnvelop.AppendLine("</soapenv:Envelope>");
        }

        public XmlDocument CallWebService(string tagShortName, string consumerAccountId)
        {
            try
            {
                using (WebClient wc = new WebClient())
                {
                    XmlDocument retXMLDoc = new XmlDocument();
                    wc.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                    retXMLDoc.LoadXml(wc.UploadString(WebserviceURL, 
                        string.Format(SoapEnvelop.ToString(), tagShortName, consumerAccountId)));
                    return retXMLDoc;
                }
            }
            catch (Exception ex)
            {
                string m = ex.Message;
                return null;
            }
        }
    }
}