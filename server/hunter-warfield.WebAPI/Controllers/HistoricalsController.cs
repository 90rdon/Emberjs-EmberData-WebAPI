using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class HistoricalsController : BaseApiController<Historical, HistoricalDto, Int64>
    {
        public HistoricalsController() { }
    }
}