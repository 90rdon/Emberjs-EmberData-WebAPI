using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class EmploymentsController : BaseApiController<Employment, EmploymentDto, Int64>
    {
        public EmploymentsController() { }

        private const string sft_dlt_flg_default = "N";
        private const int soft_comp_id_default = 13;
        private const int trnsctn_nmbr_default = 11;

        public override EmploymentDto Post(EmploymentDto value)
        {
            var employment = value.ToEntity();
            employment.soft_comp_id = soft_comp_id_default;
            employment.trnsctn_nmbr = trnsctn_nmbr_default;
            employment.upsertDateTime = DateTime.UtcNow;
            employment.upsertUserId = 1;

            return new EmploymentDto(DataStore.Create<Employment>(employment));
        }

        public override void Put(EmploymentDto value)
        {
            if (value.DebtorId <= 0) return;

            var employment = value.ToEntity();
            employment.soft_comp_id = soft_comp_id_default;
            employment.trnsctn_nmbr = trnsctn_nmbr_default;
            employment.upsertDateTime = DateTime.UtcNow;
            employment.upsertUserId = 1;

            DataStore.Update<Employment>(employment);
        }
    }
}