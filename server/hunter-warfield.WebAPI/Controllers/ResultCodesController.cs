using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class ResultCodesController : BaseApiController<ResultCode, ResultCodeDto, Int16>
    {
        public ResultCodesController() {  }
    }
}