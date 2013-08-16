using System;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class ContactsController : BaseApiController<Contact, ContactDto, Int64>
    {
        public ContactsController() { }
    }
}