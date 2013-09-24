using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class ClientConfiguration : EntityTypeConfiguration<Client>
    {
        public ClientConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("crdtr_id");
            this.Property(p => p.LegacyId).HasColumnName("crdtr_idntfr_lgcy_txt");
            this.Property(p => p.Description).HasColumnName("crdtr_nm");

            this.Map(wrkgrp =>
                {
                    wrkgrp.Properties(p => new
                    {
                        p.Id,
                        p.LegacyId,
                        p.Description
                    });
                    wrkgrp.ToTable("crdtr");
                });
        }
    }
}
