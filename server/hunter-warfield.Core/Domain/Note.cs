using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class Note : IIdentifier<Int64>
    {
        public Int64 Id { get; set; }

        public Int16? ActionCode { get; set; }

        public Int16? ResultCode { get; set; }

        public Int64? ClientId { get; set; }

        public Int64? AccountId { get; set; }

        public string Message { get; set; }

        // none null fields
        public Int64 cnsmr_accnt_ar_log_crt_usr_id { get; set; }
        public DateTime upsertDateTime { get; set; }
        public int soft_comp_id { get; set; }
        public int trnsctn_nmbr { get; set; }
        public Int64 upsertUserId { get; set; }

        [ForeignKey("Debtor")]
        public Int64 DebtorId { get; set; }
        public virtual Debtor Debtor { get; set; }
    }
}
