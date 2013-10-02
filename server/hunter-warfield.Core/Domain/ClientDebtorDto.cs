using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class ClientDebtorDto : IDataTransfer<ClientDebtor>
    {
        public ClientDebtorDto() { }

        public ClientDebtorDto(ClientDebtor clientDebtor)
        {
            if (clientDebtor == null) return;
            Id = clientDebtor.Id;
            AccountId = clientDebtor.AccountId;
            Title = clientDebtor.Title;
            FirstName = clientDebtor.FirstName;
            MiddleName = clientDebtor.MiddleName;
            LastName = clientDebtor.LastName;
            Suffix = clientDebtor.Suffix;
            TotalOriginalBalance = clientDebtor.TotalOriginalBalance;
            CurrentBalance = clientDebtor.CurrentBalance;
            TotalPayment = clientDebtor.TotalPayment;
            ClientId = clientDebtor.ClientId;
        }

        [Key]
        public Int64 Id { get; set; }

        public Int64 AccountId { get; set; }

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

        public Int64 ClientId { get; set; }

        public ClientDebtor ToEntity()
        {
            ClientDebtor clientDebtor = new ClientDebtor
            {
                Id = Id,
                AccountId = AccountId,
                Title = Title,
                FirstName = FirstName,
                MiddleName = MiddleName,
                LastName = LastName,
                Suffix = Suffix,
                TotalOriginalBalance = TotalOriginalBalance,
                CurrentBalance = CurrentBalance,
                TotalPayment = TotalPayment,
                ClientId = ClientId
            };

            return clientDebtor;
        }
    }
}
