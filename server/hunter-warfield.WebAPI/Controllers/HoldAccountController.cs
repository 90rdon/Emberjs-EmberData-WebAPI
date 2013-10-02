using System;
using System.Web.Http;
using System.Net;
using System.Xml;
using System.Text;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Repositories;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class HoldAccountController : ApiController
    {
        private const Int64 upsertUserId = 3;
        private const Int64 defaultWorkgroupId = 0;
        private const int soft_comp_id_default = 13;
        private const int trnsctn_nmbr_default = 11;

        public HoldAccountController() { }

        public HttpStatusCode Post(TitaniumCode codes)
        {
            TitaniumAPIController titanium = new TitaniumAPIController();

            var result = ParseResult(titanium.CallWebService("Hold", codes.AgencyId.ToString()));

            if (result == null)
                return HttpStatusCode.InternalServerError;
            else
            {
                //string text = result.InnerText;
                CreateNote(codes, result.InnerText);
                return HttpStatusCode.OK;
            }
        }

        private XmlNode ParseResult(XmlDocument xml)
        {
            XmlNamespaceManager manager = new XmlNamespaceManager(xml.NameTable);
            manager.AddNamespace("ns5", "http://www.crsoftwareinc.com/xml/ns/titanium/common/v1_0");

            //XmlNode result = xml.SelectSingleNode("//ns5:id", manager);

            //if (result == null)
            //    return null;
            //else
            //    return result.InnerText;
            return xml.SelectSingleNode("//ns5:id", manager);
        }

        private void CreateNote(TitaniumCode codes, string confirmationNumber)
        {
            Note note = new Note();
            note.ActionCode = 211;
            note.ResultCode = 266;
            note.AccountId = codes.AccountId;
            note.DebtorId = codes.DebtorId;
            note.ClientId = defaultWorkgroupId;
            StringBuilder message = new StringBuilder();
            message.AppendLine("Account Holded ---");
            message.AppendLine("Confirmation Number: " + confirmationNumber);
            message.AppendLine("CRM User Id:         " + codes.UserId); 
            note.Message = message.ToString();
            note.cnsmr_accnt_ar_log_crt_usr_id = upsertUserId;
            note.soft_comp_id = soft_comp_id_default;
            note.trnsctn_nmbr = trnsctn_nmbr_default;
            note.upsertDateTime = DateTime.UtcNow;
            note.upsertUserId = upsertUserId;

            var datastore = new EFRepository<Note>();
            datastore.Create<Note>(note);
        }
    }
}