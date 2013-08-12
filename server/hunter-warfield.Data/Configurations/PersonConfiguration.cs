using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class PersonConfiguration : EntityTypeConfiguration<Person>
    {
        public PersonConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("rltd_prsn_id");
            this.Property(p => p.Relationship).HasColumnName("rltd_prsn_rltnshp_cd");
            this.Property(p => p.Title).HasColumnName("rltd_prsn_nm_prfx_txt");
            this.Property(p => p.LastName).HasColumnName("rltd_prsn_nm_lst_txt");
            this.Property(p => p.FirstName).HasColumnName("rltd_prsn_nm_frst_txt");
            this.Property(p => p.MiddleName).HasColumnName("rltd_prsn_nm_mddl_txt");
            this.Property(p => p.Suffix).HasColumnName("rltd_prsn_nm_sffx_txt");
            this.Property(p => p.DOB).HasColumnName("rltd_prsn_brth_dt");
            this.Property(p => p.SSN).HasColumnName("rltd_prsn_idntfr_ssn_txt");
            this.Property(p => p.StartDate).HasColumnName("rltd_prsn_assctn_strt_dt");
            this.Property(p => p.EndDate).HasColumnName("rltd_prsn_assctn_end_dt");
            this.Property(p => p.ClaimNumber).HasColumnName("rltd_prsn_clms_nmbr_txt");
            this.Property(p => p.Country).HasColumnName("rltd_prsn_addrss_cntry_cd");
            this.Property(p => p.Address1).HasColumnName("rltd_prsn_addrss_ln_1_txt");
            this.Property(p => p.Address2).HasColumnName("rltd_prsn_addrss_ln_2_txt");
            this.Property(p => p.Address3).HasColumnName("rltd_prsn_addrss_ln_3_txt");
            this.Property(p => p.City).HasColumnName("rltd_prsn_addrss_city_txt");
            this.Property(p => p.State).HasColumnName("rltd_prsn_addrss_st_txt");
            this.Property(p => p.Zip).HasColumnName("rltd_prsn_addrss_pstl_cd_txt");
            this.Property(p => p.County).HasColumnName("rltd_prsn_addrss_cnty_txt");
            this.Property(p => p.DebtorId).HasColumnName("cnsmr_id");

            this.Map(prsn =>
                {
                    prsn.Properties(p => new
                    {
                        p.Id,
                        p.Relationship,
                        p.Title,
                        p.LastName,
                        p.FirstName,
                        p.MiddleName,
                        p.Suffix,
                        p.DOB,
                        p.SSN,
                        p.StartDate,
                        p.EndDate,
                        p.ClaimNumber,
                        p.Country,
                        p.Address1,
                        p.Address2,
                        p.Address3,
                        p.City,
                        p.State,
                        p.Zip,
                        p.County,
                        p.DebtorId
                    });
                    prsn.ToTable("Rltd_Prsn");
                });
        }
    }
}
