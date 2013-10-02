using System;

namespace hunter_warfield.Core.Domain
{
    public partial class TitaniumCode
    {
        public Int64 DebtorId { get; set; }

        public string UserId { get; set; }

        public Int64 ClientId { get; set; }

        public Int64? AccountId { get; set; }

        public Int64? AgencyId { get; set; }

        //public Int64 CreditorId { get; set; }

        public string ShortCode { get; set; }

        public decimal? FeePercentage { get; set; }
    }
}
