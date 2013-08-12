using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Routing;
using Newtonsoft.Json.Serialization;

namespace hunter_warfield.WebAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Uncomment the following line of code to enable query support for actions with an IQueryable or IQueryable<T> return type.
            // To avoid processing unexpected or malicious queries, use the validation settings on QueryableAttribute to validate incoming queries.
            // For more information, visit http://go.microsoft.com/fwlink/?LinkId=279712.
            //config.EnableQuerySupport();

            // To disable tracing in your application, please comment out or remove the following line of code
            // For more information, refer to: http://www.asp.net/web-api
            config.EnableSystemDiagnosticsTracing();

            // Use camel case for JSON data.
            //config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // default to JSON
            //var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            //config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.Objects;
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            //DECLARE REGEX PATTERNS
            string alphanumeric = @"^[a-zA-Z]+[a-zA-Z0-9_]*$";
            string numeric = @"^\d+$";

            //FOR GENERIC API'S
            config.Routes.MapHttpRoute(
                name: "DefaultApiControllerActionId",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: null,
                constraints: new { action = alphanumeric, id = numeric } // action must start with character
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApiControllerActionName",
                routeTemplate: "api/{controller}/{action}/{name}",
                defaults: null,
                constraints: new { action = alphanumeric, name = alphanumeric } // action and name must start with character
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApiControllerId",
                routeTemplate: "api/{controller}/{id}",
                defaults: null,
                constraints: new { id = numeric } // id must be all digits
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApiControllerAction",
                routeTemplate: "api/{controller}/{action}",
                defaults: null,
                constraints: new { action = alphanumeric } // action must start with character
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApiControllerGet",
                routeTemplate: "api/{controller}",
                defaults: new { action = "Get" },
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Get) }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApiControllerPost",
                routeTemplate: "api/{controller}",
                defaults: new { action = "Post" },
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Post) }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApiControllerPut",
                routeTemplate: "api/{controller}",
                defaults: new { action = "Put" },
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Put) }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApiControllerDelete",
                routeTemplate: "api/{controller}",
                defaults: new { action = "Delete" },
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Delete) }
            );
        }
    }
}
