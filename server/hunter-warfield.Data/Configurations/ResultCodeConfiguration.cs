using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class ResultCodeConfiguration : EntityTypeConfiguration<ResultCode>
    {
        public ResultCodeConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("rslt_Cd");
            this.Property(p => p.Value).HasColumnName("rslt_cd_val_txt");
            this.Property(p => p.Description).HasColumnName("rslt_cd_dscrptn_txt");

            this.Map(resultCode =>
                {
                    resultCode.Properties(p => new
                    {
                        p.Id,
                        p.Value,
                        p.Description
                    });
                    resultCode.ToTable("rslt_Cd");
                });
        }
    }
}
