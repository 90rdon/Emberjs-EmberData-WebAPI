using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class NotesController : BaseApiController<Note, NoteDto, Int64>
    {
        public NotesController() { }

        private const string sft_dlt_flg_default = "N";
        private const int soft_comp_id_default = 13;
        private const int trnsctn_nmbr_default = 11;
        private const Int64 userId = 1;

        public override NoteDto Post(NoteDto value)
        {
            
            if (value.DebtorId <= 0) return null;

            var note = value.ToEntity();
            note.cnsmr_accnt_ar_log_crt_usr_id = userId;
            note.soft_comp_id = soft_comp_id_default;
            note.trnsctn_nmbr = trnsctn_nmbr_default;
            note.upsertDateTime = DateTime.UtcNow;
            note.upsertUserId = userId;

            return new NoteDto(DataStore.Create<Note>(note));
        }

        public override void Put(NoteDto value)
        {
            if (value.DebtorId <= 0) return;

            var note = value.ToEntity();
            note.cnsmr_accnt_ar_log_crt_usr_id = userId;
            note.soft_comp_id = soft_comp_id_default;
            note.trnsctn_nmbr = trnsctn_nmbr_default;
            note.upsertDateTime = DateTime.UtcNow;
            note.upsertUserId = userId;

            DataStore.Update<Note>(note);
        }
    }
}