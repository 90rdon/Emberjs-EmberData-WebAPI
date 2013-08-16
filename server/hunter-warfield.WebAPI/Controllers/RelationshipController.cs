using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class RelationshipsController : BaseApiController<Relationship, RelationshipDto, Int16>
    {
        public RelationshipsController() { }
    }
}