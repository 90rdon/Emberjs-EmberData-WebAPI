using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class HistoricalDto : IDataTransfer<Historical>
    {
        public HistoricalDto() { }

        public HistoricalDto(Historical historical)
        {
            if (historical == null) return;
            Id = historical.Id;
            Time = historical.Time;
            ActionCode = historical.ActionCode;
            ResultCode = historical.ResultCode;
            User = historical.User;
            Message = historical.Message;
            DebtorId = historical.DebtorId;
        }

        [Key]
        public Int64 Id { get; set; }

        public DateTime Time { get; set; }

        public Int16? ActionCode { get; set; }

        public Int16? ResultCode { get; set; }

        public Int64 User { get; set; }

        public string Message { get; set; }

        public Int64 DebtorId { get; set; }

        public Historical ToEntity()
        {
            return new Historical
            {
                Id = Id,
                Time = Time,
                ActionCode = ActionCode,
                ResultCode = ResultCode,
                User = User,
                Message = Message,
                DebtorId = DebtorId
            };
        }
    }
}
