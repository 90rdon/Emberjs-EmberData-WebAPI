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
    public partial class ActionCodeDto : IDataTransfer<ActionCode>
    {
        public ActionCodeDto() { }

        public ActionCodeDto(ActionCode actionCode)
        {
            if (actionCode == null) return;
            Id = actionCode.Id;

            Value = actionCode.Value;

            Description = actionCode.Description;
        }

        [Key]
        public Int16 Id { get; set; }

        public string Value { get; set; }

        public string Description { get; set; }

        public ActionCode ToEntity()
        {
            ActionCode actionCode = new ActionCode
            {
                Id = Id,
                Value = Value,
                Description = Description
            };

            return actionCode;
        }
    }
}
