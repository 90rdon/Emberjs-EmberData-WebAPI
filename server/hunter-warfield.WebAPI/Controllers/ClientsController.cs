using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class ClientsController : BaseApiController<Client, ClientDto, Int64>
    {
        public ClientsController() { Includes = new[] { "Debtors" }; }
    }
}