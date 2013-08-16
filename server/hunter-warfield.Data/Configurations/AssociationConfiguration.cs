using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class AssociationConfiguration : EntityTypeConfiguration<Association>
    {
        public AssociationConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("emplyr_rltnshp_cd");
            this.Property(p => p.Label).HasColumnName("emplyr_rltnshp_val_txt");

            this.Map(rltd =>
                {
                    rltd.Properties(p => new
                    {
                        p.Id,
                        p.Label
                    });
                    rltd.ToTable("Ref_emplyr_rltnshp_cd");
                });
        }
    }
}
