using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class ClientDebtorConfiguration : EntityTypeConfiguration<ClientDebtor>
    {
        public ClientDebtorConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("cnsmr_id");
            this.Property(p => p.Title).HasColumnName("cnsmr_nm_prfx_txt");
            this.Property(p => p.LastName).HasColumnName("cnsmr_nm_lst_txt");
            this.Property(p => p.FirstName).HasColumnName("cnsmr_nm_frst_txt");
            this.Property(p => p.MiddleName).HasColumnName("cnsmr_nm_mddl_txt");
            this.Property(p => p.Suffix).HasColumnName("cnsmr_nm_sffx_txt");

            this.Map(cnsmr =>
                {
                    cnsmr.Properties(p => new
                    {
                        p.Id,
                        p.Title,
                        p.LastName,
                        p.FirstName,
                        p.MiddleName,
                        p.Suffix
                    });
                    cnsmr.ToTable("cnsmr");
                });
        }
    }
}
