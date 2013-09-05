using System;
using System.Web.Http;
using System.Xml;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Repositories;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class CancellationController : ApiController
    {
        public CancellationController() { }

        public string Post(Cancellation codes)
        {
            string shortname = "A-CBC";
            string accountid = "4267614";

            TitaniumAPIController titanium = new TitaniumAPIController();

            return ParseResult(titanium.CallWebService(shortname, accountid));
        }

        private string ParseResult(XmlDocument xml)
        {
            XmlNamespaceManager manager = new XmlNamespaceManager(xml.NameTable);
            manager.AddNamespace("ns5", "http://www.crsoftwareinc.com/xml/ns/titanium/common/v1_0");

            XmlNode result = xml.SelectSingleNode("//ns5:id", manager);

            return result.InnerText;
        }
    }
}