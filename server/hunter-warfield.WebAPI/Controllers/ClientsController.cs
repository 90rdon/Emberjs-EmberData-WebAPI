﻿using System;
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
            var result = db.Set<Client>()
                .Include("Debtors")
                .SingleOrDefault(s => s.LegacyId == idStr);

            var returnResult = new ClientDto(result);

            return returnResult;
        }
    }
}