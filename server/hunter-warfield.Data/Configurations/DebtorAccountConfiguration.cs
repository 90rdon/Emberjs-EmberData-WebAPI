using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class DebtorAccountConfiguration : EntityTypeConfiguration<DebtorAccount>
    {
        public DebtorAccountConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("cnsmr_accnt_id");
            this.Property(p => p.DebtorId).HasColumnName("cnsmr_id");
            this.Property(p => p.AgencyId).HasColumnName("cnsmr_accnt_idntfr_agncy_id");
            this.Property(p => p.ClientId).HasColumnName("crdtr_id");

            this.Map(cnsmr_acct =>
                {
                    cnsmr_acct.Properties(p => new
                    {
                        p.Id,
                        p.DebtorId,
                        p.AgencyId,
                        p.ClientId
                    });
                    cnsmr_acct.ToTable("cnsmr_accnt");
                });
        }
    }
}
