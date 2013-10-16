using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Web.Http;
using System.Threading.Tasks;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;
using hunter_warfield.Data.Repositories;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class DebtorNotesController : ApiController
    {
        public DebtorNotesController() { }

        private const string sft_dlt_flg_default = "N";
        private const int soft_comp_id_default = 13;
        private const int trnsctn_nmbr_default = 11;
        private const Int64 userId = 1;

        private hwiContext db = new hwiContext();

        // GET api/Debtors
        //[Queryable(PageSize = 25)]
        public IEnumerable<NoteDto> Get([FromUri(Name = "debtorId")]string debtorId)
        {
            Int64 id = Convert.ToInt64(debtorId);
            
            var result = db.Set<Note>()
                .Where(n => n.DebtorId == id)
                .AsEnumerable()
                .Select(d => new NoteDto(d));

            return result;
        }
    }
}