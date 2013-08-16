using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class RelationshipConfiguration : EntityTypeConfiguration<Relationship>
    {
        public RelationshipConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("rltd_prsn_rltnshp_cd");
            this.Property(p => p.Label).HasColumnName("rltd_prsn_rltnshp_val_txt");

            this.Map(rltd =>
                {
                    rltd.Properties(p => new
                    {
                        p.Id,
                        p.Label
                    });
                    rltd.ToTable("Ref_rltd_prsn_rltnshp_cd");
                });
        }
    }
}
