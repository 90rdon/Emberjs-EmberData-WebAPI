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
    public partial class RelationshipDto : IDataTransfer<Relationship>
    {
        public RelationshipDto() { }

        public RelationshipDto(Relationship country)
        {
            if (country == null) return;
            Id = country.Id;
            Label = country.Label;
        }

        [Key]
        public Int16 Id { get; set; }

        public string Label { get; set; }

        public Relationship ToEntity()
        {
            return new Relationship
            {
                Id = Id,
                Label = Label
            };
        }
    }
}
