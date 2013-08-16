using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class PersonsController : BaseApiController<Person, PersonDto, Int64>
    {
        public PersonsController() { }
    }
}