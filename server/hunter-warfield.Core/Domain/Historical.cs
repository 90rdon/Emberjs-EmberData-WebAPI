using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hunter_warfield.Core.Domain
{
    public class Historical
    {
        public Int64 Id { get; set; }

        public DateTime Date { get; set; }

        public Int16 ActionCode { get; set; }

        public Int16 ResultCode { get; set; }

        public Int64 User { get; set; }

        public string Message { get; set; }

        [ForeignKey("Debtor")]
        public Int64 DebtorId { get; set; }
        public virtual Debtor Debtor { get; set; }
    }
}
