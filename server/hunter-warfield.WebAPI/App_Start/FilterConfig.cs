using System.Web;
using System.Web.Mvc;

using hunter_warfield.WebAPI.Filters;

namespace hunter_warfield.WebAPI
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}