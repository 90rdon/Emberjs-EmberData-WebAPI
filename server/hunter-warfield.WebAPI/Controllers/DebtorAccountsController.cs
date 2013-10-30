using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class DebtorAccountsController : BaseApiController<DebtorAccount, DebtorAccountDto, Int64>
    {
        public DebtorAccountsController() { Includes = new[] { "Debtor" }; }

        private hwiContext db = new hwiContext();

        public override DebtorAccountDto Get(long id)
        {
            var debtorAccount = base.Get(id);

            StringBuilder sql = new StringBuilder();
            sql.Append("SELECT");
            sql.Append("    ca.cnsmr_accnt_id as Id,");
            sql.Append("    ca.cnsmr_id as DebtorId,");
            sql.Append("    ca.TotalOriginalBalance,");
            sql.Append("    ca.CurrentBalance,");
            sql.Append("    ca.TotalPayment,");
            sql.Append("    ca.crdtr_id as ClientId,");
            sql.Append("    ca.cnsmr_accnt_plcmnt_date as PlacementDate,");
            sql.Append("    ca.cnsmr_accnt_idntfr_agncy_id as AgencyId,");
            sql.Append("    c.cnsmr_nm_prfx_txt as Title,");
            sql.Append("    c.cnsmr_nm_lst_txt as LastName,");
            sql.Append("    c.cnsmr_nm_frst_txt as FirstName,");
            sql.Append("    c.cnsmr_nm_mddl_txt as MiddleName,");
            sql.Append("    c.cnsmr_nm_sffx_txt as Suffix,");
            sql.Append("    v.summary_code as Status");
            sql.Append(" FROM ");
            sql.Append("( ");
            sql.Append("    SELECT");
            sql.Append("        base.cnsmr_id,");
            sql.Append("        base.cnsmr_accnt_id,");
            sql.Append("        base.crdtr_id,");
            sql.Append("        base.cnsmr_accnt_plcmnt_date,");
            sql.Append("        base.cnsmr_accnt_idntfr_agncy_id,");
            sql.Append("        SUM(base.TotalOriginalBalance) as TotalOriginalBalance,");
            sql.Append("        SUM(base.CurrentBalance) as CurrentBalance,");
            sql.Append("        SUM(base.TotalPayment) as TotalPayment");
            sql.Append("    FROM");
            sql.Append("    (");
            sql.Append("        SELECT");
            sql.Append("            c.cnsmr_id,");
            sql.Append("            ca.cnsmr_accnt_id,");
            sql.Append("            ca.crdtr_id,");
            sql.Append("            ca.cnsmr_accnt_plcmnt_date,");
            sql.Append("            ca.cnsmr_accnt_idntfr_agncy_id,");
            sql.Append("            CASE cab.bal_nm_id");
            sql.Append("                WHEN 6 THEN");
            sql.Append("                    cab.cnsmr_accnt_bal_amnt");
            sql.Append("                ELSE");
            sql.Append("                    0");
            sql.Append("                END as TotalOriginalBalance,");
            sql.Append("            CASE cab.bal_nm_id");
            sql.Append("                WHEN 2 THEN");
            sql.Append("                    cab.cnsmr_accnt_bal_amnt");
            sql.Append("                ELSE");
            sql.Append("                    0");
            sql.Append("                END as CurrentBalance,");
            sql.Append("            CASE cab.bal_nm_id");
            sql.Append("                WHEN 3 THEN");
            sql.Append("                    cab.cnsmr_accnt_bal_amnt");
            sql.Append("                ELSE");
            sql.Append("                    0");
            sql.Append("                END as TotalPayment");
            sql.Append("        FROM");
            sql.Append("            cnsmr c INNER JOIN");
            sql.Append("            cnsmr_accnt ca on c.cnsmr_id = ca.cnsmr_id INNER JOIN");
            sql.Append("            cnsmr_accnt_bal cab on ca.cnsmr_accnt_id = cab.cnsmr_accnt_id");
            sql.Append("        WHERE cab.bal_nm_id in (2, 3, 6) AND ca.cnsmr_accnt_id = {0}");
            sql.Append("    ) as base");
            sql.Append("    GROUP BY base.cnsmr_id, base.cnsmr_accnt_id, base.crdtr_id, base.cnsmr_accnt_plcmnt_date, base.cnsmr_accnt_idntfr_agncy_id");
            sql.Append(") as ca INNER JOIN");
            sql.Append("    cnsmr c on ca.cnsmr_id = c.cnsmr_id LEFT JOIN");
            sql.Append("    (");
            sql.Append("        SELECT");
            sql.Append("            cnsmr_accnt_id,");
            sql.Append("            summary_code");
            sql.Append("        FROM");
            sql.Append("            [CRS_Interface].[dbo].[vw_Debtor]");
            sql.Append("        GROUP BY cnsmr_accnt_id, summary_code");
            sql.Append("    ) v on ca.cnsmr_accnt_id = v.cnsmr_accnt_id ");

            var indexDebtorDto = db.Database.SqlQuery<IndexDebtor>(string.Format(sql.ToString(), id))
                .Select(d => new IndexDebtorDto(d))
                .SingleOrDefault();

            debtorAccount.CurrentBalance = indexDebtorDto.CurrentBalance;
            debtorAccount.PlacementDate = indexDebtorDto.PlacementDate;
            debtorAccount.Status = indexDebtorDto.Status;
            debtorAccount.TotalOriginalBalance = indexDebtorDto.TotalOriginalBalance;
            debtorAccount.TotalPayment = indexDebtorDto.TotalPayment;

            return debtorAccount;
        }
    }
}