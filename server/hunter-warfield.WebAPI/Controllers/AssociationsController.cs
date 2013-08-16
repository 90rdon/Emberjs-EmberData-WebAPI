using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class AssociationsController : BaseApiController<Association, AssociationDto, Int16>
    {
        public AssociationsController() { }
    }
}