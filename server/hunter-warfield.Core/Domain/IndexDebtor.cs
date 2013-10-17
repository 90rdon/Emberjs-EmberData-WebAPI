using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class IndexDebtor : IIdentifier<Int64>
    {
        public Int64 Id { get; set; }

        public string Title { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Suffix { get; set; }
        // 6
        public decimal TotalOriginalBalance { get; set; }
        // 2
        public decimal CurrentBalance { get; set; }
        // 3
        public decimal TotalPayment { get; set; }

        public string Status { get; set; }

        public DateTime PlacementDate { get; set; }

        public Int64 AgencyId { get; set; }

        //[ForeignKey("DebtorAccount")]
        public Int64 DebtorId { get; set; }

        [ForeignKey("Client")]
        public Int64 ClientId { get; set; }
        //public virtual Client Client { get; set; }
    }
}
