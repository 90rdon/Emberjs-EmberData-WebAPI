using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class DebtorAccountsController : BaseApiController<DebtorAccount, DebtorAccountDto, Int64>
    {
        public DebtorAccountsController() { Includes = new[] { "Debtor" }; }
    }
}