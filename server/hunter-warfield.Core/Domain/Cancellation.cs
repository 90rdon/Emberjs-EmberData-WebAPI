using System;

namespace hunter_warfield.Core.Domain
{
    public partial class Cancellation
    {
        public Int64 DebtorId { get; set; }

        public Int64 UserId { get; set; }

        public Int64 ClientId { get; set; }

        public Int64? AccountId { get; set; }

        public Int64? AgencyId { get; set; }

        //public Int64 CreditorId { get; set; }

        public string CancellationCode { get; set; }

        public decimal? FeePercentage { get; set; }
    }
}
