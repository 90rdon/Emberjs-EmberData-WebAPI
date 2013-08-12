using System.Collections;
using System.Linq;
using System.Web.Mvc;

using hunter_warfield.Core.Interfaces;
using hunter_warfield.Data.Repositories;

namespace hunter_warfield.WebAPI.Helpers
{
    public class BaseController : Controller
    {
        protected IGenericRepository DataStore { get; set; }

        public BaseController()
        {
            //TODO: USE DEPENDENCY INJECTION FOR DECOUPLING
            this.DataStore = new EFRepository();
        }

        protected IEnumerable GetModelErrors()
        {
            return this.ModelState.SelectMany(x => x.Value.Errors.Select(error => error.ErrorMessage));
        }
    }
}