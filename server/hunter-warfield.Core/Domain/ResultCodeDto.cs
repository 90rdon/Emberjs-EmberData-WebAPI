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
    public partial class ResultCodeDto : IDataTransfer<ResultCode>
    {
        public ResultCodeDto() { }

        public ResultCodeDto(ResultCode resultCode)
        {
            if (resultCode == null) return;
            Id = resultCode.Id;

            Value = resultCode.Value;

            Description = resultCode.Description;
        }

        [Key]
        public Int16 Id { get; set; }

        public string Value { get; set; }

        public string Description { get; set; }

        public ResultCode ToEntity()
        {
            ResultCode resultCode = new ResultCode
            {
                Id = Id,
                Value = Value,
                Description = Description
            };

            return resultCode;
        }
    }
}
