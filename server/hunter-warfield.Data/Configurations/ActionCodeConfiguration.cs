using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class ActionCodeConfiguration : EntityTypeConfiguration<ActionCode>
    {
        public ActionCodeConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("actn_Cd");
            this.Property(p => p.Value).HasColumnName("actn_cd_val_txt");
            this.Property(p => p.Description).HasColumnName("actn_cd_dscrptn_txt");

            this.Map(actionCode =>
                {
                    actionCode.Properties(p => new
                    {
                        p.Id,
                        p.Value,
                        p.Description
                    });
                    actionCode.ToTable("actn_Cd");
                });
        }
    }
}
