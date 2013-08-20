using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class ContactsController : BaseApiController<Contact, ContactDto, Int64>
    {
        public ContactsController() { }

        private const string sft_dlt_flg_default = "N";
        private const int soft_comp_id_default = 13;
        private const int trnsctn_nmbr_default = 11;

        public override ContactDto Post(ContactDto value)
        {
            if (value.DebtorId <= 0) return null;

            var contact = value.ToEntity();
            contact.sft_dlt_flg = sft_dlt_flg_default;
            contact.soft_comp_id = soft_comp_id_default;
            contact.trnsctn_nmbr = trnsctn_nmbr_default;
            contact.upsertDateTime = DateTime.UtcNow;
            contact.upsertUserId = 1;

            return new ContactDto(DataStore.Create<Contact>(contact));
        }

        public override void Put(ContactDto value)
        {
            if (value.DebtorId <= 0) return;

            var contact = value.ToEntity();
            contact.sft_dlt_flg = sft_dlt_flg_default;
            contact.soft_comp_id = soft_comp_id_default;
            contact.trnsctn_nmbr = trnsctn_nmbr_default;
            contact.upsertDateTime = DateTime.UtcNow;
            contact.upsertUserId = 1;

            DataStore.Update<Contact>(contact);
        }
    }
}