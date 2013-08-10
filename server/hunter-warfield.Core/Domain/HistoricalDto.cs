using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hunter_warfield.Core.Domain
{
    public class HistoricalDto
    {
        public HistoricalDto() { }

        public HistoricalDto(Historical historical)
        {
            Id = historical.Id;
            Date = historical.Date;
            ActionCode = historical.ActionCode;
            ResultCode = historical.ResultCode;
            User = historical.User;
            Message = historical.Message;
            DebtorId = historical.DebtorId;
        }

        [Key]
        public Int64 Id { get; set; }

        public DateTime Date { get; set; }

        public Int16 ActionCode { get; set; }

        public Int16 ResultCode { get; set; }

        public Int64 User { get; set; }

        public string Message { get; set; }

        public Int64 DebtorId { get; set; }

        public Historical ToEntity()
        {
            return new Historical
            {
                Id = Id,
                Date = Date,
                ActionCode = ActionCode,
                ResultCode = ResultCode,
                User = User,
                Message = Message,
                DebtorId = DebtorId
            };
        }
    }
}
