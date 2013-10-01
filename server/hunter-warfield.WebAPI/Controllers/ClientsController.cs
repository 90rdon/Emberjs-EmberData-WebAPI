using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;
using hunter_warfield.Data.Repositories;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class ClientsController : BaseApiController<Client, ClientDto, Int64>
    {
        public ClientsController() { Includes = new[] { "Debtors" }; }

        private hwiContext db = new hwiContext();

        public override ClientDto Get(Int64 id)
        {
            string idStr = id.ToString();
            //var result = db.Set<Client>()
            //    .Include("Debtors")
            //    .SingleOrDefault(s => s.LegacyId == idStr);

            //var returnResult = new ClientDto(result);

            //return returnResult;

            return GetObject(DataStore.Find<Client>(t => t.LegacyId == idStr, new[] { "Debtors" }));
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