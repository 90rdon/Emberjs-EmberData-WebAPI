using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;
using hunter_warfield.Data.Repositories;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class ClientsController : BaseApiController<Client, ClientDto, Int64>
    {
        public ClientsController() { Includes = new[] { "ClientDebtors" }; }

        private hwiContext db = new hwiContext();

        //public override ClientDto Get(Int64 id)
        //{
        //    string idStr = id.ToString();

        //    var result = GetObject(DataStore.Find<Client>(t => t.LegacyId == idStr, new[] { "ClientDebtors" }));


        //    return result;
        //}

        public override ClientDto Get(Int64 id)
        {

            string idStr = id.ToString();
            Client client = db.Set<Client>()
                .SingleOrDefault(s => s.LegacyId == idStr);

            //var result = db.Set<ClientDebtor>()
            //    .Where(s => s.ClientId == client.Id)
            //    .AsEnumerable()
            //    .Select(d => new ClientDebtorDto(d));

            StringBuilder sql = new StringBuilder();
            sql.Append("SELECT");
            sql.Append("    ca.cnsmr_id as Id,");
            sql.Append("    ca.cnsmr_accnt_id as AccountId,");
            sql.Append("    ca.TotalOriginalBalance,");
            sql.Append("    ca.CurrentBalance,");
            sql.Append("    ca.TotalPayment,");
            sql.Append("    ca.crdtr_id as ClientId,");
            sql.Append("    c.cnsmr_nm_prfx_txt as Title,");
            sql.Append("    c.cnsmr_nm_lst_txt as LastName,");
            sql.Append("    c.cnsmr_nm_frst_txt as FirstName,");
            sql.Append("    c.cnsmr_nm_mddl_txt as MiddleName,");
            sql.Append("    c.cnsmr_nm_sffx_txt as Suffix");
            sql.Append(" FROM ");
            sql.Append("( ");
            sql.Append("    SELECT");
            sql.Append("        base.cnsmr_id,");
            sql.Append("        base.cnsmr_accnt_id,");
            sql.Append("        base.crdtr_id,");
            sql.Append("        SUM(base.TotalOriginalBalance) as TotalOriginalBalance,");
            sql.Append("        SUM(base.CurrentBalance) as CurrentBalance,");
            sql.Append("        SUM(base.TotalPayment) as TotalPayment");
            sql.Append("    FROM");
            sql.Append("    (");
            sql.Append("        SELECT");
            sql.Append("            c.cnsmr_id,");
            sql.Append("            ca.cnsmr_accnt_id,");
            sql.Append("            ca.crdtr_id,");
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
            sql.Append("    GROUP BY base.cnsmr_id, base.cnsmr_accnt_id, base.crdtr_id");
            sql.Append(") as ca INNER JOIN");
            sql.Append("    cnsmr c on ca.cnsmr_id = c.cnsmr_id");


            //using (var db = new hwiContext())
            //{
            //    var result = db.Database.SqlQuery<string>(string.Format(sql.ToString(), data));

            //    return result.ToList().First().ToString();
            //}

            //var returnResult = new DebtorDto(result);

            var clientDto = new ClientDto(client);

            var clientDebtorsDto = db.Database.SqlQuery<ClientDebtor>(string.Format(sql.ToString(), client.Id))
                .AsEnumerable()
                .Select(d => new ClientDebtorDto(d));

            clientDto.ClientDebtors.AddRange(clientDebtorsDto);

            return clientDto;
        }

        private ClientDto GetObject(params Client[] arg)
        {
            return (ClientDto)Activator.CreateInstance(typeof(ClientDto), arg);
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