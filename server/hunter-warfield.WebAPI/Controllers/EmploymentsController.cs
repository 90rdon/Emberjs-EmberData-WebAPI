using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class EmploymentsController : BaseApiController<Employment, EmploymentDto>
    {
        public EmploymentsController() { }
    }
}