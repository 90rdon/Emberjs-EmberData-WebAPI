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
    public class DebtorsControllerTest
    {
        private const Int32 id = 4103752;
        private const string first = "Joseph";
        private const string last = "Best";

        // Mock up test Http requests
        private static void SetupControllerForTests(ApiController controller)
        {
            var config = new HttpConfiguration();
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/debtors");
            var route = config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary { { "controller", "debtors" } });

            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            controller.Request.Properties.Add(HttpPropertyKeys.HttpRouteDataKey, routeData);
        }

        [TestMethod]
        public void GetDebtorsDto()
        {
            // Arrange
            DebtorsController controller = new DebtorsController();

            // Act
            var result = controller.Get();

            // Assert
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GetDebtorsById()
        {
            // Arrange
            DebtorsController controller = new DebtorsController();

            // Act
            var result = controller.Get(id);

            // Assert
            Assert.AreEqual(first, result.FirstName);
            Assert.AreEqual(last, result.LastName);
        }

        [TestMethod]
        public void PostDebtors()
        {
            // Arrange
            //DebtorsController controller = new DebtorsController();

            //// Act
            //Debtor debtor = new Debtor();


            //controller.PostDebtor("value");

            // Assert

        }

        [TestMethod]
        public void PutDebtors()
        {
            // Arrange
            DebtorsController controller = new DebtorsController();
            SetupControllerForTests(controller);

            // Act
            var debtor = controller.Get(id);

            string middleName = debtor.MiddleName;
            debtor.MiddleName = "Test";

            controller.Put(debtor);
            debtor = null;

            // Assert
            var result = controller.Get(id);
            Assert.AreEqual("Test", result.MiddleName);

            result.MiddleName = middleName;
            controller.Put(result);
            result = null;

            debtor = controller.Get(id);
            Assert.AreEqual(middleName, debtor.MiddleName);
        }

        //[TestMethod]
        //public void DeleteDebtors()
        //{
        //    // Arrange
        //    DebtorsController controller = new DebtorsController();

        //    // Act
        //    //controller.DeleteDebtor(5);

        //    // Assert
        //    Assert.IsTrue(true);
        //}
    }
}
