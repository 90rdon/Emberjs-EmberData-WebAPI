using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class PersonsController : BaseApiController<Person, PersonDto, Int64>
    {
        public PersonsController() { }

        private const string sft_dlt_flg_default = "N";
        private const int soft_comp_id_default = 13;
        private const int trnsctn_nmbr_default = 11;

        public override PersonDto Post(PersonDto value)
        {
            var person = value.ToEntity();
            person.soft_comp_id = soft_comp_id_default;
            person.trnsctn_nmbr = trnsctn_nmbr_default;
            person.upsertDateTime = DateTime.UtcNow;
            person.upsertUserId = 1;

            return new PersonDto(DataStore.Create<Person>(person));
        }

        public override void Put(PersonDto value)
        {
            if (value.DebtorId <= 0) return;

            var person = value.ToEntity();
            person.soft_comp_id = soft_comp_id_default;
            person.trnsctn_nmbr = trnsctn_nmbr_default;
            person.upsertDateTime = DateTime.UtcNow;
            person.upsertUserId = 1;

            DataStore.Update<Person>(person);
        }
    }
}