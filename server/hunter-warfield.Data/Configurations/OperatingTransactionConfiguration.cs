using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.ModelConfiguration;

using hunter_warfield.Core.Domain;

namespace hunter_warfield.Data.Configurations
{
    public class OperatingTransactionConfiguration : EntityTypeConfiguration<OperatingTransaction>
    {
        public OperatingTransactionConfiguration()
        {
            this.HasKey(k => new { k.Id });

            this.Property(p => p.Id).HasColumnName("agncy_oprtng_trnsctn_id");
            this.Property(p => p.CreditorId).HasColumnName("crdtr_id");
            this.Property(p => p.FinancialTrxType).HasColumnName("fnncl_trnsctn_typ_cd");
            this.Property(p => p.PaymentType).HasColumnName("pymnt_instrmnt_typ_cd");
            this.Property(p => p.TransactionAmout).HasColumnName("agncy_oprtng_trnsctn_amnt");
            this.Property(p => p.TransactionFlag).HasColumnName("agncy_oprtng_trnsctn_kll_flg");
            this.Property(p => p.TransactionText).HasColumnName("agncy_oprtng_trnsctn_cmmnt_txt");
            this.Property(p => p.upsertDateTime).HasColumnName("upsrt_dttm");
            this.Property(p => p.soft_comp_id).HasColumnName("upsrt_soft_comp_id");
            this.Property(p => p.trnsctn_nmbr).HasColumnName("upsrt_trnsctn_nmbr");
            this.Property(p => p.upsertUserId).HasColumnName("upsrt_usr_id");


            this.Map(trans =>
                {
                    trans.Properties(p => new
                    {
                        p.Id,
                        p.CreditorId,
                        p.FinancialTrxType,
                        p.PaymentType,
                        p.TransactionAmout,
                        p.TransactionText,
                        p.TransactionFlag,
                        p.upsertDateTime,
                        p.soft_comp_id,
                        p.trnsctn_nmbr,
                        p.upsertUserId
                    });
                    trans.ToTable("agncy_oprtng_trnsctn");
                });
        }
    }
}
