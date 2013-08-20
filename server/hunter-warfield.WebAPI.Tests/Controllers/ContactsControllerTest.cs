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
        public void GetContactsDto()
        {
            // Arrange
            ContactsController controller = new ContactsController();

            // Act
            var result = controller.Get();

            // Assert
            Assert.IsNotNull(result.FirstOrDefault().Phone);
        }

        [TestMethod]
        public void GetContactsDtoById()
        {
            // Arrange
            ContactsController controller = new ContactsController();

            // Act
            var result = controller.Get(id);

            // Assert
            Assert.AreEqual(phone, result.Phone);
        }

        [TestMethod]
        public void PostContactsDto()
        {
            // Arrange
            ContactsController controller = new ContactsController();
            SetupControllerForTests(controller);

            //// Act
            var contact = new ContactDto();
            contact.Consent = "Y";
            contact.Country = 231;
            contact.DebtorId = 4103752;
            contact.Phone = "987654321";
            contact.Extension = "987";
            contact.Type = 1;
            contact.Score = 1;

            var result = controller.Post(contact);

            // Assert
            Assert.IsTrue(result != null);
        }

        [TestMethod]
        public void PutContactsDto()
        {
            // Arrange
            ContactsController controller = new ContactsController();
            SetupControllerForTests(controller);

            // Act
            var contact = controller.Get(id);

            string phone = contact.Phone;
            contact.Phone = "0000000000";

            controller.Put(contact);
            contact = null;

            // Assert
            var result = controller.Get(id);
            Assert.AreEqual("0000000000", result.Phone);

            result.Phone = phone;
            controller.Put(result);
            result = null;

            contact = controller.Get(id);
            Assert.AreEqual(phone, contact.Phone);
        }

        [TestMethod]
        public void DeleteContactsDto()
        {
            // Arrange
            ContactsController controller = new ContactsController();
            SetupControllerForTests(controller);

            // Act
            var contact = new ContactDto();
            contact.Consent = "Y";
            contact.Country = 231;
            contact.DebtorId = 4103752;
            contact.Phone = "987654321";
            contact.Extension = "987";
            contact.Type = 1;
            contact.Score = 1;

            var added = controller.Post(contact);
            var id = added.Id;

            controller.Delete(added);

            var result = controller.Get(id);

            // Assert
            Assert.IsTrue(result.Id > 0);
        }
    }
}
