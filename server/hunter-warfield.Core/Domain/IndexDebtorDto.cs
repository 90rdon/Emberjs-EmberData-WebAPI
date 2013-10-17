using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class IndexDebtorDto : IDataTransfer<IndexDebtor>
    {
        public IndexDebtorDto() { }

        public IndexDebtorDto(IndexDebtor indexDebtor)
        {
            if (indexDebtor == null) return;
            Id = indexDebtor.Id;
            Title = indexDebtor.Title;
            FirstName = indexDebtor.FirstName;
            MiddleName = indexDebtor.MiddleName;
            LastName = indexDebtor.LastName;
            Suffix = indexDebtor.Suffix;
            TotalOriginalBalance = indexDebtor.TotalOriginalBalance;
            CurrentBalance = indexDebtor.CurrentBalance;
            TotalPayment = indexDebtor.TotalPayment;
            Status = indexDebtor.Status;
            AgencyId = indexDebtor.AgencyId;
            PlacementDate = indexDebtor.PlacementDate;
            DebtorId = indexDebtor.DebtorId;
            ClientId = indexDebtor.ClientId;
        }

        [Key]
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

        public Int64 DebtorId { get; set; }

        public Int64 ClientId { get; set; }

        public IndexDebtor ToEntity()
        {
            IndexDebtor indexDebtor = new IndexDebtor
            {
                Id = Id,
                Title = Title,
                FirstName = FirstName,
                MiddleName = MiddleName,
                LastName = LastName,
                Suffix = Suffix,
                TotalOriginalBalance = TotalOriginalBalance,
                CurrentBalance = CurrentBalance,
                TotalPayment = TotalPayment,
                Status = Status,
                PlacementDate = PlacementDate,
                AgencyId = AgencyId,
                DebtorId = DebtorId,
                ClientId = ClientId
            };

            return indexDebtor;
        }
    }
}
