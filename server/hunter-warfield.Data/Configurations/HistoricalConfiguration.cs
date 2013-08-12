using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class HistoricalConfiguration : EntityTypeConfiguration<Historical>
    {
        public HistoricalConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("cnsmr_accnt_ar_log_id");
            this.Property(p => p.Time).HasColumnName("upsrt_dttm");
            this.Property(p => p.ActionCode).HasColumnName("actn_cd");
            this.Property(p => p.ResultCode).HasColumnName("rslt_cd");
            this.Property(p => p.User).HasColumnName("upsrt_usr_id");
            this.Property(p => p.Message).HasColumnName("cnsmr_accnt_ar_mssg_txt");
            this.Property(p => p.DebtorId).HasColumnName("cnsmr_id");

            this.Map(ar_log =>
                {
                    ar_log.Properties(p => new
                    {
                        p.Id,
                        p.Time,
                        p.ActionCode,
                        p.ResultCode,
                        p.User,
                        p.Message,
                        p.DebtorId
                    });
                    ar_log.ToTable("cnsmr_accnt_ar_log");
                });
        }
    }
}
