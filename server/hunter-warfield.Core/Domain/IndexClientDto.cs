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
    public partial class IndexClientDto : IDataTransfer<Client>
    {
        public IndexClientDto() { }

        public IndexClientDto(Client client)
        {
            if (client == null) return;
            Id = client.Id;
            ClientId = client.Id;
            LegacyId = client.LegacyId;
            Description = client.Description;
            IndexDebtors = new List<IndexDebtorDto>();
        }

        [Key]
        public Int64 Id { get; set; }

        public Int64 ClientId { get; set; }

        public string LegacyId { get; set; }

        public string Description { get; set; }

        public Int32 TotalDebtors { get; set; }

        public virtual List<IndexDebtorDto> IndexDebtors { get; set; }

        public Client ToEntity()
        {
            Client client = new Client
            {
                Id = Id,
                LegacyId = LegacyId,
                Description = Description
            };

            return client;
        }
    }
}
