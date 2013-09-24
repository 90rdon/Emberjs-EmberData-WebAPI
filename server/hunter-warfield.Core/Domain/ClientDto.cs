using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class ClientDto : IDataTransfer<Client>
    {
        public ClientDto() { }

        public ClientDto(Client client)
        {
            if (client == null) return;
            Id = client.Id;
            LegacyId = client.LegacyId;
            Description = client.Description;
            Debtors = new List<DebtorDto>();
            if (client.Debtors != null)
            {
                foreach (Debtor debtor in client.Debtors)
                {
                    Debtors.Add(new DebtorDto(debtor));
                }
            }
        }

        [Key]
        public Int64 Id { get; set; }

        public string LegacyId { get; set; }

        public string Description { get; set; }

        public virtual List<DebtorDto> Debtors { get; set; }

        public Client ToEntity()
        {
            Client client = new Client
            {
                Id = Id,
                LegacyId = LegacyId,
                Description = Description
            };

            if (Debtors != null)
            {
                foreach (DebtorDto debtor in Debtors)
                {
                    client.Debtors.Add(debtor.ToEntity());
                }
            }

            return client;
        }
    }
}
