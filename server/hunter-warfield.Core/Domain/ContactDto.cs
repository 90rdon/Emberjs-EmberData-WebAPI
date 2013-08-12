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
    public partial class ContactDto : IDataTransfer<Contact>
    {
        public ContactDto() { }

        public ContactDto(Contact contact)
        {
            if (contact == null) return;
            Id = contact.Id;
            Type = contact.Type;
            Country = contact.Country;
            Phone = contact.Phone;
            Extension = contact.Extension;
            Score = contact.Score;
            Status = contact.Status;
            Source = contact.Source;
            Consent = contact.Consent;
            DebtorId = contact.DebtorId;
        }

        [Key]
        public Int64 Id { get; set; }

        public Int16 Type { get; set; }

        public Int16 Country { get; set; }

        public string Phone { get; set; }

        public string Extension { get; set; }

        public Int64 Score { get; set; }

        public Int16 Status { get; set; }

        public Int16 Source { get; set; }

        public string Consent { get; set; }

        public Int64 DebtorId { get; set; }

        public Contact ToEntity()
        {
            return new Contact
            {
                Id = Id,
                Type = Type,
                Country = Country,
                Phone = Phone,
                Extension = Extension,
                Score = Score,
                Status = Status,
                Source = Source,
                Consent = Consent,
                DebtorId = DebtorId
            };
        }
    }
}
