using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class Employment : IIdentifier
    {
        public Int64 Id { get; set; }

        public Int16? Relationship { get; set; }

        public string Name { get; set; }

        public decimal MonthlyNetIncome { get; set; }

        public string Position { get; set; }

        public DateTime? HireDate { get; set; }

        public string Phone { get; set; }

        public string Website { get; set; }

        public Int16? Status { get; set; }

        public Int16? Source { get; set; }

        public Int16? Country { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zip { get; set; }

        public string County { get; set; }

        public string JobTitle { get; set; }

        public DateTime? TerminationDate { get; set; }

        public decimal YearlyIncome { get; set; }

        public decimal MonthlyGrossIncome { get; set; }

        [ForeignKey("Debtor")]
        public Int64 DebtorId { get; set; }
        public virtual Debtor Debtor { get; set; }
    }
}
