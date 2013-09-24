using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class NoteConfiguration : EntityTypeConfiguration<Note>
    {
        public NoteConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("cnsmr_accnt_ar_log_id");
            this.Property(p => p.ActionCode).HasColumnName("actn_cd");
            this.Property(p => p.ResultCode).HasColumnName("rslt_Cd");
            this.Property(p => p.ClientId).HasColumnName("wrkgrp_id");
            this.Property(p => p.AccountId).HasColumnName("cnsmr_accnt_id");
            this.Property(p => p.Message).HasColumnName("cnsmr_accnt_ar_mssg_txt");
            this.Property(p => p.DebtorId).HasColumnName("cnsmr_id");
            this.Property(p => p.cnsmr_accnt_ar_log_crt_usr_id).HasColumnName("cnsmr_accnt_ar_log_crt_usr_id");
            this.Property(p => p.soft_comp_id).HasColumnName("upsrt_soft_comp_id");
            this.Property(p => p.trnsctn_nmbr).HasColumnName("upsrt_trnsctn_nmbr");
            this.Property(p => p.upsertDateTime).HasColumnName("upsrt_dttm");
            this.Property(p => p.upsertUserId).HasColumnName("upsrt_usr_id");

            this.Map(log =>
            {
                log.Properties(p => new
                {
                    p.Id,
                    p.ActionCode,
                    p.ResultCode,
                    p.AccountId,
                    p.ClientId,
                    p.Message,
                    p.DebtorId,
                    p.cnsmr_accnt_ar_log_crt_usr_id,
                    p.soft_comp_id,
                    p.trnsctn_nmbr,
                    p.upsertDateTime,
                    p.upsertUserId
                });
                log.ToTable("cnsmr_accnt_ar_log");
            });
        }
    }
}
