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
    public class CancellationController : ApiController
    {
        private const Int64 upsertUserId = 3;
        private const Int64 defaultWorkgroupId = 0;
        private const int soft_comp_id_default = 13;
        private const int trnsctn_nmbr_default = 11;

        public CancellationController() { }

        public HttpStatusCode Post(TitaniumCode codes)
        {
            TitaniumAPIController titanium = new TitaniumAPIController();

            var result = ParseResult(titanium.CallWebService(codes.ShortCode, codes.AgencyId.ToString()));

            if (result == null)
                return HttpStatusCode.InternalServerError;
            else
            {
                //string text = result.InnerText;
                CreateNote(codes, result.InnerText);
                UpdateOperatingTransaction(codes);
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
            message.AppendLine("Account Cancelled for " + codes.AccountId);
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

        private void UpdateOperatingTransaction(TitaniumCode codes)
        {
            OperatingTransaction transaction = new OperatingTransaction();
            transaction.CreditorId = codes.ClientId;
            transaction.FinancialTrxType = 3;
            transaction.PaymentType = 0;
            transaction.TransactionAmout = CalculateCancellationFee(codes);
            transaction.TransactionText = "Finance Charge";
            transaction.soft_comp_id = 1;
            transaction.trnsctn_nmbr = 1;
            //char flag = new char();
            //flag = 'N';
            transaction.TransactionFlag = "N";
            transaction.upsertUserId = upsertUserId;
            transaction.upsertDateTime = DateTime.Now;

            var datastore = new EFRepository<OperatingTransaction>();
            datastore.Create<OperatingTransaction>(transaction);
        }

        private decimal CalculateCancellationFee(TitaniumCode codes)
        {
            decimal chargeFee = 0.10M;
            if (codes.FeePercentage != null)
                chargeFee = Convert.ToDecimal(codes.FeePercentage);

            hwiRepositories hwi = new hwiRepositories();
            var accountId = Convert.ToInt64(codes.AccountId);
            var percentage = chargeFee;
            var balance = hwi.DebtorBalance(accountId);

            return balance * percentage;
        }
    }
}