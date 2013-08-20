using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class EmploymentConfiguration : EntityTypeConfiguration<Employment>
    {
        public EmploymentConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("emplyr_id");
            this.Property(p => p.Relationship).HasColumnName("emplyr_rltnshp_cd");
            this.Property(p => p.Name).HasColumnName("emplyr_full_nm_txt");
            this.Property(p => p.MonthlyNetIncome).HasColumnName("emplyr_incm_mnthly_net_amnt");
            this.Property(p => p.Position).HasColumnName("emplyr_pstn_hld_txt");
            this.Property(p => p.HireDate).HasColumnName("emplyr_hire_dt");
            this.Property(p => p.Phone).HasColumnName("emplyr_phn_nmbr_txt");
            this.Property(p => p.Website).HasColumnName("emplyr_wbst_txt");
            this.Property(p => p.Status).HasColumnName("emplyr_stts_cd");
            this.Property(p => p.Source).HasColumnName("emplyr_src_cd");
            this.Property(p => p.Country).HasColumnName("emplyr_addrss_cntry_cd");
            this.Property(p => p.Address1).HasColumnName("emplyr_addrss_ln_1_txt");
            this.Property(p => p.Address2).HasColumnName("emplyr_addrss_ln_2_txt");
            this.Property(p => p.Address3).HasColumnName("emplyr_addrss_ln_3_txt");
            this.Property(p => p.City).HasColumnName("emplyr_addrss_city_txt");
            this.Property(p => p.State).HasColumnName("emplyr_addrss_st_txt");
            this.Property(p => p.Zip).HasColumnName("emplyr_addrss_pstl_cd_txt");
            this.Property(p => p.County).HasColumnName("emplyr_addrss_cnty_txt");
            this.Property(p => p.JobTitle).HasColumnName("emplyr_title_hld_txt");
            this.Property(p => p.TerminationDate).HasColumnName("emplyr_emplymnt_end_dttm");
            this.Property(p => p.YearlyIncome).HasColumnName("emplyr_incm_yrly_amnt");
            this.Property(p => p.MonthlyGrossIncome).HasColumnName("emplyr_incm_mnthly_grss_amnt");
            this.Property(p => p.DebtorId).HasColumnName("cnsmr_id");
            this.Property(p => p.soft_comp_id).HasColumnName("upsrt_soft_comp_id");
            this.Property(p => p.trnsctn_nmbr).HasColumnName("upsrt_trnsctn_nmbr");
            this.Property(p => p.upsertDateTime).HasColumnName("upsrt_dttm");
            this.Property(p => p.upsertUserId).HasColumnName("upsrt_usr_id");

            this.Map(emplyr =>
                {
                    emplyr.Properties(p => new
                    {
                        p.Id,
                        p.Relationship,
                        p.Name,
                        p.MonthlyNetIncome,
                        p.Position,
                        p.HireDate,
                        p.Phone,
                        p.Website,
                        p.Status,
                        p.Source,
                        p.Country,
                        p.Address1,
                        p.Address2,
                        p.Address3,
                        p.City,
                        p.State,
                        p.Zip,
                        p.County,
                        p.JobTitle,
                        p.TerminationDate,
                        p.YearlyIncome,
                        p.MonthlyGrossIncome,
                        p.DebtorId,
                        p.soft_comp_id,
                        p.trnsctn_nmbr,
                        p.upsertDateTime,
                        p.upsertUserId
                    });
                    emplyr.ToTable("emplyr");
                });
        }
    }
}
