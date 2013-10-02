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
            ClientId = client.Id;
            LegacyId = client.LegacyId;
            Description = client.Description;
            ClientDebtors = new List<ClientDebtorDto>();
            //if (client.ClientDebtors != null)
            //{
            //    foreach (ClientDebtor debtor in client.ClientDebtors)
            //    {
            //        ClientDebtors.Add(new ClientDebtorDto(debtor));
            //    }
            //}
        }

        [Key]
        public Int64 Id { get; set; }

        public Int64 ClientId { get; set; }

        public string LegacyId { get; set; }

        public string Description { get; set; }

        public virtual List<ClientDebtorDto> ClientDebtors { get; set; }

        public Client ToEntity()
        {
            Client client = new Client
            {
                Id = Id,
                LegacyId = LegacyId,
                Description = Description
            };

            //if (ClientDebtors != null)
            //{
            //    foreach (ClientDebtorDto debtor in ClientDebtors)
            //    {
            //        client.ClientDebtors.Add(debtor.ToEntity());
            //    }
            //}

            return client;
        }
    }
}
