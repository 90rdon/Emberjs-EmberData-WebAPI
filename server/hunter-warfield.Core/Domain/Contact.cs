using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hunter_warfield.Core.Domain
{
    public class Contact
    {
        public Int64 Id { get; set; }

        public Int64 DebtorId { get; set; }

        public Int16 Type { get; set; }

        public Int16 Country { get; set; }

        public string Phone { get; set; }

        public string Extension { get; set; }

        public Int64 Score { get; set; }

        public Int16 Status { get; set; }

        public Int16 Source { get; set; }

        public string Consent { get; set; }

        public virtual Debtor Debtor { get; set; }
    }
}
