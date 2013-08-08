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
    public class ContactsControllerTest
    {
        private const Int32 id = 2174623;
        private const string phone = "9035269228";

        // Mock up test Http requests
        private static void SetupControllerForTests(ApiController controller)
        {
            var config = new HttpConfiguration();
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/Contacts");
            var route = config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary { { "controller", "Contacts" } });

            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            controller.Request.Properties.Add(HttpPropertyKeys.HttpRouteDataKey, routeData);
        }

        [TestMethod]
        public void Get()
        {
            // Arrange
            ContactsController controller = new ContactsController();

            // Act
            var result = controller.GetContacts();

            // Assert
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GetById()
        {
            // Arrange
            ContactsController controller = new ContactsController();

            // Act
            var result = controller.GetContact(id);

            // Assert
            Assert.AreEqual(phone, result.Phone);
        }

        [TestMethod]
        public void Post()
        {
            // Arrange
            //ContactsController controller = new ContactsController();

            //// Act
            //Debtor debtor = new Debtor();


            //controller.PostDebtor("value");

            // Assert

        }

        [TestMethod]
        public void Put()
        {
            // Arrange
            ContactsController controller = new ContactsController();
            SetupControllerForTests(controller);

            // Act
            var contact = controller.GetContact(id);

            string phone = contact.Phone;
            contact.Phone = "0000000000";

            controller.PutContact(id, contact);
            contact = null;

            // Assert
            var result = controller.GetContact(id);
            Assert.AreEqual("0000000000", result.Phone);

            result.Phone = phone;
            controller.PutContact(id, result);
            result = null;

            contact = controller.GetContact(id);
            Assert.AreEqual(phone, contact.Phone);
        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            ContactsController controller = new ContactsController();

            // Act
            //controller.DeleteDebtor(5);

            // Assert
            Assert.IsTrue(true);
        }
    }
}
