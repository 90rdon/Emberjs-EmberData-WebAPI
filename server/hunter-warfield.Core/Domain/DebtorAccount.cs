using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class DebtorAccount : IIdentifier<Int64>
    {
        public Int64 Id { get; set; }

        public Int64 AgencyId { get; set; }

        [ForeignKey("Debtor")]
        public Int64 DebtorId { get; set; }
        public virtual Debtor Debtor { get; set; }

        [ForeignKey("Client")]
        public Int64 ClientId { get; set; }
        public virtual Client Client { get; set; }
    }
}
