using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class CountriesController : BaseApiController<Country, CountryDto, Int16>
    {
        public CountriesController() { }
    }
}