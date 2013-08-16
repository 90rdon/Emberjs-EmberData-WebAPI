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
    public partial class AssociationDto : IDataTransfer<Association>
    {
        public AssociationDto() { }

        public AssociationDto(Association country)
        {
            if (country == null) return;
            Id = country.Id;
            Label = country.Label;
        }

        [Key]
        public Int16 Id { get; set; }

        public string Label { get; set; }

        public Association ToEntity()
        {
            return new Association
            {
                Id = Id,
                Label = Label
            };
        }
    }
}
