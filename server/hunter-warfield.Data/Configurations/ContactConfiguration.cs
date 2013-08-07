using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class ContactConfiguration : EntityTypeConfiguration<Contact>
    {
        public ContactConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("cnsmr_phn_id");
            this.Property(p => p.Type).HasColumnName("cnsmr_phn_typ_cd");
            this.Property(p => p.DebtorId).HasColumnName("cnsmr_id");
            this.Property(p => p.Country).HasColumnName("cnsmr_phn_cntry_cd");
            this.Property(p => p.Phone).HasColumnName("cnsmr_phn_nmbr_txt");
            this.Property(p => p.Extension).HasColumnName("cnsmr_phn_xtnsn_txt");
            this.Property(p => p.Score).HasColumnName("cnsmr_phn_qlty_score_nmbr");
            this.Property(p => p.Status).HasColumnName("cnsmr_phn_stts_cd");
            this.Property(p => p.Source).HasColumnName("cnsmr_phn_src_cd");
            this.Property(p => p.Consent).HasColumnName("cnsmr_phn_cnsnt_flg");

            this.Map(cnsmr =>
                {
                    cnsmr.Properties(p => new
                    {
                        p.Id,
                        p.Type,
                        p.DebtorId,
                        p.Country,
                        p.Phone,
                        p.Extension,
                        p.Score,
                        p.Status,
                        p.Source,
                        p.Consent
                    });
                    cnsmr.ToTable("cnsmr_Phn");
                });
        }
    }
}
