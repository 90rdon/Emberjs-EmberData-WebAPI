using System;

namespace hunter_warfield.Core.Domain
{
    public partial class OperatingTransaction
    {
        public Int64 Id { get; set; }

        public Int64 CreditorId { get; set; }

        public Int16 FinancialTrxType { get; set; }

        public Int16 PaymentType { get; set; }

        public string TransactionFlag { get; set; }

        public decimal? TransactionAmout { get; set; }

        public string TransactionText { get; set; }

        // none null fields
        public DateTime upsertDateTime { get; set; }
        public int soft_comp_id { get; set; }
        public int trnsctn_nmbr { get; set; }
        public Int64 upsertUserId { get; set; }
    }
}
