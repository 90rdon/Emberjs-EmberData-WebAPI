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
    public partial class NoteDto : IDataTransfer<Note>
    {
        public NoteDto() { }

        public NoteDto(Note note)
        {
            if (note == null) return;
            Id = note.Id;
            ActionCode = note.ActionCode;
            ResultCode = note.ResultCode;
            ClientId = note.ClientId;
            Message = note.Message;
            Time = note.upsertDateTime;
            DebtorId = note.DebtorId;
        }

        [Key]
        public Int64 Id { get; set; }

        public Int16? ActionCode { get; set; }

        public Int16? ResultCode { get; set; }

        public Int64? ClientId { get; set; }

        public string Message { get; set; }

        public DateTime Time { get; set; }

        public Int64 DebtorId { get; set; }

        public Note ToEntity()
        {
            return new Note
            {
                Id = Id,
                ActionCode = ActionCode,
                ResultCode = ResultCode,
                ClientId = ClientId,
                Message = Message,
                upsertDateTime = Time,
                DebtorId = DebtorId
            };
        }
    }
}
