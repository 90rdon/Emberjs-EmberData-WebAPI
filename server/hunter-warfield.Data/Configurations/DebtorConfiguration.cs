using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class DebtorConfiguration : EntityTypeConfiguration<Debtor>
    {
        public DebtorConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("cnsmr_id");
            //this.Property(p => p.AccountId).HasColumnName("cnsmr_accnt_id");
            //this.Property(p => p.AgencyId).HasColumnName("cnsmr_accnt_idntfr_agncy_id");
            //this.Property(p => p.ClientId).HasColumnName("crdtr_id");
            this.Property(p => p.Type).HasColumnName("cnsmr_iscmmrcl_flg");
            this.Property(p => p.Title).HasColumnName("cnsmr_nm_prfx_txt");
            this.Property(p => p.LastName).HasColumnName("cnsmr_nm_lst_txt");
            this.Property(p => p.FirstName).HasColumnName("cnsmr_nm_frst_txt");
            this.Property(p => p.MiddleName).HasColumnName("cnsmr_nm_mddl_txt");
            this.Property(p => p.Suffix).HasColumnName("cnsmr_nm_sffx_txt");
            this.Property(p => p.DOB).HasColumnName("cnsmr_brth_dt");
            this.Property(p => p.SSN).HasColumnName("cnsmr_idntfr_ssn_txt");
            this.Property(p => p.MaritalStatus).HasColumnName("cnsmr_mrtl_stts_cd");
            this.Property(p => p.Email).HasColumnName("cnsmr_email_txt");
            this.Property(p => p.EmailValidity).HasColumnName("cnsmr_email_vldty_cd");
            this.Property(p => p.OptIn).HasColumnName("cnsmr_email_optn_flg");
            //this.Property(p => p.EIN).HasColumnName("cnsmr_idntfr_ssn_txt");
            this.Property(p => p.Contact).HasColumnName("cnsmr_nm_cmmrcl_txt");
            this.Property(p => p.Country).HasColumnName("cnsmr_addrss_cntry_cd");
            this.Property(p => p.Address1).HasColumnName("cnsmr_addrss_ln_1_txt");
            this.Property(p => p.Address2).HasColumnName("cnsmr_addrss_ln_2_txt");
            this.Property(p => p.Address3).HasColumnName("cnsmr_addrss_ln_3_txt");
            this.Property(p => p.City).HasColumnName("cnsmr_addrss_city_txt");
            this.Property(p => p.State).HasColumnName("cnsmr_addrss_st_txt");
            this.Property(p => p.Zip).HasColumnName("cnsmr_addrss_pstl_cd_txt");
            this.Property(p => p.County).HasColumnName("cnsmr_addrss_cnty_txt");
            this.Property(p => p.DLIssuer).HasColumnName("cnsmr_idntfr_drvr_lcns_issr_txt");
            this.Property(p => p.DLNumber).HasColumnName("cnsmr_idntfr_drvr_lcns_txt");
            this.Property(p => p.Passport).HasColumnName("cnsmr_idntfr_pssprt_txt");
            this.Property(p => p.PIN).HasColumnName("cnsmr_accss_pin_nmbr_txt");
            //this.Property(p => p.ClientId).HasColumnName("wrkgrp_id");
            this.Property(p => p.SSNKey).HasColumnName("cnsmr_idntfr_scrd_ssn_txt");

            this.Map(cnsmr =>
                {
                    cnsmr.Properties(p => new
                    {
                        p.Id,
                        p.Type,
                        p.Title,
                        p.LastName,
                        p.FirstName,
                        p.MiddleName,
                        p.Suffix,
                        p.DOB,
                        p.SSN,
                        p.MaritalStatus,
                        p.Email,
                        p.EmailValidity,
                        p.OptIn,
                        //p.EIN,
                        p.Contact,
                        p.DLIssuer,
                        p.DLNumber,
                        p.Passport,
                        p.PIN,
                        p.SSNKey
                    });
                    cnsmr.ToTable("cnsmr");
                });

            //this.Map(cnsmr_acct =>
            //    {
            //        cnsmr_acct.Properties(p => new
            //        {
            //            p.AccountId,
            //            p.AgencyId,
            //            p.ClientId
            //        });
            //        cnsmr_acct.ToTable("cnsmr_accnt");
            //    });

            this.Map(addr =>
                {
                    addr.Properties(p => new
                    {
                        p.Country,
                        p.Address1,
                        p.Address2,
                        p.Address3,
                        p.City,
                        p.State,
                        p.Zip,
                        p.County
                    });
                    addr.ToTable("cnsmr_addrss");
                });
        }
    }
}
