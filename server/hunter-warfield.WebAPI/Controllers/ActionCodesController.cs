using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class ActionCodesController : BaseApiController<ActionCode, ActionCodeDto, Int16>
    {
        public ActionCodesController() {  }
    }
}