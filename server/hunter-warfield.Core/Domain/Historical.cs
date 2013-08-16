using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class Historical : IIdentifier<Int64>
    {
        public Int64 Id { get; set; }

        public DateTime Time { get; set; }

        public Int16? ActionCode { get; set; }

        public Int16? ResultCode { get; set; }

        public Int64 User { get; set; }

        public string Message { get; set; }

        [ForeignKey("Debtor")]
        public Int64 DebtorId { get; set; }
        public virtual Debtor Debtor { get; set; }
    }
}
