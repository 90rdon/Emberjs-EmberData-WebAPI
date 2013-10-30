using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class DebtorAccountDto : IDataTransfer<DebtorAccount>
    {
        public DebtorAccountDto() { }

        public DebtorAccountDto(DebtorAccount debtorAccount)
        {
            if (debtorAccount == null) return;
            Id = debtorAccount.Id;
            AgencyId = debtorAccount.AgencyId;
            DebtorId = debtorAccount.DebtorId;
            ClientId = debtorAccount.ClientId;
        }

        [Key]
        public Int64 Id { get; set; }
        // 6
        public decimal TotalOriginalBalance { get; set; }
        // 2
        public decimal CurrentBalance { get; set; }
        // 3
        public decimal TotalPayment { get; set; }

        public string Status { get; set; }

        public DateTime PlacementDate { get; set; }

        public Int64 AgencyId { get; set; }

        public Int64 ClientId { get; set; }

        public Int64 DebtorId { get; set; }

        public DebtorAccount ToEntity()
        {
            DebtorAccount debtorAccount = new DebtorAccount
            {
                Id = Id,
                AgencyId = AgencyId,
                DebtorId = DebtorId,
                ClientId = ClientId
            };

            return debtorAccount;
        }
    }
}
