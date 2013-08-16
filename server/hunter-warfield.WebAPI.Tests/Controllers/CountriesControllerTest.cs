using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Routing;
using System.Web.Http.Controllers;
using System.Web.Http.Hosting;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using hunter_warfield.Core.Domain;
using hunter_warfield.WebAPI;
using hunter_warfield.WebAPI.Controllers;

namespace hunter_warfield.server.Tests.Controllers
{
    [TestClass]
    public class CountriesControllerTest
    {
        private const Int64 id = 159;

        // Mock up test Http requests
        private static void SetupControllerForTests(ApiController controller)
        {
            var config = new HttpConfiguration();
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/Countries");
            var route = config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary { { "controller", "Countries" } });

            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            controller.Request.Properties.Add(HttpPropertyKeys.HttpRouteDataKey, routeData);
        }

        [TestMethod]
        public void GetCountriesDto()
        {
            // Arrange
            CountriesController controller = new CountriesController();

            // Act
            var result = controller.Get();

            // Assert
            Assert.IsNotNull(result.FirstOrDefault().Id);
        }
    }
}
