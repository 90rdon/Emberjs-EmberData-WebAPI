using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;
using System.Web.Http;
using System.Net;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;
using hunter_warfield.Data.Repositories;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class ClientDebtorsController : ApiController
    {
        public ClientDebtorsController() { }

        private hwiContext db = new hwiContext();

        public IEnumerable<IndexDebtorDto> Get(Int64 id, Int32 page = 1, Int32 limit = 50)
        {
            Int32 startIndex = (page - 1) * limit + 1;
            Int32 endIndex= page * limit;

            string idStr = id.ToString();
            Client client = db.Set<Client>()
                .SingleOrDefault(s => s.LegacyId == idStr);

            //var result = db.Set<ClientDebtor>()
            //    .Where(s => s.ClientId == client.Id)
            //    .AsEnumerable()
            //    .Select(d => new ClientDebtorDto(d));

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
            sql.Append("        SUM(base.TotalPayment) as TotalPayment,");
            sql.Append("        ROW_NUMBER() OVER");
            sql.Append("            (ORDER BY base.cnsmr_accnt_plcmnt_date DESC) AS RN");
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
            sql.Append("        WHERE cab.bal_nm_id in (2, 3, 6) AND ca.crdtr_id = {0}");
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
            sql.Append("WHERE ca.RN between {1} and {2} ");
            sql.Append("ORDER BY ca.cnsmr_accnt_plcmnt_date DESC");
    

            //using (var db = new hwiContext())
            //{
            //    var result = db.Database.SqlQuery<string>(string.Format(sql.ToString(), data));

            //    return result.ToList().First().ToString();
            //}

            //var returnResult = new DebtorDto(result);

            //var indexClientDto = new IndexClientDto(client);

            var indexDebtorDto = db.Database.SqlQuery<IndexDebtor>(string.Format(sql.ToString(), client.Id, startIndex, endIndex))
                .AsEnumerable()
                .Select(d => new IndexDebtorDto(d));

            return indexDebtorDto;
        }
    }
}

//public IEnumerable<DebtorDto> Get(Int64 id)
//{

//    string idStr = id.ToString();
//    var client = db.Set<Client>()
//        .SingleOrDefault(s => s.LegacyId == idStr);

//    var result = db.Set<Debtor>()
//        .Where(s => s.ClientId == client.Id)
//        .AsEnumerable()
//        .Select(d => new DebtorDto(d));

//    //var returnResult = new DebtorDto(result);

//    return result;
//}