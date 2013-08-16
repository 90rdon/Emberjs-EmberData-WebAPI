using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class CountryConfiguration : EntityTypeConfiguration<Country>
    {
        public CountryConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("cntry_cd");
            this.Property(p => p.Desc).HasColumnName("cntry_dscrptn_txt");

            this.Map(cntry =>
                {
                    cntry.Properties(p => new
                    {
                        p.Id,
                        p.Desc
                    });
                    cntry.ToTable("Ref_cntry_cd");
                });
        }
    }
}
